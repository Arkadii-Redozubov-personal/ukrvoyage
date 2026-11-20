"use client";

import React from "react";
import { Building2, Check, Globe, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { GeographyType, LocationSuggestion } from "@/data/routes";

interface LocationAutocompleteDropdownProps {
  open: boolean;
  locale: Locale;
  query: string;
  currentValue: string;
  suggestions: LocationSuggestion[];
  activeIndex: number;
  excludeValue?: string;
  onSelect: (suggestion: LocationSuggestion) => void;
  onUseCustom: (customText: string) => void;
  onHoverIndex: (index: number) => void;
}

function ScopeIcon({ scope }: { scope: GeographyType }) {
  if (scope === "international") {
    return (
      <Globe
        className="h-4 w-4 shrink-0 text-[#1E4A8F]"
        aria-hidden="true"
      />
    );
  }
  if (scope === "city") {
    return (
      <Building2
        className="h-4 w-4 shrink-0 text-[#1E4A8F]"
        aria-hidden="true"
      />
    );
  }
  return (
    <MapPin
      className="h-4 w-4 shrink-0 text-[#1E4A8F]"
      aria-hidden="true"
    />
  );
}

export function LocationAutocompleteDropdown({
  open,
  locale,
  query,
  currentValue,
  suggestions,
  activeIndex,
  onSelect,
  onUseCustom,
  onHoverIndex,
}: LocationAutocompleteDropdownProps) {
  if (!open) return null;

  const trimmedQuery = query.trim();
  const hasExactMatch = suggestions.some((item) => {
    const label = locale === "uk" ? item.nameUk : item.nameEn;
    return label.toLowerCase() === trimmedQuery.toLowerCase();
  });

  const headerText =
    trimmedQuery.length > 0
      ? locale === "uk"
        ? "Схожі міста та напрямки"
        : "Matching cities & destinations"
      : locale === "uk"
      ? "Популярні міста та пункти"
      : "Popular cities & pickup points";

  const customAddressLabel =
    locale === "uk" ? "Вказати власну адресу:" : "Use custom address:";

  return (
    <div
      role="listbox"
      aria-label={headerText}
      className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[300px] min-w-[260px] overflow-y-auto rounded-2xl border border-[#DCE6F5] bg-white p-1.5 shadow-[0_20px_48px_-14px_rgba(15,27,46,0.24)]"
    >
      <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
        {headerText}
      </div>

      {suggestions.length > 0 ? (
        <ul className="space-y-0.5">
          {suggestions.map((item, idx) => {
            const label = locale === "uk" ? item.nameUk : item.nameEn;
            const region = locale === "uk" ? item.regionUk : item.regionEn;
            const isSelected =
              currentValue.trim().toLowerCase() === label.toLowerCase();
            const isHighlighted = idx === activeIndex;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => onHoverIndex(idx)}
                  onClick={() => onSelect(item)}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${
                    isHighlighted
                      ? "bg-[#EEF4FD] text-[#0D1E3B]"
                      : isSelected
                      ? "bg-[#F7FAFE] text-[#0D1E3B]"
                      : "text-[#101828] hover:bg-[#F4F8FE]"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E4ECF6] bg-white">
                      <ScopeIcon scope={item.scope} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold leading-tight text-[#0F1B2E]">
                        {label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-medium leading-tight text-[#667085]">
                        {region}
                      </span>
                    </span>
                  </span>

                  {isSelected ? (
                    <Check
                      className="h-4 w-4 shrink-0 text-[#1E4A8F]"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {trimmedQuery.length > 1 && !hasExactMatch ? (
        <div
          className={
            suggestions.length > 0
              ? "mt-1 border-t border-[#E6EEF8] pt-1"
              : "pt-0.5"
          }
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onUseCustom(trimmedQuery)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#1E4A8F] transition-colors hover:bg-[#EEF4FD]"
          >
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {customAddressLabel}{" "}
              <strong className="font-semibold text-[#0F1B2E]">
                «{trimmedQuery}»
              </strong>
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

