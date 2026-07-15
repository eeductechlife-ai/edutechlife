import React from "react";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import {
  ACTIVITY_CONFIG,
  MODULE_NAMES,
  FILTER_OPTIONS,
} from "../activityConfig";
import { formatDate, formatTimeAgo } from "../activityUtils";
import { SectionLine } from "./ActivityAccordion";

export const ActivityList = ({
  filteredActivities,
  sortedDates,
  groupedByDate,
  filter,
  setFilter,
  t,
}) => {
  return (
    <div>
      <div className="px-4 sm:px-6 py-3 border-b border-slate-200/40 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-petroleum uppercase tracking-wider mr-0.5">
            {t("activity.stats.filter_label")}
          </span>
          {FILTER_OPTIONS.map(({ key, labelKey, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 min-h-[44px] text-[10px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                filter === key
                  ? "bg-gradient-to-r from-petroleum to-corporate text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Icon name={icon} className="text-[9px]" />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>
      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 shadow-inner">
            <Icon name="fa-clock" className="text-slate-400 text-3xl" />
          </div>
          <p className="text-base font-bold text-slate-700 font-montserrat">
            {t("activity.empty.title")}
          </p>
          <p className="text-xs text-slate-400 text-center mt-1.5 max-w-xs leading-relaxed">
            {t("activity.empty.desc")}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sortedDates.map((date) => (
            <div
              key={date}
              className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-petroleum/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <SectionLine />
                <p className="text-[11px] font-bold text-petroleum uppercase tracking-wider">
                  {formatDate(date)}
                </p>
                <div className="flex-1 h-px bg-gradient-to-r from-petroleum/10 to-transparent" />
              </div>
              <div className="space-y-2">
                {groupedByDate[date].map((activity) => {
                  const config =
                    ACTIVITY_CONFIG[activity.activity_type] ||
                    ACTIVITY_CONFIG.resource;
                  const moduleName =
                    MODULE_NAMES[activity.module_id] ||
                    `Módulo ${activity.module_id}`;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/40 shadow-sm hover:shadow-md hover:border-slate-300/50 hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                        style={{
                          background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)`,
                        }}
                      >
                        <Icon
                          name={config.icon}
                          className="text-sm"
                          style={{ color: config.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium text-slate-400">
                            {moduleName}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] text-slate-400">
                            {" "}
                            {formatTimeAgo(activity.completed_at, t)}
                          </span>
                        </div>
                      </div>
                      {activity.score ? (
                        <div
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                            activity.score >= 80
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-500/5"
                              : "bg-petroleum/5 text-petroleum border border-petroleum/10"
                          }`}
                        >
                          {activity.score}%
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100">
                          {t(config.labelKey)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
