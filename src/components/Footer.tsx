import React from "react";
import Link from "next/link";
import { ArrowUpRight, Phone, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { BRAND_CHANNELS, BRAND_PHONES } from "@/data/contacts";
import { BrandMark } from "./BrandMark";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const otherLocale: Locale = locale === "uk" ? "en" : "uk";

  return (
    <footer className="px-3 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[24px] bg-[#0F1B2E] text-[#F8FAFC]">
        {/* Top conversion band */}
        <div className="border-b border-[#253652] px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:py-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              {dict.footer.ctaHeading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#A8B7CE]">
              {dict.footer.ctaSubcopy}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-0 lg:shrink-0">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#F2CE24] px-6 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#F7DA4C]"
            >
              <span>{dict.footer.ctaButton}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={BRAND_CHANNELS.telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#2F4568] bg-[#162640] px-5 text-sm font-medium text-[#F8FAFC] transition-colors hover:border-[#F2CE24]"
            >
              <Send className="h-4 w-4 text-[#F2CE24]" aria-hidden="true" />
              <span>{BRAND_CHANNELS.telegramBotHandle}</span>
            </a>
          </div>
        </div>

        {/* Structured directory */}
        <div className="grid grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:py-12">
          <div className="space-y-4">
            <BrandMark
              variant="dark"
              name={dict.brand.name}
              slogan={dict.brand.slogan}
            />
            <p className="text-xs leading-relaxed text-[#A8B7CE]">
              {dict.brand.legalSummary}
            </p>
            <span className="inline-flex items-center rounded-full border border-[#2F4568] bg-[#162640] px-3 py-1 text-xs font-medium text-[#F2CE24]">
              {dict.brand.demoBadge}
            </span>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8B7CE]">
              {dict.footer.navigationTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/fleet`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.nav.fleet}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contacts`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.nav.contacts}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/demo-requests`}
                  className="inline-flex items-center gap-1.5 text-[#F2CE24] transition-colors hover:underline"
                >
                  <span>{dict.nav.demoRequests}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8B7CE]">
              {dict.footer.servicesTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/booking?type=individual`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.servicesSection.individual.title}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/booking?type=group`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.servicesSection.group.title}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/booking?geo=city`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.quickBooking.geographies.city}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/booking?geo=ukraine`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.quickBooking.geographies.ukraine}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/booking?geo=international`}
                  className="text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                >
                  {dict.quickBooking.geographies.international}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8B7CE]">
              {dict.footer.contactsTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {BRAND_PHONES.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="inline-flex items-center gap-2 tabular-nums text-[#F8FAFC] transition-colors hover:text-[#F2CE24]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#A8B7CE]" aria-hidden="true" />
                    <span>{phone.display}</span>
                  </a>
                </li>
              ))}
              <li className="pt-1 flex flex-wrap gap-2">
                <a
                  href={BRAND_CHANNELS.viberUrl}
                  className="rounded-lg border border-[#253652] bg-[#162640] px-2.5 py-1 text-xs font-medium text-[#F8FAFC] hover:border-[#F2CE24]"
                >
                  Viber
                </a>
                <a
                  href={BRAND_CHANNELS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#253652] bg-[#162640] px-2.5 py-1 text-xs font-medium text-[#F8FAFC] hover:border-[#F2CE24]"
                >
                  WhatsApp
                </a>
                <a
                  href={BRAND_CHANNELS.telegramBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#253652] bg-[#162640] px-2.5 py-1 text-xs font-medium text-[#F8FAFC] hover:border-[#F2CE24]"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal bottom bar */}
        <div className="flex flex-col gap-3 border-t border-[#253652] px-6 py-5 text-xs text-[#A8B7CE] sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="space-y-1">
            <p>{dict.footer.demoBanner}</p>
            <p>{dict.footer.copyright}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={`/${locale}/privacy`}
              className="text-[#F8FAFC] underline-offset-4 hover:underline"
            >
              {dict.nav.privacy}
            </Link>
            <Link
              href={`/${otherLocale}`}
              hrefLang={otherLocale}
              className="rounded-full border border-[#2F4568] px-3 py-1 font-semibold text-[#F8FAFC] transition-colors hover:border-[#F2CE24]"
            >
              {otherLocale === "uk" ? "Українська" : "English"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

