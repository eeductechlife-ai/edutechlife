-- Corrige profiles.full_name de usuarios cuyo nombre quedó como el prefijo del
-- correo (el trigger handle_new_user caía a split_part(email,'@',1) cuando el
-- registro no enviaba full_name). Solo toca filas donde:
--   * full_name = prefijo del correo (valor derivado, no editado por el usuario)
--   * public.users tiene first_name/last_name reales
-- No modifica auth.users ni public.users. Idempotente: tras correrlo, esas
-- filas dejan de cumplir la condición.

-- 1) Vista previa (solo lectura)
select p.id, p.full_name as old_name,
       btrim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')) as new_name
from public.profiles p
join public.users u on u.id::text = p.id::text
where p.full_name = split_part(p.email, '@', 1)
  and nullif(btrim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')), '') is not null;

-- 2) Aplicar
update public.profiles p
set full_name = btrim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')),
    updated_at = now()
from public.users u
where u.id::text = p.id::text
  and p.full_name = split_part(p.email, '@', 1)
  and nullif(btrim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')), '') is not null;

-- Rollback (valores anteriores): ver el SELECT de vista previa; el prefijo del
-- correo se restaura con:
--   update public.profiles set full_name = split_part(email, '@', 1) where id in (...);
