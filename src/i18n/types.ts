import type { VehicleClassId } from "@/data/fleet";
import type { GeographyType, TripType } from "@/data/routes";
import type { BookingStatus } from "@/lib/booking/status";

export interface PageMetaText {
  title: string;
  description: string;
}

export interface FleetClassCopy {
  name: string;
  tagline: string;
  summary: string;
  passengerLabel: string;
  luggageLabel: string;
  features: string[];
  tripScopeLabel: string;
}

export interface Dictionary {
  brand: {
    name: string;
    slogan: string;
    demoBadge: string;
    legalSummary: string;
  };
  nav: {
    home: string;
    services: string;
    fleet: string;
    about: string;
    contacts: string;
    booking: string;
    demoRequests: string;
    privacy: string;
    openMenu: string;
    closeMenu: string;
    hotlineLabel: string;
    bookCta: string;
    switchLanguageLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
    operatorQuoteNote: string;
    fleetDisclaimerNote: string;
    illustrationAlt: string;
    illustrationCaption: string;
  };
  quickBooking: {
    individualTab: string;
    groupTab: string;
    geographyLabel: string;
    geographies: Record<GeographyType, string>;
    originPlaceholder: string;
    destinationPlaceholder: string;
    swapAria: string;
    dateLabel: string;
    passengersLabel: string;
    passengersUnit: string;
    submitCta: string;
    quickRoutesLabel: string;
    operatorNote: string;
    routeRequiredError: string;
    pastDateError: string;
  };
  servicesSection: {
    title: string;
    lead: string;
    viewAllCta: string;
    individual: {
      badge: string;
      title: string;
      description: string;
      points: string[];
      cta: string;
    };
    group: {
      badge: string;
      title: string;
      description: string;
      points: string[];
      cta: string;
    };
    geographiesTitle: string;
    geographies: Record<
      GeographyType,
      {
        title: string;
        description: string;
        examples: string;
        cta: string;
      }
    >;
  };
  fleetSection: {
    title: string;
    lead: string;
    disclaimer: string;
    filters: {
      all: string;
      individual: string;
      group: string;
    };
    selectCta: string;
    selectedCta: string;
    bookThisClassCta: string;
    comfortLabel: string;
    fullCatalogCta: string;
    classes: Record<VehicleClassId, FleetClassCopy>;
  };
  processSection: {
    title: string;
    lead: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  aboutSection: {
    title: string;
    lead: string;
    paragraphs: string[];
    principles: Array<{
      title: string;
      description: string;
    }>;
    legalHeading: string;
    legalNote: string;
    readMoreCta: string;
  };
  faqSection: {
    title: string;
    lead: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  servicesPage: {
    title: string;
    lead: string;
    corridorsTitle: string;
    corridorsLead: string;
    corridorAction: string;
    customRouteNote: string;
  };
  fleetPage: {
    title: string;
    lead: string;
    tableTitle: string;
    tableHeaders: {
      category: string;
      passengers: string;
      luggage: string;
      format: string;
      action: string;
    };
  };
  aboutPage: {
    title: string;
    lead: string;
    botNoticeTitle: string;
    botNoticeBody: string;
    botLinkLabel: string;
  };
  contactsPage: {
    title: string;
    lead: string;
    phonesHeading: string;
    messengersHeading: string;
    dispatchHeading: string;
    dispatchBody: string;
    copyPhone: string;
    copiedPhone: string;
    emailLabel: string;
    emailDemoNote: string;
    goToBookingCta: string;
  };
  bookingWizard: {
    pageTitle: string;
    pageLead: string;
    steps: [string, string, string, string];
    stepOf: string;
    backBtn: string;
    nextBtn: string;
    submitBtn: string;
    submittingBtn: string;
    editStep: string;
    tripTypes: Record<TripType, { title: string; subtitle: string }>;
    geographies: Record<GeographyType, { label: string; hint: string }>;
    vehicleChoiceLabel: string;
    operatorChoiceTitle: string;
    operatorChoiceSubtitle: string;
    capacityHintTitle: string;
    capacityHintMessage: string;
    capacityHintApply: string;
    originLabel: string;
    originPlaceholder: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    swapAria: string;
    presetFillLabel: string;
    roundTripLabel: string;
    roundTripHint: string;
    pickupDateLabel: string;
    pickupTimeLabel: string;
    returnDateLabel: string;
    returnTimeLabel: string;
    timezoneLabel: string;
    passengersLabel: string;
    luggageLabel: string;
    extraStopsLabel: string;
    extraStopsPlaceholder: string;
    optionsLabel: string;
    optionsList: Record<
      "child-seat" | "extra-luggage" | "meet-sign" | "extra-stops" | "pet-friendly",
      string
    >;
    contactNameLabel: string;
    contactNamePlaceholder: string;
    phoneLabel: string;
    phoneCountryLabel: string;
    phoneNumberPlaceholder: string;
    phoneIntlHint: string;
    channelLabel: string;
    channels: Record<"phone" | "telegram" | "viber" | "whatsapp" | "email", string>;
    emailLabel: string;
    emailPlaceholder: string;
    commentLabel: string;
    commentPlaceholder: string;
    consentLabelStart: string;
    consentLinkText: string;
    consentLabelEnd: string;
    reviewNoticeTitle: string;
    reviewNoticeBody: string;
    summaryCard: {
      title: string;
      emptyRoute: string;
      tripFormat: string;
      geography: string;
      vehicleClass: string;
      schedule: string;
      passengersLuggage: string;
      pricingTitle: string;
      pricingValue: string;
      reassuranceTitle: string;
      reassurancePoints: string[];
    };
    errors: {
      originRequired: string;
      destinationRequired: string;
      pickupDateRequired: string;
      pickupTimeRequired: string;
      pastDatetime: string;
      returnRequired: string;
      returnBeforePickup: string;
      passengersRange: string;
      nameRequired: string;
      phoneInvalid: string;
      emailInvalid: string;
      consentRequired: string;
      submitFailed: string;
      retryBtn: string;
      fixFieldsBanner: string;
    };
    confirmation: {
      badge: string;
      title: string;
      subtitle: string;
      referenceLabel: string;
      copyReference: string;
      copiedReference: string;
      statusLabel: string;
      pricingStatement: string;
      summaryHeading: string;
      consentRecordLabel: string;
      nextStepsHeading: string;
      nextSteps: string[];
      openDemoLogCta: string;
      newRequestCta: string;
      backHomeCta: string;
    };
  };
  demoRequestsPage: {
    badge: string;
    title: string;
    lead: string;
    syncNote: string;
    searchPlaceholder: string;
    filterAllTypes: string;
    filterAllStatuses: string;
    emptyTitle: string;
    emptyBody: string;
    createFirstCta: string;
    columns: {
      reference: string;
      route: string;
      typeAndClass: string;
      schedule: string;
      contact: string;
      status: string;
    };
    detailsTitle: string;
    statusActionLabel: string;
    historyTitle: string;
    statuses: Record<BookingStatus, string>;
    sampleTag: string;
    submittedTag: string;
    resetDemoBtn: string;
  };
  privacyPage: {
    title: string;
    draftNotice: string;
    updatedLabel: string;
    sections: Array<{
      heading: string;
      body: string[];
    }>;
  };
  notFoundPage: {
    code: string;
    title: string;
    description: string;
    homeCta: string;
    bookingCta: string;
  };
  footer: {
    ctaHeading: string;
    ctaSubcopy: string;
    ctaButton: string;
    navigationTitle: string;
    servicesTitle: string;
    contactsTitle: string;
    demoBanner: string;
    copyright: string;
  };
  meta: {
    home: PageMetaText;
    services: PageMetaText;
    fleet: PageMetaText;
    booking: PageMetaText;
    about: PageMetaText;
    contacts: PageMetaText;
    privacy: PageMetaText;
    demoRequests: PageMetaText;
  };
}

