import ClientNotFound from "@/components/ClientNotFound";
import { headers } from "next/headers";
import { DEFAULT_LOCALE } from "@/lib/constants/LOCALIZATIONS";
import SiteNavigation from "@/widgets/SiteNavigation";
import SiteFooter from "@/widgets/SiteFooter";

export default async function NotFound() {
  const locale = (await headers()).get("x-locale") || DEFAULT_LOCALE;

  return (
    <>
      <SiteNavigation locale={locale} />
      <ClientNotFound />
      <SiteFooter locale={locale} />
    </>
  );
}
