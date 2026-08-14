"use client";

import { memo, useEffect } from "react";
import {
  GlobalSearchResultsList as GlobalSearchResultsListUI,
  Pagination,
  GlobalSearchResultsListProps,
} from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { localeSegmentRemoval, removeDefaultLocale } from "@/lib/utilities";

interface Props extends GlobalSearchResultsListProps {
  padding?: TPadding;
  totalPages?: number;
}

const GlobalSearchResultsList: React.FC<Props> = memo((props) => {
  const { padding, items = [], totalPages, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  const router = useRouter();

  const searchParams = useSearchParams();

  const searchResultText = searchParams?.get("q") ?? "";

  const currentPage = isNaN(Number(searchParams.get("pageNum")))
    ? 1
    : Number(searchParams.get("pageNum")) || 1;

  const totalPageCount = getTotalPages(totalPages as number);
  const hasNextPage = currentPage < totalPageCount;

  function getTotalPages(totalCount: number) {
    return 1 + Math.ceil((totalCount - 9) / 9);
  }

  useEffect(() => {
    if (hasNextPage) {
      const params = new URLSearchParams(searchParams.toString());
      const nextPage = currentPage + 1;
      params.set("pageNum", String(nextPage));

      router.prefetch(`?${params.toString()}`);
    }
  }, [hasNextPage, currentPage, router, searchParams]);

  return (
    <GlobalSearchResultsListUI
      className={padding && getWidgetPadding(padding)}
      {...rest}
      items={items}
      renderLink={({
        href,
        className,
        children,
        "aria-label": ariaLabel,
        tabIndex,
        ...props
      }) => {
        const formattedHref =
          removeDefaultLocale(localeSegmentRemoval(href)) || "/";

        return (
          <Link
            href={formattedHref}
            className={className}
            aria-label={ariaLabel}
            tabIndex={tabIndex}
            {...props}
          >
            {children}
          </Link>
        );
      }}
    >
      {searchResultText ? (
        <GlobalSearchResultsListUI.Search>
          {items && items.length > 0
            ? `Search results for “${searchResultText}”:`
            : `No search results for “${searchResultText}”`}
        </GlobalSearchResultsListUI.Search>
      ) : null}

      {items?.length > 0 ? (
        <GlobalSearchResultsListUI.Pagination>
          <Pagination
            hasNumber
            showEllipsis
            hidePagesBorder
            currentPage={currentPage}
            totalPages={totalPageCount}
            renderLink={({ page, children, className, ...props }) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("pageNum", String(page));

              return (
                <Link
                  href={`?${params.toString()}`}
                  className={className}
                  {...props}
                >
                  {children}
                </Link>
              );
            }}
          />
        </GlobalSearchResultsListUI.Pagination>
      ) : null}
    </GlobalSearchResultsListUI>
  );
});

GlobalSearchResultsList.displayName = "GlobalSearchResultsList";

export default GlobalSearchResultsList;
