import React from "react";
import { Icon } from "../../utils/iconMapping.jsx";

const UserSettingsSection = ({
  setMenuItemRef,
  focusedIndex,
  staggerStyle,
  handleSettingsSupport,
  t,
}) => {
  return (
    <button
      ref={setMenuItemRef(4)}
      role="menuitem"
      tabIndex={focusedIndex === 4 ? 0 : -1}
      className="group flex items-center gap-2.5 w-full px-3 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-slate-300 rounded-lg shadow-sm hover:shadow hover:border-l-petroleum hover:bg-slate-50 transition-all duration-200 cursor-pointer text-left"
      onClick={handleSettingsSupport}
      style={staggerStyle(4)}
    >
      <Icon
        name="fa-cog"
        className="text-sm text-slate-600 flex-shrink-0"
      />
      <span className="text-xs font-semibold text-slate-800 group-hover:text-petroleum transition-colors duration-200">
        {t("modals.settings.title")}
      </span>
    </button>
  );
};

export default React.memo(UserSettingsSection);
