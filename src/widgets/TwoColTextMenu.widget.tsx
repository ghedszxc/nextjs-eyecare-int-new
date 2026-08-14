"use client";
import { memo } from "react";
import { TwoColTextMenu, TwoColTextMenuProps } from "@digital-b2c/coreui-kit";
import Link from "next/link";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import { localeSegmentRemoval, removeDefaultLocale } from "@/lib/utilities";

interface Props extends TwoColTextMenuProps {
  padding?: TPadding;
}

const TwoColTextMenuWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <TwoColTextMenu
      className={padding && getWidgetPadding(padding)}
      renderLink={({
        href,
        children,
        "aria-label": ariaLabel,
        tabIndex,
        ...linkProps
      }) => (
        <Link
          href={removeDefaultLocale(localeSegmentRemoval(href ?? "")) || "#"}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
          {...linkProps}
        >
          {children}
        </Link>
      )}
      {...rest}
    />
  );
});

TwoColTextMenuWidget.displayName = "TwoColTextMenuWidget";

export default TwoColTextMenuWidget;
