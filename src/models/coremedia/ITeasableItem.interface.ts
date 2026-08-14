import { IMedia } from "./IMedia.interface";
import { ISettings } from "./ISettings.interface";
import { ITeaserOverlaySettings } from "./ITeaserOverlaySettings.interface";
import { ITeaserTarget } from "./ITeaserTarget.interface";

export interface ITeasableItem {
  type: string;
  id: string;
  viewtype: string | null;
  name: string;
  teaserTitle: string;
  teaserText: {
    text: string;
  } | null;
  title: string;
  settings: ISettings;
  subjectTaxonomy: any[];
  teaserOverlaySettings: ITeaserOverlaySettings;
  teaserTargets: ITeaserTarget[];
  media: IMedia[];
  detailText: {
    text: string;
  };
  htmlTitle: string;
  htmlDescription: string;
  keywords: string;
  articleColorSettings?: {
    title: string | null;
    other_properties: any | null;
    teaserOverlay: string | null;
  };
  related: any[];
  __typename: string;
}
