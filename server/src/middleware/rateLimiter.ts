import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
}

/**
 * In-memory sliding window rate limiter middleware
 * Safeguards auth routes against brute-force and DDoS attacks
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;
  const ipStore = new Map<string, RateLimitRecord>();

  // Periodic cleanup of expired records every 5 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    // Determine client IP
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const existingRecord = ipStore.get(clientIp);

    if (!existingRecord || now > existingRecord.resetTime) {
      ipStore.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      next();
      return;
    }

    if (existingRecord.count >= max) {
      const retryAfterSeconds = Math.ceil((existingRecord.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(existingRecord.resetTime / 1000));

      res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSeconds,
      });
      return;
    }

    existingRecord.count += 1;
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - existingRecord.count);
    res.setHeader('X-RateLimit-Reset', Math.ceil(existingRecord.resetTime / 1000));
    next();
  };
};

/**
 * Pre-configured rate limiter for authentication routes
 * 30 attempts per 15 minutes
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
});
