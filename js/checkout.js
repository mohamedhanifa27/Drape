/**
 * Hanifa Textiles - 3-Step Animated Checkout Controller
 * Step 1: Address + HTML5 Geolocation + Live Pincode Distance
 * Step 2: Shipping Method + Slabs + Sunday-Skipped Dispatch ETA + Smooth Counter
 * Step 3: Payment (UPI Deep-links, Native QR Code, COD, Order Persistence)
 */

const Checkout = {
  currentStep: 1,
  address: {
    fullName: "",
    phone: "",
    email: "",
    house: "",
    area: "",
    city: "",
    state: "Tamil Nadu",
    pincode: ""
  },
  delivery: {
    distanceKm: 4,
    charge: 0,
    etaText: "",
    source: "default"
  },
  payment: {
    method: "upi", // 'upi' | 'cod'
    upiTxnId: ""
  },
  orderId: "",

  init() {
    if (!window.Cart || window.Cart.getItems().length === 0) {
      window.location.href = "cart.html";
      return;
    }

    this.orderId = "HT-" + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);
    this.initStepNavigation();
    this.initAddressForm();
    this.initGeolocation();
    this.initPaymentToggles();
    this.renderOrderSummary();

    // Set initial step
    this.goToStep(1);
  },

  /**
   * Render side summary card
   */
  renderOrderSummary() {
    const summaryList = document.getElementById("checkoutItemsList");
    const subtotalEl = document.getElementById("coSubtotal");
    const discountEl = document.getElementById("coDiscount");
    const deliveryEl = document.getElementById("coDelivery");
    const grandTotalEl = document.getElementById("coGrandTotal");

    if (!window.Cart) return;

    const items = window.Cart.getItems();
    const totals = window.Cart.getTotals(true, this.delivery.distanceKm);

    if (summaryList) {
      summaryList.innerHTML = items.map(item => `
        <div class="checkout-item-row">
          <img src="${item.image}" alt="${item.name}" class="co-thumb" onerror="this.src='assets/images/logo.png'">
          <div class="co-item-info">
            <h5 class="co-title">${item.name}</h5>
            <div class="co-meta">Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</div>
          </div>
          <div class="co-item-price">₹${item.price * item.quantity}</div>
        </div>
      `).join("");
    }

    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal}`;
    if (discountEl) {
      if (totals.discount > 0) {
        discountEl.textContent = `-₹${totals.discount}`;
        discountEl.parentElement.style.display = "flex";
      } else {
        discountEl.parentElement.style.display = "none";
      }
    }

    if (deliveryEl) {
      deliveryEl.innerHTML = totals.deliveryFee === 0 
        ? `<span class="text-success font-semibold">FREE</span>` 
        : `₹${totals.deliveryFee}`;
    }

    if (grandTotalEl) {
      const prevTotal = Number(grandTotalEl.getAttribute("data-val") || totals.grandTotal);
      if (window.App) {
        window.App.animateCount(grandTotalEl, prevTotal, totals.grandTotal, 400);
      } else {
        grandTotalEl.textContent = `₹${totals.grandTotal}`;
      }
      grandTotalEl.setAttribute("data-val", totals.grandTotal);
    }
  },

  /**
   * Navigate between the 3 steps
   */
  goToStep(stepNumber) {
    this.currentStep = stepNumber;

    // Step indicators
    document.querySelectorAll(".step-indicator").forEach(ind => {
      const step = Number(ind.getAttribute("data-step"));
      if (step < stepNumber) {
        ind.className = "step-indicator completed";
      } else if (step === stepNumber) {
        ind.className = "step-indicator active";
      } else {
        ind.className = "step-indicator pending";
      }
    });

    // Step cards
    document.querySelectorAll(".checkout-step-panel").forEach(panel => {
      const step = Number(panel.getAttribute("data-step"));
      if (step === stepNumber) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // If entering Step 3, generate QR and UPI deep links
    if (stepNumber === 3) {
      this.generateUpiDetails();
    }

    window.scrollTo({ top: 120, behavior: "smooth" });
  },

  /**
   * Step navigation button listeners
   */
  initStepNavigation() {
    const toStep2Btn = document.getElementById("btnToStep2");
    const backToStep1Btn = document.getElementById("btnBackToStep1");
    const toStep3Btn = document.getElementById("btnToStep3");
    const backToStep2Btn = document.getElementById("btnBackToStep2");
    const placeOrderBtn = document.getElementById("btnPlaceOrder");

    if (toStep2Btn) {
      toStep2Btn.addEventListener("click", () => {
        if (this.validateAddress()) {
          this.calculateAndShowShipping();
          this.goToStep(2);
        }
      });
    }

    if (backToStep1Btn) {
      backToStep1Btn.addEventListener("click", () => this.goToStep(1));
    }

    if (toStep3Btn) {
      toStep3Btn.addEventListener("click", () => this.goToStep(3));
    }

    if (backToStep2Btn) {
      backToStep2Btn.addEventListener("click", () => this.goToStep(2));
    }

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => this.processFinalOrder());
    }
  },

  /**
   * Address input listeners
   */
  initAddressForm() {
    const pincodeInput = document.getElementById("coPincode");
    if (pincodeInput) {
      pincodeInput.addEventListener("input", (e) => {
        const val = e.target.value.trim().replace(/\D/g, "");
        if (val.length === 6) {
          this.handleLivePincodeCheck(val);
        }
      });
    }
  },

  /**
   * Instant live estimation when pincode is entered
   */
  async handleLivePincodeCheck(pincode) {
    const liveIndicator = document.getElementById("pincodeLiveInfo");
    if (liveIndicator) {
      liveIndicator.innerHTML = `<span class="calc-pulse">Computing fastest route from Madurai store...</span>`;
    }

    if (window.DeliveryEngine) {
      const dest = await window.DeliveryEngine.calculateDistance(pincode);
      this.delivery.distanceKm = dest.distanceKm;
      this.delivery.source = dest.source;

      const cityInput = document.getElementById("coCity");
      const stateInput = document.getElementById("coState");
      if (cityInput && !cityInput.value && dest.city) cityInput.value = dest.city;
      if (stateInput && !stateInput.value && dest.state) stateInput.value = dest.state;

      const chargeInfo = window.DeliveryEngine.getDeliveryCharge(dest.distanceKm, window.Cart.getTotals().subtotal);
      const eta = window.DeliveryEngine.getEstimatedDeliveryDates(dest.distanceKm);

      if (liveIndicator) {
        liveIndicator.innerHTML = `
          <div class="live-pincode-card">
            <span>📍 ~<strong>${dest.distanceKm} km</strong> from Madurai (${dest.city})</span>
            <span>🚚 ${chargeInfo.isFree ? "<strong>FREE Delivery</strong>" : `₹${chargeInfo.charge} shipping`}</span>
            <span>⏱️ <strong>${eta.formattedSummary}</strong></span>
          </div>
        `;
      }

      this.renderOrderSummary();
    }
  },

  /**
   * Geolocation button integration ("Use my current location")
   */
  initGeolocation() {
    const geoBtn = document.getElementById("btnUseCurrentLocation");
    if (!geoBtn) return;

    geoBtn.addEventListener("click", () => {
      if (!("geolocation" in navigator)) {
        if (window.App) window.App.showToast("Geolocation is not supported by your browser.", "error");
        return;
      }

      geoBtn.classList.add("loading");
      geoBtn.innerHTML = `<span>Detecting location...</span>`;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Road distance calculation
          if (window.DeliveryEngine) {
            this.delivery.distanceKm = window.DeliveryEngine.getRoadDistance(lat, lng);
          }

          // Reverse Geocoding with OpenStreetMap Nominatim
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              { headers: { "Accept-Language": "en" } }
            );
            if (resp.ok) {
              const data = await resp.json();
              const addr = data.address || {};

              const houseInput = document.getElementById("coHouse");
              const areaInput = document.getElementById("coArea");
              const cityInput = document.getElementById("coCity");
              const stateInput = document.getElementById("coState");
              const pincodeInput = document.getElementById("coPincode");

              if (pincodeInput && addr.postcode) pincodeInput.value = addr.postcode;
              if (cityInput && (addr.city || addr.town || addr.village || addr.county)) {
                cityInput.value = addr.city || addr.town || addr.village || addr.county;
              }
              if (stateInput && addr.state) stateInput.value = addr.state;
              if (areaInput && (addr.suburb || addr.neighbourhood || addr.road)) {
                areaInput.value = [addr.suburb, addr.neighbourhood, addr.road].filter(Boolean).join(", ");
              }

              if (window.App) window.App.showToast("Location detected successfully!", "success");
              if (addr.postcode) this.handleLivePincodeCheck(addr.postcode);
            }
          } catch (e) {
            console.warn("Reverse geocode failed, using lat/lng distance directly", e);
            if (window.App) window.App.showToast("Location coordinates identified.", "info");
          } finally {
            geoBtn.classList.remove("loading");
            geoBtn.innerHTML = `<span>📍 Use My Current Location</span>`;
            this.renderOrderSummary();
          }
        },
        (error) => {
          console.error("Geolocation error", error);
          geoBtn.classList.remove("loading");
          geoBtn.innerHTML = `<span>📍 Use My Current Location</span>`;
          if (window.App) {
            window.App.showToast("Could not access location. Please enter your pincode manually.", "info");
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  },

  /**
   * Validate Form in Step 1
   */
  validateAddress() {
    const name = document.getElementById("coName")?.value.trim();
    const phone = document.getElementById("coPhone")?.value.trim();
    const house = document.getElementById("coHouse")?.value.trim();
    const area = document.getElementById("coArea")?.value.trim();
    const city = document.getElementById("coCity")?.value.trim();
    const state = document.getElementById("coState")?.value.trim();
    const pincode = document.getElementById("coPincode")?.value.trim();

    if (!name || !phone || !house || !area || !city || !pincode) {
      if (window.App) window.App.showToast("Please fill in all required address fields.", "error");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      if (window.App) window.App.showToast("Please enter a valid 10-digit Indian phone number.", "error");
      return false;
    }

    if (pincode.length !== 6) {
      if (window.App) window.App.showToast("Please enter a valid 6-digit PIN code.", "error");
      return false;
    }

    this.address = {
      fullName: name,
      phone,
      email: document.getElementById("coEmail")?.value.trim() || "",
      house,
      area,
      city,
      state,
      pincode
    };

    return true;
  },

  /**
   * Setup Shipping Slab & Transit Display in Step 2
   */
  calculateAndShowShipping() {
    if (!window.DeliveryEngine) return;

    const totals = window.Cart.getTotals(false);
    const distanceKm = this.delivery.distanceKm || 4;
    const chargeInfo = window.DeliveryEngine.getDeliveryCharge(distanceKm, totals.subtotal);
    const eta = window.DeliveryEngine.getEstimatedDeliveryDates(distanceKm);

    this.delivery.charge = chargeInfo.charge;
    this.delivery.etaText = eta.formattedSummary;

    const shippingInfoEl = document.getElementById("shippingRouteInfo");
    if (shippingInfoEl) {
      shippingInfoEl.innerHTML = `
        <div class="shipping-details-card">
          <div class="route-header">
            <span class="route-hub">Store: South Masi St, Madurai</span>
            <span class="route-arrow">⟶</span>
            <span class="route-dest">${this.address.city} (${this.address.pincode})</span>
          </div>

          <div class="metrics-grid">
            <div class="metric-box">
              <label>Road Distance</label>
              <strong>~${distanceKm} km</strong>
            </div>
            <div class="metric-box">
              <label>Estimated Arrival</label>
              <strong class="text-primary">${eta.formattedSummary}</strong>
            </div>
            <div class="metric-box">
              <label>Shipping Charge</label>
              <strong>${chargeInfo.isFree ? "<span class='text-success'>FREE (Orders > ₹999)</span>" : `₹${chargeInfo.charge}`}</strong>
            </div>
          </div>

          <div class="dispatch-notice">
            <span>ℹ️ Dispatches from our Madurai central retail store tomorrow morning. (Sunday orders dispatch Monday).</span>
          </div>
        </div>
      `;
    }

    this.renderOrderSummary();
  },

  /**
   * Payment Mode Toggles (UPI vs COD)
   */
  initPaymentToggles() {
    const upiRadio = document.getElementById("payMethodUpi");
    const codRadio = document.getElementById("payMethodCod");
    const upiBox = document.getElementById("upiPaymentContainer");
    const codBox = document.getElementById("codPaymentContainer");

    const updateView = () => {
      if (upiRadio && upiRadio.checked) {
        this.payment.method = "upi";
        if (upiBox) upiBox.style.display = "block";
        if (codBox) codBox.style.display = "none";
      } else if (codRadio && codRadio.checked) {
        this.payment.method = "cod";
        if (upiBox) upiBox.style.display = "none";
        if (codBox) codBox.style.display = "block";
      }
    };

    if (upiRadio) upiRadio.addEventListener("change", updateView);
    if (codRadio) codRadio.addEventListener("change", updateView);
  },

  /**
   * Generate Dynamic UPI Deep Links & Real-Time Pure SVG QR Code
   */
  generateUpiDetails() {
    const totals = window.Cart.getTotals(true, this.delivery.distanceKm);
    const amount = totals.grandTotal;
    const vpa = (window.CONFIG && window.CONFIG.PAYMENT && window.CONFIG.PAYMENT.merchantUpiId) || "drape.madurai@okhdfcbank";
    const name = encodeURIComponent("Drape");
    const note = encodeURIComponent(`Order ${this.orderId}`);

    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;

    // Mobile App Specific Deep Links
    const gpayLink = document.getElementById("btnPayGPay");
    const phonepeLink = document.getElementById("btnPayPhonePe");
    const paytmLink = document.getElementById("btnPayPaytm");
    const genericUpiLink = document.getElementById("btnPayGenericUpi");

    if (gpayLink) gpayLink.href = upiUri;
    if (phonepeLink) phonepeLink.href = upiUri;
    if (paytmLink) paytmLink.href = upiUri;
    if (genericUpiLink) genericUpiLink.href = upiUri;

    // Display order amount on UPI screen
    const upiAmountDisplay = document.getElementById("upiAmountDisplay");
    if (upiAmountDisplay) upiAmountDisplay.textContent = `₹${amount}`;

    // Render Drape Official UPI Payment QR Code
    const qrContainer = document.getElementById("upiQrCanvasContainer");
    if (qrContainer) {
      qrContainer.innerHTML = `
        <div class="qr-code-frame">
          <img src="assets/images/drape-payment-qr.jpeg" alt="Drape Official UPI Payment QR Code - Pay ₹${amount}" class="qr-code-img"
               onerror="this.onerror=null; this.src='drape Payment QR.jpeg';">
          <div class="qr-caption" style="margin-top:10px; font-weight:600; font-size:0.85rem; color:#1D1D1F;">
            Scan with GPay, PhonePe, Paytm, or BHIM
          </div>
          <div style="font-size:0.75rem; color:var(--color-primary); font-weight:700; margin-top:4px;">
            Official Drape Store QR • Total: ₹${amount}
          </div>
        </div>
      `;
    }
  },

  /**
   * Process & Finalize Order (Saves to localStorage and redirects to success)
   */
  processFinalOrder() {
    const totals = window.Cart.getTotals(true, this.delivery.distanceKm);

    if (this.payment.method === "upi") {
      const txnIdInput = document.getElementById("upiTxnIdInput");
      const txnId = txnIdInput ? txnIdInput.value.trim() : "";
      if (!txnId) {
        if (window.App) window.App.showToast("Please enter the 12-digit UPI Transaction / UTR Number to confirm payment.", "error");
        if (txnIdInput) txnIdInput.focus();
        return;
      }
      this.payment.upiTxnId = txnId;
    }

    const orderRecord = {
      orderId: this.orderId,
      date: new Date().toISOString(),
      customer: this.address,
      items: window.Cart.getItems(),
      totals,
      delivery: {
        distanceKm: this.delivery.distanceKm,
        charge: totals.deliveryFee,
        eta: this.delivery.etaText || "Arrives in 2-3 business days",
        hub: "Drape, South Masi Street, Madurai"
      },
      payment: {
        method: this.payment.method.toUpperCase(),
        status: this.payment.method === "upi" ? "PAID_VERIFYING" : "CASH_ON_DELIVERY",
        upiTxnId: this.payment.upiTxnId || null
      }
    };

    // Save to order history in localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem("hanifa_orders") || "[]");
      existingOrders.unshift(orderRecord);
      localStorage.setItem("hanifa_orders", JSON.stringify(existingOrders));
      // Save current order as latest for immediate success page rendering
      sessionStorage.setItem("hanifa_latest_order", JSON.stringify(orderRecord));
    } catch (e) {
      console.error("Failed to persist order to storage", e);
    }

    // Clear cart
    window.Cart.clear();

    // Redirect to Order Success
    window.location.href = `order-success.html?orderId=${this.orderId}`;
  }
};

// Auto init on checkout load
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("btnToStep2")) {
    Checkout.init();
  }
});

if (typeof window !== "undefined") {
  window.Checkout = Checkout;
}
