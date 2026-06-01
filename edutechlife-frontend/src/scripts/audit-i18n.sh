#!/usr/bin/env bash
set -euo pipefail

SEARCH_PATH="${1:-src/components}"

echo "=== i18n Audit: $SEARCH_PATH ==="

find "$SEARCH_PATH" -name '*.jsx' -o -name '*.tsx' | while IFS= read -r file; do
  case "$file" in *__tests__*|*.test.*|*.spec.*) continue;; esac
  case "$file" in */node_modules/*) continue;; esac

  if grep -q 'useTranslation' "$file" 2>/dev/null; then
    has_i18n="yes"
  else
    has_i18n="no"
  fi

  violations=$(grep -cP '>[^<]*[áéíóúñÁÉÍÓÚÑ]' "$file" 2>/dev/null || echo 0)

  if [ "$violations" != "0" ] && [ "$violations" -gt 0 ]; then
    if [ "$has_i18n" = "no" ]; then
      echo "[WARN]  $file — no i18n, $violations potential hardcoded texts"
    else
      echo "[INFO]  $file — has i18n, $violations potential hardcoded texts"
    fi
  elif [ "$has_i18n" = "no" ]; then
    echo "[OK]    $file — no i18n needed (no Spanish text found)"
  fi
done

echo "=== Done ==="
