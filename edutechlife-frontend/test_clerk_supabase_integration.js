// TEST DE INTEGRACIÓN CLERK-SUPABASE
// Ejecutar en consola del navegador (F12 → Console)

console.log('🔍 TEST DE INTEGRACIÓN CLERK-SUPABASE');

// 1. Verificar si Clerk está cargado
console.log('1. Clerk cargado:', !!window.Clerk);
if (window.Clerk) {
  console.log('   ✅ Clerk está disponible globalmente');
  console.log('   📊 Clerk user:', window.Clerk.user);
  console.log('   🔑 Clerk session:', window.Clerk.session);
} else {
  console.log('   ❌ Clerk NO está disponible');
}

// 2. Verificar si Supabase está cargado
console.log('2. Supabase cargado:', !!window.supabase);
if (window.supabase) {
  console.log('   ✅ Supabase está disponible globalmente');
} else {
  console.log('   ❌ Supabase NO está disponible');
}

// 3. Verificar variables de entorno
console.log('3. Variables de entorno:');
console.log('   - VITE_CLERK_PUBLISHABLE_KEY:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Configurada' : '❌ NO configurada');
console.log('   - VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ NO configurada');
console.log('   - VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ NO configurada');

// 4. Probar conexión a Supabase (si está disponible)
if (window.supabase) {
  console.log('4. Probando conexión a Supabase...');
  try {
    const { data, error } = await window.supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Error Supabase:', error.message);
    } else {
      console.log('   ✅ Conexión Supabase exitosa');
    }
  } catch (err) {
    console.log('   ❌ Error en test Supabase:', err.message);
  }
}

// 5. Verificar trigger handle_new_user
console.log('5. Verificando trigger handle_new_user:');
console.log('   ℹ️ Para verificar el trigger:');
console.log('   a. Registra un NUEVO usuario en Clerk');
console.log('   b. Verifica en Supabase Table Editor → tabla "profiles"');
console.log('   c. Debería crearse automáticamente un registro');

// 6. Probar UserProfileSmartCard
console.log('6. Para probar UserProfileSmartCard:');
console.log('   a. Haz clic en tu nombre en la barra superior');
console.log('   b. Selecciona "Mi Perfil"');
console.log('   c. Verifica mensajes en consola');

// 7. Mensaje final
console.log('');
console.log('🎯 RESULTADO ESPERADO:');
console.log('   ✅ Clerk carga correctamente (sin error Missing publishableKey)');
console.log('   ✅ Supabase conecta correctamente (sin error No API key found)');
console.log('   ✅ UserProfileSmartCard muestra datos reales de Supabase');
console.log('   ✅ Trigger crea perfiles automáticamente al registrarse');
console.log('');
console.log('⚠️ Si hay problemas:');
console.log('   1. Refresca la página (Ctrl+F5)');
console.log('   2. Verifica que no haya errores en la consola');
console.log('   3. Intenta abrir "Mi Perfil" nuevamente');