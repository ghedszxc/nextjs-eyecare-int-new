import { requireAuth } from "@/lib/auth";
import React, { PropsWithChildren } from "react";

export default async function GlobalSearchLayout({
  children,
}: PropsWithChildren) {
  await requireAuth(["search"] as unknown as string[]);

  return <>{children}</>;
}
