export interface IMedia {
  id: string;
  title: string;
  type: string;
  viewtype: string | null;
  uriTemplate: string;
  detailText: {
    text: string;
    __typename: string;
  };
  alt: string;
  inlineCode: string | null;
  picture?: {
    height: number;
    width: number;
  };
  pictureVariants: any | null;
  __typename: string;
}
