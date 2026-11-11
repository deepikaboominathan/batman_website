import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await getSupabaseAdmin().rpc("admin_stats", {
      active_seconds: 60,
    });

    if (error) {
      console.error("admin_stats failed:", error.message);
      return NextResponse.json({ error: "Could not load stats" }, { status: 500 });
    }

    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("stats error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}