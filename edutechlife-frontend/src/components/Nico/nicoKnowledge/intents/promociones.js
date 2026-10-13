import {
  PRECIOS_INGENIA as P,
  CONDICIONES_INGENIA as C,
} from "../../../../config/preciosIngenia.js";

export const promociones = [
  {
    id: "primera_clase_gratis",
    patterns: [
      "primera clase gratis",
      "primera clase gratuita",
      "clase gratis",
      "clase gratuita",
      "prueba gratis",
      "sin costo",
      "gratuito",
      "gratis",
    ],
    category: "promociones",
    response: `No manejamos clases sueltas de prueba. Lo que sí es gratis: el ADN de Aprendizaje, ${P.gratis.diasPrueba} días de prueba de IngenIA sin tarjeta y, para el plan Personalizado, una valoración de ${C.valoracionGratisMinutos} minutos.`,
  },
  {
    id: "cuenta_gratuita",
    patterns: [
      "cuenta gratis",
      "cuenta gratuita",
      "versión gratis",
      "versión gratuita",
      "prueba gratuita",
      "plan gratis",
    ],
    category: "promociones",
    response: `Puedes empezar con el ADN de Aprendizaje gratuito que te toma entre 10 y 30 minutos y obtienes un perfil detallado de tu estilo de aprendizaje. También puedes probar IngenIA ${P.gratis.diasPrueba} días sin tarjeta.`,
  },
];
