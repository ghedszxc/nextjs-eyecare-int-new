"use client";

import { memo } from "react";
import { BlogPost, BlogPostProps } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";

interface Props extends BlogPostProps {
  padding?: TPadding;
}

const BlogPostWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <BlogPost className={padding && getWidgetPadding(padding)} {...rest} />
  );
});

BlogPostWidget.displayName = "BlogPostWidget";

export default BlogPostWidget;
