export type GeographyType = "city" | "ukraine" | "international";
export type TripType = "individual" | "group";

export interface RouteCorridor {
  id: string;
  geography: GeographyType;
  defaultTripType: TripType;
  originUk: string;
  destinationUk: string;
  originEn: string;
  destinationEn: string;
  noteUk: string;
  noteEn: string;
}

export const POPULAR_CORRIDORS: RouteCorridor[] = [
  {
    id: "kyiv-city",
    geography: "city",
    defaultTripType: "individual",
    originUk: "Київ (центр / адреса)",
    destinationUk: "Київ (вокзал / адреса)",
    originEn: "Kyiv (city center / address)",
    destinationEn: "Kyiv (station / address)",
    noteUk: "Замовлення по місту",
    noteEn: "In-city charter ride",
  },
  {
    id: "odesa-city",
    geography: "city",
    defaultTripType: "individual",
    originUk: "Одеса (центр)",
    destinationUk: "Одеса (адреса призначення)",
    originEn: "Odesa (center)",
    destinationEn: "Odesa (destination address)",
    noteUk: "Замовлення по місту",
    noteEn: "In-city charter ride",
  },
  {
    id: "kyiv-odesa",
    geography: "ukraine",
    defaultTripType: "individual",
    originUk: "Київ",
    destinationUk: "Одеса",
    originEn: "Kyiv",
    destinationEn: "Odesa",
    noteUk: "Міжміський рейс по Україні",
    noteEn: "Domestic intercity route",
  },
  {
    id: "kyiv-lviv",
    geography: "ukraine",
    defaultTripType: "individual",
    originUk: "Київ",
    destinationUk: "Львів",
    originEn: "Kyiv",
    destinationEn: "Lviv",
    noteUk: "Міжміський рейс по Україні",
    noteEn: "Domestic intercity route",
  },
  {
    id: "kyiv-burgas",
    geography: "international",
    defaultTripType: "group",
    originUk: "Київ",
    destinationUk: "Бургас (Болгарія)",
    originEn: "Kyiv",
    destinationEn: "Burgas (Bulgaria)",
    noteUk: "Міжнародний коридор (із можливістю зупинки в Одесі)",
    noteEn: "International corridor (optional stop in Odesa)",
  },
  {
    id: "odesa-burgas",
    geography: "international",
    defaultTripType: "group",
    originUk: "Одеса",
    destinationUk: "Бургас (Болгарія)",
    originEn: "Odesa",
    destinationEn: "Burgas (Bulgaria)",
    noteUk: "Колективний та індивідуальний виїзд за кордон",
    noteEn: "Group & private international transfer",
  },
  {
    id: "kyiv-warsaw",
    geography: "international",
    defaultTripType: "individual",
    originUk: "Київ",
    destinationUk: "Варшава (Польща)",
    originEn: "Kyiv",
    destinationEn: "Warsaw (Poland)",
    noteUk: "Індивідуальне або групове бронювання",
    noteEn: "Individual or group charter",
  },
];

export const DIAL_CODES = [
  { code: "+380", label: "UA +380" },
  { code: "+48", label: "PL +48" },
  { code: "+359", label: "BG +359" },
  { code: "+49", label: "DE +49" },
  { code: "+40", label: "RO +40" },
  { code: "+420", label: "CZ +420" },
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US/CA +1" },
] as const;

export const DEMO_TIMEZONES = [
  { value: "Europe/Kyiv", labelUk: "Київ (EET / EEST)", labelEn: "Kyiv (EET / EEST)" },
  { value: "Europe/Warsaw", labelUk: "Варшава / Центральна Європа (CET)", labelEn: "Warsaw / Central Europe (CET)" },
  { value: "Europe/Sofia", labelUk: "Софія / Бургас (EET)", labelEn: "Sofia / Burgas (EET)" },
] as const;

