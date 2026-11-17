/**
 * Hanifa Textiles - Global Configuration
 * Centralized settings for Store details, Delivery calculation, Shipping slabs,
 * Coupons, and Payment Gateway integration.
 */

const CONFIG = {
  // Store Physical Location & Contact Info
  STORE: {
    name: "Drape",
    tagline: "Contemporary & Classic Textiles • Madurai Since 1985",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    address: "South Masi Street, Near Vilakkuthoon, Madurai, Tamil Nadu 625001",
    pincode: "625001",
    lat: 9.9155,       // South Masi Street Corridor, Madurai
    lng: 78.1198,
    phone: "+91 98421 23456",
    altPhone: "+91 452 2345678",
    whatsapp: "919842123456", // E.164 formatted number for wa.me links
    email: "care@drape.in",
    mapsLink: "https://maps.app.goo.gl/LUJFigFnc6qnU1Qu6",
    workingHours: "Monday – Saturday: 9:30 AM to 9:30 PM | Sunday: 10:00 AM to 8:30 PM"
  },

  // Road distance correction factor applied to Haversine straight-line distance
  ROAD_DISTANCE_MULTIPLIER: 1.3,

  // Free delivery threshold in INR
  FREE_DELIVERY_THRESHOLD: 999,

  // Delivery charge slabs based on road distance (in km)
  DELIVERY_SLABS: [
    { maxKm: 10, charge: 0, label: "Local Madurai Delivery (Free)" },
    { maxKm: 50, charge: 40, label: "Madurai Suburbs & Nearby Towns" },
    { maxKm: 150, charge: 70, label: "Southern Tamil Nadu (Trichy, Dindigul, Tirunelveli)" },
    { maxKm: 400, charge: 110, label: "Across Tamil Nadu (Coimbatore, Salem, Chennai)" },
    { maxKm: Infinity, charge: 150, label: "All-India Express Delivery" }
  ],

  // Transit days added to dispatch day (Skipping Sundays)
  TRANSIT_TIME_SLABS: [
    { maxKm: 50, minDays: 0, maxDays: 1, label: "Same / Next Day Delivery" },
    { maxKm: 200, minDays: 1, maxDays: 2, label: "1 to 2 Days Express Transit" },
    { maxKm: 500, minDays: 2, maxDays: 3, label: "2 to 3 Days Standard Transit" },
    { maxKm: Infinity, minDays: 3, maxDays: 4, label: "3 to 4 Days Pan-India Transit" }
  ],

  // Fallback Pincode-to-Distance Table (Ensures instant, zero-failure delivery estimation)
  // Approximate road distance from South Masi St, Madurai (625001)
  FALLBACK_PINCODES: {
    // Madurai Metro & Suburbs (0 - 15 km)
    "625001": { city: "Madurai Town", state: "Tamil Nadu", distanceKm: 2 },
    "625002": { city: "Madurai South", state: "Tamil Nadu", distanceKm: 4 },
    "625003": { city: "Madurai West", state: "Tamil Nadu", distanceKm: 5 },
    "625009": { city: "Tallakulam, Madurai", state: "Tamil Nadu", distanceKm: 6 },
    "625016": { city: "K.K. Nagar, Madurai", state: "Tamil Nadu", distanceKm: 7 },
    "625020": { city: "Anna Nagar, Madurai", state: "Tamil Nadu", distanceKm: 8 },
    "625006": { city: "Teppakulam, Madurai", state: "Tamil Nadu", distanceKm: 6 },
    "625014": { city: "Tirunagar, Madurai", state: "Tamil Nadu", distanceKm: 11 },
    "625008": { city: "Thiruparankundram, Madurai", state: "Tamil Nadu", distanceKm: 9 },

    // Surrounding Districts & Central Tamil Nadu (15 - 150 km)
    "624001": { city: "Dindigul", state: "Tamil Nadu", distanceKm: 68 },
    "626001": { city: "Virudhunagar", state: "Tamil Nadu", distanceKm: 55 },
    "626123": { city: "Sivakasi", state: "Tamil Nadu", distanceKm: 75 },
    "630001": { city: "Karaikudi", state: "Tamil Nadu", distanceKm: 88 },
    "623501": { city: "Ramanathapuram", state: "Tamil Nadu", distanceKm: 115 },
    "620001": { city: "Tiruchirappalli (Trichy)", state: "Tamil Nadu", distanceKm: 138 },
    "628001": { city: "Thoothukudi (Tuticorin)", state: "Tamil Nadu", distanceKm: 145 },
    "627001": { city: "Tirunelveli", state: "Tamil Nadu", distanceKm: 155 },

    // Western & Northern Tamil Nadu (150 - 450 km)
    "624601": { city: "Palani", state: "Tamil Nadu", distanceKm: 115 },
    "641001": { city: "Coimbatore", state: "Tamil Nadu", distanceKm: 215 },
    "638001": { city: "Erode", state: "Tamil Nadu", distanceKm: 195 },
    "636001": { city: "Salem", state: "Tamil Nadu", distanceKm: 235 },
    "639001": { city: "Karur", state: "Tamil Nadu", distanceKm: 140 },
    "613001": { city: "Thanjavur", state: "Tamil Nadu", distanceKm: 175 },
    "600001": { city: "Chennai (Central)", state: "Tamil Nadu", distanceKm: 462 },
    "600028": { city: "Chennai (Mylapore)", state: "Tamil Nadu", distanceKm: 458 },
    "600040": { city: "Chennai (Anna Nagar)", state: "Tamil Nadu", distanceKm: 465 },
    "643001": { city: "Ooty (Nilgiris)", state: "Tamil Nadu", distanceKm: 295 },
    "629001": { city: "Nagercoil (Kanyakumari)", state: "Tamil Nadu", distanceKm: 235 },

    // Neighboring States Major Hubs (250 - 600 km)
    "560001": { city: "Bengaluru", state: "Karnataka", distanceKm: 435 },
    "695001": { city: "Thiruvananthapuram", state: "Kerala", distanceKm: 260 },
    "682001": { city: "Kochi (Cochin)", state: "Kerala", distanceKm: 275 },
    "500001": { city: "Hyderabad", state: "Telangana", distanceKm: 990 }
  },

  // Payment Gateways & Merchant Info
  PAYMENT: {
    // UPI Configuration
    merchantUpiId: "drape.madurai@okhdfcbank", // Active VPA
    merchantName: "Drape",
    upiCurrency: "INR",

    // Cash on Delivery
    codEnabled: true,
    codExtraFee: 0, // ₹0 default; can be set to e.g. 30 if handling fee required

    /**
     * PRODUCTION INTEGRATION GUIDE FOR CLIENT:
     * -------------------------------------------------------------
     * To activate automated payment verification via Razorpay or Cashfree:
     * 1. RAZORPAY:
     *    - Include script: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
     *    - In checkout.js, trigger new Razorpay({ key: "rzp_live_xxx", amount: total * 100, ... }).open()
     * 2. CASHFREE:
     *    - Include Cashfree JS SDK and call cashfree.checkout({ paymentSessionId: session.id })
     */
    razorpayKeyId: "rzp_test_placeholder_key", // Put client live key here
    cashfreeAppId: "cashfree_placeholder_appid"
  },

  // Active Promo / Coupon Codes
  COUPONS: {
    "DRAPE10": {
      discountType: "percentage",
      value: 10,
      minOrder: 499,
      description: "10% OFF on all items (min order ₹499)"
    },
    "HANIFA10": {
      discountType: "percentage",
      value: 10,
      minOrder: 499,
      description: "10% OFF on all items (min order ₹499)"
    },
    "MADURAI50": {
      discountType: "flat",
      value: 50,
      minOrder: 599,
      description: "Flat ₹50 OFF for Madurai Region orders (min order ₹599)"
    },
    "WELCOME15": {
      discountType: "percentage",
      value: 15,
      minOrder: 799,
      description: "15% OFF for new family members (min order ₹799)"
    },
    "FESTIVE100": {
      discountType: "flat",
      value: 100,
      minOrder: 1200,
      description: "Flat ₹100 Festive Celebration Discount (min order ₹1200)"
    }
  },

  // Certified Brand System integration
  get BRANDS() {
    return (typeof window !== "undefined" && window.BRANDS) ? window.BRANDS : {};
  }
};

// Expose globally
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
