#!/bin/bash
# 🐢 Tortuga - One-time Setup Script
# Run this after cloning to set up Tortuga completely

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$SKILL_DIR/../../.."

echo "🐢 Tortuga - Setup"
echo "=================="
echo ""

# 1. Install npm dependencies
echo "1. Instalando dependencias npm..."
cd "$SKILL_DIR" && npm install

# 2. Create .env from example if not exists
if [ ! -f "$SKILL_DIR/.env" ]; then
  echo "2. Creando .env desde .env.example..."
  cp "$SKILL_DIR/.env.example" "$SKILL_DIR/.env"
  echo "   ⚠️  Edita .env y agrega tu DEEPSEEK_API_KEY"
else
  echo "2. .env ya existe."
fi

# 3. Create docs directory
echo "3. Creando directorio docs/tortuga/..."
mkdir -p "$PROJECT_ROOT/docs/tortuga"/{analysis,plans,reports,vaults}

# 4. Install alias
echo "4. Instalando alias 'tortuga' en ~/.zshrc..."
ALIAS_CMD="alias tortuga='bash $SKILL_DIR/tortuga.sh'"
if grep -q "alias tortuga=" ~/.zshrc 2>/dev/null; then
  echo "   Alias ya existe en ~/.zshrc"
else
  echo "" >> ~/.zshrc
  echo "# 🐢 Tortuga - Autonomous Optimization Agent" >> ~/.zshrc
  echo "$ALIAS_CMD" >> ~/.zshrc
  echo "   ✅ Alias agregado a ~/.zshrc"
  echo "   Ejecuta: source ~/.zshrc"
fi

# 5. Ask about cron
echo ""
echo "5. Programacion 3x/dia en cron?"
read -p "   Instalar cron (08:00, 13:00, 18:00)? [y/N]: " INSTALL_CRON
if [ "$INSTALL_CRON" = "y" ] || [ "$INSTALL_CRON" = "Y" ]; then
  bash "$SKILL_DIR/scripts/cron/install.sh"
fi

echo ""
echo "✅ Tortuga configurado exitosamente!"
echo ""
echo "Comandos disponibles:"
echo "  tortuga              # Ejecucion completa"
echo "  tortuga --analyze    # Solo analisis"
echo "  tortuga --plan       # Analisis + plan"
echo "  tortuga --apply      # Analisis + plan + ejecutar"
echo ""
echo "Documentacion: docs/superpowers/specs/2026-07-04-tortuga-auto-optimizer-design.md"
