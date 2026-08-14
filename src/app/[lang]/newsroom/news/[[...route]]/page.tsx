import BlogLayout from "@/components/BlogLayout";
import { buildBlogLayout } from "@/components/BlogLayout/buildBlogLayout";
import GridLayout from "@/components/GridLayout";
import { jsonToLayoutAdapter } from "@/coremedia-integration/adapters/JsonToLayoutAdapter";
import { cmsRepo } from "@/graphql/CMSRepo";
import { getArticleContentById, getArticleList } from "@/lib/cms";
import { BLOG_WIDGETS, NEWS_PATH } from "@/lib/constants/BLOG_CONSTANT";
import getMetaData from "@/lib/server-actions";
import JsonLd from "@/components/JsonLd";
import {
  buildPageMetadata,
  getRequestOrigin,
  NOT_FOUND_METADATA,
} from "@/lib/seo";
import {
  buildArticleBreadcrumbSchema,
  buildNewsArticleSchema,
  buildSiteSchema,
} from "@/lib/structured-data";
import {
  canAccessContent,
  extractParagraphs,
  getAdapterPictures,
  getAkamayUrl,
  getPagination,
  toIsoTimestamp,
  toMetaDescription,
} from "@/lib/utilities";
import SiteFooter from "@/widgets/SiteFooter";
import SiteNavigation from "@/widgets/SiteNavigation";
import { NewsCardProps } from "@digital-b2c/coreui-kit";
import moment from "moment";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { getSession } from "@/lib/auth";

type Props = {
  params: Promise<{ lang: string; route: string[] }>;
  searchParams: Promise<{ pageNum: string }>;
};

// Metadata
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${resolvedParams.lang}`;

  const { limit, offset } = getPagination({
    pageNum: resolvedSearchParams?.pageNum,
    firstPageLimit: 10,
    pageLimit: 9,
  });

  // Metadata for news page (blogs: /newsroom/news)
  if (!resolvedParams.route || resolvedParams?.route?.length === 0) {
    // Metadata for blog page
    try {
      // Metadata for news page (blogs)
      const metadata = await getMetaData(
        resolvedParams?.lang,
        NEWS_PATH.join("/"),
      );

      if (resolvedSearchParams.pageNum) {
        const items = await getArticleList(
          cmLanguage,
          NEWS_PATH.join("/"),
          limit,
          offset,
        );

        const layoutData = jsonToLayoutAdapter.adapt(items);

        const totalCount = (
          (layoutData?.widgets?.find(
            (widget) => widget?.widgetName === "blog-card-grid",
          )?.widgetValue ?? []) as any[]
        ).find((value: any) => value.type === "CMQueryList")?.itemsPaged
          ?.totalCount;

        const { isPageExceeded } = getPagination({
          pageNum: resolvedSearchParams.pageNum,
          firstPageLimit: 10,
          pageLimit: 9,
          totalCount,
        });

        if (isPageExceeded) return NOT_FOUND_METADATA;
      }

      return await buildPageMetadata({
        htmlTitle: metadata.title,
        description: metadata.description,
        path: NEWS_PATH.join("/"),
        // Paginated listings self-canonicalise, so page 2 is not reported as a
        // duplicate of page 1.
        search: resolvedSearchParams?.pageNum
          ? `?pageNum=${resolvedSearchParams.pageNum}`
          : undefined,
        image: metadata.metaDataImage,
        noIndex: metadata.noIndexNoFollow,
      });
    } catch (err) {
      console.error(err);

      return NOT_FOUND_METADATA;
    }
  }

  const [tag, title, ...rest] = resolvedParams.route;

  if (!tag || !title || rest.length > 0) {
    return NOT_FOUND_METADATA;
  }

  const blogId = title.split("-")?.at(-1);
  const cmsResp = await getArticleContentById(blogId as string);

  if (!cmsResp || !cmsResp.data?.content) {
    return NOT_FOUND_METADATA;
  }

  const session = await getSession();

  const isAccessible = canAccessContent({
    allowedRoles:
      cmsResp?.data?.content?.content?.subjectTaxonomy
        ?.filter((tag: any) => tag?.parent?.value === "_GroupRoles")
        ?.map((tag: any) => tag?.value?.toLocaleLowerCase()) || [],
    userRole: session?.userGroup?.replaceAll(" ", "")?.toLocaleLowerCase(),
  });

  if (!isAccessible) return NOT_FOUND_METADATA;

  // Metadata for blog page (blog: /newsroom/news/{tag}/{article-title}-{id})
  try {
    const article = cmsResp?.data?.content?.content;

    const media: any[] = article?.media ?? [];
    const imageUri =
      media.find((item) => item?.data?.contentType?.startsWith?.("image/"))
        ?.data?.uri ?? media.find((item) => item?.data?.uri)?.data?.uri;

    return await buildPageMetadata({
      htmlTitle: article?.htmlTitle,
      // Articles frequently have no htmlDescription in the CMS, which left them
      // with no meta description at all; fall back to the teaser/detail copy.
      description:
        article?.htmlDescription ||
        toMetaDescription(
          article?.teaserText?.text || article?.detailText?.text,
        ),
      keywords: article?.keywords,
      path: [...NEWS_PATH, tag, title].join("/"),
      image: imageUri ? getAkamayUrl(imageUri) : undefined,
      type: "article",
      publishedTime: toIsoTimestamp(article?.extDisplayedDate),
    });
  } catch (err) {
    console.error(err);

    return NOT_FOUND_METADATA;
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { lang, route } = await params;
  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`;

  if (!route || route?.length === 0) {
    const { pageNum } = await searchParams;

    const url = {
      route: NEWS_PATH,
      locale: lang,
    };

    const { limit, offset } = getPagination({
      pageNum,
      firstPageLimit: 10,
      pageLimit: 9,
    });

    const cmsResp = await getArticleList(
      cmLanguage,
      NEWS_PATH.join("/"),
      limit,
      offset,
    );

    const layoutData = jsonToLayoutAdapter.adapt(cmsResp);

    const totalCount = (
      (layoutData?.widgets?.find(
        (widget) => widget?.widgetName === "blog-card-grid",
      )?.widgetValue ?? []) as any[]
    ).find((value: any) => value.type === "CMQueryList")?.itemsPaged
      ?.totalCount;

    const { isPageExceeded } = getPagination({
      pageNum,
      firstPageLimit: 10,
      pageLimit: 9,
      totalCount,
    });

    if (isPageExceeded) return notFound();

    if (!layoutData?.widgets?.length) notFound();

    const { origin: listingOrigin } = await getRequestOrigin();

    return (
      <div>
        {/* The newsroom is the crawlable entry point (home sits behind auth), so
            the site-level Organization/WebSite graph is emitted here too. */}
        {listingOrigin && <JsonLd data={buildSiteSchema(listingOrigin)} />}
        <SiteNavigation locale={lang} />
        <GridLayout data={layoutData} url={url as any} />
        <SiteFooter locale={lang} />
      </div>
    );
  }

  // Blog detail route: /newsroom/news/{tag}/{blog-title-id}
  const [tag, blogSlug, ...rest] = route;

  if (!tag || !blogSlug || rest.length > 0) notFound();

  const blogId = blogSlug.split("-").at(-1);

  const cmsResp = await getArticleContentById(blogId as string);

  const article = cmsResp?.data?.content?.content;

  if (!article) notFound();

  const session = await getSession();

  const isAccessible = canAccessContent({
    allowedRoles:
      article?.subjectTaxonomy
        ?.filter((tag: any) => tag?.parent?.value === "_GroupRoles")
        ?.map((tag: any) => tag?.value?.toLocaleLowerCase()) || [],
    userRole: session?.userGroup?.replaceAll(" ", "")?.toLocaleLowerCase(),
  });

  if (!isAccessible) return notFound();

  const url = {
    route,
    locale: lang,
  };

  const newsCmsResp = await cmsRepo.getLayoutData(
    cmLanguage,
    NEWS_PATH.join("/"),
  );

  const newsLayoutData = jsonToLayoutAdapter.adapt(newsCmsResp);

  const blogsValue = newsLayoutData?.widgets.find(
    (widget) => widget.widgetName === "blog-card-grid",
  )?.widgetValue;

  const relatedArticle = (blogsValue as any)
    ?.find((blog: any) => blog.type === "CMQueryList")
    ?.itemsPaged?.result?.filter?.((blog: any) => blog.id !== blogId)
    ?.slice(0, 3);

  // Build the (customizable) widget list around the fetched article.
  // Add/remove/reorder widgets here — anything registered in WidgetGenerator
  // works (miniBanner, blog-card-grid, relatedArticle, ...).
  const layoutData = buildBlogLayout(article, {
    title: article?.htmlTitle,
    description: article?.htmlDescription,
    before: [
      {
        widgetName: BLOG_WIDGETS.miniBanner,
        widgetValue: [
          /* banner content */
          {
            isSingleBlogPage: true,
            viewtype: "miniBannerTextLeft",
            teaserTitle1: "Back to News",
            media: [
              {
                data: {
                  uri: "/images/blog-miniBanner-bg.png",
                },
                uriTemplate: "/images/blog-miniBanner-bg.png",
                alt: "mesh gradient bg",
              },
            ],
            teaserIconSvg: [
              {
                uriTemplate: "/images/arrow-left-icon.png",
                alt: "arrow left icon",
                viewtype: "backSearchResult",
              },
            ],
            teaserLXCallToActionSettings: [
              {
                callToActionEnabled: false,
                callToActionText: "",
                style: "",
                target: {
                  type: "CMChannel",
                  title: "News",
                  name: "news",
                  navigationPath: [
                    {
                      segment: "eyi-ww",
                    },
                    {
                      segment: "newsroom",
                    },
                    {
                      segment: "news",
                    },
                  ],
                },
              },
            ],
            className: "single-news-miniBanner-textLeft",
          },
        ],
      },
    ],
    after: [
      {
        widgetName: BLOG_WIDGETS.relatedArticle,
        widgetValue: [
          {
            title: "MORE NEWS",
            items: relatedArticle.map((item: any) => {
              const isAccessible = canAccessContent({
                allowedRoles:
                  item?.subjectTaxonomy
                    ?.filter((tag: any) => tag?.parent?.value === "_GroupRoles")
                    ?.map((tag: any) => tag?.value?.toLocaleLowerCase()) || [],
                userRole: session?.userGroup
                  ?.replaceAll(" ", "")
                  ?.toLocaleLowerCase(),
              });

              return {
                type: !isAccessible ? "restricted" : undefined,
                id: item?.id,
                date: {
                  label: moment(item?.extDisplayedDate)?.format("D MMM YYYY"),
                  value: item?.extDisplayedDate,
                },
                description: !isAccessible
                  ? "You don't have permission to view this content. Contact support for access."
                  : extractParagraphs(item.teaserText.text),
                title: !isAccessible ? "Restricted" : item.teaserTitle,
                tag: item?.navigationPath?.[3]?.segment,
                cta: !isAccessible
                  ? undefined
                  : {
                      url: `/${item.navigationPath
                        .slice(1) // remove first item
                        .map((curr: any) => curr.segment)
                        .join("/")}-${item.id}`,
                      icon: "tiltedRightBlack",
                      isExternal: false,
                      label: "Read More",
                    },
                image: !isAccessible
                  ? {
                      src: "/images/restricted.png",
                      alt: "lock",
                    }
                  : getAdapterPictures(item.pictures),
              };
            }) as NewsCardProps[],
          },
        ],
      },
    ],
  });

  const { origin } = await getRequestOrigin();
  const articleUrl = origin
    ? new URL(`/${[...NEWS_PATH, tag, blogSlug].join("/")}/`, origin).toString()
    : undefined;

  const articleMedia: any[] = article?.media ?? [];
  const articleImageUri =
    articleMedia.find((item) => item?.data?.contentType?.startsWith?.("image/"))
      ?.data?.uri ?? articleMedia.find((item) => item?.data?.uri)?.data?.uri;

  return (
    <div>
      {/* Structured data needs an absolute URL, so it is skipped if the host is unknown */}
      {articleUrl && origin && (
        <>
          <JsonLd
            data={buildNewsArticleSchema({
              origin,
              url: articleUrl,
              article,
              imageUrl: articleImageUri
                ? getAkamayUrl(articleImageUri)
                : undefined,
            })}
          />
          <JsonLd
            data={buildArticleBreadcrumbSchema({
              origin,
              url: articleUrl,
              name: article?.teaserTitle || article?.title || "Article",
            })}
          />
        </>
      )}
      <SiteNavigation locale={lang} />
      <BlogLayout data={layoutData} url={url} />
      <SiteFooter locale={lang} />
    </div>
  );
}
