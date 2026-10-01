import PropTypes from "prop-types";
import { useTranslation } from "../../../i18n/I18nProvider";

const MaxClearConfirm = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">
        {t("ialab.max.clear_confirm")}
      </span>
      <button
        onClick={onConfirm}
        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded px-1"
        aria-label={t("ialab.max.clear_confirm_yes_aria")}
      >
        {t("ialab.max.clear_confirm_yes")}
      </button>
      <button
        onClick={onCancel}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded px-1"
        aria-label={t("ialab.max.clear_confirm_no_aria")}
      >
        {t("ialab.max.clear_confirm_no")}
      </button>
    </div>
  );
};

MaxClearConfirm.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default MaxClearConfirm;
