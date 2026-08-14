import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { TextEventProps } from "@digital-b2c/coreui-kit";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class TextEventAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<TextEventProps>
> {
  adapt: (source: any) => Nullable<TextEventProps> = (source) => {
    if (!source.length) return null;
    const data = source?.[0];

    const { html } = AppConfig;

    const title = data?.teaserTitle;
    const richText = html(data?.detailText?.text) || undefined;
    const variant = data?.viewtype;

    return { title, richText, variant };
  };

  adaptReverse: (source: Nullable<TextEventProps>) => GenericWidgetValueModel =
    (source) => {
      return source;
    };
}
