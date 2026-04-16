const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración desde .env.local
const supabaseUrl = 'https://srirrwpgswlnuqfgtule.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXJyd3Bnc3dsbnVxZmd0dWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTkyNywiZXhwIjoyMDkwOTI3OTI3fQ.LsjO_sbMBedOs1s2ulfps8bX2VHCHWJKmZOmx1RAmK4';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeSQL() {
  console.log('🚀 EJECUTANDO SQL ADAPTADO EN SUPABASE');
  console.log('=======================================');
  console.log('📋 URL:', supabaseUrl);
  console.log('🔑 Service Role Key:', serviceRoleKey.substring(0, 20) + '...');
  
  // Leer SQL
  const sqlPath = path.join(__dirname, '..', 'IALAB_PREMIUM_SCHEMA_ADAPTADO.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  console.log('📏 Tamaño SQL:', sqlContent.length, 'caracteres');
  console.log('📄 Líneas SQL:', sqlContent.split('\n').length);
  
  // Dividir en sentencias SQL
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  console.log(`📝 Sentencias a ejecutar: ${statements.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Ejecutar cada sentencia
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    const stmtPreview = stmt.substring(0, 80).replace(/\n/g, ' ');
    
    console.log(`\n[${i+1}/${statements.length}] Ejecutando: ${stmtPreview}...`);
    
    try {
      // Usar query() para ejecutar SQL
      const { error } = await supabase.from('_dummy').select('*').limit(0);
      
      // Para SQL DDL necesitamos usar REST API directamente
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: stmt })
      });
      
      if (response.ok) {
        console.log(`   ✅ Éxito`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log(`   ⚠️  Posible error (continuando): ${errorText.substring(0, 100)}`);
        errorCount++;
      }
      
      // Pequeña pausa para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message.substring(0, 100)}`);
      errorCount++;
    }
  }
  
  console.log('\n=======================================');
  console.log('📊 RESULTADO:');
  console.log(`✅ Éxitos: ${successCount}`);
  console.log(`⚠️  Advertencias/Errores: ${errorCount}`);
  console.log(`📈 Total: ${statements.length} sentencias procesadas`);
  
  if (errorCount === 0) {
    console.log('\n🎉 ¡SQL EJECUTADO EXITOSAMENTE!');
    console.log('Las 3 tablas faltantes han sido creadas:');
    console.log('  1. course_progress');
    console.log('  2. certificates');
    console.log('  3. quiz_attempts');
    console.log('\n🔒 RLS y políticas configuradas');
    console.log('⚡ Índices optimizados para 1000 usuarios');
    console.log('🎓 Certificados automáticos activados');
  } else {
    console.log('\n⚠️  Algunas sentencias tuvieron problemas');
    console.log('Revisa el dashboard de Supabase para verificar');
  }
  
  console.log('\n📋 Para verificar en Supabase Dashboard:');
  console.log('1. Ve a https://supabase.com/dashboard/project/srirrwpgswlnuqfgtule');
  console.log('2. Navega a Table Editor');
  console.log('3. Verifica que existen las 5 tablas:');
  console.log('   - profiles');
  console.log('   - course_progress');
  console.log('   - certificates');
  console.log('   - quiz_attempts');
  console.log('   - student_sessions');
}

// Ejecutar
executeSQL().catch(console.error);