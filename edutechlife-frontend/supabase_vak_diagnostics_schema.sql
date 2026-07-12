-- ============================================================================
-- EdutechLife · Esquema institucional de diagnósticos VAK
-- Almacena TODOS los datos generados tras cada diagnóstico VAK para alimentar
-- el panel institucional de Valeria (admin interno).
-- Ejecutar en el SQL editor de Supabase.
-- ============================================================================

create table if not exists public.vak_diagnostics (
  id uuid primary key default gen_random_uuid(),

  -- Identidad / agrupación institucional
  user_id text not null,                 -- id de usuario (Clerk)
  institution_id text,                   -- agrupación por colegio/institución (nullable)

  -- Datos del estudiante capturados en el diagnóstico
  student_name text,
  student_age text,
  student_email text,
  student_phone text,
  student_mood text,

  -- Datos del acudiente (si aplica, menores)
  parent_name text,
  parent_phone text,
  parent_email text,

  -- Resultado del diagnóstico
  predominant_style text check (predominant_style in ('visual','auditivo','kinestesico')),
  percentage int check (percentage between 0 and 100),
  score_visual int default 0,
  score_auditivo int default 0,
  score_kinestesico int default 0,
  time_spent_seconds int default 0,

  -- Objeto completo del diagnóstico (styleDetails, answers, etc.) por si se
  -- necesitan campos adicionales sin migrar el esquema.
  result jsonb,

  diagnosed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Índices para las consultas del panel (agregaciones y filtros)
create index if not exists idx_vak_diag_institution on public.vak_diagnostics (institution_id);
create index if not exists idx_vak_diag_style on public.vak_diagnostics (predominant_style);
create index if not exists idx_vak_diag_created on public.vak_diagnostics (created_at desc);
create index if not exists idx_vak_diag_user on public.vak_diagnostics (user_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.vak_diagnostics enable row level security;

-- Cada usuario puede insertar / ver sus propios diagnósticos.
-- (auth.jwt()->>'sub' = id de usuario de Clerk inyectado en el JWT)
create policy "own diagnostics insert"
  on public.vak_diagnostics for insert
  with check (auth.jwt() ->> 'sub' = user_id);

create policy "own diagnostics select"
  on public.vak_diagnostics for select
  using (auth.jwt() ->> 'sub' = user_id);

-- Admin interno de EdutechLife: acceso de lectura a TODO.
-- Marca el rol en el JWT de Clerk (public_metadata.role = 'admin') o ajusta
-- esta condición a tu mecanismo de roles.
create policy "internal admin read all"
  on public.vak_diagnostics for select
  using (coalesce(auth.jwt() -> 'public_metadata' ->> 'role', '') = 'admin');

-- ============================================================================
-- Vista de agregación para el panel (distribución VAK por institución)
-- ============================================================================
create or replace view public.vak_institution_summary as
select
  coalesce(institution_id, 'sin_institucion') as institution_id,
  count(*)                                     as total_diagnostics,
  count(*) filter (where predominant_style = 'visual')       as visual_count,
  count(*) filter (where predominant_style = 'auditivo')     as auditivo_count,
  count(*) filter (where predominant_style = 'kinestesico')  as kinestesico_count,
  round(avg(percentage))                       as avg_percentage,
  round(avg(time_spent_seconds))               as avg_time_seconds,
  max(created_at)                              as last_diagnostic_at
from public.vak_diagnostics
group by coalesce(institution_id, 'sin_institucion');
