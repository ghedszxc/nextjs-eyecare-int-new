import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { QuoteSectionBlockProps } from "@digital-b2c/coreui-kit";
import { extractParagraphs, getAkamayUrl } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";

export class QuoteSectionBlockAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<QuoteSectionBlockProps>
> {
  adapt: (source: any) => Nullable<QuoteSectionBlockProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];

    const items = (data?.teasableItems ?? []).map((item: any) => ({
      bodyText: extractParagraphs(item?.teaserText?.text || "") || "",
      displayPhoto: getAkamayUrl(item?.pictures?.[0]?.data?.uri) || "",
      displayName: item?.displayName || "",
      jobTitleLogo: getAkamayUrl(item?.pictures?.[1]?.data?.uri) || "",
    }));

    return {
      title: data?.collectionTitle || "",
      items,
    };
  };

  adaptReverse: (
    source: Nullable<QuoteSectionBlockProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
