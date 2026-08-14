"use client"

export const HideWidget = (tags: string[], hash: string): boolean => {
  const normalizedHash = hash.replace("-", "");
  return !tags?.find((p: string) => normalizedHash === p);
};
