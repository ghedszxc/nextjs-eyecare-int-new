import { jsonToLayoutAdapter } from "@/coremedia-integration/adapters/JsonToLayoutAdapter";
import { getLayoutData } from "@/lib/cms";
import { requireAuth } from "@/lib/auth";
import { IGNORED_PREFIXES } from "@/lib/constants/ROUTES";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  params: Promise<{ lang: string; route?: string[] }>;
}>;

/**
 * Resolves "does this CMS page exist?" for the gated pages *above* the segment's
 * Suspense boundary.
 *
 * `loading.tsx` wraps page.tsx in Suspense, so by the time the page runs the
 * shell — and with it the HTTP status — is already committed, leaving
 * notFound() able to stream UI but not set a status: a 200 soft 404. A layout
 * renders outside that boundary, so throwing here answers a real 404 while the
 * loading skeleton still covers the page render.
 *
 * The read goes through the request-memoized wrapper in lib/cms, so page.tsx
 * reuses this query rather than issuing a second one.
 */
export default async function Layout({ children, params }: Props) {
  const { lang, route } = await params;
  const [firstSegment] = route ?? [];

  // The login page is served by this segment but has no CMS content of its own,
  // and page.tsx owns its session handling.
  if (firstSegment === "login") return <>{children}</>;

  if (firstSegment && IGNORED_PREFIXES.includes(firstSegment)) notFound();

  // Ahead of the CMS read for the same reason: a redirect issued from here is a
  // real 307, where page.tsx can only emit a 200 plus a meta refresh.
  await requireAuth(route);

  const cmsResp = await getLayoutData(
    `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`,
    (route ?? []).join("/"),
  );

  if (!jsonToLayoutAdapter.adapt(cmsResp)?.widgets?.length) notFound();

  return <>{children}</>;
}
