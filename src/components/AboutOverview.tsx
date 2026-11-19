import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { LEGAL_DETAILS } from "@/data/contacts";

interface AboutOverviewProps {
  locale: Locale;
  dict: Dictionary;
  showReadMoreLink?: boolean;
}

export function AboutOverview({
  locale,
  dict,
  showReadMoreLink = true,
}: AboutOverviewProps) {
  return (
    <section className="bg-[#F1F3F7] py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-4xl">
              {dict.aboutSection.title}
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-[#101828]">
              {dict.aboutSection.lead}
            </p>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#475467] sm:text-base">
              {dict.aboutSection.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {showReadMoreLink ? (
              <div className="mt-6">
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#24508F] hover:text-[#1B3E73]"
                >
                  <span>{dict.aboutSection.readMoreCta}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {dict.aboutSection.principles.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E4E6EC] bg-white p-5"
                >
                  <h3 className="text-base font-semibold text-[#0F1B2E]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475467]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#E4E6EC] bg-white p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F1B2E]">
                <ShieldCheck className="h-4 w-4 text-[#24508F]" aria-hidden="true" />
                <span>{dict.aboutSection.legalHeading}</span>
              </div>
              <p className="mt-2 font-medium text-[#101828]">
                {locale === "uk" ? LEGAL_DETAILS.entityUk : LEGAL_DETAILS.entityEn} ·{" "}
                <span className="tabular-nums">
                  {locale === "uk" ? "ЄДРПОУ" : "EDRPOU"} {LEGAL_DETAILS.edrpou}
                </span>{" "}
                ·{" "}
                <span className="tabular-nums">
                  {locale === "uk" ? LEGAL_DETAILS.licenseUk : LEGAL_DETAILS.licenseEn}
                </span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#667085]">
                {dict.aboutSection.legalNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

