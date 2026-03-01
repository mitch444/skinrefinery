(function () {
  "use strict";

  var STORAGE_KEY = "demoBookings";

  var SERVICE_LIBRARY = {
    botox: {
      label: "Botox / Dysport (Neuromodulator)",
      startingPrice: "From $9 / unit",
      category: "injectables"
    },
    medical_botox: {
      label: "Medical Botox",
      startingPrice: "From $9 / unit",
      category: "injectables"
    },
    lip_flip: {
      label: "Lip Flip",
      startingPrice: "$100",
      category: "injectables"
    },
    mini_lip_filler: {
      label: "Mini Lip Filler (0.5 mL)",
      startingPrice: "$300",
      category: "injectables"
    },
    full_lip_filler: {
      label: "Full Lip Filler (1.0 mL)",
      startingPrice: "$600",
      category: "injectables"
    },
    facial_balancing_filler: {
      label: "Facial Balancing Filler",
      startingPrice: "Custom Pricing",
      category: "injectables"
    },
    skinpen_microneedling: {
      label: "SkinPen Microneedling",
      startingPrice: "$375",
      category: "skin"
    },
    prf_eye_brightening: {
      label: "PRF Eye Brightening",
      startingPrice: "$350",
      category: "regenerative"
    },
    prp_hair_skin_rejuvenation: {
      label: "PRP Hair & Skin Rejuvenation",
      startingPrice: "From $400",
      category: "regenerative"
    },
    hyaluronidase_filler_dissolve: {
      label: "Hyaluronidase Filler Dissolve",
      startingPrice: "$200",
      category: "injectables"
    },
    tca_chemical_peel: {
      label: "TCA Medical Grade Chemical Peel",
      startingPrice: "$200",
      category: "skin"
    },
    consultation_new_patients: {
      label: "Consultation (New Patients)",
      startingPrice: "Free",
      category: "consultation"
    }
  };

  var SERVICE_ALIASES = {
    lip_filler: "full_lip_filler"
  };

  var CATEGORY_OPTIONS = [
    {
      id: "injectables",
      title: "Injectables",
      description: "Botox, filler, and precision structural treatments."
    },
    {
      id: "skin",
      title: "Skin",
      description: "Texture, tone, and clinical resurfacing pathways."
    },
    {
      id: "regenerative",
      title: "Regenerative",
      description: "Biostimulation and platelet-based rejuvenation."
    },
    {
      id: "consultation",
      title: "Consultation",
      description: "A strategic first visit with phased treatment planning."
    }
  ];

  var TIME_OPTIONS = ["9:30 AM", "11:00 AM", "1:30 PM", "3:30 PM"];

  // --- BUNDLE ENGINE START ---
  var SERVICE_BENEFITS = {
    botox: "Smooths dynamic expression lines with precise dosing.",
    medical_botox: "Targets functional concerns while preserving natural expression.",
    lip_flip: "Creates a subtle upper-lip lift without added volume.",
    mini_lip_filler: "Refines hydration and edge definition with conservative volume.",
    full_lip_filler: "Builds balanced lip structure, support, and shape.",
    facial_balancing_filler: "Improves profile support and facial harmony.",
    skinpen_microneedling: "Improves texture, pores, and overall skin quality.",
    prf_eye_brightening: "Supports under-eye brightness and tissue quality.",
    prp_hair_skin_rejuvenation: "Stimulates regenerative response for skin and hair.",
    hyaluronidase_filler_dissolve: "Resets filler placement when correction is needed.",
    tca_chemical_peel: "Refines tone, pigment irregularities, and fine texture.",
    consultation_new_patients: "Builds a phased plan aligned to your goals."
  };

  const BUNDLE_LOGIC = {
    botox: {
      crossSell: ["skinpen_microneedling", "prf_eye_brightening"],
      bundle: {
        id: "smooth_and_glow",
        label: "Smooth & Glow Package",
        includes: ["botox", "skinpen_microneedling"],
        valueMessage: "Improves both dynamic wrinkles and skin texture.",
        incentive: "Save $75 when booked together"
      }
    },
    full_lip_filler: {
      crossSell: ["lip_flip", "tca_chemical_peel"],
      bundle: {
        id: "lip_enhancement_plus",
        label: "Lip Enhancement Plus",
        includes: ["full_lip_filler", "lip_flip"],
        valueMessage: "Enhances both structure and subtle upper lip lift.",
        incentive: "Priority follow-up included"
      }
    },
    skinpen_microneedling: {
      crossSell: ["tca_chemical_peel", "prf_eye_brightening"]
    }
  };
  // --- BUNDLE ENGINE END ---

  function dedupeValues(values) {
    return values.filter(function (value, index) {
      return values.indexOf(value) === index;
    });
  }

  function normalizeService(value) {
    var normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

    if (SERVICE_ALIASES[normalized]) {
      return SERVICE_ALIASES[normalized];
    }

    return normalized;
  }

  function normalizeCategory(value) {
    var normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

    if (CATEGORY_OPTIONS.some(function (option) { return option.id === normalized; })) {
      return normalized;
    }

    return "";
  }

  function collectServices(input) {
    var rawValues = [];

    if (Array.isArray(input)) {
      rawValues = input;
    } else if (typeof input === "string") {
      rawValues = input.split(",");
    } else if (input !== null && input !== undefined) {
      rawValues = [String(input)];
    }

    return dedupeValues(
      rawValues
        .map(normalizeService)
        .filter(function (serviceKey) {
          return Boolean(SERVICE_LIBRARY[serviceKey]);
        })
    );
  }

  function collectInitialServices(opts) {
    var collected = [];

    collected = collected.concat(collectServices(opts.preselectedServices));
    collected = collected.concat(collectServices(opts.preselectedService));

    return dedupeValues(collected);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getServiceLabel(serviceKey) {
    return SERVICE_LIBRARY[serviceKey] ? SERVICE_LIBRARY[serviceKey].label : "Customized Consultation";
  }

  function getServicePrice(serviceKey) {
    return SERVICE_LIBRARY[serviceKey] ? SERVICE_LIBRARY[serviceKey].startingPrice : "From $150";
  }

  function getServiceCategory(serviceKey) {
    return SERVICE_LIBRARY[serviceKey] ? SERVICE_LIBRARY[serviceKey].category : "consultation";
  }

  function getServicesForCategory(categoryId) {
    return Object.keys(SERVICE_LIBRARY).filter(function (key) {
      return SERVICE_LIBRARY[key].category === categoryId;
    });
  }

  // --- BUNDLE ENGINE START ---
  function getServiceBenefit(serviceKey) {
    return SERVICE_BENEFITS[serviceKey] || "Designed to complement and strengthen treatment outcomes.";
  }

  function getPlanTierLabel(totalServices) {
    if (totalServices >= 3) {
      return "Comprehensive Rejuvenation Plan";
    }

    if (totalServices === 2) {
      return "Advanced Plan";
    }

    return "Single Treatment Plan";
  }

  function collectBundleSuggestions(selectedServices) {
    var crossSell = [];
    var bundles = [];

    selectedServices.forEach(function (serviceKey) {
      var logic = BUNDLE_LOGIC[serviceKey];

      if (!logic) {
        return;
      }

      if (Array.isArray(logic.crossSell)) {
        crossSell = crossSell.concat(logic.crossSell);
      }

      if (logic.bundle) {
        bundles.push(logic.bundle);
      }
    });

    return {
      crossSell: dedupeValues(
        crossSell.filter(function (serviceKey) {
          return SERVICE_LIBRARY[serviceKey] && selectedServices.indexOf(serviceKey) === -1;
        })
      ),
      bundles: dedupeValues(
        bundles.map(function (bundle) {
          return bundle.id;
        })
      )
        .map(function (bundleId) {
          return bundles.find(function (bundle) {
            return bundle.id === bundleId;
          });
        })
        .filter(function (bundle) {
          if (!bundle || !bundle.includes || !bundle.includes.length) {
            return false;
          }

          return bundle.includes.some(function (serviceKey) {
            return selectedServices.indexOf(serviceKey) === -1;
          });
        })
    };
  }

  function getBundleById(bundleId) {
    var key;

    for (key in BUNDLE_LOGIC) {
      if (
        Object.prototype.hasOwnProperty.call(BUNDLE_LOGIC, key) &&
        BUNDLE_LOGIC[key].bundle &&
        BUNDLE_LOGIC[key].bundle.id === bundleId
      ) {
        return BUNDLE_LOGIC[key].bundle;
      }
    }

    return null;
  }
  // --- BUNDLE ENGINE END ---

  function parseTimeLabel(timeLabel) {
    var match = /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i.exec(timeLabel || "");
    var hour;
    var minute;
    var meridiem;

    if (!match) {
      return { hours: 9, minutes: 30 };
    }

    hour = Number(match[1]);
    minute = Number(match[2]);
    meridiem = match[3].toUpperCase();

    if (meridiem === "PM" && hour !== 12) {
      hour += 12;
    }

    if (meridiem === "AM" && hour === 12) {
      hour = 0;
    }

    return { hours: hour, minutes: minute };
  }

  function toGoogleDate(date) {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function buildGoogleCalendarLink(state) {
    var start;
    var end;
    var timeParts;
    var params;

    if (!state.selectedDate || !state.selectedTime) {
      return "https://calendar.google.com/calendar/render";
    }

    timeParts = parseTimeLabel(state.selectedTime);
    start = new Date(state.selectedDate + "T00:00:00");
    start.setHours(timeParts.hours, timeParts.minutes, 0, 0);
    end = new Date(start.getTime() + 45 * 60 * 1000);

    params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Skin Refinery Appointment",
      dates: toGoogleDate(start) + "/" + toGoogleDate(end),
      details:
        "Services: " +
        state.selectedServices.map(getServiceLabel).join(", ") +
        ". Confirmation #: " +
        state.confirmationNumber,
      location: "Winnipeg, MB"
    });

    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function buildShareBookingLink(state) {
    if (!state.selectedServices.length) {
      return "booking.html";
    }

    return "booking.html?services=" + encodeURIComponent(state.selectedServices.join(","));
  }

  function toISODate(date) {
    return date.toISOString().slice(0, 10);
  }

  function formatDate(isoDate) {
    var date = new Date(isoDate + "T12:00:00");
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function formatLongDate(isoDate) {
    var date = new Date(isoDate + "T12:00:00");
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  function generateCalendarWindow(days) {
    var today = new Date();
    var dates = [];
    var i;

    today.setHours(12, 0, 0, 0);

    for (i = 0; i < days; i += 1) {
      var nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(toISODate(nextDate));
    }

    return dates;
  }

  function pickDisabledDates(dateList, count) {
    var picked = new Set();

    while (picked.size < count && picked.size < dateList.length) {
      var index = Math.floor(Math.random() * dateList.length);
      picked.add(dateList[index]);
    }

    return picked;
  }

  function readBookings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function createConfirmationNumber() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function renderProgress(currentStep, requiresDeposit) {
    var sequence = requiresDeposit ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 6, 7];
    var currentIndex = sequence.indexOf(currentStep);

    return (
      '<div class="progress-row" aria-hidden="true">' +
      sequence
        .map(function (_, index) {
          var cls = index <= currentIndex ? "progress-dot is-active" : "progress-dot";
          return '<span class="' + cls + '"></span>';
        })
        .join("") +
      "</div>"
    );
  }

  function sendGAEvent(eventName, params) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, params || {});
  }

  function initBookingFlow(options) {
    var opts = options || {};
    var root = document.getElementById(opts.rootId || "booking-root");
    var dates;
    var initialServices;
    var initialCategory;
    var state;
    var lastTrackedStep;
    var flowStartTracked;
    var conversionTracked;

    if (!root) {
      return;
    }

    dates = generateCalendarWindow(14);
    initialServices = collectInitialServices(opts);
    initialCategory = normalizeCategory(opts.preselectedCategory);

    if (!initialCategory && initialServices.length) {
      initialCategory = getServiceCategory(initialServices[0]);
    }

    state = {
      step: 1,
      isFirstVisit: null,
      requireDeposit: false,
      selectedCategory: initialCategory,
      selectedServices: initialServices.slice(),
      selectedDate: "",
      selectedTime: "",
      depositAmount: Number(opts.depositAmount) || 100,
      depositPaid: false,
      processingDeposit: false,
      payment: {
        cardNumber: "",
        expiry: "",
        cvc: ""
      },
      details: {
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
      },
      disabledDates: pickDisabledDates(dates, 3),
      availableDates: dates,
      confirmationNumber: "",
      bundleBanner: "",
      errors: {},
      saved: false
    };

    lastTrackedStep = null;
    flowStartTracked = false;
    conversionTracked = false;

    function buildAnalyticsContext() {
      return {
        booking_step: state.step,
        selected_services_count: state.selectedServices.length,
        selected_category: state.selectedCategory || "none",
        requires_deposit: state.requireDeposit ? "yes" : "no",
        deposit_paid: state.depositPaid ? "yes" : "no"
      };
    }

    function trackBookingEvent(eventName, extraParams) {
      var payload = buildAnalyticsContext();

      if (extraParams) {
        Object.keys(extraParams).forEach(function (key) {
          payload[key] = extraParams[key];
        });
      }

      sendGAEvent(eventName, payload);
    }

    function trackStepView() {
      var stepPath;

      if (lastTrackedStep === state.step) {
        return;
      }

      stepPath = window.location.pathname + "#step-" + state.step;
      trackBookingEvent("booking_step_view", {
        step_label: "step_" + state.step
      });
      sendGAEvent("page_view", {
        page_title: "Booking Step " + state.step,
        page_path: stepPath,
        page_location: window.location.origin + stepPath
      });

      lastTrackedStep = state.step;
    }

    function trackFlowStart() {
      if (flowStartTracked) {
        return;
      }

      trackBookingEvent("booking_flow_started", {
        preselected_services_count: initialServices.length,
        preselected_category: initialCategory || "none"
      });
      flowStartTracked = true;
    }

    function clearErrors() {
      state.errors = {};
    }

    function hasService(serviceKey) {
      return state.selectedServices.indexOf(serviceKey) > -1;
    }

    function addService(serviceKey) {
      if (!SERVICE_LIBRARY[serviceKey] || hasService(serviceKey)) {
        return;
      }

      state.selectedServices.push(serviceKey);
    }

    function removeService(serviceKey) {
      state.selectedServices = state.selectedServices.filter(function (key) {
        return key !== serviceKey;
      });
    }

    function toggleService(serviceKey) {
      if (!SERVICE_LIBRARY[serviceKey]) {
        return;
      }

      if (hasService(serviceKey)) {
        removeService(serviceKey);
      } else {
        addService(serviceKey);
      }
    }

    function renderServiceChips(services) {
      if (!services.length) {
        return "";
      }

      return services
        .map(function (serviceKey) {
          return '<span class="chip">' + escapeHtml(getServiceLabel(serviceKey)) + "</span>";
        })
        .join("");
    }

    function updateDetailsFromDom() {
      var firstName = root.querySelector("#first-name");
      var lastName = root.querySelector("#last-name");
      var email = root.querySelector("#email");
      var phone = root.querySelector("#phone");

      state.details.firstName = firstName ? firstName.value.trim() : "";
      state.details.lastName = lastName ? lastName.value.trim() : "";
      state.details.email = email ? email.value.trim() : "";
      state.details.phone = phone ? phone.value.trim() : "";
    }

    function updatePaymentFromDom() {
      var cardNumber = root.querySelector("#card-number");
      var expiry = root.querySelector("#card-expiry");
      var cvc = root.querySelector("#card-cvc");

      state.payment.cardNumber = cardNumber ? cardNumber.value.trim() : "";
      state.payment.expiry = expiry ? expiry.value.trim() : "";
      state.payment.cvc = cvc ? cvc.value.trim() : "";
    }

    function validateDetails() {
      clearErrors();
      updateDetailsFromDom();

      if (!state.details.firstName) {
        state.errors.firstName = "First name is required.";
      }

      if (!state.details.lastName) {
        state.errors.lastName = "Last name is required.";
      }

      if (!state.details.email || state.details.email.indexOf("@") < 1) {
        state.errors.email = "A valid email is required.";
      }

      if (!state.details.phone) {
        state.errors.phone = "Phone is required.";
      }

      return Object.keys(state.errors).length === 0;
    }

    function validatePayment() {
      clearErrors();
      updatePaymentFromDom();

      if (state.payment.cardNumber.replace(/\s+/g, "").length < 12) {
        state.errors.cardNumber = "Enter a valid card number.";
      }

      if (!/^\d{2}\/\d{2}$/.test(state.payment.expiry)) {
        state.errors.expiry = "Use MM/YY format.";
      }

      if (!/^\d{3,4}$/.test(state.payment.cvc)) {
        state.errors.cvc = "Enter a valid CVC.";
      }

      return Object.keys(state.errors).length === 0;
    }

    function persistBooking() {
      var bookings = readBookings();
      var serviceLabels = state.selectedServices.map(getServiceLabel);
      var booking = {
        name: (state.details.firstName + " " + state.details.lastName).trim(),
        firstName: state.details.firstName,
        lastName: state.details.lastName,
        email: state.details.email,
        phone: state.details.phone,
        service: serviceLabels.join(", "),
        serviceKey: state.selectedServices.join(","),
        services: serviceLabels,
        serviceKeys: state.selectedServices.slice(),
        primaryService: serviceLabels[0] || "",
        primaryServiceKey: state.selectedServices[0] || "",
        date: state.selectedDate,
        dateLabel: formatLongDate(state.selectedDate),
        time: state.selectedTime,
        depositPaid: state.depositPaid,
        depositAmount: state.requireDeposit ? state.depositAmount : 0,
        confirmationNumber: state.confirmationNumber,
        createdAt: new Date().toISOString()
      };

      bookings.push(booking);
      writeBookings(bookings);
    }

    function restartFlow() {
      var refreshedDates = generateCalendarWindow(14);

      state.step = 1;
      state.isFirstVisit = null;
      state.requireDeposit = false;
      state.selectedCategory = initialCategory;
      state.selectedServices = initialServices.slice();
      state.selectedDate = "";
      state.selectedTime = "";
      state.depositPaid = false;
      state.processingDeposit = false;
      state.payment = { cardNumber: "", expiry: "", cvc: "" };
      state.details = { firstName: "", lastName: "", email: "", phone: "" };
      state.disabledDates = pickDisabledDates(refreshedDates, 3);
      state.availableDates = refreshedDates;
      state.confirmationNumber = "";
      state.bundleBanner = "";
      state.errors = {};
      state.saved = false;
      lastTrackedStep = null;
      flowStartTracked = false;
      conversionTracked = false;
      trackFlowStart();
      render();
    }

    function renderStep() {
      if (state.step === 1) {
        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 1</p>' +
          '<h2 class="booking-title">Is this your first visit?</h2>' +
          '<p class="booking-subtitle">First visits include deeper strategy. Returning guests move straight to execution.</p>' +
          '<div class="choice-grid">' +
          '<button type="button" class="choice-card" data-guest="first">' +
          '<strong>First Visit</strong>' +
          '<span>New here. We map goals, timing, and treatment sequence.</span>' +
          '</button>' +
          '<button type="button" class="choice-card" data-guest="returning">' +
          '<strong>Returning Guest</strong>' +
          '<span>I know the plan and want to secure my next opening.</span>' +
          '</button>' +
          '</div>' +
          '</section>'
        );
      }

      if (state.step === 2) {
        // --- BUNDLE ENGINE START ---
        var bundleContext = collectBundleSuggestions(state.selectedServices);
        var suggestedServices = bundleContext.crossSell;
        var featuredBundle = bundleContext.bundles.length ? bundleContext.bundles[0] : null;
        var planTier = getPlanTierLabel(state.selectedServices.length);

        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 2</p>' +
          '<h2 class="booking-title">Build your treatment cart</h2>' +
          '<p class="booking-subtitle">Add one or more services. Your selections follow through the rest of the booking flow.</p>' +
          '<div class="category-grid">' +
          CATEGORY_OPTIONS.map(function (option) {
            var selectedClass = state.selectedCategory === option.id ? " is-selected" : "";
            return (
              '<button type="button" class="category-card' +
              selectedClass +
              '" data-category="' +
              option.id +
              '">' +
              '<strong>' +
              escapeHtml(option.title) +
              '</strong>' +
              '<span>' +
              escapeHtml(option.description) +
              '</span>' +
              '</button>'
            );
          }).join("") +
          '</div>' +
          (state.selectedCategory
            ? '<div class="service-choice-grid">' +
              getServicesForCategory(state.selectedCategory)
                .map(function (serviceKey) {
                  var selected = hasService(serviceKey);
                  var selectedClass = selected ? " is-selected" : "";
                  return (
                    '<button type="button" class="service-option' +
                    selectedClass +
                    '" data-service="' +
                    serviceKey +
                    '">' +
                    '<span class="service-option-title">' +
                    escapeHtml(getServiceLabel(serviceKey)) +
                    '</span>' +
                    '<span class="service-option-price">' +
                    escapeHtml(getServicePrice(serviceKey)) +
                    '</span>' +
                    '<span class="service-option-cta">' +
                    (selected ? "Added" : "Add to Cart") +
                    '</span>' +
                    '</button>'
                  );
                })
                .join("") +
              '</div>'
            : '<p class="cart-empty">Select a category to browse services.</p>') +
          (state.bundleBanner
            ? '<p class="bundle-confirmation" role="status" aria-live="polite">' +
              escapeHtml(state.bundleBanner) +
              "</p>"
            : "") +
          (featuredBundle
            ? '<section class="bundle-highlight">' +
              "<h3>" +
              escapeHtml(featuredBundle.label) +
              "</h3>" +
              "<p>" +
              escapeHtml(featuredBundle.valueMessage) +
              "</p>" +
              '<p class="bundle-incentive">' +
              escapeHtml(featuredBundle.incentive) +
              "</p>" +
              '<button type="button" class="secondary-btn" data-add-bundle="' +
              escapeHtml(featuredBundle.id) +
              '">Add Complete Bundle</button>' +
              "</section>"
            : "") +
          '<div class="cart-panel">' +
          '<p class="cart-title">Selected Services (' +
          state.selectedServices.length +
          ')</p>' +
          '<p class="plan-tier-badge">' +
          escapeHtml(planTier) +
          "</p>" +
          (state.selectedServices.length
            ? '<ul class="cart-list">' +
              state.selectedServices
                .map(function (serviceKey) {
                  return (
                    '<li class="cart-item">' +
                    '<div class="cart-item-copy">' +
                    '<strong>' +
                    escapeHtml(getServiceLabel(serviceKey)) +
                    '</strong>' +
                    '<span>' +
                    escapeHtml(getServicePrice(serviceKey)) +
                    '</span>' +
                    '</div>' +
                    '<button type="button" class="cart-remove" data-remove-service="' +
                    serviceKey +
                    '">Remove</button>' +
                    '</li>'
                  );
                })
                .join("") +
              '</ul>'
            : '<p class="cart-empty">No services in cart yet.</p>') +
          '<p class="cart-value-stack">Clients combining these treatments typically see faster visible improvement.</p>' +
          '<p class="cart-micro-commitment">Most patients reserve 2+ treatments for optimal progression.</p>' +
          '</div>' +
          (suggestedServices.length
            ? '<section class="suggestion-panel">' +
              '<h3>Recommended to Enhance Results</h3>' +
              '<div class="suggestion-grid">' +
              suggestedServices
                .map(function (serviceKey) {
                  return (
                    '<article class="suggestion-card">' +
                    '<strong class="suggestion-title">' +
                    escapeHtml(getServiceLabel(serviceKey)) +
                    '</strong>' +
                    '<span class="suggestion-price">' +
                    escapeHtml(getServicePrice(serviceKey)) +
                    '</span>' +
                    '<p class="suggestion-benefit">' +
                    escapeHtml(getServiceBenefit(serviceKey)) +
                    '</p>' +
                    '<button type="button" class="ghost-btn suggestion-add" data-add-enhancement="' +
                    serviceKey +
                    '">Add Enhancement</button>' +
                    "</article>"
                  );
                })
                .join("") +
              "</div>" +
              "</section>"
            : "") +
          '<div class="booking-actions">' +
          '<button type="button" class="ghost-btn" data-action="back">Back</button>' +
          '<button type="button" class="primary-btn" data-action="next-service"' +
          (state.selectedServices.length ? "" : " disabled") +
          '>Continue</button>' +
          '</div>' +
          '</section>'
        );
        // --- BUNDLE ENGINE END ---
      }

      if (state.step === 3) {
        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 3</p>' +
          '<h2 class="booking-title">Choose your date</h2>' +
          '<p class="booking-subtitle">The fastest way to momentum is choosing a day now and refining details after.</p>' +
          '<div class="service-summary">' +
          '<p><strong>Selected services</strong></p>' +
          '<div class="chip-row">' +
          renderServiceChips(state.selectedServices) +
          '</div>' +
          '</div>' +
          '<div class="date-grid">' +
          state.availableDates
            .map(function (isoDate) {
              var isDisabled = state.disabledDates.has(isoDate);
              var classes = "date-btn" + (state.selectedDate === isoDate ? " is-selected" : "");
              return (
                '<button type="button" class="' +
                classes +
                '" data-date="' +
                isoDate +
                '"' +
                (isDisabled ? " disabled" : "") +
                '>' +
                '<span>' +
                formatDate(isoDate) +
                '</span>' +
                '</button>'
              );
            })
            .join("") +
          '</div>' +
          (state.selectedDate
            ? '<div class="slot-preview"><p>Time windows on ' +
              escapeHtml(formatLongDate(state.selectedDate)) +
              ':</p>' +
              '<div class="chip-row">' +
              TIME_OPTIONS.map(function (time) {
                return '<span class="chip">' + time + '</span>';
              }).join("") +
              '</div></div>'
            : "") +
          '<div class="booking-actions">' +
          '<button type="button" class="ghost-btn" data-action="back">Back</button>' +
          '<button type="button" class="primary-btn" data-action="next-date"' +
          (state.selectedDate ? "" : " disabled") +
          '>Continue to Time</button>' +
          '</div>' +
          '</section>'
        );
      }

      if (state.step === 4) {
        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 4</p>' +
          '<h2 class="booking-title">Choose your time</h2>' +
          '<p class="booking-subtitle">Pick the window you are most likely to keep.</p>' +
          '<p class="booking-subtitle booking-subtitle-date">' +
          (state.selectedDate ? escapeHtml(formatLongDate(state.selectedDate)) : "") +
          '</p>' +
          '<div class="time-grid">' +
          TIME_OPTIONS.map(function (time) {
            var selectedClass = state.selectedTime === time ? " is-selected" : "";
            return (
              '<button type="button" class="time-btn' +
              selectedClass +
              '" data-time="' +
              time +
              '">' +
              time +
              '</button>'
            );
          }).join("") +
          '</div>' +
          '<div class="booking-actions">' +
          '<button type="button" class="ghost-btn" data-action="back">Back</button>' +
          '<button type="button" class="primary-btn" data-action="next-time"' +
          (state.selectedTime ? "" : " disabled") +
          '>Continue</button>' +
          '</div>' +
          '</section>'
        );
      }

      if (state.step === 5) {
        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 5</p>' +
          '<h2 class="booking-title">Reservation deposit</h2>' +
          '<p class="deposit-notice">A $' +
          state.depositAmount +
          ' reservation deposit secures your appointment and is applied toward your treatment total.</p>' +
          '<p class="deposit-demo-note">Demo mode: deposit is optional and can be skipped.</p>' +
          '<div class="security-trust">' +
          '<p><strong>Secure checkout</strong> powered by encrypted payment processing.</p>' +
          '<div class="security-badges">' +
          '<span class="security-badge">VISA</span>' +
          '<span class="security-badge">Mastercard</span>' +
          '<span class="security-badge">Amex</span>' +
          '<span class="security-badge">Stripe</span>' +
          '<span class="security-badge">SSL/TLS</span>' +
          '</div>' +
          '</div>' +
          '<div class="input-grid payment-grid">' +
          '<label class="field">' +
          '<span>Card Number</span>' +
          '<input id="card-number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" value="' +
          escapeHtml(state.payment.cardNumber) +
          '">' +
          (state.errors.cardNumber ? '<small class="error-msg">' + escapeHtml(state.errors.cardNumber) + '</small>' : "") +
          '</label>' +
          '<label class="field">' +
          '<span>Expiry</span>' +
          '<input id="card-expiry" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" value="' +
          escapeHtml(state.payment.expiry) +
          '">' +
          (state.errors.expiry ? '<small class="error-msg">' + escapeHtml(state.errors.expiry) + '</small>' : "") +
          '</label>' +
          '<label class="field">' +
          '<span>CVC</span>' +
          '<input id="card-cvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" value="' +
          escapeHtml(state.payment.cvc) +
          '">' +
          (state.errors.cvc ? '<small class="error-msg">' + escapeHtml(state.errors.cvc) + '</small>' : "") +
          '</label>' +
          '</div>' +
          '<div class="booking-actions">' +
          '<button type="button" class="ghost-btn" data-action="back"' +
          (state.processingDeposit ? " disabled" : "") +
          '>Back</button>' +
          '<button type="button" class="secondary-btn" data-action="skip-deposit"' +
          (state.processingDeposit ? " disabled" : "") +
          '>Continue Without Deposit (Demo)</button>' +
          '<button type="button" class="primary-btn" data-action="reserve"' +
          (state.processingDeposit ? " disabled" : "") +
          '>' +
          (state.processingDeposit ? "Processing..." : "Reserve Appointment") +
          '</button>' +
          '</div>' +
          '</section>'
        );
      }

      if (state.step === 6) {
        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 6</p>' +
          '<h2 class="booking-title">Where should we send your plan?</h2>' +
          '<p class="booking-subtitle">A precise plan is only useful if you can find it when you need it.</p>' +
          '<div class="input-grid">' +
          '<label class="field">' +
          '<span>First Name</span>' +
          '<input id="first-name" type="text" autocomplete="given-name" value="' +
          escapeHtml(state.details.firstName) +
          '">' +
          (state.errors.firstName ? '<small class="error-msg">' + escapeHtml(state.errors.firstName) + '</small>' : "") +
          '</label>' +
          '<label class="field">' +
          '<span>Last Name</span>' +
          '<input id="last-name" type="text" autocomplete="family-name" value="' +
          escapeHtml(state.details.lastName) +
          '">' +
          (state.errors.lastName ? '<small class="error-msg">' + escapeHtml(state.errors.lastName) + '</small>' : "") +
          '</label>' +
          '<label class="field">' +
          '<span>Email</span>' +
          '<input id="email" type="email" autocomplete="email" value="' +
          escapeHtml(state.details.email) +
          '">' +
          (state.errors.email ? '<small class="error-msg">' + escapeHtml(state.errors.email) + '</small>' : "") +
          '</label>' +
          '<label class="field">' +
          '<span>Phone</span>' +
          '<input id="phone" type="tel" autocomplete="tel" value="' +
          escapeHtml(state.details.phone) +
          '">' +
          (state.errors.phone ? '<small class="error-msg">' + escapeHtml(state.errors.phone) + '</small>' : "") +
          '</label>' +
          '</div>' +
          '<div class="booking-actions">' +
          '<button type="button" class="ghost-btn" data-action="back">Back</button>' +
          '<button type="button" class="primary-btn" data-action="confirm">Confirm Appointment</button>' +
          '</div>' +
          '</section>'
        );
      }

      if (state.step === 7) {
        var confirmationServices = state.selectedServices.map(getServiceLabel).join(" • ");
        var calendarLink = buildGoogleCalendarLink(state);
        var shareBookingLink = buildShareBookingLink(state);
        var greetingName = state.details.firstName ? ", " + escapeHtml(state.details.firstName) : "";
        var contactEmail = state.details.email ? escapeHtml(state.details.email) : "your email";

        if (!state.saved) {
          persistBooking();
          state.saved = true;
        }

        return (
          '<section class="booking-step">' +
          '<p class="booking-eyebrow">Step 7</p>' +
          '<h2 class="booking-title">You are officially booked</h2>' +
          '<p class="booking-subtitle">Thank you' +
          greetingName +
          '. Your appointment is confirmed and your plan is in motion.</p>' +
          '<p class="confirmation-message">A confirmation has been prepared for <strong>' +
          contactEmail +
          "</strong>. Keep this page for your reference details.</p>" +
          '<dl class="summary-list">' +
          '<div><dt>Services Reserved</dt><dd>' +
          escapeHtml(confirmationServices) +
          '</dd></div>' +
          '<div><dt>Date</dt><dd>' +
          escapeHtml(formatLongDate(state.selectedDate)) +
          '</dd></div>' +
          '<div><dt>Time</dt><dd>' +
          escapeHtml(state.selectedTime) +
          '</dd></div>' +
          '<div><dt>Deposit Applied</dt><dd>' +
          (state.depositPaid ? "Yes" : "No") +
          '</dd></div>' +
          '<div><dt>Confirmation #</dt><dd>' +
          escapeHtml(state.confirmationNumber) +
          '</dd></div>' +
          '</dl>' +
          '<section class="next-steps-wrap">' +
          '<p class="next-steps-heading">Common next steps</p>' +
          '<div class="next-steps-grid">' +
          '<article class="next-step-card">' +
          '<h3>Add to Calendar</h3>' +
          "<p>Protect this appointment time so your schedule supports your treatment plan.</p>" +
          '<a class="next-step-link" href="' +
          escapeHtml(calendarLink) +
          '" target="_blank" rel="noopener noreferrer">Open Google Calendar</a>' +
          "</article>" +
          '<article class="next-step-card">' +
          '<h3>Review Pre-Visit Guidance</h3>' +
          "<p>Know exactly what to do before your appointment for the best treatment day.</p>" +
          '<a class="next-step-link" href="index.html#faq">View Preparation FAQ</a>' +
          "</article>" +
          '<article class="next-step-card">' +
          '<h3>Contact Concierge</h3>' +
          "<p>Need to adjust timing or ask a question? We can help quickly.</p>" +
          '<a class="next-step-link" href="tel:+12049990473">Call (204) 999-0473</a>' +
          "</article>" +
          '<article class="next-step-card">' +
          '<h3>Explore Complementary Treatments</h3>' +
          "<p>Layering treatments strategically can improve long-term outcomes.</p>" +
          '<a class="next-step-link" href="index.html#services">View Treatment Menu</a>' +
          "</article>" +
          '<article class="next-step-card">' +
          '<h3>Share This Booking Path</h3>' +
          "<p>Know someone who is ready too? Share a preloaded booking link.</p>" +
          '<a class="next-step-link" href="' +
          escapeHtml(shareBookingLink) +
          '">Share Selected Services</a>' +
          "</article>" +
          '<article class="next-step-card">' +
          '<h3>Follow for Clinical Updates</h3>' +
          "<p>See treatment education, outcomes, and scheduling updates.</p>" +
          '<a class="next-step-link" href="https://instagram.com/allytheinjector" target="_blank" rel="noopener noreferrer">Follow @allytheinjector</a>' +
          "</article>" +
          "</div>" +
          "</section>" +
          '<div class="booking-actions">' +
          '<button type="button" class="primary-btn" data-action="restart">Start New Booking</button>' +
          '</div>' +
          '</section>'
        );
      }

      return "";
    }

    function goTo(step) {
      state.step = step;
      render();
    }

    function bindBackActions() {
      var backButtons = root.querySelectorAll('[data-action="back"]');

      backButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          trackBookingEvent("booking_back_clicked", {
            from_step: state.step
          });

          if (state.step === 2) {
            goTo(1);
            return;
          }

          if (state.step === 3) {
            goTo(2);
            return;
          }

          if (state.step === 4) {
            goTo(3);
            return;
          }

          if (state.step === 5) {
            goTo(4);
            return;
          }

          if (state.step === 6) {
            goTo(state.requireDeposit ? 5 : 4);
          }
        });
      });
    }

    function bindStepEvents() {
      if (state.step === 1) {
        root.querySelectorAll("[data-guest]").forEach(function (button) {
          button.addEventListener("click", function () {
            var guestType = button.getAttribute("data-guest");
            state.isFirstVisit = guestType === "first";
            state.requireDeposit = state.isFirstVisit;
            state.depositPaid = false;
            trackBookingEvent("booking_guest_type_selected", {
              guest_type: state.isFirstVisit ? "first_visit" : "returning_guest"
            });
            clearErrors();
            goTo(2);
          });
        });
      }

      if (state.step === 2) {
        root.querySelectorAll("[data-category]").forEach(function (button) {
          button.addEventListener("click", function () {
            state.selectedCategory = button.getAttribute("data-category") || "";
            state.bundleBanner = "";
            trackBookingEvent("booking_category_selected", {
              category: state.selectedCategory || "none"
            });
            clearErrors();
            render();
          });
        });

        root.querySelectorAll("[data-service]").forEach(function (button) {
          button.addEventListener("click", function () {
            var serviceKey = button.getAttribute("data-service") || "";
            var wasSelected = hasService(serviceKey);
            toggleService(serviceKey);
            state.bundleBanner = "";
            trackBookingEvent(wasSelected ? "booking_service_removed" : "booking_service_added", {
              service_key: serviceKey
            });
            clearErrors();
            render();
          });
        });

        root.querySelectorAll("[data-remove-service]").forEach(function (button) {
          button.addEventListener("click", function () {
            var serviceKey = button.getAttribute("data-remove-service") || "";
            removeService(serviceKey);
            state.bundleBanner = "";
            trackBookingEvent("booking_service_removed", {
              service_key: serviceKey
            });
            clearErrors();
            render();
          });
        });

        root.querySelectorAll("[data-add-enhancement]").forEach(function (button) {
          button.addEventListener("click", function () {
            var serviceKey = button.getAttribute("data-add-enhancement") || "";
            var alreadySelected = hasService(serviceKey);

            addService(serviceKey);
            state.bundleBanner = "";
            if (!alreadySelected) {
              trackBookingEvent("booking_enhancement_added", {
                service_key: serviceKey
              });
            }
            clearErrors();
            render();
          });
        });

        root.querySelectorAll("[data-add-bundle]").forEach(function (button) {
          button.addEventListener("click", function () {
            var bundleId = button.getAttribute("data-add-bundle") || "";
            var bundle = getBundleById(bundleId);

            if (!bundle || !Array.isArray(bundle.includes)) {
              return;
            }

            bundle.includes.forEach(function (serviceKey) {
              addService(serviceKey);
            });

            state.bundleBanner = "Bundle Added — Optimized Treatment Plan Created";
            trackBookingEvent("booking_bundle_added", {
              bundle_id: bundle.id,
              bundle_size: bundle.includes.length
            });
            clearErrors();
            render();
          });
        });

        var serviceNext = root.querySelector('[data-action="next-service"]');
        if (serviceNext) {
          serviceNext.addEventListener("click", function () {
            if (!state.selectedServices.length) {
              return;
            }
            trackBookingEvent("booking_step_completed", {
              completed_step: 2,
              next_step: 3
            });
            goTo(3);
          });
        }
      }

      if (state.step === 3) {
        root.querySelectorAll("[data-date]").forEach(function (button) {
          button.addEventListener("click", function () {
            var isoDate = button.getAttribute("data-date");

            if (!isoDate || state.disabledDates.has(isoDate)) {
              return;
            }

            state.selectedDate = isoDate;
            trackBookingEvent("booking_date_selected", {
              appointment_date: isoDate
            });
            clearErrors();
            render();
          });
        });

        var dateNext = root.querySelector('[data-action="next-date"]');
        if (dateNext) {
          dateNext.addEventListener("click", function () {
            if (!state.selectedDate) {
              return;
            }
            trackBookingEvent("booking_step_completed", {
              completed_step: 3,
              next_step: 4
            });
            goTo(4);
          });
        }
      }

      if (state.step === 4) {
        root.querySelectorAll("[data-time]").forEach(function (button) {
          button.addEventListener("click", function () {
            state.selectedTime = button.getAttribute("data-time") || "";
            trackBookingEvent("booking_time_selected", {
              appointment_time: state.selectedTime || "none"
            });
            clearErrors();
            render();
          });
        });

        var timeNext = root.querySelector('[data-action="next-time"]');
        if (timeNext) {
          timeNext.addEventListener("click", function () {
            var nextStep;

            if (!state.selectedTime) {
              return;
            }

            nextStep = state.requireDeposit ? 5 : 6;
            trackBookingEvent("booking_step_completed", {
              completed_step: 4,
              next_step: nextStep
            });
            goTo(nextStep);
          });
        }
      }

      if (state.step === 5) {
        var skipDeposit = root.querySelector('[data-action="skip-deposit"]');
        if (skipDeposit) {
          skipDeposit.addEventListener("click", function () {
            state.depositPaid = false;
            trackBookingEvent("booking_deposit_skipped", {
              deposit_amount: state.depositAmount
            });
            clearErrors();
            goTo(6);
          });
        }

        var reserve = root.querySelector('[data-action="reserve"]');
        if (reserve) {
          reserve.addEventListener("click", function () {
            if (!validatePayment()) {
              trackBookingEvent("booking_deposit_validation_error");
              render();
              return;
            }

            trackBookingEvent("booking_deposit_submitted", {
              deposit_amount: state.depositAmount
            });
            state.processingDeposit = true;
            render();

            setTimeout(function () {
              state.processingDeposit = false;
              state.depositPaid = true;
              trackBookingEvent("booking_deposit_paid", {
                deposit_amount: state.depositAmount
              });
              clearErrors();
              goTo(6);
            }, 800);
          });
        }
      }

      if (state.step === 6) {
        var confirm = root.querySelector('[data-action="confirm"]');
        if (confirm) {
          confirm.addEventListener("click", function () {
            var leadValue;
            var leadPayload;

            if (!validateDetails()) {
              trackBookingEvent("booking_details_validation_error");
              render();
              return;
            }

            state.confirmationNumber = createConfirmationNumber();
            trackBookingEvent("booking_step_completed", {
              completed_step: 6,
              next_step: 7
            });
            if (!conversionTracked) {
              leadValue = state.depositPaid ? Number(state.depositAmount) || 0 : 0;
              leadPayload = buildAnalyticsContext();
              leadPayload.currency = "CAD";
              leadPayload.value = leadValue;
              sendGAEvent("generate_lead", leadPayload);
              trackBookingEvent("booking_confirmed", {
                conversion_type: "appointment"
              });
              conversionTracked = true;
            }
            clearErrors();
            goTo(7);
          });
        }
      }

      if (state.step === 7) {
        root.querySelectorAll(".next-step-link").forEach(function (link) {
          link.addEventListener("click", function () {
            trackBookingEvent("booking_next_step_clicked", {
              link_href: link.getAttribute("href") || "",
              link_text: (link.textContent || "").trim() || "next_step_link"
            });
          });
        });

        var restart = root.querySelector('[data-action="restart"]');
        if (restart) {
          restart.addEventListener("click", function () {
            trackBookingEvent("booking_restart_clicked");
            restartFlow();
          });
        }
      }

      bindBackActions();
    }

    function render() {
      root.innerHTML =
        '<article class="booking-shell">' +
        renderProgress(state.step, state.requireDeposit) +
        renderStep() +
        "</article>";
      bindStepEvents();
      trackStepView();
    }

    root.innerHTML = "";
    trackFlowStart();
    render();
  }

  window.initBookingFlow = initBookingFlow;
})();
