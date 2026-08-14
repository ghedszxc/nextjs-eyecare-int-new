import { injectBlogSearchResults } from "@/components/BlogSearchLayout/injectBlogSearchResult";
import { getArticleSearch, getLayoutData } from "@/lib/cms";
import { NEWS_PATH } from "@/lib/constants/BLOG_CONSTANT";
import {
  canAccessContent,
  extractParagraphs,
  getAdapterPictures,
  getPagination,
  sanitizeSearch,
} from "@/lib/utilities";
import { BlogSearchResultsListProps } from "@digital-b2c/coreui-kit";
import moment from "moment";
import { notFound } from "next/navigation";
import React from "react";
import { jsonToLayoutAdapter } from "@/coremedia-integration/adapters/JsonToLayoutAdapter";
import GridLayout from "@/components/GridLayout";
import SiteFooter from "@/widgets/SiteFooter";
import SiteNavigation from "@/widgets/SiteNavigation";
import getMetaData from "@/lib/server-actions";
import { buildPageMetadata, NOT_FOUND_METADATA } from "@/lib/seo";
import { Metadata } from "next";
import { getSession } from "@/lib/auth";

type Props = {
  params: Promise<{ lang: string; route: string[] }>;
  searchParams: Promise<{ search: string; pageNum?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { limit, offset } = getPagination({
    pageNum: resolvedSearchParams?.pageNum,
    firstPageLimit: 10,
    pageLimit: 9,
  });

  // Metadata for news search result page (blog search: /newsroom/news/search-results)
  if (!resolvedParams.route || resolvedParams?.route?.length === 0) {
    // Metadata
    try {
      // Metadata for news page (blogs)
      const metadata = await getMetaData(
        resolvedParams?.lang,
        [...NEWS_PATH, "search-results"].join("/"),
      );

      if (resolvedSearchParams.pageNum) {
        const searchResponse = await getArticleSearch(
          `+_News${resolvedSearchParams?.search ? ` ${encodeURI(resolvedSearchParams?.search)}` : " "}*`,
          limit,
          offset,
        );

        const searchResultsCount =
          searchResponse?.data?.content?.search?.numFound;

        const { isPageExceeded } = getPagination({
          pageNum: resolvedSearchParams?.pageNum,
          firstPageLimit: 9,
          pageLimit: 9,
          totalCount: searchResultsCount,
        });

        if (isPageExceeded) return NOT_FOUND_METADATA;
      }

      return await buildPageMetadata({
        htmlTitle: metadata.title,
        description: metadata.description,
        // Canonical drops ?search= and ?pageNum= so the many query permutations
        // of a news search all point at the single search-results page.
        path: [...NEWS_PATH, "search-results"].join("/"),
        image: metadata.metaDataImage,
        noIndex: metadata.noIndexNoFollow,
      });
    } catch (err) {
      console.error(err);

      return NOT_FOUND_METADATA;
    }
  }

  return NOT_FOUND_METADATA;
}

export default async function Page({ params, searchParams }: Props) {
  const { lang, route } = await params;
  const { search = "all", pageNum } = await searchParams;

  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`;

  if (!route || route?.length === 0) {
    const cmsResp = await getLayoutData(
      cmLanguage,
      [...NEWS_PATH, "search-results"].join("/"),
    );

    const layoutData = jsonToLayoutAdapter.adapt(cmsResp);

    const { limit, offset } = getPagination({
      pageNum,
      firstPageLimit: 9,
      pageLimit: 9,
    });

    // Fetch the live search results that fill the "Search result list" placeholder.
    const searchResponse = await getArticleSearch(
      `+_News${search ? ` ${sanitizeSearch(search)}` : " "} *`,
      limit,
      offset,
    );

    const searchResults = searchResponse?.data?.content?.search?.result;
    const searchResultsCount = searchResponse?.data?.content?.search?.numFound;

    const { isPageExceeded } = getPagination({
      pageNum,
      firstPageLimit: 9,
      pageLimit: 9,
      totalCount: searchResultsCount,
    });

    if (isPageExceeded) return notFound();

    const session = await getSession();

    const searchData: Omit<
      BlogSearchResultsListProps,
      "onSearchSubmit" | "onSearchChange" | "searchValue"
    > & { totalPages?: number } = {
      items: searchResults?.map((item: any) => {
        const isAccessible = canAccessContent({
          allowedRoles:
            item?.subjectTaxonomy
              ?.filter((tag: any) => tag?.parent?.value === "_GroupRoles")
              ?.map((tag: any) => tag?.value?.toLocaleLowerCase()) || [],
          userRole: session?.userGroup
            ?.replaceAll(" ", "")
            ?.toLocaleLowerCase(),
        });

        return {
          type: !isAccessible ? "restricted" : undefined,
          id: item?.id,
          title: !isAccessible ? "Restricted" : item.teaserTitle,
          date: {
            label: moment(item?.extDisplayedDate ?? item?.creationDate)?.format(
              "D MMM YYYY",
            ),
            value: item?.extDisplayedDate ?? item?.creationDate,
          },
          description: !isAccessible
            ? "You don't have permission to view this content. Contact support for access."
            : extractParagraphs(item.teaserText.text),
          tag: item?.subjectTaxonomy?.find(
            (tag: any) => tag?.parent?.value === "_News",
          )?.externalReference,
          cta: !isAccessible
            ? undefined
            : {
                url: `/${item.navigationPath
                  .slice(1) // remove first item
                  .map((curr: any) => curr.segment)
                  .join("/")}-${item.id}`,
                icon: "tiltedRightBlack",
                isExternal: false,
                label: "Read More",
              },
          image: !isAccessible
            ? {
                src: "/images/restricted.png",
                alt: "lock",
              }
            : getAdapterPictures(item.media),
        };
      }),
      totalPages: searchResponse?.data?.content?.search?.numFound,
    };

    // Render the whole CMS layout, but swap the "Search result list" placeholder
    // for a live blog-search-results-list widget carrying the fetched data.
    const finalLayout = injectBlogSearchResults(
      layoutData!,
      searchData,
      "Search result list",
    );

    const url = {
      route: [...NEWS_PATH, "search-results"],
      locale: lang,
    };

    return (
      <div>
        <SiteNavigation locale={lang} />
        <GridLayout data={finalLayout} url={url} />
        <SiteFooter locale={lang} />
      </div>
    );
  }
}
