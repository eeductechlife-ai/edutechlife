import PropTypes from "prop-types";
import { Icon } from "../../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../../i18n/I18nProvider";

const CASE_META = {
  marketing: {
    icon: "fa-chart-line",
    labelKey: "ialab.challenge.m2.case_label_marketing",
    color: "from-[#10a37f] to-[#128468]",
  },
  support: {
    icon: "fa-headset",
    labelKey: "ialab.challenge.m2.case_label_support",
    color: "from-emerald-500 to-teal-600",
  },
  dev: {
    icon: "fa-code",
    labelKey: "ialab.challenge.m2.case_label_dev",
    color: "from-slate-600 to-slate-800",
  },
};

const CaseContextBanner = ({ selectedCase, stepNumber }) => {
  const { t } = useTranslation();
  if (!selectedCase) return null;
  const meta = CASE_META[selectedCase];
  if (!meta) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[var(--theme-emphasis)]/5 to-[var(--theme-primary)]/5 rounded-xl border border-[var(--theme-primary)]/20 mb-6">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${meta.color} flex items-center justify-center flex-shrink-0`}
      >
        <Icon name={meta.icon} className="text-white text-sm" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-[var(--theme-primary)] uppercase tracking-wider">
          {t("ialab.challenge.m2.building_for")}
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {t(meta.labelKey)}
        </p>
      </div>
      <div className="text-xs text-slate-400">
        {t("ialab.challenge.m2.case_step_label", { step: stepNumber })}
      </div>
    </div>
  );
};

CaseContextBanner.propTypes = {
  selectedCase: PropTypes.string,
  stepNumber: PropTypes.number,
};

export default CaseContextBanner;
