-- Memoria de agentes (Nico y Max). Guarda un resumen corto, no conversaciones.
-- Solo el backend (service role) la lee y escribe: RLS activo y sin políticas,
-- así que anon y authenticated no ven ni cambian nada directamente.
-- Retención: cada fila vence a los 90 días; las vencidas se ignoran al leer.

CREATE TABLE IF NOT EXISTS public.agent_memory (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent       text NOT NULL CHECK (agent IN ('nico', 'max')),
  -- nico: id aleatorio del navegador (anónimo). max: auth user id.
  subject_key text NOT NULL CHECK (char_length(subject_key) BETWEEN 8 AND 80),
  summary     text NOT NULL DEFAULT '' CHECK (char_length(summary) <= 2000),
  -- Turnos de usuario vistos: cada 6 se regenera el resumen.
  turns       integer NOT NULL DEFAULT 0 CHECK (turns >= 0),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  CONSTRAINT agent_memory_agent_subject_key UNIQUE (agent, subject_key)
);

CREATE INDEX IF NOT EXISTS agent_memory_expires_at_idx ON public.agent_memory (expires_at);

ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
