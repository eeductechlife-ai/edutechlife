// Script para verificar estructura de tabla profiles después de ejecutar SQL fix
import { createClient } from '@supabase/supabase-js';

// Configuración desde .env
const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXJyd3Bnc3dsbnVxZmd0dWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTE5MjcsImV4cCI6MjA5MDkyNzkyN30.ElxGbhsfncV2m3OVr3P5X3HqAfwGMbAOGBEGzKqRV0A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTableStructure() {
  console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLA PROFILES');
  console.log('===========================================\n');
  
  try {
    // 1. Verificar información de esquema
    console.log('1. Consultando información del esquema...');
    
    // Usar query SQL directa para obtener información de columnas
    const { data: columnsData, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(0); // Solo metadata, sin datos
    
    if (columnsError) {
      console.log('❌ Error al consultar esquema:', columnsError.message);
      return;
    }
    
    console.log('✅ Esquema consultado exitosamente');
    
    // 2. Intentar insertar un registro de prueba para verificar columnas
    console.log('\n2. Verificando columnas con registro de prueba...');
    
    const testUserId = 'test-user-' + Date.now();
    const testData = {
      id: testUserId,
      email: 'test@edutechlife.co',
      full_name: 'Usuario Test',
      phone: '3001234567',
      role: 'student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([testData])
        .select();
      
      if (insertError) {
        console.log('⚠️ Error al insertar registro de prueba:', insertError.message);
        console.log('💡 Esto puede indicar columnas faltantes o tipos incorrectos');
        
        // Analizar error para diagnóstico
        if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
          console.log('\n🔍 DIAGNÓSTICO: Columnas faltantes detectadas');
          console.log('El error sugiere que algunas columnas no existen en la tabla');
          console.log('Columnas esperadas: id, email, full_name, phone, role, created_at, updated_at');
        }
      } else {
        console.log('✅ Registro de prueba insertado exitosamente');
        console.log('📊 Datos insertados:', insertData[0]);
        
        // Limpiar registro de prueba
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', testUserId);
        
        if (!deleteError) {
          console.log('✅ Registro de prueba eliminado');
        }
      }
    } catch (insertErr) {
      console.log('❌ Error en prueba de inserción:', insertErr.message);
    }
    
    // 3. Verificar trigger creando un usuario real (simulado)
    console.log('\n3. Verificando trigger handle_new_user...');
    console.log('💡 Para probar el trigger completamente, necesitas:');
    console.log('   a. Registrar un usuario real en la aplicación');
    console.log('   b. Verificar que se cree automáticamente en tabla profiles');
    
    // 4. Verificar permisos RLS
    console.log('\n4. Verificando políticas RLS...');
    console.log('💡 Las políticas RLS se configuran en el script SQL');
    console.log('   - SELECT: authenticated users can view all profiles');
    console.log('   - INSERT: users can only create their own profile');
    console.log('   - UPDATE: users can only update their own profile');
    
    // 5. Consultar información de columnas desde information_schema (si fuera posible)
    console.log('\n5. Resumen de verificación:');
    console.log('==========================');
    console.log('✅ Conexión Supabase: FUNCIONA');
    console.log('✅ Tabla profiles: ACCESIBLE');
    console.log('🔍 Columnas: Necesita testing con registro real');
    console.log('🔍 Trigger: Necesita testing con registro real');
    console.log('🔍 RLS: Configurado en script SQL');
    
    console.log('\n🚀 PRÓXIMOS PASOS PARA TESTING:');
    console.log('===============================');
    console.log('1. Inicia la aplicación: npm run dev');
    console.log('2. Registra un usuario nuevo');
    console.log('3. Verifica consola del navegador para mensajes');
    console.log('4. Revisa tabla profiles en Supabase Table Editor');
    console.log('5. Abre el perfil desde el dropdown de usuario');
    console.log('6. Edita teléfono y verifica que se guarde');
    
    console.log('\n📊 MENSAJES ESPERADOS EN CONSOLA:');
    console.log('==================================');
    console.log('✅ "Perfil encontrado en Supabase: {...}"');
    console.log('✅ "Campo phone guardado en Supabase"');
    console.log('✅ "Datos actualizados desde Supabase"');
    console.log('❌ Si ves "Clerk (temporal)" o "No registrado", hay problemas');
    
  } catch (error) {
    console.error('❌ Error crítico en verificación:', error);
  }
}

// Ejecutar verificación
verifyTableStructure().then(() => {
  console.log('\n🎯 VERIFICACIÓN COMPLETADA');
  console.log('Ahora procede con el testing manual del flujo completo.');
});