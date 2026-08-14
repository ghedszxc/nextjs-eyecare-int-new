import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { ContactModuleProps } from "@digital-b2c/coreui-kit";
import { getAdapterCTA, getAdapterPictures } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class ContactModuleAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<ContactModuleProps>
> {
  adapt: (source: any) => Nullable<ContactModuleProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    return {
      title: html(data.teaserTitle),
      subtitle: html(data.teaserText.text),
      image: {
        src: getAdapterPictures(data?.media)?.src ?? "",
        alt: getAdapterPictures(data?.media)?.alt ?? "",
      },
      ctas: getAdapterCTA(data.teaserTargets),
      animateBlur: true,
      blurred: true,
    };
  };

  adaptReverse: (
    source: Nullable<ContactModuleProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
