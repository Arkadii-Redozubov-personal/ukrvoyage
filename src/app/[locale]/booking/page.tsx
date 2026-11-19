import React, { Suspense } from "react";
import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import { BookingWizard } from "@/components/BookingWizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "/booking", dict.meta.booking);
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-[24px] border border-[#E4E6EC] bg-white" />
          }
        >
          <BookingWizard locale={locale} dict={dict} />
        </Suspense>
      </div>
    </section>
  );
}

