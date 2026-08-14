import { ICta } from "@/models/ICta";
import { ICrops } from "../models/ICrops";
import { defaultLocale } from "@/middleware";
import { PictureProps } from "@digital-b2c/coreui-kit";
import { ITeaserLXCallToActionSetting } from "@/models/coremedia/ITeaserLXCallToActionSetting.interface";
import crypto from "crypto";
import moment from "moment";
import { LOCALES } from "./constants/LOCALIZATIONS";
import { ISubjectTaxonomy } from "@/models/coremedia/ISubjectTaxonomy";
import { ILocalSettings } from "@/models/coremedia/ILocalSettings.interface";

export const getAkamayUrl = (src: string) => {
  let url = "";

  if (src && src.length) {
    const basePath = process.env.AKAMAY_PATH;
    if (!basePath) return src;

    if (src.indexOf("data:") < 0) {
      if (src.indexOf(":/") >= 0) {
        const path = new URL(src);
        url = (basePath + "/" + path.pathname)
          .split("///")
          .join("/")
          .split("//")
          .join("/")
          .split(":/")
          .join("://");
      } else {
        url = (basePath + "/" + src)
          .split("///")
          .join("/")
          .split("//")
          .join("/")
          .split(":/")
          .join("://");
      }
    } else {
      url = src;
    }
  }

  return url;
};

interface IGetAdapterViewtype<T> {
  selected?: T;
  unselected?: T[];
}

export const getAdapterViewtype = (
  arr: { viewtype: string }[],
  viewtype: string,
): IGetAdapterViewtype<unknown> => {
  return {
    selected: arr?.find((item) => item.viewtype === viewtype),
    unselected: arr?.filter((item) => item.viewtype !== viewtype),
  };
};

export const getAdapterImage = (obj: []) => {
  return obj?.map((img: { data?: { uri: string } }) => img?.data?.uri);
};

export const localeSegmentRemoval = (segment: string = "") => {
  // Move to APP CONFIG
  const segmentLocale = segment?.substring(0, 6).replace(/eyi-/, "");
  if (segmentLocale === defaultLocale)
    return segment?.replace(
      `${process.env.NEXT_PUBLIC_CM_SEGMENT}${defaultLocale}`,
      "",
    );

  if (process.env.NEXT_PUBLIC_CM_SEGMENT) {
    return segment?.replace(process.env.NEXT_PUBLIC_CM_SEGMENT, "/");
  } else {
    return segment;
  }
};

export const getAnalyticsId = (
  placement?: string,
  level1?: string,
  level2?: string,
  level3?: string,
) => {
  if (placement === "Navigation") {
    placement = "MainNav";
  }
  return [
    "X_X",
    placement?.split(" ").join(""),
    level1?.split(" ").join(""),
    level2?.split(" ").join(""),
    level3?.split(" ").join(""),
  ]
    .filter((s) => !!s)
    .join("_");
};

export interface IAdapterCTAObj {
  callToActionHash?: string;
  callToActionText?: string;
  teaserTitle?: string;
  target?: {
    id?: string;
    type?: string;
    url?: string;
    teaserTitle?: string;
    teaserText?: string;
    title?: string;
    navigationPath?: {
      segment?: string;
    }[];
    pictures?: {
      uriTemplate?: string;
      alt?: string;
      data?: {
        uri?: string;
        contentType?: string;
      };
    }[];
    data?: {
      contentType: string;
      size: number;
      uri: string;
    };
  };
}

export const getAdapterCTA = (obj: IAdapterCTAObj[]): ICta[] => {
  return obj?.map((link: IAdapterCTAObj): ICta => {
    const hash = link?.callToActionHash;
    const isExternal = link?.target?.type === "CMExternalLink";

    // File download
    const isFileDownload = link?.target?.type === "CMDownload";

    if (isFileDownload) {
      return {
        label: link?.callToActionText || "",
        //  url: `/cap/content/${link?.target?.id}/`,
        url: getAkamayUrl(link?.target?.data?.uri ?? ""),
        isExternal: !!isFileDownload,
        isFileDownload: isFileDownload,
      };
    }

    // Normal Url
    const formattedPath =
      link?.target?.navigationPath
        ?.map((path: { segment?: string }) =>
          localeSegmentRemoval(path?.segment),
        )
        ?.join("/") ||
      link?.target?.url ||
      "";

    // Logo
    const logoSrc = getAkamayUrl(
      link?.target?.pictures?.[0]?.data?.uri ||
        link?.target?.pictures?.[0]?.uriTemplate ||
        "",
    );

    const logo = logoSrc
      ? {
          src: logoSrc,
          alt: link?.target?.pictures?.[0]?.alt || "logo",
        }
      : undefined;

    return {
      label: link?.callToActionText || link?.teaserTitle || "",
      url: isExternal
        ? `${link?.target?.url || ""}`
        : `${formattedPath}/${hash ? `#${hash}` : ""}` || "#",
      isExternal: isExternal,
      logo: logo,
    };
  });
};

export const isWithinDays = (rawDateString: string): boolean => {
  if (!rawDateString) return false;
  const cleaned = rawDateString.replace(/\[.*?\]\s*$/, "");
  const itemDate = moment.utc(cleaned);
  if (!itemDate.isValid()) return false;
  return itemDate.isAfter(moment.utc().subtract(30, "days")); // 30 days threshold for "new" items
};

interface RawPicture {
  data: { uri: string };
  uriTemplate: string;
  alt?: string;
}

export const getAdapterPictures = (
  pictures: RawPicture[],
): PictureProps | undefined => {
  if (!pictures || pictures.length === 0) {
    return undefined;
  }

  const getUrl = (pic: RawPicture) =>
    getAkamayUrl(pic?.data?.uri) || getAkamayUrl(pic?.uriTemplate) || "";

  const defaultPic = pictures[0];
  const defaultSrc = getUrl(defaultPic);

  if (!defaultSrc) return undefined;

  if (pictures.length === 1) {
    return {
      src: defaultSrc,
      alt: defaultPic.alt ?? "",
    };
  }

  const mobilePic = pictures[1] || defaultPic;
  const mobileSrc = getUrl(mobilePic) || defaultSrc;

  return {
    desktop: {
      src: defaultSrc,
      alt: defaultPic?.alt ?? "",
    },
    mobile: {
      src: mobileSrc,
      alt: mobilePic?.alt ?? defaultPic?.alt ?? "",
    },
  };
};

export interface IVideoRawData {
  data?: {
    uri?: string;
    dataUrl?: string;
  };
}
export const getAdapterVideoUrl = (data: IVideoRawData[]): string[] => {
  interface IData {
    data?: { uri?: string };
    dataUrl?: string;
  }

  return (
    data?.map((image: IData) => image?.data?.uri || image?.dataUrl || "") || []
  );
};

export const getCoreMediaUrl = (str: string) => {
  const prefix = "coremedia://";
  const internalLink = str.includes(prefix);
  let pathname = localeSegmentRemoval(
    str.replace(prefix + "/", "").replace(prefix, ""),
  );
  // if not footnote, add trailing slash for SEO
  if (pathname.charAt(0) !== "#" && pathname.slice(-1) !== "/") {
    pathname += internalLink ? "/" : "";
  }
  return internalLink ? window.location.origin + "/" + pathname : pathname;
};

export interface IGetAdapterCroppings {
  crops: ICrops;
  uriTemplate: string;
}

interface IRawCrops {
  name?: string;
  minWidth?: string | number;
}
export interface ICroppingsRawData {
  crops: IRawCrops[];
  uriTemplate?: string;
}

export const getAdapterCroppings = (
  pictures: ICroppingsRawData[],
): IGetAdapterCroppings[] => {
  return pictures?.map((story: ICroppingsRawData) => {
    const cropObj: ICrops = {};

    (story?.crops || []).forEach((crop: IRawCrops) => {
      const index: string = crop?.name || "";
      if (index) {
        cropObj[index] = crop?.minWidth || "";
      }
    });

    return {
      crops: cropObj,
      uriTemplate: story?.uriTemplate || "",
    };
  });
};

export const getVideoType = (
  videoUrl: string,
): "youtube" | "vimeo" | "mp4" | "unknown" => {
  if (
    /^(https?:\/\/)?(www\.)?youtube\.com/.test(videoUrl) ||
    /^(https?:\/\/)?(www\.)?youtu\.be/.test(videoUrl)
  ) {
    return "youtube";
  } else if (
    /^(https?:\/\/)?(www\.)?vimeo\.com/.test(videoUrl) ||
    /^(https?:\/\/)?(www\.)?player\.vimeo\.com/.test(videoUrl)
  ) {
    return "vimeo";
  } else if (videoUrl?.endsWith(".mp4")) {
    return "mp4";
  } else {
    return "unknown";
  }
};

export interface IGetURLMainLogoRawData {
  viewtype: string;
  data: {
    uri: string;
  };
}
export const getURLMainLogo = (items: IGetURLMainLogoRawData[]) => {
  let URLMainLogo;
  (items || []).forEach((element: IGetURLMainLogoRawData) => {
    if (element.viewtype === "OsLogo") {
      URLMainLogo = element.data.uri;
      return;
    }
  });
  return URLMainLogo;
};

export const removeCMTextHyphen = (str: string) => {
  return str === "-" || str === "<div>-</div>" || str === "<div><p>-</p></div>"
    ? ""
    : str;
};

// Removes trailing semicolons and any whitespace before them from a string
// Example: "Doctor Test; " becomes "Doctor Test"
export const removeTrailingSemicolon = (value: string): string => {
  return value.replace(/;\s*$/, "");
};

export interface CanAccessContentParams {
  userRole?: string;
  allowedRoles?: string[];
}

// Determines if a user has access to content based on their role and the allowed roles for the content
export const canAccessContent = ({
  userRole,
  allowedRoles,
}: CanAccessContentParams): boolean => {
  // Public content
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Restricted content but no user role
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
};

// Filters an array of teasable items based on the user's role and the allowed roles for each item's teaser targets
export const filterTeasableItemsByRole = (
  teaserLXCallToActionSettings: ITeaserLXCallToActionSetting[],
  userRole?: string,
): ITeaserLXCallToActionSetting[] => {
  return teaserLXCallToActionSettings
    .map((item) => {
      return {
        ...item,
        teaserTargets: (item.target as any)?.teaserTargets.filter(
          (teaserTarget: any) => {
            const allowedRoles =
              teaserTarget?.target?.subjectTaxonomy?.map((tag: any) =>
                tag?.value?.toLocaleLowerCase(),
              ) || [];

            return canAccessContent({
              userRole,
              allowedRoles,
            });
          },
        ),
      };
    })
    .filter((item) => (item.target as any)?.teaserTargets.length > 0);
};

type TagField = "name" | "value" | "externalReference";

interface HasTagOptions {
  /**
   * The tag value to match.
   */
  value?: string;
  /** Which field of the tag to compare. Default: externalReference */
  field?: TagField;
  /**
   * Only check tags under this parent.
   * Example: "Group Roles"
   */
  parentExternalReference?: string;
}

export const hasTagAccess = (
  tags: ISubjectTaxonomy[] | undefined,
  options: HasTagOptions,
): boolean => {
  const {
    value,
    field = "externalReference",
    parentExternalReference,
  } = options;

  // No user tags = public
  if (!tags?.length) {
    return true;
  }

  // Filter to the configured parent, if any
  const scopedTags = parentExternalReference
    ? tags.filter(
        (tag) =>
          tag.parent?.externalReference?.toLocaleLowerCase() ===
          parentExternalReference.toLocaleLowerCase(),
      )
    : tags;

  // User has no tags under this parent = public
  if (scopedTags.length === 0) {
    return true;
  }

  // User has tags under this parent, so enforce the check
  return scopedTags.some((tag) => tag[field] === value);
};

// export const filterDownloadsByRole = (
//   downloads: IDownload[],
//   userRole?: string,
// ): IDownload[] => {
//   return downloads.filter((download) => {
//     const allowedRoles =
//       download.subjectTaxonomy?.map((tag) => tag.value?.toLowerCase() ?? "") ??
//       [];

//     return canAccessContent({
//       userRole,
//       allowedRoles,
//     });
//   });
// };

/**
 * Formats a CoreMedia-style timestamp into a "dd Month yyyy" string.
 * Example: "2026-05-25T07:24:05Z[GMT]" -> "25 May 2026"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  // Strip non-standard zone annotation, e.g. "...Z[GMT]" -> "...Z"
  const cleaned = dateString.replace(/\[.*?\]\s*$/, "");
  const date = new Date(cleaned);

  if (isNaN(date.getTime())) return "";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};

// Recursively traverses a nested text node structure to find and return the first text content it encounters
// used in "textAsTree" fields in CoreMedia data
export const getFirstText = (node: any): string | null => {
  if (node._type === "Characters") {
    return node.data;
  }

  return node.children?.map(getFirstText).find(Boolean) ?? null;
};

// Concatenates all the segments of a navigation path into a single URL path string, removing any locale segments
export const formatNavigationPath = (
  navigationPath: [
    {
      segment: string;
    },
  ],
) => {
  return navigationPath
    ?.map((path) => path.segment)
    ?.join("/")
    .replace("eyi-ww", "");
};

export const extractParagraphs = (html: string) => {
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) =>
      match[1]
        // remove inner HTML tags
        .replace(/<[^>]+>/g, "")
        .trim(),
    )
    .filter(Boolean);

  return paragraphs
    .map((text, index) => {
      const isLast = index === paragraphs.length - 1;

      // remove trailing dots except last paragraph
      if (!isLast) {
        return text.replace(/[.。\s]+$/, "");
      }

      return text;
    })
    .join(". ");
};

export const base64UrlEncode = (input: string | Buffer): string => {
  const base64 = Buffer.isBuffer(input)
    ? input.toString("base64")
    : Buffer.from(input, "utf8").toString("base64");

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const isODMarketingUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "odmarketinghub.com" ||
      hostname.endsWith(".odmarketinghub.com")
    );
  } catch {
    return false;
  }
};

export const isPremiumVisionUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "premiumvision.com" ||
      hostname.endsWith(".premiumvision.com")
    );
  } catch {
    return false;
  }
};

export const appendODMarketingLogin = (
  targetUrl: string,
  loginToken?: string,
): string => {
  if (!loginToken || !isValidUrl(targetUrl) || !isODMarketingUrl(targetUrl)) {
    return targetUrl;
  }

  const url = new URL(targetUrl);
  url.searchParams.set("login", loginToken);
  return url.toString();
};

interface JWTPayload {
  sub: string;
  exp: number;
  iss: string;
}

export function generateContactLensesJWT(username: string): string {
  let privateKeyPem = process.env.CONTACT_LENSES_RSA_PRIVATE_KEY;

  if (!privateKeyPem) {
    throw new Error(
      "CONTACT_LENSES_RSA_PRIVATE_KEY environment variable is not set",
    );
  }

  // Handle escaped newlines if the key is stored with \\n instead of actual newlines
  privateKeyPem = privateKeyPem.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now + 660;

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload: JWTPayload = {
    sub: username,
    exp: expirationTime,
    iss: "lux",
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const message = `${encodedHeader}.${encodedPayload}`;

  // Create a private key object that works with the sign algorithm
  const privateKey = crypto.createPrivateKey({
    key: privateKeyPem,
    format: "pem",
  });

  const sign = crypto.createSign("sha256");
  sign.update(message, "utf8");
  const signatureBuffer = sign.sign(privateKey);
  const signature = base64UrlEncode(signatureBuffer);

  return `${message}.${signature}`;
}

// used for news, news search results and global search page
type PaginationConfig = {
  pageNum: string | number | undefined;
  pageLimit: number;
  firstPageLimit?: number;
  totalCount?: number;
};

export function getPagination({
  pageNum,
  pageLimit,
  firstPageLimit,
  totalCount,
}: PaginationConfig) {
  const parsedPage = Number(pageNum);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const limit = firstPageLimit && page === 1 ? firstPageLimit : pageLimit;

  const offset = firstPageLimit
    ? page === 1
      ? 0
      : firstPageLimit + (page - 2) * pageLimit
    : (page - 1) * pageLimit;

  let maxPage: number | undefined;

  if (typeof totalCount === "number") {
    maxPage = firstPageLimit
      ? totalCount <= firstPageLimit
        ? 1
        : 1 + Math.ceil((totalCount - firstPageLimit) / pageLimit)
      : Math.max(1, Math.ceil(totalCount / pageLimit));
  }

  return {
    page,
    limit,
    offset,
    maxPage,
    isPageExceeded: maxPage !== undefined && page > maxPage,
  };
}

export const sanitizeSearch = (value: string) => {
  if (value?.toLocaleLowerCase()?.trim() === "all") return "*";

  return value
    .replace(/&/g, "")
    .replace(/([+\-&|!(){}\[\]^"~*?:\\/])/g, "\\$1");
};

export function removeDefaultLocale(url: string) {
  const locale = url.split("/")?.[1];
  const currentLocale = LOCALES.find((item) => item === locale);
  return currentLocale === defaultLocale
    ? url.replace(`/${defaultLocale}`, "")
    : url;
}

export const buildUrl = (navigationPath?: { segment?: string }[]) =>
  navigationPath?.map((p) => localeSegmentRemoval(p.segment)).join("/") || "#";

/**
 * Returns true only for the production host. Dev/uat/preview/local
 * environments return false so they can be kept out of search indexes.
 */
export const isProductionHost = (host: string): boolean =>
  host.includes("luxotticaeyecare.luxottica.com") &&
  !host.includes("dev") &&
  !host.includes("uat") &&
  !host.includes("preview");

export const isPromotedToH1 = (settings: ILocalSettings) => {
  return Boolean(settings?.other_properties?.promoteToH1);
};

/**
 * Normalises a CoreMedia timestamp into an ISO 8601 UTC string, for sitemap
 * `<lastmod>` values and `article:published_time`.
 *
 * The CMS returns several shapes — `2026-08-04T01:20:53Z[GMT]`,
 * `2026-07-30T01:26Z[GMT]` and plain `2023-04-27T19:00:00Z`. Stripping only the
 * `Z[GMT]` suffix and appending `+00:00` turned the last shape into
 * `2023-04-27T19:00:00Z+00:00`, an invalid date that crawlers discard. Strip any
 * bracketed zone suffix and let Date normalise instead, returning null for
 * missing or unparseable values so the tag can be omitted rather than emitted
 * malformed.
 */
export const toIsoTimestamp = (raw?: string): string | null => {
  if (!raw) return null;

  const parsed = new Date(raw.replace(/\[[^\]]*\]\s*$/, "").trim());

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().replace(/\.\d{3}Z$/, "Z");
};

/**
 * Turns CMS rich text into a plain-text meta description.
 *
 * `AppConfig.stripHtml` needs `document`, so it is a no-op during server
 * rendering — metadata needs a server-safe version. Collapses markup, entities
 * and whitespace, then truncates on a word boundary so descriptions stay near
 * the length search engines actually display.
 */
export const toMetaDescription = (
  html?: string | null,
  maxLength = 160,
): string | undefined => {
  if (!html) return undefined;

  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return undefined;
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).replace(
    /[\s,;:.]+$/,
    "",
  )}…`;
};

/**
 * Reads a boolean CoreMedia page setting.
 *
 * Settings arrive as raw JSON, so a checkbox can surface as `true`, `"true"` or
 * a single-element array. Anything else is treated as unset, which keeps the
 * safe default for `noIndexNoFollow` (page stays indexable).
 */
export const isTruthyCmsSetting = (value: unknown): boolean => {
  const raw = Array.isArray(value) ? value[0] : value;

  return raw === true || String(raw).toLowerCase() === "true";
};
