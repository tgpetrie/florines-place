import "server-only";

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitEntries = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, maximum: number, windowMs: number) {
  const now = Date.now();
  const current = rateLimitEntries.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitEntries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  current.count += 1;
  if (current.count > maximum) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
}

export function requestIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
