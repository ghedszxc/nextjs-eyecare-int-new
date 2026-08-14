import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { BlogCardGridProps } from "@digital-b2c/coreui-kit";
import {
  canAccessContent,
  extractParagraphs,
  getAdapterPictures,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import moment from "moment";
import { SessionData } from "@/lib/session";

export class RelatedArticleAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<BlogCardGridProps>
> {
  constructor(private session?: SessionData) {
    super();
  }
  adapt: (source: any) => Nullable<BlogCardGridProps> = (source) => {
    if (!source.length) return null;
    // Pre-adapted shape: built manually (e.g. on the single blog page) where
    // widgetValue is already BlogCardGridProps-like ([{ items: [...] }]).
    const data = source[0];
    if (data && Array.isArray(data.items)) {
      return data as BlogCardGridProps;
    }

    if (!data?.itemsPaged?.result) return null;

    const title = data?.teaserTitle;

    const relatedArticles = data.itemsPaged.result
      .map((result: any) => result.grid.placements[0].items[0])
      .map((item: any) => {
        const isAccessible = canAccessContent({
          allowedRoles:
            item?.subjectTaxonomy
              ?.filter((tag: any) => tag?.parent?.value === "_GroupRoles")
              ?.map((tag: any) => tag?.value?.toLocaleLowerCase()) || [],
          userRole: this.session?.userGroup
            ?.replaceAll(" ", "")
            ?.toLocaleLowerCase(),
        });

        return {
          type: !isAccessible ? "restricted" : undefined,
          id: item?.id,
          date: {
            label: moment(item?.extDisplayedDate)?.format("D MMM YYYY"),
            value: item?.extDisplayedDate,
          },
          description: !isAccessible
            ? "You don't have permission to view this content. Contact support for access."
            : extractParagraphs(item.teaserText.text),
          title: !isAccessible ? "Restricted" : item.teaserTitle,
          tag: item?.navigationPath?.[3]?.segment,
          cta: !isAccessible
            ? undefined
            : {
                url: `/${item.navigationPath
                  .slice(1) // remove first item
                  .map((curr: any) => curr.segment)
                  .join("/")}-${item.id}`,
                icon: "tiltedRightBlack",
                isExternal: false,
                label: "Read More",
              },
          image: !isAccessible
            ? {
                src: "/images/restricted.png",
                alt: "lock",
              }
            : getAdapterPictures(item.pictures),
        };
      });

    return {
      title,
      items: relatedArticles,
    };
  };

  adaptReverse: (
    source: Nullable<BlogCardGridProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
