import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { TextBodyProps } from "@digital-b2c/coreui-kit";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class TextBodyAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<TextBodyProps>
> {
  adapt: (source: any) => Nullable<TextBodyProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    const resourceTitles = data?.subjectTaxonomy.map(
      (title: { value: string }) => title.value.toLowerCase(),
    );

    return {
      variant: data?.viewtype,
      title: html(data.teaserTitle) as string,
      titleAlign: data?.articleTitleAlign,
      body: html(data.teaserText.text),
      resourceTitles,
    };
  };

  adaptReverse: (source: Nullable<TextBodyProps>) => GenericWidgetValueModel = (
    source,
  ) => {
    return source;
  };
}
