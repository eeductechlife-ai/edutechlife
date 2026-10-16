/**
 * Precios oficiales de IngenIA en pesos colombianos (COP).
 *
 * ÚNICA fuente de verdad del sitio: la usan la landing (/conoce-ingenia),
 * `subscriptionTiers.js` y Nico. El backend (`edutechlife-backend/src/data/plans.js`)
 * repite los montos para el checkout de Wompi y una prueba (`precios-sync.test.js`) falla si
 * se separan. Aprobado por el CEO el 2026-10-13
 * (docs/agentes/marketing/HECHOS-VERIFICADOS.md, "Precios oficiales vigentes").
 *
 * Montos en pesos enteros (49900 = $49.900). Cambiar un precio aquí exige
 * cambiarlo en HECHOS-VERIFICADOS.md y en plans.js.
 */

export const MONEDA = "COP";

export const PRECIOS_INGENIA = Object.freeze({
  gratis: Object.freeze({ diasPrueba: 7, sinTarjeta: true }),
  base: Object.freeze({
    planId: "smartboard_premium",
    mensual: 49900,
    anual: 449000,
    segundoHijo: 24900,
  }),
  fundador: Object.freeze({
    planId: "ingenia_fundador",
    mensual: 39900,
    cupos: 50,
    // Lo que ocurra primero: 50 familias o esta fecha. Quien entra conserva el precio.
    vigenteHasta: "2026-11-03",
  }),
  acompanamiento: Object.freeze({
    planId: "ingenia_acompanamiento",
    mensualDesde: 149000,
    sesionesMes: 2,
  }),
  intensivo: Object.freeze({
    planId: "ingenia_intensivo",
    mensual: 249000,
    sesionesMes: 4,
  }),
  sesionPresencial: 20000,
});

/** Condiciones comerciales aprobadas por el CEO el 2026-10-13. */
export const CONDICIONES_INGENIA = Object.freeze({
  garantiaDias: 30,
  valoracionGratisMinutos: 20,
  sinPermanencia: true,
  // "IVA incluido, si aplica": el contador confirma si aplica IVA.
  ivaIncluido: true,
});

/** Formato de pesos colombianos sin decimales: 49900 → "$49.900". */
export function formatCOP(valor) {
  const entero = Math.round(Number(valor) || 0);
  return `$${String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Fecha límite del precio Fundador en texto largo: "3 de noviembre de 2026". */
export function fechaLimiteFundador(locale = "es-CO") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${PRECIOS_INGENIA.fundador.vigenteHasta}T12:00:00Z`));
}

/** Resumen de la oferta oficial para el prompt y las respuestas de Nico. */
export function resumenPreciosNico() {
  const p = PRECIOS_INGENIA;
  const c = CONDICIONES_INGENIA;
  return [
    `IngenIA Gratis: Diagnóstico VAK (ADN de Aprendizaje) y ${p.gratis.diasPrueba} días de prueba sin tarjeta.`,
    `IngenIA Base: ${formatCOP(p.base.mensual)} COP/mes, o ${formatCOP(p.base.anual)} COP al año; segundo hijo ${formatCOP(p.base.segundoHijo)} COP/mes. Tutor IA Dani ilimitado, misiones, VAK, panel y reporte semanal a padres. No incluye coach humano.`,
    `Precio Fundador: ${formatCOP(p.fundador.mensual)} COP/mes congelado mientras la suscripción siga activa, para las primeras ${p.fundador.cupos} familias o hasta el ${fechaLimiteFundador()}, lo que ocurra primero.`,
    `IngenIA Personalizado (cupos limitados): Acompañamiento desde ${formatCOP(p.acompanamiento.mensualDesde)} COP/mes con ${p.acompanamiento.sesionesMes} sesiones al mes con coach docente, valoración inicial, plan a la medida, seguimiento al colegio con autorización y reporte mensual; Intensivo ${formatCOP(p.intensivo.mensual)} COP/mes con ${p.intensivo.sesionesMes} sesiones. Sesión presencial +${formatCOP(p.sesionPresencial)} COP. Valoración gratis de ${c.valoracionGratisMinutos} minutos antes de empezar.`,
    `Condiciones: garantía de devolución del dinero de ${c.garantiaDias} días, cancelación sin permanencia y precios finales con IVA incluido (si aplica).`,
    "Colegios: propuesta a la medida, sin precio publicado; se ofrece contacto por WhatsApp.",
  ].join("\n");
}
