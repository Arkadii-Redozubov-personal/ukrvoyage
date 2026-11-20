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
  { value: "Europe/Kyiv", labelUk: "Київ (EET / EEST)", labelEn: "Київ / Kyiv (EET / EEST)" },
  { value: "Europe/Warsaw", labelUk: "Варшава / Центральна Європа (CET)", labelEn: "Warsaw / Central Europe (CET)" },
  { value: "Europe/Sofia", labelUk: "Софія / Бургас (EET)", labelEn: "Sofia / Burgas (EET)" },
] as const;

export interface LocationSuggestion {
  id: string;
  nameUk: string;
  nameEn: string;
  regionUk: string;
  regionEn: string;
  scope: GeographyType;
  popular?: boolean;
  keywords: string[];
}

export const LOCATION_SUGGESTIONS: LocationSuggestion[] = [
  {
    id: "kyiv",
    nameUk: "Київ",
    nameEn: "Kyiv",
    regionUk: "Україна · столиця",
    regionEn: "Ukraine · Capital",
    scope: "ukraine",
    popular: true,
    keywords: ["київ", "киев", "kyiv", "kiev", "столиця"],
  },
  {
    id: "kyiv-station",
    nameUk: "Київ (Центральний вокзал)",
    nameEn: "Kyiv (Central Rail Station)",
    regionUk: "Подача по місту Київ",
    regionEn: "Kyiv city pickup",
    scope: "city",
    popular: true,
    keywords: ["київ", "киев", "вокзал", "жд", "залізничний", "station", "kyiv"],
  },
  {
    id: "kyiv-center",
    nameUk: "Київ (Центр / Поділ / Печерськ)",
    nameEn: "Kyiv (City Center / Pechersk)",
    regionUk: "Подача за адресою в Києві",
    regionEn: "Address pickup in Kyiv",
    scope: "city",
    keywords: ["київ", "киев", "центр", "поділ", "печерськ", "хрещатик", "kyiv"],
  },
  {
    id: "kyiv-left-bank",
    nameUk: "Київ (Лівий берег / Позняки / Осокорки)",
    nameEn: "Kyiv (Left Bank / Pozniaky)",
    regionUk: "Подача за адресою в Києві",
    regionEn: "Address pickup in Kyiv",
    scope: "city",
    keywords: ["київ", "киев", "лівий берег", "позняки", "осокорки", "оболонь", "kyiv"],
  },
  {
    id: "odesa",
    nameUk: "Одеса",
    nameEn: "Odesa",
    regionUk: "Україна · Одеська обл.",
    regionEn: "Ukraine · Odesa region",
    scope: "ukraine",
    popular: true,
    keywords: ["одеса", "одесса", "odesa", "odessa", "море"],
  },
  {
    id: "odesa-center",
    nameUk: "Одеса (Центр / Аркадія / Вокзал)",
    nameEn: "Odesa (Center / Arcadia / Station)",
    regionUk: "Подача по місту Одеса",
    regionEn: "Odesa city pickup",
    scope: "city",
    popular: true,
    keywords: ["одеса", "одесса", "аркадія", "аркадия", "вокзал", "привоз", "odesa"],
  },
  {
    id: "lviv",
    nameUk: "Львів",
    nameEn: "Lviv",
    regionUk: "Україна · Львівська обл.",
    regionEn: "Ukraine · Lviv region",
    scope: "ukraine",
    popular: true,
    keywords: ["львів", "львов", "lviv", "lvov", "lwów"],
  },
  {
    id: "uman",
    nameUk: "Умань",
    nameEn: "Uman",
    regionUk: "Україна · Черкаська обл.",
    regionEn: "Ukraine · Cherkasy region",
    scope: "ukraine",
    popular: true,
    keywords: ["умань", "uman", "софіївка"],
  },
  {
    id: "vinnytsia",
    nameUk: "Вінниця",
    nameEn: "Vinnytsia",
    regionUk: "Україна · Вінницька обл.",
    regionEn: "Ukraine · Vinnytsia region",
    scope: "ukraine",
    popular: true,
    keywords: ["вінниця", "винница", "vinnytsia", "vinnitsa"],
  },
  {
    id: "dnipro",
    nameUk: "Дніпро",
    nameEn: "Dnipro",
    regionUk: "Україна · Дніпропетровська обл.",
    regionEn: "Ukraine · Dnipropetrovsk region",
    scope: "ukraine",
    popular: true,
    keywords: ["дніпро", "днепр", "dnipro", "dnepr"],
  },
  {
    id: "kharkiv",
    nameUk: "Харків",
    nameEn: "Kharkiv",
    regionUk: "Україна · Харківська обл.",
    regionEn: "Ukraine · Kharkiv region",
    scope: "ukraine",
    keywords: ["харків", "харьков", "kharkiv", "kharkov"],
  },
  {
    id: "zhytomyr",
    nameUk: "Житомир",
    nameEn: "Zhytomyr",
    regionUk: "Україна · Житомирська обл.",
    regionEn: "Ukraine · Zhytomyr region",
    scope: "ukraine",
    keywords: ["житомир", "zhytomyr", "zhitomir"],
  },
  {
    id: "bila-tserkva",
    nameUk: "Біла Церква",
    nameEn: "Bila Tserkva",
    regionUk: "Україна · Київська обл.",
    regionEn: "Ukraine · Kyiv region",
    scope: "ukraine",
    keywords: ["біла церква", "белая церковь", "bila tserkva"],
  },
  {
    id: "chernivtsi",
    nameUk: "Чернівці",
    nameEn: "Chernivtsi",
    regionUk: "Україна · Чернівецька обл.",
    regionEn: "Ukraine · Chernivtsi region",
    scope: "ukraine",
    keywords: ["чернівці", "черновцы", "chernivtsi"],
  },
  {
    id: "ivano-frankivsk",
    nameUk: "Івано-Франківськ",
    nameEn: "Ivano-Frankivsk",
    regionUk: "Україна · Івано-Франківська обл.",
    regionEn: "Ukraine · Ivano-Frankivsk region",
    scope: "ukraine",
    keywords: ["івано-франківськ", "ивано-франковск", "франківськ", "ivano-frankivsk"],
  },
  {
    id: "bukovel",
    nameUk: "Буковель (Поляниця)",
    nameEn: "Bukovel (Polianytsia)",
    regionUk: "Україна · Карпати",
    regionEn: "Ukraine · Carpathians",
    scope: "ukraine",
    keywords: ["буковель", "поляниця", "карпати", "яремче", "bukovel", "carpathians"],
  },
  {
    id: "uzhhorod",
    nameUk: "Ужгород",
    nameEn: "Uzhhorod",
    regionUk: "Україна · Закарпатська обл.",
    regionEn: "Ukraine · Zakarpattia region",
    scope: "ukraine",
    keywords: ["ужгород", "мукачево", "закарпаття", "uzhhorod"],
  },
  {
    id: "ternopil",
    nameUk: "Тернопіль",
    nameEn: "Ternopil",
    regionUk: "Україна · Тернопільська обл.",
    regionEn: "Ukraine · Ternopil region",
    scope: "ukraine",
    keywords: ["тернопіль", "тернополь", "ternopil"],
  },
  {
    id: "khmelnytskyi",
    nameUk: "Хмельницький",
    nameEn: "Khmelnytskyi",
    regionUk: "Україна · Хмельницька обл.",
    regionEn: "Ukraine · Khmelnytskyi region",
    scope: "ukraine",
    keywords: ["хмельницький", "хмельницкий", "камʼянець-подільський", "khmelnytskyi"],
  },
  {
    id: "rivne",
    nameUk: "Рівне",
    nameEn: "Rivne",
    regionUk: "Україна · Рівненська обл.",
    regionEn: "Ukraine · Rivne region",
    scope: "ukraine",
    keywords: ["рівне", "ровно", "rivne"],
  },
  {
    id: "lutsk",
    nameUk: "Луцьк",
    nameEn: "Lutsk",
    regionUk: "Україна · Волинська обл.",
    regionEn: "Ukraine · Volyn region",
    scope: "ukraine",
    keywords: ["луцьк", "луцк", "волинь", "lutsk"],
  },
  {
    id: "poltava",
    nameUk: "Полтава",
    nameEn: "Poltava",
    regionUk: "Україна · Полтавська обл.",
    regionEn: "Ukraine · Poltava region",
    scope: "ukraine",
    keywords: ["полтава", "кременчук", "poltava"],
  },
  {
    id: "cherkasy",
    nameUk: "Черкаси",
    nameEn: "Cherkasy",
    regionUk: "Україна · Черкаська обл.",
    regionEn: "Ukraine · Cherkasy region",
    scope: "ukraine",
    keywords: ["черкаси", "черкассы", "cherkasy"],
  },
  {
    id: "mykolaiv",
    nameUk: "Миколаїв",
    nameEn: "Mykolaiv",
    regionUk: "Україна · Миколаївська обл.",
    regionEn: "Ukraine · Mykolaiv region",
    scope: "ukraine",
    keywords: ["миколаїв", "николаев", "mykolaiv", "nikolaev"],
  },
  {
    id: "zaporizhzhia",
    nameUk: "Запоріжжя",
    nameEn: "Zaporizhzhia",
    regionUk: "Україна · Запорізька обл.",
    regionEn: "Ukraine · Zaporizhzhia region",
    scope: "ukraine",
    keywords: ["запоріжжя", "запорожье", "zaporizhzhia"],
  },
  {
    id: "kryvyi-rih",
    nameUk: "Кривий Ріг",
    nameEn: "Kryvyi Rih",
    regionUk: "Україна · Дніпропетровська обл.",
    regionEn: "Ukraine · Dnipropetrovsk region",
    scope: "ukraine",
    keywords: ["кривий ріг", "кривой рог", "kryvyi rih"],
  },
  {
    id: "izmail",
    nameUk: "Ізмаїл",
    nameEn: "Izmail",
    regionUk: "Україна · Одеська обл.",
    regionEn: "Ukraine · Odesa region",
    scope: "ukraine",
    keywords: ["ізмаїл", "измаил", "болград", "рені", "izmail"],
  },
  {
    id: "burgas",
    nameUk: "Бургас (Болгарія)",
    nameEn: "Burgas (Bulgaria)",
    regionUk: "Болгарія · міжнародний рейс",
    regionEn: "Bulgaria · International route",
    scope: "international",
    popular: true,
    keywords: ["бургас", "болгарія", "болгария", "burgas", "bulgaria", "море"],
  },
  {
    id: "sunny-beach",
    nameUk: "Сонячний Берег / Несебр (Болгарія)",
    nameEn: "Sunny Beach / Nessebar (Bulgaria)",
    regionUk: "Болгарія · чорноморське узбережжя",
    regionEn: "Bulgaria · Black Sea coast",
    scope: "international",
    keywords: ["сонячний берег", "солнечный берег", "несебр", "болгарія", "sunny beach", "nessebar", "bulgaria"],
  },
  {
    id: "varna",
    nameUk: "Варна (Болгарія)",
    nameEn: "Varna (Bulgaria)",
    regionUk: "Болгарія · міжнародний рейс",
    regionEn: "Bulgaria · International route",
    scope: "international",
    popular: true,
    keywords: ["варна", "болгарія", "болгария", "varna", "bulgaria", "золоті піски"],
  },
  {
    id: "sofia",
    nameUk: "Софія (Болгарія)",
    nameEn: "Sofia (Bulgaria)",
    regionUk: "Болгарія · столиця",
    regionEn: "Bulgaria · Capital",
    scope: "international",
    keywords: ["софія", "софия", "болгарія", "sofia", "bulgaria"],
  },
  {
    id: "warsaw",
    nameUk: "Варшава (Польща)",
    nameEn: "Warsaw (Poland)",
    regionUk: "Польща · міжнародний рейс",
    regionEn: "Poland · International route",
    scope: "international",
    popular: true,
    keywords: ["варшава", "польща", "польша", "warsaw", "warszawa", "poland", "шопен", "модлін", "waw"],
  },
  {
    id: "krakow",
    nameUk: "Краків (Польща)",
    nameEn: "Krakow (Poland)",
    regionUk: "Польща · міжнародний рейс",
    regionEn: "Poland · International route",
    scope: "international",
    popular: true,
    keywords: ["краків", "краков", "польща", " польша", "krakow", "cracow", "poland"],
  },
  {
    id: "lublin",
    nameUk: "Люблін (Польща)",
    nameEn: "Lublin (Poland)",
    regionUk: "Польща · міжнародний рейс",
    regionEn: "Poland · International route",
    scope: "international",
    keywords: ["люблін", "люблин", "польща", "lublin", "poland"],
  },
  {
    id: "rzeszow",
    nameUk: "Жешув / Ряшів (Польща)",
    nameEn: "Rzeszow (Poland)",
    regionUk: "Польща · аеропорт Ясьонка (RZE)",
    regionEn: "Poland · Rzeszow Airport (RZE)",
    scope: "international",
    keywords: ["жешув", "ряшів", "польща", "аеропорт", "rzeszow", "rze", "poland"],
  },
  {
    id: "wroclaw",
    nameUk: "Вроцлав (Польща)",
    nameEn: "Wroclaw (Poland)",
    regionUk: "Польща · міжнародний рейс",
    regionEn: "Poland · International route",
    scope: "international",
    keywords: ["вроцлав", "польща", "wroclaw", "poland"],
  },
  {
    id: "chisinau",
    nameUk: "Кишинів (Молдова)",
    nameEn: "Chisinau (Moldova)",
    regionUk: "Молдова · місто та аеропорт (RMO)",
    regionEn: "Moldova · City & Airport (RMO)",
    scope: "international",
    popular: true,
    keywords: ["кишинів", "кишинев", "молдова", "аеропорт", "chisinau", "moldova", "rmo", "kiv"],
  },
  {
    id: "bucharest",
    nameUk: "Бухарест (Румунія)",
    nameEn: "Bucharest (Romania)",
    regionUk: "Румунія · місто та аеропорт Отопені (OTP)",
    regionEn: "Romania · City & Otopeni Airport (OTP)",
    scope: "international",
    popular: true,
    keywords: ["бухарест", "румунія", "румыния", "отопені", "аеропорт", "bucharest", "romania", "otp"],
  },
  {
    id: "iasi",
    nameUk: "Ясси / Сучава (Румунія)",
    nameEn: "Iasi / Suceava (Romania)",
    regionUk: "Румунія · аеропорт та трансфер",
    regionEn: "Romania · Airport & transfer",
    scope: "international",
    keywords: ["ясси", "яссы", "сучава", "румунія", "iasi", "suceava", "romania"],
  },
  {
    id: "prague",
    nameUk: "Прага (Чехія)",
    nameEn: "Prague (Czechia)",
    regionUk: "Чехія · міжнародний рейс",
    regionEn: "Czechia · International route",
    scope: "international",
    keywords: ["прага", "чехія", "чехия", "бряно", "prague", "praha", "czechia"],
  },
  {
    id: "vienna",
    nameUk: "Відень (Австрія)",
    nameEn: "Vienna (Austria)",
    regionUk: "Австрія · міжнародний рейс",
    regionEn: "Austria · International route",
    scope: "international",
    keywords: ["відень", "вена", "австрія", "vienna", "wien", "austria"],
  },
  {
    id: "budapest",
    nameUk: "Будапешт (Угорщина)",
    nameEn: "Budapest (Hungary)",
    regionUk: "Угорщина · міжнародний рейс",
    regionEn: "Hungary · International route",
    scope: "international",
    keywords: ["будапешт", "угорщина", "венгрия", "budapest", "hungary"],
  },
  {
    id: "berlin",
    nameUk: "Берлін (Німеччина)",
    nameEn: "Berlin (Germany)",
    regionUk: "Німеччина · міжнародний рейс",
    regionEn: "Germany · International route",
    scope: "international",
    keywords: ["берлін", "берлин", "німеччина", "германия", "berlin", "germany"],
  },
  {
    id: "istanbul",
    nameUk: "Стамбул (Туреччина)",
    nameEn: "Istanbul (Turkey)",
    regionUk: "Туреччина · міжнародний рейс",
    regionEn: "Turkey · International route",
    scope: "international",
    keywords: ["стамбул", "туреччина", "турция", "istanbul", "turkey"],
  },
];

function isSubsequenceOrClose(needle: string, haystack: string): boolean {
  if (needle.length < 3) return false;
  // Check 1-character typo / edit distance <= 1 against prefixes of haystack words
  const words = haystack.split(/[\s(),/·-]+/).filter(Boolean);
  for (const word of words) {
    const slice = word.slice(0, needle.length);
    if (Math.abs(slice.length - needle.length) <= 1) {
      let mismatches = 0;
      const len = Math.min(slice.length, needle.length);
      for (let i = 0; i < len; i++) {
        if (slice[i] !== needle[i]) mismatches++;
      }
      mismatches += Math.abs(slice.length - needle.length);
      if (mismatches <= 1) return true;
    }
  }
  return false;
}

export function matchLocationSuggestions(
  rawQuery: string,
  geography: GeographyType,
  excludeExactValue?: string,
  limit = 8
): LocationSuggestion[] {
  const q = rawQuery.trim().toLowerCase();

  // If query is empty (or user just clicked an already-filled field without editing yet),
  // show curated suggestions prioritized by active geography.
  if (!q) {
    const prioritized = [...LOCATION_SUGGESTIONS].sort((a, b) => {
      const aMatchGeo =
        a.scope === geography ||
        (geography === "international" && (a.id === "kyiv" || a.id === "odesa" || a.id === "lviv"));
      const bMatchGeo =
        b.scope === geography ||
        (geography === "international" && (b.id === "kyiv" || b.id === "odesa" || b.id === "lviv"));
      if (aMatchGeo !== bMatchGeo) return aMatchGeo ? -1 : 1;
      if (Boolean(a.popular) !== Boolean(b.popular)) return a.popular ? -1 : 1;
      return 0;
    });
    return prioritized
      .filter(
        (item) =>
          !excludeExactValue ||
          (item.nameUk.toLowerCase() !== excludeExactValue.toLowerCase() &&
            item.nameEn.toLowerCase() !== excludeExactValue.toLowerCase())
      )
      .slice(0, limit);
  }

  const scored: Array<{ item: LocationSuggestion; score: number }> = [];

  for (const item of LOCATION_SUGGESTIONS) {
    const nameUkLower = item.nameUk.toLowerCase();
    const nameEnLower = item.nameEn.toLowerCase();
    const regionUkLower = item.regionUk.toLowerCase();
    const regionEnLower = item.regionEn.toLowerCase();

    let score = 0;

    if (nameUkLower.startsWith(q) || nameEnLower.startsWith(q)) {
      score = 100;
    } else if (
      item.keywords.some((kw) => kw.toLowerCase().startsWith(q))
    ) {
      score = 90;
    } else if (nameUkLower.includes(q) || nameEnLower.includes(q)) {
      score = 75;
    } else if (
      item.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
      regionUkLower.includes(q) ||
      regionEnLower.includes(q)
    ) {
      score = 60;
    } else if (
      isSubsequenceOrClose(
        q,
        `${nameUkLower} ${nameEnLower} ${item.keywords.join(" ")}`
      )
    ) {
      score = 40;
    }

    if (score > 0) {
      if (item.scope === geography) score += 6;
      if (item.popular) score += 3;
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

