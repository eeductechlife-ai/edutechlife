// Botones de los planes de IngenIA (landing /conoce-ingenia y /planes).
// Según los términos aprobados, los planes personalizados incluyen valoración
// gratis de 20 minutos ANTES de cualquier cobro: no pasan por Wompi.

// Planes que cobran directo con Wompi (ids del catálogo del backend, data/plans.js).
export const INGENIA_CHECKOUT_PLAN_IDS = new Set([
  "smartboard_premium", // IngenIA Base, $49.900/mes
  "ingenia_fundador", // Precio Fundador, cupo limitado
]);

// Planes personalizados: van a la valoración gratis, nunca al checkout.
export const INGENIA_VALORACION_PLAN_IDS = new Set([
  "ingenia_acompanamiento", // Personalizado · Acompañamiento
  "ingenia_intensivo", // Personalizado · Intensivo
]);

// Sin sesión, los planes de pago piden registro o ingreso y vuelven a la landing.
export const INGENIA_SIGNUP_FOR_PLAN =
  "/sign-up/ingenia?returnTo=/conoce-ingenia";

// id de la tarjeta en la landing (IngenIALandingData) -> id del catálogo del backend.
export const INGENIA_LANDING_PLAN_IDS = {
  base: "smartboard_premium",
  personalizado: "ingenia_acompanamiento",
};

export const resolveLandingPlanId = (cardId) =>
  INGENIA_LANDING_PLAN_IDS[cardId] ?? cardId;

/**
 * Decide qué hace el botón de un plan.
 * - Plan personalizado: onValoracion (valoración gratis, sin cobro).
 * - Plan de pago directo sin sesión: onSignIn (registro o ingreso).
 * - Plan de pago directo con sesión: pide el checkout y redirige a Wompi.
 *   Si el checkout falla o no devuelve URL, llama a onError y registra el error.
 * - Cualquier otro plan: onRegister (registro de siempre).
 */
export async function elegirPlanIngenIA({
  planId,
  isSignedIn,
  startCheckout,
  onSignIn,
  onRegister,
  onValoracion,
  redirect,
  onError,
  logError = console.error,
}) {
  if (INGENIA_VALORACION_PLAN_IDS.has(planId)) return onValoracion();
  if (!INGENIA_CHECKOUT_PLAN_IDS.has(planId)) return onRegister();
  if (!isSignedIn) return onSignIn();
  try {
    const { url } = await startCheckout(planId);
    if (!url) throw new Error("El pago no devolvió una URL");
    redirect(url);
  } catch (err) {
    logError("Error:", err);
    onError();
  }
}
