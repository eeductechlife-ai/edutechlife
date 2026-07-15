import React from "react";
import { Icon } from "../../../utils/iconMapping.jsx";

export const StatsCards = ({ cards, t }) => (
  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-b from-petroleum/[0.02] to-white border-b border-slate-200/40">
    {cards.map((item, i) => (
      <div
        key={i}
        className={`group bg-white rounded-xl border border-slate-200/60 shadow-sm p-2 sm:p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${item.small ? "col-span-2 sm:col-span-1" : ""}`}
      >
        <Icon
          name={item.icon}
          className={`text-lg sm:text-xl mx-auto mb-1 group-hover:scale-110 transition-transform duration-200 ${item.color}`}
        />
        <p
          className={`text-base sm:text-lg font-bold font-montserrat tracking-tight ${item.color} ${item.small ? "text-xs sm:text-sm truncate" : ""}`}
        >
          {item.value}
        </p>
        <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {item.labelKey ? t(item.labelKey) : item.label}
        </p>
      </div>
    ))}
  </div>
);
