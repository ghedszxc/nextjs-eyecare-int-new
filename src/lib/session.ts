import { SessionOptions } from "iron-session";

export interface SessionData {
  loginToken: string;
  userName: string;
  displayName: string;
  emailAddress: string;
  company: string;
  userGroup: string;
  userIdentifier: number;
}

/** Shared with the middleware auth gate, which checks for this cookie. */
export const SESSION_COOKIE_NAME = "convergence_session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    // maxAge: 10,
  },
};
