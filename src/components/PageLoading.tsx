"use client";

import { PageLoader } from "@digital-b2c/coreui-kit";
import Image from "next/image";
import React from "react";

/**
 * Route loading fallback.
 *
 * Mounted only from segments where a Suspense boundary is safe to add — see the
 * `loading.tsx` files that re-export it. A boundary above a page lets the shell
 * flush before the page runs, which pins the response at HTTP 200 and turns
 * `notFound()` into a soft 404, so the public newsroom deliberately has none.
 */
export default function PageLoading() {
  return (
    <PageLoader>
      <PageLoader.Logo>
        <Image
          width={314}
          height={40}
          src="/images/logo-luxottica-2022-png-data.png"
          alt="el eyecare logos"
          unoptimized
        />
      </PageLoader.Logo>
    </PageLoader>
  );
}
