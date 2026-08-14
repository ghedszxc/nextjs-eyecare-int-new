import { cmsRepo } from "@/graphql/CMSRepo";
import Navigation from "@/widgets/Navigation.widget";

/**
 * Server component that fetches the (cached) header/footer navigation content
 * and renders the internal Navigation. Use it at the top of any page so the
 * navigation stays consistent without duplicating the fetch on every page.
 *
 * Caching is transparent in the repo layer (see GraphQLRepo.requestCoreMedia).
 */
export default async function SiteNavigation({ locale }: { locale: string }) {
  const navigationResp = await cmsRepo.getNavigation(locale);
  const isFalsyValue = !!navigationResp.data.content.pageByPath;

  return isFalsyValue && <Navigation data={navigationResp?.data} variant="internal" />;
}
