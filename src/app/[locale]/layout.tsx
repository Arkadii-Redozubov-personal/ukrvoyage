import type { Metadata } from "next";
import { Golos_Text, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isValidLocale, LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BookingDraftProvider } from "@/context/BookingDraftContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCta } from "@/components/MobileStickyCta";

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600"],
  variable: "--font-unbounded",
  display: "swap",
});

const golosText = Golos_Text({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-golos",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isValidLocale(raw) ? raw : "uk";
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL("https://ukrvoyazh-demo.local"),
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${unbounded.variable} ${golosText.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-[#FAF9F6] text-[#101828]">
        <BookingDraftProvider>
          <Header locale={locale} dict={dict} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
          <MobileStickyCta locale={locale} dict={dict} />
        </BookingDraftProvider>
      </body>
    </html>
  );
}

