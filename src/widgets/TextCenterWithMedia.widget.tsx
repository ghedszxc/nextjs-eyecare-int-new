"use client";
import { memo } from "react";
import {
  TextCenterWithMedia,
  TextCenterWithMediaProps,
} from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import { HideWidget } from "@/lib/client-actions";
import { useHash } from "@/hooks/useHash";

interface Props extends TextCenterWithMediaProps {
  padding?: TPadding;
  resourceTitles?: string[] | null;
}

const TextCenterWithMediaWidget: React.FC<Props> = memo((props) => {
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
    <TextCenterWithMedia
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

TextCenterWithMediaWidget.displayName = "TextCenterWithMediaWidget";

export default TextCenterWithMediaWidget;
