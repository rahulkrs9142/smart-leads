import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole, AuthenticatedRequest } from '../types';

const TEST_SECRET = 'test_super_secret_jwt_key_123456';
process.env.JWT_SECRET = TEST_SECRET;

test('Auth Middleware & JWT Suite', async (t) => {
  await t.test('rejects request when no Authorization header is present', () => {
    let statusCode: number | null = null;
    let jsonResponse: unknown = null;
    let nextCalled = false;

    const req = { headers: {} } as unknown as AuthenticatedRequest;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: unknown) {
        jsonResponse = data;
        return this;
      },
    } as any;
    const next = () => {
      nextCalled = true;
    };

    authenticate(req, res, next);

    assert.equal(statusCode, 401);
    assert.equal((jsonResponse as any)?.success, false);
    assert.equal(nextCalled, false);
  });

  await t.test('rejects request when token format does not start with Bearer', () => {
    let statusCode: number | null = null;
    let jsonResponse: unknown = null;

    const req = {
      headers: { authorization: 'Basic dXNlcjpwYXNz' },
    } as unknown as AuthenticatedRequest;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: unknown) {
        jsonResponse = data;
        return this;
      },
    } as any;
    const next = () => {};

    authenticate(req, res, next);

    assert.equal(statusCode, 401);
    assert.equal((jsonResponse as any)?.success, false);
  });

  await t.test('rejects invalid or tampered JWT tokens', () => {
    let statusCode: number | null = null;
    let jsonResponse: unknown = null;

    const req = {
      headers: { authorization: 'Bearer invalid.tampered.token' },
    } as unknown as AuthenticatedRequest;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: unknown) {
        jsonResponse = data;
        return this;
      },
    } as any;
    const next = () => {};

    authenticate(req, res, next);

    assert.equal(statusCode, 401);
    assert.equal((jsonResponse as any)?.message, 'Invalid token. Please login again.');
  });

  await t.test('accepts valid JWT token and sets req.user payload', () => {
    const payload = {
      id: 'user123',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: UserRole.SALES,
    };
    const validToken = jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' });

    let nextCalled = false;
    const req = {
      headers: { authorization: `Bearer ${validToken}` },
    } as unknown as AuthenticatedRequest;
    const res = {} as any;
    const next = () => {
      nextCalled = true;
    };

    authenticate(req, res, next);

    assert.equal(nextCalled, true);
    assert.equal(req.user?.id, 'user123');
    assert.equal(req.user?.role, UserRole.SALES);
  });

  await t.test('RBAC authorize middleware permits user with allowed role', () => {
    let nextCalled = false;
    const req = {
      user: {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      },
    } as unknown as AuthenticatedRequest;
    const res = {} as any;
    const next = () => {
      nextCalled = true;
    };

    const adminOnly = authorize(UserRole.ADMIN);
    adminOnly(req, res, next);

    assert.equal(nextCalled, true);
  });

  await t.test('RBAC authorize middleware forbids user without required role', () => {
    let statusCode: number | null = null;
    let jsonResponse: unknown = null;
    let nextCalled = false;

    const req = {
      user: {
        id: 'sales1',
        name: 'Sales Rep',
        email: 'sales@example.com',
        role: UserRole.SALES,
      },
    } as unknown as AuthenticatedRequest;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: unknown) {
        jsonResponse = data;
        return this;
      },
    } as any;
    const next = () => {
      nextCalled = true;
    };

    const adminOnly = authorize(UserRole.ADMIN);
    adminOnly(req, res, next);

    assert.equal(statusCode, 403);
    assert.equal((jsonResponse as any)?.success, false);
    assert.equal(nextCalled, false);
  });
});
