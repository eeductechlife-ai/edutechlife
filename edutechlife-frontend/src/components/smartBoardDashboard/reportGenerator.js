export function generateReportData({ studentName, studentData, userXP, userLevel, streakDays, subjects, sessionStartRef }) {
  const activeSubjects = subjects.filter(s => !s.locked);
  const promedioProgreso = activeSubjects.length > 0
    ? Math.round(activeSubjects.reduce((acc, s) => acc + s.progress, 0) / activeSubjects.length)
    : 0;

  return {
    studentName,
    generatedAt: new Date(),
    ...studentData,
    xpActual: userXP,
    nivelActual: userLevel,
    diasRacha: streakDays,
    promedioProgreso,
    totalMaterias: subjects.length,
    materiasActivas: subjects.filter(s => s.progress > 0).length,
    tiempoSesion: Math.floor((new Date() - sessionStartRef.current) / 1000 / 60)
  };
}

export function downloadReport({ reportData, studentName, subjects }) {
  if (!reportData) return;

  const content = `
EDUTECHLIFE - REPORTE DE ESTUDIANTE
====================================
Fecha de generación: ${reportData.generatedAt.toLocaleString('es-ES')}
Estudiante: ${reportData.studentName}

RESUMEN DE ACTIVIDAD
--------------------
Tiempo en plataforma: ${reportData.timeSpent} minutos
Interacciones totales: ${reportData.interactions}
Preguntas a Valeria: ${reportData.questionsAsked}
Misiones completadas: ${reportData.missionsCompleted}

RENDIMIENTO ACADÉMICO
----------------------
Nivel actual: ${reportData.nivelActual}
XP acumulado: ${reportData.xpActual}
Racha de días: ${reportData.diasRacha}
Promedio de progreso: ${reportData.promedioProgreso}%

MATERIAS
--------
Total de materias: ${reportData.totalMaterias}
Materias activas: ${reportData.materiasActivas}
${subjects.filter(s => !s.locked).map(s => `- ${s.name}: ${s.progress}%`).join('\n')}

RECOMENDACIONES
---------------
${reportData.promedioProgreso >= 80 ? '✅ El estudiante muestra excelente rendimiento. Considerar desafíos avanzados.' : ''}
${reportData.promedioProgreso >= 50 && reportData.promedioProgreso < 80 ? '📚 El estudiante va bien. Sugerir más práctica en materias con bajo rendimiento.' : ''}
${reportData.promedioProgreso < 50 ? '⚠️ El estudiante necesita apoyo adicional. Considerar tutorías personalizadas.' : ''}

====================================
Documento generado por Edutechlife v2.286
Plataforma de Neuro-Educación Premium
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
