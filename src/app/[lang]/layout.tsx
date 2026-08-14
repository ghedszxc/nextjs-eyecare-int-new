import { SessionProvider } from "@/components/Auth/SessionProvider";
import { getSession } from "@/lib/auth";
import { SessionData } from "@/lib/session";
import React, { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getSession();

  const sessionData: SessionData = {
    userName: session.userName,
    userGroup: session.userGroup,
    loginToken: session.loginToken,
    displayName: session.displayName,
    emailAddress: session.emailAddress,
    company: session.company,
    userIdentifier: session.userIdentifier,
  };

  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
}
