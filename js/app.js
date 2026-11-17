/**
 * Hanifa Textiles - Main Application Controller
 * Handles global UI: Glass navbar, Mobile menu, Toast system, Live search,
 * Preloader, Scroll animations, Quick View Modal, and Newsletter subscription.
 */

const App = {
  init() {
    this.initTheme();
    this.initPreloader();
    this.initNavbar();
    this.initMobileNav();
    this.initLiveSearch();
    this.initScrollReveal();
    this.initQuickViewModal();
    this.initNewsletter();
    this.initCountdownTimers();
    this.initWhatsAppFloating();

    // Sync badges
    if (window.Cart) window.Cart.updateBadges();
    if (window.Wishlist) window.Wishlist.updateBadges();

    console.log("🌟 Drape Platform initialized successfully.");
  },

  /**
   * Light & Dark Theme Switcher
   * Implements 60-30-10 Apple Light and Dark themes with localStorage persistence
   */
  initTheme() {
    const savedTheme = localStorage.getItem("drape_theme") || localStorage.getItem("hanifa_theme");
    const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    this.applyTheme(initialTheme);

    document.querySelectorAll(".theme-toggle-btn, #themeToggleBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.toggleTheme();
      });
    });

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("drape_theme") && !localStorage.getItem("hanifa_theme")) {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      });
    }
  },

  /**
   * Apply Theme (light / dark)
   */
  applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("drape_theme", theme);
    localStorage.setItem("hanifa_theme", theme);

    document.querySelectorAll(".theme-toggle-btn, #themeToggleBtn").forEach(btn => {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme");
      btn.setAttribute("title", theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme");
    });

    window.dispatchEvent(new CustomEvent("theme:changed", { detail: { theme } }));
  },

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
    this.showToast(`Switched to ${newTheme === "dark" ? "Street Dark" : "Warm Light"} Theme`, "info");
  },

  /**
   * Currency Formatter for Indian Rupees (₹)
   */
  formatINR(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  },

  /**
   * Animated Preloader
   */
  initPreloader() {
    const preloader = document.getElementById("sitePreloader");
    if (!preloader) return;

    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 500);
      }, 300);
    });
  },

  /**
   * Glass Navbar on scroll
   */
  initNavbar() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  },

  /**
   * Mobile Navigation Drawer Toggle
   */
  initMobileNav() {
    const menuToggle = document.getElementById("mobileMenuToggle");
    const mobileDrawer = document.getElementById("mobileNavDrawer");
    const mobileOverlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("mobileNavClose");

    const openMenu = () => {
      if (mobileDrawer) mobileDrawer.classList.add("active");
      if (mobileOverlay) mobileOverlay.classList.add("active");
      document.body.classList.add("nav-open");
    };

    const closeMenu = () => {
      if (mobileDrawer) mobileDrawer.classList.remove("active");
      if (mobileOverlay) mobileOverlay.classList.remove("active");
      document.body.classList.remove("nav-open");
    };

    if (menuToggle) menuToggle.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);
  },

  /**
   * Live Search with Instant Dropdown Autocomplete, Suggestions & Keyboard Navigation
   */
  initLiveSearch() {
    const searchInputs = document.querySelectorAll(".header-search-input");
    const searchDropdowns = document.querySelectorAll(".search-results-dropdown");

    searchInputs.forEach((input, index) => {
      const dropdown = searchDropdowns[index] || document.querySelector(".search-results-dropdown");
      if (!dropdown) return;

      const box = input.closest(".header-search-box");
      let clearBtn = box ? box.querySelector(".search-clear-btn") : null;
      if (!clearBtn && box) {
        clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "search-clear-btn";
        clearBtn.setAttribute("aria-label", "Clear search");
        clearBtn.innerHTML = "✕";
        const kbdBtn = box.querySelector(".unlumen-cmd-kbd");
        if (kbdBtn) {
          box.insertBefore(clearBtn, kbdBtn);
        } else {
          box.appendChild(clearBtn);
        }
      }

      let debounceTimer = null;
      let selectedIndex = -1;

      const renderZeroState = () => {
        const getBrandChipIcon = (brandName) => {
          return window.Brands ? `<span class="chip-brand-icon">${window.Brands.getSvg(brandName, 16)}</span>` : "";
        };

        dropdown.innerHTML = `
          <div class="search-suggestions-wrap">
            <div class="search-suggestions-title">Trending Brands & Searches</div>
            <div class="search-tags-grid">
              <button type="button" class="search-suggestion-chip" data-search="Rare Rabbit">${getBrandChipIcon("Rare Rabbit")}Rare Rabbit</button>
              <button type="button" class="search-suggestion-chip" data-search="Ramraj">${getBrandChipIcon("Ramraj")}Ramraj Cotton</button>
              <button type="button" class="search-suggestion-chip" data-search="Allen Solly">${getBrandChipIcon("Allen Solly")}Allen Solly</button>
              <button type="button" class="search-suggestion-chip" data-search="The Souled Store">${getBrandChipIcon("The Souled Store")}The Souled Store</button>
              <button type="button" class="search-suggestion-chip" data-search="Jockey">${getBrandChipIcon("Jockey")}Jockey</button>
              <button type="button" class="search-suggestion-chip" data-search="Otto">${getBrandChipIcon("Otto")}Otto</button>
              <button type="button" class="search-suggestion-chip" data-search="VNH Naidu Hall">${getBrandChipIcon("VNH Naidu Hall")}VNH Naidu Hall</button>
              <button type="button" class="search-suggestion-chip" data-search="Maybell">${getBrandChipIcon("Maybell")}Maybell</button>
              <button type="button" class="search-suggestion-chip" data-search="Nighties">✨ Pure Cotton Nighties</button>
            </div>
            <div class="search-suggestions-title">Browse by Category</div>
            <div class="search-tags-grid">
              <a href="shop.html?category=Nighties" class="search-suggestion-chip">Nighties</a>
              <a href="shop.html?category=Shirts" class="search-suggestion-chip">Shirts</a>
              <a href="shop.html?category=Tees" class="search-suggestion-chip">Tees</a>
              <a href="shop.html?category=Pants" class="search-suggestion-chip">Pants</a>
              <a href="shop.html?category=Innerwear" class="search-suggestion-chip">Innerwear</a>
            </div>
          </div>
        `;
        dropdown.classList.add("active");
        selectedIndex = -1;

        dropdown.querySelectorAll("button.search-suggestion-chip").forEach(chip => {
          chip.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const term = chip.getAttribute("data-search") || "";
            input.value = term;
            input.dispatchEvent(new Event("input"));
            input.focus();
          });
        });
      };

      const doSearch = (query) => {
        if (!window.PRODUCTS) return;

        const matchedBrands = window.Brands ? window.Brands.search(query, 2) : [];

        const matches = window.PRODUCTS.filter(p => {
          return (
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
          );
        }).slice(0, 6);

        const brandHeaderHtml = matchedBrands.length > 0 ? `
          <div class="search-brand-matches">
            <div class="search-brand-match-header">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span>Certified Brand Partner</span>
            </div>
            ${matchedBrands.map(bm => `
              <a href="shop.html?brand=${encodeURIComponent(bm.name)}" class="search-brand-card">
                <div class="search-brand-card-logo">
                  ${window.Brands.getSvg(bm.name, 36)}
                </div>
                <div class="search-brand-card-info">
                  <span class="search-brand-card-name">${bm.name}</span>
                  <span class="search-brand-card-tagline">${bm.brand.tagline || bm.brand.category}</span>
                </div>
                <span class="search-brand-card-cta">Explore (${bm.count}) →</span>
              </a>
            `).join("")}
          </div>
        ` : "";

        if (matches.length === 0 && matchedBrands.length === 0) {
          dropdown.innerHTML = `
            <div class="search-no-results">
              No textiles found matching "<strong>${query}</strong>".
              <div class="search-hint">Try searching for: Nighties, Ramraj, Cotton, Rare Rabbit, Jockey</div>
            </div>
          `;
        } else {
          dropdown.innerHTML = `
            ${brandHeaderHtml}
            ${matches.length > 0 ? `
              <div class="search-results-header">
                <span>Matching Products (${matches.length})</span>
                <span class="results-count-badge">${matches.length} found</span>
              </div>
              <div class="search-items-list">
                ${matches.map((p, i) => `
                  <a href="product.html?id=${p.id}" class="search-result-item" data-index="${i}">
                    <img src="${p.images[0]}" alt="${p.name}" class="search-thumb" onerror="this.src='assets/images/logo.png'">
                    <div class="search-item-info">
                      <div class="search-item-brand">
                        ${window.Brands ? window.Brands.renderMiniIcon(p.brand, 15) : ""}
                        <span>${p.brand}</span>
                        <span style="opacity:0.5;">•</span>
                        <span>${p.category}</span>
                      </div>
                      <div class="search-item-title">${p.name}</div>
                      <div class="search-item-price">
                        <span class="price-val">₹${p.price}</span>
                        ${p.mrp > p.price ? `<span class="mrp-val">₹${p.mrp}</span>` : ""}
                        ${p.discount ? `<span class="discount-badge">${p.discount}% OFF</span>` : ""}
                      </div>
                    </div>
                    <span class="search-item-arrow">→</span>
                  </a>
                `).join("")}
              </div>
              <div class="search-results-footer">
                <a href="shop.html?search=${encodeURIComponent(query)}">View all results for "${query}" →</a>
              </div>
            ` : ""}
          `;
        }
        dropdown.classList.add("active");
        selectedIndex = -1;
      };

      input.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim().toLowerCase();

        if (clearBtn) {
          if (query.length > 0) {
            clearBtn.classList.add("visible");
          } else {
            clearBtn.classList.remove("visible");
          }
        }

        if (query.length < 2) {
          renderZeroState();
          return;
        }

        debounceTimer = setTimeout(() => {
          doSearch(query);
        }, 120);
      });

      if (clearBtn) {
        clearBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          input.value = "";
          clearBtn.classList.remove("visible");
          renderZeroState();
          input.focus();
        });
      }

      input.addEventListener("focus", () => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          renderZeroState();
        } else {
          doSearch(query);
        }
      });

      input.addEventListener("keydown", (e) => {
        const items = dropdown.querySelectorAll(".search-result-item");
        if (!dropdown.classList.contains("active") || !items.length) {
          if (e.key === "Enter") {
            const val = input.value.trim();
            if (val) {
              window.location.href = `shop.html?search=${encodeURIComponent(val)}`;
            }
          }
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % items.length;
          items.forEach((el, i) => el.classList.toggle("is-selected", i === selectedIndex));
          items[selectedIndex]?.scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          items.forEach((el, i) => el.classList.toggle("is-selected", i === selectedIndex));
          items[selectedIndex]?.scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          if (selectedIndex >= 0 && items[selectedIndex]) {
            e.preventDefault();
            items[selectedIndex].click();
          } else {
            const val = input.value.trim();
            if (val) {
              window.location.href = `shop.html?search=${encodeURIComponent(val)}`;
            }
          }
        } else if (e.key === "Escape") {
          dropdown.classList.remove("active");
          input.blur();
        }
      });

      document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target) && (!clearBtn || !clearBtn.contains(e.target))) {
          dropdown.classList.remove("active");
        }
      });
    });
  },

  /**
   * Scroll Reveal with IntersectionObserver
   */
  initScrollReveal() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      });

      document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
    } else {
      document.querySelectorAll(".reveal-on-scroll").forEach(el => el.classList.add("is-revealed"));
    }
  },

  /**
   * Quick View Modal
   */
  initQuickViewModal() {
    const modal = document.getElementById("quickViewModal");
    const overlay = document.getElementById("quickViewOverlay");
    const closeBtn = document.getElementById("quickViewClose");

    const closeModal = () => {
      if (modal) modal.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      document.body.classList.remove("modal-open");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    // Global listener for opening quick view
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".quick-view-trigger");
      if (!trigger) return;
      e.preventDefault();

      const productId = trigger.getAttribute("data-id");
      if (!productId || !window.PRODUCTS) return;

      const product = window.PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      this.renderQuickView(product);
      if (modal && overlay) {
        modal.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
      }
    });
  },

  /**
   * Populate Quick View Modal Content
   */
  renderQuickView(product) {
    const content = document.getElementById("quickViewContent");
    if (!content) return;

    let selectedSize = product.sizes ? product.sizes[0] : "";
    let selectedColor = product.colors && product.colors[0] ? product.colors[0].name : "";

    content.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-media">
          <img id="qvMainImage" src="${product.images[0]}" alt="${product.name}" class="qv-hero-img" onerror="this.src='assets/images/logo.png'">
          ${product.images.length > 1 ? `
            <div class="qv-thumbs-row">
              ${product.images.map((img, i) => `
                <img src="${img}" alt="Thumbnail ${i+1}" class="qv-thumb ${i === 0 ? "active" : ""}" 
                     onclick="document.getElementById('qvMainImage').src='${img}'; document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active')); this.classList.add('active');"
                     onerror="this.src='assets/images/logo.png'">
              `).join("")}
            </div>
          ` : ""}
        </div>
        <div class="quickview-details">
          <div class="qv-brand" style="display:flex; align-items:center; gap:6px;">${window.Brands ? window.Brands.renderMiniIcon(product.brand, 18) : ""}<span>${product.brand}</span></div>
          <h3 class="qv-title">${product.name}</h3>
          <div class="qv-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${product.rating}</span>
            <span class="reviews-count">(${product.reviewsCount} reviews)</span>
          </div>
          <div class="qv-pricing">
            <span class="current-price">₹${product.price}</span>
            ${product.mrp > product.price ? `
              <span class="original-mrp">₹${product.mrp}</span>
              <span class="discount-badge">${product.discount}% OFF</span>
            ` : ""}
          </div>
          <p class="qv-desc">${product.description}</p>
          <div class="qv-fabric"><strong>Fabric:</strong> ${product.fabric}</div>

          <!-- Sizes -->
          ${product.sizes && product.sizes.length > 0 ? `
            <div class="qv-option-group">
              <label class="option-label">Select Size: <strong id="qvSelectedSize">${selectedSize}</strong></label>
              <div class="size-chips">
                ${product.sizes.map((s, idx) => `
                  <button type="button" class="size-chip ${idx === 0 ? "selected" : ""}" 
                          onclick="selectedSize='${s}'; document.getElementById('qvSelectedSize').textContent='${s}'; document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('selected')); this.classList.add('selected');">
                    ${s}
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Colors -->
          ${product.colors && product.colors.length > 0 ? `
            <div class="qv-option-group">
              <label class="option-label">Select Color: <strong id="qvSelectedColor">${selectedColor}</strong></label>
              <div class="color-swatches">
                ${product.colors.map((c, idx) => `
                  <button type="button" class="color-swatch ${idx === 0 ? "selected" : ""}" 
                          style="background-color: ${c.hex}" title="${c.name}"
                          onclick="selectedColor='${c.name}'; document.getElementById('qvSelectedColor').textContent='${c.name}'; document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('selected')); this.classList.add('selected');">
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Actions -->
          <div class="qv-actions">
            <div class="qty-stepper">
              <button type="button" class="qty-btn" id="qvQtyMinus">−</button>
              <span class="qty-val" id="qvQtyVal">1</span>
              <button type="button" class="qty-btn" id="qvQtyPlus">+</button>
            </div>
            <button type="button" class="btn btn-primary btn-pill flex-1" id="qvAddToCartBtn">
              Add to Shopping Bag
            </button>
            <a href="product.html?id=${product.id}" class="btn btn-outline btn-pill">
              View Full Details →
            </a>
          </div>
        </div>
      </div>
    `;

    // Hook up Qty and Add to Cart in modal
    let qty = 1;
    const minusBtn = document.getElementById("qvQtyMinus");
    const plusBtn = document.getElementById("qvQtyPlus");
    const qtyVal = document.getElementById("qvQtyVal");
    const addBtn = document.getElementById("qvAddToCartBtn");

    if (minusBtn) minusBtn.onclick = () => { if (qty > 1) { qty--; qtyVal.textContent = qty; } };
    if (plusBtn) plusBtn.onclick = () => { if (qty < (product.stock || 10)) { qty++; qtyVal.textContent = qty; } };

    if (addBtn) {
      addBtn.onclick = () => {
        if (window.Cart) {
          window.Cart.addItem(product, selectedSize, selectedColor, qty, addBtn);
          const modal = document.getElementById("quickViewModal");
          const overlay = document.getElementById("quickViewOverlay");
          if (modal) modal.classList.remove("active");
          if (overlay) overlay.classList.remove("active");
          document.body.classList.remove("modal-open");
        }
      };
    }
  },

  /**
   * Countdown Timer Utility
   */
  initCountdownTimers() {
    const timers = document.querySelectorAll("[data-countdown]");
    if (timers.length === 0) return;

    // Set countdown 3 days into future for high energy
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 0);

    const updateTimers = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) return;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timers.forEach(t => {
        const dEl = t.querySelector(".cd-days");
        const hEl = t.querySelector(".cd-hours");
        const mEl = t.querySelector(".cd-minutes");
        const sEl = t.querySelector(".cd-seconds");

        if (dEl) dEl.textContent = String(days).padStart(2, "0");
        if (hEl) hEl.textContent = String(hours).padStart(2, "0");
        if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
        if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
      });
    };

    updateTimers();
    setInterval(updateTimers, 1000);
  },

  /**
   * Toast Notification System
   */
  showToast(message, type = "info", duration = 3500) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-text">${message}</div>
      <button type="button" class="toast-close" onclick="this.parentElement.remove()">×</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  /**
   * Newsletter Subscription Form Handler
   */
  initNewsletter() {
    const forms = document.querySelectorAll(".newsletter-form");
    forms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input[type='email']");
        if (input && input.value) {
          this.showToast(`Vanakkam! Thank you for joining the Drape family.`, "success");
          input.value = "";
        }
      });
    });
  },

  /**
   * Floating WhatsApp Support Button
   */
  initWhatsAppFloating() {
    const waBtn = document.querySelector(".whatsapp-float");
    if (!waBtn) return;
    const store = (window.CONFIG && window.CONFIG.STORE) || {};
    const phone = store.whatsapp || "919842123456";
    const text = encodeURIComponent("Vanakkam Drape! I am browsing your online store and have a query regarding collections / delivery.");
    waBtn.href = `https://wa.me/${phone}?text=${text}`;
  },

  /**
   * Smooth Number Counter Animation
   */
  animateCount(element, start, end, duration = 600, prefix = "₹") {
    if (!element) return;
    const range = end - start;
    if (range === 0) {
      element.textContent = prefix + end;
      return;
    }
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * eased);
      element.textContent = prefix + current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  }
};

// Auto initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

if (typeof window !== "undefined") {
  window.App = App;
}
