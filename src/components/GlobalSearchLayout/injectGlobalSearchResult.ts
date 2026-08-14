import { ILayoutModel } from "@/models/ILayout.interface";
import { IWidgetModel } from "@/models/IWidget.interface";

export function injectGlobalSearchResults(
  layout: ILayoutModel,
  searchData: unknown,
): ILayoutModel {
  const widgets = layout.widgets.map((widget) => {
    const items = Array.isArray(widget.widgetValue) ? widget.widgetValue : [];

    const hasPlaceholder = items.some(
      (item: any) => item?.type === "CMPlaceholder",
    );

    if (!hasPlaceholder) return widget;

    return {
      ...widget,
      widgetName: "globalSearchResultList",
      widgetValue: [searchData] as IWidgetModel["widgetValue"],
    };
  });

  return { ...layout, widgets };
}
