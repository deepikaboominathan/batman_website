
import "server-only";

import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { cookies } from "next/headers";

export const ADMIN_COOKIE = "maikey_admin";

export const SESSION_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    return null;
  }

  return secret;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
}

export function createAdminToken(): string | null {
  const secret = getSecret();

  if (!secret) return null;

  const expires = String(
    Math.floor(Date.now() / 1000) + SESSION_SECONDS
  );

  const signature = sign(expires, secret);

  return `${expires}.${signature}`;
}

export function verifyAdminToken(
  token?: string | null
): boolean {
  const secret = getSecret();

  if (!secret || !token) return false;

  const parts = token.split(".");

  if (parts.length !== 2) return false;

  const [expires, signature] = parts;

  if (!/^\d+$/.test(expires)) return false;

  if (!signature || !/^[A-Za-z0-9_-]+$/.test(signature)) {
    return false;
  }

  const expectedSignature = sign(expires, secret);

  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return false;
  }

  const expiration = Number(expires);

  return (
    Number.isSafeInteger(expiration) &&
    expiration > Math.floor(Date.now() / 1000)
  );
}

export function checkAdminPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;

  if (!password || typeof input !== "string") {
    return false;
  }

  const actual = createHash("sha256")
    .update(input)
    .digest();

  const expected = createHash("sha256")
    .update(password)
    .digest();

  return timingSafeEqual(actual, expected);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  return verifyAdminToken(token);
}
