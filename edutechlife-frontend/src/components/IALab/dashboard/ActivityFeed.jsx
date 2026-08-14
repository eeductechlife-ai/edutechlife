import { useMemo } from "react";
import { motion } from "framer-motion";
import { useIALabStore } from "../../../store/ialabStore";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";

const actionIcons = {
  exam: { icon: "fa-file-text", bg: "bg-purple-100", color: "text-purple-500" },
  challenge: { icon: "fa-trophy", bg: "bg-amber-100", color: "text-amber-500" },
  community: {
    icon: "fa-comments",
    bg: "bg-green-100",
    color: "text-green-500",
  },
  resources: {
    icon: "fa-video",
    bg: "bg-corporate/10",
    color: "text-corporate",
  },
};

function ActivityFeed() {
  const { t } = useTranslation();
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const completedExams = useIALabStore((s) => s.completedExams);

  const activities = useMemo(() => {
    const items = [];
    for (let id = 5; id >= 1; id--) {
      const mod = moduleProgress[id];
      if (!mod) continue;
      if (mod.resourcesCompleted) {
        items.push({
          type: "resources",
          id: `res-${id}`,
          label: t("ialab.activity_feed.resources_completed", { module: id }),
          moduleId: id,
        });
      }
      if (mod.exam) {
        const score = completedExams[id];
        items.push({
          type: "exam",
          id: `exam-${id}`,
          label: score
            ? t("ialab.activity_feed.exam_passed_score", { module: id, score })
            : t("ialab.activity_feed.exam_passed", { module: id }),
          moduleId: id,
        });
      }
      if (mod.challenge) {
        items.push({
          type: "challenge",
          id: `ch-${id}`,
          label: t("ialab.activity_feed.challenge_completed", { module: id }),
          moduleId: id,
        });
      }
      if (mod.community) {
        items.push({
          type: "community",
          id: `comm-${id}`,
          label: t("ialab.activity_feed.forum_participation", { module: id }),
          moduleId: id,
        });
      }
    }
    return items.slice(0, 10);
  }, [moduleProgress, completedExams, t]);

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="fa-history" className="w-4 h-4 text-slate-500" />
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t("ialab.activity_feed.title")}
          </p>
        </div>
        <p className="text-xs text-slate-400 text-center py-4">
          {t("ialab.activity_feed.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="fa-history" className="w-4 h-4 text-slate-500" />
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {t("ialab.activity_feed.title")}
        </p>
      </div>
      <div className="space-y-0">
        {activities.map((a, i) => {
          const style = actionIcons[a.type] || actionIcons.resources;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0"
            >
              <div
                className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon name={style.icon} className={`w-4 h-4 ${style.color}`} />
              </div>
              <p className="text-xs text-slate-700">{a.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityFeed;
