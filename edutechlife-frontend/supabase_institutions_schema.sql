-- ============================================================================
-- EdutechLife · Fundaciones multi-tenant B2B (instituciones, membresías, roles)
-- Fase 4 · Atlas
-- Ejecutar en el SQL editor de Supabase, DESPUÉS de supabase_vak_diagnostics_schema.sql.
-- ============================================================================

-- ============================================================================
-- Tabla: institutions
-- Cada colegio/institución cliente de EdutechLife (tenant).
-- ============================================================================
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,             -- ej. "colegio-san-jose" (usado en URL de captura)
  city text,
  contact_email text,

  plan text not null default 'basico'
    check (plan in ('basico', 'premium', 'enterprise')),

  created_at timestamptz default now()
);

create index if not exists idx_institutions_slug on public.institutions (slug);
create index if not exists idx_institutions_plan on public.institutions (plan);

-- ============================================================================
-- Tabla: institution_members
-- Rol de cada usuario (Clerk) dentro de una institución. Un usuario puede
-- pertenecer a varias instituciones (ej. un docente que dicta en dos colegios).
-- ============================================================================
create table if not exists public.institution_members (
  id uuid primary key default gen_random_uuid(),

  institution_id uuid not null references public.institutions (id) on delete cascade,
  user_id text not null,                 -- id de usuario (Clerk, mismo formato que vak_diagnostics.user_id)

  role text not null
    check (role in ('admin_edutech', 'rector', 'docente', 'estudiante')),

  created_at timestamptz default now(),

  unique (institution_id, user_id)
);

create index if not exists idx_inst_members_institution on public.institution_members (institution_id);
create index if not exists idx_inst_members_user on public.institution_members (user_id);
create index if not exists idx_inst_members_role on public.institution_members (role);

-- ============================================================================
-- Row Level Security — institutions
-- ============================================================================
alter table public.institutions enable row level security;

-- Cualquier miembro (de cualquier rol) puede leer los datos de SU institución.
create policy "members read own institution"
  on public.institutions for select
  using (
    exists (
      select 1
      from public.institution_members m
      where m.institution_id = institutions.id
        and m.user_id = auth.jwt() ->> 'sub'
    )
  );

-- Admin interno de EdutechLife: lee TODAS las instituciones.
-- Reconocido por rol global en el JWT de Clerk (public_metadata.role = 'admin',
-- mismo mecanismo que supabase_vak_diagnostics_schema.sql) o por tener membresía
-- 'admin_edutech' en cualquier institución.
create policy "internal admin read all institutions"
  on public.institutions for select
  using (
    coalesce(auth.jwt() -> 'public_metadata' ->> 'role', '') = 'admin'
    or exists (
      select 1
      from public.institution_members m
      where m.user_id = auth.jwt() ->> 'sub'
        and m.role = 'admin_edutech'
    )
  );

-- Solo el admin interno de EdutechLife puede crear/editar instituciones
-- (alta de nuevos clientes B2B). Los rectores no autoprovisionan tenants.
create policy "internal admin write institutions"
  on public.institutions for insert
  with check (coalesce(auth.jwt() -> 'public_metadata' ->> 'role', '') = 'admin');

create policy "internal admin update institutions"
  on public.institutions for update
  using (coalesce(auth.jwt() -> 'public_metadata' ->> 'role', '') = 'admin');

-- ============================================================================
-- Row Level Security — institution_members
-- ============================================================================
alter table public.institution_members enable row level security;

-- Un usuario siempre puede ver su propia fila de membresía (para saber su rol).
create policy "self read own membership"
  on public.institution_members for select
  using (user_id = auth.jwt() ->> 'sub');

-- Miembros de una institución pueden ver el resto de miembros de ESA institución
-- (ej. un rector viendo la lista de docentes de su colegio).
create policy "members read own institution roster"
  on public.institution_members for select
  using (
    exists (
      select 1
      from public.institution_members self
      where self.institution_id = institution_members.institution_id
        and self.user_id = auth.jwt() ->> 'sub'
    )
  );

-- Admin interno de EdutechLife: lee TODAS las membresías.
create policy "internal admin read all memberships"
  on public.institution_members for select
  using (
    coalesce(auth.jwt() -> 'public_metadata' ->> 'role', '') = 'admin'
    or exists (
      select 1
      from public.institution_members m
      where m.user_id = auth.jwt() ->> 'sub'
        and m.role = 'admin_edutech'
    )
  );

-- Solo el admin interno de EdutechLife da de alta membresías en esta iteración.
-- (Autoservicio de rector/docente invitando estudiantes queda para una
-- siguiente fase, ver docs/refactor/multi-tenant-plan.md).
create policy "internal admin write memberships"
  on public.institution_members for insert
  with check (coalesce(auth.jwt() -> 'public_metadata' ->> 'role', '') = 'admin');

-- ============================================================================
-- Enlace con public.vak_diagnostics.institution_id
-- ============================================================================
-- DECISIÓN: NO se migra vak_diagnostics.institution_id de `text` a `uuid`
-- en esta iteración.
--
-- Por qué:
--   1. vak_diagnostics es una tabla ya en producción y hoy NADA puebla esa
--      columna (confirmado: no hay flujo de escritura activo) — pero no hay
--      garantía de que futuras filas insertadas manualmente en la consola de
--      Supabase u otras integraciones respeten un formato uuid, y un
--      `alter column ... type uuid using institution_id::uuid` fallaría (o
--      pondría en null silenciosamente) ante cualquier valor no-uuid, lo cual
--      es un riesgo de pérdida de datos sobre una tabla productiva sin
--      necesidad real inmediata.
--   2. El plan de captura (ver docs/refactor/multi-tenant-plan.md) lee la
--      institución desde la URL de diagnóstico como un `slug` legible
--      (ej. /diagnostico/colegio-san-jose), no como uuid — mantener
--      `institution_id` como `text` evita una vuelta (slug -> uuid) en el
--      cliente antes de poder guardar el diagnóstico, que es el flujo más
--      simple y más robusto ante errores de red/timing.
--
-- En vez de una FK real (que exigiría el mismo tipo de dato), se agrega un
-- "FK suave" vía trigger: valida en insert/update que el `institution_id`
-- guardado coincide con un `institutions.slug` existente. Se mantiene el
-- índice ya creado en supabase_vak_diagnostics_schema.sql
-- (idx_vak_diag_institution) para las consultas por institución.
--
-- Migración futura (cuando el flujo de captura esté validado en producción):
--   1. Backfill: detectar filas de vak_diagnostics.institution_id que no
--      matcheen ningún institutions.slug (deberían ser 0 tras este trigger).
--   2. Agregar columna sombra `institution_id_uuid uuid references institutions(id)`.
--   3. Poblarla con un `update ... set institution_id_uuid = i.id from
--      institutions i where i.slug = vak_diagnostics.institution_id`.
--   4. Swap de columnas + `not null` si aplica + drop de la columna text.

create or replace function public.fn_validate_vak_institution_slug()
returns trigger
language plpgsql
as $$
begin
  if new.institution_id is not null and not exists (
    select 1 from public.institutions where slug = new.institution_id
  ) then
    raise exception
      'institution_id "%" no coincide con ningún institutions.slug', new.institution_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_vak_institution_slug on public.vak_diagnostics;

create trigger trg_validate_vak_institution_slug
  before insert or update of institution_id on public.vak_diagnostics
  for each row
  execute function public.fn_validate_vak_institution_slug();
