import {
  PRECIOS_INGENIA as P,
  formatCOP,
} from "../../../../config/preciosIngenia.js";

export const objeciones = [
  {
    id: "objeccion_caro",
    patterns: [
      "es muy caro",
      "muy costoso",
      "no tengo presupuesto",
      "está muy caro",
      "no me alcanza",
      "caro",
      "costoso",
      "no puedo pagar",
    ],
    category: "objeciones",
    response: `Entiendo que el presupuesto es importante. IngenIA Base cuesta ${formatCOP(P.base.mensual)}/mes en pesos colombianos, con ${P.gratis.diasPrueba} días de prueba sin tarjeta; el plan anual sale en ${formatCOP(P.base.anual)} y el segundo hijo paga ${formatCOP(P.base.segundoHijo)}/mes. El ADN de Aprendizaje es gratuito, para que pruebes antes de decidir.`,
  },
  {
    id: "objeccion_tiempo",
    patterns: [
      "no tengo tiempo",
      "muy ocupado",
      "no me da tiempo",
      "sin tiempo",
      "horario complicado",
      "no tengo horario",
      "muy ocupada",
    ],
    category: "objeciones",
    response:
      "Entendemos que los horarios son ajustados. Por eso ofrecemos modalidad online y horarios flexibles incluyendo sábados. Las sesiones son de 45 a 60 minutos y tú eliges la frecuencia semanal.",
  },
  {
    id: "objeccion_no_estoy_seguro",
    patterns: [
      "no estoy seguro",
      "no estoy segura",
      "voy a pensarlo",
      "lo voy a pensar",
      "después te confirmo",
      "más adelante",
      "todavía no sé",
      "lo pensaré",
    ],
    category: "objeciones",
    response: `Por supuesto, tómate el tiempo que necesites. Mientras tanto puedes hacer gratis el ADN de Aprendizaje o probar IngenIA ${P.gratis.diasPrueba} días sin tarjeta. ¿Te gustaría empezar?`,
  },
];
