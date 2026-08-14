import { ITarget } from "./ITarget.interface";

export interface ITeaserLXCallToActionSetting {
  callToActionEnabled: boolean;
  callToActionText: string;
  callToActionHash: string;
  style: string;
  target: Pick<ITarget, "type" | "title" | "name" | "localSettings"> & {
    url: string;
    pictures: {
      uriTemplate: string;
      alt: string;
    };
  };
}
