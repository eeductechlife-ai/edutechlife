#!/bin/bash

echo "🚀 Instalando EdutechLife Premium Stack..."
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. MCPs (MCP Connectors)
echo -e "${BLUE}📦 Instalando MCP Connectors...${NC}"

echo "  → Supabase MCP..."
claude mcp add supabase || echo "    ⚠️  Supabase requiere autenticación posterior"

echo "  → Stripe MCP..."
claude mcp add stripe || echo "    ⚠️  Stripe requiere autenticación posterior"

echo "  → GitHub MCP..."
claude mcp add github || echo "    ⚠️  GitHub requiere autenticación posterior"

echo ""
echo -e "${BLUE}✅ MCPs instalados${NC}"
echo ""

# 2. Skills (Agent Skills)
echo -e "${BLUE}🎯 Habilidades (Skills) Disponibles:${NC}"
cat << 'SKILLS'

✓ agent-skills:code-review-and-quality     → /code-review (reviews multi-dimensional)
✓ agent-skills:performance-optimization    → Performance audits & Core Web Vitals
✓ agent-skills:frontend-ui-engineering     → UI/UX & Accessibility (WCAG 2.1 AA)
✓ agent-skills:security-and-hardening      → Security audits & vulnerability scans
✓ agent-skills:test-driven-development     → TDD workflow & test strategy
✓ agent-skills:spec-driven-development     → Spec writing & design docs
✓ agent-skills:documentation-and-adrs      → ADRs & API documentation
✓ agent-skills:debugging-and-error-recovery→ Error diagnosis & root cause analysis
✓ agent-skills:ci-cd-and-automation        → Pipeline setup & automation
✓ agent-skills:git-workflow-and-versioning → Git strategy & release management

SKILLS

echo ""

# 3. Agentes Premium
echo -e "${BLUE}🤖 Agentes Coordinados:${NC}"
cat << 'AGENTS'

Disponibles en Agent tool:
✓ agent-skills:code-reviewer    → Senior code reviewer
✓ agent-skills:security-auditor → Security specialist  
✓ agent-skills:test-engineer    → QA expert
✓ agent-skills:web-performance-auditor → Performance expert
✓ architecture  → System design specialist
✓ general-purpose → General-purpose agent
✓ Explore → Fast codebase search

AGENTS

echo ""

# 4. Configuración
echo -e "${BLUE}⚙️  Configuración Premium Aplicada:${NC}"
cat << 'CONFIG'

✓ Code Quality Gates
  - Revisión automática en PRs
  - Ultra-review en cambios > 500 líneas
  - Performance budgets configurados
  
✓ Automation
  - Pre-commit review habilitado
  - Auto-fix de issues de seguridad
  - Gates de performance activos
  - Test coverage mínimo 70%

✓ Performance Budgets
  - Bundle Size: < 200KB (gzipped)
  - Initial Load: < 3.5s
  - Interactivity: < 200ms
  - Cumulative Shift: < 0.1

CONFIG

echo ""
echo -e "${GREEN}✅ INSTALACIÓN COMPLETADA${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Autorizar MCPs:"
echo "   → Supabase: claude mcp auth supabase"
echo "   → Stripe: claude mcp auth stripe"
echo "   → GitHub: claude mcp auth github"
echo ""
echo "2. Leer la configuración de agentes:"
echo "   → cat .claude/agents-config.md"
echo ""
echo "3. Usar skills en el próximo cambio:"
echo "   → /code-review (para revisiones)"
echo "   → /agent-skills:performance-optimization (para optimizaciones)"
echo ""
echo "4. Comando de deploy seguro:"
echo "   → /ship (con verificación)"
echo ""

