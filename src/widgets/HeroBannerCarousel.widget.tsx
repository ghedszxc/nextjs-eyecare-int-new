"use client";
import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import {
  HeroBannerCarousel,
  HeroBannerCarouselProps,
} from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends HeroBannerCarouselProps {
  padding?: TPadding;
}

const HeroBannerCarouselWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;
  const className = [padding && getWidgetPadding(padding)]
    .filter(Boolean)
    .join(" ");

  return <HeroBannerCarousel className={className} {...rest} />;
});

HeroBannerCarouselWidget.displayName = "HeroBannerCarouselWidget";

export default HeroBannerCarouselWidget;
