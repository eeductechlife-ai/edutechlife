export const removeEmojis = (text) => {
  if (!text) return "";

  let cleanText = text;

  // Eliminar formato markdown - Negritas **texto** -> texto
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleanText = cleanText.replace(/__([^_]+)__/g, "$1");

  // Eliminar formato markdown - Cursivas *texto* -> texto
  cleanText = cleanText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
  cleanText = cleanText.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");

  // Eliminar encabezados markdown # ## ###
  cleanText = cleanText.replace(/^#{1,6}\s+/gm, "");

  // Eliminar listas con guiones o números - item
  cleanText = cleanText.replace(/^[\s]*[-*+]\s+/gm, "");
  cleanText = cleanText.replace(/^[\s]*\d+\.\s+/gm, "");

  // Eliminar enlaces [texto](url) -> texto
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Eliminar bloques de código `codigo` -> codigo
  cleanText = cleanText.replace(/`([^`]+)`/g, "$1");
  cleanText = cleanText.replace(/```[\s\S]*?```/g, "");

  // Eliminar emojis Unicode completos
  const emojiRanges = [
    "\u{1F300}-\u{1F9FF}", // Emojis variados
    "\u{1F600}-\u{1F64F}", // Caritas sonrientes
    "\u{1F680}-\u{1F6FF}", // Transporte
    "\u{2600}-\u{26FF}", // Misc
    "\u{2700}-\u{27BF}", // Dingbats
    "\u{1FA00}-\u{1FA6F}", // Emoji 12+
    "\u{1FA70}-\u{1FAFF}", // Emoji 13+
    "\u{1F900}-\u{1F9FF}", // Emoji 11+
    "\u{1F018}-\u{1F270}", // Símbolos antiguos
    "\u{1F700}-\u{1F77F}", // Símbolos
  ];

  emojiRanges.forEach((range) => {
    const regex = new RegExp(`[${range}]`, "gmu");
    cleanText = cleanText.replace(regex, "");
  });

  // Eliminar selectores de variación
  // eslint-disable-next-line no-misleading-character-class -- regex movida verbatim desde NicoModern.jsx; comportamiento identico
  cleanText = cleanText.replace(/[\uFE0F\uFE0E\u{1F3FB}-\u{1F3FF}]/gmu, "");

  // Eliminar "xxx" y variaciones (a veces aparecen como marcador)
  cleanText = cleanText.replace(/\bxxx+\b/gi, "");
  cleanText = cleanText.replace(/\bx{2,}\b/gi, "");

  // Eliminar caracteres especiales no deseados
  cleanText = cleanText.replace(/[*_~]{2,}/g, ""); // ***, ___, ~~~
  cleanText = cleanText.replace(/[▓░▒█▲▼◆■●○]{2,}/g, ""); // Bloques decorativos

  // Eliminar barras verticales consecutivas | |
  cleanText = cleanText.replace(/\|{2,}/g, "");

  // Limpiar espacios múltiples
  cleanText = cleanText.replace(/\s+/g, " ").trim();

  // Si queda vacío o solo espacios/puntos, devolver texto original sin emojis
  if (!cleanText || /^[\s.\-_]*$/.test(cleanText)) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
      .replace(/\bxxx+\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return cleanText;
};

// Función simple para eliminar solo muletillas de "Nico" - sin afectar otras palabras
export const removeGreetingMulletilla = (text) => {
  if (!text) return text;

  // Solo eliminar patrones específicos de presentación de Nico
  // NO tocar saludos genéricos como "hola" solos
  // Orden: del más específico al más genérico, para que el prefijo largo
  // ("soy nico de edutechlife,") se elimine completo antes que el corto
  // ("soy nico,") consuma solo su parte y deje texto roto.
  const mulletillaPatterns = [
    /^hola,?\s+soy nico de edutechlife,?\s*/i,
    /^hola,?\s+soy nico,?\s*/i,
    /^hola soy nico,?\s*/i,
    /^soy nico de edutechlife,?\s+/i,
    /^soy el asistente nico,?\s+/i,
    /^yo soy nico,?\s+/i,
    /^soy nico,?\s+/i,
    /^nico aquí,?\s+/i,
    /^nicolas,?\s+/i,
  ];

  let cleanText = text;

  for (const pattern of mulletillaPatterns) {
    cleanText = cleanText.replace(pattern, "");
  }

  // Solo limpiar espacios extras al inicio si quedó algo
  cleanText = cleanText.replace(/^\s+/, "");

  // Si quedó muy corta, devolver original
  if (cleanText.trim().length < 3) {
    return text;
  }

  // Asegurar mayúscula inicial
  if (cleanText.length > 0 && cleanText[0] !== cleanText[0].toUpperCase()) {
    cleanText = cleanText[0].toUpperCase() + cleanText.slice(1);
  }

  return cleanText.trim();
};

// Función para determinar si se debe pedir el nombre de forma sutil
export const shouldAskForName = (userContext) => {
  const {
    messagesSinceStart = 0,
    nameAskedOnce,
    dontWantName,
    userName,
  } = userContext;

  // Solo preguntar si:
  // - Han pasado 2+ mensajes del usuario
  // - NO se ha obtenido el nombre aún
  // - NO se ha preguntado antes
  // - El usuario NO ha indicado que no quiere dar su nombre
  return (
    messagesSinceStart >= 2 && !userName && !nameAskedOnce && !dontWantName
  );
};

// Función para usar el nombre cada 3-4 respuestas de forma natural
export const useNameInResponse = (response, userContext) => {
  const { userName, nameUsageCounter = 0 } = userContext;

  // Si no hay nombre o el contador no está en rango válido, devolver respuesta normal
  if (!userName || nameUsageCounter < 3) {
    return { response, newCounter: nameUsageCounter };
  }

  // Solo usar nombre si el contador está entre 3 y 4
  if (nameUsageCounter > 4) {
    return { response, newCounter: 0 }; // Resetear contador
  }

  // Ocasionalmente usar el nombre (aproximadamente la mitad de las veces en rango 3-4)
  if (Math.random() > 0.5) {
    const nameInsertPatterns = [
      `${userName}, `,
      `${userName}, `,
      `para ${userName}, `,
    ];

    const randomPattern =
      nameInsertPatterns[Math.floor(Math.random() * nameInsertPatterns.length)];
    const responseWithName =
      randomPattern + response.charAt(0).toLowerCase() + response.slice(1);

    return { response: responseWithName, newCounter: nameUsageCounter + 1 };
  }

  return { response, newCounter: nameUsageCounter + 1 };
};
