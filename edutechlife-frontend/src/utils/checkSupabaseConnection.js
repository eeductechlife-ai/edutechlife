/**
 * Script para verificar conexión con Supabase y estructura de tablas
 * Útil para debugging y verificación de migraciones
 */

import { supabase } from '../lib/supabase';

async function checkSupabaseConnection() {
  console.log('🔍 VERIFICANDO CONEXIÓN SUPABASE');
  console.log('='.repeat(60));
  
  try {
    // 1. Verificar credenciales
    console.log('\n1. 🔑 Verificando credenciales...');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log(`   URL: ${supabaseUrl ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   Key: ${supabaseKey ? '✅ Configurada' : '❌ No configurada'}`);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('   ❌ Credenciales incompletas. Revisa tu archivo .env');
      return false;
    }
    
    // 2. Verificar conexión básica
    console.log('\n2. 🔌 Probando conexión a Supabase...');
    const { data: healthData, error: healthError } = await supabase
      .from('_health')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (healthError) {
      console.log(`   ℹ️ No se pudo acceder a _health, probando otra tabla...`);
    } else {
      console.log('   ✅ Conexión básica exitosa');
    }
    
    // 3. Verificar tabla profiles
    console.log('\n3. 📊 Verificando tabla profiles...');
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (profilesError) {
        console.error(`   ❌ Error al acceder a tabla profiles:`, profilesError.message);
        
        // Verificar si es error de tabla no existente
        if (profilesError.message.includes('does not exist')) {
          console.log('   💡 La tabla profiles no existe. Debes crearla primero.');
          console.log('   💡 Ejecuta en Supabase:');
          console.log('      CREATE TABLE profiles (');
          console.log('        id UUID PRIMARY KEY,');
          console.log('        email TEXT,');
          console.log('        full_name TEXT,');
          console.log('        phone TEXT,');
          console.log('        role TEXT DEFAULT \'student\',');
          console.log('        avatar_url TEXT,');
          console.log('        created_at TIMESTAMP DEFAULT NOW(),');
          console.log('        updated_at TIMESTAMP DEFAULT NOW()');
          console.log('      );');
        }
      } else {
        console.log('   ✅ Tabla profiles accesible');
      }
    } catch (tableError) {
      console.error('   ❌ Error inesperado:', tableError);
    }
    
    // 4. Verificar columnas específicas
    console.log('\n4. 🏗️ Verificando columnas en profiles...');
    const requiredColumns = ['full_name', 'phone', 'display_name', 'phone_number'];
    
    for (const column of requiredColumns) {
      try {
        // Intentar consultar con la columna
        const { error: columnError } = await supabase
          .from('profiles')
          .select(column)
          .limit(1);
        
        if (columnError) {
          if (columnError.message.includes(column)) {
            console.log(`   ❌ Columna "${column}" no encontrada`);
          }
        } else {
          console.log(`   ✅ Columna "${column}" existe`);
        }
      } catch (colError) {
        console.log(`   ⚠️  Error verificando columna "${column}":`, colError.message);
      }
    }
    
    // 5. Verificar datos de ejemplo
    console.log('\n5. 📝 Verificando datos existentes...');
    try {
      const { data: sampleData, error: sampleError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role')
        .limit(3);
      
      if (sampleError) {
        console.error('   ❌ Error al obtener datos:', sampleError.message);
      } else if (sampleData && sampleData.length > 0) {
        console.log(`   ✅ ${sampleData.length} perfiles encontrados`);
        sampleData.forEach((profile, index) => {
          console.log(`      ${index + 1}. ${profile.email} - ${profile.full_name || 'Sin nombre'}`);
        });
      } else {
        console.log('   ℹ️ La tabla profiles está vacía');
      }
    } catch (dataError) {
      console.error('   ❌ Error inesperado:', dataError);
    }
    
    // 6. Verificar autenticación
    console.log('\n6. 🔐 Verificando autenticación...');
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.log(`   ℹ️ No hay sesión activa: ${authError.message}`);
      } else if (authData.session) {
        console.log(`   ✅ Sesión activa encontrada para: ${authData.session.user.email}`);
        console.log(`      User ID: ${authData.session.user.id.substring(0, 8)}...`);
      } else {
        console.log('   ℹ️ No hay sesión activa (esto es normal si no has iniciado sesión)');
      }
    } catch (authError) {
      console.error('   ❌ Error en autenticación:', authError);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🧪 VERIFICACIÓN COMPLETADA');
    
    // Resumen
    console.log('\n📋 RESUMEN:');
    console.log('1. Ejecuta la migración SQL si faltan columnas');
    console.log('2. Inicia sesión para probar funcionalidades completas');
    console.log('3. Revisa la consola del navegador para errores específicos');
    console.log('4. Prueba UserProfileSmartCard después de la migración');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error);
    console.error('Stack:', error.stack);
    return false;
  }
}

// Ejecutar automáticamente si se llama desde el navegador
if (typeof window !== 'undefined') {
  console.log('🔄 Preparando verificación de Supabase...');
  
  // Esperar a que la página cargue
  setTimeout(() => {
    checkSupabaseConnection().then(success => {
      if (success) {
        console.log('\n🎯 Para probar la funcionalidad completa:');
        console.log('1. Ejecuta la migración SQL si es necesario');
        console.log('2. Inicia sesión en la aplicación');
        console.log('3. Haz clic en tu avatar > "Mi Perfil"');
        console.log('4. Prueba la edición inline');
      } else {
        console.log('\n⚠️  Se encontraron problemas. Revisa los mensajes anteriores.');
      }
    });
  }, 1000);
}

export { checkSupabaseConnection };