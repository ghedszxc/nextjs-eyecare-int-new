"use client";

import AppConfig from "@/lib/AppConfig";
import { localeSegmentRemoval, removeDefaultLocale } from "@/lib/utilities";
import { TPadding } from "@/models/IPadding";
import {
  Button,
  MiniBanner,
  MiniBannerProps,
  Picture,
} from "@digital-b2c/coreui-kit";
import Link from "next/link";
import NavigationLoader from "@/components/NavigationLoader";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface Props extends MiniBannerProps {
  padding?: TPadding;
}

const MiniBannerWidget: React.FC<Props> = memo((props) => {
  const {
    padding,
    variant,
    logo,
    cta,
    goBackProps,
    pretitle,
    className,
    ...rest
  } = props;
  const pathname = usePathname();

  const { getWidgetPadding } = AppConfig;

  const isHomepage = pathname === "/";

  return (
    <MiniBanner
      className={`${padding && getWidgetPadding(padding)}${className ? ` ${className}` : ""}${isHomepage ? ` home-miniBanner-textLeft` : ""}`}
      {...rest}
      variant={variant}
      logo={logo}
      cta={cta}
    >
      {goBackProps ? (
        <MiniBanner.GoBack>
          <Button
            href={removeDefaultLocale(
              localeSegmentRemoval(goBackProps.link?.href),
            )}
            isExternal={goBackProps.link?.isExternal}
            title={goBackProps.link?.title}
            variant="nofill"
            renderLink={({
              href,
              children,
              "aria-label": ariaLabel,
              tabIndex,
              ...props
            }) => (
              <Link
                href={href!}
                aria-label={ariaLabel}
                tabIndex={tabIndex}
                {...props}
              >
                {children}
                <NavigationLoader />
              </Link>
            )}
          >
            <Picture
              alt={goBackProps.icon?.alt as string}
              src={goBackProps.icon?.src as string}
            />
          </Button>
        </MiniBanner.GoBack>
      ) : null}
    </MiniBanner>
  );
});

MiniBannerWidget.displayName = "MiniBannerWidget";

export default MiniBannerWidget;
