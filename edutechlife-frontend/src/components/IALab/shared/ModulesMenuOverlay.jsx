/**
 * ModulesMenuOverlay — panel lateral de módulos (solo móvil).
 *
 * Replica el mismo efecto que el menú "Abrir menú": fondo oscuro que funde,
 * panel que se desliza desde la izquierda con spring, arrastre para cerrar,
 * Esc y devolución del foco al botón que lo abrió. Dentro solo se muestra la
 * lista de módulos; al tocar uno se navega a ese módulo.
 */
import PropTypes from "prop-types";
import { forwardRef, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../i18n/I18nProvider";
import { useIALabProgressContext } from "../../../context/IALabContext";
import { useIALabStore } from "../../../store/ialabStore";
import { Icon } from "../../../utils/iconMapping.jsx";
import ModuleNavItem from "../sidebar/ModuleNavItem";

export const ModulesMenuOverlay = forwardRef(function ModulesMenuOverlay(
  { show, closing, onClose, width, springDamping, springStiffness, triggerId },
  ref,
) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    modules = [],
    activeMod = 1,
    completedModules = [],
  } = useIALabProgressContext() ?? {};

  // Cerrar con Esc y devolver el foco al botón que abrió el panel.
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const trigger = triggerId ? document.getElementById(triggerId) : null;
      if (trigger) trigger.focus();
    };
  }, [show, onClose, triggerId]);

  const goToModule = (id) => {
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1 || n > 5) return;
    onClose();
    navigate(`/ialab/${n}`);
  };

  return show || closing ? (
    <div
      ref={ref}
      id="ialab-modules-menu"
      className="fixed inset-0 z-[1001] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t("ialab.tab_modules") || "Módulos"}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-250 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClose}
      />
      <motion.div
        initial={false}
        animate={{ x: closing ? -width : 0 }}
        transition={{
          type: "spring",
          damping: springDamping,
          stiffness: springStiffness,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.4, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onClose();
        }}
        className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-slate-800 shadow-xl overflow-y-auto"
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <Icon
            name="fa-layer-group"
            className="text-sm text-[var(--theme-emphasis)]"
            aria-hidden="true"
          />
          <span className="text-sm font-bold text-[var(--theme-primary)] dark:text-slate-100">
            {t("ialab.tab_modules") || "Módulos"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close") || "Cerrar"}
            className="ml-auto w-10 h-10 -mr-2 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/50"
          >
            <Icon name="fa-xmark" className="text-sm" aria-hidden="true" />
          </button>
        </div>

        <div className="p-3 space-y-1" data-testid="modules-menu-list">
          {modules.map((mod) => (
            <ModuleNavItem
              key={mod.id}
              mod={mod}
              isActive={activeMod === mod.id}
              isLocked={useIALabStore.getState().isModuleLocked(mod.id)}
              isCompleted={completedModules.includes(mod.id)}
              score={useIALabStore.getState().calculateModuleScore(mod.id)}
              variant="expanded"
              onClick={goToModule}
            />
          ))}
        </div>
      </motion.div>
    </div>
  ) : null;
});

ModulesMenuOverlay.propTypes = {
  show: PropTypes.bool,
  closing: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  springDamping: PropTypes.number.isRequired,
  springStiffness: PropTypes.number.isRequired,
  triggerId: PropTypes.string,
};

export default memo(ModulesMenuOverlay);
