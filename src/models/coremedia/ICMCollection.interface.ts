import { IMedia } from "./IMedia.interface";
import { ITeasableItem } from "./ITeasableItem.interface";
import { ITeaserIconSVG } from "./ITeaserIconSVG.interface";
import { ITeaserLXCallToActionSetting } from "./ITeaserLXCallToActionSetting.interface";

export interface ICMCollection {
  id: string;
  type: string;
  title: string;
  name: string;
  viewtype: string | null;
  collectionTitle: string;
  collectionSubTitle: string;
  collectionMaxElementNumber: number;
  collectionText: string;
  collectionSettings: {
    collectionText: string | null;
    collectionTextOverlay: string | null;
    collectionSubTitle: string | null;
    other_properties: any | null;
  };
  teaserIconSvg: ITeaserIconSVG[];
  teaserLXCallToActionSettings: ITeaserLXCallToActionSetting[];
  media: IMedia[];
  teasableItems: ITeasableItem[];
  __typename: string;
}
