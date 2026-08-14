import { SessionData } from "@/lib/session";
import { LoginResultCode } from "./LoginResultCode";

export interface ILoginResponse extends SessionData {
  resultCode: LoginResultCode;
  message: string;
}
