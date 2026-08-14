"use client";

import { memo, useState } from "react";
import {
  NewsCardList,
  NewsCardListProps,
  Pagination,
} from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import Link from "next/link";
import NavigationLoader from "@/components/NavigationLoader";
import { useRouter, useSearchParams } from "next/navigation";

interface Props extends NewsCardListProps {
  padding?: TPadding;
  totalPages?: number;
}

const BlogCardGridWidget: React.FC<Props> = memo((props) => {
  const { padding, items = [], totalPages, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  const currentPage = isNaN(Number(searchParams.get("pageNum")))
    ? 1
    : Number(searchParams.get("pageNum")) || 1;

  function getTotalPages(totalCount: number) {
    if (totalCount <= 10) return 1;

    return 1 + Math.ceil((totalCount - 10) / 9);
  }

  const onSubmit = () => {
    router.push(`/newsroom/news/search-results?search=${search}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <NewsCardList
      className={padding && getWidgetPadding(padding)}
      {...rest}
      items={items}
      currentPage={currentPage}
      searchValue={search}
      onSearchChange={setSearch}
      onSearchSubmit={onSubmit}
      searchInputProps={{ onKeyDown: handleKeyDown }}
      renderLink={({
        href,
        children,
        "aria-label": ariaLabel,
        tabIndex,
        ...props
      }) => (
        <Link
          href={href!}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
          {...props}
        >
          {children}
          <NavigationLoader />
        </Link>
      )}
    >
      {items?.length > 0 ? (
        <NewsCardList.Pagination>
          <Pagination
            hasNumber
            hidePagesBorder
            showEllipsis
            currentPage={currentPage}
            totalPages={getTotalPages(totalPages as number)}
            renderLink={({ page, children, className, ...props }) => (
              <Link
                href={`./?pageNum=${page}`}
                className={className}
                {...props}
              >
                {children}
                <NavigationLoader />
              </Link>
            )}
          />
        </NewsCardList.Pagination>
      ) : null}
    </NewsCardList>
  );
});

BlogCardGridWidget.displayName = "BlogCardGridWidget";

export default BlogCardGridWidget;
