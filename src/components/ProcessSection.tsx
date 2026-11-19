import React from "react";
import type { Dictionary } from "@/i18n/types";

interface ProcessSectionProps {
  dict: Dictionary;
}

export function ProcessSection({ dict }: ProcessSectionProps) {
  return (
    <section className="border-y border-[#E4E6EC] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-4xl">
            {dict.processSection.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#475467]">
            {dict.processSection.lead}
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.processSection.steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col justify-between rounded-2xl border border-[#E4E6EC] bg-[#FAF9F6] p-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F1B2E] tabular-nums text-xs font-semibold text-[#F2CE24]">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-[#0F1B2E]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#475467]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

