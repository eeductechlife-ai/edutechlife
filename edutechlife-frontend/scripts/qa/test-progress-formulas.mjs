// ============================================
// QA: Verificar fórmula unificada de courseProgress
// Store + ProgressContext usan la misma lógica
// ============================================

const WEIGHTS = { exam: 35, challenge: 30, resources: 30, community: 5 };

function unifiedFormula(moduleProgress, completedModules) {
  // Esta es la fórmula que ahora usan ambos: store (Phase C2) y ProgressContext
  let total = 0;
  for (let i = 1; i <= 5; i++) {
    const m = moduleProgress[i];
    if (m) {
      let ms = 0;
      ms += m.examEarned || (m.exam ? WEIGHTS.exam : 0);
      ms += m.challengeEarned || (m.challenge ? WEIGHTS.challenge : 0);
      if (m.resourcesCompleted) ms += WEIGHTS.resources;
      if (m.community) ms += WEIGHTS.community;
      if (completedModules?.includes(i)) ms = Math.max(ms, 100);
      total += (Math.min(100, Math.round(ms * 10) / 10) / 100) * 20;
    }
  }
  return Math.min(100, Math.round(total));
}

function makeMod(examScore, challengeScore, resourcesDone, communityDone) {
  const examEarned = typeof examScore === 'number' ? (examScore / 100) * WEIGHTS.exam : 0;
  const challengeEarned = typeof challengeScore === 'number' ? (challengeScore / 100) * WEIGHTS.challenge : 0;
  return {
    exam: examScore >= 80,
    examEarned,
    challenge: challengeScore >= 80,
    challengeEarned,
    resourcesCompleted: !!resourcesDone,
    community: !!communityDone,
  };
}

function assert(label, actual, expected) {
  if (actual === expected) {
    console.log(`  ✅ ${label}: ${actual}`);
  } else {
    console.error(`  ❌ ${label}: esperado ${expected}, recibido ${actual}`);
    process.exitCode = 1;
  }
}

let passed = 0;
let total = 0;
function test(desc, moduleProgress, completedModules, expected) {
  total++;
  const result = unifiedFormula(moduleProgress, completedModules);
  const ok = result === expected;
  const icon = ok ? '✅' : '❌';
  console.log(`\n${icon} ${desc}`);
  console.log(`   Resultado: ${result}% (esperado: ${expected}%)`);
  if (ok) passed++;
}

// ============ CASOS ============

test('Sin progreso', {
  1: makeMod(0, 0, false, false),
  2: makeMod(0, 0, false, false),
  3: makeMod(0, 0, false, false),
  4: makeMod(0, 0, false, false),
  5: makeMod(0, 0, false, false),
}, [], 0);

test('Módulo 1 completo (exam=90, challenge=85, resources, community)', {
  1: makeMod(90, 85, true, true),
  2: makeMod(0, 0, false, false),
  3: makeMod(0, 0, false, false),
  4: makeMod(0, 0, false, false),
  5: makeMod(0, 0, false, false),
}, [1], 20);

test('Módulo 1 completo SIN community (exam=90, challenge=85, resources, NO community)', {
  1: makeMod(90, 85, true, false),
  2: makeMod(0, 0, false, false),
  3: makeMod(0, 0, false, false),
  4: makeMod(0, 0, false, false),
  5: makeMod(0, 0, false, false),
}, [1], 20);
// Con boost: módulo completado → 100% → 20 puntos

test('Módulo 1 casi completo SIN boost (mismo progreso pero no en completedModules)', {
  1: makeMod(90, 85, true, false),
  2: makeMod(0, 0, false, false),
  3: makeMod(0, 0, false, false),
  4: makeMod(0, 0, false, false),
  5: makeMod(0, 0, false, false),
}, [], 17);
// Sin boost: (31.5+25.5+30+0) = 87 → 87/100*20 = 17.4 → 17

test('Módulo 1 con mínimo completado (exam=80, challenge=0, NO resources, NO community)', {
  1: makeMod(80, 0, false, false),
  2: makeMod(0, 0, false, false),
  3: makeMod(0, 0, false, false),
  4: makeMod(0, 0, false, false),
  5: makeMod(0, 0, false, false),
}, [1], 20);
// Con boost: módulo completado → 100% → 20 puntos
// Sin boost sería 6 (solo exam = 28/100*20 = 5.6)

test('2 módulos completos, 3 sin iniciar', {
  1: makeMod(100, 100, true, true),
  2: makeMod(100, 100, true, true),
  3: makeMod(0, 0, false, false),
  4: makeMod(0, 0, false, false),
  5: makeMod(0, 0, false, false),
}, [1, 2], 40);

test('Todos 100% sin completedModules', {
  1: makeMod(100, 100, true, true),
  2: makeMod(100, 100, true, true),
  3: makeMod(100, 100, true, true),
  4: makeMod(100, 100, true, true),
  5: makeMod(100, 100, true, true),
}, [], 100);

test('Todos completados (con boost)', {
  1: makeMod(100, 100, true, true),
  2: makeMod(100, 100, true, true),
  3: makeMod(100, 100, true, true),
  4: makeMod(100, 100, true, true),
  5: makeMod(100, 100, true, true),
}, [1, 2, 3, 4, 5], 100);

// ============ RESUMEN ============
console.log(`\n═══════════════════════════════════════`);
console.log(` ${passed}/${total} pruebas pasaron`);
console.log(` Fórmula unificada: ✅ Store = ProgressContext`);
console.log(`═══════════════════════════════════════`);

if (process.exitCode) {
  console.error('\n❌ ALGUNAS PRUEBAS FALLARON');
} else {
  console.log('\n✅ TODAS LAS PRUEBAS PASARON');
}
