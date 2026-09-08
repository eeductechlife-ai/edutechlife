import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";
import TooltipIcon from "./SidebarTooltipIcon";
import ModuleNavItem from "./ModuleNavItem";

const formatPoints = (pts) => {
  if (pts >= 1000) return `${(pts / 1000).toFixed(1).replace(".0", "")}k`;
  return pts.toString();
};

const MiniDivider = () => (
  <div className="relative w-full flex items-center justify-center py-0.5">
    <div className="w-8 h-px bg-gradient-to-r from-transparent via-[var(--theme-emphasis)]/20 dark:via-[var(--theme-emphasis)]/40 to-transparent" />
  </div>
);

const getNextStepHint = (moduleProgress, activeMod, t) => {
  const mod = moduleProgress?.[activeMod];
  if (!mod) return null;
  if (mod.exam)
    return (
      t("ialab.next_step_exam_done") || "¡Módulo aprobado! Avanza al siguiente."
    );
  if (mod.resourcesCompleted)
    return (
      t("ialab.next_step_ready_exam") || "Listo para el examen. ¡Hazlo ahora!"
    );
  return t("ialab.next_step_content") || "Completa el contenido del módulo.";
};

const SidebarCollapsed = ({
  courseProgress,
  modules,
  activeMod,
  isModuleLocked,
  calculateModuleScore,
  moduleProgress,
  streak,
  isStreakAtRisk,
  getLevel,
  getTotalPoints,
  storedCertificate,
  setShowCertificateModal,
  goToModule,
  goToProgress,
  setShowLeaderboard,
  setShowStudyPlannerModal,
  onToggleSidebar,
  fadeTransition,
  t,
}) => {
  const nextStepHint = getNextStepHint(moduleProgress, activeMod, t);
  return (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fadeTransition}
      className="relative flex flex-col items-center px-2 py-4 gap-2 ring-1 ring-inset ring-[var(--theme-emphasis)]/10 dark:ring-[var(--theme-emphasis)]/20"
    >
      <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-[var(--theme-emphasis)]/30 via-[var(--theme-primary)]/30 to-transparent rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-8 w-28 h-28 bg-gradient-to-br from-[var(--theme-emphasis)]/5 to-[var(--theme-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── ZONA 1: TU AVANCE (clic → expandir sidebar) ── */}
      <TooltipIcon
        decorative
        label={
          <div>
            <p className="text-xs font-bold text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]">
              {t("sidebar.completed_pct", { pct: Math.round(courseProgress) })}
            </p>
            {nextStepHint && (
              <p className="text-[10px] text-slate-300 mt-0.5 leading-snug max-w-[140px]">
                {nextStepHint}
              </p>
            )}
          </div>
        }
        premium
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-full h-[60px] flex items-center justify-center flex-shrink-0 relative group cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/30 rounded-full"
          role="progressbar"
          aria-valuenow={Math.round(courseProgress)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`${Math.round(courseProgress)}% ${t("sidebar.completed")} — ${t("sidebar.toggle_collapse_tip")}`}
        >
          <div className="relative w-14 h-14 rounded-full shadow-[0_0_14px_rgba(0,188,212,0.25)]">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-pulse motion-reduce:animate-none pointer-events-none bg-[radial-gradient(circle,rgba(0,188,212,0.30),transparent_72%)]"
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full ring-1 ring-[#00BCD4]/50 animate-pulse motion-reduce:animate-none pointer-events-none"
            />
            <svg
              className="relative w-14 h-14 -rotate-90"
              viewBox="0 0 120 120"
            >
              <defs>
                <linearGradient
                  id="sidebar-progress-grad-collapsed"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#004B63" />
                  <stop offset="100%" stopColor="#00BCD4" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="50"
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#sidebar-progress-grad-collapsed)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="314.159"
                strokeDashoffset={
                  314.159 - (314.159 * Math.min(courseProgress, 100)) / 100
                }
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xs font-extrabold text-[var(--theme-emphasis)] dark:text-[#4DA8C4]">
                {Math.round(courseProgress)}%
              </span>
            </div>
          </div>
        </button>
      </TooltipIcon>

      {/* Racha en riesgo — única alerta urgente visible en colapsado */}
      {isStreakAtRisk() && streak > 0 && (
        <TooltipIcon
          label={`${t("sidebar.streak_days", { streak })} — ${t("sidebar.streak_study_today")}`}
          premium
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                <Icon
                  name="fa-fire"
                  className="text-white text-xs"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>
        </TooltipIcon>
      )}

      <MiniDivider />

      {/* ── ZONA 2: MÓDULOS ── */}
      <h2 className="sr-only">{t("sidebar.modules")}</h2>
      <div className="flex flex-col gap-1 w-full" role="list">
        {modules.map((mod) => {
          const locked = isModuleLocked(mod.id);
          const isActive = activeMod === mod.id;
          const modScore = calculateModuleScore(mod.id);
          return (
            <div key={mod.id} role="listitem">
              <TooltipIcon
                premium
                label={
                  <div>
                    <p className="text-xs font-bold text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]">
                      {t("sidebar.module_tooltip", {
                        id: mod.id,
                        title: mod.title,
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[var(--theme-primary)] font-semibold">
                        {modScore}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-full"
                          style={{ width: `${modScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                }
              >
                <ModuleNavItem
                  mod={mod}
                  isActive={isActive}
                  isLocked={locked}
                  score={modScore}
                  variant="compact"
                  onClick={goToModule}
                />
              </TooltipIcon>
            </div>
          );
        })}
      </div>

      {storedCertificate && (
        <>
          <MiniDivider />
          <TooltipIcon label={t("sidebar.certificate_view")}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => setShowCertificateModal(true)}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              aria-label={t("sidebar.certificate_view")}
            >
              <Icon
                name="fa-certificate"
                className="text-white text-sm"
                aria-hidden="true"
              />
            </motion.button>
          </TooltipIcon>
        </>
      )}
      <div className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)]/25 to-[var(--theme-emphasis)]/30 rounded-full pointer-events-none" />
    </motion.div>
  );
};

SidebarCollapsed.propTypes = {
  courseProgress: PropTypes.number,
  modules: PropTypes.array,
  activeMod: PropTypes.number,
  isModuleLocked: PropTypes.func,
  calculateModuleScore: PropTypes.func,
  moduleProgress: PropTypes.object,
  streak: PropTypes.number,
  isStreakAtRisk: PropTypes.func,
  getLevel: PropTypes.func,
  getTotalPoints: PropTypes.func,
  storedCertificate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  setShowCertificateModal: PropTypes.func,
  goToModule: PropTypes.func,
  goToProgress: PropTypes.func,
  setShowLeaderboard: PropTypes.func,
  setShowStudyPlannerModal: PropTypes.func,
  onToggleSidebar: PropTypes.func,
  fadeTransition: PropTypes.object,
  t: PropTypes.func,
};

export default React.memo(SidebarCollapsed);
