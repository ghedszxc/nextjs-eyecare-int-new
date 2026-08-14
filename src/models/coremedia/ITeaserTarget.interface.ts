import { ITarget } from "./ITarget.interface";

export interface ITeaserTarget {
  callToActionEnabled?: boolean;
  callToActionText: string;
  callToActionHash: string;
  target: ITarget;
  __typename: string;
}
