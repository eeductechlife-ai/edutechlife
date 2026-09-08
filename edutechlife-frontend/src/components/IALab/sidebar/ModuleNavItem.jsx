import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../../utils/iconMapping";
import { useTranslation } from "../../../i18n/I18nProvider";

const ModuleNavItem = ({
  mod,
  isActive = false,
  isLocked = false,
  score = 0,
  variant = "expanded",
  onClick,
  motionVariants,
  whileHover,
  whileTap,
  className = "",
  children,
}) => {
  const { t } = useTranslation();
  const [showUnlockTip, setShowUnlockTip] = useState(false);
  const completed = !isLocked && score >= 80;
  const prevModId = mod.id > 1 ? mod.id - 1 : null;

  if (variant === "compact") {
    return (
      <motion.button
        onClick={() => !isLocked && onClick?.(mod.id)}
        disabled={isLocked}
        whileHover={whileHover ?? (isLocked ? {} : { scale: 1.05 })}
        whileTap={whileTap ?? (isLocked ? {} : { scale: 0.95 })}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`relative w-full min-h-[44px] rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40 flex-shrink-0 ${
          isActive
            ? "theme-bg-emphasis shadow-md"
            : "hover:bg-[var(--theme-emphasis)]/8 dark:hover:bg-[var(--theme-emphasis)]/15"
        } ${isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Módulo ${mod.id}: ${mod.title}${isLocked ? " (bloqueado)" : ""}`}
      >
        {isActive && (
          <motion.div
            layoutId="activeModuleBar"
            className="absolute -left-1.5 w-[3px] h-5 rounded-full theme-bg-emphasis shadow-sm"
          />
        )}
        {isLocked ? (
          <Icon
            name="fa-lock"
            className="text-sm theme-text-muted"
            aria-hidden="true"
          />
        ) : (
          <Icon
            name={mod.icon || "fa-graduation-cap"}
            className={`text-sm ${isActive ? "text-white" : "text-[var(--theme-emphasis)] dark:text-[#4DA8C4]"}`}
            aria-hidden="true"
          />
        )}
        <span
          className={`absolute bottom-1 right-1.5 text-[9px] font-extrabold leading-none ${isActive ? "text-white/80" : "text-[var(--theme-emphasis)]/60 dark:text-[#4DA8C4]/60"}`}
        >
          {mod.id}
        </span>
        {completed && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm ring-1 ring-white dark:ring-slate-800">
            <Icon
              name="fa-check"
              className="text-[6px] text-white"
              aria-hidden="true"
            />
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        variants={motionVariants}
        onClick={() => {
          if (isLocked) {
            setShowUnlockTip((v) => !v);
            return;
          }
          onClick?.(mod.id);
        }}
        className={`w-full group flex items-center gap-2 min-h-[44px] p-2.5 rounded-xl transition-all duration-300 ${
          isActive
            ? "theme-bg-emphasis shadow-md"
            : "hover:theme-surface-2 text-slate-700 dark:text-slate-100"
        } ${isLocked ? "cursor-pointer" : ""} focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/30 focus:ring-offset-1 ${className}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={`${mod.title}${isLocked ? " (bloqueado)" : ""}`}
        aria-expanded={isLocked ? showUnlockTip : undefined}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
            isActive
              ? "bg-[var(--theme-on-emphasis)]/15"
              : isLocked
                ? "bg-slate-100 dark:bg-slate-700/70"
                : "theme-bg-primary-10 dark:bg-[var(--theme-primary)]/15 group-hover:theme-bg-primary-20"
          }`}
        >
          {isLocked ? (
            <Icon
              name="fa-lock"
              className="text-xs text-slate-500 dark:text-slate-300"
              aria-hidden="true"
            />
          ) : (
            <Icon
              name={mod.icon || "fa-graduation-cap"}
              className={`text-sm ${isActive ? "theme-text-on-emphasis" : "text-[var(--theme-emphasis)] dark:text-[#4DA8C4] group-hover:text-[var(--theme-primary)]"}`}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p
            className={`font-semibold text-sm truncate transition-colors ${isActive ? "theme-text-on-emphasis" : isLocked ? "text-slate-400 dark:text-slate-300" : "text-slate-700 dark:text-slate-100 group-hover:text-[var(--theme-primary)]"}`}
          >
            {mod.title}
          </p>
          {!isLocked && score > 0 && (
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isActive ? "bg-[var(--theme-on-emphasis)]/60" : "theme-bg-primary"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          )}
          {isLocked && prevModId && (
            <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight mt-0.5">
              {t("ialab.unlock_requirement", { prev: prevModId })}
            </p>
          )}
        </div>
        {!isLocked && completed && (
          <Icon
            name="fa-check"
            className="text-xs text-emerald-500"
            aria-hidden="true"
          />
        )}
        {children}
      </motion.button>
    </div>
  );
};

ModuleNavItem.displayName = "ModuleNavItem";

ModuleNavItem.propTypes = {
  mod: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool,
  isLocked: PropTypes.bool,
  score: PropTypes.number,
  variant: PropTypes.oneOf(["expanded", "compact"]),
  onClick: PropTypes.func,
  motionVariants: PropTypes.object,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ModuleNavItem;
