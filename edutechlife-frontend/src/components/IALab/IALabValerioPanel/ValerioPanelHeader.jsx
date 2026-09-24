import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { stopSpeech } from "../../../utils/speech";
import { useTranslation } from "../../../i18n/I18nProvider";
import { tutorAvatars, DEFAULT_AVATAR } from "../../../data/tutorAvatars";
import ValerioContextIndicator from "./ValerioContextIndicator";

const ValerioPanelHeader = ({
  valerioState,
  setValerioState,
  currentModule,
  userLevel,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <div className="sticky top-0 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 sm:px-5 sm:pt-4 sm:pb-4 rounded-t-none sm:rounded-t-2xl">
      <div className="flex items-start justify-between gap-2 mb-2.5 sm:items-center sm:gap-4 sm:mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={tutorAvatars.MAX || DEFAULT_AVATAR}
            alt="MAX"
            data-testid="valerio-avatar"
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-white/30 flex-shrink-0"
          />
          <div className="flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold truncate">
                {t("ialab.valerio.title")}
              </h2>
              <p className="text-[11px] sm:text-xs opacity-90 truncate">
                {t("ialab.valerio.module_label", {
                  title: currentModule?.title,
                })}
              </p>
            </div>
            <ValerioContextIndicator currentModule={currentModule} />
          </div>
        </div>

        <button
          onClick={() => {
            stopSpeech();
            onClose();
          }}
          className="text-white hover:text-slate-200 transition-colors p-2 min-w-[44px] min-h-[44px] rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label={t("ialab.valerio.close_aria")}
        >
          <Icon name="fa-xmark" className="text-xl" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              valerioState === "idle"
                ? "bg-emerald-400"
                : valerioState === "thinking"
                  ? "bg-purple-400"
                  : valerioState === "speaking"
                    ? "bg-cyan-400"
                    : "bg-blue-400"
            }`}
          />
          <span>
            {valerioState === "idle"
              ? t("ialab.valerio.status_idle")
              : valerioState === "thinking"
                ? t("ialab.valerio.status_thinking")
                : valerioState === "speaking"
                  ? t("ialab.valerio.status_speaking")
                  : t("ialab.valerio.status_listening")}
          </span>
        </div>
        <div className="h-4 w-px bg-white/30" />
        <div className="flex items-center gap-2">
          <Icon name="fa-layer-group" className="text-xs" />
          <span>
            {t("ialab.valerio.level_label", {
              level:
                userLevel < 3
                  ? t("ialab.valerio.level_beginner")
                  : userLevel < 6
                    ? t("ialab.valerio.level_intermediate")
                    : t("ialab.valerio.level_advanced"),
            })}
          </span>
        </div>

        {valerioState === "speaking" && (
          <button
            type="button"
            onClick={() => {
              stopSpeech();
              setValerioState?.("idle");
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 px-2.5 py-1 min-h-[28px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label={t("ialab.valerio.stop_audio")}
          >
            <Icon name="fa-stop" className="text-[10px]" />
            <span>{t("ialab.valerio.stop_audio")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

ValerioPanelHeader.propTypes = {
  valerioState: PropTypes.string,
  setValerioState: PropTypes.func,
  currentModule: PropTypes.object,
  userLevel: PropTypes.number,
  onClose: PropTypes.func,
};

export default ValerioPanelHeader;
