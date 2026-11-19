import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isValidLocale } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  const firstSegment = pathname.split("/")[1];
  if (firstSegment && !isValidLocale(firstSegment)) {
    const knownRoutes = [
      "services",
      "fleet",
      "booking",
      "about",
      "contacts",
      "privacy",
      "demo-requests",
    ];
    if (knownRoutes.includes(firstSegment)) {
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

