# 🏛️ Drape - Contemporary Textile E-Commerce Platform
**Architectural Design & Implementation of a High-Performance E-Commerce Web System**  
*Origin: South Masi Street, Madurai, Tamil Nadu, India • Heritage Since 1985*

[![GitHub Repository](https://img.shields.io/badge/GitHub-mohamedhanifa27%2FDrape-blue?logo=github)](https://github.com/mohamedhanifa27/Drape)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-orange)](index.html)
[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-brightgreen)](https://mohamedhanifa27.github.io/Drape/)

**Drape** is a production-quality, multi-page e-commerce web platform engineered for authentic South Indian family textiles and contemporary apparel. Engineered with semantic HTML5, modern modular CSS, and pure Vanilla JavaScript (zero framework bloat), featuring hardware-accelerated 60fps animations, intelligent live search, and a Tamil Nadu localized logistics engine.

- **Author:** Mohamed Hanifa ([@mohamedhanifa27](https://github.com/mohamedhanifa27))
- **Repository:** [https://github.com/mohamedhanifa27/Drape](https://github.com/mohamedhanifa27/Drape)
- **Live Preview:** [https://mohamedhanifa27.github.io/Drape/](https://mohamedhanifa27.github.io/Drape/)

---

## 🌟 Live Features & Technical Highlights

1. **Framework-Free Performance:**
   - 100% Vanilla JS (No React, Vue, or build tooling required).
   - Fast initial page load with native browser caching.
   - Fully persistent state via `localStorage` (Shopping Bag, Wishlist, Order History).

2. **Tamil Nadu & South India Logistics Engine (`js/delivery.js`):**
   - **Store Location:** Hanifa Textiles, South Masi Street, Madurai (`lat: 9.9155, lng: 78.1198`).
   - **Haversine Distance with Road Factor (×1.3):** Accurately computes road-approximated distance from Madurai.
   - **OpenStreetMap Nominatim Geocoding:** Auto-resolves PIN codes and cities without requiring costly API keys.
   - **Zero-Failure Local Pincode Table:** 30+ precomputed South Indian postal hubs (Madurai, Dindigul, Trichy, Tirunelveli, Coimbatore, Chennai, Bengaluru) ensure instant calculations even during network downtime.
   - **Sunday-Skipped Dispatch Calendar:** Dispatch starts 1 day after order date; automatically rolls over Sundays to Monday.
   - **Delivery Slabs & Free Delivery:**
     - 0–10 km: Free (Madurai local)
     - 10–50 km: ₹40 (Suburbs & nearby taluks)
     - 50–150 km: ₹70 (Southern districts)
     - 150–400 km: ₹110 (Statewide)
     - 400+ km: ₹150 (Express pan-India)
     - **Free delivery on all orders above ₹999.**

3. **UPI & Cash on Delivery (COD) Checkout (`js/checkout.js`):**
   - **3-Step Animated Flow:** `Address` ⟶ `Shipping SLA` ⟶ `Payment`.
   - **Geolocation Integration:** "Use My Current Location" button using HTML5 `navigator.geolocation` and reverse-geocoding.
   - **Deep-Links for Mobile:** Instant one-tap payment via Google Pay (`gpay`), PhonePe, and Paytm.
   - **Dynamic QR Code:** Generates standard NPCI `upi://pay` QR code live on desktop screen.
   - **UTR / UPI Ref Verification:** Prompts customer to enter 12-digit transaction ID.
   - **WhatsApp Order Push:** Automatically constructs a prefilled WhatsApp message with order details, items, address, and total for direct confirmation with the Madurai counter staff.

4. **Streetwear & Designer Theme System (60-15-15-10 Rule):**
   - **Light Theme:**
     - `#F5EBDD` (60% Primary): Dominant Warm Oat canvas & surfaces
     - `#F2765E` (15% Secondary): Vibrant Street Coral CTA buttons & active badges
     - `#315B8C` (15% Tertiary): Deep Slate Blue cards, structural accents, and topbar
     - `#413333` (10% Quaternary): Deep Espresso crisp headings & body typography
   - **Dark Theme (Inverted):**
     - `#413333` (60% Primary): Dominant Deep Espresso dark streetwear canvas
     - `#315B8C` (15% Secondary): Slate Blue cards & structural panels
     - `#F2765E` (15% Tertiary): Vibrant Street Coral CTA buttons, glowing highlights & badges
     - `#F5EBDD` (10% Quaternary): Warm Oat crisp readable typography & accents
   - **Typography System:**
     - Primary UI & Body: *Montserrat* & *Poppins* via Google Fonts
     - Designer Luxury Display: *Avigea* (High-fashion editorial headings)
     - Street Style Display: *Bonskin* & *Gagaille Seconde* (Bold streetwear tags & badges)
   - **Instant Theme Toggle:** Header action button (`#themeToggleBtn`) with sun/moon icon animations, `localStorage` persistence (`hanifa_theme`), and anti-FOUC initialization.
   - **Fluid Motion (60fps):** Scroll reveals, heart pop animation, fly-to-cart particle trajectory, sliding cart drawer, badge bounces, shimmer skeleton loaders, animated SVG checkmark, and celebratory confetti.

---

## 📁 Project Structure

```
Drape/
├── index.html            # Homepage (Hero slider, Categories, Marquee, Trending, Store map)
├── shop.html             # Catalog (Filters by Category/Brand/Price/Rating, Sort, Grid/List view)
├── product.html          # Product Detail (Zoom gallery, Size/Color, Pincode check, Tabs)
├── cart.html             # Dedicated Bag (Quantity stepper, Coupon codes, Free shipping bar)
├── wishlist.html         # Saved Items (Move to Bag, Remove)
├── checkout.html         # 3-Step Checkout (Address, Geolocation, Distance SLA, UPI & COD)
├── order-success.html    # Order Confirmation (Animated checkmark, Confetti, WhatsApp button)
├── about.html            # Madurai Heritage Story since 1985 & Values
├── contact.html          # Store Location, Working Hours, Directions & Form
├── 404.html              # Custom Error Page with Navigation Shortcuts
├── css/
│   ├── variables.css     # Brand tokens, colors, typography, elevations, z-indexes
│   ├── main.css          # Reset, layouts, buttons, form controls, badges
│   ├── components.css    # Glass header, product cards, drawers, modals, toasts, footer
│   ├── animations.css    # 60fps keyframes, scroll reveal, heart burst, checkmark
│   ├── pages.css         # Page-specific layouts
│   └── responsive.css    # 360px to 1440px+ media queries
├── js/
│   ├── config.js         # Store coords, delivery slabs, coupons, UPI settings
│   ├── delivery.js       # Haversine distance, SLA calendar, geocoding engine
│   ├── cart.js           # Cart manager, localStorage persistence, drawer rendering
│   ├── wishlist.js       # Wishlist manager & heart pop triggers
│   ├── products-view.js  # Card generator, catalog filter/sort/search/pagination
│   ├── product-detail.js # Zoom lens, pincode checker, variant selection, tabs
│   ├── checkout.js       # 3-step checkout controller, UPI deep links & QR, COD
│   └── app.js            # Global controller, navbar scroll, search autocomplete, toasts
├── data/
│   └── products.js       # Single-source catalog (43+ products across 4 categories)
└── assets/
    ├── images/
    │   └── logo.png      # Official Hanifa Textiles Madurai Logo
    └── icons/
```

---

## ⚙️ Store Owner Configuration (`/js/config.js`)

All store operational settings can be modified in one single file without touching HTML code:

### 1. Store Coordinates & Address
```javascript
STORE: {
  name: "Hanifa Textiles",
  city: "Madurai",
  address: "South Masi Street, Near Vilakkuthoon, Madurai, Tamil Nadu 625001",
  lat: 9.9155,
  lng: 78.1198,
  phone: "+91 98421 23456",
  whatsapp: "919842123456", // E.164 formatted for WhatsApp links
  mapsLink: "https://maps.app.goo.gl/LUJFigFnc6qnU1Qu6"
}
```

### 2. Merchant UPI ID
```javascript
PAYMENT: {
  merchantUpiId: "hanifatextiles@okaxis", // Change to client's live business VPA
  merchantName: "Hanifa Textiles",
  codEnabled: true,
  codExtraFee: 0
}
```

### 3. Active Promo Codes
```javascript
COUPONS: {
  "HANIFA10": { discountType: "percentage", value: 10, minOrder: 499 },
  "MADURAI50": { discountType: "flat", value: 50, minOrder: 599 },
  "WELCOME15": { discountType: "percentage", value: 15, minOrder: 799 },
  "FESTIVE100": { discountType: "flat", value: 100, minOrder: 1200 }
}
```

---

## 🛍️ Authentic Product Catalog (Educational & Demonstration Purpose)

The product catalog (`/data/products.js`) incorporates **46 authentic products** across the 4 core textile categories, with high-resolution imagery and product specifications gathered strictly for educational demonstration from the 12 authorized retail brands:

1. **Nighties Collection (12 Products):**
   - **VNH Naidu Hall** (`https://vnhnaiduhall.com/collections/womens-nighty`)
   - **Maybell India** (`https://maybellindia.com/collections/women-nightwear`)
   - **Mangai Nighties** (`https://mangainighties.com`)
   - **Poomex Nightwear & Slips** (`https://poomex.in`)
2. **Men's Shirts Collection (12 Products):**
   - **Ramraj Cotton** (`https://ramrajcotton.in/collections/shirts`)
   - **Rare Rabbit / House of Rare** (`https://thehouseofrare.com`)
   - **Otto Store** (`https://www.ottostore.com`)
   - **Benetton India** (`https://in.benetton.com/collections/mens-t-shirts`)
   - **The Souled Store** (`https://www.thesouledstore.com/men`)
   - **Allen Solly** (`https://allensolly.abfrl.in`)
3. **Pants & Trousers Collection (10 Products):**
   - **Rare Rabbit** (Regular Fit Trousers & Chinos)
   - **Otto Store** (Casual Cargo Trousers & Khakis)
   - **The Souled Store** (Vintage Baggy-Fit & Cotton Linen Pants)
   - **Allen Solly** (Solid Casual Trousers & Khaki Chinos)
4. **Family Innerwear Collection (12 Products):**
   - **Prithvi Innerwears** (`https://www.prithviinnerwears.com`)
   - **Ramraj Cotton Innerwear** (`https://ramrajcotton.in/collections/mens-inner-wear`)
   - **Jockey India** (`https://www.jockey.in/collections/cotton-briefs`)
   - **Poomex Innerwear** (`https://poomex.in/product/comfort-pocket-pack-of-3-02/`)

> *Disclaimer: Brand names, logos, product titles, and images are used strictly for educational and portfolio demonstration purposes for Hanifa Textiles.*

---

## 🛍️ How to Add or Edit Products

Adding or modifying products only requires editing **`/data/products.js`**. Each product uses this simple structure:

```javascript
{
  id: "nt-12",
  name: "Kambit Handloom Printed Nighty",
  brand: "Kambit",
  category: "Nighties",
  price: 550,
  mrp: 750,
  discount: 26,
  sizes: ["L", "XL", "XXL"],
  colors: [
    { name: "Madurai Red", hex: "#7A1F2B" },
    { name: "Mustard", hex: "#D4AC0D" }
  ],
  rating: 4.8,
  reviewsCount: 45,
  stock: 20,
  images: [
    "https://your-image-url.com/img1.jpg",
    "https://your-image-url.com/img2.jpg"
  ],
  description: "Description of the product...",
  fabric: "100% Pure Combed Cotton",
  care: "Gentle machine wash with like colors.",
  tags: ["Cotton", "Summer", "Madurai"],
  isTrending: true,
  isNew: true,
  isOffer: false
}
```

---

## 💳 Payment Gateway Handover Notes (Razorpay / Cashfree)

For automated payment gateway processing (credit/debit cards, NetBanking):
1. **Razorpay Integration:**
   - Add `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` in `checkout.html`.
   - In `js/checkout.js`, open `new Razorpay({ key: CONFIG.PAYMENT.razorpayKeyId, amount: totals.grandTotal * 100, ... }).open()`.
2. **Cashfree Integration:**
   - In `checkout.js`, fetch payment session ID from your backend server and call `cashfree.checkout({ paymentSessionId })`.

---

## 📋 Client Handover Checklist

- [x] Tested responsive layouts on Mobile (360px), Tablet (768px), and Desktop (1440px).
- [x] Verified full shopping flow: Home ⟶ Filter Catalog ⟶ Wishlist ⟶ Add to Bag ⟶ Checkout ⟶ Delivery Calculation ⟶ Order Placement.
- [x] Confirmed Geolocation API and fallback pincode table functionality.
- [x] Confirmed UPI Deep links (`upi://pay`) and dynamic QR code generation.
- [x] Verified Sunday-skip dispatch logic.
- [x] Verified WhatsApp prefilled message order notification.
- [x] Validated keyboard accessibility and `:focus-visible` styling.
- [x] Prepared SEO Meta tags and Google JSON-LD LocalBusiness schema.

---

## 👨‍💻 Project Information & Credits

- **Project Name:** Drape
- **Developer:** Mohamed Hanifa ([@mohamedhanifa27](https://github.com/mohamedhanifa27))
- **Email:** mohamedhanifa29042006@gmail.com
- **License:** [MIT License](LICENSE)

---
© 2026 Drape / Hanifa Textiles. Handcrafted for South Masi Street, Madurai, Tamil Nadu, India.
