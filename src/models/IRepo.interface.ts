export interface IRepo {
  getLayoutData(language: string, path: string): Promise<unknown>;
}
