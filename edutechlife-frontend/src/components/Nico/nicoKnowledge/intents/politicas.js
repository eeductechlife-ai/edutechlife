export const politicas = [
  {
    id: "cancelacion",
    patterns: [
      "cancelar",
      "cancelación",
      "cancelacion",
      "permanencia",
      "sin permanencia",
      "me puedo salir",
      "darse de baja",
      "terminar contrato",
      "cancelar suscripción",
    ],
    category: "politicas",
    response:
      "Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. No hay permanencia mínima ni costos de cancelación. Mantienes acceso hasta el final del período pagado.",
  },
  {
    id: "garantia",
    patterns: [
      "garantía",
      "garantia",
      "satisfacción garantizada",
      "qué pasa si no me gusta",
      "devolución",
      "reembolso",
      "si no funciona",
    ],
    category: "politicas",
    response:
      "Ofrecemos primera clase gratuita para que pruebes sin riesgo. Además, si no estás satisfecho, puedes cancelar en cualquier momento sin penalización ni permanencia. Tu satisfacción es nuestra prioridad.",
  },
];
