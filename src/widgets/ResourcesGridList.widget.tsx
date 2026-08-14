"use client";
import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import {
  ResourcesGridList,
  ResourcesGridListProps,
} from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends ResourcesGridListProps {
  padding?: TPadding;
}

const ResourcesGridListWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <ResourcesGridList
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

ResourcesGridListWidget.displayName = "ResourcesGridListWidget";

export default ResourcesGridListWidget;
