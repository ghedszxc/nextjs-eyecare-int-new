// Models
import { ILayoutModel } from "@/models/ILayout.interface";
import { IUrl } from "@/models/IUrl.interface";
import { IWidgetModel } from "@/models/IWidget.interface";

// Components
import WidgetGeneratorServer from "../WidgetGenerator/WidgetGenerator.server";
// import Analytics from "@/components/Analytics";

type Props = {
  data: ILayoutModel;
  url: IUrl;
  pageType?: string;
};

/**
 * BlogLayout renders a widget-driven blog detail page.
 *
 * Just like GridLayout it maps over `data.widgets`, but the widget list is
 * built on the server (see `buildBlogLayout`) instead of coming from a CMS
 * page. This lets us slot the fetched article (blogPost) alongside any other
 * registered widget (miniBanner, blog-card-grid, relatedArticle, ...).
 */
const BlogSearchLayout = ({ data, url, pageType }: Props) => {
  const widgetList = data?.widgets;

  return (
    <>
      <main>
        {widgetList?.map((widget: IWidgetModel, key: number) => (
          <section
            className={`${widget.widgetName}`}
            key={key}
            id={data?.settings?.PlacementsAutoFocus?.[key] || undefined}
          >
            <WidgetGeneratorServer
              {...widget}
              url={url}
              settings={data.settings}
              pageType={pageType}
              widgetContainerId={key}
            />
          </section>
        ))}
      </main>
      {/* <Analytics pageType={pageType} prop20={data?.title} /> */}
    </>
  );
};

export default BlogSearchLayout;
