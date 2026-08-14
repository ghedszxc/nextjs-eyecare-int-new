import { ILayoutModel } from "@/models/ILayout.interface";
import { IWidgetModel } from "@/models/IWidget.interface";

type BlogLayoutOptions = {
  /** Widgets rendered ABOVE the article (e.g. a miniBanner). */
  before?: IWidgetModel[];
  /** Widgets rendered BELOW the article (e.g. related articles / more posts). */
  after?: IWidgetModel[];
  title?: string;
  description?: string;
};

/**
 * Builds the ILayoutModel for a blog detail page.
 *
 * The fetched article becomes the `blogPost` widget, wrapped in an array so it
 * matches the CMS widgetValue shape adapters expect (BlogPostAdapter reads
 * `source[0]`). Any other registered widget can be slotted in via `before` /
 * `after`, which is what makes the layout customizable.
 */
export function buildBlogLayout(
  article: unknown,
  options: BlogLayoutOptions = {},
): ILayoutModel {
  const { before = [], after = [], title = "", description = "" } = options;

  const blogPostWidget: IWidgetModel = {
    widgetName: "blogPost",
    // Mirror the CMS shape: adapters read widgetValue as an array of items.
    widgetValue: [article] as IWidgetModel["widgetValue"],
  };

  return {
    layoutType: "BlogLayout",
    widgets: [...before, blogPostWidget, ...after],
    title,
    description,
  };
}
