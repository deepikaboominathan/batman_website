
type Bucket = {
  count: number;
  reset: number;
};

const buckets = new Map<string, Bucket>();

/**
 * Best-effort in-memory rate limiter.
 * Note: Vercel serverless instances do not share memory.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  // Remove expired entries periodically.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.reset <= now) {
        buckets.delete(k);
      }
    }
  }

  const bucket = buckets.get(key);

  // Create a new bucket or reset an expired bucket.
  if (!bucket || bucket.reset <= now) {
    buckets.set(key, {
      count: 1,
      reset: now + windowMs,
    });

    return true;
  }

  // Reject requests exceeding the limit.
  if (bucket.count >= limit) {
    return false;
  }

  bucket.count++;

  return true;
}
