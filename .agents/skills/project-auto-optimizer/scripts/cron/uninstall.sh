#!/bin/bash
# 🐢 Tortuga - Cron Uninstall

echo "🐢 Desinstalando Tortuga de cron..."
(crontab -l 2>/dev/null | grep -v "tortuga") | crontab -
echo "✅ Tortuga eliminado de cron."
