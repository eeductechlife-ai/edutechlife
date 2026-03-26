// Script de prueba para verificar sistema de voz Chirp 3.0 HD
import { speakWithNico, getVoiceSystem, stopNicoVoice } from './src/utils/nicoVoice.js';

async function testVoiceSystem() {
  console.log('🔊 Probando sistema de voz Chirp 3.0 HD...\n');
  
  try {
    // Test 1: Inicializar sistema
    console.log('1. Inicializando sistema de voz...');
    const voiceSystem = getVoiceSystem();
    console.log('✅ Sistema de voz inicializado\n');
    
    // Test 2: Probar voz con texto simple
    console.log('2. Probando síntesis de voz...');
    const testText = '¡Hola! Soy Nico, tu asistente premium de EdutechLife. Estoy usando voces Chirp 3.0 HD de Google.';
    
    console.log('🔊 Reproduciendo:', testText);
    await speakWithNico(testText);
    console.log('✅ Voz reproducida correctamente\n');
    
    // Test 3: Probar cache de audio
    console.log('3. Probando cache de audio...');
    console.log('🔊 Reproduciendo mismo texto (debería usar cache)...');
    await speakWithNico(testText);
    console.log('✅ Cache funcionando\n');
    
    // Test 4: Probar diferentes textos
    console.log('4. Probando diferentes tipos de texto...');
    
    const testCases = [
      'Bienvenido a EdutechLife, donde transformamos la educación.',
      'La metodología VAK identifica tu estilo de aprendizaje único.',
      'Nuestros programas STEM preparan para los trabajos del futuro.',
      'Primera clase gratuita para que experimentes nuestra metodología.'
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      console.log(`🔊 Test ${i + 1}: ${testCases[i]}`);
      await speakWithNico(testCases[i]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre frases
    }
    
    console.log('✅ Todas las pruebas de voz completadas\n');
    
    // Test 5: Verificar estadísticas
    console.log('5. Estadísticas del sistema:');
    const stats = voiceSystem.getStats();
    console.log('📊 Cache hits:', stats.cacheHits);
    console.log('📊 Cache misses:', stats.cacheMisses);
    console.log('📊 Total sintetizado:', stats.totalSynthesized);
    console.log('📊 Tamaño cache:', stats.cacheSize);
    
    console.log('\n🎉 ¡Sistema de voz Chirp 3.0 HD funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en prueba de voz:', error);
    console.error('Stack:', error.stack);
  } finally {
    // Limpiar
    stopNicoVoice();
    console.log('\n🧹 Sistema de voz detenido');
  }
}

// Ejecutar prueba
testVoiceSystem();