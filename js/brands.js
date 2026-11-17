/**
 * Drape Madurai - Official Brand Logos & Identity System
 * Centralized registry of certified brands, vector SVG emblems, brand palettes,
 * and presentation helpers for live search, command menu, product cards,
 * catalog filters, and brand marquees.
 */

(function (root, factory) {
  const instance = factory();
  if (typeof root !== 'undefined') {
    root.Brands = instance;
    root.BRANDS = instance.dictionary;
  }
  if (typeof window !== 'undefined') {
    window.Brands = instance;
    window.BRANDS = instance.dictionary;
  }
  if (typeof define === 'function' && define.amd) {
    define([], function () { return instance; });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = instance;
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {

  // Dictionary of authentic brand metadata & high-precision vector logos
  const BRAND_DEFS = {
    "Rare Rabbit": {
      name: "Rare Rabbit",
      category: "Shirts, Pants",
      tagline: "House of Rare • Minimalist Luxury",
      color: "#18181B",
      textColor: "#FAF8F5",
      accent: "#D4AF37",
      aliases: ["rare rabbit", "rare", "house of rare"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#18181B"/><path d="M16 26L12 21H20L16 26Z" fill="#D4AF37"/><path d="M12 21L8 16L12 14L16 19L12 21Z" fill="#FFFFFF" fill-opacity="0.85"/><path d="M20 21L24 16L20 14L16 19L20 21Z" fill="#FFFFFF" fill-opacity="0.95"/><path d="M16 19L12 14L16 10L20 14L16 19Z" fill="#FFFFFF"/><path d="M12 14L9 5L13 9L16 10L12 14Z" fill="#E4E4E7"/><path d="M9 5L12 4L14 9L13 9L9 5Z" fill="#D4AF37"/><path d="M20 14L23 5L19 9L16 10L20 14Z" fill="#F4F4F5"/><path d="M23 5L20 4L18 9L19 9L23 5Z" fill="#D4AF37"/></svg>`
    },
    "Allen Solly": {
      name: "Allen Solly",
      category: "Shirts, Pants",
      tagline: "Aditya Birla • Friday Dressing Heritage",
      color: "#781D28",
      textColor: "#FAF8F5",
      accent: "#FBBF24",
      aliases: ["allen solly", "solly", "allen"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#781D28"/><path d="M16 26C15 24 14 21.5 14 19L13.5 17C12.5 17 11.5 15.8 12 14.5C12.5 13.2 14 13.8 14.5 15L15 17L16 17.5L17 17L17.5 15C18 13.8 19.5 13.2 20 14.5C20.5 15.8 19.5 17 18.5 17L18 19C18 21.5 17 24 16 26Z" fill="#FBBF24"/><path d="M14.5 14C13.5 12 11 10.5 9 11C8.2 11.2 8.5 10 9.5 9.5C11 8.8 13 9.5 14 11.5L14.2 9C13 7.5 11 6.5 9 6.8C8.2 7 8.5 5.8 9.5 5.5C12 4.8 14.2 6.5 14.8 8.5L15.2 13" stroke="#FBBF24" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 14C18.5 12 21 10.5 23 11C23.8 11.2 23.5 10 22.5 9.5C21 8.8 19 9.5 18 11.5L17.8 9C19 7.5 21 6.5 23 6.8C23.8 7 23.5 5.8 22.5 5.5C20 4.8 17.8 6.5 17.2 8.5L16.8 13" stroke="#FBBF24" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    "Jockey": {
      name: "Jockey",
      category: "Innerwear",
      tagline: "Comfort & Athletic Essentials",
      color: "#0A3A60",
      textColor: "#FAF8F5",
      accent: "#38BDF8",
      aliases: ["jockey", "jky"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0A3A60"/><circle cx="16" cy="16" r="11" stroke="#38BDF8" stroke-width="1.4" stroke-dasharray="2 1"/><path d="M9 19C10.5 22 14 23 17 22C20.5 20.8 23 17 22.5 13C22 9.5 18.5 7.5 15 8C12 8.5 9.8 11 10.2 14C10.6 17 13.5 18.5 16 18C18.5 17.5 20 15 19.5 13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/></svg>`
    },
    "Ramraj": {
      name: "Ramraj",
      category: "Shirts, Innerwear",
      tagline: "Ramraj Cotton • South Indian Tradition",
      color: "#7F1D1D",
      textColor: "#FAF8F5",
      accent: "#F59E0B",
      aliases: ["ramraj", "ramraj cotton", "ram raj"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#7F1D1D"/><path d="M16 6L18.5 10H13.5L16 6Z" fill="#F59E0B"/><path d="M9 13C9 10.5 11.5 9.5 16 9.5C20.5 9.5 23 10.5 23 13C23 15 21 16 19.5 16.5L20 23H18L17.5 18H14.5L14 23H12L12.5 16.5C11 16 9 15 9 13Z" fill="#FCD34D"/><path d="M8 25H24V27H8V25Z" fill="#F59E0B"/><path d="M10 23.5H22V24.5H10V23.5Z" fill="#FFFFFF"/><circle cx="16" cy="14" r="2" fill="#7F1D1D"/></svg>`
    },
    "The Souled Store": {
      name: "The Souled Store",
      category: "Tees, Pants",
      tagline: "Official Pop Culture & Casual Wear",
      color: "#DC2626",
      textColor: "#FAF8F5",
      accent: "#FDE047",
      aliases: ["the souled store", "souled store", "tss", "souled"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#DC2626"/><path d="M17.5 5L9 17H15.5L13.5 27L23 14H16.5L17.5 5Z" fill="#FDE047"/><path d="M17.5 5L14 17H16.5L13.5 27L16 17H13L17.5 5Z" fill="#FFFFFF" fill-opacity="0.25"/></svg>`
    },
    "Benetton": {
      name: "Benetton",
      category: "Tees",
      tagline: "United Colors of Benetton",
      color: "#008248",
      textColor: "#FAF8F5",
      accent: "#FFFFFF",
      aliases: ["benetton", "united colors of benetton", "ucb"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#008248"/><path d="M11 16C11 13.5 13 11.5 15.5 11.5C17.5 11.5 19 12.8 19.8 14.5C20.5 12.8 22 11.5 24 11.5C26.5 11.5 28.5 13.5 28.5 16C28.5 18.5 26.5 20.5 24 20.5C22 20.5 20.5 19.2 19.8 17.5C19 19.2 17.5 20.5 15.5 20.5C13 20.5 11 18.5 11 16Z" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="16" r="2.5" fill="#FFFFFF"/></svg>`
    },
    "Otto": {
      name: "Otto",
      category: "Shirts, Pants",
      tagline: "South Indian Formal & Casual Shirts",
      color: "#0F172A",
      textColor: "#FAF8F5",
      accent: "#EAB308",
      aliases: ["otto", "otto shirts"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0F172A"/><path d="M7 21L9 11L13 16L16 9L19 16L23 11L25 21H7Z" fill="#EAB308"/><circle cx="9" cy="10" r="1.5" fill="#FDE047"/><circle cx="16" cy="8" r="1.8" fill="#FDE047"/><circle cx="23" cy="10" r="1.5" fill="#FDE047"/><rect x="7" y="22" width="18" height="3" rx="1" fill="#CA8A04"/><circle cx="12" cy="23.5" r="0.8" fill="#FFFFFF"/><circle cx="16" cy="23.5" r="0.8" fill="#FFFFFF"/><circle cx="20" cy="23.5" r="0.8" fill="#FFFFFF"/></svg>`
    },
    "VNH Naidu Hall": {
      name: "VNH Naidu Hall",
      category: "Nighties",
      tagline: "Madurai & Chennai Heritage Nighties",
      color: "#831843",
      textColor: "#FAF8F5",
      accent: "#F472B6",
      aliases: ["vnh naidu hall", "vnh", "naidu hall"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#831843"/><path d="M16 7C16 11 13 16 9 17C13 18 16 22 16 25C16 22 19 18 23 17C19 16 16 11 16 7Z" fill="#F472B6"/><circle cx="16" cy="16.5" r="4.2" fill="#FDF2F8"/><text x="16" y="19" font-size="6.5" font-weight="900" text-anchor="middle" fill="#831843" font-family="-apple-system, sans-serif">NH</text></svg>`
    },
    "Maybell": {
      name: "Maybell",
      category: "Nighties",
      tagline: "Pure Cotton Comfort & Maternity Loungewear",
      color: "#9D174D",
      textColor: "#FAF8F5",
      accent: "#FBCFE8",
      aliases: ["maybell"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#9D174D"/><path d="M9 22C8 17 9 12 12 9C14.5 13 15 17 16 21C17 17 17.5 13 20 9C23 12 24 17 23 22C21 18 19 17 16 22C13 17 11 18 9 22Z" fill="#FBCFE8"/><circle cx="16" cy="10" r="1.8" fill="#F472B6"/></svg>`
    },
    "Mangai": {
      name: "Mangai",
      category: "Nighties",
      tagline: "Authentic Madurai Sungudi Style Nighties",
      color: "#92400E",
      textColor: "#FAF8F5",
      accent: "#FBBF24",
      aliases: ["mangai", "mangai nighties"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#92400E"/><path d="M16 6C13 6 10 9 10 13C10 18 13.5 22 18 24C21 24 23 21.5 23 19C23 15 19 13.5 18 11C17.5 9.5 18.5 7.5 16 6Z" fill="#FBBF24"/><circle cx="15.5" cy="14.5" r="2.2" fill="#92400E"/><path d="M12 21C13.5 23 15.5 24.5 18 25C17 25.5 15.5 25.5 14 25C12 24.5 10.5 23 12 21Z" fill="#F59E0B"/></svg>`
    },
    "Viking": {
      name: "Viking",
      category: "Nighties, Innerwear",
      tagline: "100% Pure Combed Cotton Comfort",
      color: "#1E3A8A",
      textColor: "#FAF8F5",
      accent: "#60A5FA",
      aliases: ["viking"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1E3A8A"/><path d="M16 6L24 10V18C24 22.5 19.5 25.5 16 27C12.5 25.5 8 22.5 8 18V10L16 6Z" fill="#3B82F6"/><path d="M16 8L22 11.5V17C22 20.5 18.5 23.5 16 24.5C13.5 23.5 10 20.5 10 17V11.5L16 8Z" fill="#1E40AF"/><path d="M12 14C11 11 9 10 7 11C8 12.5 9.5 14 11 15L12 14Z" fill="#E2E8F0"/><path d="M20 14C21 11 23 10 25 11C24 12.5 22.5 14 21 15L20 14Z" fill="#E2E8F0"/><path d="M13 14H19V17C19 18.7 17.7 20 16 20C14.3 20 13 18.7 13 17V14Z" fill="#E2E8F0"/></svg>`
    },
    "Poomex": {
      name: "Poomex",
      category: "Innerwear",
      tagline: "Tirupur Premier Cotton Vests & Briefs",
      color: "#0369A1",
      textColor: "#FAF8F5",
      accent: "#38BDF8",
      aliases: ["poomex"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0369A1"/><path d="M16 5L26 16L16 27L6 16L16 5Z" fill="#0284C7"/><path d="M12 21V11H16.5C18.5 11 20 12.2 20 14C20 15.8 18.5 17 16.5 17H14.5V21H12Z" fill="#FFFFFF"/><path d="M14.5 13H16.2C17.2 13 17.8 13.5 17.8 14C17.8 14.5 17.2 15 16.2 15H14.5V13Z" fill="#0284C7"/></svg>`
    },
    "Kambit": {
      name: "Kambit",
      category: "Innerwear",
      tagline: "Madurai Comfort Cotton Vests",
      color: "#7C2D12",
      textColor: "#FAF8F5",
      accent: "#FBBF24",
      aliases: ["kambit"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#7C2D12"/><circle cx="16" cy="16" r="10" stroke="#F59E0B" stroke-width="1.8"/><path d="M13 10V22H15.5V17L18.5 22H21.5L17.5 15.8L21 10H18.2L15.5 14.8V10H13Z" fill="#FEF3C7"/></svg>`
    },
    "Prithvi": {
      name: "Prithvi",
      category: "Innerwear",
      tagline: "Natural Pure Cotton Softwear",
      color: "#14532D",
      textColor: "#FAF8F5",
      accent: "#86EFAC",
      aliases: ["prithvi"],
      svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#14532D"/><circle cx="16" cy="16" r="10" stroke="#86EFAC" stroke-width="1.4"/><path d="M16 23C16 19 12 16 12 12C15.5 12 18 14.5 18 18" stroke="#4ADE80" stroke-width="2" stroke-linecap="round"/><path d="M16 23C16 19 20 16 20 12C16.5 12 14 14.5 14 18" stroke="#86EFAC" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="11" r="2" fill="#FEF08A"/></svg>`
    }
  };

  // Lookup map for fast alias resolution
  const ALIAS_MAP = new Map();
  Object.keys(BRAND_DEFS).forEach(name => {
    const b = BRAND_DEFS[name];
    ALIAS_MAP.set(name.toLowerCase(), b);
    if (b.aliases) {
      b.aliases.forEach(a => ALIAS_MAP.set(a.toLowerCase(), b));
    }
  });

  const Brands = {
    dictionary: BRAND_DEFS,

    /**
     * Resolves a brand name to its canonical brand object
     */
    get(name) {
      if (!name) return null;
      const clean = String(name).trim().toLowerCase();
      return ALIAS_MAP.get(clean) || null;
    },

    /**
     * Returns an SVG string customized to size and optional CSS class
     */
    getSvg(name, size = 20, extraClass = "") {
      const b = this.get(name);
      if (!b || !b.svg) {
        // Fallback generic textile crest SVG
        return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" class="brand-svg-fallback ${extraClass}" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#FF9500"/><circle cx="16" cy="16" r="9" stroke="#FFFFFF" stroke-width="2"/><path d="M16 10V22M10 16H22" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>`;
      }
      return b.svg
        .replace('<svg ', `<svg width="${size}" height="${size}" class="brand-svg-icon ${extraClass}" `);
    },

    /**
     * Renders a badge/pill with brand logo icon and brand name
     */
    renderBadge(name, options = {}) {
      const b = this.get(name);
      const displayName = b ? b.name : name;
      const size = options.size || 20;
      const isLink = options.link !== false;
      const svg = this.getSvg(name, size);
      const url = `shop.html?brand=${encodeURIComponent(displayName)}`;

      const html = `
        <span class="brand-badge-pill ${options.className || ''}" data-brand="${displayName}">
          <span class="brand-badge-icon">${svg}</span>
          <span class="brand-badge-name">${displayName}</span>
        </span>
      `;

      if (isLink) {
        return `<a href="${url}" class="brand-badge-link" aria-label="Shop ${displayName}">${html}</a>`;
      }
      return html;
    },

    /**
     * Renders just the mini icon element for inline usage in lists or cards
     */
    renderMiniIcon(name, size = 16, extraClass = "") {
      const b = this.get(name);
      const svg = this.getSvg(name, size);
      return `<span class="brand-mini-icon ${extraClass}" title="${b ? b.name : name}" aria-hidden="true">${svg}</span>`;
    },

    /**
     * Searches brands matching query with real-time product counts from window.PRODUCTS
     */
    search(query, limit = 4) {
      if (!query || typeof query !== 'string') return [];
      const q = query.trim().toLowerCase();
      if (!q) return [];

      const matches = [];
      const products = (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS)) ? window.PRODUCTS : [];

      Object.keys(BRAND_DEFS).forEach(name => {
        const b = BRAND_DEFS[name];
        let score = 0;

        if (name.toLowerCase() === q) score += 100;
        else if (name.toLowerCase().startsWith(q)) score += 50;
        else if (name.toLowerCase().includes(q)) score += 20;
        else if (b.aliases && b.aliases.some(a => a.toLowerCase().includes(q))) score += 15;
        else if (b.category && b.category.toLowerCase().includes(q)) score += 5;

        if (score > 0) {
          const count = products.filter(p => p.brand && p.brand.toLowerCase() === name.toLowerCase()).length;
          matches.push({
            brand: b,
            name: b.name,
            score,
            count: count || (b.category ? 8 : 1)
          });
        }
      });

      matches.sort((a, b) => b.score - a.score || b.count - a.count);
      return matches.slice(0, limit);
    },

    /**
     * Returns all registered brands with their product count
     */
    getAll() {
      const products = (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS)) ? window.PRODUCTS : [];
      return Object.keys(BRAND_DEFS).map(name => {
        const b = BRAND_DEFS[name];
        const count = products.filter(p => p.brand && p.brand.toLowerCase() === name.toLowerCase()).length;
        return {
          ...b,
          productCount: count
        };
      });
    }
  };

  return Brands;
}));
