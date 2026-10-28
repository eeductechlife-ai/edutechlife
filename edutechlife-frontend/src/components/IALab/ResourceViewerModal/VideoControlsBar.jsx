import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";
import { formatTime, SPEEDS } from "./VideoViewerParts";

// Barra de controles del reproductor: progreso (sin adelantar), reproducir,
// volumen, tiempo, velocidad y subtítulos.
const VideoControlsBar = ({
  showControls,
  progress,
  playing,
  muted,
  volume,
  currentTime,
  duration,
  durationLoading,
  youtubeDuration,
  resourceDuration,
  rate,
  showSpeed,
  ccActive,
  onTogglePlay,
  onToggleMute,
  onChangeVolume,
  onToggleSpeed,
  onChangeRate,
  onToggleCaptions,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4">
        <div className="group/progress relative mb-2 cursor-default">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="absolute -top-2 left-0 w-4 h-4 bg-[var(--theme-primary)] rounded-full shadow-lg ring-2 ring-white/30"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={onTogglePlay}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-[var(--theme-primary)] transition-colors"
            aria-label={
              playing
                ? t("ialab.viewer_modal.pause")
                : t("ialab.viewer_modal.play")
            }
          >
            {playing ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <Icon name="fa-play" className="text-sm" />
            )}
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5 group/vol">
            <button
              onClick={onToggleMute}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label={
                muted
                  ? t("ialab.viewer_modal.unmute")
                  : t("ialab.viewer_modal.mute")
              }
            >
              <Icon
                name={muted || volume === 0 ? "fa-volume-mute" : "fa-volume-up"}
                className="text-[10px]"
              />
            </button>
            <div className="w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200">
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-16 h-1 accent-[var(--theme-primary)] cursor-pointer"
                aria-label={t("ialab.viewer_modal.volume")}
              />
            </div>
          </div>

          <span className="text-xs text-white/70 font-mono whitespace-nowrap">
            {formatTime(currentTime)} /{" "}
            {durationLoading
              ? "..."
              : formatTime(duration) ||
                youtubeDuration ||
                resourceDuration ||
                "0:00"}
          </span>

          <div className="flex-1" />

          <div className="relative">
            <button
              onClick={onToggleSpeed}
              className="px-3 h-11 min-h-[44px] text-[11px] font-bold text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              aria-label={t("ialab.viewer_modal.speed_label")}
            >
              {rate}x
            </button>
            {showSpeed && (
              <div className="absolute bottom-full right-0 mb-2 bg-slate-900 border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[100px]">
                <p className="text-[9px] text-white/40 uppercase tracking-wider px-2 pb-1">
                  {t("ialab.viewer_modal.speed")}
                </p>
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => onChangeRate(s)}
                    className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${rate === s ? "bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] font-bold" : "text-white/70 hover:bg-white/10"}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onToggleCaptions}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label={t("ialab.viewer_modal.cc")}
            title={t("ialab.viewer_modal.cc")}
          >
            <Icon
              name="fa-closed-captioning"
              className={`text-[10px] ${ccActive ? "text-[var(--theme-primary)]" : "text-white/70 hover:text-white"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

VideoControlsBar.propTypes = {
  showControls: PropTypes.bool,
  progress: PropTypes.number,
  playing: PropTypes.bool,
  muted: PropTypes.bool,
  volume: PropTypes.number,
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  durationLoading: PropTypes.bool,
  youtubeDuration: PropTypes.string,
  resourceDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rate: PropTypes.number,
  showSpeed: PropTypes.bool,
  ccActive: PropTypes.bool,
  onTogglePlay: PropTypes.func.isRequired,
  onToggleMute: PropTypes.func.isRequired,
  onChangeVolume: PropTypes.func.isRequired,
  onToggleSpeed: PropTypes.func.isRequired,
  onChangeRate: PropTypes.func.isRequired,
  onToggleCaptions: PropTypes.func.isRequired,
};

export default VideoControlsBar;
