import { ISettings } from "./ISettings.interface";
import { IWidgetModel } from "./IWidget.interface";

export interface ILayoutModel {
  layoutType: string;
  widgets: Array<IWidgetModel>;
  title: string;
  description: string;
  canonicalUrls?: {
    href?: string;
    hreflang?: string;
    rel?: string;
  };
  metaTags?: {
    property?: string;
    content?: string;
    name?: string;
  };
  footerData?: unknown;
  navigationData?: unknown;
  settings?: ISettings;
}

export class LayoutModel implements ILayoutModel {
  layoutType: string;
  widgets: IWidgetModel[];
  title: string;
  description: string;

  constructor(
    layoutType: string,
    widgets: IWidgetModel[],
    title: string,
    description: string
  ) {
    this.layoutType = layoutType;
    this.widgets = widgets;
    this.title = title;
    this.description = description;
  }
}

export interface ILayoutContext {
  inputSettings: unknown;
  storeLocatorSettings: unknown;
  lensBuilderSettings: unknown;
  localeId: string;
  searchPageSettings: unknown;
}
