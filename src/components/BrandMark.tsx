import React from "react";
import Image from "next/image";

interface BrandMarkProps {
  variant?: "light" | "dark";
  name: string;
  slogan?: string;
}

export function BrandMark({
  variant = "light",
  name,
  slogan,
}: BrandMarkProps) {
  const isDark = variant === "dark";

  return (
    <span className="inline-flex items-center gap-2.5 sm:gap-3 select-none">
      <span className="inline-flex shrink-0 items-center justify-center">
        <Image
          src="/images/logo-ukrvoyazh.webp"
          alt={name}
          width={132}
          height={80}
          priority={!isDark}
          sizes="72px"
          className="h-9 w-auto object-contain sm:h-10"
        />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display whitespace-nowrap text-sm font-semibold tracking-tight sm:text-base ${
            isDark ? "text-[#F8FAFC]" : "text-[#0F1B2E]"
          }`}
        >
          {name}
        </span>
        {slogan ? (
          <span
            className={`mt-0.5 whitespace-nowrap text-[10px] font-medium tracking-wide sm:text-[11px] ${
              isDark ? "text-[#A8B7CE]" : "text-[#475467]"
            }`}
          >
            {slogan}
          </span>
        ) : null}
      </span>
    </span>
  );
}
