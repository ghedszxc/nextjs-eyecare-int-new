import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { InternalBrandsTabProps } from "@digital-b2c/coreui-kit";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";
import { getAdapterCTA, getAkamayUrl } from "@/lib/utilities";

export class InternalBrandsTabAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<InternalBrandsTabProps>
> {
  adapt: (source: any) => Nullable<InternalBrandsTabProps> = (source) => {
    if (!source.length) return null;
    const data = source?.[0];

    const { html } = AppConfig;

    const title = data?.collectionTitle || "";
    const subTitle = html(data?.collectionText) || "";

    const tabs = data?.teasableItems?.map((item: any) => {
      const tabTitle = item?.collectionTitle || "";

      const topContent = {
        title: item?.items?.[0]?.teaserTitle1 || "",
        longText: html(item?.items?.[0]?.teaserText1) || "",
        cta: getAdapterCTA(item?.items?.[0]?.teaserTargets)?.[0],
        rightSideText: item?.items?.[0]?.teaserText2
          ? html(item?.items?.[0]?.teaserText2)
          : "",
      };

      const bottomContent = {
        title: item?.items?.[1]?.teaserTitle1 || "",
        icon: item?.items?.[1]?.teaserIconSvg?.[0]?.uriTemplate
          ? {
              src: getAkamayUrl(
                item?.items?.[1]?.teaserIconSvg?.[0]?.uriTemplate,
              ),
              alt: item?.items?.[1]?.teaserIconSvg?.[0]?.alt,
            }
          : null,
        textList: html(item?.items?.[1]?.teaserText1) || "",
        quote: html(item?.items?.[1]?.teaserText2) || "",
      };

      return {
        tabTitle,
        topContent,
        bottomContent,
      };
    });

    return { title, subTitle, tabs };
  };

  adaptReverse: (
    source: Nullable<InternalBrandsTabProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
