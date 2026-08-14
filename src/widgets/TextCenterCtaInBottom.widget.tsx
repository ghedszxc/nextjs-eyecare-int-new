"use client";
import { memo } from "react";
import {
  TextCenterCtaInBottom,
  TextCenterCtaInBottomProps,
} from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import { HideWidget } from "@/lib/client-actions";
import { useHash } from "@/hooks/useHash";

interface Props extends TextCenterCtaInBottomProps {
  padding?: TPadding;
  resourceTitles?: string[] | null;
}

const TextCenterCtaInBottomWidget: React.FC<Props> = memo((props) => {
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
    <TextCenterCtaInBottom
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

TextCenterCtaInBottomWidget.displayName = "TextCenterCtaInBottomWidget";

export default TextCenterCtaInBottomWidget;
