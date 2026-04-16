#!/usr/bin/env node

/**
 * Script para configurar Supabase JWT Settings con Clerk JWKS URL
 * 
 * USO: node scripts/configure-supabase-jwt.js "https://tu-app.clerk.accounts.dev/.well-known/jwks.json"
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración
const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXJyd3Bnc3dsbnVxZmd0dWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTkyNywiZXhwIjoyMDkwOTI3OTI3fQ.LsjO_sbMBedOs1s2ulfps8bX2VHCHWJKmZOmx1RAmK4';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function configureSupabaseJWT(jwksUrl) {
  console.log('⚙️ Configurando Supabase JWT Settings con Clerk...');
  console.log('📋 Supabase URL:', supabaseUrl);
  console.log('🔗 JWKS URL:', jwksUrl);
  
  if (!jwksUrl || !jwksUrl.includes('.well-known/jwks.json')) {
    console.error('❌ JWKS URL inválida. Debe ser una URL que termine en /.well-known/jwks.json');
    console.error('Ejemplo: https://your-app.clerk.accounts.dev/.well-known/jwks.json');
    process.exit(1);
  }
  
  // NOTA: La configuración de JWT en Supabase debe hacerse manualmente en el dashboard
  // Este script solo verifica y proporciona instrucciones
  
  console.log('\n📋 INSTRUCCIONES PARA CONFIGURAR SUPABASE JWT:');
  console.log('==============================================');
  console.log('1. Ve a: https://supabase.com/dashboard/project/srirrwpgswlnuqfgtule');
  console.log('2. Navega a: Authentication → Settings');
  console.log('3. Ve a la sección: JWT Settings');
  console.log('4. Agrega un nuevo JWT issuer con:');
  console.log('   - Issuer: clerk');
  console.log('   - JWKS URL:', jwksUrl);
  console.log('   - Algorithm: RS256');
  console.log('   - JWT Claim: iss');
  console.log('5. Guarda los cambios');
  console.log('\n🔍 Para verificar la configuración:');
  console.log('   - Ve a: Authentication → Providers');
  console.log('   - Deberías ver "clerk" en la lista de JWT providers');
  
  // Verificar configuración actual
  try {
    console.log('\n🔍 Verificando configuración actual...');
    
    // Intentar obtener configuración de auth (esto puede variar según API)
    const { data: settings, error } = await supabase
      .from('auth.settings')
      .select('*')
      .single();
    
    if (error) {
      console.log('⚠️  No se pudo obtener configuración automáticamente');
      console.log('   Esto es normal - configura manualmente siguiendo las instrucciones');
    } else {
      console.log('✅ Configuración obtenida:', settings);
    }
    
  } catch (err) {
    console.log('⚠️  Error verificando configuración:', err.message);
  }
  
  // Probar integración después de configurar
  console.log('\n🧪 PARA PROBAR INTEGRACIÓN DESPUÉS DE CONFIGURAR:');
  console.log('1. Ejecuta: cd edutechlife-frontend && node scripts/quick-test.js');
  console.log('2. Inicia la app: npm run dev');
  console.log('3. Login con Clerk');
  console.log('4. Verifica que el JWT se genera y valida correctamente');
  
  // Guardar JWKS URL para referencia
  const envPath = path.join(__dirname, '..', 'edutechlife-frontend', '.env.local');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    if (!envContent.includes('VITE_CLERK_JWKS_URL')) {
      envContent += `\n# Clerk JWKS URL para Supabase JWT\nVITE_CLERK_JWKS_URL=${jwksUrl}\n`;
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ JWKS URL guardada en .env.local como VITE_CLERK_JWKS_URL');
    } else {
      console.log('\nℹ️  JWKS URL ya existe en .env.local');
    }
  } catch (err) {
    console.log('⚠️  No se pudo guardar en .env.local:', err.message);
  }
  
  return true;
}

// Ejecutar si se proporciona JWKS URL
const jwksUrl = process.argv[2];
if (jwksUrl) {
  configureSupabaseJWT(jwksUrl).catch(console.error);
} else {
  console.log('❌ Uso: node scripts/configure-supabase-jwt.js "https://tu-app.clerk.accounts.dev/.well-known/jwks.json"');
  console.log('\n📋 Para obtener JWKS URL:');
  console.log('1. Ve a https://dashboard.clerk.com');
  console.log('2. Tu app → API Keys → Advanced');
  console.log('3. Busca "JSON Web Key Set (JWKS) URL"');
  console.log('4. Copia la URL completa');
  process.exit(1);
}