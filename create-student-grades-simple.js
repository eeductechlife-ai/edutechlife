// Script simple para crear tabla student_grades
// Ejecutar con: node create-student-grades-simple.js

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'edutechlife-frontend', '.env.local') });

console.log('📋 Creando tabla student_grades...\n');

// Leer el archivo SQL
const sqlPath = path.join(__dirname, 'create_student_grades_table.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('📄 Contenido SQL para ejecutar manualmente:');
console.log('===========================================\n');
console.log(sqlContent);
console.log('\n===========================================');

console.log('\n🔧 INSTRUCCIONES PARA EJECUTAR MANUALMENTE:');
console.log('===========================================');
console.log('1. Ve a Supabase Dashboard: https://app.supabase.com/project/srirrwpgswlnuqfgtule');
console.log('2. Haz clic en "SQL Editor" en el menú izquierdo');
console.log('3. Crea un nuevo query');
console.log('4. Copia y pega el contenido SQL mostrado arriba');
console.log('5. Haz clic en "Run" (▶️)');
console.log('6. Verifica que la tabla se creó correctamente');
console.log('\n📊 Para verificar:');
console.log('   SELECT * FROM information_schema.tables WHERE table_name = \'student_grades\';');
console.log('   SELECT COUNT(*) FROM student_grades;');

// También mostrar las credenciales necesarias
console.log('\n🔐 CREDENCIALES SUPABASE:');
console.log('========================');
console.log('URL:', process.env.VITE_SUPABASE_URL || 'No configurada');
console.log('Service Role Key:', process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'No configurada');
console.log('Anon Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada');