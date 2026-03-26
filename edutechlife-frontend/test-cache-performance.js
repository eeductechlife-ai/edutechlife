// Test de performance del cache de Nico
const { getNicoResponse, INSTANT_RESPONSES, memoryCache } = require('./src/utils/nicoCache.js');

async function testCachePerformance() {
  console.log('📊 Test de Performance - Cache de 3 Niveles\n');
  
  const testCases = [
    // Nivel 1: Instant responses
    { query: 'hola', expectedLevel: 1 },
    { query: 'qué es vak', expectedLevel: 1 },
    { query: 'servicios', expectedLevel: 1 },
    { query: 'stem', expectedLevel: 1 },
    { query: 'precios', expectedLevel: 1 },
    
    // Nivel 2: Memory cache (después de primera llamada)
    { query: 'quiero aprender python desde cero', expectedLevel: 2 },
    { query: 'clases de robótica para adolescentes', expectedLevel: 2 },
    { query: 'apoyo emocional para estudiantes', expectedLevel: 2 },
    
    // Nivel 3: Backend fallback (simulado)
    { query: 'cuál es el impacto de la IA en la educación del futuro', expectedLevel: 0 },
  ];

  console.log('🧪 Ejecutando pruebas...\n');
  
  const results = [];
  let totalTime = 0;
  let cacheHits = 0;
  
  for (const test of testCases) {
    const startTime = Date.now();
    
    try {
      const result = await getNicoResponse(test.query, 'test-user');
      const responseTime = Date.now() - startTime;
      
      const passed = result.cacheLevel === test.expectedLevel;
      const cacheType = result.fromCache ? `Cache Nivel ${result.cacheLevel}` : 'Backend';
      
      results.push({
        query: test.query.substring(0, 30) + '...',
        responseTime: `${responseTime}ms`,
        cacheLevel: result.cacheLevel,
        expected: test.expectedLevel,
        cacheType,
        passed: passed ? '✅' : '❌'
      });
      
      totalTime += responseTime;
      if (result.fromCache) cacheHits++;
      
      console.log(`${passed ? '✅' : '❌'} "${test.query.substring(0, 20)}..." - ${responseTime}ms (${cacheType})`);
      
    } catch (error) {
      console.error(`❌ Error en "${test.query}":`, error.message);
    }
    
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Estadísticas
  console.log('\n📈 ESTADÍSTICAS FINALES');
  console.log('='.repeat(50));
  
  console.log('\n📋 Resultados por prueba:');
  console.table(results);
  
  console.log('\n🎯 Métricas de Performance:');
  console.log(`• Total pruebas: ${testCases.length}`);
  console.log(`• Cache hits: ${cacheHits}/${testCases.length} (${((cacheHits/testCases.length)*100).toFixed(1)}%)`);
  console.log(`• Tiempo promedio: ${(totalTime/testCases.length).toFixed(1)}ms`);
  console.log(`• Tiempo total: ${totalTime}ms`);
  
  console.log('\n🏆 Objetivos vs Resultados:');
  console.log('• Cache hit rate >85%:', cacheHits/testCases.length >= 0.85 ? '✅' : '❌');
  console.log('• Respuesta cache <200ms:', (totalTime/testCases.length) < 200 ? '✅' : '❌');
  
  console.log('\n🔍 Cache Details:');
  console.log(`• Respuestas instantáneas: ${INSTANT_RESPONSES.size}`);
  console.log(`• Entradas memory cache: ${memoryCache.size()}`);
  
  console.log('\n🎉 Test completado!');
}

// Ejecutar test
testCachePerformance().catch(console.error);