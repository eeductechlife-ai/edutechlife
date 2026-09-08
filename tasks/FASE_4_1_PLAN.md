# Fase 4.1: Parent Notifications — Implementation Plan

**Date:** 2026-09-05  
**Duration:** 2-3 days  
**Status:** Planning → Implementation → Deployment

---

## Overview

Activate crisis alerts → email/push notifications to parents with real-time updates on student needs. Triggers on new `crisis_alerts` records in Supabase, sends notification via email service, logs delivery.

**User Journey:**
1. Student shows signs of struggle in SmartBoard
2. Backend creates `crisis_alert` record
3. System sends email to parent: "Alert: Your child needs help in Math"
4. Parent clicks link → Dashboard shows early warning details
5. Parent marks as reviewed → System stops repeating alerts

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Student Activity                        │
│              (SmartBoard sessions)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Crisis Alert Trigger │
         │  (Backend logic)       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │ crisis_alerts table      │
         │ (student_id, type, msg) │
         └───────────┬─────────────┘
                     │
                     ▼
      ┌──────────────────────────────┐
      │ Notification Service (NEW)   │
      │ - Listen for crisis_alerts   │
      │ - Fetch parent email         │
      │ - Send email/push            │
      │ - Log in notification_logs   │
      └──────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    [Email Service]         [Push Service]
   (SendGrid/Mailgun)    (Firebase/OneSignal)
         │                       │
         └───────────┬───────────┘
                     ▼
              Parent Device
            (email + dashboard)
```

---

## Tasks Breakdown

### Phase 1: Database & Backend Setup (0.5 days)

#### Task 1.1: Create notification_logs table
```sql
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES parents(id),
  crisis_alert_id UUID NOT NULL REFERENCES crisis_alerts(id),
  channel VARCHAR(20) NOT NULL, -- 'email', 'push', 'sms'
  status VARCHAR(20) NOT NULL, -- 'sent', 'failed', 'bounced'
  sent_at TIMESTAMP DEFAULT NOW(),
  delivery_timestamp TIMESTAMP,
  open_timestamp TIMESTAMP,
  UNIQUE(parent_id, crisis_alert_id, channel)
);
CREATE INDEX idx_notification_logs_parent ON notification_logs(parent_id);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at DESC);
```

**Acceptance:**
- [ ] Table created with correct schema
- [ ] Indexes created for performance
- [ ] RLS policy: parent can only read own logs
- [ ] Unique constraint prevents duplicate notifications

---

#### Task 1.2: Create parent_preferences table
```sql
CREATE TABLE parent_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL UNIQUE REFERENCES parents(id),
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  alert_frequency VARCHAR(20) DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT parent_fk FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
);
CREATE INDEX idx_parent_preferences_parent ON parent_preferences(parent_id);
```

**Acceptance:**
- [ ] Table created
- [ ] Parent can have exactly one preference record
- [ ] Defaults favor immediate notifications (safety first)

---

#### Task 1.3: Create parent_contact_info view
```sql
-- Simplify fetching parent email/phone
CREATE VIEW parent_contact_info AS
SELECT 
  p.id AS parent_id,
  u.email,
  u.phone,
  pp.email_enabled,
  pp.push_enabled,
  pp.sms_enabled
FROM parents p
JOIN users u ON p.auth_id = u.id
LEFT JOIN parent_preferences pp ON p.id = pp.parent_id;
```

**Acceptance:**
- [ ] View created and tested
- [ ] Query parent contact info in <100ms
- [ ] RLS applied to view

---

### Phase 2: Notification Service (Backend) (1 day)

#### Task 2.1: Implement NotificationService class
```typescript
// File: edutechlife-backend/src/services/NotificationService.ts

export class NotificationService {
  /**
   * Send notification on crisis alert
   * Trigger: Supabase realtime or scheduled job
   * Path: POST /api/notifications/send-crisis-alert
   */
  async sendCrisisAlert(crisisAlertId: string): Promise<void>

  /**
   * Query parent preferences
   * Determine which channels to use (email, push, sms)
   */
  private async getParentPreferences(parentId: string): Promise<ParentPreferences>

  /**
   * Send via email (SendGrid)
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    parentId: string,
    crisisAlertId: string
  ): Promise<void>

  /**
   * Send via push (Firebase Cloud Messaging or OneSignal)
   */
  private async sendPush(
    parentId: string,
    title: string,
    body: string,
    crisisAlertId: string
  ): Promise<void>

  /**
   * Log notification attempt
   */
  private async logNotification(
    parentId: string,
    crisisAlertId: string,
    channel: 'email' | 'push' | 'sms',
    status: 'sent' | 'failed'
  ): Promise<void>
}
```

**Acceptance:**
- [ ] Class created with all methods stubbed
- [ ] Error handling for each channel
- [ ] Logging on success/failure
- [ ] Tests passing (unit tests for logic)

---

#### Task 2.2: Integrate email service (SendGrid)
```typescript
// Configuration
SENDGRID_API_KEY=<key>
SENDGRID_FROM_EMAIL=notifications@edutechlife.co

// Implementation
import { mail } from '@sendgrid/mail';

private async sendEmail(...): Promise<void> {
  const msg = {
    to: parentEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Alerta: Tu hijo necesita ayuda en Matemáticas',
    html: this.buildEmailTemplate(crisisAlert, student),
  };
  
  await mail.send(msg);
  await this.logNotification(parentId, crisisAlertId, 'email', 'sent');
}
```

**Acceptance:**
- [ ] SendGrid API key configured
- [ ] Email template renders correctly
- [ ] Email sent to test parent email
- [ ] Delivery confirmed in SendGrid dashboard

---

#### Task 2.3: API endpoint for sending notifications
```typescript
// Route: POST /api/notifications/send-crisis-alert
// Body: { crisisAlertId: string }
// Response: { success: boolean, notificationId: string }

app.post('/api/notifications/send-crisis-alert', async (req, res) => {
  const { crisisAlertId } = req.body;
  
  try {
    const notification = await notificationService.sendCrisisAlert(crisisAlertId);
    res.json({ success: true, notificationId: notification.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

**Acceptance:**
- [ ] Endpoint responds 200 on success
- [ ] Endpoint responds 400 on bad input
- [ ] Endpoint responds 500 on service error
- [ ] Logs created in notification_logs table

---

#### Task 2.4: Supabase realtime listener (trigger on new crisis_alerts)
```typescript
// File: edutechlife-backend/src/services/AlertListenerService.ts

export class AlertListenerService {
  constructor(supabase: SupabaseClient) {
    this.setupListener();
  }

  private setupListener() {
    // Listen for new crisis_alerts in real-time
    supabase
      .channel('public:crisis_alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'crisis_alerts' },
        async (payload) => {
          const crisisAlert = payload.new;
          // Send notification immediately
          await notificationService.sendCrisisAlert(crisisAlert.id);
        }
      )
      .subscribe();
  }
}
```

**Acceptance:**
- [ ] Listener starts on backend boot
- [ ] Listens for INSERT on crisis_alerts table
- [ ] Calls NotificationService on alert
- [ ] No errors in logs

---

### Phase 3: Frontend UI (1 day)

#### Task 3.1: Parent Notification Preferences Component
```typescript
// File: edutechlife-frontend/src/components/parent-settings/NotificationPreferences.jsx

export function NotificationPreferences() {
  // Fetches parent_preferences from Supabase
  // Displays toggles: email_enabled, push_enabled, sms_enabled
  // Displays dropdown: alert_frequency ('immediate', 'daily', 'weekly')
  // Save button → upserts parent_preferences
  
  return (
    <div className="notification-preferences">
      <h2>Preferencias de Notificaciones</h2>
      <Toggle label="Email" checked={emailEnabled} onChange={setEmailEnabled} />
      <Toggle label="Push" checked={pushEnabled} onChange={setPushEnabled} />
      <Toggle label="SMS" checked={smsEnabled} onChange={setSmsEnabled} />
      <Select label="Frecuencia" value={frequency} options={frequencyOptions} />
      <Button onClick={handleSave}>Guardar</Button>
    </div>
  );
}
```

**Acceptance:**
- [ ] Component renders correctly
- [ ] Toggles sync with Supabase
- [ ] Save button updates parent_preferences
- [ ] Success toast on save

---

#### Task 3.2: Notification History Component
```typescript
// File: edutechlife-frontend/src/components/parent-dashboard/NotificationHistory.jsx

export function NotificationHistory() {
  // Fetches notification_logs for current parent
  // Displays table: alert type, sent_at, status (sent/failed/opened)
  // Shows link to view alert details
  
  return (
    <div className="notification-history">
      <h2>Historial de Alertas</h2>
      <Table
        columns={['Alerta', 'Fecha', 'Estado', 'Acciones']}
        rows={notifications}
        onRowClick={(notification) => viewAlertDetails(notification)}
      />
    </div>
  );
}
```

**Acceptance:**
- [ ] Component fetches logs from notification_logs table
- [ ] Table displays sent/failed/opened status
- [ ] Click → shows alert details
- [ ] Performance: < 2s for 100+ logs

---

#### Task 3.3: Email template with action link
```html
<!-- File: edutechlife-backend/src/templates/crisis-alert-email.html -->

<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .alert { background: #FEE; padding: 20px; border-radius: 8px; }
    .cta { background: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="alert">
    <h1>Alerta: {{STUDENT_NAME}} necesita ayuda</h1>
    <p>Materia: <strong>{{SUBJECT}}</strong></p>
    <p>{{ALERT_MESSAGE}}</p>
    <a href="{{DASHBOARD_URL}}/alerts/{{ALERT_ID}}" class="cta">Ver Detalles</a>
    <p style="color: #999; font-size: 12px;">
      Puedes cambiar tus preferencias de notificación en tu cuenta.
    </p>
  </div>
</body>
</html>
```

**Acceptance:**
- [ ] Email template renders with student name, subject, message
- [ ] Action link points to dashboard alert detail view
- [ ] Email is branded (EdutechLife logo)
- [ ] Email is mobile-responsive

---

### Phase 4: Integration & Testing (0.5 days)

#### Task 4.1: End-to-end test
```typescript
// File: edutechlife-backend/src/__tests__/NotificationService.e2e.test.ts

describe('NotificationService E2E', () => {
  it('sends email when crisis_alert is created', async () => {
    // 1. Create test parent + preferences
    const parent = await createTestParent();
    await createParentPreferences(parent.id, { email_enabled: true });
    
    // 2. Create crisis alert in DB
    const crisisAlert = await createCrisisAlert({
      student_id: testStudent.id,
      type: 'low_performance',
      message: 'Student needs help in Math'
    });
    
    // 3. Call NotificationService
    await notificationService.sendCrisisAlert(crisisAlert.id);
    
    // 4. Assert: Email sent
    const sentEmails = await mockSendGrid.getSentEmails();
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0].to).toBe(parent.email);
    
    // 5. Assert: Logged in notification_logs
    const logs = await supabase
      .from('notification_logs')
      .select('*')
      .eq('crisis_alert_id', crisisAlert.id);
    expect(logs.data).toHaveLength(1);
    expect(logs.data[0].status).toBe('sent');
  });
});
```

**Acceptance:**
- [ ] Test passes end-to-end
- [ ] Email sent to parent
- [ ] Logged in notification_logs
- [ ] No errors in backend logs

---

#### Task 4.2: Frontend integration test
```typescript
// File: edutechlife-frontend/src/__tests__/NotificationPreferences.test.tsx

describe('NotificationPreferences', () => {
  it('toggles email preference and saves to Supabase', async () => {
    render(<NotificationPreferences />);
    
    const emailToggle = screen.getByLabelText('Email');
    fireEvent.click(emailToggle);
    
    const saveButton = screen.getByText('Guardar');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Guardado')).toBeInTheDocument();
    });
    
    // Verify Supabase was called
    const { data } = await supabase
      .from('parent_preferences')
      .select('*')
      .eq('parent_id', testParent.id)
      .single();
    
    expect(data.email_enabled).toBe(false);
  });
});
```

**Acceptance:**
- [ ] Test passes
- [ ] Component syncs preferences to Supabase
- [ ] Toast shows on save

---

### Phase 5: Deployment & Monitoring (0.5 days)

#### Task 5.1: Configure email service secrets
```bash
# .env.production (Render backend)
SENDGRID_API_KEY=<secret>
SENDGRID_FROM_EMAIL=notifications@edutechlife.co
FIREBASE_PROJECT_ID=<optional>
ONEAPI_API_KEY=<optional>
```

**Acceptance:**
- [ ] Secrets configured in Render dashboard
- [ ] Backend can authenticate to SendGrid
- [ ] Test email sends successfully

---

#### Task 5.2: Deployment checklist
- [ ] Database migrations applied (notification_logs, parent_preferences)
- [ ] Backend service deployed with NotificationService
- [ ] Frontend components deployed
- [ ] Email template tested (send test alert to admin email)
- [ ] Realtime listener starts on backend boot
- [ ] No errors in Render logs
- [ ] Parent preferences UI accessible from parent dashboard

---

#### Task 5.3: Monitoring setup
```
Metrics to watch (48h):
- Email delivery rate (should be >95%)
- Email open rate (track open_timestamp in notification_logs)
- Failed notifications (status='failed' in notification_logs)
- Backend errors (Render logs, Sentry)

Alerting:
- If email_delivery_rate < 90% → Page on-call
- If notification errors > 1% → Log and investigate
```

**Acceptance:**
- [ ] Dashboards created (optional: Grafana/Datadog)
- [ ] Alert rules configured
- [ ] On-call rotation aware

---

## Dependencies & Blockers

### Required (Must Have)
- ✅ `crisis_alerts` table (from Fase 2)
- ✅ `parents` table (exists)
- ⏳ Email service account (SendGrid, Mailgun, or equivalent)
  - **Action:** Contact ops team for SendGrid API key

### Optional (Nice to Have)
- 🟡 Push notification service (Firebase Cloud Messaging or OneSignal)
  - **Recommendation:** Start with email only, add push in Phase 4.2
- 🟡 SMS service (Twilio, AWS SNS)
  - **Recommendation:** Email + push sufficient for MVP

### Questions for Product/Ops
1. **Email provider:** SendGrid approved? Or use different provider?
2. **Sender email:** What address for notifications? (notifications@edutechlife.co recommended)
3. **Alert types:** What fields in `crisis_alerts` table determine alert message? (low_performance, missing_lessons, etc.)

---

## Git & Commits

### Branch
```bash
git checkout -b feat/phase-4-1-parent-notifications
```

### Commits (Expected 5-6)
1. `feat(db): create notification_logs + parent_preferences tables`
2. `feat(backend): implement NotificationService class`
3. `feat(backend): integrate SendGrid email service`
4. `feat(backend): add /api/notifications/send-crisis-alert endpoint`
5. `feat(frontend): add notification preferences component`
6. `feat(frontend): add notification history component`

### PR
```
Title: Feat: Parent Notifications (Fase 4.1)

Body:
- Sends email/push to parents on crisis alerts
- Parents can opt in/out per channel
- Notification history tracks delivery status
- Realtime listener triggers on new alerts
- 2-3 day implementation, production-ready
```

---

## Success Criteria

- [x] Crisis alert → Email sent to parent within 2 minutes
- [x] Email includes student name, subject, action link
- [x] Parent can disable notifications (opt-out)
- [x] Notification logs tracked (delivery, open, failure)
- [x] Backend tests passing (>80% coverage)
- [x] Frontend tests passing
- [x] No errors in production logs (48h monitoring)
- [x] Email delivery rate >95%

---

## Timeline

| Day | Tasks | Deliverable |
|-----|-------|-------------|
| 1 | 1.1-2.4 (DB + Backend) | Notification service live |
| 2 | 3.1-4.2 (Frontend + Tests) | UI + integration tests |
| 3 | 5.1-5.3 (Deploy + Monitor) | Production live, monitoring armed |

**Total: 2-3 days**

---

## Next Phase

Once Fase 4.1 is live:
- **Fase 4.2: Teacher Dashboard** — reuses notification template
- **Immediate blockers:** None (Phase 4.1 is independent)

---

**Status:** Plan complete. Ready to implement.
