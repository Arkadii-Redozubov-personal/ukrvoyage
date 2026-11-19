"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, Send, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { BRAND_CHANNELS, BRAND_PHONES } from "@/data/contacts";
import { BrandMark } from "./BrandMark";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname() || `/${locale}`;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [phonesOpen, setPhonesOpen] = useState(false);
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  const otherLocale: Locale = locale === "uk" ? "en" : "uk";

  function buildLocaleHref(targetLocale: Locale): string {
    const segments = pathname.split("/");
    if (segments[1] === "uk" || segments[1] === "en") {
      segments[1] = targetLocale;
      return segments.join("/") || `/${targetLocale}`;
    }
    return `/${targetLocale}${pathname === "/" ? "" : pathname}`;
  }

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home, exact: true },
    { href: `/${locale}/services`, label: dict.nav.services, exact: false },
    { href: `/${locale}/fleet`, label: dict.nav.fleet, exact: false },
    { href: `/${locale}/about`, label: dict.nav.about, exact: false },
    { href: `/${locale}/contacts`, label: dict.nav.contacts, exact: false },
  ];

  function isNavActive(href: string, exact: boolean): boolean {
    if (exact) {
      return pathname === href || pathname === `${href}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        phoneDropdownRef.current &&
        !phoneDropdownRef.current.contains(e.target as Node)
      ) {
        setPhonesOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPhonesOpen(false);
        setDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const primaryPhone = BRAND_PHONES[0];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E4E6EC] bg-[#FAF9F6]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className="inline-flex shrink-0 items-center rounded-lg focus-visible:outline-2"
            aria-label={`${dict.brand.name} — ${dict.brand.slogan}`}
          >
            <BrandMark name={dict.brand.name} slogan={dict.brand.slogan} />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-0.5 lg:flex xl:gap-1"
          >
            {navLinks.map((item) => {
              const active = isNavActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3.5 xl:text-[15px] ${
                    active
                      ? "bg-[#EBF1FA] text-[#24508F]"
                      : "text-[#101828] hover:bg-[#F1F3F7] hover:text-[#24508F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-2.5">
            {/* Language Switcher */}
            <div
              role="group"
              aria-label={dict.nav.switchLanguageLabel}
              className="inline-flex items-center rounded-full border border-[#E4E6EC] bg-white p-1"
            >
              <Link
                href={buildLocaleHref("uk")}
                hrefLang="uk"
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  locale === "uk"
                    ? "bg-[#0F1B2E] text-white"
                    : "text-[#475467] hover:text-[#101828]"
                }`}
              >
                UA
              </Link>
              <Link
                href={buildLocaleHref("en")}
                hrefLang="en"
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  locale === "en"
                    ? "bg-[#0F1B2E] text-white"
                    : "text-[#475467] hover:text-[#101828]"
                }`}
              >
                EN
              </Link>
            </div>

            {/* Hotline Dropdown: compact icon at lg (1024-1279px), full stacked number at xl */}
            <div ref={phoneDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setPhonesOpen((prev) => !prev)}
                aria-expanded={phonesOpen}
                aria-label={`${dict.nav.hotlineLabel}: ${primaryPhone.display}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E6EC] bg-white text-left transition-colors hover:border-[#24508F]/40 xl:h-auto xl:w-auto xl:gap-2.5 xl:px-3.5 xl:py-1.5"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#24508F]" aria-hidden="true" />
                <span className="hidden flex-col leading-tight xl:flex">
                  <span className="text-[10px] font-medium text-[#667085]">
                    {dict.nav.hotlineLabel}
                  </span>
                  <span className="tabular-nums text-[13px] font-semibold text-[#101828]">
                    {primaryPhone.display}
                  </span>
                </span>
                <ChevronDown
                  className={`hidden h-3.5 w-3.5 text-[#667085] transition-transform xl:block ${
                    phonesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {phonesOpen ? (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E4E6EC] bg-white p-3 shadow-lg">
                  <p className="px-2 pb-2 text-xs font-semibold text-[#667085]">
                    {dict.contactsPage.phonesHeading}
                  </p>
                  <div className="space-y-1">
                    {BRAND_PHONES.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="flex items-center justify-between rounded-xl px-2.5 py-2 text-sm font-semibold text-[#101828] transition-colors hover:bg-[#F1F3F7]"
                      >
                        <span className="tabular-nums">{phone.display}</span>
                        <span className="text-xs font-medium text-[#667085]">
                          {phone.operatorLabel}
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-2.5 border-t border-[#E4E6EC] pt-2.5">
                    <a
                      href={BRAND_CHANNELS.telegramBotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl bg-[#EBF1FA] px-3 py-2 text-xs font-semibold text-[#24508F] transition-colors hover:bg-[#DCE7F7]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Send className="h-3.5 w-3.5" aria-hidden="true" />
                        Telegram {BRAND_CHANNELS.telegramBotHandle}
                      </span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

            <Link
              href={`/${locale}/booking`}
              className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl bg-[#24508F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73] xl:px-5"
            >
              {dict.nav.bookCta}
            </Link>
          </div>

          {/* Mobile quick controls */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Link
              href={buildLocaleHref(otherLocale)}
              hrefLang={otherLocale}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#E4E6EC] bg-white px-3 text-xs font-semibold text-[#101828]"
              aria-label={dict.nav.switchLanguageLabel}
            >
              {otherLocale === "uk" ? "UA" : "EN"}
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={dict.nav.openMenu}
              aria-expanded={drawerOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E6EC] bg-white text-[#101828] transition-colors hover:bg-[#F1F3F7]"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-over drawer rendered OUTSIDE sticky header so backdrop-blur-sm never clips fixed inset-0 */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#0F1B2E]/55 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.openMenu}
        >
          <div
            className="absolute inset-0"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-dvh w-full max-w-[360px] flex-col bg-[#FAF9F6] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[#E4E6EC] px-5 py-4">
              <BrandMark name={dict.brand.name} slogan={dict.brand.slogan} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={dict.nav.closeMenu}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E4E6EC] bg-white text-[#101828]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E4E6EC] bg-white p-1.5">
                <Link
                  href={buildLocaleHref("uk")}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold ${
                    locale === "uk"
                      ? "bg-[#0F1B2E] text-white"
                      : "text-[#475467]"
                  }`}
                >
                  Українська (UA)
                </Link>
                <Link
                  href={buildLocaleHref("en")}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold ${
                    locale === "en"
                      ? "bg-[#0F1B2E] text-white"
                      : "text-[#475467]"
                  }`}
                >
                  English (EN)
                </Link>
              </div>

              <nav aria-label="Mobile navigation" className="space-y-1.5">
                {navLinks.map((item) => {
                  const active = isNavActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 text-base font-medium ${
                        active
                          ? "bg-[#EBF1FA] text-[#24508F]"
                          : "bg-white text-[#101828] hover:bg-[#F1F3F7]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true" className="text-sm text-[#667085]">
                        →
                      </span>
                    </Link>
                  );
                })}
                <Link
                  href={`/${locale}/demo-requests`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex min-h-[48px] items-center justify-between rounded-xl border border-[#E4E6EC] bg-white px-4 text-sm font-medium text-[#475467]"
                >
                  <span>{dict.nav.demoRequests}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </nav>

              <div className="space-y-1.5 border-t border-[#E4E6EC] pt-4">
                {BRAND_PHONES.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="flex min-h-[44px] items-center justify-between rounded-xl border border-[#E4E6EC] bg-white px-3.5 text-sm font-semibold text-[#101828]"
                  >
                    <span className="inline-flex items-center gap-2 tabular-nums">
                      <Phone className="h-4 w-4 text-[#24508F]" aria-hidden="true" />
                      {phone.display}
                    </span>
                    <span className="text-xs text-[#667085]">
                      {phone.operatorLabel}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-[#E4E6EC] bg-[#FAF9F6] px-5 py-4">
              <Link
                href={`/${locale}/booking`}
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#24508F] px-5 text-base font-semibold text-white"
              >
                {dict.nav.bookCta}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
