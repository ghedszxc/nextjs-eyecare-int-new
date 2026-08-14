"use client";

import { memo } from "react";
import {
  FeaturedNewsHighlights,
  FeaturedNewsHighlightsProps,
} from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import Link from "next/link";
import NavigationLoader from "@/components/NavigationLoader";
import { localeSegmentRemoval, removeDefaultLocale } from "@/lib/utilities";

interface Props extends FeaturedNewsHighlightsProps {
  padding?: TPadding;
}

const BlogFeaturedPostCard: React.FC<Props> = memo((props) => {
  const { padding, cta, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <FeaturedNewsHighlights
      className={padding && getWidgetPadding(padding)}
      {...rest}
      cta={{ ...cta, url: removeDefaultLocale(localeSegmentRemoval(cta?.url)) }}
      renderLink={({
        href,
        className,
        children,
        "aria-label": ariaLabel,
        tabIndex,
        ...props
      }) => (
        <Link
          href={href!}
          className={className}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
          {...props}
        >
          {children}
          <NavigationLoader />
        </Link>
      )}
    />
  );
});

BlogFeaturedPostCard.displayName = "BlogFeaturedPostCard";

export default BlogFeaturedPostCard;
