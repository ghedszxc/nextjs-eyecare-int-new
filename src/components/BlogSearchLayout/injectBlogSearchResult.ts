import { ILayoutModel } from "@/models/ILayout.interface";
import { IWidgetModel } from "@/models/IWidget.interface";

/**
 * Takes an already-adapted CMS layout (from jsonToLayoutAdapter) and swaps the
 * placement that contains the "Search result list" CMPlaceholder for a live
 * `blog-search-results-list` widget populated with fetched search data.
 *
 * The CMS only marks WHERE the results go (a CMPlaceholder with no live data);
 * the actual results are fetched at request time and injected here. Every other
 * widget in the layout (miniBanner, etc.) is left untouched so GridLayout keeps
 * rendering them straight from the CMS.
 */
export function injectBlogSearchResults(
  layout: ILayoutModel,
  searchData: unknown,
  placeholderTitle?: string,
): ILayoutModel {
  const widgets = layout.widgets.map((widget) => {
    const items = Array.isArray(widget.widgetValue) ? widget.widgetValue : [];

    const hasSearchResultsPlaceholder = items.some(
      (item: any) =>
        item?.type === "CMPlaceholder" && item?.title === placeholderTitle,
    );

    if (!hasSearchResultsPlaceholder) return widget;

    return {
      ...widget,
      widgetName: "blog-search-results-list",
      // Mirror the CMS shape the adapter expects: an array whose first item is
      // BlogSearchResultsList-like ({ items, totalPages }).
      widgetValue: [searchData] as IWidgetModel["widgetValue"],
    };
  });

  return { ...layout, widgets };
}
