/**
 * toolbits — Bits visuales del workspace inmersivo por herramienta.
 *
 * Componentes 100% presentacionales (sin lógica de negocio):
 *   PromptCard      → tarjeta de prompt vacío (ChatGPT/Gemini/NotebookLM)
 *   ConversationItem→ fila del rail de conversaciones/sesiones
 *   TypingDots      → indicador de "escribiendo" del asistente
 *   SendCircle      → botón de enviar circular (flecha/estrella por tool)
 *
 * Colores SOLO vía utilidades .theme-* (themes.css); la fuente única de
 * valores es themes/toolConfig.js → CSS custom properties.
 */
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { TOOL_BRAND_ICONS } from "../themes/toolConfig";

const ease = [0.22, 0.61, 0.36, 1];

export function PromptCard({ title, subtitle, icon, index = 0, onClick }) {
  const Comp = onClick ? "button" : "div";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease }}
    >
      <Comp
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`theme-prompt-card w-full rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm ${
          onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""
        }`}
      >
        {icon && (
          <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl theme-chip">
            <svg
              className="h-4.5 w-4.5"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={icon} />
            </svg>
          </span>
        )}
        <p className="theme-text text-sm font-semibold leading-snug">{title}</p>
        {subtitle && (
          <p className="theme-text-muted mt-1 text-xs leading-relaxed">
            {subtitle}
          </p>
        )}
      </Comp>
    </motion.div>
  );
}

export function ConversationItem({
  title,
  subtitle,
  active = false,
  icon,
  onClick,
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <motion.div
      whileHover={onClick ? { x: 3 } : undefined}
      transition={{ duration: 0.2, ease }}
    >
      <Comp
        type={onClick ? "button" : undefined}
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 ${
          active ? "theme-rail-active" : "theme-rail-hover"
        }`}
      >
        {icon && (
          <svg
            className="theme-text-rail-muted h-4 w-4 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={icon} />
          </svg>
        )}
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-[13px] font-medium leading-tight ${
              active ? "theme-text-rail" : "theme-text-rail-muted"
            }`}
          >
            {title}
          </span>
          {subtitle && (
            <span className="theme-text-rail-muted block truncate text-[11px] leading-tight opacity-80">
              {subtitle}
            </span>
          )}
        </span>
      </Comp>
    </motion.div>
  );
}

export function TypingDots({ label = "escribiendo" }) {
  return (
    <motion.div
      className="theme-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-2"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease }}
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="theme-rail-active inline-block h-1.5 w-1.5 rounded-full"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

/**
 * Botón de enviar circular estilo ChatGPT. Recibe `iconName` (de
 * TOOL_BRAND_ICONS) y se pinta con .theme-send (fondo por tema).
 */
export function SendCircle({
  iconName = "sendArrow",
  label = "Enviar",
  disabled,
  onClick,
}) {
  const d = TOOL_BRAND_ICONS[iconName] || TOOL_BRAND_ICONS.sendArrow;
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
      className={`theme-send flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-current/50 ${
        disabled ? "cursor-not-allowed opacity-40" : "hover:opacity-90"
      }`}
    >
      <svg
        className="h-5 w-5"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    </motion.button>
  );
}

PromptCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  index: PropTypes.number,
  onClick: PropTypes.func,
};

ConversationItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  active: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

TypingDots.propTypes = {
  label: PropTypes.string,
};

SendCircle.propTypes = {
  iconName: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
