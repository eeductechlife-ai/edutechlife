import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import { useSkillPassport } from "../../hooks/useSkillPassport";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";

const TREND_ICONS = { up: "📈", stable: "➡️", down: "📉" };

/**
 * Skill Passport — shows the student's competency mastery by subject,
 * sorted from strongest to weakest, with level labels and unlocked badges.
 */
const SkillPassport = memo(() => {
  const { supabaseQueries } = useSmartBoardKids();
  const studentDbId = supabaseQueries?.studentData?.data?.id ?? null;
  const { passport, badges, loading, fetchPassport } = useSkillPassport();

  useEffect(() => {
    if (studentDbId) fetchPassport(studentDbId);
  }, [studentDbId, fetchPassport]);

  if (loading && !passport.length) {
    return (
      <div
        className="space-y-3"
        aria-busy="true"
        aria-label="Cargando Pasaporte de Habilidades"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[#E2E8F0] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!passport.length) {
    return (
      <div className="text-center py-10 space-y-2">
        <span className="text-4xl block">🎒</span>
        <p className="text-sm font-bold text-[#004B63]">
          Tu Pasaporte de Habilidades está vacío
        </p>
        <p className="text-xs text-[#64748B]">
          Completa actividades para ver tus competencias aquí.
        </p>
      </div>
    );
  }

  const unlockedBadges = badges.filter((b) => b.unlocked);

  return (
    <div className="space-y-5">
      {/* Subject mastery cards */}
      <div className="space-y-3">
        {passport.map((item, i) => (
          <motion.div
            key={item.subject}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm"
          >
            <span className="text-2xl w-8 text-center flex-shrink-0">
              {item.level.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-[#004B63] truncate">
                  {item.label}
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: item.level.color + "20",
                    color: item.level.color,
                  }}
                >
                  {item.level.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.level.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.masteryPercent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                </div>
                <span className="text-xs font-bold text-[#64748B] flex-shrink-0 w-8 text-right">
                  {item.masteryPercent}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Unlocked badges */}
      {unlockedBadges.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">
            Badges desbloqueados
          </p>
          <div className="flex flex-wrap gap-2">
            {unlockedBadges.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200"
                title={b.description}
                role="img"
                aria-label={b.name}
              >
                <span className="text-base">{b.icon}</span>
                <span className="text-xs font-bold text-amber-800">
                  {b.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges preview */}
      {badges.filter((b) => !b.unlocked).length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">
            Por desbloquear
          </p>
          <div className="flex flex-wrap gap-2">
            {badges
              .filter((b) => !b.unlocked)
              .map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] opacity-50"
                  title={b.description}
                >
                  <span className="text-base grayscale">{b.icon}</span>
                  <span className="text-xs text-[#94A3B8]">{b.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
});

SkillPassport.displayName = "SkillPassport";
export default SkillPassport;
