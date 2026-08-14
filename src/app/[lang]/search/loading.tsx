/**
 * Loading UI for the gated global search page.
 *
 * Same reasoning as the catch-all segment: this route is behind the middleware
 * auth gate, so the soft 404 a Suspense boundary introduces is never crawler
 * visible. See src/components/PageLoading.tsx.
 */
export { default } from "@/components/PageLoading";
