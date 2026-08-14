export type IIconTypes =
  | "share"
  | "spinner"
  | "play"
  | "playBlue"
  | "pauseBlue"
  | "close"
  | "external"
  | "arrowRight"
  | "arrowLeft"
  | "arrowRightCTA"
  | "arrowLeftCTA"
  | "arrowLeftCircle"
  | "arrowRightCircle"
  | "arrowRightCard"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "mail"
  | "trophy"
  | "medal";

export interface IIcon {
  type: IIconTypes;
  className?: string;
}
