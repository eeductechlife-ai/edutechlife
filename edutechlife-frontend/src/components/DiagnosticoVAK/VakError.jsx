import { useTranslation } from "../../i18n/I18nProvider";

// Pantalla de error del Diagnóstico VAK.
// onRestart: callback invocado al pulsar "Reiniciar" (limpia el error y vuelve a "intro").
const VakError = ({ onRestart }) => {
  const { t } = useTranslation();

  return (
    <div className="p-10 text-center">
      <div className="text-red-500 mb-4 font-semibold">
        {t("vak.ui.error_loading_diagnosis")}
      </div>
      <button className="btn-primary" onClick={onRestart}>
        {t("vak.ui.restart_btn")}
      </button>
    </div>
  );
};

export default VakError;
