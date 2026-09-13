import test from 'node:test';
import assert from 'node:assert/strict';
import { registerValidation, loginValidation } from '../validators/auth';
import { createLeadValidation } from '../validators/lead';
import { handleValidation } from '../middleware/validate';
import { Request } from 'express';
import { UserRole, LeadStatus, LeadSource } from '../types';

const createMockResponse = () => {
  const res: any = {
    statusCode: null as number | null,
    jsonResponse: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonResponse = data;
      return this;
    },
  };
  return res;
};

test('Request Validation Suite', async (t) => {
  await t.test('fails register validation when required fields are missing', async () => {
    const req = {
      body: {},
    } as unknown as Request;

    for (const validation of registerValidation) {
      await validation.run(req);
    }

    const res = createMockResponse();
    let nextCalled = false;

    handleValidation(req, res, () => {
      nextCalled = true;
    });

    assert.equal(res.statusCode, 400);
    assert.equal(res.jsonResponse?.success, false);
    assert.equal(nextCalled, false);
    assert.ok(res.jsonResponse?.errors?.length >= 3);
  });

  await t.test('passes register validation with valid payload', async () => {
    const req = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123',
        role: UserRole.SALES,
      },
    } as unknown as Request;

    for (const validation of registerValidation) {
      await validation.run(req);
    }

    const res = createMockResponse();
    let nextCalled = false;

    handleValidation(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null);
  });

  await t.test('fails login validation with invalid email format', async () => {
    const req = {
      body: {
        email: 'invalid-email-string',
        password: 'password123',
      },
    } as unknown as Request;

    for (const validation of loginValidation) {
      await validation.run(req);
    }

    const res = createMockResponse();
    handleValidation(req, res, () => {});

    assert.equal(res.statusCode, 400);
    const hasEmailError = res.jsonResponse?.errors?.some(
      (err: any) => err.field === 'email'
    );
    assert.equal(hasEmailError, true);
  });

  await t.test('fails lead creation with invalid source or status enum', async () => {
    const req = {
      body: {
        name: 'Lead Test',
        email: 'lead@test.com',
        source: 'Twitter', // Invalid source
        status: 'Pending', // Invalid status
      },
    } as unknown as Request;

    for (const validation of createLeadValidation) {
      await validation.run(req);
    }

    const res = createMockResponse();
    handleValidation(req, res, () => {});

    assert.equal(res.statusCode, 400);
    const sourceError = res.jsonResponse?.errors?.some((err: any) => err.field === 'source');
    const statusError = res.jsonResponse?.errors?.some((err: any) => err.field === 'status');
    assert.equal(sourceError, true);
    assert.equal(statusError, true);
  });

  await t.test('passes lead creation with valid enum attributes', async () => {
    const req = {
      body: {
        name: 'Lead Test Corp',
        email: 'lead@testcorp.com',
        source: LeadSource.WEBSITE,
        status: LeadStatus.QUALIFIED,
      },
    } as unknown as Request;

    for (const validation of createLeadValidation) {
      await validation.run(req);
    }

    const res = createMockResponse();
    let nextCalled = false;

    handleValidation(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null);
  });
});
