/**
 * Hanifa Textiles - Product Detail Page Controller
 * Handles image zoom lens, thumbnail switching, variant selections,
 * live pincode check, tab navigation, and related items.
 */

const ProductDetail = {
  product: null,
  selectedSize: "",
  selectedColor: "",
  quantity: 1,

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || "nt-01"; // Fallback to first nighty if none specified

    if (!window.PRODUCTS) return;
    this.product = window.PRODUCTS.find(p => p.id === productId || (productId === "ht-n-001" && p.id === "nt-01")) || window.PRODUCTS[0];

    if (!this.product) {
      window.location.href = "shop.html";
      return;
    }

    this.selectedSize = this.product.sizes ? this.product.sizes[0] : "Standard";
    this.selectedColor = this.product.colors && this.product.colors[0] ? this.product.colors[0].name : "Standard";
    this.quantity = 1;

    this.renderDetails();
    this.initGalleryZoom();
    this.initPincodeChecker();
    this.initTabs();
    this.renderRelatedProducts();
    this.updateBreadcrumbs();
  },

  updateBreadcrumbs() {
    const titleEl = document.getElementById("breadcrumbTitle");
    const catLink = document.getElementById("breadcrumbCategory");
    if (titleEl) titleEl.textContent = this.product.name;
    if (catLink) {
      catLink.textContent = this.product.category;
      catLink.href = `shop.html?category=${encodeURIComponent(this.product.category)}`;
    }
    document.title = `${this.product.name} | Drape Madurai`;
  },

  renderDetails() {
    const p = this.product;

    // Title, Brand, Category
    const brandEl = document.getElementById("pdpBrand");
    const titleEl = document.getElementById("pdpTitle");
    if (brandEl) brandEl.textContent = p.brand;
    if (titleEl) titleEl.textContent = p.name;

    // Rating
    const ratingNum = document.getElementById("pdpRatingNum");
    const reviewsCount = document.getElementById("pdpReviewsCount");
    if (ratingNum) ratingNum.textContent = p.rating;
    if (reviewsCount) reviewsCount.textContent = `(${p.reviewsCount} customer reviews)`;

    // Pricing
    const priceEl = document.getElementById("pdpCurrentPrice");
    const mrpEl = document.getElementById("pdpMrpPrice");
    const discountEl = document.getElementById("pdpDiscountBadge");
    const savingsEl = document.getElementById("pdpSavingsText");

    if (priceEl) priceEl.textContent = `₹${p.price}`;
    if (mrpEl) {
      if (p.mrp > p.price) {
        mrpEl.textContent = `₹${p.mrp}`;
        mrpEl.style.display = "inline";
      } else {
        mrpEl.style.display = "none";
      }
    }
    if (discountEl) {
      if (p.discount > 0) {
        discountEl.textContent = `${p.discount}% OFF`;
        discountEl.style.display = "inline-block";
      } else {
        discountEl.style.display = "none";
      }
    }
    if (savingsEl && p.mrp > p.price) {
      savingsEl.textContent = `You save ₹${p.mrp - p.price} on this authentic piece.`;
    }

    // Stock Indicator
    const stockEl = document.getElementById("pdpStockIndicator");
    if (stockEl) {
      if (p.stock <= 5) {
        stockEl.innerHTML = `<span class="stock-badge low">⚠️ Hurry! Only ${p.stock} left in stock at our Madurai store.</span>`;
      } else {
        stockEl.innerHTML = `<span class="stock-badge in-stock">✓ In Stock – Ready for immediate dispatch</span>`;
      }
    }

    // Description & Fabric
    const descEl = document.getElementById("pdpShortDesc");
    const fabricEl = document.getElementById("pdpFabricText");
    if (descEl) descEl.textContent = p.description;
    if (fabricEl) fabricEl.innerHTML = `<strong>Fabric:</strong> ${p.fabric}`;

    // Sizes
    const sizesContainer = document.getElementById("pdpSizesContainer");
    const selectedSizeLabel = document.getElementById("pdpSelectedSizeLabel");
    if (sizesContainer && p.sizes) {
      if (selectedSizeLabel) selectedSizeLabel.textContent = this.selectedSize;
      sizesContainer.innerHTML = p.sizes.map((s, idx) => `
        <button type="button" class="size-chip ${idx === 0 ? "selected" : ""}" data-size="${s}">
          ${s}
        </button>
      `).join("");

      sizesContainer.querySelectorAll(".size-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          sizesContainer.querySelectorAll(".size-chip").forEach(c => c.classList.remove("selected"));
          chip.classList.add("selected");
          this.selectedSize = chip.getAttribute("data-size");
          if (selectedSizeLabel) selectedSizeLabel.textContent = this.selectedSize;
        });
      });
    }

    // Colors
    const colorsContainer = document.getElementById("pdpColorsContainer");
    const selectedColorLabel = document.getElementById("pdpSelectedColorLabel");
    if (colorsContainer && p.colors) {
      if (selectedColorLabel) selectedColorLabel.textContent = this.selectedColor;
      colorsContainer.innerHTML = p.colors.map((c, idx) => `
        <button type="button" class="color-swatch ${idx === 0 ? "selected" : ""}" 
                style="background-color: ${c.hex}" title="${c.name}" data-color="${c.name}">
        </button>
      `).join("");

      colorsContainer.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.addEventListener("click", () => {
          colorsContainer.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
          swatch.classList.add("selected");
          this.selectedColor = swatch.getAttribute("data-color");
          if (selectedColorLabel) selectedColorLabel.textContent = this.selectedColor;
        });
      });
    }

    // Gallery Render
    const mainImg = document.getElementById("pdpMainImage");
    const thumbsContainer = document.getElementById("pdpThumbsContainer");
    if (mainImg && p.images && p.images.length > 0) {
      mainImg.src = p.images[0];
      mainImg.alt = p.name;
    }
    if (thumbsContainer && p.images) {
      thumbsContainer.innerHTML = p.images.map((img, idx) => `
        <div class="gallery-thumb ${idx === 0 ? "active" : ""}" data-src="${img}">
          <img src="${img}" alt="${p.name} view ${idx + 1}" loading="lazy" onerror="this.src='assets/images/logo.png'">
        </div>
      `).join("");

      thumbsContainer.querySelectorAll(".gallery-thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
          thumbsContainer.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
          const targetSrc = thumb.getAttribute("data-src");
          if (mainImg) mainImg.src = targetSrc;
        });
      });
    }

    // Quantity Stepper
    const qtyMinus = document.getElementById("pdpQtyMinus");
    const qtyPlus = document.getElementById("pdpQtyPlus");
    const qtyVal = document.getElementById("pdpQtyVal");

    if (qtyMinus) {
      qtyMinus.onclick = () => {
        if (this.quantity > 1) {
          this.quantity--;
          if (qtyVal) qtyVal.textContent = this.quantity;
        }
      };
    }
    if (qtyPlus) {
      qtyPlus.onclick = () => {
        if (this.quantity < (p.stock || 20)) {
          this.quantity++;
          if (qtyVal) qtyVal.textContent = this.quantity;
        } else {
          if (window.App) window.App.showToast(`Maximum available stock is ${p.stock}`, "info");
        }
      };
    }

    // Add to Bag Button
    const addToBagBtn = document.getElementById("pdpAddToBagBtn");
    if (addToBagBtn) {
      addToBagBtn.onclick = () => {
        if (window.Cart) {
          window.Cart.addItem(this.product, this.selectedSize, this.selectedColor, this.quantity, addToBagBtn);
        }
      };
    }

    // Buy Now Button
    const buyNowBtn = document.getElementById("pdpBuyNowBtn");
    if (buyNowBtn) {
      buyNowBtn.onclick = () => {
        if (window.Cart) {
          window.Cart.addItem(this.product, this.selectedSize, this.selectedColor, this.quantity);
          window.location.href = "checkout.html";
        }
      };
    }

    // Wishlist Button
    const wishlistBtn = document.getElementById("pdpWishlistBtn");
    if (wishlistBtn && window.Wishlist) {
      const isSaved = window.Wishlist.isInWishlist(p.id);
      if (isSaved) wishlistBtn.classList.add("active");

      wishlistBtn.onclick = () => {
        window.Wishlist.toggle(this.product, wishlistBtn);
      };
    }

    // Tab content
    const tabDesc = document.getElementById("tabContentDesc");
    const tabFabric = document.getElementById("tabContentFabric");
    if (tabDesc) {
      tabDesc.innerHTML = `
        <p>${p.description}</p>
        <div class="features-checklist">
          <div>✓ Direct from Madurai textile artisans and certified brand partners.</div>
          <div>✓ Colorfast guarantee – retains vibrant tones after repeated washing.</div>
          <div>✓ Double-stitched high-tensile seams for long-lasting comfort.</div>
          <div>✓ Breathable weave optimized for humid and hot South Indian weather.</div>
        </div>
      `;
    }
    if (tabFabric) {
      tabFabric.innerHTML = `
        <div class="fabric-care-grid">
          <div class="fabric-item">
            <h5>Material Composition</h5>
            <p>${p.fabric}</p>
          </div>
          <div class="fabric-item">
            <h5>Washing & Care Instructions</h5>
            <p>${p.care}</p>
          </div>
          <div class="fabric-item">
            <h5>Origin & Weaving</h5>
            <p>Sourced and inspected in Madurai, Tamil Nadu, India.</p>
          </div>
        </div>
      `;
    }
  },

  /**
   * Hover Zoom on Gallery Image
   */
  initGalleryZoom() {
    const mediaContainer = document.querySelector(".pdp-gallery-main");
    const mainImg = document.getElementById("pdpMainImage");
    if (!mediaContainer || !mainImg) return;

    mediaContainer.addEventListener("mousemove", (e) => {
      const rect = mediaContainer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
    });

    mediaContainer.addEventListener("mouseenter", () => {
      mainImg.classList.add("is-zoomed");
    });

    mediaContainer.addEventListener("mouseleave", () => {
      mainImg.classList.remove("is-zoomed");
      mainImg.style.transformOrigin = "center center";
    });
  },

  /**
   * Live Pincode Check with DeliveryEngine
   */
  initPincodeChecker() {
    const input = document.getElementById("pdpPincodeInput");
    const checkBtn = document.getElementById("pdpPincodeCheckBtn");
    const resultBox = document.getElementById("pdpPincodeResult");

    if (!input || !checkBtn || !resultBox) return;

    const doCheck = async () => {
      const pin = input.value.trim();
      if (!pin || pin.length < 6) {
        resultBox.innerHTML = `<span class="text-error">Please enter a valid 6-digit PIN code.</span>`;
        return;
      }

      resultBox.innerHTML = `<span class="checking-spinner">Verifying delivery route from Madurai store...</span>`;

      if (window.DeliveryEngine) {
        const dest = await window.DeliveryEngine.calculateDistance(pin);
        const chargeInfo = window.DeliveryEngine.getDeliveryCharge(dest.distanceKm, this.product.price);
        const eta = window.DeliveryEngine.getEstimatedDeliveryDates(dest.distanceKm);

        resultBox.innerHTML = `
          <div class="pincode-success-card">
            <div class="pincode-row highlight">
              <span class="icon">🚚</span>
              <strong>${eta.formattedSummary}</strong>
            </div>
            <div class="pincode-row">
              <span>Delivery to <strong>${dest.city}</strong> (~${dest.distanceKm} km from Madurai):</span>
              <strong>${chargeInfo.isFree ? "<span class='text-success'>FREE Delivery</span>" : `₹${chargeInfo.charge}`}</strong>
            </div>
            <div class="pincode-row subtitle">
              <span>Dispatched directly from South Masi Street store within 24 hours (excluding Sundays).</span>
            </div>
          </div>
        `;
      }
    };

    checkBtn.addEventListener("click", doCheck);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") doCheck();
    });
  },

  /**
   * Product Info Tabs Navigation
   */
  initTabs() {
    const tabHeaders = document.querySelectorAll(".pdp-tab-header");
    const tabPanels = document.querySelectorAll(".pdp-tab-panel");

    tabHeaders.forEach(header => {
      header.addEventListener("click", () => {
        const target = header.getAttribute("data-tab");
        tabHeaders.forEach(h => h.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));

        header.classList.add("active");
        const activePanel = document.getElementById(`tabContent${target}`);
        if (activePanel) activePanel.classList.add("active");
      });
    });
  },

  /**
   * Render Related Products
   */
  renderRelatedProducts() {
    const container = document.getElementById("pdpRelatedGrid");
    if (!container || !window.PRODUCTS) return;

    const related = window.PRODUCTS
      .filter(p => p.category === this.product.category && p.id !== this.product.id)
      .slice(0, 4);

    if (window.ProductsView) {
      container.innerHTML = related.map(p => window.ProductsView.renderCard(p)).join("");
    }
  }
};

// Auto init on PDP load
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("pdpTitle")) {
    ProductDetail.init();
  }
});

if (typeof window !== "undefined") {
  window.ProductDetail = ProductDetail;
}
