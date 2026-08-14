import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { NewsCardListProps, NewsCardProps } from "@digital-b2c/coreui-kit";
import {
  canAccessContent,
  extractParagraphs,
  getAdapterPictures,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import moment from "moment";
import { SessionData } from "@/lib/session";

export class BlogCardGridAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<NewsCardListProps & { totalPages?: number }>
> {
  constructor(private session: SessionData) {
    super();
  }
  adapt: (
    source: any,
  ) => Nullable<NewsCardListProps & { totalPages?: number }> = (source) => {
    if (!source?.length) return null;

    // Pre-adapted shape: built manually (e.g. on the single blog page) where
    // widgetValue is already BlogCardGridProps-like ([{ items: [...] }]).
    const first = source[0];
    if (first && Array.isArray(first.items)) {
      return {
        ...first,
        currentPage: 0,
        searchValue: "",
        onPageChange: null,
        onSearchChange: null,
        onSearchSubmit: null,
      };
    }

    // CMS shape: [search, data] where data.itemsPaged.result holds raw items.
    const data = source?.find((src: any) => src?.type === "CMQueryList");
    const search = source?.find(
      (src: any) =>
        src?.type === "CMPlaceholder" && src?.viewtype === "SearchInput",
    );

    if (!data?.itemsPaged?.result) return null;

    const items: NewsCardProps[] = data.itemsPaged.result.map((item: any) => {
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
        title: !isAccessible ? "Restricted" : item.teaserTitle,
        date: {
          label: moment(item?.extDisplayedDate)?.format("D MMM YYYY"),
          value: item?.extDisplayedDate,
        },
        description: !isAccessible
          ? "You don't have permission to view this content. Contact support for access."
          : extractParagraphs(item.teaserText.text),
        tag: item?.subjectTaxonomy?.find(
          (tag: any) => tag?.parent?.value === "_News",
        )?.externalReference,
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
          ? { src: "/images/restricted.png", alt: "lock" }
          : getAdapterPictures(item.media),
      };
    });

    return {
      items: items,
      totalPages: data?.itemsPaged?.totalCount,

      // to be handled by widget
      currentPage: 0,
      searchValue: "",
      onSearchChange: null,
      onSearchSubmit: null,

      ...(search && {
        searchInputProps: {
          placeholder: search?.title,
        },
      }),
    };
  };

  adaptReverse: (
    source: Nullable<NewsCardListProps & { totalPages?: number }>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
