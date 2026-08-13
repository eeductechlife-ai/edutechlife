import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";

export function TrafficLightControls({
  onClose,
  onToggleFullscreen,
  isFullscreen = false,
  showFullscreen = true,
  closeLabel,
  fullscreenEnterLabel,
  fullscreenExitLabel,
}) {
  const { t } = useTranslation();
  const resolvedCloseLabel = closeLabel ?? t("ialab.traffic_light.close");
  const resolvedEnterLabel =
    fullscreenEnterLabel ?? t("ialab.traffic_light.fullscreen_enter");
  const resolvedExitLabel =
    fullscreenExitLabel ?? t("ialab.traffic_light.fullscreen_exit");
  return (
    <div
      className="flex items-center gap-[3px]"
      role="group"
      aria-label={t("ialab.traffic_light.group_aria")}
    >
      {showFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="relative w-[7px] h-[7px] rounded-full bg-[#22C55E] hover:brightness-110 transition-all flex items-center justify-center focus-visible:outline-none after:content-[''] after:absolute after:-inset-3"
          aria-label={isFullscreen ? resolvedExitLabel : resolvedEnterLabel}
          title={isFullscreen ? resolvedExitLabel : resolvedEnterLabel}
        >
          <Icon
            name={isFullscreen ? "fa-compress" : "fa-expand"}
            className="text-[3px] text-[#0D4F1E]"
          />
        </button>
      )}
      <button
        onClick={onClose}
        className="relative w-[7px] h-[7px] rounded-full bg-[#EF4444] hover:brightness-110 transition-all flex items-center justify-center focus-visible:outline-none after:content-[''] after:absolute after:-inset-3"
        aria-label={resolvedCloseLabel}
        title={resolvedCloseLabel}
      >
        <Icon name="fa-times" className="text-[3px] text-[#7F1D1D]" />
      </button>
    </div>
  );
}

export default TrafficLightControls;
