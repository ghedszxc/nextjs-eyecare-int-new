import { jsonToLayoutAdapter } from "@/coremedia-integration/adapters/JsonToLayoutAdapter";
import { getLayoutData } from "@/lib/cms";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  buildPageMetadata,
  getRequestOrigin,
  getRobotsMeta,
  NOT_FOUND_METADATA,
} from "@/lib/seo";
import { buildSiteSchema } from "@/lib/structured-data";
import { IGNORED_PREFIXES } from "@/lib/constants/ROUTES";
import JsonLd from "@/components/JsonLd";
import getMetaData from "@/lib/server-actions";

// Auth
import { LoginForm } from "@/components/Auth/Login";
import { getSession, requireAuth } from "@/lib/auth";

// Components
import GridLayout from "@/components/GridLayout";
import SiteFooter from "@/widgets/SiteFooter";
import SiteNavigation from "@/widgets/SiteNavigation";

type Props = {
  params: Promise<{ lang: string; route: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  if (resolvedParams.route?.[0] === "login")
    return {
      title: "Login",
      robots: await getRobotsMeta(),
    } as Metadata;

  try {
    const path = resolvedParams?.route?.join("/");
    const metadata = await getMetaData(resolvedParams?.lang, path);

    return await buildPageMetadata({
      htmlTitle: metadata.title,
      description: metadata.description,
      path,
      image: metadata.metaDataImage,
      noIndex: metadata.noIndexNoFollow,
    });
  } catch (err) {
    console.error(err);

    return NOT_FOUND_METADATA;
  }
}

export default async function PageGenerator({ params }: Props) {
  const { route, lang } = await params;

  const authUser = await getSession();

  // If user is not authenticated and trying to access login page, show login form
  if (route && route?.[0] === "login" && Object.keys(authUser).length < 1)
    return <LoginForm />;

  // Ignore non-page requests
  if (route?.[0] && IGNORED_PREFIXES.includes(route[0])) {
    notFound();
  }
  // Protect all other pages. The middleware already turns away requests with no
  // session cookie (so crawlers get a real 307); this verifies the session is
  // actually valid and stays the security boundary.
  await requireAuth(route);

  // If user is authenticated and trying to access login page, redirect to home page
  if (route && route?.[0] === "login" && Object.keys(authUser).length > 0)
    return redirect("/");

  const url = {
    route: route,
    locale: lang,
  };

  // Fetch data from graphql. Memoized per request, so this reuses the query the
  // segment layout already issued for its existence check.
  const cmLanguage = `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`;
  const cmsResp = await getLayoutData(cmLanguage, (route || []).join("/"));

  const layoutData = jsonToLayoutAdapter.adapt(cmsResp);

  if (!layoutData?.widgets?.length) notFound();

  // Organization + WebSite belong on one page only, so they go on the home page.
  const isHome = !route || route.length === 0;
  const { origin } = isHome ? await getRequestOrigin() : { origin: undefined };

  return (
    <div>
      {isHome && origin && <JsonLd data={buildSiteSchema(origin)} />}
      <SiteNavigation locale={lang} />
      <GridLayout data={layoutData} url={url} />
      <SiteFooter locale={lang} />
    </div>
  );
}
