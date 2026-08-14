"use client";

import { memo, useState } from "react";
import {
  NewsCardListProps,
  BlogSearchResultsList as BlogSearchResultsListUI,
  Pagination,
} from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import Link from "next/link";
import NavigationLoader from "@/components/NavigationLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { localeSegmentRemoval, removeDefaultLocale } from "@/lib/utilities";

interface Props extends NewsCardListProps {
  padding?: TPadding;
  totalPages?: number;
}

const BlogSearchResultsList: React.FC<Props> = memo((props) => {
  const { padding, items = [], totalPages, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchResultText = searchParams?.get("search") ?? "";

  const [search, setSearch] = useState("");

  const currentPage = isNaN(Number(searchParams.get("pageNum")))
    ? 1
    : Number(searchParams.get("pageNum")) || 1;

  function getTotalPages(totalCount: number) {
    if (totalCount <= 10) return 1;

    return 1 + Math.ceil((totalCount - 10) / 9);
  }

  const onSubmit = () => {
    if (!search) return;

    router.push(`/newsroom/news/search-results?search=${search}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <BlogSearchResultsListUI
      className={padding && getWidgetPadding(padding)}
      {...rest}
      items={items}
      searchValue={search}
      onSearchChange={setSearch}
      onSearchSubmit={onSubmit}
      searchInputProps={{ onKeyDown: handleKeyDown }}
      renderLink={({
        href,
        className,
        children,
        "aria-label": ariaLabel,
        tabIndex,
        ...props
      }) => (
        <Link
          href={removeDefaultLocale(localeSegmentRemoval(href!))}
          className={className}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
          {...props}
        >
          {children}
          <NavigationLoader />
        </Link>
      )}
    >
      {searchResultText ? (
        <BlogSearchResultsListUI.Search>
          {items && items.length > 0
            ? `Search results for “${searchResultText}”:`
            : `No search results for “${searchResultText}”`}
        </BlogSearchResultsListUI.Search>
      ) : null}

      {items?.length > 0 ? (
        <BlogSearchResultsListUI.Pagination>
          <Pagination
            hasNumber
            hidePagesBorder
            showEllipsis
            currentPage={currentPage}
            totalPages={getTotalPages(totalPages as number)}
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
                  <NavigationLoader />
                </Link>
              );
            }}
          />
        </BlogSearchResultsListUI.Pagination>
      ) : null}
    </BlogSearchResultsListUI>
  );
});

BlogSearchResultsList.displayName = "BlogSearchResultsList";

export default BlogSearchResultsList;
