import React from "react";
import type { Metadata } from "next";
import { Info } from "lucide-react";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "/privacy", dict.meta.privacy);
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-4xl">
          {dict.privacyPage.title}
        </h1>
        <p className="mt-3 text-xs font-medium text-[#667085]">
          {dict.privacyPage.updatedLabel}
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#EBD884] bg-[#FDF6D3] p-4 text-sm text-[#4A3803]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#785C05]" aria-hidden="true" />
          <p>{dict.privacyPage.draftNotice}</p>
        </div>

        <div className="mt-8 space-y-8 rounded-2xl border border-[#E4E6EC] bg-white p-6 sm:p-8">
          {dict.privacyPage.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-[#0F1B2E]">
                {section.heading}
              </h2>
              <div className="mt-2.5 space-y-2.5 text-sm leading-relaxed text-[#475467] sm:text-base">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

