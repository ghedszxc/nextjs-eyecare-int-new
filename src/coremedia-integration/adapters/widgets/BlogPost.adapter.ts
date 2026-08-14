import { Nullable } from "@/models/Nullable.interface";
import { Adapter } from "../Adapter";
import { BlogPostProps } from "@digital-b2c/coreui-kit";
import { getAdapterPictures } from "@/lib/utilities";
import { GenericWidgetValueModel } from "@/models/IGenericWidgetValue.interface";
import AppConfig from "@/lib/AppConfig";
import moment from "moment";
import { SessionData } from "@/lib/session";

export class BlogPostAdapter extends Adapter<
  GenericWidgetValueModel,
  Nullable<BlogPostProps>
> {
  constructor(private session?: SessionData) {
    super();
  }
  adapt: (source: any) => Nullable<BlogPostProps> = (source) => {
    if (!source.length) return null;
    const data = source[0];
    const { html } = AppConfig;

    const title = data.teaserTitle;
    const description = html(data.detailText.text);
    const date: BlogPostProps["date"] = {
      label: moment(data?.extDisplayedDate ?? data?.creationDate).format(
        "D MMM YYYY",
      ),
      value: data.extDisplayedDate ?? data?.creationDate,
    };
    const image = getAdapterPictures(
      data.media ?? [],
    ) as BlogPostProps["image"];
    const tag = data.navigationPath[3].segment;

    return {
      title,
      description,
      date,
      tag,
      image,
    };
  };

  adaptReverse: (source: Nullable<BlogPostProps>) => GenericWidgetValueModel = (
    source,
  ) => {
    return source;
  };
}
