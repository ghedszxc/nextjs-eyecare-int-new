export interface ITeaserIconSVG {
  uriTemplate: string;
  picture: {
    height: number | null;
    width: number | null;
  };
  data: {
    uri: string;
    contentType: string;
  };
  pictureVariants: string | null;
  alt: string;
  viewType: string | null;
  inlineCode: any | null;
  type: string;
}
