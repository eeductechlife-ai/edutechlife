// Botones "Elegir" de los planes de la landing /conoce-ingenia.
// Los planes de pago van directo al checkout de Wompi; cualquier otro botón
// mantiene el registro de siempre.

// id de la tarjeta (IngenIALandingData) -> id del catálogo del backend (data/plans.js)
export const INGENIA_CHECKOUT_PLAN_IDS = {
  base: "smartboard_premium", // IngenIA Base, $49.900/mes
  personalizado: "ingenia_acompanamiento", // "desde" $149.000/mes
};

export const INGENIA_SIGNUP_FOR_PLAN =
  "/sign-up/ingenia?returnTo=/conoce-ingenia";

/**
 * Decide qué hace el botón de un plan de la landing.
 * - Plan sin pago directo: llama a onRegister (registro de siempre).
 * - Sin sesión: navega a registro/ingreso con returnTo a esta landing.
 * - Con sesión: pide el checkout y redirige a la URL de Wompi.
 * Si el checkout falla o no devuelve URL, avisa con onError y registra el error.
 */
export async function elegirPlanIngenIA({
  planId,
  isSignedIn,
  startCheckout,
  navigate,
  onRegister,
  redirect,
  onError,
  logError = console.error,
}) {
  const checkoutPlanId = INGENIA_CHECKOUT_PLAN_IDS[planId];
  if (!checkoutPlanId) return onRegister();
  if (!isSignedIn) return navigate(INGENIA_SIGNUP_FOR_PLAN);
  try {
    const { url } = await startCheckout(checkoutPlanId);
    if (!url) throw new Error("El pago no devolvió una URL");
    redirect(url);
  } catch (err) {
    logError("Error:", err);
    onError();
  }
}
