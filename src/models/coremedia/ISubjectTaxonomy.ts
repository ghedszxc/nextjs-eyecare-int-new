export interface ISubjectTaxonomy {
  name: string;
  value: string;
  id?: string;
  title?: string;
  externalReference?: string;
  parent?: {
    id?: string;
    name: string;
    value: string;
    externalReference?: string;
  };
}
