import { NEWS_PATH } from "@/lib/constants/BLOG_CONSTANT";

/**
 * First path segments that are never CMS pages. These resolve to a 404 rather
 * than a login redirect, so the middleware auth gate lets them through to the
 * page, which calls notFound().
 */
export const IGNORED_PREFIXES = [
  "static",
  "internal",
  "appspecific",
  "_next",
  "api",
  "src",
];

/**
 * Path prefixes that render without a session, so the middleware auth gate skips
 * them: the login page itself, and the newsroom (public, with per-article role
 * filtering handled in the page via canAccessContent).
 */
export const PUBLIC_PATH_PREFIXES = ["/login", `/${NEWS_PATH.join("/")}`];
