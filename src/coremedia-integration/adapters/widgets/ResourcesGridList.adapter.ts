import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import {
  ResourceItem,
  ResourcesGridListProps,
  SidebarCategory,
} from "@digital-b2c/coreui-kit";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import {
  getAkamayUrl,
  formatDate,
  filterTeasableItemsByRole,
  isWithinDays,
} from "@/lib/utilities";
import { SessionData } from "@/lib/session";
import { ICMCollection } from "@/models/coremedia/ICMCollection.interface";
import { getPremiumVisionLink } from "@/lib/server-actions";

import AppConfig from "@/lib/AppConfig";

export class ResourcesGridListAdapter extends Adapter<
  GenericWidgetValueModel,
  Promise<Nullable<ResourcesGridListProps>>
> {
  constructor(private session: SessionData) {
    super();
  }
  adapt: (source: any) => Promise<Nullable<ResourcesGridListProps>> = async (
    source,
  ) => {
    if (!source.length) return null;

    const { userGroup } = this.session;
    const data = source[0] as ICMCollection;
    const { html } = AppConfig;

    const filteredData = filterTeasableItemsByRole(
      data.teaserLXCallToActionSettings,
      userGroup?.replaceAll(" ", "")?.toLocaleLowerCase(),
    );

    const itemsPromises = (filteredData ?? []).flatMap((teaser: any) => {
      return (teaser.teaserTargets ?? [])
        .map(
          async (entry: any, index: number): Promise<ResourceItem | null> => {
            const target = entry?.target;
            if (!target) return null;

            const rawDate = target?.validFrom
              ? target?.validFrom
              : teaser?.media?.[index]?.creationDate || "";

            const href =
              getAkamayUrl(target?.data?.uri) ||
              (await getPremiumVisionLink(target?.url)) ||
              target?.dataUrl;

            return {
              title: target?.teaserTitle || target?.title,
              bodyText: target?.teaserText?.text
                ? html(target?.teaserText?.text)
                : "",
              date: formatDate(rawDate),
              href,
              type: target?.type === "CMExternalLink" ? "externalLink" : "pdf",
              category: teaser?.target?.teaserTitle ?? "",
              hasNotification: isWithinDays(rawDate),
              id: target.id,
            };
          },
        )
        .filter(
          (
            item: Promise<ResourceItem | null> | null,
          ): item is Promise<ResourceItem | null> => item !== null,
        );
    });

    const items: ResourceItem[] = (await Promise.all(itemsPromises)).filter(
      (item: ResourceItem | null): item is ResourceItem => item !== null,
    );

    const notifiedCategories = new Set(
      items
        .filter((item) => item.hasNotification && item.category)
        .map((item) => item.category),
    );

    const cmsCategories: SidebarCategory[] = (
      data.teaserLXCallToActionSettings ?? []
    )
      .filter((item: any) => item?.target?.teaserTitle)
      .map((item: any) => ({
        label: item?.target?.teaserTitle,
        value: item?.target?.teaserTitle,
        extension: item?.callToActionHash,
        active: false,
        hasNotification: notifiedCategories.has(item?.target?.teaserTitle),
      }));

    const categories: SidebarCategory[] = [
      { label: "All Resources", active: true },
      ...cmsCategories,
    ];

    return { categories, items };
  };

  adaptReverse: (
    source: Promise<Nullable<ResourcesGridListProps>>,
  ) => GenericWidgetValueModel = (source) => {
    return source as any;
  };
}
