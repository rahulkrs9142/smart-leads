import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Cache the OpenAPI spec in memory
const openApiSpecPath = path.join(__dirname, '../docs/openapi.json');
let openApiSpec: Record<string, unknown> | null = null;

try {
  if (fs.existsSync(openApiSpecPath)) {
    openApiSpec = JSON.parse(fs.readFileSync(openApiSpecPath, 'utf8'));
  }
} catch (err) {
  console.error('Error reading OpenAPI specification:', err);
}

/**
 * GET /api/docs/openapi.json
 * Returns raw OpenAPI 3.0 specification
 */
router.get('/openapi.json', (_req: Request, res: Response) => {
  if (!openApiSpec) {
    res.status(500).json({ success: false, message: 'OpenAPI specification not loaded' });
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(openApiSpec);
});

/**
 * GET /api/docs
 * Serves modern interactive API Documentation with interactive sandbox
 */
router.get('/', (_req: Request, res: Response) => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <title>SmartLeads API Reference & Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Interactive REST API Documentation for SmartLeads CRM & Lead Management System." />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><path d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>" />
    <style>
      body {
        margin: 0;
        background-color: #0b0f19;
        font-family: system-ui, -apple-system, sans-serif;
      }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/docs/openapi.json"
      data-proxy-url="https://proxy.scalar.com">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
});

export default router;
