import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Gem } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { SB_GRADIENTS, glow } from "../smartboardTheme";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

const EXPLORE_GRADIENT = SB_GRADIENTS.explore; // "linear-gradient(135deg, #7B2FF7 0%, #9D4EDD 55%, #C77DFF 100%)"
const EXPLORE_GLOW = "#9D4EDD";

const MissionsView = memo(function MissionsView({
  missions,
  onCompleteMission,
}) {
  const { t } = useTranslation();

  const completedCount = missions.filter((m) => m.completed).length;
  const total = missions.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Section header banner */}
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{ background: EXPLORE_GRADIENT }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-white drop-shadow-sm">
              Mis Misiones
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              {total > 0
                ? `${completedCount} de ${total} completadas`
                : "Completa actividades para desbloquear misiones"}
            </p>
          </div>
          {total > 0 && (
            <div className="flex-shrink-0 text-right">
              <span className="text-2xl font-black text-white">{pct}%</span>
            </div>
          )}
        </div>
        {total > 0 && (
          <div
            className="relative z-10 mt-3 w-full h-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: "rgba(255,255,255,0.85)" }}
            />
          </div>
        )}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(30%,-30%)",
          }}
        />
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white"
            style={{
              background: EXPLORE_GRADIENT,
              boxShadow: glow(EXPLORE_GLOW, 0.4),
            }}
          >
            <span className="text-2xl">🚀</span>
          </div>
          <p className="text-[#1E293B] font-semibold">
            No hay misiones disponibles aún
          </p>
          <p className="text-[#94A3B8] text-sm mt-1">
            Completa actividades para desbloquear nuevas misiones
          </p>
        </div>
      ) : (
        missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              mission.completed
                ? "bg-green-50 border-green-200"
                : "bg-white border-[#E2E8F0] hover:border-[#9D4EDD]/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  mission.completed
                    ? "bg-green-100 text-green-600"
                    : "bg-[#F5F0FF]"
                }`}
              >
                {mission.completed ? (
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2.4} />
                ) : (
                  mission.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-bold ${mission.completed ? "text-green-600 line-through" : "text-[#1E293B]"}`}
                >
                  {mission.title}
                </h4>
                <p className="text-sm text-[#64748B]">{mission.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1 text-sm font-black tabular-nums ${mission.completed ? "text-green-500" : "text-[#9D4EDD]"}`}
                >
                  <Gem className="w-3.5 h-3.5" strokeWidth={2.4} />+{mission.xp}
                </span>
                {!mission.completed && (
                  <motion.button
                    onClick={() => {
                      track(EVENTS.MISSION_STARTED, {
                        mission_id: mission.id,
                        title: mission.title || "",
                      });
                      onCompleteMission(mission.id);
                    }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="block mt-1 px-3 py-1.5 text-white text-xs rounded-full font-bold"
                    style={{
                      background: EXPLORE_GRADIENT,
                      boxShadow: glow(EXPLORE_GLOW, 0.4),
                    }}
                  >
                    {t("smartboard.complete_btn")}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
});

export default MissionsView;
