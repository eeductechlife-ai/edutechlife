#!/bin/bash

# 🔐 EdutechLife API Keys Verification Script
# Ejecutar DESPUÉS de actualizar .env con las keys rotadas
# uso: bash verify-keys.sh

set -e

echo "🔍 Verificando API Keys..."
echo "================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

# Función para testing
test_connection() {
    local name=$1
    local cmd=$2

    echo -n "Testing $name... "
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        PASSED=$((PASSED+1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        FAILED=$((FAILED+1))
    fi
}

# Función para verificar variables .env
check_env() {
    local var=$1
    local file=$2

    if grep -q "^${var}=" "$file" 2>/dev/null; then
        local value=$(grep "^${var}=" "$file" | cut -d'=' -f2)
        if [ -z "$value" ]; then
            echo -e "${RED}❌ $var is empty${NC}"
            return 1
        else
            echo -e "${GREEN}✅ $var is set${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ $var not found${NC}"
        return 1
    fi
}

# 1. Verificar que .env archivos existen
echo ""
echo "1️⃣  Checking .env files exist..."
if [ -f "edutechlife-backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env exists${NC}"
else
    echo -e "${RED}❌ Backend .env NOT found${NC}"
    exit 1
fi

if [ -f "edutechlife-frontend/.env" ]; then
    echo -e "${GREEN}✅ Frontend .env exists${NC}"
else
    echo -e "${RED}❌ Frontend .env NOT found${NC}"
    exit 1
fi

# 2. Verificar variables están presentes
echo ""
echo "2️⃣  Checking environment variables..."

check_env "SUPABASE_URL" "edutechlife-backend/.env"
check_env "SUPABASE_SERVICE_ROLE_KEY" "edutechlife-backend/.env"
check_env "GOOGLE_TTS_API_KEY" "edutechlife-backend/.env"
if grep -q "^STRIPE_SECRET_KEY=" "edutechlife-backend/.env" 2>/dev/null; then
    check_env "STRIPE_SECRET_KEY" "edutechlife-backend/.env"
else
    echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY not set (opcional — Stripe desactivado)${NC}"
fi

# 3. Verificar formato de keys
echo ""
echo "3️⃣  Checking key formats..."

# SUPABASE ANON KEY should start with eyJ (base64 encoded JWT)
if grep "^VITE_SUPABASE_ANON_KEY=eyJ" "edutechlife-frontend/.env" > /dev/null; then
    echo -e "${GREEN}✅ SUPABASE_ANON_KEY format correct${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${RED}❌ SUPABASE_ANON_KEY format incorrect (should start with eyJ)${NC}"
    FAILED=$((FAILED+1))
fi

# GOOGLE TTS KEY should start with AIza
if grep "^GOOGLE_TTS_API_KEY=AIza" "edutechlife-backend/.env" > /dev/null; then
    echo -e "${GREEN}✅ GOOGLE_TTS_API_KEY format correct${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${YELLOW}⚠️  GOOGLE_TTS_API_KEY format not verified (check manually)${NC}"
fi

# STRIPE KEY should start with sk_
if grep "^STRIPE_SECRET_KEY=sk_" "edutechlife-backend/.env" > /dev/null; then
    echo -e "${GREEN}✅ STRIPE_SECRET_KEY format correct${NC}"
    PASSED=$((PASSED+1))
else
    echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY format not verified (check manually)${NC}"
fi

# 4. Verificar .env no está en git
echo ""
echo "4️⃣  Checking .env is NOT tracked in git..."
if git ls-files | grep -E "^\\.env$|backend/\\.env$|frontend/\\.env$" > /dev/null; then
    echo -e "${RED}❌ .env files are tracked in git! Run: git rm --cached .env${NC}"
    FAILED=$((FAILED+1))
else
    echo -e "${GREEN}✅ .env files properly in .gitignore${NC}"
    PASSED=$((PASSED+1))
fi

# 5. Verificar cambios de código de seguridad
echo ""
echo "5️⃣  Checking security code changes..."

if grep -q "unsafe-inline" "edutechlife-backend/src/app.js" 2>/dev/null; then
    echo -e "${RED}❌ unsafe-inline still in CSP${NC}"
    FAILED=$((FAILED+1))
else
    echo -e "${GREEN}✅ unsafe-inline removed from CSP${NC}"
    PASSED=$((PASSED+1))
fi

if grep -q "unsafe-eval" "edutechlife-backend/src/app.js" 2>/dev/null; then
    echo -e "${RED}❌ unsafe-eval still in CSP${NC}"
    FAILED=$((FAILED+1))
else
    echo -e "${GREEN}✅ unsafe-eval removed from CSP${NC}"
    PASSED=$((PASSED+1))
fi

if grep -q "username === '123'" "edutechlife-frontend/src/components/AdminLoginModal.jsx" 2>/dev/null; then
    echo -e "${RED}❌ Hardcoded admin credentials still present${NC}"
    FAILED=$((FAILED+1))
else
    echo -e "${GREEN}✅ Hardcoded admin credentials removed${NC}"
    PASSED=$((PASSED+1))
fi

# 6. Resumen
echo ""
echo "================================"
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Next step: Run 'npm audit fix' in both directories"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please review above.${NC}"
    exit 1
fi
