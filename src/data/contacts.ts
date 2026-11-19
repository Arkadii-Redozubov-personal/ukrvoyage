export interface ContactPhone {
  display: string;
  href: string;
  operatorLabel: string;
}

export const BRAND_PHONES: ContactPhone[] = [
  {
    display: "+38 (067) 594 2 777",
    href: "tel:+380675942777",
    operatorLabel: "Kyivstar",
  },
  {
    display: "+38 (050) 594 2 777",
    href: "tel:+380505942777",
    operatorLabel: "Vodafone",
  },
  {
    display: "+38 (063) 594 2 777",
    href: "tel:+380635942777",
    operatorLabel: "lifecell",
  },
];

export const BRAND_CHANNELS = {
  telegramBotHandle: "@UkrVoyazh_bot",
  telegramBotUrl: "https://t.me/UkrVoyazh_bot",
  viberUrl: "viber://chat?number=%2B380675942777",
  whatsappUrl: "https://wa.me/380675942777",
  demoEmail: "dispatch@ukrvoyazh.demo",
} as const;

export const LEGAL_DETAILS = {
  entityUk: "ТОВ «УкрВояж»",
  entityEn: "UkrVoyazh LLC",
  edrpou: "39228011",
  licenseUk: "Ліцензія АЕ № 421686",
  licenseEn: "License AE No. 421686",
} as const;

