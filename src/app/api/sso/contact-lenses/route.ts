import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  generateContactLensesJWT,
  isPremiumVisionUrl,
  isValidUrl,
} from "@/lib/utilities";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session.userName) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "target or redirectUrl parameter is required" },
      { status: 400 },
    );
  }

  const url = targetUrl;

  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: "Invalid or missing target URL" },
      { status: 400 },
    );
  }

  if (!isPremiumVisionUrl(url)) {
    return NextResponse.json(
      { error: "Target URL is not an allowed SSO destination" },
      { status: 400 },
    );
  }

  try {
    const jwtToken = generateContactLensesJWT(session.userName);
    const redirectUri = new URL(url);
    redirectUri.searchParams.set("pvidp", "jwtsal");
    redirectUri.searchParams.set("jwt", jwtToken);

    return NextResponse.redirect(redirectUri.toString());
  } catch (error) {
    console.error("SSO JWT generation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate SSO token",
      },
      { status: 500 },
    );
  }
}
