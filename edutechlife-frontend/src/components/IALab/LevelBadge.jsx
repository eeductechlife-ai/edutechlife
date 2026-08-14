/**
 * LevelBadge — Muestra nivel de dominio (1-4) para un módulo/OVA
 *
 * ADITIVO: Componente puramente visual. Recibe props, no depende del store.
 * Puede insertarse donde sea sin afectar layout existente.
 *
 * Sistema de niveles pedagógicos:
 *   Level 1 (⭐)      — Conoces el concepto
 *   Level 2 (⭐⭐)     — Entiendes las implicaciones
 *   Level 3 (⭐⭐⭐)    — Puedes construir
 *   Level 4 (⭐⭐⭐⭐)   — Eres experto
 *
 * Uso:
 *   <LevelBadge level={2} compact />
 *   <LevelBadge level={3} showLabel />
 *   <LevelBadge level={4} size="lg" />
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n/I18nProvider";

const LEVEL_CONFIG = {
  0: {
    name: "ialab.level_badge.level0_name",
    color: "bg-gray-400",
    textColor: "text-gray-500 dark:text-gray-400",
    ringColor: "ring-gray-300",
    description: "ialab.level_badge.level0_desc",
    stars: 0,
  },
  1: {
    name: "ialab.level_badge.level1_name",
    color: "bg-gradient-to-br from-sky-400 to-cyan-500",
    textColor: "text-sky-700 dark:text-sky-300",
    ringColor: "ring-sky-300",
    description: "ialab.level_badge.level1_desc",
    stars: 1,
  },
  2: {
    name: "ialab.level_badge.level2_name",
    color: "bg-gradient-to-br from-emerald-400 to-teal-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
    ringColor: "ring-emerald-300",
    description: "ialab.level_badge.level2_desc",
    stars: 2,
  },
  3: {
    name: "ialab.level_badge.level3_name",
    color: "bg-gradient-to-br from-violet-500 to-purple-600",
    textColor: "text-violet-700 dark:text-violet-300",
    ringColor: "ring-violet-300",
    description: "ialab.level_badge.level3_desc",
    stars: 3,
  },
  4: {
    name: "ialab.level_badge.level4_name",
    color: "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500",
    textColor: "text-amber-700 dark:text-amber-300",
    ringColor: "ring-amber-300",
    description: "ialab.level_badge.level4_desc",
    stars: 4,
  },
};

const SIZES = {
  sm: {
    container: "gap-1.5",
    badge: "w-8 h-8 text-xs",
    label: "text-[10px]",
    description: "text-[10px]",
  },
  md: {
    container: "gap-2",
    badge: "w-10 h-10 text-sm",
    label: "text-xs",
    description: "text-[11px]",
  },
  lg: {
    container: "gap-3",
    badge: "w-14 h-14 text-base",
    label: "text-sm",
    description: "text-xs",
  },
};

const Stars = ({ count, size = "xs" }) => {
  const sizeClass =
    size === "lg" ? "text-sm" : size === "md" ? "text-xs" : "text-[10px]";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className={`${sizeClass} ${n <= count ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

Stars.propTypes = {
  count: PropTypes.number.isRequired,
  size: PropTypes.string,
};

const LevelBadge = ({
  level = 0,
  size = "md",
  showLabel = false,
  showStars = true,
  showDescription = false,
  compact = false,
  animated = true,
  className = "",
}) => {
  const { t } = useTranslation();
  const safeLevel = Math.max(0, Math.min(4, Math.floor(level)));
  const config = LEVEL_CONFIG[safeLevel];
  const sizeClasses = SIZES[size] || SIZES.md;

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  if (compact) {
    return (
      <Wrapper
        {...wrapperProps}
        className={`inline-flex items-center gap-1.5 ${className}`}
        title={`${t(config.name)} — ${t(config.description)}`}
      >
        <div
          className={`${sizeClasses.badge} rounded-full ${config.color} flex items-center justify-center font-bold text-white shadow-sm ring-2 ${config.ringColor} ring-opacity-30`}
        >
          {safeLevel}
        </div>
        {showStars && <Stars count={config.stars} size={size} />}
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={`inline-flex items-center ${sizeClasses.container} ${className}`}
    >
      <div
        className={`${sizeClasses.badge} rounded-full ${config.color} flex items-center justify-center font-bold text-white shadow-md ring-2 ${config.ringColor} ring-opacity-40 relative`}
      >
        {safeLevel}
        {safeLevel === 4 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(251, 146, 60, 0.4)",
                "0 0 0 8px rgba(251, 146, 60, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex flex-col items-start">
        {showStars && <Stars count={config.stars} size={size} />}
        {showLabel && (
          <span
            className={`${sizeClasses.label} font-bold ${config.textColor}`}
          >
            {t(config.name)}
          </span>
        )}
        {showDescription && (
          <span
            className={`${sizeClasses.description} text-gray-500 dark:text-gray-400`}
          >
            {t(config.description)}
          </span>
        )}
      </div>
    </Wrapper>
  );
};

LevelBadge.propTypes = {
  level: PropTypes.number,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  showLabel: PropTypes.bool,
  showStars: PropTypes.bool,
  showDescription: PropTypes.bool,
  compact: PropTypes.bool,
  animated: PropTypes.bool,
  className: PropTypes.string,
};

export default LevelBadge;
