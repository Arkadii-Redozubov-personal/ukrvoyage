import type { Locale } from "./config";
import type { Dictionary } from "./types";
import { ukDictionary } from "./dictionaries/uk";
import { enDictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = {
  uk: ukDictionary,
  en: enDictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ukDictionary;
}

