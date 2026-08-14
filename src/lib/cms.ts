import { cache } from "react";
import { cmsRepo } from "@/graphql/CMSRepo";

/**
 * Request-level memoized CMS reads.
 *
 * `generateMetadata()` and the page component run in the same render pass, so
 * wrapping the reads they BOTH perform in React.cache() collapses their
 * duplicate CoreMedia round-trips into a single query per request. Use these
 * wrappers (instead of calling cmsRepo directly) anywhere the same query is
 * issued from both metadata and the page body.
 *
 * Note: this is per-request dedup only — cross-request caching lives in the
 * repo layer (GraphQLRepo.requestCoreMedia / unstable_cache, see cmsCache.ts).
 */

export const getLayoutData = cache((language: string, path: string) =>
  cmsRepo.getLayoutData(language, path),
);

export const getArticleList = cache(
  (language: string, path: string, limit?: number, offset?: number) =>
    cmsRepo.getArticleList(language, path, limit, offset),
);

export const getArticleContentById = cache((id: string) =>
  cmsRepo.getArticleContentById(id),
);

export const getArticleSearch = cache(
  (search: string, limit?: number, offset?: number) =>
    cmsRepo.getArticleSearch(search, limit, offset),
);

export const getGlobalSearch = cache(
  (search: string, limit?: number, offset?: number) =>
    cmsRepo.getGlobalSearch(search, limit, offset),
);
