interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * In-memory sliding window rate limiter
 * Defaults to 5 requests per 60 seconds per identifier/IP
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): { success: boolean; remaining: number; resetSeconds: number } {
  // Allow high limit for local development loopback so automated test runs don't self-block
  const isLocal = identifier.includes("127.0.0.1") || identifier.includes("localhost");
  const effectiveLimit = isLocal && process.env.NODE_ENV !== "production" ? 150 : limit;

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: effectiveLimit - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (record.count >= effectiveLimit) {
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  record.count += 1;
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
  return {
    success: true,
    remaining: effectiveLimit - record.count,
    resetSeconds: Math.max(1, resetSeconds),
  };
}

/**
 * Extracts client IP from request headers
 */
export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
