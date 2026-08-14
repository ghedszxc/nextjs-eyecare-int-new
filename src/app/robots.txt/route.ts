import { NextRequest } from "next/server";
import { isProductionHost } from "@/lib/utilities";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || url.host;
  const protocol =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(/:$/, "");

  const contents = isProductionHost(host)
    ? `User-Agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${protocol}://${host}/sitemap.xml`
    : `User-Agent: *\nDisallow: /`;

  const response = new Response(contents, {
    status: 200,
    statusText: "ok",
  });

  // `set`, not `append`: Response already defaults to text/plain, so appending
  // produced the duplicated `text/plain;charset=UTF-8, text/plain`.
  response.headers.set("content-type", "text/plain");
  return response;
}
