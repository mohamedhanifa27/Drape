/**
 * Hanifa Textiles - Wishlist Manager
 * Handles localStorage wishlist persistence, heart pop animations,
 * counter badges, and "Move to Cart" logic.
 */

const Wishlist = {
  STORAGE_KEY: "hanifa_wishlist",

  /**
   * Get all product IDs in wishlist
   */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading wishlist", e);
      return [];
    }
  },

  /**
   * Save wishlist back to storage and update badges
   */
  saveItems(ids) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("wishlist:updated", { detail: { ids } }));
    } catch (e) {
      console.error("Error saving wishlist", e);
    }
  },

  /**
   * Check if a product is in wishlist
   */
  isInWishlist(productId) {
    return this.getItems().includes(productId);
  },

  /**
   * Toggle product in/out of wishlist with heart burst effect
   */
  toggle(product, heartEl = null) {
    let items = this.getItems();
    const id = typeof product === "string" ? product : product.id;
    const exists = items.includes(id);

    if (exists) {
      items = items.filter(itemId => itemId !== id);
      this.saveItems(items);
      if (heartEl) heartEl.classList.remove("active");
      if (window.App && typeof window.App.showToast === "function") {
        window.App.showToast("Removed from your Wishlist", "info");
      }
    } else {
      items.push(id);
      this.saveItems(items);
      if (heartEl) {
        heartEl.classList.add("active", "heart-pop");
        setTimeout(() => heartEl.classList.remove("heart-pop"), 600);
      }
      if (window.App && typeof window.App.showToast === "function") {
        window.App.showToast(`Saved "${product.name || "item"}" to your Wishlist!`, "success");
      }
    }

    // Refresh any active heart buttons matching this ID on the page
    document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(btn => {
      if (items.includes(id)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Remove from Wishlist");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Add to Wishlist");
      }
    });

    return !exists;
  },

  /**
   * Remove item from wishlist
   */
  remove(productId) {
    const items = this.getItems().filter(id => id !== productId);
    this.saveItems(items);
    if (window.App && typeof window.App.showToast === "function") {
      window.App.showToast("Removed from your Wishlist", "info");
    }
  },

  /**
   * Move item from wishlist to cart
   */
  moveToCart(productId, size = null, color = null) {
    if (!window.PRODUCTS) return;
    const product = window.PRODUCTS.find(p => p.id === productId);
    if (product && window.Cart) {
      window.Cart.addItem(product, size, color, 1);
      this.remove(productId);
      if (window.App && typeof window.App.showToast === "function") {
        window.App.showToast(`Moved "${product.name}" to your shopping bag!`, "success");
      }
    }
  },

  /**
   * Update all badge counters across headers
   */
  updateBadges() {
    const count = this.getItems().length;
    const badges = document.querySelectorAll(".wishlist-badge-count");
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
      badge.classList.remove("badge-bounce");
      void badge.offsetWidth;
      badge.classList.add("badge-bounce");
    });
  }
};

// Global init on load
if (typeof window !== "undefined") {
  window.Wishlist = Wishlist;
  document.addEventListener("DOMContentLoaded", () => {
    Wishlist.updateBadges();
  });
}
