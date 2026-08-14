import { injectGlobalSearchResults } from "@/components/GlobalSearchLayout/injectGlobalSearchResult";
import GridLayout from "@/components/GridLayout";
import { jsonToLayoutAdapter } from "@/coremedia-integration/adapters/JsonToLayoutAdapter";
import { getGlobalSearch, getLayoutData } from "@/lib/cms";
import getMetaData from "@/lib/server-actions";
import { buildPageMetadata, NOT_FOUND_METADATA } from "@/lib/seo";
import { getPagination, sanitizeSearch } from "@/lib/utilities";
import SiteFooter from "@/widgets/SiteFooter";
import SiteNavigation from "@/widgets/SiteNavigation";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ lang: string; route: string[] }>;
  searchParams: Promise<{ q: string; pageNum?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { limit, offset } = getPagination({
    pageNum: resolvedSearchParams?.pageNum,
    firstPageLimit: 9,
    pageLimit: 9,
  });

  // Metadata for search result page (/search)
  if (!resolvedParams.route || resolvedParams?.route?.length === 0) {
    // Metadata
    try {
      // Metadata for search page
      const metadata = await getMetaData(
        resolvedParams?.lang,
        ["search"].join("/"),
      );

      if (resolvedSearchParams.pageNum) {
        const searchResponse = await getGlobalSearch(
          `${sanitizeSearch(resolvedSearchParams?.q || "")}*`,
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
        // Canonical drops ?q= and ?pageNum= so the many query permutations of an
        // internal search all point at the single search page.
        path: "search",
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

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang, route } = await params;
  const { q = "all", pageNum } = await searchParams;

  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`;

  if (!route || route?.length === 0) {
    const cmsResp = await getLayoutData(cmLanguage, ["search"].join("/"));

    const layoutData = jsonToLayoutAdapter.adapt(cmsResp);

    // Fetch the search results that fill the placeholder.
    const { limit, offset } = getPagination({
      pageNum,
      firstPageLimit: 9,
      pageLimit: 9,
    });

    const searchResponse = await getGlobalSearch(
      `${sanitizeSearch(q)} *`,
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

    const searchData = {
      items: searchResults,
      totalPages: searchResultsCount,
    };

    // Render the whole CMS layout, but swap the "Search result list" placeholder
    // for a live blog-search-results-list widget carrying the fetched data.
    const finalLayout = injectGlobalSearchResults(layoutData!, searchData);

    const url = {
      route: ["search"],
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
