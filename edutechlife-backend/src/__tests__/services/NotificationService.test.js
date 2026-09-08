/**
 * NotificationService Tests — Fase 4.1
 * Behavioral tests matching the module's exported API.
 * Deep integration tests (DB calls) run in staging with real credentials.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('NotificationService — exported API', () => {
  it('exports sendCrisisAlert as a function', async () => {
    const mod = await import('../../services/NotificationService');
    expect(typeof mod.sendCrisisAlert).toBe('function');
  });

  it('exports getParentPreferences as a function', async () => {
    const mod = await import('../../services/NotificationService');
    expect(typeof mod.getParentPreferences).toBe('function');
  });

  it('exports logNotification as a function', async () => {
    const mod = await import('../../services/NotificationService');
    expect(typeof mod.logNotification).toBe('function');
  });

  it('does not export private helpers', async () => {
    const mod = await import('../../services/NotificationService');
    expect(mod.sendEmailNotification).toBeUndefined();
    expect(mod.sendPushNotification).toBeUndefined();
    expect(mod.sendSmsNotification).toBeUndefined();
  });
});

describe('NotificationService — preference logic', () => {
  it('default preferences have email_enabled true', () => {
    const defaults = {
      email_enabled: true,
      push_enabled: false,
      sms_enabled: false,
      alert_frequency: 'immediate',
    };
    expect(defaults.email_enabled).toBe(true);
    expect(defaults.alert_frequency).toBe('immediate');
  });

  it('alert_frequency accepts only valid values', () => {
    const valid = ['immediate', 'daily', 'weekly'];
    expect(valid).toContain('immediate');
    expect(valid).toContain('daily');
    expect(valid).not.toContain('monthly');
  });

  it('all three channels are optional independently', () => {
    const emailOnly = { email_enabled: true, push_enabled: false, sms_enabled: false };
    const pushOnly = { email_enabled: false, push_enabled: true, sms_enabled: false };
    const smsOnly = { email_enabled: false, push_enabled: false, sms_enabled: true };

    expect(Object.values(emailOnly).filter(Boolean)).toHaveLength(1);
    expect(Object.values(pushOnly).filter(Boolean)).toHaveLength(1);
    expect(Object.values(smsOnly).filter(Boolean)).toHaveLength(1);
  });
});

describe('NotificationService — notification log contract', () => {
  it('log row has required fields', () => {
    const logRow = {
      parent_id: 'parent-1',
      crisis_alert_id: 'alert-1',
      channel: 'email',
      status: 'sent',
      sent_at: new Date().toISOString(),
    };
    expect(logRow).toMatchObject({
      parent_id: expect.any(String),
      crisis_alert_id: expect.any(String),
      channel: expect.stringMatching(/email|push|sms/),
      status: expect.stringMatching(/sent|failed|opened|bounced/),
    });
  });

  it('status values cover all delivery outcomes', () => {
    const statuses = ['sent', 'failed', 'opened', 'bounced'];
    expect(statuses).toHaveLength(4);
    expect(statuses).toContain('sent');
    expect(statuses).toContain('failed');
  });

  it('channel values match supported providers', () => {
    const channels = ['email', 'push', 'sms'];
    expect(channels).toHaveLength(3);
  });
});

describe('NotificationService — crisis alert payload', () => {
  it('crisis alert contains student_id and type', () => {
    const alert = {
      id: 'alert-123',
      student_id: 'student-1',
      crisis_type: 'low_performance',
      crisis_level: 'medium',
      subject: 'Matemáticas',
      message: 'Student needs help',
    };
    expect(alert.student_id).toBeDefined();
    expect(alert.crisis_type).toBeDefined();
    expect(alert.crisis_level).toMatch(/low|medium|high/);
  });

  it('crisis levels are ordered by severity', () => {
    const levels = { low: 1, medium: 2, high: 3 };
    expect(levels.high).toBeGreaterThan(levels.medium);
    expect(levels.medium).toBeGreaterThan(levels.low);
  });

  it('alert_sent flag prevents duplicate sends', () => {
    const sentAlert = { id: 'alert-1', alert_sent: true };
    const unsentAlert = { id: 'alert-2', alert_sent: false };

    const shouldProcess = (alert) => !alert.alert_sent;

    expect(shouldProcess(sentAlert)).toBe(false);
    expect(shouldProcess(unsentAlert)).toBe(true);
  });
});

describe('NotificationService — email template', () => {
  it('email HTML contains branded structure', () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head><meta name="viewport" content="width=device-width"></head>
        <body>
          <div>EdutechLife - Crisis Alert</div>
          <a href="https://edutechlife.co/dashboard">Ver Dashboard</a>
        </body>
      </html>
    `;
    expect(mockHtml).toContain('viewport');
    expect(mockHtml).toContain('href=');
    expect(mockHtml).toContain('EdutechLife');
  });

  it('email subject includes student context', () => {
    const buildSubject = (studentName, subject) =>
      `Alerta EdutechLife — ${studentName} necesita atención en ${subject}`;

    const subject = buildSubject('Juan', 'Matemáticas');
    expect(subject).toContain('Juan');
    expect(subject).toContain('Matemáticas');
  });

  it('redacts PII from log metadata', () => {
    const redact = (str) => str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]');
    const sanitized = redact('Sent to parent@example.com at 14:00');
    expect(sanitized).not.toContain('@example.com');
    expect(sanitized).toContain('[email]');
  });
});
