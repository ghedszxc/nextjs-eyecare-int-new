import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { HeroBannerCarouselProps } from "@digital-b2c/coreui-kit";
import {
  getAdapterCTA,
  getAdapterPictures,
  isWithinDays,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class HeroBannerCarouselAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<HeroBannerCarouselProps>
> {
  adapt: (source: any) => Nullable<HeroBannerCarouselProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    const items = data.teasableItems.map((item: any) => {
      const pictureMedia =
        item.media?.filter((m: any) => !m.uriTemplate?.includes("svg")) || [];

      const rawDate = item?.validFrom ? item?.validFrom : item?.creationDate;

      return {
        title: item.teaserTitle1 || item.teaserTitle || "",
        body: html(item.teaserText1 || item.teaserText?.text),
        image: getAdapterPictures(pictureMedia) || { src: "", alt: "" },
        ctas: getAdapterCTA(item.teaserTargets),
        isNewItem: isWithinDays(rawDate),
      };
    });

    return {
      items,
    };
  };

  adaptReverse: (
    source: Nullable<HeroBannerCarouselProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
