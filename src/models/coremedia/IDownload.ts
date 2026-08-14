import { IMedia } from "./IMedia.interface";
import { ISubjectTaxonomy } from "./ISubjectTaxonomy";

export interface IDownload {
  id: string;
  title: string;
  type: string;
  filename: string;
  detailText?: {
    text: string;
  };
  data?: {
    contentType: string;
    uri: string;
    size: number;
  };
  media?: IMedia[];
  subjectTaxonomy?: ISubjectTaxonomy[];
}
