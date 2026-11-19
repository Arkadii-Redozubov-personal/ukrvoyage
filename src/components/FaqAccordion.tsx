"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/i18n/types";

interface FaqAccordionProps {
  dict: Dictionary;
}

export function FaqAccordion({ dict }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-3xl">
              {dict.faqSection.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#475467]">
              {dict.faqSection.lead}
            </p>
          </div>

          <div className="divide-y divide-[#E4E6EC] border-y border-[#E4E6EC] lg:col-span-8">
            {dict.faqSection.items.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `faq-panel-${idx}`;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-[#24508F]"
                  >
                    <span className="text-base font-semibold text-[#0F1B2E] sm:text-lg">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#475467] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#24508F]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen ? (
                    <div
                      id={panelId}
                      className="pb-5 pr-8 text-sm leading-relaxed text-[#475467] sm:text-base"
                    >
                      {item.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

