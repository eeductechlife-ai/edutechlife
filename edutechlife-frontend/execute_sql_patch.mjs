// Script para ejecutar el parche SQL en Supabase (ES Module)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer las variables de entorno del archivo .env
const envPath = path.join(__dirname, '.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Error leyendo archivo .env:', error.message);
  process.exit(1);
}

// Parsear variables de entorno
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: No se encontraron las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔧 Configuración de Supabase encontrada:');
console.log(`   URL: ${SUPABASE_URL}`);
console.log(`   Anon Key: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);

// Leer el archivo SQL
const sqlPath = path.join(__dirname, 'supabase_forum_patch_2026.sql');
let sqlContent = '';
try {
  sqlContent = fs.readFileSync(sqlPath, 'utf8');
} catch (error) {
  console.error('❌ ERROR: No se pudo leer el archivo SQL:', error.message);
  process.exit(1);
}

console.log(`\n📄 Archivo SQL cargado: ${sqlPath}`);
console.log(`   Tamaño: ${sqlContent.length} caracteres`);

console.log('\n⚠️  IMPORTANTE: Este script requiere que ejecutes el SQL manualmente en la consola de Supabase.');
console.log('   Sigue estos pasos:');
console.log('   1. Ve a https://supabase.com/dashboard/project/srirrwpgswlnuqfgtule');
console.log('   2. Inicia sesión con tus credenciales');
console.log('   3. Ve a la sección "SQL Editor"');
console.log('   4. Crea un nuevo query');
console.log('   5. Copia y pega el contenido del archivo: supabase_forum_patch_2026.sql');
console.log('   6. Ejecuta el query');
console.log('\n📋 Contenido del SQL a ejecutar:');
console.log('='.repeat(80));
console.log(sqlContent.substring(0, 1000) + '...\n[Contenido truncado para visualización]');
console.log('='.repeat(80));

console.log('\n✅ INSTRUCCIONES COMPLETADAS:');
console.log('   1. Parche de seguridad frontend aplicado en ForumCommunity.jsx');
console.log('   2. Script SQL generado en: supabase_forum_patch_2026.sql');
console.log('   3. Ejecuta manualmente el SQL en la consola de Supabase');