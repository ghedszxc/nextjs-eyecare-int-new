import { ICtaLogo } from "@digital-b2c/coreui-kit";

export interface ICta extends ICtaLogo {
  isFileDownload?: boolean;
  dataDesc?: string;
}
