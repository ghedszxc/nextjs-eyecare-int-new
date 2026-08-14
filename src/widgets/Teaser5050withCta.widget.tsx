"use client";
import { memo } from "react";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import {
  Teaser5050WithCta,
  Teaser5050WithCtaProps,
} from "@digital-b2c/coreui-kit";
import { HideWidget } from "@/lib/client-actions";
import { useHash } from "@/hooks/useHash";

interface Props extends Teaser5050WithCtaProps {
  padding?: TPadding;
  resourceTitles?: string[] | null;
  canAccess?: boolean;
}

const Teaser5050withCtaWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;
  const hash = useHash();

  if (!("canAccess" in props) && !Boolean(props.canAccess)) return;

  if (
    props?.resourceTitles &&
    props?.resourceTitles.length > 0 &&
    HideWidget(props?.resourceTitles, hash)
  )
    return;

  return (
    <Teaser5050WithCta
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

Teaser5050withCtaWidget.displayName = "Teaser5050withCtaWidget";

export default Teaser5050withCtaWidget;
