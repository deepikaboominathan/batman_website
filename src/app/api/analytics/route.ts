import { after, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getClientIp, isSameOrigin, readJsonBody } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";
import { getVisitorId } from "@/lib/visitorAuth";

export const runtime = "nodejs";

const TYPES = new Set(["visit", "chapter_view", "heartbeat", "replay"]);

/** [max requests, window in ms] per visitor, per event type */
const LIMITS: Record<string, [number, number]> = {
  visit: [3, 60_000],
  chapter_view: [30, 60_000],
  heartbeat: [6, 60_000],
  replay: [10, 60_000],
};

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!rateLimit(`an-ip:${getClientIp(req)}`, 120, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Trusted identity comes from the signed cookie, never from the body.
  const sessionId = await getVisitorId();
  if (!sessionId) {
    return NextResponse.json({ error: "No visitor session" }, { status: 401 });
  }

  const body = await readJsonBody(req, 2_000);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { type, chapter } = body;

  if (typeof type !== "string" || !TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  let chapterValue: number | null = null;
  if (chapter !== undefined && chapter !== null) {
    if (
      typeof chapter !== "number" ||
      !Number.isInteger(chapter) ||
      chapter < 0 ||
      chapter > 8
    ) {
      return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });
    }
    chapterValue = chapter;
  }

  if (type === "chapter_view" && chapterValue === null) {
    return NextResponse.json({ error: "Chapter required" }, { status: 400 });
  }

  const [limit, windowMs] = LIMITS[type];
  if (!rateLimit(`an-${type}:${sessionId}`, limit, windowMs)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Respond immediately; write to the database after the response is sent.
  after(async () => {
    try {
      const { error } = await getSupabaseAdmin()
        .from("analytics_events")
        .insert({
          session_id: sessionId,
          event_type: type,
          chapter: chapterValue,
          path: "/",
        });

      if (error) console.error("analytics insert failed:", error.message);
    } catch (err) {
      console.error("analytics error:", err);
    }
  });

  // 204 = recorded, nothing to send back (intentional for fire-and-forget tracking).
  return new NextResponse(null, { status: 204 });
}