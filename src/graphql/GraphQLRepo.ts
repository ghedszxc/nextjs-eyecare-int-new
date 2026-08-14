import { stripIgnoredCharacters } from "graphql";
import { unstable_cache } from "next/cache";
import {
  ApolloClient,
  ApolloQueryResult,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { IRepo } from "@/models/IRepo.interface";
import {
  CMS_TAG,
  CmsMeta,
  isCmsCacheDisabled,
  scopedTag,
  tagForMeta,
  ttlForMeta,
} from "./cmsCache";
import { PageQuery } from "./query/Page";
import { PathsQuery } from "./query/Paths";
import { PathsIdQuery } from "./query/PathsID";
import { RelatedPaths } from "./query/RelatedPaths";
import { ContentByIdQuery } from "./query/ContentID";
import { FileLinkQuery } from "./query/Filelink";
import { ArticleQuery } from "./query/Article";
import { SettingsQuery } from "./query/Settings";
import { MetaDataQuery } from "./query/MetaData";
import { NavigationQuery } from "./query/Navigation";
import { FooterQuery } from "./query/Footer";
import { ArticleContentByIdQuery } from "./query/ArticleContentById";
import { ArticleListQuery } from "./query/ArticleList";
import { ArticleSearchQuery } from "./query/ArticleSearch";
import { SITE_ID } from "@/lib/constants/BLOG_CONSTANT";
import { GlobalSearchQuery } from "./query/GlobalSearch";

/**
 * Guard against persisting failed/empty responses in the Data Cache.
 *
 * Only a *missing* `data` payload counts as a failure. CoreMedia routinely
 * returns partial, field-level `errors` (e.g. NO_SUCH_PROPERTY_DESCRIPTOR on
 * `teaserTargets`) alongside otherwise-usable data, and the Apollo client runs
 * with `errorPolicy: "all"` precisely so those responses still render. Throwing
 * on partial errors would 500 pages that previously worked — so we only reject
 * (and therefore never cache) responses with no data at all.
 */
function assertOk<T>(
  resp: ApolloQueryResult<T>,
  label: string,
): ApolloQueryResult<T> {
  if (!resp.data) {
    throw new Error(
      `${label} query failed: ${JSON.stringify(resp.errors ?? "no data")}`,
    );
  }
  return resp;
}

export class GraphQLRepo implements IRepo {
  currentPage = "";

  currentContext(params?: string) {
    return new ApolloClient({
      ssrMode: false,
      link: new HttpLink({
        uri: process.env.GRAPHQL_URL + (params || ""),
        credentials: "same-origin",
        useGETForQueries: false,
        print: (ast, originalPrint) =>
          stripIgnoredCharacters(originalPrint(ast)),
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      },
    });
  }

  /**
   * Wrap a CMS query in the Next.js Data Cache, keyed by `meta` + `keyParts`
   * and tagged for on-demand `revalidateTag` invalidation. Failed/empty
   * responses throw so they are never persisted.
   *
   * Preview deployments bypass the cache entirely so editors see live content.
   */
  private requestCoreMedia<T>(
    meta: CmsMeta,
    keyParts: string[],
    fetcher: () => Promise<ApolloQueryResult<T>>,
    extraTags: string[] = [],
  ): Promise<ApolloQueryResult<T>> {
    const run = () => fetcher().then((resp) => assertOk(resp, meta || "CMS"));

    if (isCmsCacheDisabled()) return run();

    const tags = [tagForMeta(meta), ...extraTags].filter(Boolean) as string[];

    const cached = unstable_cache(
      run,
      ["cms", meta || "default", ...keyParts],
      { revalidate: ttlForMeta(meta), tags },
    );

    return cached();
  }

  getLayoutData(language: string, path: string) {
    return this.requestCoreMedia(
      "mainExpanded",
      [language, path],
      () =>
        this.currentContext("?area=" + language).query(
          PageQuery({ path: [language, path].join("/") }),
        ),
      [
        scopedTag(CMS_TAG.mainExpanded, language),
        scopedTag(CMS_TAG.mainExpanded, `${language}/${path}`),
      ],
    );
  }

  getPathsData(id: string) {
    return this.requestCoreMedia(
      "navigation",
      [id],
      () => this.currentContext().query(PathsQuery({ id: id })),
      [scopedTag(CMS_TAG.navigation, id)],
    );
  }

  getRelatedPaths(path: string) {
    return this.currentContext().query(RelatedPaths({ path: path }));
  }

  getPathsId() {
    return this.requestCoreMedia("navigation", [], () =>
      this.currentContext().query(PathsIdQuery()),
    );
  }

  getContentById(id: string) {
    return this.currentContext().query(ContentByIdQuery({ id: id }));
  }

  getFileLink(id: string) {
    return this.currentContext().query(FileLinkQuery({ id: id }));
  }

  getArticleId(
    sortFields:
      | "EXTERNALLY_DISPLAYED_DATE_DESC"
      | "EXTERNALLY_DISPLAYED_DATE_ASC"
      | "TITLE_ASC"
      | "TITLE_DESC"
      | "TEASER_TITLE_ASC"
      | "TEASER_TITLE_DESC",
    tags: string,
    offset: number,
    limit: number,
  ) {
    return this.currentContext().query(
      ArticleQuery({
        siteId: "", // Add master site id
        sortFields,
        tags,
        offset,
        limit,
      }),
    );
  }

  getSettings(path: string, names: string[]) {
    return this.requestCoreMedia(
      "settings",
      [path, names.join(",")],
      () => this.currentContext().query(SettingsQuery({ path, names })),
      [scopedTag(CMS_TAG.settings, path)],
    );
  }

  getMetaData(language: string, path: string) {
    return this.requestCoreMedia(
      "metadata",
      [language, path],
      () =>
        this.currentContext().query(
          MetaDataQuery({ path: language + "/" + path }),
        ),
      [scopedTag(CMS_TAG.metadata, `${language}/${path}`)],
    );
  }

  getNavigation(lang: string) {
    return this.requestCoreMedia(
      "headerFooter",
      [lang],
      () =>
        this.currentContext().query(
          NavigationQuery({
            path: `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}/headerfooternavigation`,
          }),
        ),
      [scopedTag(CMS_TAG.headerFooter, lang)],
    );
  }

  getFooter(lang: string, footerItems: string[]) {
    return this.requestCoreMedia(
      "headerFooter",
      [lang, footerItems.join(",")],
      () =>
        this.currentContext().query(
          FooterQuery({
            path: `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}/headerfooternavigation`,
            names: footerItems,
          }),
        ),
      [scopedTag(CMS_TAG.headerFooter, lang)],
    );
  }

  getArticleContentById(id: string) {
    return this.requestCoreMedia(
      "article",
      [id],
      () =>
        this.currentContext().query(ArticleContentByIdQuery({ contentId: id })),
      [scopedTag(CMS_TAG.article, id)],
    );
  }

  getArticleList(
    language: string,
    path: string,
    limit?: number,
    offset?: number,
  ) {
    return this.requestCoreMedia(
      "article",
      [language, path, String(limit ?? ""), String(offset ?? "")],
      () =>
        this.currentContext("?area=" + language).query(
          ArticleListQuery({ path: [language, path].join("/"), limit, offset }),
        ),
      [scopedTag(CMS_TAG.article, `${language}/${path}`)],
    );
  }

  getArticleSearch(search: string, limit?: number, offset?: number) {
    return this.currentContext().query(
      ArticleSearchQuery({ siteId: SITE_ID, search, limit, offset }),
    );
  }

  getGlobalSearch(search: string, limit?: number, offset?: number) {
    return this.currentContext().query(
      GlobalSearchQuery({ siteId: SITE_ID, search, limit, offset }),
    );
  }
}
