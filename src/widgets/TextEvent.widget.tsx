"use client";

import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import { TextEvent, TextEventProps } from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends TextEventProps {
  padding?: TPadding;
}

const TextEventWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <TextEvent className={padding && getWidgetPadding(padding)} {...rest} />
  );
});

TextEventWidget.displayName = "TextEventWidget";

export default TextEventWidget;
