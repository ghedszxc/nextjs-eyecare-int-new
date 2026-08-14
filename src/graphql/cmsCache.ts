import crypto from "node:crypto";

/**
 * CoreMedia caching helpers built on top of the Next.js App Router Data Cache.
 *
 * We cache at the *function-result* layer (`unstable_cache`) rather than the
 * `fetch` layer because Apollo Client issues POST requests, which (a) bypass
 * Next.js' instrumented `fetch` and (b) would not be persisted by the Data
 * Cache anyway (only GET fetches are cached).
 *
 * Each cached entry carries:
 *  - a per-meta `revalidate` window (TTL, in seconds) sourced from env, and
 *  - one or more `tags`, enabling on-demand invalidation via `revalidateTag`.
 */

/** Logical content domains used as the coarse-grained cache tags. */
export const CMS_TAG = {
  navigation: "cms:navigation", // sitemap / paths
  metadata: "cms:metadata",
  headerFooter: "cms:header-footer", // header, footer & nav config
  mainExpanded: "cms:main-expanded", // page layout
  settings: "cms:settings",
  article: "cms:article", // newsroom/news listing & article detail
} as const;

export type CmsMeta = keyof typeof CMS_TAG | "";

/** Fallback TTL (seconds) when a meta type has no configured window. */
export const DEFAULT_TTL_SECONDS = 1_800; // 30 minutes

const safeNumberEnv = (value: string | undefined, defaultValue: number) => {
  if (value == null) return defaultValue;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/** Revalidation windows (seconds) per meta type, env-driven with fallbacks. */
const CACHE_TTL: Record<string, number> = {
  navigation: safeNumberEnv(process.env.SITEMAP_CACHE_TTL, 86_400), // 24 hours
  metadata: safeNumberEnv(process.env.METADATA_CACHE_TTL, 1_800), // 30 minutes
  headerFooter: safeNumberEnv(process.env.HEADER_FOOTER_CACHE_TTL, 1_800), // 30 minutes
  mainExpanded: safeNumberEnv(process.env.PAGE_CACHE_TTL, 360), // 6 minutes
  settings: safeNumberEnv(process.env.SETTINGS_CACHE_TTL, 1_800), // 30 minutes
  article: safeNumberEnv(process.env.ARTICLE_CACHE_TTL, 360), // 6 minutes
};

/**
 * CMS caching is turned OFF for preview deployments so editors always see the
 * freshest CoreMedia content; it stays ON for live.
 */
export const isCmsCacheDisabled = (): boolean =>
  (process.env.GRAPHQL_URL ?? "").includes("preview");

/** Resolve the revalidation window (seconds) for a given meta type. */
export const ttlForMeta = (meta: string): number =>
  CACHE_TTL[meta] ?? DEFAULT_TTL_SECONDS;

/** Resolve the coarse-grained content tag for a given meta type. */
export const tagForMeta = (meta: string): string | undefined =>
  (CMS_TAG as Record<string, string>)[meta];

const MAX_TAG_LENGTH = 256;

/** Build a stable, locale/path-scoped tag, e.g. `cms:header-footer:en_us`. */
export const scopedTag = (base: string, scope?: string): string => {
  if (!scope) {
    return base;
  }

  const value = `${base}:${scope}`;

  if (value.length <= MAX_TAG_LENGTH) {
    return value;
  }

  const hash = crypto.createHash("sha256").update(scope).digest("hex").slice(0, 24);

  return `${base}:${hash}`;
};
