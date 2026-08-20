import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const TopicResourcesMetaBar = ({
  estimatedTime,
  difficulty,
  resourceCount,
  t,
}) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[var(--theme-emphasis)]/70 px-4 sm:px-6 py-3 bg-white border-b border-[var(--theme-emphasis)]/25">
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 flex items-center justify-center">
        <Icon
          name="fa-clock"
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-emphasis)]"
        />
      </div>
      <span>{estimatedTime}</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 flex items-center justify-center">
        <Icon
          name="fa-chart-line"
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-emphasis)]"
        />
      </div>
      <span className="px-1.5 sm:px-2 py-0.5 bg-[var(--theme-emphasis)]/10 rounded-full text-[var(--theme-emphasis)]/80 font-medium text-xs sm:text-sm">
        {difficulty}
      </span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 flex items-center justify-center">
        <Icon
          name="fa-layer-group"
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-emphasis)]"
        />
      </div>
      <span>
        {t("ialab.topic_resources.resources_count", { count: resourceCount })}
      </span>
    </div>
  </div>
);

TopicResourcesMetaBar.propTypes = {
  estimatedTime: PropTypes.string,
  difficulty: PropTypes.string,
  resourceCount: PropTypes.number,
  t: PropTypes.func,
};

export default TopicResourcesMetaBar;
