#!/usr/bin/env bash
# ============================================================================
# Runner turnkey del validador de migraciones 027/028.
#
# Levanta un Postgres efímero en Docker, ejecuta scripts/validate-account-
# migrations.sql y limpia el contenedor. No toca ninguna base real.
#
#   ./scripts/validate-account-migrations.sh
#
# Requisitos: Docker en ejecución. Sale con código ≠ 0 si la validación falla.
# ============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTAINER="edutechlife-migval-$$"
PORT="${PGVAL_PORT:-5599}"
PGIMAGE="${PGVAL_IMAGE:-postgres:15}"

if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker no está instalado. Usa la opción B/C del encabezado del .sql." >&2
  exit 1
fi

cleanup() { docker rm -f "$CONTAINER" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo ">> Levantando Postgres efímero ($PGIMAGE) en el puerto $PORT…"
# Se monta el repo en /repo (solo-lectura) para que los \ir de las migraciones
# resuelvan dentro del contenedor al usar psql -f.
docker run --rm -d --name "$CONTAINER" \
  -e POSTGRES_PASSWORD=validate \
  -v "$REPO_ROOT:/repo:ro" \
  -p "$PORT:5432" "$PGIMAGE" >/dev/null

echo ">> Esperando a que Postgres acepte conexiones…"
for _ in $(seq 1 30); do
  if docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1; then break; fi
  sleep 1
done

echo ">> Ejecutando validador…"
docker exec "$CONTAINER" \
  psql "postgresql://postgres:validate@localhost:5432/postgres" \
  -v ON_ERROR_STOP=1 \
  -f /repo/scripts/validate-account-migrations.sql

echo ">> Validación finalizada correctamente."
