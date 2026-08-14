import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import {
  GlobalSearchResultsListProps,
  ResourceItem,
} from "@digital-b2c/coreui-kit";
import {
  canAccessContent,
  extractParagraphs,
  formatDate,
  getAkamayUrl,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";
import { SessionData } from "@/lib/session";
import { getPremiumVisionLink } from "@/lib/server-actions";

export class GlobalSearchResultsListAdapter extends Adapter<
  GenericWidgetValueModel,
  Promise<Nullable<GlobalSearchResultsListProps & { totalPages?: number }>>
> {
  constructor(private session: SessionData) {
    super();
  }

  adapt: (
    source: any,
  ) => Promise<
    Nullable<GlobalSearchResultsListProps & { totalPages?: number }>
  > = async (source) => {
    if (!source?.length) return null;

    const { userGroup } = this.session;

    const { html } = AppConfig;

    const data = source[0];
    if (!data?.items) return null;

    const cmTypesWithGroupRoles = ["CMArticle", "CMDownload", "CMExternalLink"];

    const formattedData = data.items.map((item: any) => {
      if (!item?.subjectTaxonomy) return item;

      const parentValue = cmTypesWithGroupRoles.includes(item?.type)
        ? "_GroupRoles"
        : undefined;

      const allowedRoles = item?.subjectTaxonomy
        ?.filter(
          (tag: any) =>
            tag?.parent?.value?.toLocaleLowerCase() ===
            parentValue?.toLocaleLowerCase(),
        )

        ?.map((tag: any) =>
          tag?.value?.replaceAll(" ", "")?.toLocaleLowerCase(),
        );

      return {
        ...item,
        restricted: !canAccessContent({
          allowedRoles,
          userRole: userGroup?.replaceAll(" ", "")?.toLocaleLowerCase(),
        }),
      };
    });

    const items: ResourceItem[] = await Promise.all(
      formattedData.map(async (item: any) => {
        let title;
        let href;
        let date;
        let type: ResourceItem["type"];
        let bodyText;
        let restricted;

        const isRestricted = Boolean(item?.restricted);
        const restrictedTitle = "Restricted";
        const restrictedBody = "Contact support for access.";

        switch (item?.type) {
          case "CMDownload":
            title = isRestricted
              ? restrictedTitle
              : item?.teaserTitle || item?.title || item?.name;
            href = isRestricted ? undefined : getAkamayUrl(item?.data?.uri);
            date = isRestricted
              ? undefined
              : item?.validFrom
                ? item?.validFrom
                : item?.creationDate || "";
            type = isRestricted ? "restricted" : "pdf";
            bodyText = isRestricted
              ? restrictedBody
              : item?.teaserText?.text
                ? html(item?.teaserText?.text)
                : "";
            restricted = isRestricted;
            break;

          case "CMExternalLink":
            title = isRestricted
              ? restrictedTitle
              : item?.teaserTitle || item?.title || item?.name;
            href = isRestricted ? undefined : item?.url;
            date = isRestricted
              ? undefined
              : item?.validFrom
                ? item?.validFrom
                : item?.creationDate || "";
            type = isRestricted ? "restricted" : "externalLink";
            bodyText = isRestricted
              ? restrictedBody
              : item?.teaserText?.text
                ? html(item?.teaserText?.text)
                : "";
            restricted = isRestricted;

            if (href?.includes("premiumvision.com")) {
              href = await getPremiumVisionLink(item?.url);
            }

            break;

          case "CMArticle":
            title = isRestricted
              ? restrictedTitle
              : item?.teaserTitle || item?.title || item?.name;
            href = isRestricted
              ? undefined
              : item?.navigationPath
                  ?.map((curr: any) => curr.segment)
                  ?.join("/") || "";
            date = isRestricted
              ? undefined
              : item?.validFrom
                ? item?.validFrom
                : item?.creationDate || "";
            type = isRestricted ? "restricted" : "externalLink";
            bodyText = isRestricted
              ? restrictedBody
              : item?.teaserText?.text
                ? extractParagraphs(item?.teaserText?.text || "")
                : "";
            restricted = isRestricted;

            // check if the article is from news
            if (
              item?.subjectTaxonomy?.[0]?.parent?.externalReference?.toLocaleLowerCase() ===
              "news"
            ) {
              href = isRestricted
                ? undefined
                : `${item.navigationPath
                    .map((curr: any) => curr.segment)
                    .join("/")}-${item.id}`;
            }
            break;

          default:
            title = item?.teaserTitle || item?.title || item?.name;
            href =
              item?.navigationPath
                ?.map((curr: any) => curr.segment)
                ?.join("/") || "";
            date = item?.extDisplayedDate || item?.creationDate;
            type = "externalLink";
            bodyText = item?.teaserText?.text
              ? html(item?.teaserText?.text)
              : "";
        }

        return {
          title,
          bodyText,
          date: formatDate(date),
          type,
          href,
          id: item?.id,
          restricted,
        };
      }),
    );

    const totalPages = data?.totalPages;

    return {
      items,
      totalPages,
      // to be handled by widget
      currentPage: 0,
      searchResult: "",
      searchValue: "",
      onPageChange: null,
      onSearchChange: null,
      onSearchSubmit: null,
    };
  };

  adaptReverse: (
    source: Promise<
      Nullable<GlobalSearchResultsListProps & { totalPages?: number }>
    >,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
