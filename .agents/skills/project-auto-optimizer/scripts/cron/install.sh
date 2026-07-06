#!/bin/bash
# 🐢 Tortuga - Cron Setup
# Installs Tortuga to run 3 times per day (08:00, 13:00, 18:00)
#
# Usage: bash cron/install.sh
# Remove: bash cron/uninstall.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$SKILL_DIR/../../.."
CRON_LOG="$PROJECT_ROOT/docs/tortuga/cron.log"

mkdir -p "$(dirname "$CRON_LOG")"

CRON_CMD="0 8,13,18 * * * cd $PROJECT_ROOT && npx tsx $SKILL_DIR/src/index.ts --auto >> $CRON_LOG 2>&1"

# Check if already installed
EXISTING=$(crontab -l 2>/dev/null | grep -c "tortuga")

if [ "$EXISTING" -gt 0 ]; then
  echo "🐢 Tortuga ya está instalado en cron. Actualizando..."
  (crontab -l 2>/dev/null | grep -v "tortuga"; echo "$CRON_CMD") | crontab -
else
  echo "🐢 Instalando Tortuga en cron (3x/día: 08:00, 13:00, 18:00)..."
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
fi

echo "✅ Tortuga programado: 08:00, 13:00, 18:00 (America/Mexico_City)"
echo "   Logs: $CRON_LOG"
echo ""
echo "Para verificar: crontab -l | grep tortuga"
echo "Para desinstalar: bash $SCRIPT_DIR/uninstall.sh"
