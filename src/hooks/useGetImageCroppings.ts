// Modules
import IMAGE_CROPPINGS from "@/lib/constants/IMAGE_CROPPINGS";
import { getAkamayUrl } from "@/lib/utilities";
import { ICrops } from "@/models/ICrops";

export interface IUseGetImageCroppings {
  crops: ICrops;
  uriTemplate: string;
  type: "components" | "widgets";
  name: string;
  url?: string;
}

type Breakpoint = "xs" | "sm" | "md" | "lg" | "md" | "xl" | "initial";

type TReturn = { [key in Breakpoint]: string };

const useGetImageCroppings = ({
  crops,
  uriTemplate,
  type,
  name,
  url,
}: IUseGetImageCroppings): TReturn => {
  
  // Functions
  const getUriTemplate = (breakpoint: Breakpoint): string => {
    const cropName =
      IMAGE_CROPPINGS?.[type]?.[name]?.[breakpoint]?.toString() || "";

    if (cropName === "default") return url || "";

    const width = crops?.[cropName];

    if (width === undefined) return "";

    const template: string =
      uriTemplate
        ?.replace("{cropName}", cropName)
        ?.replace("{width}", width.toString()) || "";

    return getAkamayUrl(template);
  };

  if (!type || !name)
    return { initial: "", lg: "", md: "", sm: "", xl: "", xs: "" };

  return {
    initial: getUriTemplate("initial") || url || "",
    xs: getUriTemplate("xs") || url || "",
    sm: getUriTemplate("sm") || url || "",
    md: getUriTemplate("md") || url || "",
    lg: getUriTemplate("lg") || url || "",
    xl: getUriTemplate("xl") || url || "",
  };
};

export default useGetImageCroppings;
