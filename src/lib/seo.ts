import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import type { PageMetaText } from "@/i18n/types";

export function buildLocalePageMetadata(
  locale: Locale,
  routeSuffix: string,
  meta: PageMetaText
): Metadata {
  const ukPath = `/uk${routeSuffix}`;
  const enPath = `/en${routeSuffix}`;
  const canonical = locale === "uk" ? ukPath : enPath;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        uk: ukPath,
        en: enPath,
        "x-default": ukPath,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "website",
    },
  };
}

