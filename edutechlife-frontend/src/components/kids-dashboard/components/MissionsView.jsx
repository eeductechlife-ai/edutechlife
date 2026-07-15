import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

const MissionsView = memo(function MissionsView({
  missions,
  onCompleteMission,
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#004B63]">
          {t("smartboard.missions_view_title")}
        </h3>
        <span className="text-sm text-[#64748B]">
          {missions.filter((m) => m.completed).length}/{missions.length}
        </span>
      </div>
      {missions.map((mission, index) => (
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
                mission.completed ? "bg-green-100" : "bg-[#F8FAFC]"
              }`}
            >
              {mission.completed ? "✅" : mission.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold ${mission.completed ? "text-green-600 line-through" : "text-[#004B63]"}`}
              >
                {mission.title}
              </h4>
              <p className="text-sm text-[#64748B]">{mission.description}</p>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold ${mission.completed ? "text-green-500" : "text-[#4DA8C4]"}`}
              >
                +{mission.xp} pts
              </span>
              {!mission.completed && (
                <motion.button
                  onClick={() => onCompleteMission(mission.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block mt-1 px-3 py-1 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-xs rounded-full font-semibold"
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
