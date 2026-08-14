"use client";

import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import {
  InternalBrandsTab,
  InternalBrandsTabProps,
} from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends InternalBrandsTabProps {
  padding?: TPadding;
}

const InternalBrandsTabWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <InternalBrandsTab
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

InternalBrandsTabWidget.displayName = "InternalBrandsTabWidget";

export default InternalBrandsTabWidget;
