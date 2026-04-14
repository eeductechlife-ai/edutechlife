/**
 * Archivo de prueba para verificar configuración de Clerk
 */

export const testClerkConfig = () => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  console.log('=== PRUEBA DE CONFIGURACIÓN CLERK ===');
  console.log('VITE_CLERK_PUBLISHABLE_KEY:', publishableKey ? '✓ Configurado' : '✗ No configurado');
  console.log('Key starts with pk_test_:', publishableKey?.startsWith('pk_test_'));
  console.log('Key length:', publishableKey?.length);
  console.log('====================================');
  
  return {
    isConfigured: !!publishableKey && publishableKey.startsWith('pk_test_'),
    keyLength: publishableKey?.length,
    keyPreview: publishableKey ? `${publishableKey.substring(0, 20)}...` : 'No key',
  };
};

// Ejecutar prueba automáticamente en desarrollo
if (import.meta.env.DEV) {
  const result = testClerkConfig();
  console.log('Resultado prueba Clerk:', result);
}