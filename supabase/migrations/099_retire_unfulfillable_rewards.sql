-- ============================================================================
-- 099_retire_unfulfillable_rewards.sql
--
-- Retira de la tienda de IngenIA los premios que la plataforma no puede cumplir
-- (auditoría de IngenIA, oct-2026):
--   * «Día Libre»        — «un día sin tareas» no depende de la plataforma.
--   * «Certificado VAK»  — el rediseño del ADN ya no se presenta como certificado.
--   * «Tema Oscuro»      — el modo oscuro es gratis en Cuenta; cobrar 500 puntos
--                          por algo gratuito confunde.
--
-- Es un retiro suave: no se borra nada. `is_active = false` los saca de la
-- política `rewards_public_read` (solo muestra activos) y de la tienda, y las
-- filas de `student_rewards` de quien ya los canjeó siguen intactas.
-- Idempotente: se puede ejecutar más de una vez.
-- ============================================================================

UPDATE rewards
SET is_active = false
WHERE name IN ('Día Libre', 'Certificado VAK', 'Tema Oscuro')
  AND is_active = true;
