/**
 * Script de prueba para verificar integración Supabase + Neon optimizations
 */

import { supabase } from '../lib/supabase';
import { neonProfileService } from '../services/neonProfileService';

async function testProfileIntegration() {
  console.log('🧪 INICIANDO PRUEBAS DE INTEGRACIÓN SUPABASE + NEON');
  console.log('='.repeat(60));
  
  try {
    // 1. Verificar conexión a Supabase
    console.log('\n1. 🔌 Verificando conexión a Supabase...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Error de autenticación:', authError.message);
    } else if (authData.session) {
      console.log('✅ Sesión activa encontrada');
      console.log('   Usuario ID:', authData.session.user.id.substring(0, 8) + '...');
      console.log('   Email:', authData.session.user.email);
      
      const userId = authData.session.user.id;
      
      // 2. Probar servicio Neon optimizado
      console.log('\n2. 🚀 Probando servicio Neon optimizado...');
      
      // a. Obtener perfil
      console.log('   a. Obteniendo perfil...');
      const profile = await neonProfileService.getUserProfile(userId);
      
      if (profile) {
        console.log('   ✅ Perfil obtenido exitosamente');
        console.log('      Nombre:', profile.full_name || 'No especificado');
        console.log('      Teléfono:', profile.phone || 'No especificado');
        console.log('      Rol:', profile.role || 'No especificado');
      } else {
        console.log('   ℹ️ No se encontró perfil, se creará uno de prueba');
      }
      
      // b. Validaciones
      console.log('\n   b. Probando validaciones...');
      
      const testNames = [
        'Juan Pérez', // válido
        'Ana', // válido (3 caracteres)
        'A1', // inválido (menos de 3)
        'María 123', // inválido (números)
      ];
      
      testNames.forEach(name => {
        const validation = neonProfileService.validateNameFormat(name);
        console.log(`      "${name}": ${validation.valid ? '✅' : '❌'} ${validation.message || ''}`);
      });
      
      const testPhones = [
        '3001234567', // válido
        '123', // válido (menos de 10)
        '30012345678', // inválido (más de 10)
        'abc123', // inválido (letras)
      ];
      
      testPhones.forEach(phone => {
        const validation = neonProfileService.validatePhoneFormat(phone);
        console.log(`      "${phone}": ${validation.valid ? '✅' : '❌'} ${validation.message || ''}`);
      });
      
      // c. Estadísticas
      console.log('\n   c. Obteniendo estadísticas...');
      const stats = await neonProfileService.getProfileStats();
      console.log(`      Total perfiles: ${stats.totalProfiles}`);
      console.log(`      Última verificación: ${new Date(stats.lastChecked).toLocaleTimeString()}`);
      
      // 3. Probar actualización (solo si hay perfil)
      if (profile) {
        console.log('\n3. 💾 Probando actualización de perfil...');
        
        const testUpdates = {
          full_name: profile.full_name || 'Usuario Test',
          phone: profile.phone || '3001234567'
        };
        
        console.log('   Datos de prueba:', testUpdates);
        console.log('   ⚠️  Nota: Esta prueba NO modificará datos reales por seguridad');
        console.log('   Para probar actualización real, usa la interfaz de usuario');
      }
      
    } else {
      console.log('ℹ️ No hay sesión activa. Inicia sesión para probar funcionalidades completas.');
      console.log('\n📋 Pruebas básicas disponibles:');
      
      // Probar validaciones sin sesión
      console.log('\n   Validación de nombre "Ana":', neonProfileService.validateNameFormat('Ana'));
      console.log('   Validación de teléfono "3001234567":', neonProfileService.validatePhoneFormat('3001234567'));
    }
    
    // 4. Verificar estructura de tabla
    console.log('\n4. 📊 Verificando acceso a tabla profiles...');
    const { data: sampleData, error: tableError } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .limit(1);
    
    if (tableError) {
      console.error('   ❌ Error al acceder a tabla:', tableError.message);
      
      if (tableError.message.includes('full_name')) {
        console.log('   💡 Posible solución: Ejecutar migración para agregar columna full_name');
      }
      if (tableError.message.includes('phone')) {
        console.log('   💡 Posible solución: Ejecutar migración para agregar columna phone');
      }
    } else {
      console.log('   ✅ Tabla profiles accesible');
      if (sampleData && sampleData.length > 0) {
        console.log('   Muestra de datos:', sampleData[0]);
      } else {
        console.log('   ℹ️ La tabla está vacía');
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERROR INESPERADO:', error);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🧪 PRUEBAS COMPLETADAS');
  console.log('\n📝 RECOMENDACIONES:');
  console.log('1. Verifica que las columnas full_name y phone existan en Supabase');
  console.log('2. Si faltan columnas, ejecuta la migración SQL correspondiente');
  console.log('3. Prueba la interfaz de usuario para edición inline');
  console.log('4. Monitorea la consola del navegador para errores');
}

// Ejecutar si se llama desde el navegador
if (typeof window !== 'undefined') {
  console.log('🔄 Preparando pruebas de integración...');
  
  // Esperar a que la página cargue
  setTimeout(() => {
    testProfileIntegration().then(() => {
      console.log('\n🎯 Para probar la interfaz completa:');
      console.log('1. Inicia sesión en la aplicación');
      console.log('2. Haz clic en tu avatar (esquina superior derecha)');
      console.log('3. Selecciona "Mi Perfil"');
      console.log('4. Prueba la edición inline con validaciones');
    });
  }, 1000);
}

export { testProfileIntegration };