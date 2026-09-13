import test from 'node:test';
import assert from 'node:assert/strict';
import { errorHandler, notFound } from '../middleware/errorHandler';
import { Request, Response } from 'express';

test('Health & Error Handling Suite', async (t) => {
  await t.test('notFound handler responds with 404 and route details', () => {
    let statusCode: number | null = null;
    let jsonResponse: any = null;

    const req = {
      method: 'GET',
      originalUrl: '/api/non-existent-route',
    } as Request;

    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    } as unknown as Response;

    notFound(req, res);

    assert.equal(statusCode, 404);
    assert.equal(jsonResponse?.success, false);
    assert.ok(jsonResponse?.message?.includes('/api/non-existent-route'));
  });

  await t.test('errorHandler catches standard error with status 500', () => {
    let statusCode: number | null = null;
    let jsonResponse: any = null;

    const err = new Error('Database query failure');
    const req = {} as Request;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    } as unknown as Response;

    errorHandler(err, req, res, () => {});

    assert.equal(statusCode, 500);
    assert.equal(jsonResponse?.success, false);
    assert.equal(jsonResponse?.message, 'Database query failure');
  });

  await t.test('errorHandler formats duplicate key error code 11000 as 409', () => {
    let statusCode: number | null = null;
    let jsonResponse: any = null;

    const err: any = new Error('Duplicate key');
    err.code = 11000;
    err.keyValue = { email: 'duplicate@example.com' };

    const req = {} as Request;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    } as unknown as Response;

    errorHandler(err, req, res, () => {});

    assert.equal(statusCode, 409);
    assert.equal(jsonResponse?.success, false);
    assert.ok(jsonResponse?.message?.includes('email already exists'));
  });

  await t.test('errorHandler formats CastError as 400 Bad Request', () => {
    let statusCode: number | null = null;
    let jsonResponse: any = null;

    const err: any = new Error('Cast failed');
    err.name = 'CastError';

    const req = {} as Request;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    } as unknown as Response;

    errorHandler(err, req, res, () => {});

    assert.equal(statusCode, 400);
    assert.equal(jsonResponse?.success, false);
    assert.equal(jsonResponse?.message, 'Invalid ID format.');
  });
});
