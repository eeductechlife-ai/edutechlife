const request = require('supertest');
const express = require('express');
const app = require('../../app');

describe('GET /api/stripe/plans', () => {
  it('returns plans list', async () => {
    const res = await request(app).get('/api/stripe/plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.plans)).toBe(true);
    expect(res.body.plans.length).toBeGreaterThanOrEqual(3);
  });

  it('returns free plan first', async () => {
    const res = await request(app).get('/api/stripe/plans');
    expect(res.body.plans[0].id).toBe('free');
    expect(res.body.plans[0].price).toBe(0);
  });

  it('does not expose priceId for pro plan', async () => {
    const res = await request(app).get('/api/stripe/plans');
    const pro = res.body.plans.find((p) => p.id === 'pro');
    expect(pro).toBeDefined();
    expect(pro.priceId).toBeUndefined();
  });
});

describe('POST /api/stripe/create-checkout-session', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/stripe/create-checkout-session')
      .send({ planId: 'pro' });
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('token');
  });

  it('returns 401 with invalid auth token and no planId', async () => {
    const res = await request(app)
      .post('/api/stripe/create-checkout-session')
      .set('Authorization', 'Bearer invalid-token')
      .send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/stripe/webhook', () => {
  it('returns 200 without stripe configured', async () => {
    const res = await request(app)
      .post('/api/stripe/webhook')
      .set('Content-Type', 'application/json')
      .send({ type: 'checkout.session.completed' });
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });

  it('returns 200 for missing stripe config', async () => {
    const originalKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const res = await request(app)
      .post('/api/stripe/webhook')
      .set('Content-Type', 'application/json')
      .send({ type: 'checkout.session.completed' });

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);

    if (originalKey) process.env.STRIPE_SECRET_KEY = originalKey;
  });
});
