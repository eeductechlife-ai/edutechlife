-- ============================================
-- NOTIFICATION PREFERENCES - Add to profiles table
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notif_lesson_reminder BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notif_exam_reminder BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notif_module_complete BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notif_certificate BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notif_browser_push BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_reminder_check TIMESTAMPTZ;
