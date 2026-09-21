-- ============================================================================
-- 092_product_schemas.sql
--
-- Separa los DATOS por producto en schemas de Postgres dentro del MISMO
-- proyecto Supabase:
--   public      → identidad compartida (auth.users + public.users, profiles)
--   ialab       → datos del curso de IA generativa
--   smartboard  → datos de niños/padres
--
-- Esta migración es SOLO la fase 1 (aditiva, sin mover tablas todavía):
--   * crea los schemas si no existen
--   * da USAGE a anon/authenticated/service_role
--   * fija default privileges para que las tablas que se muevan mantengan
--     acceso para esos roles
--
-- El movimiento de tablas va en migraciones posteriores con vistas de
-- compatibilidad en public (para no tocar el código instalado) y verificación
-- producto por producto. Mover con ALTER TABLE ... SET SCHEMA es metadata-only
-- (instantáneo, sin copiar datos) y reversible.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS ialab;
CREATE SCHEMA IF NOT EXISTS smartboard;

-- Acceso a los schemas para los roles de la API y para service_role.
GRANT USAGE ON SCHEMA ialab TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA smartboard TO anon, authenticated, service_role;

-- Default privileges: las tablas/secuencias que se creen (o se muevan) en cada
-- schema quedan accesibles con los permisos esperados por PostgREST.
ALTER DEFAULT PRIVILEGES IN SCHEMA ialab
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA ialab
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA smartboard
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA smartboard
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;

COMMIT;
