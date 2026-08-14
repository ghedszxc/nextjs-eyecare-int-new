import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { TwoColTextMenuProps } from "@digital-b2c/coreui-kit";
import { appendODMarketingLogin, getAdapterCTA } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import { SessionData } from "@/lib/session";

export class TwoColTextMenuAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<TwoColTextMenuProps>
> {
  constructor(private session: SessionData) {
    super();
  }

  adapt: (source: any) => Nullable<TwoColTextMenuProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { loginToken } = this.session;

    const sections = (data?.teasableItems ?? []).map((section: any) => ({
      title: section?.collectionTitle || section?.title || "",
      items: (section?.items ?? []).flatMap((item: any) =>
        getAdapterCTA(item?.teaserTargets ?? []).map((cta) =>
          cta.url
            ? { ...cta, url: appendODMarketingLogin(cta.url, loginToken) }
            : cta,
        ),
      ),
    }));

    if (!sections.length) return null;

    return {
      ariaLabel: data?.collectionTitle || undefined,
      sections,
    };
  };

  adaptReverse: (
    source: Nullable<TwoColTextMenuProps>,
  ) => GenericWidgetValueModel = (source) => {
    return source;
  };
}
