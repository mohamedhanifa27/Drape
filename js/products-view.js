/**
 * Hanifa Textiles - Products View Controller
 * Powers product card generation, catalog filtering, search, sorting,
 * pagination, and grid/list view toggles for shop.html and carousels.
 */

const ProductsView = {
  currentPage: 1,
  pageSize: 12,
  activeFilters: {
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    minPrice: 0,
    maxPrice: 3000,
    minRating: 0,
    inStockOnly: false,
    offersOnly: false,
    search: ""
  },
  sortBy: "featured",
  viewMode: "grid", // 'grid' | 'list'

  /**
   * Helper: Generate HTML for a single product card
   */
  renderCard(product, options = {}) {
    const isWishlisted = window.Wishlist && window.Wishlist.isInWishlist(product.id);
    const mainImg = (product.images && product.images[0]) || "assets/images/logo.png";
    const hoverImg = (product.images && product.images[1]) || mainImg;

    return `
      <article class="product-card tilt-card ${product.stock <= 5 ? "low-stock" : ""}" data-id="${product.id}" data-category="${product.category}" data-brand="${product.brand}">
        <div class="tilt-card-glare"></div>
        <div class="card-media scroll-image-reveal is-revealed">
          ${product.discount > 0 ? `<span class="badge badge-discount">-${product.discount}%</span>` : ""}
          ${product.isNew ? `<span class="badge badge-new">New</span>` : ""}
          ${product.isTrending ? `<span class="badge badge-trending">Hot</span>` : ""}
          <span class="skiper-42-pill">${product.brand}</span>
          
          <button type="button" class="wishlist-btn ${isWishlisted ? "active" : ""}" 
                  data-id="${product.id}" aria-label="Add to Wishlist"
                  onclick="window.Wishlist.toggle(window.PRODUCTS.find(p=>p.id==='${product.id}'), this)">
            <svg class="heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <a href="product.html?id=${product.id}" class="card-img-link">
            <img src="${mainImg}" alt="${product.name}" class="card-img primary-img" loading="lazy" onerror="this.src='assets/images/logo.png'">
            <img src="${hoverImg}" alt="${product.name} alternate view" class="card-img hover-img" loading="lazy" onerror="this.src='assets/images/logo.png'">
          </a>

          <div class="card-overlay-actions">
            <button type="button" class="btn btn-sm btn-white quick-view-trigger" data-id="${product.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Quick View
            </button>
            <button type="button" class="btn btn-sm btn-primary quick-add-btn" 
                    onclick="window.Cart.addItem(window.PRODUCTS.find(p=>p.id==='${product.id}'), null, null, 1, this)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              + Quick Add
            </button>
          </div>
        </div>

        <div class="card-content">
          <div class="card-meta">
            <span class="card-brand">${product.brand}</span>
            <span class="card-category">${product.category}</span>
          </div>

          <h4 class="card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h4>

          <div class="card-rating">
            <span class="star-rating">★ ${product.rating}</span>
            <span class="review-count">(${product.reviewsCount})</span>
            ${product.stock <= 5 ? `<span class="stock-pill">Only ${product.stock} left</span>` : ""}
          </div>

          <div class="card-pricing">
            <span class="price-current number-flow">₹${product.price}</span>
            ${product.mrp > product.price ? `
              <span class="price-mrp">₹${product.mrp}</span>
              <span class="price-save">Save ₹${product.mrp - product.price}</span>
            ` : ""}
          </div>

          ${product.sizes && product.sizes.length > 0 ? `
            <div class="card-sizes">
              ${product.sizes.slice(0, 4).map(s => `<span class="size-tag">${s}</span>`).join("")}
              ${product.sizes.length > 4 ? `<span class="size-more">+${product.sizes.length - 4}</span>` : ""}
            </div>
          ` : ""}
        </div>
      </article>
    `;
  },

  /**
   * Render skeleton loaders while filtering/loading
   */
  renderSkeletons(container, count = 8) {
    if (!container) return;
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <div class="product-card skeleton-card">
          <div class="skeleton-box skeleton-media"></div>
          <div class="skeleton-content">
            <div class="skeleton-box skeleton-line" style="width: 40%"></div>
            <div class="skeleton-box skeleton-line" style="width: 85%"></div>
            <div class="skeleton-box skeleton-line" style="width: 60%"></div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  /**
   * Initialize Catalog Page Filters, Sort, Search and Pagination
   */
  initCatalogPage() {
    const gridContainer = document.getElementById("shopProductsGrid");
    if (!gridContainer || !window.PRODUCTS) return;

    // Parse URL query parameters (e.g. ?category=Nighties&search=cotton)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    const brandParam = urlParams.get("brand");
    const searchParam = urlParams.get("search");
    const offerParam = urlParams.get("offers");

    if (categoryParam) this.activeFilters.categories = [categoryParam];
    if (brandParam) this.activeFilters.brands = [brandParam];
    if (searchParam) this.activeFilters.search = searchParam;
    if (offerParam === "true") this.activeFilters.offersOnly = true;

    // Setup filter listeners
    this.setupFilterInputs();
    this.renderCatalog();
  },

  /**
   * Wire up all sidebar filter elements
   */
  setupFilterInputs() {
    // Categories
    document.querySelectorAll(".filter-category-checkbox").forEach(cb => {
      if (this.activeFilters.categories.includes(cb.value)) cb.checked = true;
      cb.addEventListener("change", () => {
        const checked = Array.from(document.querySelectorAll(".filter-category-checkbox:checked")).map(c => c.value);
        this.activeFilters.categories = checked;
        this.currentPage = 1;
        this.renderCatalog();
      });
    });

    // Brands
    document.querySelectorAll(".filter-brand-checkbox").forEach(cb => {
      if (this.activeFilters.brands.includes(cb.value)) cb.checked = true;
      cb.addEventListener("change", () => {
        const checked = Array.from(document.querySelectorAll(".filter-brand-checkbox:checked")).map(c => c.value);
        this.activeFilters.brands = checked;
        this.currentPage = 1;
        this.renderCatalog();
      });
    });

    // Price Slider
    const priceRange = document.getElementById("priceRangeInput");
    const priceDisplay = document.getElementById("priceRangeDisplay");
    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        this.activeFilters.maxPrice = val;
        if (priceDisplay) priceDisplay.textContent = `Up to ₹${val}`;
      });
      priceRange.addEventListener("change", () => {
        this.currentPage = 1;
        this.renderCatalog();
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById("shopSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.currentPage = 1;
        this.renderCatalog();
      });
    }

    // Grid / List View Toggle
    const gridBtn = document.getElementById("viewGridBtn");
    const listBtn = document.getElementById("viewListBtn");
    if (gridBtn && listBtn) {
      gridBtn.addEventListener("click", () => {
        this.viewMode = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        const container = document.getElementById("shopProductsGrid");
        if (container) container.className = "products-grid mode-grid";
      });
      listBtn.addEventListener("click", () => {
        this.viewMode = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        const container = document.getElementById("shopProductsGrid");
        if (container) container.className = "products-grid mode-list";
      });
    }

    // Rating Filter
    document.querySelectorAll(".filter-rating-radio").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.activeFilters.minRating = Number(e.target.value);
        this.currentPage = 1;
        this.renderCatalog();
      });
    });

    // Mobile Filter Drawer Toggle
    const filterDrawerBtn = document.getElementById("openFilterDrawer");
    const filterDrawer = document.getElementById("shopFilterSidebar");
    const filterOverlay = document.getElementById("filterDrawerOverlay");
    const closeFilterBtn = document.getElementById("closeFilterDrawer");

    if (filterDrawerBtn && filterDrawer) {
      filterDrawerBtn.addEventListener("click", () => {
        filterDrawer.classList.add("drawer-active");
        if (filterOverlay) filterOverlay.classList.add("active");
        document.body.classList.add("filter-open");
      });
    }

    const closeFilter = () => {
      if (filterDrawer) filterDrawer.classList.remove("drawer-active");
      if (filterOverlay) filterOverlay.classList.remove("active");
      document.body.classList.remove("filter-open");
    };

    if (closeFilterBtn) closeFilterBtn.addEventListener("click", closeFilter);
    if (filterOverlay) filterOverlay.addEventListener("click", closeFilter);

    // Clear All Filters
    const clearBtns = document.querySelectorAll(".clear-filters-btn");
    clearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.clearFilters();
      });
    });
  },

  /**
   * Reset all filters
   */
  clearFilters() {
    this.activeFilters = {
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      minPrice: 0,
      maxPrice: 3000,
      minRating: 0,
      inStockOnly: false,
      offersOnly: false,
      search: ""
    };
    this.currentPage = 1;

    // Reset input states
    document.querySelectorAll(".filter-category-checkbox, .filter-brand-checkbox").forEach(cb => cb.checked = false);
    const priceRange = document.getElementById("priceRangeInput");
    if (priceRange) priceRange.value = 3000;
    const priceDisplay = document.getElementById("priceRangeDisplay");
    if (priceDisplay) priceDisplay.textContent = "Up to ₹3000";

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    this.renderCatalog();
  },

  /**
   * Filter, sort, and render catalog products
   */
  renderCatalog() {
    const container = document.getElementById("shopProductsGrid");
    if (!container || !window.PRODUCTS) return;

    // 1. Show skeleton momentarily for smooth perception
    this.renderSkeletons(container, 6);

    setTimeout(() => {
      // 2. Filter logic
      let filtered = window.PRODUCTS.filter(p => {
        // Category
        if (this.activeFilters.categories.length > 0 && !this.activeFilters.categories.includes(p.category)) {
          return false;
        }
        // Brand
        if (this.activeFilters.brands.length > 0 && !this.activeFilters.brands.includes(p.brand)) {
          return false;
        }
        // Price
        if (p.price > this.activeFilters.maxPrice) {
          return false;
        }
        // Rating
        if (p.rating < this.activeFilters.minRating) {
          return false;
        }
        // Offers Only
        if (this.activeFilters.offersOnly && !p.isOffer) {
          return false;
        }
        // Search
        if (this.activeFilters.search) {
          const q = this.activeFilters.search.toLowerCase();
          const match = (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
          );
          if (!match) return false;
        }
        return true;
      });

      // 3. Sort logic
      if (this.sortBy === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (this.sortBy === "newest") {
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      } else if (this.sortBy === "discount") {
        filtered.sort((a, b) => b.discount - a.discount);
      }

      // Update counters & active pills
      this.renderFilterPills(filtered.length);

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="no-products-found">
            <div class="empty-icon">🔍</div>
            <h3>No matching textiles found</h3>
            <p>Try clearing some filters or searching for another fabric, brand, or category.</p>
            <button type="button" class="btn btn-primary btn-pill clear-filters-btn" onclick="ProductsView.clearFilters()">Clear All Filters</button>
          </div>
        `;
        const pagination = document.getElementById("shopPagination");
        if (pagination) pagination.innerHTML = "";
        return;
      }

      // 4. Paginate
      const totalPages = Math.ceil(filtered.length / this.pageSize);
      const startIdx = (this.currentPage - 1) * this.pageSize;
      const endIdx = startIdx + this.pageSize;
      const pagedProducts = filtered.slice(startIdx, endIdx);

      // 5. Render
      container.className = `products-grid mode-${this.viewMode}`;
      container.innerHTML = pagedProducts.map(p => this.renderCard(p)).join("");

      // 6. Pagination UI
      this.renderPagination(totalPages, filtered.length);
    }, 150);
  },

  /**
   * Render Active Filter Badges / Pills
   */
  renderFilterPills(totalCount) {
    const pillsContainer = document.getElementById("activeFilterPills");
    const countDisplay = document.getElementById("catalogResultsCount");

    if (countDisplay) {
      countDisplay.innerHTML = `Showing <strong>${totalCount}</strong> authentic textiles`;
    }

    if (!pillsContainer) return;

    const pills = [];

    this.activeFilters.categories.forEach(cat => {
      pills.push(`
        <span class="filter-pill">
          ${cat} <button type="button" onclick="ProductsView.removeFilter('category', '${cat}')">×</button>
        </span>
      `);
    });

    this.activeFilters.brands.forEach(br => {
      pills.push(`
        <span class="filter-pill">
          ${br} <button type="button" onclick="ProductsView.removeFilter('brand', '${br}')">×</button>
        </span>
      `);
    });

    if (this.activeFilters.search) {
      pills.push(`
        <span class="filter-pill">
          "${this.activeFilters.search}" <button type="button" onclick="ProductsView.removeFilter('search')">×</button>
        </span>
      `);
    }

    if (this.activeFilters.maxPrice < 3000) {
      pills.push(`
        <span class="filter-pill">
          ≤ ₹${this.activeFilters.maxPrice} <button type="button" onclick="ProductsView.removeFilter('price')">×</button>
        </span>
      `);
    }

    if (pills.length > 0) {
      pillsContainer.innerHTML = `
        <div class="pills-wrapper">
          ${pills.join("")}
          <button type="button" class="clear-all-link" onclick="ProductsView.clearFilters()">Clear All</button>
        </div>
      `;
      pillsContainer.style.display = "block";
    } else {
      pillsContainer.innerHTML = "";
      pillsContainer.style.display = "none";
    }
  },

  /**
   * Remove single active filter
   */
  removeFilter(type, value) {
    if (type === "category") {
      this.activeFilters.categories = this.activeFilters.categories.filter(c => c !== value);
      const cb = document.querySelector(`.filter-category-checkbox[value="${value}"]`);
      if (cb) cb.checked = false;
    } else if (type === "brand") {
      this.activeFilters.brands = this.activeFilters.brands.filter(b => b !== value);
      const cb = document.querySelector(`.filter-brand-checkbox[value="${value}"]`);
      if (cb) cb.checked = false;
    } else if (type === "search") {
      this.activeFilters.search = "";
    } else if (type === "price") {
      this.activeFilters.maxPrice = 3000;
      const pr = document.getElementById("priceRangeInput");
      if (pr) pr.value = 3000;
    }
    this.currentPage = 1;
    this.renderCatalog();
  },

  /**
   * Render Pagination Buttons
   */
  renderPagination(totalPages, totalItems) {
    const paginationEl = document.getElementById("shopPagination");
    if (!paginationEl) return;

    if (totalPages <= 1) {
      paginationEl.innerHTML = "";
      return;
    }

    let html = `
      <div class="pagination-controls smooth-pagination">
        <button type="button" class="page-btn prev-btn smooth-page-btn ${this.currentPage === 1 ? "disabled" : ""}" 
                onclick="if(ProductsView.currentPage > 1){ ProductsView.currentPage--; ProductsView.renderCatalog(); window.scrollTo({top: 200, behavior:'smooth'}); }">
          ← Prev
        </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      html += `
        <button type="button" class="page-num-btn smooth-page-btn ${p === this.currentPage ? "active" : ""}" 
                onclick="ProductsView.currentPage = ${p}; ProductsView.renderCatalog(); window.scrollTo({top: 200, behavior:'smooth'});">
          ${p}
        </button>
      `;
    }

    html += `
        <button type="button" class="page-btn next-btn smooth-page-btn ${this.currentPage === totalPages ? "disabled" : ""}" 
                onclick="if(ProductsView.currentPage < ${totalPages}){ ProductsView.currentPage++; ProductsView.renderCatalog(); window.scrollTo({top: 200, behavior:'smooth'}); }">
          Next →
        </button>
      </div>
    `;

    paginationEl.innerHTML = html;
  }
};

// Global init on catalog pages
if (typeof window !== "undefined") {
  window.ProductsView = ProductsView;
}
