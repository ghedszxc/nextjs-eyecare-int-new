"use client";

import { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";
import React from "react";
import PageLoading from "@/components/PageLoading";
import styles from "./NavigationLoader.module.css";

/**
 * Shows the page loader while the enclosing `<Link>` navigation is pending.
 *
 * The newsroom is the one part of the app without a `loading.tsx`: a Suspense
 * boundary there would let the shell flush before the page runs, pinning the
 * response at HTTP 200 and turning its `notFound()` calls into soft 404s (see
 * src/components/PageLoading.tsx). This restores the same feedback purely on the
 * client, where it cannot affect status codes.
 *
 * It has to render inside a `<Link>` because that is the state `useLinkStatus`
 * reads, but the loader is portalled to `<body>` so it overlays the page instead
 * of being laid out inside the link.
 */
export default function NavigationLoader() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return createPortal(
    <div className={styles.overlay}>
      <PageLoading />
    </div>,
    document.body,
  );
}
