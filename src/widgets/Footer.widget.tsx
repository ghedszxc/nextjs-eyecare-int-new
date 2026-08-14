"use client";
import { memo } from "react";
import { Footer, FooterProps } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import { getAdapterPictures, getAdapterViewtype } from "@/lib/utilities";
import AppConfig from "@/lib/AppConfig";

interface Props extends FooterProps {
  padding?: TPadding;
  data?: unknown;
}

const FooterWidget: React.FC<Props> = memo((props) => {
  const { data, padding, ...rest } = props;
  const { html } = AppConfig;

  // LOGO PLACEMENT
  const logoPlacement = getAdapterViewtype(
    (data as any)?.content?.pageByPath?.grid?.placements,
    "footerLogos",
  )?.selected as any;

  const supporters: FooterProps["supporters"] =
    logoPlacement?.items
      ?.map((item: any) => {
        const image = getAdapterPictures(item?.pictures);

        if (!image) return null;
        return {
          image,
          href: item?.teaserTargets?.[0]?.target?.url || "",
        };
      })
      .filter(Boolean) || [];

  // DISCLAIMER & COPYRIGHT PLACEMENT
  const disclaimerPlacement = getAdapterViewtype(
    (data as any)?.content?.pageByPath?.grid?.placements,
    "footerCopywrite",
  )?.selected as any;

  const disclaimer = html(disclaimerPlacement?.items?.[0]?.detailText?.text);
  const copyright = html(disclaimerPlacement?.items?.[0]?.title);

  // NAVIGATION PLACEMENT
  const navigationPlacement = getAdapterViewtype(
    (data as any)?.content?.pageByPath?.grid?.placements,
    "footerNavigation",
  )?.selected as any;

  const navigationLinks = navigationPlacement?.items?.map((item: any) => {
    const isExternal =
      item?.teaserTargets?.[0]?.target?.type === "CMExternalLink";
    const externalLink = item?.teaserTargets?.[0]?.target?.url;

    const link = item?.teaserTarget?.navigationPath
      .map((path: any) => path.segment)
      .join("/");

    return {
      label: item.teaserTitle,
      href: isExternal ? externalLink : link,
      isExternal: isExternal,
    };
  });

  // SUPPORT PLACEMENT
  const supportPlacement = getAdapterViewtype(
    (data as any)?.content?.pageByPath?.grid?.placements,
    "footerSupportNavigation",
  )?.selected as any;

  const supportContacts = supportPlacement?.items?.map((item: any) => {
    return {
      title: item?.teaserTitle || "",
      subtitle: item?.teaserText?.text || "",
    };
  });

  return (
    <Footer
      supporters={supporters}
      navigationLinks={navigationLinks}
      disclaimer={disclaimer}
      copyright={copyright}
      supportContacts={supportContacts}
      {...rest}
    />
  );
});

FooterWidget.displayName = "FooterWidget";

export default FooterWidget;
