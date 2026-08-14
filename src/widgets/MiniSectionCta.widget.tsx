"use client";
import { memo } from "react";
import { MiniSectionCta, MiniSectionCtaProps } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";

interface Props extends MiniSectionCtaProps {
  padding?: TPadding;
}

const MiniSectionCtaWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <MiniSectionCta
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

MiniSectionCtaWidget.displayName = "MiniSectionCtaWidget";

export default MiniSectionCtaWidget;
