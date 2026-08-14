import { ComponentType } from "react";
import { IWidgetModel } from "@/models/IWidget.interface";
import { IUrl } from "@/models/IUrl.interface";
import { TPadding } from "@/models/IPadding";
import dynamic from "next/dynamic";
import { SessionData } from "@/lib/session";

interface Widgets {
  [key: string]: ComponentType<any> | null;
}

/**
 * Add import here for new modules
 * set SSR true if needed.
 */
const Widgets: Widgets = {
  HeroBanner: dynamic(() => import("@/widgets/HeroBanner.widget")),
  teaser5050withCTA: dynamic(
    () => import("@/widgets/Teaser5050withCta.widget"),
  ),
  miniSectionCTA: dynamic(() => import("@/widgets/MiniSectionCta.widget")),
  contactModule: dynamic(() => import("@/widgets/ContactModule.widget")),
  miniBanner: dynamic(() => import("@/widgets/MiniBanner.widget")),
  cardCollection: dynamic(() => import("@/widgets/CardCollection.widget")),
  textCenterTablePlain: dynamic(() => import("@/widgets/TextEvent.widget")),
  TextBody: dynamic(() => import("@/widgets/TextBody.widget")),
  eventList: dynamic(() => import("@/widgets/EventList.widget")),
  textCenterCtaInbottom: dynamic(
    () => import("@/widgets/TextCenterCtaInBottom.widget"),
  ),
  heroBannerCarousel: dynamic(
    () => import("@/widgets/HeroBannerCarousel.widget"),
  ),
  resourcesGridList: dynamic(
    () => import("@/widgets/ResourcesGridList.widget"),
  ),
  internalBrandsTab: dynamic(
    () => import("@/widgets/InternalBrandsTab.widget"),
  ),
  blogPost: dynamic(() => import("@/widgets/BlogPost.widget")),
  relatedArticle: dynamic(() => import("@/widgets/RelatedArticle.widget")),
  "blog-card-grid": dynamic(() => import("@/widgets/BlogCardGrid.widget")),
  "blog-featured-post-card": dynamic(
    () => import("@/widgets/BlogFeaturedPostCard.widget"),
  ),
  "blog-search-results-list": dynamic(
    () => import("@/widgets/BlogSearchResultsList.widget"),
  ),
  TextCenterWithMedia: dynamic(
    () => import("@/widgets/TextCenterWithMedia.widget"),
  ),
  globalSearchResultList: dynamic(
    () => import("@/widgets/GlobalSearchResultsList.widget"),
  ),
  quoteSectionBlock: dynamic(
    () => import("@/widgets/QuoteSectionBlock.widget"),
  ),
  twoColTextMenu: dynamic(() => import("@/widgets/TwoColTextMenu.widget")),
};

interface IDynamicWidgetProps {
  url?: IUrl;
  padding?: TPadding;
  pageType?: string;
  [key: string]: any;
}

interface WidgetGeneratorProps extends IWidgetModel {
  session?: SessionData;
  adaptedValues?: unknown;
}

const WidgetGenerator = ({
  widgetName,
  widgetContainerId,
  url,
  settings,
  pageType,
  adaptedValues: preComputedAdaptedValues,
}: WidgetGeneratorProps) => {
  const adaptedValues = preComputedAdaptedValues ?? {};

  const DynamicWidget: ComponentType<IDynamicWidgetProps> | null =
    Widgets[widgetName];

  /**
   * Widget settings configurations
   * 1. Padding
   */
  const padding: TPadding | undefined =
    widgetContainerId === undefined
      ? "both"
      : settings?.PlacementPadding?.[widgetContainerId];

  if (DynamicWidget) {
    DynamicWidget.displayName = widgetName;
    const props: IDynamicWidgetProps = {
      ...adaptedValues,
      padding: padding || "both",
    };
    if (url) props.url = url;
    if (pageType) props.pageType = pageType;
    return <DynamicWidget {...props} />;
  } else {
    return null;
  }
};

export default WidgetGenerator;
