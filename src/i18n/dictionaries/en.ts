import type { Dictionary } from "../types";

export const enDictionary: Dictionary = {
  brand: {
    name: "UkrVoyazh",
    slogan: "Comfort & Safety",
    demoBadge: "DEMO build",
    legalSummary: "UkrVoyazh LLC · EDRPOU 39228011 · License AE No. 421686",
  },
  nav: {
    home: "Home",
    services: "Services",
    fleet: "Transport",
    about: "About",
    contacts: "Contacts",
    booking: "Booking",
    demoRequests: "DEMO: Requests Log",
    privacy: "Privacy Policy",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    hotlineLabel: "Dispatch contact",
    bookCta: "Book a ride",
    switchLanguageLabel: "Switch language",
  },
  hero: {
    title: "Charter passenger rides across Kyiv, Ukraine & international routes",
    subtitle:
      "Submit an individual transfer or group charter request online in clear guided steps. Our operator reviews your itinerary, vehicle category, and confirms the rate individually.",
    operatorQuoteNote:
      "Fare and vehicle availability are confirmed individually by the operator.",
    fleetDisclaimerNote:
      "Illustrations represent comfort categories; an exact unit is assigned after review.",
    illustrationAlt:
      "Stylized cartoon illustration of an UkrVoyazh passenger minivan and royal-blue sedan traveling on an intercity European highway",
    illustrationCaption: "Individual & group charters tailored to your schedule",
  },
  quickBooking: {
    individualTab: "Individual",
    groupTab: "Group",
    geographyLabel: "Route scope",
    geographies: {
      city: "City ride",
      ukraine: "Across Ukraine",
      international: "International",
    },
    originPlaceholder: "Pickup city or address",
    destinationPlaceholder: "Drop-off city or destination",
    swapAria: "Swap pickup and drop-off points",
    dateLabel: "Departure date",
    passengersLabel: "Passengers",
    passengersUnit: "pax",
    submitCta: "Continue booking",
    quickRoutesLabel: "Sample corridors:",
    operatorNote: "Final pricing is confirmed by an operator (no online card payment in demo)",
    routeRequiredError: "Please enter both pickup and destination locations.",
    pastDateError: "Please pick today or a future date.",
  },
  servicesSection: {
    title: "Travel formats & destinations",
    lead: "Planned passenger transportation built around your schedule — from point-to-point city pickups to multi-stop international group charters.",
    viewAllCta: "Explore all services",
    individual: {
      badge: "For 1–7 passengers",
      title: "Individual rides",
      description:
        "Private charter following your exact pickup point and departure timing. Built for business travel, family trips, and direct intercity or cross-border transfers.",
      points: [
        "Door-to-door pickup at your address, rail station, or meeting point",
        "Flexible departure planning and optional return trip scheduling",
        "Option to request a child seat or space for oversized luggage",
      ],
      cta: "Book individual ride",
    },
    group: {
      badge: "For delegations, teams & groups",
      title: "Group charters",
      description:
        "Organized passenger transport by minibus or touring coach across Ukraine and abroad, with coordinated intermediate pickup stops along the route.",
      points: [
        "Capacity matching based on exact passenger count and luggage volume",
        "Custom intermediate stops along corridors (e.g. Kyiv — Odesa — Burgas)",
        "Direct itinerary and schedule coordination with our dispatch operator",
      ],
      cta: "Request group charter",
    },
    geographiesTitle: "Service coverage",
    geographies: {
      city: {
        title: "City transfers",
        description:
          "Pre-booked passenger pickups inside Kyiv, Odesa, and other Ukrainian cities according to your timing.",
        examples: "Kyiv · Odesa · address-to-address",
        cta: "Start city request",
      },
      ukraine: {
        title: "Intercity across Ukraine",
        description:
          "Direct private and group connections between Ukrainian regions without fixed public bus schedules.",
        examples: "Kyiv — Odesa · Kyiv — Lviv · custom routes",
        cta: "Request intercity quote",
      },
      international: {
        title: "International routes",
        description:
          "Cross-border passenger transport for individuals and groups with route logistics coordinated in advance.",
        examples: "Kyiv — Odesa — Burgas · Warsaw · EU cities",
        cta: "Plan international trip",
      },
    },
  },
  fleetSection: {
    title: "Transport categories & comfort tiers",
    lead: "Because our fleet is continually updated, the website showcases stylized illustrations of each vehicle category rather than misleading photos of one specific car.",
    disclaimer:
      "Select the seating and comfort tier that fits your trip. The exact vehicle is assigned by our operator once route details are confirmed.",
    filters: {
      all: "All categories",
      individual: "Individual",
      group: "Group",
    },
    selectCta: "View category details",
    selectedCta: "Selected category",
    bookThisClassCta: "Order this category",
    comfortLabel: "Category amenities",
    fullCatalogCta: "Compare all categories",
    classes: {
      "comfort-sedan": {
        name: "Comfort Sedan",
        tagline: "Balanced everyday comfort for city pickups and intercity transfers",
        summary:
          "Clean, comfortable four-door sedan suited for solo travelers or couples moving across the city or between regions.",
        passengerLabel: "up to 3 passengers",
        luggageLabel: "up to 3 standard bags",
        tripScopeLabel: "Individual trips",
        features: ["Climate control", "Trunk luggage room", "Address pickup"],
      },
      "business-sedan": {
        name: "Business Sedan",
        tagline: "Added cabin quietness and legroom for executive and long-distance travel",
        summary:
          "Refined executive interior with smooth highway composure for business meetings, intercity travel, and cross-border routes.",
        passengerLabel: "up to 3 passengers",
        luggageLabel: "up to 3 standard bags",
        tripScopeLabel: "Individual trips",
        features: ["Spacious rear seating", "Dual-zone climate", "Cabin device charging"],
      },
      minivan: {
        name: "Minivan",
        tagline: "Versatile cabin for families, small teams, or extra luggage capacity",
        summary:
          "Comfortable seating for up to 7 passengers with practical luggage capacity for long domestic or European trips.",
        passengerLabel: "up to 7 passengers",
        luggageLabel: "up to 7 suitcases",
        tripScopeLabel: "Individual & small groups",
        features: ["Flexible cabin layout", "Generous luggage bay", "Family-friendly entry"],
      },
      minibus: {
        name: "Minibus",
        tagline: "Organized group trips across Ukraine and abroad with route stops",
        summary:
          "Ideal tier for delegations, corporate teams, and group charters needing coordinated boarding along the route.",
        passengerLabel: "6–18 passengers",
        luggageLabel: "up to 18 bags",
        tripScopeLabel: "Group charters",
        features: ["Cabin air conditioning", "Supportive touring seats", "Dedicated baggage hold"],
      },
      coach: {
        name: "Touring Coach",
        tagline: "Full-scale group travel and international charter corridors",
        summary:
          "Designed for large delegations and collective international journeys with underfloor luggage bays and high-deck visibility.",
        passengerLabel: "19–50 passengers",
        luggageLabel: "full underfloor luggage bay",
        tripScopeLabel: "Large group charters",
        features: ["Panoramic glazing", "Large luggage compartments", "Coordinated rest stops"],
      },
    },
  },
  processSection: {
    title: "How a trip request works",
    lead: "A straightforward path from submitting your route to operator confirmation — no speculative pricing or automated assumptions.",
    steps: [
      {
        number: "01",
        title: "Choose format & class",
        description:
          "Select an individual or group trip along with your preferred comfort and seating tier.",
      },
      {
        number: "02",
        title: "Enter route & schedule",
        description:
          "Provide origin, destination, departure date/time, passenger count, and optional stops or luggage requests.",
      },
      {
        number: "03",
        title: "Share contact details",
        description:
          "Enter your name and preferred reply channel — international phone number, Telegram, Viber, WhatsApp, or email.",
      },
      {
        number: "04",
        title: "Operator confirms terms",
        description:
          "Your request receives a reference number. Our dispatcher verifies route availability and contacts you to confirm fare and pickup.",
      },
    ],
  },
  aboutSection: {
    title: "The UkrVoyazh standard",
    lead: "Built around pre-agreed charter travel: comfortable transport, honest communication, and careful route coordination.",
    paragraphs: [
      "UkrVoyazh focuses on bespoke passenger transport across Kyiv, intercity Ukrainian routes, and international destinations — serving both private travelers and organized groups.",
      "Instead of publishing static photos of one vehicle that may rotate out of service, we present transparent comfort categories. You choose the space and class you need, and our dispatch confirms the assigned vehicle for your date.",
    ],
    principles: [
      {
        title: "Comfort & Safety",
        description:
          "Prioritizing well-maintained vehicles, clean cabins, and clear route scheduling before departure.",
      },
      {
        title: "Individual & Group Logistics",
        description:
          "Accommodating intermediate passenger pickups, luggage space, child seats, and return trips in one structured dossier.",
      },
      {
        title: "Human Dispatch Verification",
        description:
          "Every custom and cross-border itinerary is reviewed by an operator so timing, timezone, and terms are never guessed.",
      },
    ],
    legalHeading: "Company registration details from client materials",
    legalNote:
      "Displayed from the client's service materials (@UkrVoyazh_bot) for demo completeness and subject to final legal verification before launch.",
    readMoreCta: "More about the company",
  },
  faqSection: {
    title: "Frequently asked questions",
    lead: "Clear answers on how trip requests, pricing confirmation, and transport categories work in UkrVoyazh.",
    items: [
      {
        question: "Why doesn't the website display an instant fixed fare?",
        answer:
          "Charter fares depend on exact pickup/drop-off points, intermediate stops, waiting time, and vehicle category. To avoid misleading estimates, our operator confirms the exact fare once your route details are reviewed.",
      },
      {
        question: "Does submitting the form immediately lock in a vehicle?",
        answer:
          "No. Submitting creates a structured request with status 'New' and a unique reference ID. An operator checks vehicle availability for your date and contacts you to finalize and confirm the booking.",
      },
      {
        question: "Why do you show stylized illustrations instead of real car photos?",
        answer:
          "Our fleet is updated regularly. Stylized illustrations accurately convey seating capacity and comfort class without setting false expectations about receiving one specific license plate.",
      },
      {
        question: "Can I request intermediate stops or a round trip?",
        answer:
          "Yes. In Step 2 (Route & Schedule), you can toggle a return journey and list any intermediate passenger pickup towns or stops.",
      },
      {
        question: "Which phone number formats are accepted?",
        answer:
          "The form supports international dialing codes (+380, +48, +359, +49, +44, +1, and more) so travelers booking from abroad or returning to Ukraine can enter any valid number.",
      },
      {
        question: "Is online card payment available right now?",
        answer:
          "Online card payments are not enabled in this demo release. Payment terms are agreed directly with the operator after confirming the ride quote.",
      },
    ],
  },
  servicesPage: {
    title: "Services & route scopes",
    lead: "Choose private individual transfers or coordinated group charters with clear operator confirmation.",
    corridorsTitle: "Sample route corridors",
    corridorsLead:
      "Select any corridor below to pre-fill the booking form and request availability and pricing from our operator.",
    corridorAction: "Request this route",
    customRouteNote:
      "Need a different city or address? You can enter any custom origin and destination inside the booking form.",
  },
  fleetPage: {
    title: "Transport & comfort categories",
    lead: "Five comfort tiers covering executive solo rides through 50-seat international coaches, without promising an unassigned specific plate.",
    tableTitle: "Category capacity comparison",
    tableHeaders: {
      category: "Category",
      passengers: "Passengers",
      luggage: "Luggage",
      format: "Primary format",
      action: "Action",
    },
  },
  aboutPage: {
    title: "About UkrVoyazh",
    lead: "Charter passenger transportation across Kyiv, Ukraine, and Europe with a steady focus on comfort, safety, and transparent dispatch.",
    botNoticeTitle: "Active Telegram Bot",
    botNoticeBody:
      "UkrVoyazh operates @UkrVoyazh_bot for direct passenger inquiries. In this interactive website demo, web bookings operate independently; two-way synchronization with the bot is planned as a separate technical integration stage.",
    botLinkLabel: "Open @UkrVoyazh_bot",
  },
  contactsPage: {
    title: "Dispatch & contact channels",
    lead: "Reach our dispatch team by phone, messenger, or submit a structured trip request online.",
    phonesHeading: "Phone lines",
    messengersHeading: "Messengers & direct chat",
    dispatchHeading: "Planning & route quotes",
    dispatchBody:
      "For the fastest quote on intercity or group routes, submit the online booking form — our operator immediately receives your route, schedule, and passenger count.",
    copyPhone: "Copy",
    copiedPhone: "Copied",
    emailLabel: "Demo dispatch email",
    emailDemoNote: "Demo placeholder address (to be replaced with client domain email)",
    goToBookingCta: "Open booking form",
  },
  bookingWizard: {
    pageTitle: "Request a passenger ride",
    pageLead:
      "Complete the route details below. Everything you type is preserved automatically across steps and when switching between UA and EN.",
    steps: [
      "Format & Class",
      "Route & Schedule",
      "Contacts & Consent",
      "Review & Submit",
    ],
    stepOf: "Step",
    backBtn: "Back",
    nextBtn: "Continue",
    submitBtn: "Submit request (DEMO)",
    submittingBtn: "Submitting request...",
    editStep: "Edit",
    tripTypes: {
      individual: {
        title: "Individual trip",
        subtitle: "Private vehicle for 1–7 passengers on your own schedule",
      },
      group: {
        title: "Group charter",
        subtitle: "Organized minibus or touring coach for larger groups",
      },
    },
    geographies: {
      city: {
        label: "City ride",
        hint: "Kyiv, Odesa & local pickups",
      },
      ukraine: {
        label: "Across Ukraine",
        hint: "Intercity transfers",
      },
      international: {
        label: "International",
        hint: "Cross-border EU routes",
      },
    },
    vehicleChoiceLabel: "Preferred transport category",
    operatorChoiceTitle: "Let operator recommend",
    operatorChoiceSubtitle: "Dispatch assigns the right class for your passenger and luggage count",
    capacityHintTitle: "Capacity suggestion",
    capacityHintMessage:
      "For your passenger count, a larger vehicle category fits better.",
    capacityHintApply: "Switch to recommended tier",
    originLabel: "Pickup location",
    originPlaceholder: "e.g. Kyiv, central station or street address",
    destinationLabel: "Drop-off location",
    destinationPlaceholder: "e.g. Odesa or Burgas (Bulgaria)",
    swapAria: "Swap origin and destination",
    presetFillLabel: "Quick sample route:",
    roundTripLabel: "Include a return trip",
    roundTripHint: "Provide your expected return date and time",
    pickupDateLabel: "Pickup date",
    pickupTimeLabel: "Pickup time",
    returnDateLabel: "Return date",
    returnTimeLabel: "Return time",
    timezoneLabel: "Departure timezone",
    passengersLabel: "Passengers",
    luggageLabel: "Luggage pieces",
    extraStopsLabel: "Intermediate stops (optional)",
    extraStopsPlaceholder:
      "List any towns or pickup points along the route if needed",
    optionsLabel: "Trip preferences",
    optionsList: {
      "child-seat": "Child safety seat",
      "extra-luggage": "Oversized / extra luggage",
      "meet-sign": "Meet & greet sign",
      "extra-stops": "Planned route stops",
      "pet-friendly": "Traveling with a pet",
    },
    contactNameLabel: "Your name",
    contactNamePlaceholder: "Full name or contact person",
    phoneLabel: "Phone number",
    phoneCountryLabel: "Country code",
    phoneNumberPlaceholder: "67 594 27 77",
    phoneIntlHint: "International format supported (example: +380 67 594 27 77)",
    channelLabel: "Preferred reply channel",
    channels: {
      phone: "Phone call",
      telegram: "Telegram",
      viber: "Viber",
      whatsapp: "WhatsApp",
      email: "Email",
    },
    emailLabel: "Email (optional)",
    emailPlaceholder: "name@example.com",
    commentLabel: "Trip notes or special requirements",
    commentPlaceholder:
      "Any schedule notes, waiting requirements, group coordinator info, or border questions",
    consentLabelStart: "I agree to the processing of my booking inquiry data in accordance with the ",
    consentLinkText: "Privacy Policy",
    consentLabelEnd: " (demo form notice).",
    reviewNoticeTitle: "Confirmation note",
    reviewNoticeBody:
      "Submitting this form creates a transportation request. Final pricing and the specific vehicle unit are confirmed separately by our operator.",
    summaryCard: {
      title: "Trip summary",
      emptyRoute: "Route not entered yet",
      tripFormat: "Format",
      geography: "Scope",
      vehicleClass: "Category",
      schedule: "Schedule",
      passengersLuggage: "Passengers / luggage",
      pricingTitle: "Estimated fare",
      pricingValue: "Confirmed by operator after review",
      reassuranceTitle: "Dispatcher reassurance",
      reassurancePoints: [
        "No automatic card charges or instant commitment penalties",
        "Illustrations indicate comfort class rather than a specific plate number",
        "Direct phone lines and @UkrVoyazh_bot remain open for questions",
      ],
    },
    errors: {
      originRequired: "Please enter a pickup city or address (at least 2 characters).",
      destinationRequired: "Please enter a destination city or address (at least 2 characters).",
      pickupDateRequired: "Please select a departure date.",
      pickupTimeRequired: "Please enter a pickup time.",
      pastDatetime: "Departure date and time cannot be in the past.",
      returnRequired: "Please provide both return date and return time.",
      returnBeforePickup: "Return date and time must be after departure.",
      passengersRange: "Passengers count must be between 1 and 50.",
      nameRequired: "Please enter your name (at least 2 characters).",
      phoneInvalid: "Please enter a valid phone number (7 to 14 digits after the country code).",
      emailInvalid: "Please enter a valid email address.",
      consentRequired: "Please confirm consent to process your request.",
      submitFailed: "Could not submit your request due to a network error. Please try again.",
      retryBtn: "Retry submission",
      fixFieldsBanner: "Please review the highlighted fields before continuing.",
    },
    confirmation: {
      badge: "Request received (DEMO)",
      title: "Your ride request has been submitted",
      subtitle:
        "Your inquiry is recorded in the demo dispatch log. An operator will verify route availability and contact you to confirm the fare and vehicle assignment.",
      referenceLabel: "Reference ID",
      copyReference: "Copy ID",
      copiedReference: "Copied",
      statusLabel: "Current status",
      pricingStatement:
        "Note: this confirms receipt of your request — it is not an automated assignment of a specific vehicle or pre-calculated fare.",
      summaryHeading: "Submitted trip details",
      consentRecordLabel: "Data processing consent recorded",
      nextStepsHeading: "What happens next",
      nextSteps: [
        "Our operator reviews your route, passenger count, and preferred comfort class.",
        "We reach out via your chosen contact channel to confirm pricing and exact pickup timing.",
        "Once you approve the offer, the operator marks the trip as confirmed.",
      ],
      openDemoLogCta: "View in DEMO Requests Log",
      newRequestCta: "Submit another request",
      backHomeCta: "Back to home",
    },
  },
  demoRequestsPage: {
    badge: "Demo operator workspace preview",
    title: "Requests Log (DEMO)",
    lead: "Interactive preview of the operator workflow from the technical specification: inspect submitted individual & group inquiries, filter by status, and advance lifecycle statuses with audit history.",
    syncNote:
      "Demo mode: combines sample pre-loaded inquiries with any requests submitted in your current browser session.",
    searchPlaceholder: "Search by reference ID, city, or client name...",
    filterAllTypes: "All formats",
    filterAllStatuses: "All statuses",
    emptyTitle: "No requests match these filters",
    emptyBody: "Adjust your search query or create a new demo booking request.",
    createFirstCta: "Create ride request",
    columns: {
      reference: "Reference",
      route: "Route",
      typeAndClass: "Type & Class",
      schedule: "Departure",
      contact: "Contact",
      status: "Status",
    },
    detailsTitle: "Request Dossier",
    statusActionLabel: "Advance status to:",
    historyTitle: "Status transition history",
    statuses: {
      new: "New",
      in_review: "In review",
      awaiting_quote: "Awaiting quote",
      quote_sent: "Quote sent",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      declined: "Declined",
    },
    sampleTag: "Demo sample",
    submittedTag: "Your submission",
    resetDemoBtn: "Clear my submitted demo requests",
  },
  privacyPage: {
    title: "Privacy Policy (DEMO Template)",
    draftNotice:
      "This page is a demonstration template for UX verification. Before production launch, legal wording and retention periods must be approved by the company's legal counsel.",
    updatedLabel: "Template version: v1.0-demo · November 19, 2026",
    sections: [
      {
        heading: "1. Data minimization in trip requests",
        body: [
          "The booking module collects only the contact and itinerary details needed to evaluate and coordinate a passenger trip (name, phone number or preferred messaging channel, origin, destination, date/time, passenger count, and optional notes).",
          "Passport numbers and payment card details are not requested or collected in this demonstration booking flow.",
        ],
      },
      {
        heading: "2. Purpose of processing",
        body: [
          "Submitted details are used solely to review route feasibility, confirm pricing with the traveler, and coordinate pickup logistics.",
          "Consent version and timestamp are logged alongside each submitted request.",
        ],
      },
      {
        heading: "3. Data subject inquiries",
        body: [
          "Questions regarding updating or removing inquiry records can be directed to our dispatch phone lines or @UkrVoyazh_bot.",
        ],
      },
    ],
  },
  notFoundPage: {
    code: "404",
    title: "Page not found",
    description:
      "The link may be outdated or mistyped. Return to the home page or jump straight to the ride booking form.",
    homeCta: "Return home",
    bookingCta: "Book a ride",
  },
  footer: {
    ctaHeading: "Ready to plan a trip?",
    ctaSubcopy:
      "Submit an individual or group ride request in minutes — our operator will verify details and confirm the quote.",
    ctaButton: "Start booking",
    navigationTitle: "Navigation",
    servicesTitle: "Directions",
    contactsTitle: "Contacts",
    demoBanner:
      "Interactive DEMO build for UkrVoyazh. Live card payments, real-time GPS tracking, and automated driver dispatch are not included.",
    copyright: "© UkrVoyazh · Passenger Transportation Web Platform Demo",
  },
  meta: {
    home: {
      title: "UkrVoyazh — Charter Passenger Rides in Kyiv, Ukraine & Abroad (DEMO)",
      description:
        "Individual transfers and group passenger charters with online booking request: select comfort tier, route, and schedule with operator confirmation.",
    },
    services: {
      title: "Services & Routes — UkrVoyazh (DEMO)",
      description:
        "Individual transfers and group passenger charters across city, intercity Ukraine, and European routes.",
    },
    fleet: {
      title: "Transport Categories — UkrVoyazh (DEMO)",
      description:
        "Vehicle comfort categories from Comfort Sedan to 50-seat Touring Coach without misleading stock photos.",
    },
    booking: {
      title: "Book a Ride — UkrVoyazh (DEMO)",
      description:
        "Interactive individual and group passenger ride booking form with validation and confirmation screen.",
    },
    about: {
      title: "About — UkrVoyazh (DEMO)",
      description:
        "UkrVoyazh service principles, comfort and safety focus, company legal summary, and Telegram bot context.",
    },
    contacts: {
      title: "Contacts — UkrVoyazh (DEMO)",
      description:
        "Dispatch phone numbers, @UkrVoyazh_bot on Telegram, Viber, and WhatsApp channels.",
    },
    privacy: {
      title: "Privacy Policy — UkrVoyazh (DEMO)",
      description: "Demonstration privacy notice for trip inquiry processing.",
    },
    demoRequests: {
      title: "DEMO: Operator Requests Log — UkrVoyazh",
      description:
        "Demonstration dispatch console to review requests and update booking statuses.",
    },
  },
};

