import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { MiniBannerProps } from "@digital-b2c/coreui-kit";
import {
  getAdapterCTA,
  getAdapterPictures,
  getAkamayUrl,
  isPromotedToH1,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";

export class MiniBannerAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<MiniBannerProps>
> {
  adapt: (source: any) => Nullable<MiniBannerProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    const isSingleBlogPage = Boolean(data?.isSingleBlogPage);

    const isBackSearchResultSVG =
      data.teaserIconSvg[0]?.viewtype === "backSearchResult";

    const cta = getAdapterCTA(data.teaserLXCallToActionSettings);
    const background = isSingleBlogPage
      ? { src: data?.media?.[0]?.data?.uri, alt: data?.media?.[0]?.alt }
      : getAdapterPictures(data?.media);

    const promoteToH1 = isPromotedToH1(data.settings);

    return {
      variant: data.viewtype,
      pretitle: data?.teaserPreTitle ? html(data.teaserPreTitle) : undefined,
      title: data?.teaserTitle1 ? html(data.teaserTitle1) : undefined,
      subtitle: data?.teaserText1 ? html(data.teaserText1) : undefined,
      background,
      logo: !isBackSearchResultSVG
        ? data?.teaserIconSvg?.[0]?.uriTemplate
          ? {
              src: getAkamayUrl(data?.teaserIconSvg[0]?.uriTemplate),
              alt: data?.teaserIconSvg[0]?.alt,
            }
          : undefined
        : undefined,
      cta: isBackSearchResultSVG ? undefined : cta,
      ...(isBackSearchResultSVG && {
        goBackProps: {
          icon: data?.teaserIconSvg?.[0]?.uriTemplate
            ? {
                src: isSingleBlogPage
                  ? data?.teaserIconSvg[0]?.uriTemplate
                  : getAkamayUrl(data?.teaserIconSvg[0]?.uriTemplate),
                alt: data?.teaserIconSvg[0]?.alt,
              }
            : undefined,
          link: {
            isExternal: cta[0].isExternal,
            href: cta[0].url,
            title: cta[0].label,
          },
        },
      }),
      promoteToH1,
      ...(data?.className && {
        className: data.className,
      }),
    };
  };

  adaptReverse: (source: Nullable<MiniBannerProps>) => GenericWidgetValueModel =
    (source) => {
      return source;
    };
}
