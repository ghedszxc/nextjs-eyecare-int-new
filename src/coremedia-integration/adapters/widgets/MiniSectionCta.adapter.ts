import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { MiniSectionCtaProps } from "@digital-b2c/coreui-kit";
import { getAdapterCTA } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

const themeMapping = (theme: string) => {
  switch (theme) {
    case "--color-black":
      return "dark";
    case "--color-white":
      return "light";
    case "--color-darkerbg":
      return "gray";
    default:
      return undefined;
  }
};

export class MiniSectionCtaAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<MiniSectionCtaProps>
> {
  adapt: (source: any) => Nullable<MiniSectionCtaProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    const backgroundColor = data?.teaserOverlaySettings?.style?.backgroundColor;
    const color = data?.teaserOverlaySettings?.style?.color;

    return {
      variant: data.viewtype,
      theme: themeMapping(data?.teaserOverlaySettings?.style?.textCls),
      title: html(data.teaserTitle),
      subtitle: html(data.teaserText.text),
      cta: getAdapterCTA(data.teaserTargets)?.[0],
      moduleStyles: {
        color,
        backgroundColor,
      },
    };
  };

  adaptReverse: (
    source: Nullable<MiniSectionCtaProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
