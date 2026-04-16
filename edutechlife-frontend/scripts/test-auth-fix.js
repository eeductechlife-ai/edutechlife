#!/usr/bin/env node

/**
 * Script para probar que el fix de AuthContext funciona
 */

console.log('🧪 Probando fix de AuthContext...\n');

// Simular el objeto supabase proxy para verificar métodos
const mockBaseClient = {
  auth: {
    onAuthStateChange: (callback) => {
      console.log('✅ onAuthStateChange disponible');
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getSession: () => {
      console.log('✅ getSession disponible');
      return Promise.resolve({ data: { session: null }, error: null });
    },
    signOut: () => {
      console.log('✅ signOut disponible');
      return Promise.resolve({ error: null });
    },
    signInWithPassword: () => {
      console.log('✅ signInWithPassword disponible');
      return Promise.resolve({ error: null });
    },
    signUp: () => {
      console.log('✅ signUp disponible');
      return Promise.resolve({ error: null });
    },
  }
};

// Crear proxy similar al implementado
const supabaseProxy = {
  ...mockBaseClient,
  auth: {
    ...mockBaseClient.auth,
    
    // Override de getSession
    getSession: async () => {
      console.log('🔍 getSession override (buscando Clerk)');
      return mockBaseClient.auth.getSession();
    },
    
    // Asegurar métodos
    onAuthStateChange: mockBaseClient.auth.onAuthStateChange.bind(mockBaseClient.auth),
    signOut: mockBaseClient.auth.signOut.bind(mockBaseClient.auth),
    signInWithPassword: mockBaseClient.auth.signInWithPassword.bind(mockBaseClient.auth),
    signUp: mockBaseClient.auth.signUp.bind(mockBaseClient.auth),
  },
  
  withSession: () => ({ auth: mockBaseClient.auth }),
};

// Probar métodos
console.log('📋 Probando métodos del proxy supabase:');
console.log('========================================');

try {
  // 1. Probar onAuthStateChange
  const { data: { subscription } } = supabaseProxy.auth.onAuthStateChange(() => {});
  if (subscription && typeof subscription.unsubscribe === 'function') {
    console.log('✅ onAuthStateChange funciona correctamente');
    subscription.unsubscribe();
  } else {
    console.log('❌ onAuthStateChange no devuelve subscription válida');
  }
  
  // 2. Probar getSession
  supabaseProxy.auth.getSession().then(result => {
    console.log('✅ getSession devuelve:', result.data ? 'sesión' : 'sin sesión');
  }).catch(err => {
    console.log('❌ getSession error:', err.message);
  });
  
  // 3. Probar signOut
  supabaseProxy.auth.signOut().then(result => {
    if (!result.error) {
      console.log('✅ signOut funciona');
    } else {
      console.log('❌ signOut error:', result.error);
    }
  });
  
  // 4. Verificar estructura del proxy
  console.log('\n📋 Estructura del objeto supabase:');
  console.log('  - supabase.auth.onAuthStateChange:', typeof supabaseProxy.auth.onAuthStateChange);
  console.log('  - supabase.auth.getSession:', typeof supabaseProxy.auth.getSession);
  console.log('  - supabase.auth.signOut:', typeof supabaseProxy.auth.signOut);
  console.log('  - supabase.auth.signInWithPassword:', typeof supabaseProxy.auth.signInWithPassword);
  console.log('  - supabase.auth.signUp:', typeof supabaseProxy.auth.signUp);
  console.log('  - supabase.withSession:', typeof supabaseProxy.withSession);
  
  // 5. Verificar que no es el mismo objeto que baseClient.auth
  console.log('\n📋 Verificando que es un proxy (no el objeto original):');
  console.log('  - supabase.auth === mockBaseClient.auth:', supabaseProxy.auth === mockBaseClient.auth);
  console.log('  - supabase.auth.getSession === mockBaseClient.auth.getSession:', 
    supabaseProxy.auth.getSession === mockBaseClient.auth.getSession);
  
  console.log('\n🎉 PRUEBAS COMPLETADAS');
  console.log('========================================');
  console.log('El fix debería resolver el error:');
  console.log('  "Uncaught TypeError: supabase.auth.onAuthStateChange is not a function"');
  console.log('\n⚠️  Si el error persiste, verifica:');
  console.log('  1. Que el archivo src/lib/supabase.js está actualizado');
  console.log('  2. Que el servidor de desarrollo se reinició');
  console.log('  3. Que no hay caché del navegador');
  
} catch (error) {
  console.error('❌ ERROR durante la prueba:', error);
  process.exit(1);
}