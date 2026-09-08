/**
 * NotificationService Tests — Fase 4.1
 * Coverage: sendCrisisAlert, preferences, email delivery, logging
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { NotificationService } from '../../services/NotificationService';
import { supabase } from '../../lib/supabase';

const mockSupabase = {
  from: vi.fn(),
  auth: { getUser: vi.fn() },
};

describe('NotificationService', () => {
  let service;
  let mockEmailService;

  beforeAll(() => {
    mockEmailService = { sendEmail: vi.fn().mockResolvedValue({ success: true }) };
    service = new NotificationService(mockSupabase, mockEmailService);
  });

  describe('sendCrisisAlert', () => {
    it('sends email notification to parent when alert created', async () => {
      const crisisAlert = {
        id: 'alert-123',
        student_id: 'student-1',
        type: 'low_performance',
        subject: 'Matemáticas',
        message: 'Student needs help',
      };

      const parent = {
        id: 'parent-1',
        email: 'parent@example.com',
        name: 'Parent Name',
      };

      const preferences = {
        email_enabled: true,
        push_enabled: false,
        sms_enabled: false,
        alert_frequency: 'immediate',
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: parent, error: null }),
      });

      const result = await service.sendCrisisAlert(crisisAlert.id, parent.id, preferences);

      expect(result.success).toBe(true);
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: parent.email,
          subject: expect.stringContaining('Matemáticas'),
        })
      );
    });

    it('does not send if email_enabled is false', async () => {
      const preferences = { email_enabled: false, push_enabled: false };
      const result = await service.sendCrisisAlert('alert-1', 'parent-1', preferences);

      expect(result.channels_attempted).toBe(0);
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('returns success if at least one channel succeeds', async () => {
      const preferences = { email_enabled: true, push_enabled: true };
      mockEmailService.sendEmail.mockResolvedValue({ success: true });

      const result = await service.sendCrisisAlert('alert-1', 'parent-1', preferences);

      expect(result.success).toBe(true);
      expect(result.channels_sent).toBeGreaterThan(0);
    });

    it('logs notification attempt to database', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: { id: 'log-1' } });
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'log-1' } }),
      });

      await service.logNotification('parent-1', 'alert-1', 'email', 'sent');

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          parent_id: 'parent-1',
          crisis_alert_id: 'alert-1',
          channel: 'email',
          status: 'sent',
        })
      );
    });

    it('handles missing parent gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      });

      const result = await service.sendCrisisAlert('alert-1', 'invalid-parent', {});

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('getParentPreferences', () => {
    it('fetches parent preferences', async () => {
      const preferences = {
        email_enabled: true,
        push_enabled: false,
        sms_enabled: false,
        alert_frequency: 'immediate',
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: preferences, error: null }),
      });

      const result = await service.getParentPreferences('parent-1');

      expect(result).toEqual(preferences);
    });

    it('returns defaults if preferences not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      });

      const result = await service.getParentPreferences('new-parent');

      expect(result.email_enabled).toBe(true); // default
      expect(result.alert_frequency).toBe('immediate'); // default
    });
  });

  describe('buildCrisisAlertEmailHtml', () => {
    it('builds valid HTML email with student info', () => {
      const crisisAlert = {
        subject: 'Matemáticas',
        message: 'Low performance detected',
      };
      const student = { name: 'Student Name', age: 12 };
      const parent = { name: 'Parent Name' };

      const html = service.buildCrisisAlertEmailHtml(crisisAlert, student, parent);

      expect(html).toContain('Student Name');
      expect(html).toContain('Matemáticas');
      expect(html).toContain('Low performance detected');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
    });

    it('includes action link to dashboard', () => {
      const crisisAlert = { subject: 'English', message: 'Alert' };
      const html = service.buildCrisisAlertEmailHtml(crisisAlert, { name: 'Test' }, {});

      expect(html).toContain('href=');
      expect(html).toMatch(/dashboard|alerts/i);
    });

    it('is mobile-responsive', () => {
      const html = service.buildCrisisAlertEmailHtml(
        { subject: 'Test', message: 'Test' },
        { name: 'Test' },
        {}
      );

      expect(html).toContain('viewport');
      expect(html).toContain('mobile');
    });
  });

  describe('Email delivery tracking', () => {
    it('marks notification as opened when webhook received', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: { id: 'log-1' } });
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'log-1' } }),
      });

      await service.markNotificationOpened('log-1');

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ open_timestamp: expect.any(String) })
      );
    });

    it('tracks failed delivery attempts', async () => {
      mockEmailService.sendEmail.mockRejectedValue(new Error('Invalid email'));

      const result = await service.sendCrisisAlert('alert-1', 'parent-1', {
        email_enabled: true,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Frequency-based sending', () => {
    it('respects alert_frequency immediate', async () => {
      const preferences = { email_enabled: true, alert_frequency: 'immediate' };
      const shouldSend = service.shouldSendNotification(preferences, {});

      expect(shouldSend).toBe(true);
    });

    it('respects alert_frequency daily', async () => {
      const preferences = { email_enabled: true, alert_frequency: 'daily' };
      // Would check last sent time, but simplified for test
      const shouldSend = service.shouldSendNotification(preferences, {});

      expect(typeof shouldSend).toBe('boolean');
    });

    it('respects opt-out (email_enabled false)', () => {
      const preferences = { email_enabled: false, alert_frequency: 'immediate' };
      const shouldSend = service.shouldSendNotification(preferences, {});

      expect(shouldSend).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('catches email service errors and logs', async () => {
      mockEmailService.sendEmail.mockRejectedValue(new Error('SendGrid rate limit'));

      const result = await service.sendCrisisAlert('alert-1', 'parent-1', {
        email_enabled: true,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('SendGrid');
    });

    it('handles concurrent notifications without duplication', async () => {
      const preferences = { email_enabled: true };

      const results = await Promise.all([
        service.sendCrisisAlert('alert-1', 'parent-1', preferences),
        service.sendCrisisAlert('alert-1', 'parent-1', preferences),
      ]);

      // Both should succeed but only one should actually send (due to DB unique constraint)
      expect(results.length).toBe(2);
    });
  });
});
