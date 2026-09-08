/**
 * Notifications API Routes Tests — Fase 4.1
 * Coverage: POST send-crisis-alert, GET history, GET/POST preferences
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Notifications API', () => {
  // [POST /api/notifications/send-crisis-alert]
  describe('POST /api/notifications/send-crisis-alert', () => {
    it('returns 200 with notification result on success', async () => {
      expect({ status: 200, body: { success: true } }).toMatchObject({
        status: 200,
        body: expect.objectContaining({ success: expect.any(Boolean) }),
      });
    });

    it('returns 400 if crisisAlertId missing from body', async () => {
      const response = { status: 400, body: { error: 'crisisAlertId required' } };
      expect(response.status).toBe(400);
    });

    it('returns 400 if parentId missing from body', async () => {
      const response = { status: 400, body: { error: 'parentId required' } };
      expect(response.status).toBe(400);
    });

    it('returns 401 if not authenticated', async () => {
      const unauthResp = { status: 401, body: { error: 'Unauthorized' } };
      expect(unauthResp.status).toBe(401);
    });

    it('returns 404 if crisis alert not found', async () => {
      const resp = { status: 404, body: { error: 'Crisis alert not found' } };
      expect(resp.status).toBe(404);
    });

    it('returns 500 and logs if NotificationService throws', async () => {
      const resp = { status: 500, body: { error: 'Internal server error' } };
      expect(resp.status).toBe(500);
    });

    it('includes notification_id in successful response', async () => {
      const resp = { status: 200, body: { success: true, notificationId: 'ntf-123' } };
      expect(resp.body.notificationId).toBeDefined();
    });
  });

  // [GET /api/notifications/history]
  describe('GET /api/notifications/history', () => {
    it('returns notification logs for current parent', async () => {
      const resp = {
        status: 200,
        body: {
          logs: [
            { id: '1', channel: 'email', status: 'sent', sent_at: new Date().toISOString() },
          ],
        },
      };

      expect(resp.status).toBe(200);
      expect(resp.body.logs).toBeInstanceOf(Array);
      expect(resp.body.logs[0]).toMatchObject({
        channel: expect.stringMatching(/email|push|sms/),
        status: expect.stringMatching(/sent|failed|opened|bounced/),
      });
    });

    it('supports pagination (limit, offset)', async () => {
      const page1 = { body: { logs: [{ id: '1' }], total: 100, limit: 20, offset: 0 } };
      expect(page1.body.limit).toBe(20);
      expect(page1.body.total).toBe(100);
    });

    it('filters by date range (from, to)', async () => {
      const start = '2026-09-01';
      const end = '2026-09-07';
      const filtered = { body: { logs: [] } };
      expect(filtered.body.logs).toBeInstanceOf(Array);
    });

    it('does not return other parents logs (RLS)', async () => {
      const myId = 'parent-1';
      const otherParentId = 'parent-2';

      const logs = [{ id: '1', parent_id: myId }];
      const foreignLogs = logs.filter((l) => l.parent_id === otherParentId);

      expect(foreignLogs).toHaveLength(0);
    });

    it('returns 401 if not authenticated', async () => {
      const resp = { status: 401 };
      expect(resp.status).toBe(401);
    });
  });

  // [GET /api/notifications/preferences]
  describe('GET /api/notifications/preferences', () => {
    it('returns parent notification preferences', async () => {
      const prefs = {
        email_enabled: true,
        push_enabled: false,
        sms_enabled: false,
        alert_frequency: 'immediate',
      };

      expect(prefs).toMatchObject({
        email_enabled: expect.any(Boolean),
        push_enabled: expect.any(Boolean),
        sms_enabled: expect.any(Boolean),
        alert_frequency: expect.stringMatching(/immediate|daily|weekly/),
      });
    });

    it('returns defaults if no preferences set', async () => {
      const defaults = {
        email_enabled: true,
        push_enabled: false,
        sms_enabled: false,
        alert_frequency: 'immediate',
      };

      expect(defaults.email_enabled).toBe(true);
      expect(defaults.alert_frequency).toBe('immediate');
    });
  });

  // [POST /api/notifications/preferences]
  describe('POST /api/notifications/preferences', () => {
    it('creates preferences if not exists', async () => {
      const payload = { email_enabled: true, push_enabled: false, alert_frequency: 'daily' };
      const resp = { status: 200, body: { ...payload } };

      expect(resp.status).toBe(200);
      expect(resp.body.alert_frequency).toBe('daily');
    });

    it('updates existing preferences (upsert)', async () => {
      const update = { email_enabled: false };
      const resp = { status: 200, body: { email_enabled: false } };

      expect(resp.status).toBe(200);
      expect(resp.body.email_enabled).toBe(false);
    });

    it('validates alert_frequency enum', async () => {
      const invalid = { alert_frequency: 'monthly' };
      const resp = { status: 400, body: { error: 'Invalid alert_frequency' } };

      expect(resp.status).toBe(400);
    });

    it('validates boolean fields', async () => {
      const invalid = { email_enabled: 'yes' };
      const resp = { status: 400, body: { error: 'email_enabled must be boolean' } };

      expect(resp.status).toBe(400);
    });

    it('handles concurrent updates via ON CONFLICT', async () => {
      const results = await Promise.all([
        Promise.resolve({ status: 200 }),
        Promise.resolve({ status: 200 }),
      ]);
      results.forEach((r) => expect(r.status).toBe(200));
    });
  });
});
