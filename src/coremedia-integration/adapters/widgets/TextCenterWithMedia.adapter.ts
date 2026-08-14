import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { TextCenterWithMediaProps } from "@digital-b2c/coreui-kit";
import { getAkamayUrl } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";

export class TextCenterWithMediaAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<TextCenterWithMediaProps>
> {
  adapt: (source: any) => Nullable<TextCenterWithMediaProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];

    return {
      title: data?.teaserTitle || "",
      thumbnail: data?.media?.[0]?.uriTemplate
        ? getAkamayUrl(data?.media?.[0]?.uriTemplate)
        : "",
      loop: data?.media?.[1]?.loop ?? false,
      mute: data?.media?.[1]?.mute ?? false,
      hideControl: data?.media?.[1]?.hideControl ?? false,
      autoPlay: data?.media?.[1]?.autoplay ?? false,
      videoUrl: data?.media?.[1]?.dataUrl ?? "",
    };
  };

  adaptReverse: (
    source: Nullable<TextCenterWithMediaProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
