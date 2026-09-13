import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../middleware/rateLimiter';
import { securityHeaders } from '../middleware/security';
import { Request, Response } from 'express';

test('Security Middleware Suite', async (t) => {
  await t.test('securityHeaders sets expected defensive headers', () => {
    const headers: Record<string, string> = {};
    const removedHeaders: string[] = [];

    const req = {} as Request;
    const res = {
      setHeader(name: string, value: string) {
        headers[name] = value;
      },
      removeHeader(name: string) {
        removedHeaders.push(name);
      },
    } as unknown as Response;

    let nextCalled = false;
    securityHeaders(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.equal(headers['X-Frame-Options'], 'SAMEORIGIN');
    assert.equal(headers['X-XSS-Protection'], '1; mode=block');
    assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
    assert.ok(removedHeaders.includes('X-Powered-By'));
  });

  await t.test('rateLimiter permits requests within the threshold', () => {
    const limiter = createRateLimiter({
      windowMs: 60 * 1000,
      max: 3,
    });

    const headers: Record<string, any> = {};
    const req = {
      headers: {},
      socket: { remoteAddress: '192.168.1.50' },
    } as unknown as Request;

    const res = {
      setHeader(name: string, val: any) {
        headers[name] = val;
      },
    } as unknown as Response;

    let nextCount = 0;
    const next = () => {
      nextCount++;
    };

    // 1st request
    limiter(req, res, next);
    assert.equal(nextCount, 1);
    assert.equal(headers['X-RateLimit-Limit'], 3);
    assert.equal(headers['X-RateLimit-Remaining'], 2);

    // 2nd request
    limiter(req, res, next);
    assert.equal(nextCount, 2);
    assert.equal(headers['X-RateLimit-Remaining'], 1);
  });

  await t.test('rateLimiter blocks requests exceeding the threshold with 429', () => {
    const limiter = createRateLimiter({
      windowMs: 60 * 1000,
      max: 2,
      message: 'Rate limit exceeded for testing',
    });

    const headers: Record<string, any> = {};
    let statusCode: number | null = null;
    let jsonResponse: any = null;

    const req = {
      headers: {},
      socket: { remoteAddress: '192.168.1.99' },
    } as unknown as Request;

    const res = {
      setHeader(name: string, val: any) {
        headers[name] = val;
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    } as unknown as Response;

    let nextCount = 0;
    const next = () => {
      nextCount++;
    };

    // 1st request (ok)
    limiter(req, res, next);
    // 2nd request (ok)
    limiter(req, res, next);
    assert.equal(nextCount, 2);

    // 3rd request (exceeds limit)
    limiter(req, res, next);
    assert.equal(nextCount, 2); // next should not be called
    assert.equal(statusCode, 429);
    assert.equal(jsonResponse?.success, false);
    assert.equal(jsonResponse?.message, 'Rate limit exceeded for testing');
    assert.ok(headers['Retry-After'] > 0);
  });
});
