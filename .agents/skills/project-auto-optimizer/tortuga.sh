#!/bin/bash
# 🐢 Tortuga - Autonomous Optimization Agent
# Usage: tortuga [--analyze-only|--plan|--apply|--auto]
# 
# Install: ln -sf "$(pwd)/tortuga.sh" /usr/local/bin/tortuga
# Or add alias to ~/.zshrc: alias tortuga='bash /path/to/tortuga.sh'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../../../.."

cd "$PROJECT_ROOT" || exit 1

MODE="${1:-}"

case "$MODE" in
  --analyze-only|--plan|--apply|--auto)
    npx tsx "$SCRIPT_DIR/src/index.ts" "$MODE"
    ;;
  *)
    npx tsx "$SCRIPT_DIR/src/index.ts"
    ;;
esac
