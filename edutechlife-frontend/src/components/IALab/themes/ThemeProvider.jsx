import { createContext, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { mapModuleToTheme, THEME_META } from "./themeMap";

/**
 * ThemeProvider inmersivo para IALab.
 *
 * - Recibe el `moduleId` activo y lo traduce a un nombre de tema.
 * - Expone el tema activo vía React Context (hook `useIALabTheme`).
 * - NO aplica `data-theme` en el DOM directamente; eso lo hace el
 *   consumidor (IALab.jsx) en el container, para que las CSS custom
 *   properties del tema resuelvan por herencia dentro de todo el árbol.
 *   La razón: mantener el DOM predecible y evitar side-effects globales
 *   que rompan otras rutas (SmartBoard, Admin, etc.) cuando IALab desmonte.
 * - Adicionalmente, sincroniza `data-theme` en el elemento raíz del portal
 *   de modales (definido por `portalRootId`) si existe, porque el portal
 *   vive fuera del árbol y no heredaría el tema de otra forma.
 *
 * Uso:
 *   <ThemeProvider moduleId={activeMod}>
 *     <div data-testid="ialab-container" data-theme={theme}> ... </div>
 *   </ThemeProvider>
 *
 *   const { theme, meta } = useIALabTheme();
 */

const ThemeContext = createContext({
  theme: "default",
  meta: THEME_META.default,
});

export const useIALabTheme = () => useContext(ThemeContext);

const ThemeProvider = ({
  moduleId,
  portalRootId = "ialab-modal-root",
  children,
}) => {
  const theme = mapModuleToTheme(moduleId);
  const meta = THEME_META[theme] || THEME_META.default;

  // Propagar el tema a targets fuera del árbol React: portal root dedicado
  // (opcional) y document.body (los OVAs y modales usan `createPortal` con
  // target document.body). Se limpian los atributos al desmontar para no
  // filtrar el tema a otras vistas como SmartBoard o Admin.
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const targets = [];
    const portalRoot = portalRootId
      ? document.getElementById(portalRootId)
      : null;
    if (portalRoot) targets.push(portalRoot);
    if (document.body) targets.push(document.body);

    const previous = targets.map((el) => ({
      el,
      value: el.getAttribute("data-theme"),
    }));
    targets.forEach((el) => el.setAttribute("data-theme", theme));

    return () => {
      previous.forEach(({ el, value }) => {
        if (value === null) el.removeAttribute("data-theme");
        else el.setAttribute("data-theme", value);
      });
    };
  }, [theme, portalRootId]);

  const value = useMemo(() => ({ theme, meta }), [theme, meta]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  moduleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  portalRootId: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
