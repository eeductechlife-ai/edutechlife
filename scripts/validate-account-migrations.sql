-- ============================================================================
-- Validador aislado de las migraciones 027 y 028
--
-- Prueba, sin tocar ninguna base real, que:
--   1. Las migraciones aplican sin error sobre un esquema base tipo-producción.
--   2. Son IDEMPOTENTES (se aplican dos veces sin fallar ni duplicar efectos).
--   3. El BACKFILL de account_type clasifica bien:
--        - cuenta con fila en `students`  → 'smartboard'
--        - cuenta sin fila en `students`  → 'ialab'
--   4. El CHECK constraint rechaza valores fuera de ('ialab','smartboard').
--
-- Si algo está mal, lanza EXCEPTION y psql termina con código ≠ 0.
--
-- ─── Cómo ejecutarlo de forma SEGURA (elige una) ────────────────────────────
--
-- A) Postgres desechable en Docker (recomendado, no toca nada real):
--      docker run --rm -d --name pgval -e POSTGRES_PASSWORD=x -p 5599:5432 postgres:15
--      psql "postgresql://postgres:x@localhost:5599/postgres" \
--           -v ON_ERROR_STOP=1 -f scripts/validate-account-migrations.sql
--      docker rm -f pgval
--
-- B) Branch de staging de Supabase (base efímera, aislada de producción):
--      supabase branches create staging-migrations
--      psql "$STAGING_BRANCH_DB_URL" -v ON_ERROR_STOP=1 \
--           -f scripts/validate-account-migrations.sql
--
-- C) Antes de tocar producción, ver el diff real sin aplicar:
--      supabase db diff --linked         # o: supabase db push --dry-run
--
-- Nota: este script CREA y MODIFICA tablas `users`/`students`; úsalo SOLO en
-- una base desechable. No lo corras contra producción.
-- ============================================================================

\set ON_ERROR_STOP on

-- ─── 1. Esquema base tipo-producción (sin FK a auth.users, para portabilidad)
-- Refleja supabase_auth_users_native.sql y migración 011 en lo relevante.
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  user_type TEXT,
  clerk_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 6 AND age <= 16),
  subscription_tier TEXT DEFAULT 'free'
);

-- ─── 2. Datos de prueba que ejercitan el backfill ──────────────────────────
-- A: cuenta IALab (sin perfil de estudiante)  → debe quedar 'ialab'
-- B: cuenta SmartBoard (con fila en students) → debe quedar 'smartboard'
INSERT INTO users (id, email, username) VALUES
  ('11111111-1111-1111-1111-111111111111', 'adulto@ialab.test', 'adulto'),
  ('22222222-2222-2222-2222-222222222222', 'nino@smartboard.test', 'nino');

INSERT INTO students (auth_id, name, age) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Niño Test', 10);

-- ─── 3. Aplicar las migraciones REALES (dos veces = prueba de idempotencia) ─
\echo '>> Aplicando 027 (1ª vez)'
\ir ../supabase/migrations/027_user_subscription_columns.sql
\echo '>> Aplicando 028 (1ª vez)'
\ir ../supabase/migrations/028_account_type_separation.sql
\echo '>> Reaplicando 027 (2ª vez, idempotencia)'
\ir ../supabase/migrations/027_user_subscription_columns.sql
\echo '>> Reaplicando 028 (2ª vez, idempotencia)'
\ir ../supabase/migrations/028_account_type_separation.sql

-- ─── 4. Aserciones ─────────────────────────────────────────────────────────
DO $$
DECLARE
  v_ialab TEXT;
  v_kid   TEXT;
  v_cols  INT;
BEGIN
  -- 027: columnas de suscripción existen en users
  SELECT count(*) INTO v_cols
  FROM information_schema.columns
  WHERE table_name = 'users'
    AND column_name IN ('plan', 'subscription_id', 'subscription_status');
  IF v_cols <> 3 THEN
    RAISE EXCEPTION 'FALLO 027: se esperaban 3 columnas de suscripción, hay %', v_cols;
  END IF;

  -- 028: backfill correcto
  SELECT account_type INTO v_ialab FROM users
    WHERE id = '11111111-1111-1111-1111-111111111111';
  SELECT account_type INTO v_kid FROM users
    WHERE id = '22222222-2222-2222-2222-222222222222';

  IF v_ialab IS DISTINCT FROM 'ialab' THEN
    RAISE EXCEPTION 'FALLO backfill: cuenta sin students debía ser ialab, es %', v_ialab;
  END IF;
  IF v_kid IS DISTINCT FROM 'smartboard' THEN
    RAISE EXCEPTION 'FALLO backfill: cuenta con students debía ser smartboard, es %', v_kid;
  END IF;

  RAISE NOTICE 'OK: columnas 027 presentes y backfill 028 correcto (ialab=%, smartboard=%)', v_ialab, v_kid;
END $$;

-- 028: el CHECK debe rechazar un valor inválido
DO $$
BEGIN
  BEGIN
    INSERT INTO users (id, email, username, account_type)
    VALUES ('33333333-3333-3333-3333-333333333333', 'x@x.test', 'x', 'invalido');
    RAISE EXCEPTION 'FALLO constraint: se aceptó un account_type inválido';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'OK: el CHECK rechaza account_type inválido';
  END;
END $$;

\echo ''
\echo '========================================================'
\echo '  ✅ VALIDACIÓN COMPLETA — 027/028 aplican, idempotentes'
\echo '     y con backfill correcto. Seguras para staging.'
\echo '========================================================'
