export const MODULE_5_PART3 = [
  {
    id: "m5q27",
    question:
      "Quieres que Claude analice un archivo grande de datos. ¿Qué haces para obtener un resultado confiable?",
    options: [
      {
        id: "m5q27_a",
        label:
          "Pedir la conclusión y una tabla con los totales que la respaldan",
      },
      {
        id: "m5q27_b",
        label: "Pedir los pasos del análisis y validar una muestra a mano",
      },
      {
        id: "m5q27_c",
        label:
          "Pedirle a Claude que revise el análisis y señale posibles errores",
      },
      {
        id: "m5q27_d",
        label:
          "Pedir el análisis en dos chats y usarlo si los resultados coinciden",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Límites y errores",
    difficulty: "difícil",
    source:
      "Lección 2 · Crea con Claude: Artifacts, documentos y presentaciones",
    feedback:
      "Solo un cálculo independiente comprueba el dato: pides los pasos y validas una muestra por tu cuenta. La tabla de totales, la revisión de Claude y dos respuestas iguales salen de la misma herramienta y pueden repetir el mismo error.",
  },
  {
    id: "m5q28",
    question:
      "Claude redactó el borrador de un informe para un cliente y tú lo revisaste y ajustaste. ¿Qué haces con el uso de IA al entregarlo?",
    options: [
      {
        id: "m5q28_a",
        label: "Nada: si lo revisé y lo ajusté, el informe ya es solo mío",
      },
      {
        id: "m5q28_b",
        label: "Lo menciono solo si el cliente pregunta cómo se hizo",
      },
      {
        id: "m5q28_c",
        label: "Pongo a Claude como autor, porque escribió la mayor parte",
      },
      {
        id: "m5q28_d",
        label: "Declaro cómo usé la IA y quién responde por el contenido",
      },
    ],
    correctAnswer: "m5q28_d",
    topic: "Delegar con Claude",
    difficulty: "medio",
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
    feedback:
      "Declarar el uso de IA es parte de entregar con honestidad: dices en qué te ayudó y quién revisó y responde por el resultado. Revisarlo no borra que usaste IA, y la responsabilidad es de una persona, no de la herramienta.",
  },
  {
    id: "m5q29",
    question:
      "Le preguntas a Claude el valor de una tarifa que el Gobierno actualizó este mes. ¿Qué haces con la cifra que te da?",
    options: [
      {
        id: "m5q29_a",
        label: "Le pido que confirme que está actualizada y la uso",
      },
      {
        id: "m5q29_b",
        label: "La confirmo en la página oficial antes de usarla",
      },
      {
        id: "m5q29_c",
        label: "La uso si viene con fecha y una explicación detallada",
      },
      {
        id: "m5q29_d",
        label: "Pido la cifra en otro chat y uso la que se repita",
      },
    ],
    correctAnswer: "m5q29_b",
    topic: "Límites y errores",
    difficulty: "fácil",
    source: "Lección 1 · Conoce a Claude: la IA que trabaja contigo",
    feedback:
      "Claude puede no conocer un cambio reciente, como una tarifa actualizada este mes, y aun así responder con seguridad. La página oficial de la entidad es la fuente actual. Que Claude la confirme, le ponga fecha o la repita en otro chat no prueba que esté vigente.",
  },
  {
    id: "m5q30",
    question:
      "Terminaste el informe para el que conectaste tu Drive a Claude y no volverás a necesitar ese acceso. ¿Qué haces con el conector?",
    options: [
      {
        id: "m5q30_a",
        label: "Lo dejo conectado para no repetir el proceso más adelante",
      },
      {
        id: "m5q30_b",
        label: "Borro el chat del informe, y así Claude pierde el acceso",
      },
      {
        id: "m5q30_c",
        label: "Lo desconecto; si lo necesito otra vez, lo conecto de nuevo",
      },
      {
        id: "m5q30_d",
        label: "Le pido a Claude que no vuelva a abrir mis archivos",
      },
    ],
    correctAnswer: "m5q30_c",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
    feedback:
      "Un conector mantiene el acceso hasta que lo desconectas: borrar un chat o pedirle a Claude que no abra tus archivos no lo retira. Si ya no lo necesitas, desconéctalo; volver a conectarlo toma un momento.",
  },
];
