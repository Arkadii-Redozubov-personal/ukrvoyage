"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { BRAND_PHONES } from "@/data/contacts";

interface MobileStickyCtaProps {
  locale: Locale;
  dict: Dictionary;
}

export function MobileStickyCta({ locale, dict }: MobileStickyCtaProps) {
  const pathname = usePathname() || "";
  if (pathname.includes("/booking")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E4E6EC] bg-[#FAF9F6]/95 px-4 py-2.5 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-2.5">
        <a
          href={BRAND_PHONES[0].href}
          aria-label={dict.nav.hotlineLabel}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CBD2DF] bg-white text-[#24508F]"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </a>
        <Link
          href={`/${locale}/booking`}
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#24508F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73]"
        >
          {dict.nav.bookCta}
        </Link>
      </div>
    </div>
  );
}

