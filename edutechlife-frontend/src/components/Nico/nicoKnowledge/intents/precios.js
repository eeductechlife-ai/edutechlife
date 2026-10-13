import {
  PRECIOS_INGENIA as P,
  CONDICIONES_INGENIA as C,
  formatCOP,
  fechaLimiteFundador,
} from "../../../../config/preciosIngenia.js";

export const precios = [
  {
    id: "precios_vak",
    patterns: [
      "cuánto cuesta vak",
      "precio vak",
      "valor vak",
      "costo vak",
      "cuánto vale vak",
      "precios vak",
      "cuánto es vak",
      "precio del diagnóstico vak",
    ],
    category: "precios",
    response:
      "El ADN de Aprendizaje es completamente gratuito. Incluye una evaluación completa de tu estilo de aprendizaje con resultados detallados y recomendaciones personalizadas. Los planes de seguimiento tienen costo.",
  },
  {
    id: "precios_stem",
    patterns: [
      "cuánto cuesta stem",
      "precio stem",
      "valor stem",
      "costo stem",
      "cuánto vale stem",
      "precios stem",
      "cuánto es stem",
      "precio de robótica",
      "precio de programación",
    ],
    category: "precios",
    response:
      "No ofrecemos robótica ni programación. Nuestra oferta es IALab (curso de IA para jóvenes y adultos), IngenIA (acompañamiento con IA para niños y jóvenes) y el ADN de Aprendizaje. Cuéntanos la edad y el objetivo por WhatsApp y te orientamos con el plan adecuado. Trabajamos en pesos colombianos.",
  },
  {
    id: "precios_tutorias",
    patterns: [
      "cuánto cuesta una tutoría",
      "precio tutoría",
      "valor tutorías",
      "costo tutorías",
      "precio de tutorías",
      "cuánto vale una tutoría",
      "costo de tutorías",
    ],
    category: "precios",
    response:
      "El acompañamiento académico se ofrece dentro de nuestros programas (IALab para IA y IngenIA para niños y jóvenes, con el tutor Dani). El valor depende del plan; escríbenos por WhatsApp +57 323 836 5517 y te enviamos la cotización vigente en pesos colombianos. El ADN de Aprendizaje es gratuito.",
  },
  {
    id: "precios_bienestar",
    patterns: [
      "cuánto cuesta bienestar",
      "precio bienestar",
      "precio psicología",
      "costo bienestar",
      "cuánto vale bienestar",
      "precios bienestar",
      "cuánto cuesta el programa de bienestar",
    ],
    category: "precios",
    response:
      "El bienestar y el acompañamiento emocional están integrados en IngenIA (apoyo a niños y jóvenes con detección de señales de alerta). Los planes se publican en pesos colombianos; por WhatsApp te damos el detalle vigente.",
  },
  {
    id: "precios_ingles",
    patterns: [
      "cuánto cuesta inglés",
      "precio inglés",
      "valor inglés",
      "costo inglés",
      "cuánto vale inglés",
      "precios inglés",
      "precio del curso de inglés",
    ],
    category: "precios",
    response:
      "El inglés no se vende por separado hoy; la oferta actual de EdutechLife es IALab (curso de IA), IngenIA (niños y jóvenes) y el ADN de Aprendizaje. Para orientarte según lo que buscas, escríbenos por WhatsApp +57 323 836 5517.",
  },
  {
    id: "planes_disponibles",
    patterns: [
      "qué planes tienen",
      "planes disponibles",
      "planes de pago",
      "planes mensuales",
      "planes estudiante",
      "planes educador",
      "planes institución",
      "planes de suscripción",
    ],
    category: "precios",
    response: `Trabajamos en pesos colombianos (COP). IngenIA Base cuesta ${formatCOP(P.base.mensual)}/mes (o ${formatCOP(P.base.anual)} al año) con ${P.gratis.diasPrueba} días de prueba sin tarjeta, y el Personalizado con coach docente va desde ${formatCOP(P.acompanamiento.mensualDesde)}/mes. El ADN de Aprendizaje es gratuito. Para colegios armamos una propuesta a la medida, y el valor vigente de IALab te lo damos por WhatsApp +57 323 836 5517.`,
  },
  {
    id: "descuentos",
    patterns: [
      "descuento",
      "descuentos",
      "promociones",
      "ofertas",
      "hermanos",
      "planes familiares",
      "descuento para hermanos",
    ],
    category: "precios",
    response: `En IngenIA el segundo hijo paga ${formatCOP(P.base.segundoHijo)}/mes y el plan anual cuesta ${formatCOP(P.base.anual)}. Las primeras ${P.fundador.cupos} familias que entren hasta el ${fechaLimiteFundador()} tienen precio Fundador de ${formatCOP(P.fundador.mensual)}/mes, congelado mientras sigan activas. Para colegios hacemos una propuesta a la medida: escríbenos por WhatsApp +57 323 836 5517.`,
  },
  {
    id: "becas",
    patterns: [
      "beca",
      "becas",
      "programa de becas",
      "ayuda financiera",
      "apoyo económico",
      "subsidio",
    ],
    category: "precios",
    response: `Por ahora no manejamos becas. Puedes empezar gratis con el ADN de Aprendizaje y ${P.gratis.diasPrueba} días de prueba de IngenIA sin tarjeta; además, el segundo hijo paga ${formatCOP(P.base.segundoHijo)}/mes. Si es para un colegio, armamos una propuesta a la medida: escríbenos por WhatsApp +57 323 836 5517.`,
  },
  {
    id: "pago_diferido",
    patterns: [
      "pago diferido",
      "pagar después",
      "financiación",
      "cuotas",
      "pago por cuotas",
      "aplazar pago",
      "pagar más tarde",
      "plan de pagos",
    ],
    category: "precios",
    response: `Puedes pagar mes a mes, sin permanencia y cancelando cuando quieras, o tomar el plan anual de IngenIA por ${formatCOP(P.base.anual)}. Los precios son finales en pesos colombianos, con IVA incluido si aplica, y tienes garantía de devolución del dinero de ${C.garantiaDias} días.`,
  },
];
