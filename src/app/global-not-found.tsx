import type { Metadata } from "next";
import { Golos_Text, Unbounded } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600"],
  variable: "--font-unbounded",
});

const golosText = Golos_Text({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-golos",
});

export const metadata: Metadata = {
  title: "404 — УкрВояж / UkrVoyazh",
  description: "Page not found",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="uk"
      className={`${unbounded.variable} ${golosText.variable} h-full`}
    >
      <body className="flex min-h-full items-center justify-center bg-[#FAF9F6] px-4 text-[#101828]">
        <div className="max-w-lg rounded-[24px] border border-[#E4E6EC] bg-white p-8 text-center">
          <p className="font-display tabular-nums text-5xl font-semibold text-[#24508F]">
            404
          </p>
          <h1 className="font-display mt-4 text-2xl font-semibold text-[#0F1B2E]">
            Сторінку не знайдено / Page not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#475467]">
            Оберіть українську або англійську версію сайту «УкрВояж».
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/uk"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white"
            >
              Українська (UA)
            </Link>
            <Link
              href="/en"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD2DF] bg-white px-5 text-sm font-semibold text-[#101828]"
            >
              English (EN)
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

