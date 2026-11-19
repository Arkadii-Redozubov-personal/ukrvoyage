"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

interface DesktopDemoPillProps {
  locale: Locale;
  dict: Dictionary;
}

export function DesktopDemoPill({ locale, dict }: DesktopDemoPillProps) {
  const pathname = usePathname() || "";
  if (pathname.includes("/demo-requests")) {
    return null;
  }

  return (
    <Link
      href={`/${locale}/demo-requests`}
      className="group fixed bottom-5 right-5 z-30 hidden items-center gap-2 rounded-full border border-[#2F4568] bg-[#0F1B2E]/95 px-4 py-2.5 text-xs font-semibold text-[#F8FAFC] shadow-[0_14px_34px_-10px_rgba(15,27,46,0.45)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#F2CE24] hover:bg-[#162640] lg:inline-flex"
    >
      <ClipboardList
        className="h-4 w-4 shrink-0 text-[#F2CE24]"
        aria-hidden="true"
      />
      <span>{dict.nav.demoRequests}</span>
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 text-[#A8B7CE] transition-colors group-hover:text-[#F2CE24]"
        aria-hidden="true"
      />
    </Link>
  );
}

