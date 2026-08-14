export interface ICrops {
  [index: string]: number | string;
}

export interface IPictureCrops {
  crops: ICrops;
  uriTemplate: string;
}
