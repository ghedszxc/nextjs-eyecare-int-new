import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { TextCenterCtaInBottomProps } from "@digital-b2c/coreui-kit";
import { getAdapterCTA } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class TextCenterCtaInBottomAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<TextCenterCtaInBottomProps>
> {
  adapt: (source: any) => Nullable<TextCenterCtaInBottomProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;
    const resourceTitles = data?.subjectTaxonomy.map(
      (title: { value: string }) => title.value.toLowerCase(),
    );

    return {
      title: html(data.teaserTitle),
      subtitle: html(data.teaserText.text),
      ctas: getAdapterCTA(data.teaserTargets),
      resourceTitles: resourceTitles || null,
    };
  };

  adaptReverse: (
    source: Nullable<TextCenterCtaInBottomProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
