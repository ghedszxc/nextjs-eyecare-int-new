import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { FeaturedNewsHighlightsProps } from "@digital-b2c/coreui-kit";
import {
  canAccessContent,
  extractParagraphs,
  getAdapterCTA,
  getAdapterPictures,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";
import moment from "moment";
import { SessionData } from "@/lib/session";

export class BlogFeaturedPostCardAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<FeaturedNewsHighlightsProps>
> {
  constructor(private session: SessionData) {
    super();
  }
  adapt: (source: any) => Nullable<FeaturedNewsHighlightsProps> = (source) => {
    if (!source.length) return null;

    const { html } = AppConfig;

    const teaser = source.find((src: any) => src.type === "CMTeaser");

    const title = teaser.teaserTitle;
    const cta = teaser?.teaserTargets
      ? { ...getAdapterCTA(teaser.teaserTargets)?.[0] }
      : undefined;

    const data = source.find((src: any) => src.type === "CMQueryList");

    const items = data?.itemsPaged?.result?.map((item: any) => {
      const isAccessible = canAccessContent({
        allowedRoles:
          item?.subjectTaxonomy
            ?.filter((tag: any) => tag?.parent?.value === "_GroupRoles")
            ?.map((tag: any) => tag?.value?.toLocaleLowerCase()) || [],
        userRole: this?.session?.userGroup
          ?.replaceAll(" ", "")
          ?.toLocaleLowerCase(),
      });

      return {
        type: !isAccessible ? "restricted" : undefined,
        id: item?.id,
        title: !isAccessible ? "Restricted" : html(item.teaserTitle),
        description: !isAccessible
          ? "You don't have permission to view this content. Contact support for access."
          : extractParagraphs(item.detailText.text),
        tag: item.subjectTaxonomy[0].externalReference,
        date: {
          label: moment(item?.extDisplayedDate)?.format("D MMM YYYY"),
          value: item?.extDisplayedDate,
        },
        image: !isAccessible
          ? { src: "/images/restricted.png", alt: "lock" }
          : getAdapterPictures(item.media),
        cta: !isAccessible
          ? undefined
          : {
              url: `/${item.navigationPath
                .slice(1)
                .map((curr: any) => curr.segment)
                .join("/")}-${item.id}`,
              icon: "tiltedRightBlack",
              isExternal: false,
              label: "Read More",
            },
      };
    });

    return {
      items,
      title,
      cta: cta ? { ...cta, icon: "rightBlack" } : undefined,
      variant: "home",
    };
  };

  adaptReverse: (
    source: Nullable<FeaturedNewsHighlightsProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
