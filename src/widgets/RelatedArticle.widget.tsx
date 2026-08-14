"use client";

import { memo } from "react";
import { BlogCardGrid, BlogCardGridProps } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import Link from "next/link";
import NavigationLoader from "@/components/NavigationLoader";

interface Props extends BlogCardGridProps {
  padding?: TPadding;
}

const RelatedArticleWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <BlogCardGrid
      className={padding && getWidgetPadding(padding)}
      {...rest}
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

RelatedArticleWidget.displayName = "RelatedArticleWidget";

export default RelatedArticleWidget;
