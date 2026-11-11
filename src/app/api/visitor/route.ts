import { after, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getClientIp, isSameOrigin, readJsonBody } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";
import { normalizeVisitorName } from "@/lib/visitorName";
import {
  VISITOR_COOKIE,
  createVisitorToken,
  getVisitorId,
  isVisitorAuthConfigured,
  visitorCookieOptions,
} from "@/lib/visitorAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEW_VISITORS_PER_HOUR = 300;
const noStore = { "Cache-Control": "no-store" };

function withClearedCookie(res: NextResponse): NextResponse {
  res.cookies.set(VISITOR_COOKIE, "", {
    ...visitorCookieOptions(),
    maxAge: 0,
  });
  return res;
}

/** Is this browser already a known visitor? */
export async function GET(req: Request) {
  if (!rateLimit(`visitor-get:${getClientIp(req)}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const id = await getVisitorId();
  if (!id) {
    return NextResponse.json({ known: false }, { headers: noStore });
  }

  try {
    const db = getSupabaseAdmin();

    const { data, error } = await db
      .from("visitors")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("visitor lookup failed:", error.message);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    // Signed cookie for a visitor that no longer exists: treat as new.
    if (!data) {
      return withClearedCookie(
        NextResponse.json({ known: false }, { headers: noStore })
      );
    }

    // Refresh last_seen_at at most every 5 minutes, after responding.
    after(async () => {
      try {
        const cutoff = new Date(Date.now() - 5 * 60_000).toISOString();
        await db
          .from("visitors")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", id)
          .lt("last_seen_at", cutoff);
      } catch (err) {
        console.error("visitor touch failed:", err);
      }
    });

    return NextResponse.json(
      { known: true, name: data.name },
      { headers: noStore }
    );
  } catch (err) {
    console.error("visitor GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Create a visitor from the name screen. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!rateLimit(`visitor-post:${getClientIp(req)}`, 10, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many tries. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  if (!isVisitorAuthConfigured()) {
    console.error("VISITOR_COOKIE_SECRET is missing or shorter than 32 characters");
    return NextResponse.json(
      { error: "The Batcave isn't ready yet. Please try again later." },
      { status: 500 }
    );
  }

  const body = await readJsonBody(req, 1_000);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real people never fill this.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = normalizeVisitorName(body.name);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = getSupabaseAdmin();

    // Already a known visitor? Never overwrite or duplicate.
    const existingId = await getVisitorId();
    if (existingId) {
      const { data: existing } = await db
        .from("visitors")
        .select("id, name")
        .eq("id", existingId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { known: true, name: existing.name, created: false },
          { headers: noStore }
        );
      }
    }

    // Database-backed global cap (works even when Vercel instances don't share memory).
    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count, error: countError } = await db
      .from("visitors")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);

    if (countError) {
      console.error("visitor count failed:", countError.message);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    if ((count ?? 0) >= NEW_VISITORS_PER_HOUR) {
      return NextResponse.json(
        { error: "The Batcave is busy right now. Please try again in a little while." },
        { status: 429 }
      );
    }

    const { data, error } = await db
      .from("visitors")
      .insert({ name: parsed.name })
      .select("id, name")
      .single();

    if (error || !data) {
      console.error("visitor insert failed:", error?.message);
      return NextResponse.json(
        { error: "Couldn't save your name. Please try again." },
        { status: 500 }
      );
    }

    const token = createVisitorToken(data.id);
    if (!token) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const res = NextResponse.json(
      { known: true, name: data.name, created: true },
      { status: 201, headers: noStore }
    );
    res.cookies.set(VISITOR_COOKIE, token, visitorCookieOptions());
    return res;
  } catch (err) {
    console.error("visitor POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** "Not me": forget this browser. The old visitor row is kept. */
export async function DELETE(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return withClearedCookie(
    NextResponse.json({ ok: true }, { headers: noStore })
  );
}