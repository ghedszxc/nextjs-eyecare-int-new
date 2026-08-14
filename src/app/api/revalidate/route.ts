import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CMS_TAG } from "@/graphql/cmsCache";

/**
 * On-demand cache invalidation endpoint for CoreMedia.
 *
 * Wire this to a CoreMedia publish/webhook so content edits flush the relevant
 * Data Cache entries immediately instead of waiting for the TTL window.
 *
 * Auth: send `Authorization: Bearer <REVALIDATE_SECRET>`.
 *
 * Body (JSON):
 *   { "tags": ["cms:header-footer:en_us"] }   // invalidate specific tag(s)
 *   { "tags": ["cms:header-footer"] }         // invalidate a whole domain
 *   { "all": true }                           // invalidate every CMS domain
 */

const ALL_DOMAIN_TAGS = Object.values(CMS_TAG);

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = req.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { revalidated: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { tags?: string[]; all?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const tags = body.all
    ? ALL_DOMAIN_TAGS
    : Array.isArray(body.tags)
      ? body.tags
      : [];

  if (!tags.length) {
    return NextResponse.json(
      { revalidated: false, message: "Provide `tags: string[]` or `all: true`" },
      { status: 400 },
    );
  }

  tags.forEach((tag) => revalidateTag(tag));

  return NextResponse.json({ revalidated: true, tags });
}
