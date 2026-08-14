"use client";
import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import { HeroBanner, HeroBannerProps } from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends HeroBannerProps {
  padding?: TPadding;
}

const HeroBannerWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <HeroBanner
      className={padding && getWidgetPadding(padding)}
      {...rest}
      type="internal"
    />
  );
});

HeroBannerWidget.displayName = "HeroBannerWidget";

export default HeroBannerWidget;
