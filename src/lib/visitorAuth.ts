import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { UUID_RE } from "@/lib/http";

export const VISITOR_COOKIE = "mk_visitor";
export const VISITOR_COOKIE_SECONDS = 60 * 60 * 24 * 180; // 180 days

function getSecret(): string | null {
  const secret = process.env.VISITOR_COOKIE_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
}

export function isVisitorAuthConfigured(): boolean {
  return getSecret() !== null;
}

function sign(visitorId: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`visitor:${visitorId}`)
    .digest("base64url");
}

/** Cookie value: "<visitorId>.<signature>" */
export function createVisitorToken(visitorId: string): string | null {
  const secret = getSecret();
  if (!secret || !UUID_RE.test(visitorId)) return null;
  return `${visitorId}.${sign(visitorId, secret)}`;
}

/** Returns the visitor id only if the signature is valid. */
export function parseVisitorToken(token?: string | null): string | null {
  const secret = getSecret();
  if (!secret || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [id, signature] = parts;
  if (!UUID_RE.test(id) || !signature) return null;

  const expected = Buffer.from(sign(id, secret));
  const actual = Buffer.from(signature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  return id.toLowerCase();
}

/** Trusted visitor id from the request cookie (never from the body). */
export async function getVisitorId(): Promise<string | null> {
  const store = await cookies();
  return parseVisitorToken(store.get(VISITOR_COOKIE)?.value);
}

export function visitorCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: VISITOR_COOKIE_SECONDS,
  };
}