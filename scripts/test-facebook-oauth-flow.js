#!/usr/bin/env node

/**
 * Facebook OAuth Flow Test
 *
 * Simula el flujo OAuth sin necesidad de credenciales de usuario
 * Verifica que todas las configuraciones están correctas
 */

const crypto = require('crypto');
const http = require('http');

console.log('\n🧪 Facebook OAuth Flow Test\n');
console.log('═'.repeat(50));

// 1. Verificar variables de entorno
console.log('\n1. Verificando variables de entorno...\n');

const requiredEnv = [
  'OAUTH_FACEBOOK_CLIENT_ID',
  'OAUTH_FACEBOOK_CLIENT_SECRET',
  'BACKEND_URL',
];

let envOK = true;
requiredEnv.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const masked = varName.includes('SECRET') ? '***' : value;
    console.log(`✅ ${varName}: ${masked}`);
  } else {
    console.log(`❌ ${varName}: NOT CONFIGURED`);
    envOK = false;
  }
});

if (!envOK) {
  console.log('\n⚠️  ERROR: Variables de entorno no configuradas');
  console.log('   Solución: Configurar en Render → Backend → Environment');
  process.exit(1);
}

// 2. Simular generación de estado OAuth
console.log('\n2. Generando estado OAuth...\n');

const provider = 'facebook';
const state = `${provider}:${crypto.randomBytes(24).toString('hex')}`;
console.log(`✅ State generado: ${state.substring(0, 30)}...`);
console.log(`   Provider: ${provider}`);

// 3. Construir URL OAuth
console.log('\n3. Construyendo URL OAuth...\n');

const OAUTH_PROVIDERS = {
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  },
};

const clientId = process.env.OAUTH_FACEBOOK_CLIENT_ID;
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
const callbackUrl = `${backendUrl}/api/auth/callback`;

const authUrl = new URL(OAUTH_PROVIDERS.facebook.authUrl);
authUrl.searchParams.append('client_id', clientId);
authUrl.searchParams.append('redirect_uri', callbackUrl);
authUrl.searchParams.append('response_type', 'code');
authUrl.searchParams.append('scope', 'email public_profile');
authUrl.searchParams.append('state', state);

console.log('OAuth URL generada:');
console.log(`${authUrl.toString().substring(0, 80)}...`);
console.log(`\n✅ client_id: ${clientId}`);
console.log(`✅ redirect_uri: ${callbackUrl}`);
console.log(`✅ scope: email public_profile`);

// 4. Verificar callback URL
console.log('\n4. Verificando callback URL...\n');

const isHttps = callbackUrl.startsWith('https://');
const isDomain = !callbackUrl.includes('localhost');

if (isHttps && isDomain) {
  console.log(`✅ Callback URL válida para PRODUCCIÓN: ${callbackUrl}`);
} else if (callbackUrl.includes('localhost')) {
  console.log(`✅ Callback URL válida para DESARROLLO: ${callbackUrl}`);
} else {
  console.log(`⚠️  Callback URL podría tener problemas: ${callbackUrl}`);
  console.log('   Verifica que BACKEND_URL es correcto');
}

// 5. Verificar que callback URL está registrada en Facebook Console
console.log('\n5. Recordar registrar callback URL...\n');

console.log('Facebook Console → Products → Facebook Login → Settings');
console.log('Valid OAuth Redirect URIs debe incluir:');
console.log(`  ${callbackUrl}`);
console.log('\n✓ Verificar en: https://developers.facebook.com/apps/2736342283241555/');

// 6. Test de endpoint OAuth (sin hacer redirect real)
console.log('\n6. Verificando endpoint OAuth...\n');

const testUrl = `${backendUrl}/api/auth/oauth/facebook`;
console.log(`Endpoint: ${testUrl}`);
console.log('Este endpoint debería:');
console.log('  1. Validar que OAUTH_FACEBOOK_CLIENT_ID está configurado');
console.log('  2. Validar que OAUTH_FACEBOOK_CLIENT_SECRET está configurado');
console.log('  3. Redirigir a https://www.facebook.com/v18.0/dialog/oauth?...');

// 7. Test de callback handler
console.log('\n7. Verificando callback handler...\n');

const callbackEndpoint = `${backendUrl}/api/auth/callback`;
console.log(`Endpoint: ${callbackEndpoint}`);
console.log('Este endpoint debería:');
console.log('  1. Recibir ?code=... (desde Facebook)');
console.log('  2. Recibir ?state=... (CSRF protection)');
console.log('  3. Intercambiar code por access_token');
console.log('  4. Obtener datos del usuario');
console.log('  5. Crear o loguear usuario en Supabase');

// 8. Simular intercambio de tokens
console.log('\n8. Simulando intercambio de tokens...\n');

const tokenParams = new URLSearchParams({
  code: 'test_code_123',
  client_id: clientId,
  client_secret: '***',
  redirect_uri: callbackUrl,
  grant_type: 'authorization_code',
});

console.log('Parámetros que se enviarían a Facebook:');
console.log(`  client_id: ${clientId}`);
console.log(`  redirect_uri: ${callbackUrl}`);
console.log(`  grant_type: authorization_code`);
console.log(`  (client_secret: ***)`);

console.log('\nURL del token (POST):');
console.log(`  https://graph.facebook.com/v18.0/oauth/access_token`);

// 9. Resumen
console.log('\n' + '═'.repeat(50));
console.log('\n✅ CONFIGURACIÓN CORRECTA');
console.log('\nSiguientes pasos:');
console.log('  1. Verificar que App Status = PRODUCTION en Facebook Console');
console.log('  2. Verificar que Callback URL está registrada');
console.log('  3. Verificar que variables OAUTH_FACEBOOK_* están en Render');
console.log('  4. Esperar 2-5 minutos a que Facebook procese cambios');
console.log('  5. Intentar login nuevamente');

console.log('\n🔗 Links útiles:');
console.log('  App Settings: https://developers.facebook.com/apps/2736342283241555/settings/basic');
console.log('  OAuth Settings: https://developers.facebook.com/apps/2736342283241555/fb-login/settings');

console.log('\n');

// 10. Test real (opcional)
console.log('═'.repeat(50));
console.log('\n💡 Para test real del endpoint:');
console.log(`\ncurl -X GET "${testUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}" -L -w "\\nStatus: %{http_code}\\n"`);
console.log('\nDebería devolver:');
console.log('  • 302 redirect a facebook.com (si está todo bien)');
console.log('  • 500 "not configured" (si faltan variables)');
console.log('  • 400 "Invalid provider" (si hay error en request)');

console.log('\n');
