import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { EventListProps } from "@digital-b2c/coreui-kit";
import { getAdapterCTA, getAdapterPictures } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

const themeMapping = (theme: string) => {
  switch (theme) {
    case "--color-darkerbg":
      return "gray";
    default:
      return undefined;
  }
};

interface ExtendedEventListProps extends EventListProps {
  emptyText?: string;
}

export class EventListAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<ExtendedEventListProps>
> {
  adapt: (source: any) => Nullable<ExtendedEventListProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    // const backgroundColor =
    //   data.collectionSettings?.other_properties?.backgroundColor;

    const emptyText = data?.captionText;

    const items = data.teasableItems.map((item: any) => {
      return {
        title: html(item.teaserTitle1),
        location: item.teaserTitle2,
        description: html(item.teaserText1),
        date: item.teaserPreTitle,
        image: getAdapterPictures(item.media) || undefined,
        cta: getAdapterCTA(item.teaserTargets)?.[0],
      };
    });

    return {
      variant: data.viewtype,
      title: data.collectionTitle,
      cta: getAdapterCTA(data.teaserLXCallToActionSettings)?.[0]
        ? {
            ...getAdapterCTA(data.teaserLXCallToActionSettings)?.[0],
            icon: "rightBlack",
          }
        : undefined,
      items,
      backgroundColor: themeMapping(data?.collectionTextOverlayStyle),
      emptyText,
    };
  };

  adaptReverse: (
    source: Nullable<ExtendedEventListProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
