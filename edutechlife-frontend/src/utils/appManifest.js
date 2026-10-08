// Dos apps instalables sobre el mismo dominio: IALab Academic (adultos) e
// IngenIA (niños). El navegador instala la que indique <link rel="manifest">
// en el momento de instalar, así que se cambia según la sección visitada.
// El resto del sitio conserva el manifest de IngenIA (public/manifest.json).

const IALAB_MANIFEST = "/manifest-ialab.json";
const DEFAULT_MANIFEST = "/manifest.json";

const IALAB_PATH = /^\/(ialab(-academic|-pro)?|sign-up\/ialab)(\/|$)/;

export function manifestForPath(pathname) {
  return IALAB_PATH.test(pathname || "") ? IALAB_MANIFEST : DEFAULT_MANIFEST;
}

export function applyManifestForPath(pathname) {
  if (typeof document === "undefined") return;
  const link = document.querySelector('link[rel="manifest"]');
  const href = manifestForPath(pathname);
  if (link && link.getAttribute("href") !== href) {
    link.setAttribute("href", href);
  }
}
