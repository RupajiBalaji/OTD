import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server';

describe('Auth API Routes Integration Tests', () => {
  it('GET /health should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api-docs.json should return 200 and valid OpenAPI schema', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.0');
    expect(res.body.info.title).toContain('OTD');
  });

  it('POST /api/v1/auth/login with invalid payload should return 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register with missing fields should return 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
