-- Migration 073: TOTP MFA columns on users table
-- Applies to admin / parent / educator roles; students are excluded.
-- Idempotent: safe to run multiple times.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS mfa_secret               TEXT,
  ADD COLUMN IF NOT EXISTS mfa_enabled              BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mfa_challenge_token      TEXT,
  ADD COLUMN IF NOT EXISTS mfa_challenge_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mfa_session_token        TEXT,
  ADD COLUMN IF NOT EXISTS mfa_session_refresh      TEXT;
