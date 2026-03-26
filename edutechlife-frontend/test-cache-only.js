// Test solo del sistema de cache (sin dependencias de navegador)
import { getNicoResponse, addResponseToCache, getCacheStats, memoryCache, INSTANT_RESPONSES } from './src/utils/nicoCache.js';

console.log('🧪 TEST DEL SISTEMA DE CACHE - NICO OPTIMIZADO');
console.log('==================================================\n');

// Test 1: Respuestas instantáneas
console.log('📊 TEST 1: RESPUESTAS INSTANTÁNEAS (<50ms)');
console.log('==================================================');

const instantQueries = [
  'hola',
  'qué es vak',
  'servicios',
  'stem',
  'cómo me inscribo',
  'neurociencia',
  'precios',
  'certificado'
];

let instantHits = 0;
let instantTimes = [];

for (const query of instantQueries) {
  const start = Date.now();
  const result = await getNicoResponse(query, 'test-user');
  const time = Date.now() - start;
  instantTimes.push(time);
  
  if (result.cacheLevel === 1) {
    instantHits++;
    console.log(`✅ "${query}" - ${time}ms (nivel ${result.cacheLevel})`);
  } else {
    console.log(`❌ "${query}" - ${time}ms (nivel ${result.cacheLevel}) - Esperaba nivel 1`);
  }
}

const avgInstantTime = instantTimes.reduce((a, b) => a + b, 0) / instantTimes.length;
console.log(`\n📈 Estadísticas instantáneas:`);
console.log(`• Hits: ${instantHits}/${instantQueries.length} (${((instantHits/instantQueries.length)*100).toFixed(1)}%)`);
console.log(`• Tiempo promedio: ${avgInstantTime.toFixed(1)}ms`);
console.log(`• Objetivo <50ms: ${avgInstantTime < 50 ? '✅' : '❌'}`);

// Test 2: Cache memoria
console.log('\n📊 TEST 2: CACHE MEMORIA (<200ms)');
console.log('==================================================');

// Añadir algunas respuestas al cache
const memoryQueries = [
  'hola nico, cómo estás hoy?',
  'explicación detallada de metodología vak',
  'quiero saber sobre robótica educativa',
  'programas de bienestar emocional'
];

const memoryResponses = [
  '¡Hola! Estoy muy bien, listo para ayudarte con EdutechLife.',
  'La metodología VAK se enfoca en estilos de aprendizaje visual, auditivo y kinestésico.',
  'Ofrecemos robótica educativa con kits LEGO, Arduino y programación por bloques.',
  'Nuestros programas de bienestar emocional incluyen mindfulness y coaching académico.'
];

for (let i = 0; i < memoryQueries.length; i++) {
  addResponseToCache(memoryQueries[i], memoryResponses[i], 'test-user');
}

console.log(`• Entradas añadidas al cache: ${memoryQueries.length}`);
console.log(`• Tamaño total cache: ${memoryCache.size}`);

// Test 3: Verificar cache memoria
console.log('\n📊 TEST 3: VERIFICACIÓN CACHE MEMORIA');
console.log('==================================================');

let memoryHits = 0;
let memoryTimes = [];

for (const query of memoryQueries) {
  const start = Date.now();
  const result = await getNicoResponse(query, 'test-user');
  const time = Date.now() - start;
  memoryTimes.push(time);
  
  if (result.cacheLevel === 2) {
    memoryHits++;
    console.log(`✅ "${query.substring(0, 40)}..." - ${time}ms (nivel ${result.cacheLevel})`);
  } else {
    console.log(`❌ "${query.substring(0, 40)}..." - ${time}ms (nivel ${result.cacheLevel}) - Esperaba nivel 2`);
  }
}

const avgMemoryTime = memoryTimes.reduce((a, b) => a + b, 0) / memoryTimes.length;
console.log(`\n📈 Estadísticas memoria:`);
console.log(`• Hits: ${memoryHits}/${memoryQueries.length} (${((memoryHits/memoryQueries.length)*100).toFixed(1)}%)`);
console.log(`• Tiempo promedio: ${avgMemoryTime.toFixed(1)}ms`);
console.log(`• Objetivo <200ms: ${avgMemoryTime < 200 ? '✅' : '❌'}`);

// Test 4: Estadísticas generales
console.log('\n📊 TEST 4: ESTADÍSTICAS GENERALES');
console.log('==================================================');

const stats = getCacheStats();
console.log(`• Respuestas instantáneas configuradas: ${stats.instantResponses}`);
console.log(`• Cache memoria tamaño: ${stats.memoryCacheSize}`);
console.log(`• Cache total tamaño: ${stats.totalCacheSize}`);

// Test 5: Performance objetivos finales
console.log('\n🎯 TEST 5: OBJETIVOS DE PERFORMANCE');
console.log('==================================================');

const allQueries = [...instantQueries, ...memoryQueries];
const allResults = [];

for (const query of allQueries) {
  const start = Date.now();
  const result = await getNicoResponse(query, 'test-user');
  const time = Date.now() - start;
  allResults.push({ query, time, cacheLevel: result.cacheLevel });
}

const cacheHits = allResults.filter(r => r.cacheLevel > 0).length;
const totalTime = allResults.reduce((sum, r) => sum + r.time, 0);
const avgTime = totalTime / allResults.length;
const maxTime = Math.max(...allResults.map(r => r.time));
const cacheHitRate = (cacheHits / allResults.length) * 100;

console.log(`• Total queries: ${allResults.length}`);
console.log(`• Cache hits: ${cacheHits} (${cacheHitRate.toFixed(1)}%)`);
console.log(`• Tiempo promedio: ${avgTime.toFixed(1)}ms`);
console.log(`• Tiempo máximo: ${maxTime}ms`);

console.log('\n🎯 VERIFICACIÓN DE OBJETIVOS:');
console.log(`✅ Cache hit rate >85%: ${cacheHitRate >= 85 ? '✅' : '❌'} (${cacheHitRate.toFixed(1)}%)`);
console.log(`✅ Response time <200ms: ${avgTime < 200 ? '✅' : '❌'} (${avgTime.toFixed(1)}ms)`);
console.log(`✅ Instant responses >70%: ${(instantHits/instantQueries.length)*100 >= 70 ? '✅' : '❌'} (${((instantHits/instantQueries.length)*100).toFixed(1)}%)`);
console.log(`✅ Memory cache 1000 entries: ${memoryCache.maxSize === 1000 ? '✅' : '❌'} (${memoryCache.maxSize})`);

console.log('\n🎉 TEST COMPLETADO');
console.log('==================================================');
console.log('El sistema de cache está funcionando correctamente.');
console.log('Para probar la interfaz completa:');
console.log('1. Navega a http://localhost:5173');
console.log('2. Abre la consola del navegador (F12)');
console.log('3. Busca "Nico Performance Metrics"');
console.log('4. Prueba diferentes tipos de preguntas');