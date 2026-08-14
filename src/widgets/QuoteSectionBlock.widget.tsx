"use client";
import { memo } from "react";
import { QuoteSectionBlock } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import { QuoteSectionBlockProps } from "@digital-b2c/coreui-kit";

interface Props extends QuoteSectionBlockProps {
  padding?: TPadding;
}

const QuoteSectionBlockWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <QuoteSectionBlock
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

QuoteSectionBlockWidget.displayName = "QuoteSectionBlockWidget";

export default QuoteSectionBlockWidget;
