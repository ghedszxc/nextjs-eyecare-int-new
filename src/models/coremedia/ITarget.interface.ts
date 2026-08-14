import { ILocalSettings } from "./ILocalSettings.interface";
import { ISubjectTaxonomy } from "./ISubjectTaxonomy";
import { ITeaserTarget } from "./ITeaserTarget.interface";

export interface ITarget {
  name: string;
  type: string;
  id?: string;
  url?: string;
  title?: string;
  filename?: string;
  teaserTitle?: string | null;
  teaserText?: string | null;
  detailText?: string | null;
  data?: {
    contentType: string;
    uri: string;
    size: number;
  };
  validFrom: string | null;
  localSettings: ILocalSettings;
  subjectTaxonomy?: ISubjectTaxonomy[];
  teaserTargets?: ITeaserTarget[];
  __typename: string;
}
