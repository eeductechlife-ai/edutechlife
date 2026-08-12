-- ============================================================================
-- Migration 028 — Separación de productos por `account_type`
--
-- IALab (estudiantes 16+) y SmartBoard (niños 6–16) comparten el mismo pool de
-- identidad (auth.users) y la tabla de perfil universal `users`. SmartBoard
-- además tiene fila en `students`. No había forma de saber a qué producto
-- pertenece una cuenta ni de impedir el cruce entre ingresos.
--
-- Esta migración añade `account_type` a `users` y hace BACKFILL NO DESTRUCTIVO:
--   - Cuentas con fila en `students` (por auth_id)  → 'smartboard'
--   - El resto                                       → 'ialab'
-- No borra ni mueve ningún dato; solo etiqueta filas existentes.
-- ============================================================================

BEGIN;

-- 1. Columna (idempotente). Sin default para poder distinguir filas ya
--    etiquetadas de las nuevas; el backend fija 'ialab' en signups nuevos.
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type TEXT;

-- 2. Backfill: SmartBoard = cuentas que ya tienen perfil de estudiante.
UPDATE users u
SET account_type = 'smartboard'
WHERE account_type IS NULL
  AND EXISTS (
    SELECT 1 FROM students s WHERE s.auth_id = u.id
  );

-- 3. Backfill: el resto son cuentas IALab (comportamiento histórico).
UPDATE users
SET account_type = 'ialab'
WHERE account_type IS NULL;

-- 4. Restringir a los dos valores válidos, tolerando reejecución.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_account_type_check'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_account_type_check
      CHECK (account_type IN ('ialab', 'smartboard'));
  END IF;
END $$;

-- 5. Índice para el enrutamiento por producto en login.
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);

COMMIT;
