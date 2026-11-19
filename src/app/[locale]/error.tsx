"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() || "/uk";
  const isEn = pathname.startsWith("/en");
  const locale = isEn ? "en" : "uk";

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-3xl">
          {isEn ? "Something went wrong" : "Виникла технічна помилка"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#475467] sm:text-base">
          {isEn
            ? "Please try refreshing this view or return to the home page."
            : "Спробуйте оновити сторінку або поверніться на головну."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{isEn ? "Try again" : "Спробувати знову"}</span>
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex h-11 items-center rounded-xl border border-[#CBD2DF] bg-white px-5 text-sm font-semibold text-[#101828]"
          >
            {isEn ? "Home" : "На головну"}
          </Link>
        </div>
      </div>
    </section>
  );
}

