"use client";

import { useEffect, useState } from "react";
import { getAkamayUrl } from "@/lib/utilities";
import useResponsive from "./useResponsive";

const useResponsiveBackground = (
  media: string[] | string,
  getAkamay: boolean = true,
): [
  background: string | undefined,
  getResponsiveBackground: (
    media: string[] | string,
    getAkamay?: boolean,
  ) => string | undefined | null
] => {
  // Hooks
  const { is } = useResponsive();
  const [background, setBackground] = useState<string | undefined>(undefined);

  // Effects
  useEffect(() => {
    if (media.length === 1) {
      setBackground(getAkamay ? getAkamayUrl(media[0]) : media[0]);
      return;
    }

    setBackground(
      getAkamay
        ? getAkamayUrl(media[is("mobile-xl", "<") ? 1 : 0])
        : media[is("mobile-xl", "<") ? 1 : 0]
    );
  }, [media, getAkamay, is]);

  const getResponsiveBackground = (
    media: string[] | string,
    getAkamay: boolean = true,
  ) => {
    if (media?.length === 3) {
      let bgIndex = 0;
      if (is("tablet", ">")) bgIndex = 1;
      if (is("mobile-xl", "<")) bgIndex = 2;
      return getAkamay ? getAkamayUrl(media[bgIndex]) : media[bgIndex];
    }

    if (media.length === 1) {
      return getAkamay ? getAkamayUrl(media[0]) : media[0];
    }

    return getAkamay
      ? getAkamayUrl(media[is("mobile-xl", "<") ? 1 : 0])
      : media[is("mobile-xl", "<") ? 1 : 0];
  };

  return [background, getResponsiveBackground];
};

export default useResponsiveBackground;