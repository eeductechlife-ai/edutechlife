-- Ranking global de IALab.
-- user_progress solo deja leer la fila propia (RLS), por eso el ranking global
-- solo podía mostrar al propio estudiante. Esta función (SECURITY DEFINER)
-- devuelve únicamente nombre público, avatar y datos de gamificación de
-- cuentas IALab (adultos); nunca correos ni cuentas smartboard (menores).
--
-- Rollback: drop function public.ialab_leaderboard(integer);

create or replace function public.ialab_leaderboard(p_limit integer default 50)
returns table (user_id text, full_name text, avatar_url text, gamification_data jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select up.user_id,
         p.full_name,
         p.avatar_url,
         jsonb_build_object(
           'xp', up.gamification_data->'xp',
           'weeklyXp', up.gamification_data->'weeklyXp',
           'streak', up.gamification_data->'streak',
           'badges', coalesce(up.gamification_data->'badges', '[]'::jsonb)
         ) as gamification_data
  from public.user_progress up
  join public.users u on u.id::text = up.user_id and u.account_type = 'ialab'
  left join public.profiles p on p.id = up.user_id
  where up.activity_type = 'gamification'
    and up.resource_id = 'state'
    and coalesce((up.gamification_data->>'xp')::numeric, 0) > 0
  order by (up.gamification_data->>'xp')::numeric desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

revoke all on function public.ialab_leaderboard(integer) from public, anon;
grant execute on function public.ialab_leaderboard(integer) to authenticated;
