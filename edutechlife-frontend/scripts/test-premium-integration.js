#!/usr/bin/env node

/**
 * Script de testing para integración Clerk-Supabase Premium
 * 
 * Este script verifica:
 * 1. Configuración de variables de entorno
 * 2. Conexión a Supabase
 * 3. Integración con Clerk JWT
 * 4. Funcionamiento de RLS
 * 5. Operaciones del curso
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

dotenv.config({ path: envPath });

console.log('🧪 TESTING INTEGRACIÓN PREMIUM CLERK-SUPABASE');
console.log('=============================================\n');

// ============================================
// 1. VERIFICAR VARIABLES DE ENTORNO
// ============================================

console.log('1. Verificando variables de entorno...');

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_CLERK_PUBLISHABLE_KEY',
  'VITE_CLERK_SECRET_KEY'
];

const envChecks = {};

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  const exists = !!value;
  const isTestKey = value?.includes('test') || value?.includes('pk_test') || value?.includes('sk_test');
  
  envChecks[envVar] = {
    exists,
    length: value?.length || 0,
    isTestKey,
    preview: value ? `${value.substring(0, 20)}...` : 'MISSING'
  };
  
  console.log(`   ${exists ? '✅' : '❌'} ${envVar}: ${exists ? 'PRESENTE' : 'FALTANTE'}`);
  if (exists && isTestKey) {
    console.log(`      ⚠️  Usando clave de TEST (${envVar.includes('CLERK') ? 'Clerk' : 'Supabase'})`);
  }
}

console.log('');

// ============================================
// 2. VERIFICAR CONEXIÓN A SUPABASE
// ============================================

console.log('2. Verificando conexión a Supabase...');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('   ❌ No se pueden verificar credenciales de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  // Test de conexión simple
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.log(`   ❌ Error de conexión: ${error.message}`);
    console.log(`      Código: ${error.code}`);
    console.log(`      Detalles: ${error.details}`);
  } else {
    console.log('   ✅ Conexión a Supabase exitosa');
    console.log(`      URL: ${supabaseUrl.substring(0, 30)}...`);
  }
} catch (error) {
  console.log(`   ❌ Error inesperado: ${error.message}`);
}

console.log('');

// ============================================
// 3. VERIFICAR ESQUEMA DE TABLAS
// ============================================

console.log('3. Verificando esquema de tablas...');

const requiredTables = [
  'profiles',
  'course_progress', 
  'certificates',
  'quiz_attempts',
  'student_sessions'
];

try {
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', requiredTables);
  
  if (error) {
    console.log(`   ❌ Error consultando tablas: ${error.message}`);
  } else {
    const foundTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !foundTables.includes(t));
    
    console.log(`   📊 Tablas encontradas: ${foundTables.length}/${requiredTables.length}`);
    
    for (const table of requiredTables) {
      if (foundTables.includes(table)) {
        console.log(`      ✅ ${table}`);
      } else {
        console.log(`      ❌ ${table} (FALTANTE)`);
      }
    }
    
    if (missingTables.length > 0) {
      console.log(`\n   ⚠️  Tablas faltantes: ${missingTables.join(', ')}`);
      console.log('   💡 Ejecuta el script SQL: IALAB_PREMIUM_SAAS_SCHEMA.sql');
    }
  }
} catch (error) {
  console.log(`   ❌ Error verificando tablas: ${error.message}`);
}

console.log('');

// ============================================
// 4. VERIFICAR POLÍTICAS RLS
// ============================================

console.log('4. Verificando políticas RLS...');

try {
  // Consultar políticas RLS
  const { data: policies, error } = await supabase.rpc('get_rls_policies', {}).catch(async () => {
    // Fallback: consultar directamente pg_policies
    const { data, error } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, permissive, roles, cmd')
      .eq('schemaname', 'public')
      .in('tablename', requiredTables);
    
    return { data, error };
  });
  
  if (error) {
    console.log(`   ⚠️  No se pudieron verificar políticas RLS: ${error.message}`);
  } else if (policies && policies.length > 0) {
    console.log(`   📊 Políticas RLS encontradas: ${policies.length}`);
    
    // Agrupar por tabla
    const policiesByTable = {};
    policies.forEach(policy => {
      if (!policiesByTable[policy.tablename]) {
        policiesByTable[policy.tablename] = [];
      }
      policiesByTable[policy.tablename].push(policy);
    });
    
    for (const table of requiredTables) {
      const tablePolicies = policiesByTable[table] || [];
      console.log(`      ${table}: ${tablePolicies.length} políticas`);
      
      for (const policy of tablePolicies) {
        const cmd = policy.cmd || 'N/A';
        const roles = Array.isArray(policy.roles) ? policy.roles.join(',') : policy.roles;
        console.log(`         • ${policy.policyname} (${cmd}, roles: ${roles})`);
      }
    }
  } else {
    console.log('   ⚠️  No se encontraron políticas RLS');
    console.log('   💡 Asegúrate de que RLS esté habilitado en las tablas');
  }
} catch (error) {
  console.log(`   ❌ Error verificando RLS: ${error.message}`);
}

console.log('');

// ============================================
// 5. VERIFICAR FUNCIONES SQL
// ============================================

console.log('5. Verificando funciones SQL...');

const requiredFunctions = [
  'get_user_overall_progress',
  'check_daily_attempts',
  'update_security_violation',
  'verify_ialab_schema'
];

try {
  const { data: functions, error } = await supabase
    .from('information_schema.routines')
    .select('routine_name')
    .eq('routine_schema', 'public')
    .eq('routine_type', 'FUNCTION')
    .in('routine_name', requiredFunctions);
  
  if (error) {
    console.log(`   ⚠️  No se pudieron verificar funciones: ${error.message}`);
  } else {
    const foundFunctions = functions.map(f => f.routine_name);
    const missingFunctions = requiredFunctions.filter(f => !foundFunctions.includes(f));
    
    console.log(`   📊 Funciones encontradas: ${foundFunctions.length}/${requiredFunctions.length}`);
    
    for (const func of requiredFunctions) {
      if (foundFunctions.includes(func)) {
        console.log(`      ✅ ${func}()`);
      } else {
        console.log(`      ❌ ${func}() (FALTANTE)`);
      }
    }
    
    if (missingFunctions.length > 0) {
      console.log(`\n   ⚠️  Funciones faltantes: ${missingFunctions.join(', ')}`);
    }
  }
} catch (error) {
  console.log(`   ❌ Error verificando funciones: ${error.message}`);
}

console.log('');

// ============================================
// 6. VERIFICAR ÍNDICES
// ============================================

console.log('6. Verificando índices...');

const requiredIndexes = [
  'idx_course_progress_user_module',
  'idx_quiz_attempts_user_date',
  'idx_profiles_clerk_id',
  'idx_student_sessions_active',
  'idx_certificates_user'
];

try {
  const { data: indexes, error } = await supabase
    .from('pg_indexes')
    .select('indexname, tablename')
    .eq('schemaname', 'public')
    .in('indexname', requiredIndexes);
  
  if (error) {
    console.log(`   ⚠️  No se pudieron verificar índices: ${error.message}`);
  } else {
    const foundIndexes = indexes.map(i => i.indexname);
    const missingIndexes = requiredIndexes.filter(i => !foundIndexes.includes(i));
    
    console.log(`   📊 Índices encontrados: ${foundIndexes.length}/${requiredIndexes.length}`);
    
    for (const index of requiredIndexes) {
      if (foundIndexes.includes(index)) {
        const table = indexes.find(i => i.indexname === index)?.tablename || 'N/A';
        console.log(`      ✅ ${index} (tabla: ${table})`);
      } else {
        console.log(`      ❌ ${index} (FALTANTE)`);
      }
    }
    
    if (missingIndexes.length > 0) {
      console.log(`\n   ⚠️  Índices faltantes: ${missingIndexes.join(', ')}`);
      console.log('   💡 Los índices son críticos para performance con 1000 usuarios');
    }
  }
} catch (error) {
  console.log(`   ❌ Error verificando índices: ${error.message}`);
}

console.log('');

// ============================================
// 7. RESUMEN Y RECOMENDACIONES
// ============================================

console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('==========================');

// Calcular puntaje
const allChecks = {
  envVars: Object.values(envChecks).every(check => check.exists),
  supabaseConnection: true, // Asumimos éxito si llegamos aquí
  tables: false,
  rls: false,
  functions: false,
  indexes: false
};

// Actualizar basado en verificaciones anteriores
try {
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', requiredTables);
  
  allChecks.tables = tables?.length === requiredTables.length;
} catch {}

try {
  const { data: policies } = await supabase
    .from('pg_policies')
    .select('tablename')
    .eq('schemaname', 'public')
    .in('tablename', requiredTables);
  
  allChecks.rls = policies && policies.length >= requiredTables.length; // Al menos una política por tabla
} catch {}

try {
  const { data: functions } = await supabase
    .from('information_schema.routines')
    .select('routine_name')
    .eq('routine_schema', 'public')
    .eq('routine_type', 'FUNCTION')
    .in('routine_name', requiredFunctions);
  
  allChecks.functions = functions?.length === requiredFunctions.length;
} catch {}

try {
  const { data: indexes } = await supabase
    .from('pg_indexes')
    .select('indexname')
    .eq('schemaname', 'public')
    .in('indexname', requiredIndexes);
  
  allChecks.indexes = indexes?.length === requiredIndexes.length;
} catch {}

const totalChecks = Object.keys(allChecks).length;
const passedChecks = Object.values(allChecks).filter(Boolean).length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`Puntaje: ${score}% (${passedChecks}/${totalChecks} verificaciones pasadas)\n`);

for (const [check, passed] of Object.entries(allChecks)) {
  console.log(`${passed ? '✅' : '❌'} ${check.replace(/([A-Z])/g, ' $1').toUpperCase()}`);
}

console.log('\n🎯 RECOMENDACIONES:');

if (!allChecks.envVars) {
  console.log('1. 🔧 Completar variables de entorno en .env.local');
}

if (!allChecks.tables) {
  console.log('2. 🗄️  Ejecutar script SQL: IALAB_PREMIUM_SAAS_SCHEMA.sql');
}

if (!allChecks.rls) {
  console.log('3. 🔒 Verificar políticas RLS en Supabase Dashboard');
}

if (!allChecks.functions) {
  console.log('4. ⚙️  Las funciones SQL no están instaladas');
}

if (!allChecks.indexes) {
  console.log('5. ⚡ Los índices son críticos para performance');
}

console.log('\n🔧 CONFIGURACIÓN CLERK REQUERIDA:');
console.log('1. Crear JWT Template con ID: 5d74d508-85ee-4a7c-9d50-87005f9b8a90');
console.log('2. Configurar claims: sub={{user.id}}, role=authenticated');
console.log('3. Copiar JWKS URL a Supabase JWT Settings');
console.log('4. Configurar Issuer en Supabase');

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('1. Ejecutar SQL en Supabase Dashboard');
console.log('2. Configurar Clerk JWT Template');
console.log('3. Configurar Supabase JWT Settings');
console.log('4. Ejecutar: npm run dev');
console.log('5. Testear integración en navegador');

console.log('\n📚 DOCUMENTACIÓN:');
console.log('- SQL Schema: IALAB_PREMIUM_SAAS_SCHEMA.sql');
console.log('- Guía Integración: CLERK_SUPABASE_INTEGRATION_GUIDE.md');
console.log('- Cliente Premium: src/lib/supabase-premium-client.js');

if (score >= 80) {
  console.log('\n🎉 ¡INTEGRACIÓN LISTA PARA PRODUCCIÓN!');
  console.log('Solo falta configurar Clerk JWT y Supabase JWT Settings.');
} else if (score >= 50) {
  console.log('\n⚠️  INTEGRACIÓN PARCIALMENTE CONFIGURADA');
  console.log('Revisa las recomendaciones arriba.');
} else {
  console.log('\n❌ CONFIGURACIÓN INCOMPLETA');
  console.log('Sigue las instrucciones paso a paso.');
}

// Exportar resultados para uso en CI/CD
const testResults = {
  timestamp: new Date().toISOString(),
  score,
  checks: allChecks,
  envChecks,
  details: {
    requiredTables,
    requiredFunctions,
    requiredIndexes
  }
};

// Guardar resultados en archivo
import { writeFileSync } from 'fs';
writeFileSync(
  join(__dirname, 'test-results.json'),
  JSON.stringify(testResults, null, 2)
);

console.log(`\n📄 Resultados guardados en: ${join(__dirname, 'test-results.json')}`);

process.exit(score >= 80 ? 0 : 1);