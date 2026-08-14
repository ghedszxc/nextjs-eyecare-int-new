import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { defaultLocale, locales } from "@/middleware";
import {
  isProductionHost,
  localeSegmentRemoval,
  toIsoTimestamp,
} from "@/lib/utilities";
import { SITEMAP_TO_REMOVE } from "@/lib/constants/SITEMAP_TO_REMOVE";
import { StaticPathsAdapter } from "@/coremedia-integration/adapters/staticPathsAdapter";
import { cmsRepo } from "@/graphql/CMSRepo";
import {
  CMS_TAG,
  isCmsCacheDisabled,
  scopedTag,
  ttlForMeta,
} from "@/graphql/cmsCache";
import { NEWS_PATH } from "@/lib/constants/BLOG_CONSTANT";
import { Nullable } from "@/models/Nullable.interface";

const NEWS_SITEMAP_PAGE_SIZE = 100;

interface ICMSPathIds {
  id: string;
  root: {
    segment: string;
  };
  modificationDate: string;
  hiddenInSitemap: boolean;
}

interface ICMSArticle {
  id: string;
  extDisplayedDate: string;
  navigationPath: { segment: string }[];
  subjectTaxonomy: {
    id: number;
    name: string;
    externalReference: string;
    value: string;
    parent?: {
      id: number;
      name: string;
      value: string;
      externalReference: string;
    };
  }[];
}

export interface IFilteredLocalePaths {
  path: string;
  modificationDate: string;
  isPriority: boolean;
}

interface IAdaptedRes {
  params: { slug: string; page: string[] };
  locale: string;
  modificationDate: string;
}

/**
 * Render a flat `<urlset>` for every path of the requested locale.
 *
 * There is a single sitemap because LOCALES holds one entry and `/sitemap.xml`
 * is the only sitemap route. If more locales are added, wrap these per-locale
 * urlsets in a `<sitemapindex>` served from the root and expose each locale at
 * its own route — the index is meaningless while there is one child to list.
 */
function generateSitemap(
  filteredLocalePaths: Nullable<IFilteredLocalePaths[]>,
) {
  return `
      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      >
        ${filteredLocalePaths
          ?.filter((path) => !!path)
          ?.map((path) => {
            const lastmod = toIsoTimestamp(path?.modificationDate);

            return `
            <url>
              <loc>${path?.path}</loc>${
                lastmod ? `\n              <lastmod>${lastmod}</lastmod>` : ""
              }
              <priority>${path?.isPriority ? "1.0" : "0.8"}</priority>
            </url>`;
          })
          .join("")}
      </urlset>
    `;
}

function extractArticleList(newsRes: Nullable<{ data?: any }>) {
  const rows: any[] = newsRes?.data?.content?.pageByPath?.grid?.rows ?? [];

  return rows
    .flatMap((row: any) => row?.placements ?? [])
    .flatMap((placement: any) => placement?.items ?? [])
    .find((item: any) => item?.type === "CMQueryList")?.itemsPaged;
}

/** Articles tagged under `_GroupRoles` are role-restricted, so they stay out of the sitemap. */
function isPublicArticle(article: ICMSArticle) {
  return !article.subjectTaxonomy?.some(
    (tag) => tag.parent?.value?.toLowerCase() === "_grouproles",
  );
}

async function getNewsArticlePaths(
  locale: string,
  protocol: string,
  host: string,
): Promise<IFilteredLocalePaths[]> {
  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${locale}`;
  const newsPath = NEWS_PATH.join("/");

  const articles: ICMSArticle[] = [];
  let offset = 0;
  let totalCount = Infinity;

  while (offset < totalCount) {
    const newsRes = await cmsRepo.getArticleList(
      cmLanguage,
      newsPath,
      NEWS_SITEMAP_PAGE_SIZE,
      offset,
    );

    const itemsPaged = extractArticleList(newsRes);
    const result: ICMSArticle[] = itemsPaged?.result ?? [];

    // Stop on an empty CMS page. This has to test the raw result: a page can be
    // empty *after* role filtering while later pages still hold public
    // articles, and breaking on the filtered list would drop them.
    if (!result.length) break;

    articles.push(...result.filter(isPublicArticle));

    // `totalCount` is the size of the full list, so it drives the loop; the
    // running total is only a fallback for when the CMS omits it. Assigning the
    // page's own length here (as this previously did) capped the sitemap at a
    // single page of articles.
    totalCount =
      typeof itemsPaged?.totalCount === "number"
        ? itemsPaged.totalCount
        : articles.length;
    offset += NEWS_SITEMAP_PAGE_SIZE;

    // Short page means the list is exhausted, whatever totalCount claims.
    if (result.length < NEWS_SITEMAP_PAGE_SIZE) break;
  }

  // The article route only renders `/newsroom/news/{tag}/{slug}-{id}`, so a
  // navigation path of any other depth yields a URL that resolves to a 404.
  const expectedSegments = NEWS_PATH.length + 2;
  const skipped: string[] = [];

  const paths = articles
    .filter((article) => !!article?.id && !!article?.navigationPath?.length)
    .map((article) => {
      const segments = article.navigationPath
        .slice(1)
        .map((segment) => segment?.segment);

      const articlePath = `${segments.join("/")}-${article.id}`;

      if (segments.length !== expectedSegments) {
        skipped.push(articlePath);
        return null;
      }

      return {
        path: `${protocol}://${host}/${locale}/${articlePath}/`.replace(
          `/${defaultLocale}`,
          "",
        ),
        modificationDate: article.extDisplayedDate || "",
        isPriority: false,
      };
    })
    .filter((path): path is IFilteredLocalePaths => !!path);

  if (skipped.length) {
    console.warn(
      `Sitemap: skipped ${skipped.length} newsroom article(s) whose navigation path does not match /${newsPath}/{tag}/{slug}: ${skipped.join(", ")}`,
    );
  }

  return paths;
}

/** Fetch CMS paths and generate the sitemap XML for a locale (uncached). */
const buildSitemap = async (locale: string, protocol: string, host: string) => {
  // CMS Request
  const adapter = new StaticPathsAdapter();

  const cmsPathIds = await cmsRepo.getPathsId();

  const pathIdArr = cmsPathIds?.data?.content?.sites
    ?.map((site: ICMSPathIds) => {
      return {
        id: site.id,
        locale:
          localeSegmentRemoval(site.root.segment)?.replace("/", "") ||
          defaultLocale,
        modificationDate: site?.modificationDate || "",
        hiddenInSitemap: site?.hiddenInSitemap || false,
      };
    })
    .filter((pathId: { locale: string }) => locales.includes(pathId.locale));
  const currentLocale = pathIdArr.find(
    (path: { locale: string }) => path.locale === locale,
  );

  const pathsData = await cmsRepo.getPathsData(currentLocale.id);
  const adaptedRes = adapter
    .adapt(pathsData)
    .filter(
      (adapted: { hiddenInSitemap: boolean }) =>
        adapted.hiddenInSitemap === false,
    );

  const filteredLocalePaths: IFilteredLocalePaths[] | null = adaptedRes?.map(
    (path: IAdaptedRes) => {
      const isRoot = path?.params?.page?.length <= 0;

      const page = path?.params?.page?.join("/");
      const isToRemove = SITEMAP_TO_REMOVE.includes(page);

      if (isToRemove) return null;
      return {
        path: isRoot
          ? `${protocol}://${host}/${path.locale}/`.replace(
              `/${defaultLocale}`,
              "",
            )
          : `${protocol}://${host}/${path.locale}/${page}${page ? "/" : ""}`.replace(
              `/${defaultLocale}`,
              "",
            ),
        modificationDate: path.modificationDate,
        isPriority: isRoot,
      };
    },
  );

  let newsArticlePaths: IFilteredLocalePaths[] = [];
  try {
    newsArticlePaths = await getNewsArticlePaths(locale, protocol, host);
  } catch (err) {
    console.error("Failed to build newsroom/news sitemap entries", err);
  }

  const allLocalePaths = [...(filteredLocalePaths ?? []), ...newsArticlePaths];

  return generateSitemap(allLocalePaths);
};

/**
 * Build the sitemap XML for a locale, cached in the Next.js Data Cache.
 *
 * Shares the `navigation` (sitemap) domain with getPathsId/getPathsData, so it
 * uses the same 24h TTL and is purged on-demand via the `cms:navigation` tag.
 * Preview builds bypass the cache so editors see live content.
 */
const getCachedSitemap = (locale: string, protocol: string, host: string) => {
  if (isCmsCacheDisabled()) return buildSitemap(locale, protocol, host);

  return unstable_cache(
    () => buildSitemap(locale, protocol, host),
    ["sitemap", locale, host, protocol],
    {
      revalidate: ttlForMeta("navigation"),
      tags: [CMS_TAG.navigation, scopedTag(CMS_TAG.navigation, locale)],
    },
  )();
};

// Start Content
export async function GET(request: NextRequest) {
  // Middleware short-circuits on any dotted pathname, so this route is only ever
  // reached at `/sitemap.xml` — no locale segment to read off the request.
  const locale = defaultLocale;
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || url.host;
  const protocol =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(/:$/, "");

  try {
    const sitemap = await getCachedSitemap(locale, protocol, host);

    const response = new Response(sitemap, {
      status: 200,
      statusText: "ok",
    });

    // `set`, not `append`: Response defaults to text/plain, so appending left
    // the sitemap advertising `content-type: text/plain;charset=UTF-8, text/xml`.
    response.headers.set("content-type", "text/xml");

    // Non-production hosts keep serving the sitemap so editors can QA it, but
    // it must stay out of search indexes (mirrors the robots.txt route, which
    // returns `Disallow: /` off production).
    if (!isProductionHost(host)) {
      response.headers.append("x-robots-tag", "noindex");
    }

    return response;
  } catch (err) {
    console.error(err);
    return new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }
}
