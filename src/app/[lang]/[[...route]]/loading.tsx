/**
 * Loading UI for the gated CMS pages.
 *
 * Scoped to this segment on purpose. A `loading.tsx` creates a Suspense boundary
 * above the page, so the shell (and the HTTP status) is committed before the page
 * runs — `notFound()` can then only stream UI, leaving a 200 soft 404. That is
 * harmless here because middleware answers unauthenticated requests with a 307
 * before this segment ever renders, so no crawler sees the soft 404. The public
 * newsroom has no `loading.tsx` for exactly that reason: its 404s must be real.
 */
export { default } from "@/components/PageLoading";
