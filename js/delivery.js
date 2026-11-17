/**
 * Hanifa Textiles - Delivery & Logistics Engine
 * Real-time geocoding, Haversine road-corrected distance calculation,
 * SLA/dispatch calendar computation (Sunday skipping), and slab charges.
 */

const DeliveryEngine = {
  getConfig() {
    if (typeof window !== "undefined" && window.CONFIG) return window.CONFIG;
    if (typeof global !== "undefined" && global.CONFIG) return global.CONFIG;
    return {};
  },

  /**
   * Convert Degrees to Radians
   */
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  /**
   * Calculate straight-line Haversine distance in kilometers between two GPS coordinates
   */
  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Calculate road-approximate distance in km from Hanifa Textiles (Madurai)
   */
  getRoadDistance(destLat, destLng) {
    const cfg = this.getConfig();
    const store = cfg.STORE || { lat: 9.9155, lng: 78.1198 };
    const multiplier = cfg.ROAD_DISTANCE_MULTIPLIER || 1.3;
    const directKm = this.haversine(store.lat, store.lng, destLat, destLng);
    return Math.max(1, Math.round(directKm * multiplier));
  },

  /**
   * Geocode a destination using OpenStreetMap Nominatim with Fallback Cache
   * @param {string} pincode 6-digit Indian PIN code
   * @param {string} city Optional city/area name
   * @returns {Promise<{ distanceKm: number, city: string, state: string, source: string }>}
   */
  async calculateDistance(pincode, city = "") {
    const cleanPincode = (pincode || "").toString().trim().replace(/\D/g, "");
    const cfg = this.getConfig();
    const fallbackTable = cfg.FALLBACK_PINCODES || {};

    // 1. Instant check in fallback pincode table
    if (cleanPincode && fallbackTable[cleanPincode]) {
      const match = fallbackTable[cleanPincode];
      return {
        distanceKm: match.distanceKm,
        city: match.city,
        state: match.state,
        source: "instant_table"
      };
    }

    // If pincode is not 6 digits and no city provided, default to Madurai local
    if (cleanPincode.length !== 6 && !city) {
      return {
        distanceKm: 4,
        city: "Madurai Central",
        state: "Tamil Nadu",
        source: "default_local"
      };
    }

    // 2. Query OpenStreetMap Nominatim API
    try {
      const queryParts = [];
      if (cleanPincode) queryParts.push(cleanPincode);
      if (city) queryParts.push(city);
      queryParts.push("India");
      const searchQuery = encodeURIComponent(queryParts.join(", "));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=in&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "HanifaTextilesDeliveryEngine/1.0"
          },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const destLat = parseFloat(results[0].lat);
          const destLng = parseFloat(results[0].lon);
          const roadKm = this.getRoadDistance(destLat, destLng);
          return {
            distanceKm: roadKm,
            city: results[0].display_name ? results[0].display_name.split(",")[0] : (city || "Detected City"),
            state: "Tamil Nadu",
            source: "nominatim_api"
          };
        }
      }
    } catch (err) {
      console.warn("Nominatim geocoding timed out or offline, activating heuristic fallback:", err);
    }

    // 3. Intelligent Heuristic Fallback by Indian Postal Circle (Pincode Prefix)
    let estimatedKm = 150;
    if (cleanPincode.startsWith("625")) estimatedKm = 8;        // Madurai & nearby taluks
    else if (cleanPincode.startsWith("624")) estimatedKm = 70;  // Dindigul
    else if (cleanPincode.startsWith("626")) estimatedKm = 65;  // Virudhunagar/Sivakasi
    else if (cleanPincode.startsWith("627")) estimatedKm = 160; // Tirunelveli
    else if (cleanPincode.startsWith("628")) estimatedKm = 150; // Tuticorin
    else if (cleanPincode.startsWith("620")) estimatedKm = 138; // Trichy
    else if (cleanPincode.startsWith("641")) estimatedKm = 215; // Coimbatore
    else if (cleanPincode.startsWith("638")) estimatedKm = 195; // Erode
    else if (cleanPincode.startsWith("636")) estimatedKm = 235; // Salem
    else if (cleanPincode.startsWith("600")) estimatedKm = 460; // Chennai
    else if (cleanPincode.startsWith("6")) estimatedKm = 250;   // Rest of TN / Kerala
    else if (cleanPincode.startsWith("5")) estimatedKm = 480;   // AP / Karnataka / Telangana
    else estimatedKm = 900;                                     // North / East / West India

    return {
      distanceKm: estimatedKm,
      city: city || (cleanPincode.startsWith("625") ? "Madurai Area" : "Tamil Nadu"),
      state: "India",
      source: "heuristic_postal"
    };
  },

  /**
   * Determine Delivery Charge in INR based on road distance and order subtotal
   */
  getDeliveryCharge(distanceKm, subtotal = 0) {
    const cfg = this.getConfig();
    const freeThreshold = cfg.FREE_DELIVERY_THRESHOLD || 999;
    if (subtotal >= freeThreshold) {
      return {
        charge: 0,
        isFree: true,
        reason: `Orders above ₹${freeThreshold} qualify for FREE delivery!`
      };
    }

    const slabs = cfg.DELIVERY_SLABS || [
      { maxKm: 10, charge: 0 },
      { maxKm: 50, charge: 40 },
      { maxKm: 150, charge: 70 },
      { maxKm: 400, charge: 110 },
      { maxKm: Infinity, charge: 150 }
    ];

    for (const slab of slabs) {
      if (distanceKm <= slab.maxKm) {
        return {
          charge: slab.charge,
          isFree: slab.charge === 0,
          reason: slab.charge === 0 ? "Local Madurai Delivery (Free)" : `Standard Shipping (₹${slab.charge})`
        };
      }
    }

    return { charge: 150, isFree: false, reason: "National Express Shipping" };
  },

  /**
   * Calculate Dispatch & Arrival ETA Date Range
   * Rule:
   * - Dispatch starts 1 day AFTER the order date.
   * - If the dispatch day is Sunday (store closed), roll forward to Monday!
   * - Transit days added according to distance slabs.
   */
  getEstimatedDeliveryDates(distanceKm, orderDate = new Date()) {
    // Determine Dispatch Date (next day)
    let dispatchDate = new Date(orderDate);
    dispatchDate.setDate(dispatchDate.getDate() + 1);

    // If dispatch falls on Sunday (day 0), move to Monday
    if (dispatchDate.getDay() === 0) {
      dispatchDate.setDate(dispatchDate.getDate() + 1);
    }

    // Determine Transit Days based on distance
    let minTransit = 0;
    let maxTransit = 1;

    if (distanceKm <= 50) {
      minTransit = 0;
      maxTransit = 1;
    } else if (distanceKm <= 200) {
      minTransit = 1;
      maxTransit = 2;
    } else if (distanceKm <= 500) {
      minTransit = 2;
      maxTransit = 3;
    } else {
      minTransit = 3;
      maxTransit = 4;
    }

    const arrivalStartDate = new Date(dispatchDate);
    arrivalStartDate.setDate(arrivalStartDate.getDate() + minTransit);

    const arrivalEndDate = new Date(dispatchDate);
    arrivalEndDate.setDate(arrivalEndDate.getDate() + maxTransit);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const startMonth = monthNames[arrivalStartDate.getMonth()];
    const endMonth = monthNames[arrivalEndDate.getMonth()];
    const startDay = arrivalStartDate.getDate();
    const endDay = arrivalEndDate.getDate();
    const startDayOfWeek = dayNames[arrivalStartDate.getDay()];
    const endDayOfWeek = dayNames[arrivalEndDate.getDay()];

    let dateRangeText = "";
    if (startMonth === endMonth) {
      if (startDay === endDay) {
        dateRangeText = `${startDayOfWeek}, ${startDay} ${startMonth}`;
      } else {
        dateRangeText = `${startDay} – ${endDay} ${startMonth}`;
      }
    } else {
      dateRangeText = `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
    }

    return {
      dispatchDate,
      arrivalStartDate,
      arrivalEndDate,
      dateRangeText,
      formattedSummary: `Arrives ${dateRangeText}`
    };
  }
};

// Global attachment
if (typeof window !== "undefined") {
  window.DeliveryEngine = DeliveryEngine;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = DeliveryEngine;
}
