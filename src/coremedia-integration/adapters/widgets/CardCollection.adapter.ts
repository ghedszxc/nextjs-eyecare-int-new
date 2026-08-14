import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { CardCollectionProps, CardProps } from "@digital-b2c/coreui-kit";
import {
  appendODMarketingLogin,
  getAdapterCTA,
  getAkamayUrl,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import { SessionData } from "@/lib/session";
import AppConfig from "@/lib/AppConfig";

const themeMapping = (theme: string) => {
  switch (theme) {
    case "--color-black":
      return "dark";
    case "--color-white":
      return "light";
    default:
      return undefined;
  }
};

export class CardCollectionAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<CardCollectionProps>
> {
  constructor(private session: SessionData) {
    super();
  }

  adapt: (source: any) => Nullable<CardCollectionProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;
    const { loginToken } = this.session;

    const cards = data.teasableItems.map((item: any): CardProps => {
      const cta = getAdapterCTA(item.teaserTargets)?.[0];

      return {
        title: html(item.teaserTitle) || undefined,
        subtitle: html(item.teaserText?.text) || undefined,
        logo: {
          src: getAkamayUrl(item.media?.[0]?.uriTemplate) ?? "",
          alt: item.media?.[0]?.alt,
        },
        cta:
          cta && cta.url
            ? { ...cta, url: appendODMarketingLogin(cta.url, loginToken) }
            : cta,
      };
    });

    return {
      variant: data.viewtype,
      theme: themeMapping(data?.collectionTextOverlayStyle),
      title: data?.collectionTitle ? html(data.collectionTitle) : undefined,
      subtitle: html(data.collectionText),
      cards: cards,
      ctaLabel: data?.teaserLXCallToActionSettings[0]?.callToActionText,
    };
  };

  adaptReverse: (
    source: Nullable<CardCollectionProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
