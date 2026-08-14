import { cmsRepo } from "@/graphql/CMSRepo";
import { FOOTER_ITEMS } from "@/lib/constants/FOOTER";
import Footer from "@/widgets/Footer.widget";

/**
 * Server component that fetches the (cached) footer content and renders the
 * Footer. Use it at the bottom of any page so the footer stays consistent
 * and cached without duplicating the fetch/item-list on every page.
 *
 * Caching is transparent in the repo layer (see GraphQLRepo.requestCoreMedia).
 */
export default async function SiteFooter({ locale }: { locale: string }) {
  const footerResp = await cmsRepo.getFooter(locale, FOOTER_ITEMS);
  const isFalsyValue = !!footerResp.data.content.pageByPath;

  return isFalsyValue && <Footer data={footerResp?.data} />;
}
