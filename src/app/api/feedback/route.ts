import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getClientIp, isSameOrigin, readJsonBody, UUID_RE } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";
import { getVisitorId } from "@/lib/visitorAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!rateLimit(`feedback-ip:${getClientIp(req)}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again a little later." },
      { status: 429 }
    );
  }

  const body = await readJsonBody(req, 4_000);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { rating, message, requestId, website } = body;

  if (typeof website !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: pretend success to bots, store nothing.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "Please choose a star rating." }, { status: 400 });
  }

  if (typeof message !== "string") {
    return NextResponse.json({ error: "Please write a short message." }, { status: 400 });
  }

  const trimmed = message.trim();
  if (trimmed.length < 3 || trimmed.length > 1_000) {
    return NextResponse.json(
      { error: "Your message should be between 3 and 1000 characters." },
      { status: 400 }
    );
  }

  if (typeof requestId !== "string" || !UUID_RE.test(requestId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Trusted identity from the signed cookie.
  const visitorId = await getVisitorId();
  if (!visitorId) {
    return NextResponse.json(
      { error: "Please enter your name at the start of the story first." },
      { status: 401 }
    );
  }

  if (!rateLimit(`feedback-visitor:${visitorId}`, 3, 60 * 60_000)) {
    return NextResponse.json(
      { error: "You've sent a few messages already. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { error } = await getSupabaseAdmin().from("feedback").insert({
      rating,
      message: trimmed,
      session_id: visitorId,
      request_id: requestId,
    });

    if (error) {
      // Same requestId again (double tap / retry): already saved, so it's a success.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, duplicate: true });
      }

      console.error("Feedback insert failed:", error.message);
      return NextResponse.json(
        { error: "Could not save your message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}