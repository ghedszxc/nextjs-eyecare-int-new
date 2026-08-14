import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "./lib/constants/LOCALIZATIONS";
import {
  IGNORED_PREFIXES,
  PUBLIC_PATH_PREFIXES,
} from "./lib/constants/ROUTES";
import { SESSION_COOKIE_NAME } from "./lib/session";

export const locales = LOCALES;
export const defaultLocale = DEFAULT_LOCALE;

function getLocale(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1];
  return locales.find((item) => item === locale);
}

/**
 * Extensions that identify a static asset or a file route handler
 * (/robots.txt, /sitemap.xml), which skip this middleware entirely.
 *
 * Deliberately an allowlist rather than "any path containing a dot": a page slug
 * may hold a dot too, and skipping those meant they reached the page with no
 * x-locale header and no locale rewrite — so notFound() fired after the shell
 * had flushed, answering a soft 404 (HTTP 200) with no navigation or footer.
 */
const PUBLIC_FILE =
  /\.(?:ico|png|jpe?g|gif|svg|webp|avif|bmp|css|js|mjs|map|json|txt|xml|pdf|woff2?|ttf|otf|eot|mp4|webm|webmanifest)$/i;

/** Strips a leading locale segment so path checks work on the public URL. */
function withoutLocale(pathname: string, locale?: string) {
  return locale ? pathname.replace(new RegExp(`^/${locale}`), "") || "/" : pathname;
}

/** Whether the first path segment marks a request that is never a CMS page. */
function isIgnoredPath(pathname: string) {
  const [firstSegment] = pathname.split("/").filter(Boolean);

  return !!firstSegment && IGNORED_PREFIXES.includes(firstSegment);
}

/** Whether a request may render without a session (login page, public newsroom). */
function isPublicPath(pathname: string) {
  if (pathname === "/") return false;

  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isInternalFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname);

  if (isInternalFile) return NextResponse.next();

  const currentLocale = getLocale(request);
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`,
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", currentLocale ?? defaultLocale);

  if (currentLocale === defaultLocale) {
    const newPathname = pathname.replace(`/${defaultLocale}`, "") || "/";
    const url = new URL(newPathname, request.url);
    return NextResponse.redirect(url, { headers: requestHeaders });
  }

  /**
   * Auth gate.
   *
   * The pages still call requireAuth(); this is not the security boundary — the
   * cookie is only checked for presence here, and its contents are verified
   * server-side. What this adds is a real 307 issued *before* the streamed shell
   * is flushed. Redirecting from the page instead degrades to HTTP 200 plus a
   * `<meta http-equiv="refresh">`, which crawlers read as an indexable page and
   * which costs a wasted CMS round-trip per request.
   */
  const publicPath = withoutLocale(pathname, currentLocale);

  /**
   * Non-page prefixes answer 404 here rather than in the page. Reaching the page
   * meant notFound() was thrown after the shell had flushed, which pins the
   * response at HTTP 200 — a soft 404 that crawlers treat as a real page.
   */
  if (isIgnoredPath(publicPath)) {
    return new NextResponse(null, { status: 404, headers: requestHeaders });
  }

  if (!isPublicPath(publicPath) && !request.cookies.has(SESSION_COOKIE_NAME)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", publicPath);

    return NextResponse.redirect(loginUrl, { headers: requestHeaders });
  }

  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}
