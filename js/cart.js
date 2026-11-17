/**
 * Hanifa Textiles - Cart Manager
 * Handles localStorage state, coupon validation, drawer slide-in sync,
 * quantity adjustments, and pricing calculations.
 */

const Cart = {
  STORAGE_KEY: "hanifa_cart",
  COUPON_KEY: "hanifa_active_coupon",

  /**
   * Retrieve all items currently in cart
   */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading cart from localStorage", e);
      return [];
    }
  },

  /**
   * Save items back to localStorage and trigger sync events
   */
  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.updateBadges();
      this.renderDrawer();
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { items } }));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  },

  /**
   * Unique identifier based on product ID, selected size, and color
   */
  getItemKey(id, size, color) {
    return `${id}__${size || "Standard"}__${color || "Default"}`;
  },

  /**
   * Add a product to the cart with fly-to-cart animation
   */
  addItem(product, size = null, color = null, quantity = 1, triggerEl = null) {
    const items = this.getItems();
    const finalSize = size || (product.sizes && product.sizes[0]) || "Standard";
    const finalColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");
    const key = this.getItemKey(product.id, finalSize, finalColor);

    const existingIndex = items.findIndex(item => item.key === key);
    if (existingIndex > -1) {
      items[existingIndex].quantity += Number(quantity);
    } else {
      items.push({
        key,
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: Number(product.price),
        mrp: Number(product.mrp || product.price),
        image: (product.images && product.images[0]) || "",
        size: finalSize,
        color: finalColor,
        quantity: Number(quantity)
      });
    }

    this.saveItems(items);

    // Optional visual fly-to-cart animation
    if (triggerEl && typeof this.animateFlyToCart === "function") {
      this.animateFlyToCart(triggerEl);
    }

    if (window.App && typeof window.App.showToast === "function") {
      window.App.showToast(`Added "${product.name}" to your bag!`, "success");
    }

    // Auto-open drawer if requested
    this.openDrawer();
  },

  /**
   * Update quantity of a specific item key
   */
  updateQuantity(key, newQty) {
    let items = this.getItems();
    const qty = Number(newQty);
    if (qty <= 0) {
      this.removeItem(key);
      return;
    }
    const target = items.find(item => item.key === key);
    if (target) {
      target.quantity = qty;
      this.saveItems(items);
    }
  },

  /**
   * Remove item from cart
   */
  removeItem(key) {
    const items = this.getItems().filter(item => item.key !== key);
    this.saveItems(items);
    if (window.App && typeof window.App.showToast === "function") {
      window.App.showToast("Item removed from your shopping bag.", "info");
    }
  },

  /**
   * Clear all cart contents
   */
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.COUPON_KEY);
    this.saveItems([]);
  },

  /**
   * Get active coupon if any
   */
  getActiveCoupon() {
    try {
      const saved = localStorage.getItem(this.COUPON_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Apply coupon code from config
   */
  applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    const coupons = (window.CONFIG && window.CONFIG.COUPONS) || {};
    const coupon = coupons[cleanCode];

    if (!coupon) {
      return { success: false, message: "Invalid promo code. Please check and retry." };
    }

    const totals = this.getTotals(false);
    if (totals.subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Coupon "${cleanCode}" requires a minimum purchase of ₹${coupon.minOrder}.`
      };
    }

    const couponData = {
      code: cleanCode,
      discountType: coupon.discountType,
      value: coupon.value,
      minOrder: coupon.minOrder,
      description: coupon.description
    };

    localStorage.setItem(this.COUPON_KEY, JSON.stringify(couponData));
    this.saveItems(this.getItems());
    return { success: true, message: `Promo code "${cleanCode}" applied successfully!`, coupon: couponData };
  },

  /**
   * Remove active coupon
   */
  removeCoupon() {
    localStorage.removeItem(this.COUPON_KEY);
    this.saveItems(this.getItems());
  },

  /**
   * Compute subtotal, discounts, delivery and grand total
   */
  getTotals(includeDelivery = true, distanceKm = 4) {
    const items = this.getItems();
    let subtotal = 0;
    let mrpTotal = 0;
    let itemCount = 0;

    items.forEach(item => {
      subtotal += item.price * item.quantity;
      mrpTotal += item.mrp * item.quantity;
      itemCount += item.quantity;
    });

    let discount = 0;
    const activeCoupon = this.getActiveCoupon();
    if (activeCoupon && subtotal >= (activeCoupon.minOrder || 0)) {
      if (activeCoupon.discountType === "percentage") {
        discount = Math.round((subtotal * activeCoupon.value) / 100);
      } else {
        discount = Math.min(subtotal, activeCoupon.value);
      }
    } else if (activeCoupon) {
      // Order dropped below minOrder threshold
      this.removeCoupon();
    }

    let deliveryFee = 0;
    if (includeDelivery && items.length > 0) {
      if (window.DeliveryEngine) {
        deliveryFee = window.DeliveryEngine.getDeliveryCharge(distanceKm, subtotal).charge;
      } else {
        deliveryFee = subtotal >= 999 ? 0 : 40;
      }
    }

    const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
    const totalSavings = (mrpTotal - subtotal) + discount;

    return {
      itemCount,
      mrpTotal,
      subtotal,
      discount,
      coupon: activeCoupon,
      deliveryFee,
      grandTotal,
      totalSavings
    };
  },

  /**
   * Update badge counts across all headers/drawers
   */
  updateBadges() {
    const count = this.getItems().reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll(".cart-badge-count");
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
      badge.classList.remove("badge-bounce");
      void badge.offsetWidth; // force reflow
      badge.classList.add("badge-bounce");
    });
  },

  /**
   * Render the sliding Cart Drawer
   */
  renderDrawer() {
    const drawerContainer = document.getElementById("cartDrawerContent");
    if (!drawerContainer) return;

    const items = this.getItems();
    const totals = this.getTotals(false);
    const freeDeliveryThreshold = (window.CONFIG && window.CONFIG.FREE_DELIVERY_THRESHOLD) || 999;
    const amountNeededForFree = Math.max(0, freeDeliveryThreshold - totals.subtotal);
    const progressPercent = Math.min(100, Math.round((totals.subtotal / freeDeliveryThreshold) * 100));

    if (items.length === 0) {
      drawerContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon-wrap">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h4 class="empty-title">Your shopping bag is empty</h4>
          <p class="empty-desc">Explore our handpicked Madurai nighties, Ramraj shirts, and family textiles.</p>
          <a href="shop.html" class="btn btn-primary btn-pill">Start Shopping</a>
        </div>
      `;
      return;
    }

    let itemsHtml = items.map(item => `
      <div class="cart-drawer-item" data-key="${item.key}">
        <img src="${item.image}" alt="${item.name}" class="drawer-item-img" loading="lazy" onerror="this.src='assets/images/logo.png'">
        <div class="drawer-item-details">
          <div class="drawer-item-brand">${window.Brands ? window.Brands.renderMiniIcon(item.brand, 13) : ""}<span>${item.brand}</span></div>
          <h5 class="drawer-item-name">${item.name}</h5>
          <div class="drawer-item-meta">
            <span>Size: <strong>${item.size}</strong></span>
            <span>Color: <strong>${item.color}</strong></span>
          </div>
          <div class="drawer-item-pricing">
            <span class="drawer-item-price">₹${item.price}</span>
            ${item.mrp > item.price ? `<span class="drawer-item-mrp">₹${item.mrp}</span>` : ""}
          </div>
          <div class="drawer-item-actions">
            <div class="qty-stepper">
              <button type="button" class="qty-btn minus" onclick="Cart.updateQuantity('${item.key}', ${item.quantity - 1})">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn plus" onclick="Cart.updateQuantity('${item.key}', ${item.quantity + 1})">+</button>
            </div>
            <button type="button" class="drawer-remove-btn" onclick="Cart.removeItem('${item.key}')" title="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    drawerContainer.innerHTML = `
      <!-- Free Delivery Progress Bar -->
      <div class="free-shipping-progress">
        <div class="progress-message">
          ${amountNeededForFree > 0 
            ? `Add <strong>₹${amountNeededForFree}</strong> more for <strong>FREE Delivery!</strong>`
            : `<span class="free-qualified-badge">🎉 Congratulations! You unlocked <strong>FREE Delivery!</strong></span>`
          }
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <!-- Item List -->
      <div class="drawer-items-list">
        ${itemsHtml}
      </div>

      <!-- Footer Summary -->
      <div class="drawer-footer">
        <div class="drawer-summary-row">
          <span>Subtotal (${totals.itemCount} items)</span>
          <span class="summary-subtotal">₹${totals.subtotal}</span>
        </div>
        ${totals.discount > 0 ? `
          <div class="drawer-summary-row discount-row">
            <span>Coupon (${totals.coupon.code})</span>
            <span class="text-success">-₹${totals.discount}</span>
          </div>
        ` : ""}
        <div class="drawer-summary-row total-row">
          <span>Estimated Total</span>
          <span class="summary-grand-total">₹${totals.grandTotal}</span>
        </div>
        <div class="drawer-ctas">
          <a href="checkout.html" class="btn btn-primary btn-block btn-pill checkout-btn">
            Proceed to Checkout →
          </a>
          <a href="cart.html" class="btn btn-outline btn-block btn-pill view-bag-btn">
            View Full Cart & Coupons
          </a>
        </div>
      </div>
    `;
  },

  /**
   * Open the slide-in drawer
   */
  openDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.classList.add("drawer-open");
      this.renderDrawer();
    }
  },

  /**
   * Close the slide-in drawer
   */
  closeDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("drawer-open");
    }
  },

  /**
   * Fly to cart animation
   */
  animateFlyToCart(triggerEl) {
    const cartIcon = document.querySelector(".nav-cart-trigger");
    if (!triggerEl || !cartIcon) return;

    const startRect = triggerEl.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    const flyingDot = document.createElement("div");
    flyingDot.className = "flying-cart-dot";
    flyingDot.style.left = `${startRect.left + startRect.width / 2}px`;
    flyingDot.style.top = `${startRect.top + startRect.height / 2}px`;
    document.body.appendChild(flyingDot);

    requestAnimationFrame(() => {
      flyingDot.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.2)`;
      flyingDot.style.opacity = "0";
    });

    setTimeout(() => {
      flyingDot.remove();
    }, 600);
  }
};

// Global init on load
if (typeof window !== "undefined") {
  window.Cart = Cart;
  document.addEventListener("DOMContentLoaded", () => {
    Cart.updateBadges();
  });
}
