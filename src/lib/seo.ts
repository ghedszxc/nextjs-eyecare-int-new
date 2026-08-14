import { headers } from "next/headers";
import { Metadata } from "next";
import { isProductionHost } from "@/lib/utilities";
import { SITE_LOGO_PATH, SITE_NAME } from "@/lib/structured-data";

/** noindex, nofollow — used for 404s and for CMS-flagged pages. */
const NO_INDEX_ROBOTS: Metadata["robots"] = { index: false, follow: false };

/**
 * The host serving this request, behind the ingress proxy.
 *
 * Page components use the `origin` to build the absolute URLs JSON-LD needs.
 */
export async function getRequestOrigin(): Promise<{
  host: string;
  origin?: string;
}> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") || headersList.get("host") || "";

  if (!host) {
    // No host header to work from (never the case behind the ingress). Fall back
    // to the configured domain so canonical/og:image still resolve.
    return {
      host,
      origin: process.env.NEXT_PUBLIC_DOMAIN || undefined,
    };
  }

  const protocol =
    headersList.get("x-forwarded-proto") ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return { host, origin: `${protocol}://${host}` };
}

/**
 * Robots metadata that only allows indexing on production. Non-production
 * hosts (dev/uat/preview/local) return noindex, nofollow so they stay out
 * of search indexes (mirrors the robots.txt / sitemap.xml routes).
 */
export async function getRobotsMeta(): Promise<Metadata["robots"]> {
  const { host } = await getRequestOrigin();

  return isProductionHost(host) ? { index: true, follow: true } : NO_INDEX_ROBOTS;
}

/** Metadata returned for pages that resolve to a 404 (noindex, nofollow). */
export const NOT_FOUND_METADATA: Metadata = {
  title: "404",
  description: "404",
  robots: NO_INDEX_ROBOTS,
};

const FAVICON_ICONS: Metadata["icons"] = [
  { type: "image/x-icon", rel: "icon", url: "/favicon.ico" },
];

/**
 * Canonical path for a page.
 *
 * Public URLs carry no locale segment (middleware strips the default locale) and
 * always end in a slash (`trailingSlash: true`), so a canonical that omits the
 * slash would point at a redirect.
 */
function toCanonicalPath(path?: string | null, search?: string | null): string {
  const segments = (path ?? "").split("/").filter(Boolean).join("/");
  const query = search
    ? `${search.startsWith("?") ? "" : "?"}${search}`
    : "";

  return `/${segments ? `${segments}/` : ""}${query}`;
}

/**
 * Builds the standard page metadata from the CMS-provided fields: title (falling
 * back to "404 - Page Not Found"), description, keywords, favicon, host-aware
 * robots, canonical URL and Open Graph / Twitter tags.
 */
export async function buildPageMetadata(fields: {
  htmlTitle?: string | null;
  description?: string | null;
  keywords?: string | null;
  /** Page path without locale or surrounding slashes, e.g. "newsroom/news/feature/slug-123". */
  path?: string | null;
  /** Query string to keep on the canonical URL, e.g. "?pageNum=2". */
  search?: string | null;
  /** Absolute image URL for og:image / twitter:image. */
  image?: string | null;
  /** Open Graph type; articles also get article:published_time. */
  type?: "website" | "article";
  /** ISO timestamp for article:published_time. */
  publishedTime?: string | null;
  /** The CMS `noIndexNoFollow` page setting, which overrides the host default. */
  noIndex?: boolean;
}): Promise<Metadata> {
  const title = fields.htmlTitle || "404 - Page Not Found";
  const description = fields.description ?? undefined;
  const canonical = toCanonicalPath(fields.path, fields.search);

  // Pages with no CMS meta image fall back to the site logo, so shared links
  // always unfurl with something. The path is relative on purpose: Next resolves
  // it against metadataBase below.
  const hasCmsImage = !!fields.image;
  const images = [hasCmsImage ? fields.image! : SITE_LOGO_PATH];

  // `metadataBase` resolves the relative canonical/og URLs below. It is derived
  // from the request host (as robots.txt and sitemap.xml already do) rather than
  // NEXT_PUBLIC_DOMAIN, because that value is baked into the committed .env and
  // the deploy pipeline only overrides GRAPHQL_URL/AKAMAY_PATH — so a
  // configured base would make production canonicals point at the UAT host.
  const { host, origin } = await getRequestOrigin();

  const openGraph: Metadata["openGraph"] =
    fields.type === "article"
      ? {
          type: "article",
          title,
          description,
          url: canonical,
          siteName: SITE_NAME,
          images,
          publishedTime: fields.publishedTime ?? undefined,
        }
      : {
          type: "website",
          title,
          description,
          url: canonical,
          siteName: SITE_NAME,
          images,
        };

  return {
    title,
    description,
    keywords: fields.keywords ?? undefined,
    robots:
      fields.noIndex || !isProductionHost(host)
        ? NO_INDEX_ROBOTS
        : { index: true, follow: true },
    icons: FAVICON_ICONS,
    metadataBase: origin ? new URL(origin) : undefined,
    alternates: { canonical },
    openGraph,
    twitter: {
      // The logo fallback is 314x40, under the 300x157 minimum a large card
      // needs, so only a real CMS image gets the large treatment.
      card: hasCmsImage ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}
