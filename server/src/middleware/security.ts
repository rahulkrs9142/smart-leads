import { Request, Response, NextFunction } from 'express';

/**
 * Security headers middleware
 * Enforces baseline HTTP security headers to protect against common web vulnerabilities
 */
export const securityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Protect against clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Legacy XSS filter activation
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information sent in HTTP requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Enforce HTTPS in production via HSTS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Remove default Express fingerprinting
  res.removeHeader('X-Powered-By');

  next();
};
