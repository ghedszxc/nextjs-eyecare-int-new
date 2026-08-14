import parse, { DOMNode, Element, HTMLReactParserOptions } from "html-react-parser";
import { getAkamayUrl, getCoreMediaUrl } from "@/lib/utilities";
import { META_IMAGES_NAMES } from "./constants/METATAGS";
import { TPadding } from "@/models/IPadding";
import { FORM_TRANSLATIONS } from "@/lib/constants/FORM_TRANSLATIONS";

const AppConfig = (() => {
  const specialCharMap: { [key: string]: string } = {
		'&lt;': '<',
		'&gt;': '>',
		'&amp;': '&',
		'&quot;': '"',
		'&apos;': "'"
	};

  const replaceSpecialCharsUsingMap = (str: string) => {
		return str.replace(/&lt;|&gt;|&amp;|&quot;|&apos;/g, (match) => specialCharMap[match]);
	}

  // URI Temp
  const setUriTemplates = (str: string = ""): string | null => {
    if (!str) return null;

    //set img tag src
    const imgTemplate = "data-uritemplate=";
    const imgRegex = new RegExp(`${imgTemplate}"(.+?)"`, "g");
    const imgs =
      str.match(imgRegex)?.map((match) => {
        return match.replace(imgTemplate, "").slice(1, -1);
      }) || [];

    for (let n = 0; n < imgs.length; n++) {
      const src = imgs[n].replace("{cropName}/{width}/", "");
      str = str.replace(
        `${imgTemplate}"${imgs[n]}"`,
        `src="${getAkamayUrl(src)}"`
      );
    }

    //set anchor tag href
    const anchorTemplate = "data-href=";
    const anchorRegex = new RegExp(`${anchorTemplate}"(.+?)"`, "g");
    const anchors =
      str.match(anchorRegex)?.map((match) => {
        return match.replace(anchorTemplate, "").slice(1, -1);
      }) || [];

    for (let n = 0; n < anchors.length; n++) {
      const rawHref = anchors[n].replace("eyi-", "");
      let href = rawHref?.replace("coremedia://", "");
      if (href.charAt(href.length - 1) !== "/") href += "/";
      str = str.replace(
        `${anchorTemplate}"${anchors[n]}"`,
        `href="${href}" target="_blank"`
      );
    }

    return str;
  };

  // Decode HTML Entities
  const decodeHTMLEntities = (str: string) => {
    const textArea = globalThis?.window?.document?.createElement("textarea");
    let convertedEntities = str;

    if (textArea) {
      textArea.innerHTML = str;
      convertedEntities = textArea.value;

      return convertedEntities;
    }

    return convertedEntities;
  };

  // Styled HTML Text
  const styledHTMLText = (str: string) => {
    const decodedEntities: string = decodeHTMLEntities(str || "");
    let convertedEntities = "";
    convertedEntities = decodedEntities
      .toString()
      .replace(
        /<iframe /g,
        "<div class='longtext-iframe' style='position: relative; width: 100%; padding-bottom: 56.326%'><iframe style='position: absolute; left: 0; top: 0; width: 100%; height: 100%;' "
      );
    convertedEntities = convertedEntities.replace(
      /<\/iframe>/g,
      "</iframe></div>"
    );
    convertedEntities = convertedEntities.replace(
      /<table>/g,
      "<div class='longtext-table' style='overflow-x: auto;'><table>"
    );
    convertedEntities = convertedEntities.replace(
      /<\/table>/g,
      "</table></div>"
    );

    return convertedEntities;
  };

  // HTML Parse
  const html = (str?: string) => {
    if (str?.trim() === "-") return "";
    const newLine = replaceSpecialCharsUsingMap(styledHTMLText(str || "") || "");
    const templated = setUriTemplates(newLine) || "";

    const options: HTMLReactParserOptions = {
      replace: (domNode: DOMNode) => {
        if (!(domNode instanceof Element)) return;
        const elementName = (domNode as { name: string }).name;
        // parse images
        if (elementName === "img" && domNode?.type === "tag") {
          const template = domNode?.attribs?.["data-uritemplate"];
          if (template) {
            const image = template.replace("{cropName}/{width}/", "");
            domNode.attribs["src"] = getAkamayUrl(image);
          }
        }

        // parse links and footnotes
        if (elementName === "a" && domNode?.type === "tag") {
          const template =
            domNode?.attribs?.["data-href"] || domNode?.attribs?.["href"];
          if (template) {
            // parse coremedia urls
            const href = getCoreMediaUrl((template || "").replace(/ww\//g, ""));

            domNode.attribs.className = "article-anchor";
            domNode.attribs["href"] = href;
          }

          if (
            domNode?.attribs?.href?.includes("localhost:3000") ||
            domNode?.attribs?.href?.includes("preview-dev-luxotticaeyecare.luxgroup.net") ||
            domNode?.attribs?.href?.includes("dev.essilorluxotticaeyecare.com") ||
            domNode?.attribs?.href?.includes("preview-uat-luxotticaeyecare.luxgroup.net") ||
            domNode?.attribs?.href?.includes("uat.essilorluxotticaeyecare.com") ||
            domNode?.attribs?.href?.includes("preview-elec.luxgroup.net") ||
            domNode?.attribs?.href?.includes("www.essilorluxotticaeyecare.com")
          ) {
            domNode.attribs["target"] = "_self";
          } else {
            domNode.attribs["target"] = "_blank";
          }
        }

        return domNode;
      },
    };

    return parse(templated?.replace(/os-/g, ""), options);
  };

  // Placement Merger
  interface IData {
    placements: { viewtype: string }[];
  }
  const mergePlacement = (
    data: IData[],
    newViewType: string,
    viewTypeToMerge: string[]
  ) => {
    const dataWithId = data?.map((placement: IData) => ({
      ...placement,
    }));

    const ifFirstIndexAvailable = dataWithId?.find(
      (obj: IData) => obj?.placements[0]?.viewtype === viewTypeToMerge[0]
    );

    if (!ifFirstIndexAvailable) return null;

    const filteredData = dataWithId
      ?.filter((obj: IData) => {
        return viewTypeToMerge.includes(obj?.placements[0]?.viewtype);
      })
      ?.map((obj: object) => obj);

    return {
      placements: [
        {
          name: newViewType,
          viewtype: newViewType,
          items: filteredData,
        },
      ],
    };
  };

  // Get Meta Tags
  interface IMetaTagsData {
    placements: {
      items: { data?: { uri?: string }; html?: string }[];
    }[];
  }
  interface IGetMetaTagsLinks {
    property: string;
    content: string;
    name: string;
  }
  const getMetaTagsLinks = (metaTagsData?: IMetaTagsData): IGetMetaTagsLinks[] => {
    try {
      const html = metaTagsData?.placements[0]?.items[0]?.html;
      const image = metaTagsData?.placements[0]?.items[1]?.data?.uri || "";

      const list = html?.split("<meta")?.map((link: string) => {
        const cleanupLink = link?.trim()?.replace(/\\n/g, "");

        const name = (cleanupLink?.split('name="')[1] || "")?.split('"')[0];
        const property = (cleanupLink?.split('property="')[1] || "")?.split(
          '"'
        )[0];

        const isImage = META_IMAGES_NAMES?.some(
          (itemName: string) => itemName === name || itemName === property
        );
        const content = !isImage
          ? (cleanupLink?.split('content="')[1] || "")?.split('"')[0]
          : getAkamayUrl(image || "");

        return { property, content, name };
      });

      list?.shift();

      return list || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  // Strip elements
  const stripHtml = (html: string) => {
    const tmp = globalThis?.window?.document?.createElement("DIV");

    if (!tmp) return html;

    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Get widget Paddings
  const getWidgetPadding = (padding: TPadding) => {
    if (padding === "top") {
      return "padding-bottom"
    } else if (padding === "bottom") {
      return "padding-top"
    } else {
      return ""
    }
  };

  // Get translated value by type
  const getTranslatedValue = (lang?: string, type?: string) => {
    if (!lang || !type) return "Missing lang or type";
    return FORM_TRANSLATIONS?.[lang]?.[type] || "";
  };

  return {
    html,
    mergePlacement,
    setUriTemplates,
    getMetaTagsLinks,
    stripHtml,
    styledHTMLText,
    getWidgetPadding,
    getTranslatedValue,
  };
})();

export default AppConfig;
