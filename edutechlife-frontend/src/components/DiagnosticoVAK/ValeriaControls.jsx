import { Volume, VolumeOff } from "lucide-react";
import { useTranslation } from "../../i18n/I18nProvider";
import { tutorAvatars, DEFAULT_AVATAR } from "../../data/tutorAvatars";

// Mapeo de expresiones de Valeria a colores EdutechLife
const EXPRESSION_CONFIG = {
  neutral: { color: "#4DA8C4", bgColor: "#4DA8C4/20" },
  happy: { color: "#66CCCC", bgColor: "#66CCCC/20" },
  excited: { color: "#4DA8C4", bgColor: "#4DA8C4/30" },
  thinking: { color: "#004B63", bgColor: "#004B63/15" },
  encouraging: { color: "#66CCCC", bgColor: "#66CCCC/25" },
  celebrating: { color: "#4DA8C4", bgColor: "#4DA8C4/30" },
  calm: { color: "#B2D8E5", bgColor: "#B2D8E5/20" },
  proud: { color: "#4DA8C4", bgColor: "#4DA8C4/25" },
  concerned: { color: "#004B63", bgColor: "#004B63/10" },
  curious: { color: "#66CCCC", bgColor: "#66CCCC/20" },
};

// Barra de controles de Valeria — guía por voz del Diagnóstico VAK
const ValeriaControls = ({
  valeriaEnabled,
  setValeriaEnabled,
  valeriaVolume,
  setValeriaVolume,
  isSpeaking,
  valeriaExpression,
}) => {
  const { t } = useTranslation();
  const config =
    EXPRESSION_CONFIG[valeriaExpression] || EXPRESSION_CONFIG.neutral;

  return (
    <div className="valeria-controls-bar">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <div className="valeria-logo">
          <div className="valeria-avatar-container">
            <div className={`valeria-avatar ${isSpeaking ? "speaking" : ""}`}>
              <img
                src={tutorAvatars.Valeria || DEFAULT_AVATAR}
                alt="Valeria"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
              />
            </div>
            {isSpeaking && (
              <div
                className="valeria-avatar-pulse"
                style={{ borderColor: config.color }}
              ></div>
            )}
          </div>
          <div className="valeria-logo-content">
            <span className="valeria-logo-text">
              {t("vak.ui.valeria_name")}
            </span>
            <span className="valeria-logo-subtitle">
              {t("vak.ui.valeria_subtitle")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSpeaking && (
            <div className="valeria-speaking-indicator">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <span>{t("vak.ui.speaking")}</span>
            </div>
          )}

          <button
            onClick={() => setValeriaEnabled(!valeriaEnabled)}
            className={`valeria-btn-toggle-premium ${!valeriaEnabled ? "muted" : ""}`}
            title={valeriaEnabled ? t("vak.ui.mute") : t("vak.ui.unmute")}
          >
            {valeriaEnabled ? (
              <Volume className="valeria-icon-premium" />
            ) : (
              <VolumeOff className="valeria-icon-premium" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={valeriaVolume}
            onChange={(e) => setValeriaVolume(parseFloat(e.target.value))}
            className="valeria-volume-slider"
            disabled={!valeriaEnabled}
            title={t("vak.ui.volume")}
          />

          <span className="valeria-volume-label">
            {Math.round(valeriaVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ValeriaControls;
