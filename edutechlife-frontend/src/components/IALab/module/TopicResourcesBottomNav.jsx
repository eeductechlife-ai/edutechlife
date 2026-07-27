import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import { cn } from "../../forum/forumDesignSystem";

const getResourceIcon = (type) => {
  if (type === "video") return "fa-video";
  if (
    type === "document" ||
    type === "documento" ||
    type === "pdf" ||
    type === "pdf-thumbnail"
  )
    return "fa-file-lines";
  if (type === "image" || type === "imagen") return "fa-image";
  if (type === "ova" || type === "ova-thumbnail" || type === "ova_interactive")
    return "fa-brain";
  if (type === "interactive" || type === "interactivo")
    return "fa-puzzle-piece";
  return "fa-file";
};

const TopicResourcesBottomNav = ({
  currentResource,
  activeResourceIndex,
  totalResources,
  durationLoading,
  youtubeDuration,
  onPrevious,
  onNext,
  onSelect,
  t,
}) => {
  const resourceType = currentResource?.type;

  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-petroleum/25 bg-white flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            "bg-gradient-to-br from-petroleum/10 to-corporate/10 text-petroleum text-sm sm:text-lg",
          )}
        >
          <Icon
            name={getResourceIcon(resourceType)}
            className="text-petroleum w-4 h-4 sm:w-5 sm:h-5"
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-petroleum text-xs sm:text-sm truncate">
            {currentResource?.title ||
              t("ialab.topic_resources.select_resource")}
          </h4>
          <div className="flex items-center gap-1 sm:gap-2 text-xs text-petroleum/60">
            {resourceType === "video" && (
              <span>
                {durationLoading
                  ? t("common.loading")
                  : youtubeDuration || currentResource?.duration}
              </span>
            )}
            {currentResource?.format && <span>{currentResource.format}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          onClick={() => {
            if (activeResourceIndex > 0) {
              onSelect(activeResourceIndex - 1);
              onPrevious();
            }
          }}
          disabled={activeResourceIndex <= 0}
          className={cn(
            "w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-petroleum/25 border-l-4 border-l-petroleum transition-all duration-200 flex items-center justify-center bg-white shadow-sm",
            activeResourceIndex <= 0
              ? "text-petroleum/50 cursor-not-allowed opacity-40"
              : "text-petroleum hover:bg-petroleum/5 hover:border-l-corporate hover:shadow",
          )}
          aria-label={t("ialab.viewer_modal.previous_aria")}
        >
          <Icon name="fa-chevron-left" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="px-3 py-1 bg-gradient-to-br from-petroleum/10 to-corporate/10 text-petroleum rounded-full text-sm font-medium">
          {activeResourceIndex + 1} / {totalResources}
        </div>
        <button
          onClick={() => {
            if (activeResourceIndex < totalResources - 1) {
              onSelect(activeResourceIndex + 1);
              onNext();
            }
          }}
          disabled={activeResourceIndex >= totalResources - 1}
          className={cn(
            "w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-petroleum/25 border-l-4 border-l-petroleum transition-all duration-200 flex items-center justify-center bg-white shadow-sm",
            activeResourceIndex >= totalResources - 1
              ? "text-petroleum/50 cursor-not-allowed opacity-40"
              : "text-petroleum hover:bg-petroleum/5 hover:border-l-corporate hover:shadow",
          )}
          aria-label={t("ialab.viewer_modal.next_aria")}
        >
          <Icon name="fa-chevron-right" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

TopicResourcesBottomNav.propTypes = {
  currentResource: PropTypes.object,
  activeResourceIndex: PropTypes.number,
  totalResources: PropTypes.number,
  durationLoading: PropTypes.bool,
  youtubeDuration: PropTypes.string,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  onSelect: PropTypes.func,
  t: PropTypes.func,
};

export default TopicResourcesBottomNav;
