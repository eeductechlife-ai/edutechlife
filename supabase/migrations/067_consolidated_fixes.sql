-- ============================================================================
-- 067_consolidated_fixes.sql
-- Safe schema fixes from ad-hoc scripts.
-- NOTE: auth.jwt() override was intentionally excluded — overriding that
-- built-in Supabase function would break session validation for all users.
-- ============================================================================

-- ── Fix 1: students.date_of_birth — drop NOT NULL if column exists ────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'students'
      AND column_name  = 'date_of_birth'
  ) THEN
    ALTER TABLE public.students ALTER COLUMN date_of_birth DROP NOT NULL;
  END IF;
END $$;

-- ── Fix 2: students.is_active — ensure BOOLEAN type if column exists ──────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'students'
      AND column_name  = 'is_active'
      AND data_type    <> 'boolean'
  ) THEN
    ALTER TABLE public.students
      ALTER COLUMN is_active TYPE BOOLEAN USING is_active::BOOLEAN;
  END IF;
END $$;

-- ── Fix 3: users.account_type — add column if missing ────────────────────────
-- The login route gates SmartBoard features on account_type = 'smartboard'.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  = 'account_type'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN account_type TEXT DEFAULT 'ialab'
        CHECK (account_type IN ('ialab', 'smartboard'));
  END IF;
END $$;

-- ── Fix 4: Ensure set_updated_at() trigger is applied to users ───────────────
-- Trigger function was created in 065; apply to users table as well.
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
