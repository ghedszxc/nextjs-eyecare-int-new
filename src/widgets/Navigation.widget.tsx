"use client";

import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import {
  getAkamayUrl,
  getAdapterViewtype,
  getAdapterCTA,
  removeDefaultLocale,
  appendODMarketingLogin,
  IAdapterCTAObj,
} from "@/lib/utilities";
import { ICta } from "@/models/ICta";
import { DEFAULT_LOCALE } from "@/lib/constants/LOCALIZATIONS";
import { useSession } from "@/components/Auth/SessionProvider";
import { useActivePath } from "@/hooks/useActivePath";
import { logout } from "@/lib/server-actions";
import { Button, Navigation, NavigationProps } from "@digital-b2c/coreui-kit";
import { useParams, usePathname, useRouter } from "next/navigation";
import { memo } from "react";
import Link from "next/link";

interface Props extends NavigationProps {
  padding?: TPadding;
  data?: unknown;
}

const NavigationWidget: React.FC<Props> = memo((props) => {
  const { data, padding, ...rest } = props;
  const { getWidgetPadding, html } = AppConfig;
  const pathname = usePathname();
  const session = useSession();

  const router = useRouter();
  const params = useParams();
  const activePath = useActivePath();
  const lang = typeof params?.lang === "string" ? params.lang : DEFAULT_LOCALE;
  const placements: any[] =
    (data as any)?.content?.pageByPath?.grid?.placements || [];

  const headerItems: any[] =
    (getAdapterViewtype(placements, "Header").selected as any)?.items || [];

  // * HELPERS * //
  const isCollection = (item: any) => item?.__typename === "CMCollectionImpl";
  const isExternalLink = (item: any) =>
    item?.__typename === "CMExternalLinkImpl";

  const getImageUrl = (pic: any) =>
    pic?.data?.uri
      ? getAkamayUrl(pic.data.uri)
      : pic?.uriTemplate
        ? getAkamayUrl(pic.uriTemplate)
        : undefined;

  const firstImage = (item: any) => item?.pictures?.[0] || item?.media?.[0];

  const withODMarketingLogin = (url: string) =>
    appendODMarketingLogin(url, session?.loginToken);

  const toAdapterCTA = (item: any): IAdapterCTAObj => {
    if (isExternalLink(item)) {
      return {
        callToActionText: item?.teaserTargets?.[0]?.callToActionText,
        target: { type: "CMExternalLink", url: item?.url },
      };
    }

    const externalTarget = item?.teaserTargets?.find(
      (t: any) => t?.target?.type === "CMExternalLink" || t?.target?.url,
    )?.target;

    if (externalTarget) {
      return {
        callToActionText: item?.teaserTargets?.[0]?.callToActionText,
        target: externalTarget,
      };
    }

    return {
      callToActionText: item?.teaserTargets?.[0]?.callToActionText,
      callToActionHash: item?.teaserTargets?.[0]?.callToActionHash,
      target: {
        navigationPath:
          item?.teaserTarget?.navigationPath ||
          item?.teaserTargets?.[0]?.target?.navigationPath,
      },
    };
  };

  const resolveCta = (item: any): ICta => {
    const adapted = toAdapterCTA(item);
    const [cta] = getAdapterCTA([adapted]);

    const isEmpty = !cta?.url || cta.url === "#";
    const pointsToRoot = !!adapted.target?.navigationPath?.length;
    const url =
      !cta?.isExternal && isEmpty && pointsToRoot
        ? removeDefaultLocale(`/${lang}`) || "/"
        : cta?.url || "#";

    return { ...cta, url: withODMarketingLogin(url) };
  };

  // Reduce a URL to its bare pathname (drop origin, query, hash and trailing
  // slash) so links can be compared against the current browser path.
  const normalizePath = (url?: string) => {
    if (!url || url === "#") return "";
    const path = url.startsWith("http")
      ? new URL(url).pathname
      : url.split(/[?#]/)[0];
    return path.replace(/\/+$/, "") || "/";
  };

  const normalizedActivePath = normalizePath(activePath);

  const isLinkActive = (url?: string, isExternal?: boolean) =>
    !isExternal &&
    !!normalizedActivePath &&
    normalizePath(url) === normalizedActivePath;

  const mapChildToNavLink = (child: any) => {
    const { url, label, isExternal } = resolveCta(child);
    return {
      type: "link" as const,
      cta: {
        label,
        url,
        isExternal,
      },
      isActive: isLinkActive(url, isExternal),
    };
  };

  // * LOGO + HOME CTA * //
  const logoItem = getAdapterViewtype(headerItems, "logo").selected as any;
  const logoPicture = firstImage(logoItem);
  const mainLogo = getImageUrl(logoPicture);
  const mainLogoAlt = logoPicture?.alt;
  const homeCta = resolveCta(logoItem).url;
  const userCollection = getAdapterViewtype(headerItems, "userCollectionVariant").selected as any;
  const userLinks: any[] = (userCollection?.items || []).filter(
    (item: any) => isExternalLink(item) || item?.teaserTitle,
  );

  const userMenuItems: NonNullable<
    NonNullable<NavigationProps["user"]>["menuItems"]
  > = userLinks.map((item: any) => {
    const { url, isExternal } = resolveCta(item);
    return {
      label: item?.teaserTitle || "",
      url,
      isExternal,
    };
  });

  const logoutPlaceholder = (userCollection?.items || []).find(
    (item: any) => item?.viewtype === "logout",
  );
  const logoutMenuItem = {
    label: logoutPlaceholder?.title || logoutPlaceholder?.detailText?.text,
    variant: "danger" as const,
    onClick: () => {
      void logout();
    },
  };

  const displayName = session?.displayName || session?.userName;
  const user: NavigationProps["user"] = displayName
    ? {
        label: displayName,
        menuItems: [...userMenuItems, logoutMenuItem],
      }
    : undefined;

  // * LOGIN CTA — fallback for the logged-out / external variant * //
  const loginItem = userLinks[0];
  const loginCta = loginItem
    ? { label: loginItem?.teaserTitle, url: resolveCta(loginItem).url }
    : undefined;

  // * NAVIGATION ITEMS * //
  const mainNavCollection = getAdapterViewtype(headerItems, "mainNavCollection").selected as any;
  const rawNavItems: any[] = mainNavCollection?.items || [];

  const navigationItems = {
    items: rawNavItems
      .filter(
        (item: any) => item?.teaserTargets?.[0]?.callToActionText || item?.url || isCollection(item),
      )
      .map((item: any) => {
        if (isCollection(item)) {
          const items =
            item?.items
              ?.filter((child: any) => child?.teaserTargets?.[0]?.callToActionText || child?.url)
              .map(mapChildToNavLink) || [];
          return {
            type: "dropdown" as const,
            title: item?.collectionTitle || "",
            description: (html(item?.collectionText) as string) || "", // TODO: should be string | JSX.Element | JSX.Element[]
            items,
            isActive: items.some(
              (child: { isActive: boolean }) => child.isActive,
            ),
          };
        }

        return mapChildToNavLink(item);
      }),
  };

  const brandItems: any[] = ((getAdapterViewtype(headerItems, "brandsCollectionVariant")?.selected as any)?.items || []).filter(
    (item: any) => item?.teaserOverlaySettings?.style?.backgroundColor,
  );

  const brandBars: NonNullable<NavigationProps["brandBars"]> = brandItems
    .map((item: any) => ({
      backgroundColor:
        item?.teaserOverlaySettings?.style?.backgroundColor || "",
    }))
    .filter((bar): bar is { backgroundColor: string } => Boolean(bar.backgroundColor));

  const searchItem = getAdapterViewtype(headerItems, "SearchInput").selected as any;
  const searchPlaceholder =
    searchItem?.title || searchItem?.detailText?.text || undefined;

  const onSearch = (query: string) => {
    const trimmed = query?.trim();
    if (!trimmed) return;
    const path = removeDefaultLocale(`/${lang}/search`);
    router.push(`${path}?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Navigation
      className={padding ? getWidgetPadding(padding) : undefined}
      mainLogo={mainLogo}
      logoAlt={mainLogoAlt}
      homeCta={homeCta}
      loginCta={loginCta}
      user={user}
      navigationItems={navigationItems}
      brandBars={brandBars}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearch}
      {...rest}
    >
      {!user ? (
        <Navigation.UserMenuFallback>
          <Button
            variant="nofillblack"
            href="/login"
            renderLink={({
              href,
              className,
              children,
              "aria-label": ariaLabel,
              ...props
            }) => {
              return (
                <Link
                  href={`${href}?redirectTo=${pathname}`}
                  className={className}
                  aria-label={ariaLabel}
                  {...props}
                >
                  {children}
                </Link>
              );
            }}
          >
            Login
          </Button>
        </Navigation.UserMenuFallback>
      ) : undefined}
    </Navigation>
  );
});

NavigationWidget.displayName = "NavigationWidget";

export default NavigationWidget;
