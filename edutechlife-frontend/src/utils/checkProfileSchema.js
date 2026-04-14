import { supabase } from '../lib/supabase';

export async function checkProfileSchema() {
  try {
    console.log('🔍 Verificando estructura de tabla profiles...');
    
    // Primero, intentar obtener la estructura de la tabla
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error al acceder a la tabla profiles:', error);
      return { error: error.message };
    }
    
    console.log('✅ Tabla profiles accesible');
    
    // Si hay datos, mostrar la estructura del primer registro
    if (profileData && profileData.length > 0) {
      const sampleProfile = profileData[0];
      console.log('📋 Campos disponibles en el primer perfil:');
      Object.keys(sampleProfile).forEach(key => {
        console.log(`  - ${key}: ${typeof sampleProfile[key]} = "${sampleProfile[key]}"`);
      });
      
      // Verificar campos específicos
      const hasFullName = 'full_name' in sampleProfile;
      const hasPhone = 'phone' in sampleProfile;
      const hasDisplayName = 'display_name' in sampleProfile;
      
      console.log('\n🔍 Campos específicos:');
      console.log(`  - full_name: ${hasFullName ? '✅' : '❌'}`);
      console.log(`  - phone: ${hasPhone ? '✅' : '❌'}`);
      console.log(`  - display_name: ${hasDisplayName ? '✅' : '❌'}`);
      
      return {
        success: true,
        hasFullName,
        hasPhone,
        hasDisplayName,
        sampleProfile
      };
    } else {
      console.log('ℹ️ No hay perfiles en la tabla. Creando uno de prueba...');
      
      // Intentar crear un perfil de prueba para ver la estructura
      const testProfile = {
        id: 'test-id-' + Date.now(),
        email: 'test@edutechlife.com',
        full_name: 'Usuario Test',
        phone: '3001234567',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert([testProfile])
        .select();
      
      if (insertError) {
        console.error('❌ Error al crear perfil de prueba:', insertError);
        
        // El error podría indicar qué campos faltan
        if (insertError.message.includes('full_name')) {
          console.log('⚠️ Posiblemente falta la columna full_name');
        }
        if (insertError.message.includes('phone')) {
          console.log('⚠️ Posiblemente falta la columna phone');
        }
        
        return { error: insertError.message, details: insertError };
      }
      
      console.log('✅ Perfil de prueba creado:', inserted);
      return {
        success: true,
        createdTestProfile: true,
        profile: inserted[0]
      };
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return { error: error.message };
  }
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  console.log('🔄 Ejecutando verificación de esquema...');
  checkProfileSchema().then(result => {
    console.log('🎯 Resultado final:', result);
  });
}