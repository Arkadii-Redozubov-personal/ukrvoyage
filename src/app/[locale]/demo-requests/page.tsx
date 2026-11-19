import React from "react";
import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import { getInitialDemoSamples } from "@/lib/booking/store";
import { DemoRequestsConsole } from "@/components/DemoRequestsConsole";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(
    locale,
    "/demo-requests",
    dict.meta.demoRequests
  );
}

export default async function DemoRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  const initialSamples = getInitialDemoSamples();

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-4xl">
            {dict.demoRequestsPage.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#475467] sm:text-base">
            {dict.demoRequestsPage.lead}
          </p>
        </div>

        <DemoRequestsConsole
          locale={locale}
          dict={dict}
          initialSamples={initialSamples}
        />
      </div>
    </section>
  );
}

