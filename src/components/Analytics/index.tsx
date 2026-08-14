"use client";

// Modules
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import useIsSsr from "@/hooks/useIsSsr";

declare global {
  interface Window {
    utag_data: any;
    tealium_data2track: any;
    utag: any;
    TealiumConsentPrivacyLink: () => void;
    grecaptcha: { reset: () => void };
  }
}

type IAnalyticsProps = {
  pageType?: string;
  prop20?: string;
};

const Analytics: React.FC<IAnalyticsProps> = ({ pageType, prop20 }) => {
  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [userInteract, setUserInteract] = useState(false);

  const path = usePathname();
  const pathArr = (path || "").split("/")?.filter((path: string) => path);
  const isSsr = useIsSsr();

  // Effects
  useEffect(() => {
    if(loaded) return;
    if (!globalThis?.window) return;
    if (!globalThis?.window?.tealium_data2track) {
      window.tealium_data2track = [];
      window.utag_data = {
        Page_Language: "EN", // content language two-letter uppercase ISO 639-1 Eg. 'EN"
        Page_Country: "GB", // country ISO 2 uppercase i.e. 'IT', 'US', 'FR'
      };
    }

    globalThis?.window.tealium_data2track.push({
      id: "VirtualPage-View",
      Page_Language: "EN",
      Page_Country: "GB",
      Page_Type: pageType || "Static",
      Page_Section1: prop20 ? prop20?.replace(/ +/, "") : "Other",
      Page_Section2: pageType === "Error" ? "" : pathArr[0]?.replace(/-/g, "-") || "",
      Page_Platform: "CMS",
      Order_Currency: "USD",
      Page_DeviceType: "D", // M D T X
    });

    if (globalThis?.window) {
      window.TealiumConsentPrivacyLink = function () {
        location.href = "/privacy-notice/";
      };
    }

    setLoaded(true);
  }, [loaded, pageType, pathArr, prop20]);

  useEffect(() => {
    const callBack = () => {
      setUserInteract(true);
    }
    window.addEventListener("touchstart", callBack);
    window.addEventListener("mousemove", callBack);

    return () => {
      window.removeEventListener("touchstart", callBack);
      window.removeEventListener("mousemove", callBack);
    }
  }, []);

  return (
    <>
      {!isSsr && userInteract && (
        <>
          <div id="__tealiumGDPRecModal"></div>
          <Script src={`https://tags.tiqcdn.com/utag/luxottica/onesight/${process.env.NODE_ENV === "development" ? "qa" : "prod"}/utag.js`} defer />
        </>
      )}
    </>
  );
};
export default Analytics;
