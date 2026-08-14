// Modules
import { Nullable } from "@/models/Nullable.interface";
import { Factory } from "./Factory";
import { IAdapter } from "@/coremedia-integration/adapters/Adapter";
import { GenericWidgetNameModel } from "@/models/IGenericWidgetValue.interface";

// Adapters
import { HeroBannerAdapter } from "../adapters/widgets/HeroBanner.adapter";
import { Teaser5050withCtaAdapter } from "../adapters/widgets/Teaser5050withCta.adapter";
import { MiniSectionCtaAdapter } from "../adapters/widgets/MiniSectionCta.adapter";
import { ContactModuleAdapter } from "../adapters/widgets/ContactModule.adapter";
import { TextEventAdapter } from "../adapters/widgets/TextEvent.adapter";
import { MiniBannerAdapter } from "../adapters/widgets/MiniBanner.adapter";
import { CardCollectionAdapter } from "../adapters/widgets/CardCollection.adapter";
import { TextBodyAdapter } from "../adapters/widgets/TextBody.adapter";
import { EventListAdapter } from "../adapters/widgets/EventList.adapter";
import { TextCenterCtaInBottomAdapter } from "../adapters/widgets/TextCenterCtaInBottom.adapter";
import { HeroBannerCarouselAdapter } from "../adapters/widgets/HeroBannerCarousel.adapter";
import { SessionData } from "@/lib/session";
import { ResourcesGridListAdapter } from "../adapters/widgets/ResourcesGridList.adapter";
import { InternalBrandsTabAdapter } from "../adapters/widgets/InternalBrandsTab.adapter";
import { BlogPostAdapter } from "../adapters/widgets/BlogPost.adapter";
import { RelatedArticleAdapter } from "../adapters/widgets/RelatedArticle.adapter";
import { BlogCardGridAdapter } from "../adapters/widgets/BlogCardGrid.adapter";
import { BlogFeaturedPostCardAdapter } from "../adapters/widgets/BlogFeaturedPostCard.adapter";
import { BlogSearchResultsListAdapter } from "../adapters/widgets/BlogSearchResultsList.adapter";
import { TextCenterWithMediaAdapter } from "../adapters/widgets/TextCenterWithMedia.adapter";
import { GlobalSearchResultsListAdapter } from "../adapters/widgets/GlobalSearchResultsList.adapter";
import { QuoteSectionBlockAdapter } from "../adapters/widgets/QuoteSectionBlock.adapter";
import { TwoColTextMenuAdapter } from "../adapters/widgets/TwoColTextMenu.adapter";

export class WidgetParamAdapterFactory extends Factory<
  GenericWidgetNameModel,
  Nullable<IAdapter>
> {
  constructor(private session: SessionData) {
    super();
  }
  instance: (comparator: GenericWidgetNameModel) => Nullable<IAdapter> = (
    comparator,
  ) => {
    switch (comparator) {
      case "HeroBanner":
        return new HeroBannerAdapter();
      case "teaser5050withCTA":
        return new Teaser5050withCtaAdapter(this.session);
      case "miniSectionCTA":
        return new MiniSectionCtaAdapter();
      case "contactModule":
        return new ContactModuleAdapter();
      case "miniBanner":
        return new MiniBannerAdapter();
      case "cardCollection":
        return new CardCollectionAdapter(this.session);
      case "textCenterTablePlain":
        return new TextEventAdapter();
      case "TextBody":
        return new TextBodyAdapter();
      case "eventList":
        return new EventListAdapter();
      case "textCenterCtaInbottom":
        return new TextCenterCtaInBottomAdapter();
      case "heroBannerCarousel":
        return new HeroBannerCarouselAdapter();
      case "resourcesGridList":
        return new ResourcesGridListAdapter(this.session);
      case "internalBrandsTab":
        return new InternalBrandsTabAdapter();
      case "blogPost":
        return new BlogPostAdapter(this.session);
      case "relatedArticle":
        return new RelatedArticleAdapter(this.session);
      case "blog-card-grid":
        return new BlogCardGridAdapter(this.session);
      case "blog-featured-post-card":
        return new BlogFeaturedPostCardAdapter(this.session);
      case "blog-search-results-list":
        return new BlogSearchResultsListAdapter(this.session);
      case "TextCenterWithMedia":
        return new TextCenterWithMediaAdapter();
      case "globalSearchResultList":
        return new GlobalSearchResultsListAdapter(this.session);
      case "quoteSectionBlock":
        return new QuoteSectionBlockAdapter();
      case "twoColTextMenu":
        return new TwoColTextMenuAdapter(this.session);
      default:
        return null;
    }
  };
}
