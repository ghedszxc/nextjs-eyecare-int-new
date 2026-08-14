"use client";

import AppConfig from "@/lib/AppConfig";
import { HideWidget } from "@/lib/client-actions";
import { useHash } from "@/hooks/useHash";
import { TPadding } from "@/models/IPadding";
import { TextBody, TextBodyProps } from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends TextBodyProps {
  padding?: TPadding;
  resourceTitles?: string[] | null;
}

const TextBodyWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;
  const hash = useHash();

  if (
    props?.resourceTitles &&
    props?.resourceTitles.length > 0 &&
    HideWidget(props?.resourceTitles, hash)
  )
    return;

  return (
    <TextBody className={padding && getWidgetPadding(padding)} {...rest} />
  );
});

TextBodyWidget.displayName = "TextBodyWidget";

export default TextBodyWidget;
