import PropTypes from "prop-types";
import { Icon } from "../../../utils/iconMapping.jsx";

const TopicResourcesObjectives = ({ learningObjectives, description, t }) => (
  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-[var(--theme-emphasis)]/25">
    {learningObjectives?.length > 0 && (
      <div className="mb-4">
        <h4 className="font-semibold text-[var(--theme-emphasis)] mb-2 flex items-center gap-2 text-sm sm:text-base">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--theme-emphasis)]/10 to-[var(--theme-primary)]/10 flex items-center justify-center">
            <Icon
              name="fa-bullseye"
              className="text-[var(--theme-emphasis)] w-3.5 h-3.5 sm:w-4 sm:h-4"
            />
          </div>
          {t("ialab.topic_resources.learning_objective")}
        </h4>
        <p className="text-sm sm:text-base text-[var(--theme-emphasis)]/70 leading-relaxed ml-7">
          {learningObjectives[0]}
        </p>
      </div>
    )}
    <p className="text-sm sm:text-base text-[var(--theme-emphasis)]/70 leading-relaxed">
      {description}
    </p>
  </div>
);

TopicResourcesObjectives.propTypes = {
  learningObjectives: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
  t: PropTypes.func,
};

export default TopicResourcesObjectives;
