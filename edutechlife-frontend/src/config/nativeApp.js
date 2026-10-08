/**
 * Build de app nativa (Capacitor). Se fija al compilar con
 * VITE_NATIVE_APP=ingenia|ialab (ver scripts app:* en package.json); en el
 * build web queda vacío.
 *
 * En la app nativa no se vende nada: Apple (guía 3.1.1) y Google Play exigen
 * su sistema de cobro para contenido digital y, fuera de EE. UU./UE, no
 * permiten botones ni enlaces a un pago web. La suscripción se compra en
 * edutechlife.co y la app solo inicia sesión.
 */
export const NATIVE_APP = import.meta.env.VITE_NATIVE_APP || null;

export const IS_NATIVE_APP = NATIVE_APP === "ingenia" || NATIVE_APP === "ialab";

export const NATIVE_START_PATH = NATIVE_APP === "ialab" ? "/ialab" : "/ingenia";
