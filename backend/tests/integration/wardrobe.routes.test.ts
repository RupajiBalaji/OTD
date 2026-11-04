import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server';

describe('Wardrobe API Routes Integration Tests', () => {
  it('GET /api/v1/wardrobe without auth token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/wardrobe');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/wardrobe without auth token should return 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/wardrobe')
      .send({ name: 'Cashmere Knit' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/wardrobe/:id without auth token should return 401 Unauthorized', async () => {
    const res = await request(app).delete('/api/v1/wardrobe/12345');
    expect(res.status).toBe(401);
  });
});
