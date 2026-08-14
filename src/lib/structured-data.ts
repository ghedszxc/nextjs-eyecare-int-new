import { NEWS_PATH } from "@/lib/constants/BLOG_CONSTANT";
import { toIsoTimestamp, toMetaDescription } from "@/lib/utilities";

/**
 * Publisher/organisation name used in JSON-LD and og:site_name.
 *
 * Change it here only — this is the single source for the brand string that
 * search engines and link unfurlers display.
 */
export const SITE_NAME = "EssilorLuxottica Eyecare";

/**
 * Logo used as the publisher/organisation image, and as the og:image fallback for
 * pages with no CMS meta image (must be a crawlable URL).
 */
export const SITE_LOGO_PATH = "/images/logo-luxottica-2022-png-data.png";

/** Google truncates headlines past ~110 characters. */
const MAX_HEADLINE_LENGTH = 110;

type JsonLdObject = Record<string, unknown>;

const absolute = (origin: string, path: string) =>
  new URL(path, origin).toString();

const organisation = (origin: string): JsonLdObject => ({
  "@type": "Organization",
  name: SITE_NAME,
  url: absolute(origin, "/"),
  logo: {
    "@type": "ImageObject",
    url: absolute(origin, SITE_LOGO_PATH),
  },
});

/**
 * Organization + WebSite for the home page. The SearchAction points at the real
 * global search route (`/search/?q=`), so it stays accurate if that URL changes.
 */
export function buildSiteSchema(origin: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...organisation(origin), "@id": `${absolute(origin, "/")}#organization` },
      {
        "@type": "WebSite",
        "@id": `${absolute(origin, "/")}#website`,
        name: SITE_NAME,
        url: absolute(origin, "/"),
        publisher: { "@id": `${absolute(origin, "/")}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${absolute(origin, "/search/")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/**
 * NewsArticle for a newsroom article.
 *
 * The CMS exposes no author field, so the publishing organisation is credited —
 * accurate for internal comms, and Google accepts an Organization author.
 * `dateModified` is omitted rather than guessed: only the displayed date is
 * available.
 */
export function buildNewsArticleSchema({
  origin,
  url,
  article,
  imageUrl,
}: {
  origin: string;
  /** Absolute URL of the article page. */
  url: string;
  article: {
    title?: string | null;
    teaserTitle?: string | null;
    htmlTitle?: string | null;
    htmlDescription?: string | null;
    teaserText?: { text?: string | null } | null;
    detailText?: { text?: string | null } | null;
    extDisplayedDate?: string | null;
  };
  imageUrl?: string | null;
}): JsonLdObject | null {
  const headline = toMetaDescription(
    article.title || article.teaserTitle || article.htmlTitle,
    MAX_HEADLINE_LENGTH,
  );

  // Without a headline there is nothing valid to emit.
  if (!headline) return null;

  const description =
    article.htmlDescription ||
    toMetaDescription(
      article.teaserText?.text || article.detailText?.text,
    );
  const datePublished = toIsoTimestamp(article.extDisplayedDate ?? undefined);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    ...(description ? { description } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(datePublished ? { datePublished } : {}),
    author: organisation(origin),
    publisher: organisation(origin),
  };
}

/**
 * BreadcrumbList for an article: Home → News → article.
 *
 * The tag level is deliberately skipped — `/newsroom/news/{tag}/` is not a page
 * the app renders, so listing it would point crawlers at a 404.
 */
export function buildArticleBreadcrumbSchema({
  origin,
  url,
  name,
}: {
  origin: string;
  url: string;
  name: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absolute(origin, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: absolute(origin, `/${NEWS_PATH.join("/")}/`),
      },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };
}
