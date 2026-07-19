// Per-session/IP rate limiter for model-backed routes. In-memory prototype.
// Returns 429-worthy state; the route surfaces a real error, never a blank screen.

interface Bucket { count: number; resetAt: number; }
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

/** Returns true if the request is allowed. Call once per model-backed request with a stable key. */
export function allowRequest(key: string, now: number): boolean {
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}

// STUB (v2): move to a durable store (Upstash/Redis) so limits hold across serverless instances.
// In-memory buckets reset per cold start; fine for the demo, not for production scale.
