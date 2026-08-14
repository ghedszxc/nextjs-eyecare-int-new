"use server";

import { cmsRepo } from "@/graphql/CMSRepo";
import {
  getAkamayUrl,
  isODMarketingUrl,
  isTruthyCmsSetting,
  isValidUrl,
  removeTrailingSemicolon,
} from "@/lib/utilities";

import crypto from "crypto";
import { redirect, RedirectType } from "next/navigation";
import { SessionData, sessionOptions } from "./session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { ILoginResponse } from "@/models/convergence/ILoginResponse";
import { LoginResultCode } from "@/models/convergence/LoginResultCode";
import { getSession } from "./auth";

/**
 * Add serverside actions here
 * example: form actions, etc.
 */
export default async function getMetaData(lang: string, path: string) {
  const cmsResp = await cmsRepo.getMetaData(
    `${process.env.NEXT_PUBLIC_CM_SEGMENT}${lang}`,
    path || "",
  );
  const data = cmsResp?.data?.content?.pageByPath;

  // Fetch meta data image by id
  const metaImageID = data?.settings?.MetaImg?.[0]?.replace(
    /Content\[coremedia:\/\/\/cap\/content\/|]/g,
    "",
  );

  let akamaiImageURL;
  if (metaImageID) {
    const metaImageResp = await cmsRepo.getFileLink(metaImageID);

    akamaiImageURL = metaImageResp?.data?.content?.content?.data?.uri
      ? getAkamayUrl(metaImageResp?.data?.content?.content?.data?.uri)
      : "";
  }

  return {
    title: data?.htmlTitle,
    description: data?.htmlDescription,
    metaDataImage: akamaiImageURL || "",
    // The MetaData query has always asked for this setting; it just was not read
    // anywhere, so editors flagging a page as noindex in CoreMedia had no effect.
    noIndexNoFollow: isTruthyCmsSetting(data?.settings?.noIndexNoFollow),
  };
}

// Auth Actions

// Encrypt password using AES-256-CBC
export async function encrypt(text: string) {
  const algorithm = process.env.ALGORITHM!;
  const key = Buffer.from(process.env.AES_KEY!, "base64");
  const iv = Buffer.from(process.env.AES_IV!, "base64");

  if (!process.env.AES_KEY || !process.env.AES_IV) {
    throw new Error("Server configuration error");
  }

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");

  encrypted += cipher.final("base64");

  return encrypted;
}

// Handle login form submission
export async function login(
  redirectTo: string | null,
  _prevState: string | undefined,
  formData: FormData,
) {
  if (!process.env.NEXT_PUBLIC_CONVERGENCE_API_URL) {
    throw new Error("Server configuration error");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const encryptedPassword = await encrypt(password);

  const requestPayload = JSON.stringify({
    siteKey: process.env.SITE_KEY!,
    userName: username,
    passwordEncrypted: encryptedPassword,
  });

  const body = new FormData();
  body.append("Request", requestPayload);

  const response = await fetch(process.env.NEXT_PUBLIC_CONVERGENCE_API_URL!, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data: ILoginResponse[] = await response.json();

  if (data[0].resultCode !== LoginResultCode.SUCCESS) {
    return JSON.stringify({ success: false, error: data[0].message });
  }

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  const auth = data[0];

  session.loginToken = auth.loginToken;
  session.userName = auth.userName;
  session.displayName = auth.displayName;
  session.emailAddress = auth.emailAddress;
  session.company = auth.company;
  session.userGroup = removeTrailingSemicolon(auth.userGroup);
  session.userIdentifier = auth.userIdentifier;

  await session.save();

  // redirect to the page the user was trying to access before login, or to home page if no redirectTo is provided
  redirect(redirectTo ? decodeURI(redirectTo) : "/", RedirectType.replace);
}

// Handle logout
export async function logout() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  session.destroy();

  redirect("/login", RedirectType.replace);
}

export async function generateContactLensesSSOUrl(
  targetUrl: string,
): Promise<string> {
  const session = await getSession();

  if (!session.userName) {
    throw new Error("User not authenticated");
  }

  if (!isValidUrl(targetUrl)) {
    throw new Error("Invalid target URL");
  }

  return `/api/sso/contact-lenses?url=${encodeURIComponent(targetUrl)}`;
}

export async function getPremiumVisionLink(link: string) {
  if (!link?.includes("premiumvision.com")) {
    return link;
  } else {
    const ssoUrl = await generateContactLensesSSOUrl(link);
    return ssoUrl;
  }
}

export async function generateODMarketingUrl(
  targetUrl: string,
): Promise<string> {
  const session = await getSession();

  if (!session.loginToken) {
    throw new Error("User not authenticated");
  }

  if (!isValidUrl(targetUrl)) {
    throw new Error("Invalid target URL");
  }

  if (!isODMarketingUrl(targetUrl)) {
    return targetUrl;
  }

  const url = new URL(targetUrl);
  url.searchParams.set("login", session.loginToken);
  return url.toString();
}
