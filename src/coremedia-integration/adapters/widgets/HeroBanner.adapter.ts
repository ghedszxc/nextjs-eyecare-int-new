import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { BrandsStripProps, HeroBannerProps } from "@digital-b2c/coreui-kit";
import {
  getAdapterCTA,
  getAdapterPictures,
  getAkamayUrl,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class HeroBannerAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<HeroBannerProps>
> {
  adapt: (source: any) => Nullable<HeroBannerProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];

    const vBannerPodcast = data.viewtype !== "bannerPodcast";
    const { html } = AppConfig;

    const logoData = (brandsData: any): any => {
      const logo = brandsData?.find(
        (item: any) => item.viewtype === "titleLogo",
      );
      return logo
        ? {
            src: getAkamayUrl(logo?.uriTemplate) ?? "",
            alt: logo?.alt,
            variant: logo.viewtype,
          }
        : null;
    };

    const brands = (brandsData: any): BrandsStripProps => {
      const brandLogo = brandsData
        ?.filter((brand: any) => brand.viewtype !== "titleLogo")
        ?.map((brand: any) => {
          return {
            src: getAkamayUrl(brand?.uriTemplate) ?? "",
            alt: brand?.alt,
          };
        });

      return {
        variant: "light",
        title: html(data.teaserLabelText) as string,
        logos: brandLogo,
        cta: getAdapterCTA(data.teaserTargets)?.[2],
      };
    };

    return {
      variant: data.viewtype,
      promoteToH1: data.settings.other_properties?.promoteToH1,
      logo: vBannerPodcast
        ? logoData(data.teaserIconSvg)
        : getAdapterPictures(data?.media),
      title: data.teaserTitle1 ? html(data.teaserTitle1) : undefined,
      subtitle: html(data.teaserText1),
      backgroundImage: getAdapterPictures(data?.media),
      cta: getAdapterCTA(data.teaserTargets),
      ctaLogo: getAdapterCTA(data.teaserTargets),
      brands: brands(data.teaserIconSvg),
    };
  };

  adaptReverse: (source: Nullable<HeroBannerProps>) => GenericWidgetValueModel =
    (source) => {
      return source;
    };
}
