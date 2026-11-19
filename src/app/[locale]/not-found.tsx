"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export default function LocaleNotFound() {
  const pathname = usePathname() || "/uk";
  const locale: Locale = pathname.startsWith("/en") ? "en" : "uk";
  const dict = getDictionary(locale);
  const nf = dict.notFoundPage;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="font-display tabular-nums text-5xl font-semibold text-[#24508F] sm:text-7xl">
          {nf.code}
        </p>
        <h1 className="font-display mt-4 text-2xl font-semibold text-[#0F1B2E] sm:text-3xl">
          {nf.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#475467]">
          {nf.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD2DF] bg-white px-5 text-sm font-semibold text-[#101828] hover:border-[#24508F]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{nf.homeCta}</span>
          </Link>
          <Link
            href={`/${locale}/booking`}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white hover:bg-[#1B3E73]"
          >
            <span>{nf.bookingCta}</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

