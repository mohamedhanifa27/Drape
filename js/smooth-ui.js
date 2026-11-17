/**
 * Hanifa Textiles - SmoothUI, Skiper UI, Unlumen UI & Cult UI Suite
 * JavaScript Controller
 * 
 * Includes:
 * - Lenis Smooth Scroll Engine
 * - SmoothUI: scroll-progress, floating-navbar, fluid-hover-highlight, digit-roll,
 *             number-flow, count-badge, content-skeleton, depth-parallax-words,
 *             scroll-image-reveal
 * - Skiper UI: skiper106 magnetic physics, skiper26 text reveals
 * - Unlumen UI: custom interactive cursor, spotlight command menu (Cmd+K),
 *               3D tilt card & radial highlight
 */

(function () {
  "use strict";

  const SmoothUI = {
    lenis: null,

    init() {
      this.initLenis();
      this.initScrollProgress();
      this.initFloatingNavbar();
      this.initFluidHoverHighlight();
      this.initCustomCursor();
      this.initTiltCards();
      this.initDepthParallax();
      this.initScrollImageReveal();
      this.initCommandMenu();
      this.initBadgeAnimations();
      this.initMaskedTextReveals();

      console.log("✨ SmoothUI, Skiper UI, Unlumen UI & Cult UI Suite initialized.");
    },

    /**
     * 1. LENIS SMOOTH SCROLL (https://github.com/darkroomengineering/lenis)
     */
    initLenis() {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      if (typeof window.Lenis === "function") {
        this.lenis = new window.Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.8
        });

        window.lenis = this.lenis;

        let lastScroll = 0;
        let lastTime = performance.now();

        const raf = (time) => {
          this.lenis.raf(time);

          // Calculate scroll velocity for Unlumen velocity-highlight
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          const dt = Math.max(1, time - lastTime);
          const velocity = Math.min(100, Math.abs(currentScroll - lastScroll) / dt * 50);
          document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(1));

          lastScroll = currentScroll;
          lastTime = time;

          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    },

    /**
     * 2. SCROLL PROGRESS (SmoothUI: scroll-progress)
     */
    initScrollProgress() {
      let bar = document.getElementById("scrollProgressBar");
      if (!bar) {
        bar = document.createElement("div");
        bar.id = "scrollProgressBar";
        bar.className = "scroll-progress-bar";
        document.body.prepend(bar);
      }

      const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
      };

      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    },

    /**
     * 3. FLOATING NAVBAR (SmoothUI: floating-navbar)
     */
    initFloatingNavbar() {
      const header = document.querySelector(".site-header");
      if (!header) return;

      const onScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        if (scrollY > 25) {
          header.classList.add("is-scrolled", "is-floating");
        } else {
          header.classList.remove("is-scrolled", "is-floating");
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      // Theme toggle spring rotation trigger
      document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          btn.classList.add("is-rotating");
          setTimeout(() => btn.classList.remove("is-rotating"), 520);
        });
      });
    },

    /**
     * 4. FLUID HOVER HIGHLIGHT (SmoothUI: fluid-hover-highlight)
     */
    initFluidHoverHighlight() {
      const navLinksContainer = document.querySelector(".nav-links");
      if (!navLinksContainer) return;

      let highlight = navLinksContainer.querySelector(".fluid-nav-highlight");
      if (!highlight) {
        highlight = document.createElement("div");
        highlight.className = "fluid-nav-highlight";
        navLinksContainer.prepend(highlight);
      }

      const items = navLinksContainer.querySelectorAll(".nav-link");
      if (!items.length) return;

      // Find currently active link or current pathname match
      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      let activeItem = null;
      items.forEach(item => {
        const href = item.getAttribute("href") || "";
        if (item.classList.contains("active") || href === currentPath || (currentPath === "" && href === "index.html")) {
          activeItem = item;
        }
      });

      const moveTo = (item) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const parentRect = navLinksContainer.getBoundingClientRect();
        const left = rect.left - parentRect.left;
        const top = rect.top - parentRect.top;
        const width = rect.width;
        const height = rect.height;

        highlight.style.left = `${left}px`;
        highlight.style.top = `${top}px`;
        highlight.style.width = `${width}px`;
        highlight.style.height = `${height}px`;
        highlight.classList.add("is-active");
      };

      // Position on active link initially with smooth layout delay
      if (activeItem) {
        setTimeout(() => moveTo(activeItem), 60);
      }

      items.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          moveTo(item);
        });
      });

      navLinksContainer.addEventListener("mouseleave", () => {
        if (activeItem) {
          moveTo(activeItem);
        } else {
          highlight.classList.remove("is-active");
        }
      });

      window.addEventListener("resize", () => {
        if (activeItem) {
          moveTo(activeItem);
        }
      }, { passive: true });
    },

    /**
     * 5. Custom interactive cursor removed per user request.
     * Removes any legacy cursor elements to ensure clean native browser cursor.
     */
    initCustomCursor() {
      const dot = document.querySelector(".unlumen-cursor-dot");
      const ring = document.querySelector(".unlumen-cursor-ring");
      if (dot) dot.remove();
      if (ring) ring.remove();
    },

    /**
     * 6. UNLUMEN UI: 3D TILT CARDS & SPOTLIGHT (@unlumen-ui/tilt-card & highlight)
     */
    initTiltCards() {
      const bindCard = (card) => {
        if (card._tiltBound) return;
        card._tiltBound = true;
        card.classList.add("tilt-card");

        let glare = card.querySelector(".tilt-card-glare");
        if (!glare) {
          glare = document.createElement("div");
          glare.className = "tilt-card-glare";
          card.appendChild(glare);
        }

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Subtle tilt angle: max 8deg
          const rotateX = ((centerY - y) / centerY) * 7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
          card.style.setProperty("--mouse-x", `${(x / rect.width * 100).toFixed(1)}%`);
          card.style.setProperty("--mouse-y", `${(y / rect.height * 100).toFixed(1)}%`);
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
      };

      document.querySelectorAll(".product-card, .category-tile, .tilt-target").forEach(bindCard);

      // Support dynamic cards
      const observer = new MutationObserver(() => {
        document.querySelectorAll(".product-card:not([_tiltBound])").forEach(bindCard);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    /**
     * 7. DEPTH PARALLAX WORDS (SmoothUI: depth-parallax-words)
     */
    initDepthParallax() {
      const container = document.querySelector(".depth-parallax-container");
      if (!container) return;

      let mouseX = 0, mouseY = 0;
      window.addEventListener("mousemove", (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseX = (e.clientX - cx) / cx;
        mouseY = (e.clientY - cy) / cy;

        container.style.setProperty("--px-x", `${(mouseX * 12).toFixed(2)}px`);
        container.style.setProperty("--px-y", `${(mouseY * 8).toFixed(2)}px`);
      });
    },

    /**
     * 8. SCROLL IMAGE REVEAL (SmoothUI: scroll-image-reveal)
     */
    initScrollImageReveal() {
      const elements = document.querySelectorAll(".scroll-image-reveal");
      if (!elements.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      elements.forEach(el => observer.observe(el));
    },

    /**
     * 9. SKIPER UI: STAGGERED MASKED TEXT REVEAL (skiper26)
     */
    initMaskedTextReveals() {
      const titles = document.querySelectorAll(".skiper-26-reveal");
      if (!titles.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      titles.forEach(el => observer.observe(el));
    },

    /**
     * 10. ANIMATED COUNT BADGE POP (SmoothUI: count-badge)
     */
    initBadgeAnimations() {
      const triggerBadgePop = (selector) => {
        const badge = document.querySelector(selector);
        if (badge) {
          badge.classList.remove("is-popping");
          void badge.offsetWidth;
          badge.classList.add("is-popping");
        }
      };

      window.addEventListener("cart:updated", () => triggerBadgePop("#headerCartBadge, .cart-badge"));
      window.addEventListener("wishlist:updated", () => triggerBadgePop("#headerWishlistBadge, .wishlist-badge"));
    },

    /**
     * 11. DIGIT ROLL & NUMBER FLOW (SmoothUI: digit-roll & number-flow)
     */
    digitRoll(el, targetValue, options = {}) {
      if (!el) return;
      const start = options.start !== undefined ? options.start : (parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0);
      const end = parseFloat(targetValue) || 0;
      const duration = options.duration || 600;
      const prefix = options.prefix !== undefined ? options.prefix : "₹";
      const suffix = options.suffix || "";
      const startTime = performance.now();

      el.classList.add("rolling");

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Easing: easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(start + (end - start) * ease);

        el.textContent = `${prefix}${currentVal.toLocaleString("en-IN")}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.classList.remove("rolling");
        }
      };

      requestAnimationFrame(animate);
    },

    /**
     * 12. UNLUMEN UI: COMMAND MENU SPOTLIGHT (@unlumen-ui/command-menu)
     */
    initCommandMenu() {
      let overlay = document.getElementById("unlumenCmdMenu");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "unlumenCmdMenu";
        overlay.className = "unlumen-cmd-overlay";
        overlay.innerHTML = `
          <div class="unlumen-cmd-modal" role="dialog" aria-modal="true" aria-label="Command Menu">
            <div class="unlumen-cmd-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" class="unlumen-cmd-input" placeholder="Search Hanifa Textiles (products, categories, brands)..." autofocus>
              <div class="unlumen-cmd-kbd">ESC</div>
            </div>
            <div class="unlumen-cmd-body">
              <div class="unlumen-cmd-group-title">Quick Actions</div>
              <a href="#" class="unlumen-cmd-item" data-action="theme">
                <span>🌓 Toggle Street Dark / Warm Light Theme</span>
                <span class="unlumen-cmd-item-meta">Theme</span>
              </a>
              <a href="cart.html" class="unlumen-cmd-item">
                <span>🛒 View Shopping Cart & Checkout</span>
                <span class="unlumen-cmd-item-meta">Cart</span>
              </a>
              <a href="shop.html" class="unlumen-cmd-item">
                <span>🛍️ Browse All Collections</span>
                <span class="unlumen-cmd-item-meta">Shop</span>
              </a>

              <div class="unlumen-cmd-group-title">Popular Categories</div>
              <a href="shop.html?category=nighties" class="unlumen-cmd-item">
                <span>Pure Cotton Nighties (VNH Naidu Hall, Maybell, Mangai)</span>
                <span class="unlumen-cmd-item-meta">Category</span>
              </a>
              <a href="shop.html?category=shirts" class="unlumen-cmd-item">
                <span>Casual & Linen Shirts (Rare Rabbit, Otto, Benetton)</span>
                <span class="unlumen-cmd-item-meta">Category</span>
              </a>
              <a href="shop.html?category=innerwear" class="unlumen-cmd-item">
                <span>Men & Women Innerwear (Jockey, Poomex, Prithvi, Ramraj)</span>
                <span class="unlumen-cmd-item-meta">Category</span>
              </a>

              <div class="unlumen-cmd-group-title" id="cmdProductsTitle">Featured Products</div>
              <div id="cmdProductsList"></div>
            </div>
            <div class="unlumen-cmd-footer">
              <div>Use <strong>↑</strong> <strong>↓</strong> to navigate, <strong>↵</strong> to select</div>
              <div>Madurai Showroom • Est. 1985</div>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
      }

      const input = overlay.querySelector(".unlumen-cmd-input");
      const productsList = overlay.querySelector("#cmdProductsList");

      const populateProducts = (query = "") => {
        if (!window.PRODUCTS) return;
        const q = query.trim().toLowerCase();
        const filtered = window.PRODUCTS.filter(p => {
          if (!q) return p.isTrending || p.isNew;
          return p.name.toLowerCase().includes(q) ||
                 p.brand.toLowerCase().includes(q) ||
                 p.category.toLowerCase().includes(q);
        }).slice(0, 6);

        if (!filtered.length) {
          productsList.innerHTML = `<div style="padding: 12px; font-size: 0.88rem; color: var(--color-text-muted);">No products found matching "${query}"</div>`;
          return;
        }

        productsList.innerHTML = filtered.map(p => `
          <a href="product.html?id=${p.id}" class="unlumen-cmd-item">
            <span>${p.name.length > 50 ? p.name.substring(0, 50) + '...' : p.name}</span>
            <span class="unlumen-cmd-item-meta">₹${p.price} • ${p.brand}</span>
          </a>
        `).join("");
      };

      const openMenu = () => {
        overlay.classList.add("is-open");
        populateProducts();
        setTimeout(() => input.focus(), 80);
      };

      const closeMenu = () => {
        overlay.classList.remove("is-open");
        input.value = "";
      };

      // Keyboard shortcuts: Ctrl+K / Cmd+K
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
          e.preventDefault();
          if (overlay.classList.contains("is-open")) {
            closeMenu();
          } else {
            openMenu();
          }
        } else if (e.key === "Escape" && overlay.classList.contains("is-open")) {
          closeMenu();
        }
      });

      // Close on background overlay click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeMenu();
      });

      // Filter input
      input.addEventListener("input", (e) => {
        populateProducts(e.target.value);
      });

      // Theme toggle action
      overlay.addEventListener("click", (e) => {
        const item = e.target.closest("[data-action='theme']");
        if (item) {
          e.preventDefault();
          if (window.App && window.App.toggleTheme) {
            window.App.toggleTheme();
          }
          closeMenu();
        }
      });

      // Bind search buttons across navbar to open Command Menu
      document.querySelectorAll(".search-toggle-btn, [data-open-cmd]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          openMenu();
        });
      });
    }
  };

  window.SmoothUI = SmoothUI;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SmoothUI.init());
  } else {
    SmoothUI.init();
  }
})();
