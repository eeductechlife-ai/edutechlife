import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";
import TrafficLightControls from "../shared/TrafficLightControls";

const TopicResourcesHeader = ({
  title,
  onClose,
  stopSpeech,
  onToggleFullscreen,
  isFullscreen,
  t,
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-petroleum to-corporate backdrop-blur-sm">
    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon name="fa-book-open" className="text-white text-lg sm:text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg sm:text-xl font-bold text-white truncate">
          {title}
        </h2>
      </div>
    </div>
    <div className="flex-shrink-0 mt-3 sm:mt-0 ml-0 sm:ml-4 w-full sm:w-auto flex justify-center sm:justify-start">
      <TrafficLightControls
        onClose={() => {
          stopSpeech();
          onClose();
        }}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
        closeLabel={t("ialab.viewer_modal.close_aria")}
        fullscreenEnterLabel={t("ialab.viewer_modal.fullscreen_enter")}
        fullscreenExitLabel={t("ialab.viewer_modal.fullscreen_exit")}
      />
    </div>
  </div>
);

TopicResourcesHeader.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  stopSpeech: PropTypes.func,
  onToggleFullscreen: PropTypes.func,
  isFullscreen: PropTypes.bool,
  t: PropTypes.func,
};

export default TopicResourcesHeader;
