import { memo } from "react";
import { motion } from "framer-motion";
import { Rocket, CheckCircle2, Gem } from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { SB_GRADIENTS, glow } from "../smartboardTheme";

const MissionsView = memo(function MissionsView({
  missions,
  onCompleteMission,
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-black tracking-tight text-[#00303F]">
          {t("smartboard.missions_view_title")}
        </h3>
        <span className="text-sm font-bold text-[#64748B] tabular-nums">
          {missions.length > 0 ? `${missions.filter((m) => m.completed).length}/${missions.length}` : "0/0"}
        </span>
      </div>
      {missions.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white"
            style={{ background: SB_GRADIENTS.explore, boxShadow: glow("#9D4EDD", 0.4) }}
          >
            <Rocket className="w-8 h-8" strokeWidth={2.2} />
          </div>
          <p className="text-[#64748B] font-semibold">No hay misiones disponibles aún</p>
          <p className="text-[#94A3B8] text-sm mt-1">Completa actividades para desbloquear nuevas misiones</p>
        </div>
      ) : missions.map((mission, index) => (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            mission.completed
              ? "bg-green-50 border-green-200"
              : "bg-white border-[#E2E8F0] hover:border-[#4DA8C4]/30"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                mission.completed ? "bg-green-100 text-green-600" : "bg-[#F4F9FC]"
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
                className={`font-bold ${mission.completed ? "text-green-600 line-through" : "text-[#00303F]"}`}
              >
                {mission.title}
              </h4>
              <p className="text-sm text-[#64748B]">{mission.description}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 text-sm font-black tabular-nums ${mission.completed ? "text-green-500" : "text-[#0096C7]"}`}
              >
                <Gem className="w-3.5 h-3.5" strokeWidth={2.4} />+{mission.xp}
              </span>
              {!mission.completed && (
                <motion.button
                  onClick={() => onCompleteMission(mission.id)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="block mt-1 px-3 py-1.5 text-white text-xs rounded-full font-bold"
                  style={{ background: SB_GRADIENTS.brand, boxShadow: glow("#0096C7", 0.4) }}
                >
                  {t("smartboard.complete_btn")}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

export default MissionsView;
