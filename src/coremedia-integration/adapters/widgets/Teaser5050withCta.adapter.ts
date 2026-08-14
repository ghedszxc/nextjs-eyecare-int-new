import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { Teaser5050WithCtaProps } from "@digital-b2c/coreui-kit";
import {
  getAdapterCTA,
  getAdapterPictures,
  hasTagAccess,
} from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";
import { ISubjectTaxonomy } from "@/models/coremedia/ISubjectTaxonomy";
import { SessionData } from "@/lib/session";

export class Teaser5050withCtaAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<Teaser5050WithCtaProps>
> {
  constructor(private session: SessionData) {
    super();
  }

  adapt: (source: any) => Nullable<Teaser5050WithCtaProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    const ctas = data.teaserTargets?.map((cta: any) => {
      return getAdapterCTA([cta])?.[0];
    });

    const resourceTitles = data?.subjectTaxonomy
      .filter(
        (tag: ISubjectTaxonomy) =>
          tag.parent?.externalReference?.toLocaleLowerCase() === "resources",
      )
      .map((title: { value: string }) => title.value.toLowerCase());

    const canAccess = hasTagAccess(data?.subjectTaxonomy, {
      value: this?.session?.userGroup?.replaceAll(" ", ""),
      parentExternalReference: "Group Roles",
    });

    const backgroundColor = data?.teaserOverlaySettings?.style?.backgroundColor;
    const color = data?.teaserOverlaySettings?.style?.color;

    return {
      variant: data.viewtype === "teaser5050imageright" ? "right" : "left",
      title: html(data.teaserTitle),
      subtitle: html(data.teaserText.text),
      image: getAdapterPictures(data?.media),
      ctas,
      moduleStyles: {
        color,
        backgroundColor,
      },
      resourceTitles: resourceTitles || null,
      ...(canAccess && { canAccess }),
    };
  };

  adaptReverse: (
    source: Nullable<Teaser5050WithCtaProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
