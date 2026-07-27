import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Icon } from "../../../utils/iconMapping.jsx";

const TopicHeader = ({
  tema,
  index,
  expandedTopic,
  setExpandedTopic,
  isTopicCompleted,
  topicDuration,
  prefersReducedMotion,
  t,
}) => (
  <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-b from-slate-100/80 to-transparent dark:from-slate-700/40">
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-petroleum/[0.04] to-corporate/[0.02] rounded-full blur-2xl pointer-events-none" />
    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-petroleum/[0.03] to-corporate/[0.02] rounded-full blur-2xl pointer-events-none" />
    <div
      className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-all duration-300 z-10 ${
        isTopicCompleted
          ? "bg-emerald-400"
          : "bg-gradient-to-r from-petroleum via-petroleum-dark to-corporate"
      }`}
    />
    <motion.button
      data-testid={`topic-btn-${index}`}
      whileHover={prefersReducedMotion ? {} : { scale: 1.005 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => {
        setExpandedTopic((prev) => (prev === index ? null : index));
      }}
      aria-expanded={expandedTopic === index}
      aria-controls={`topic-content-${index}`}
      className={`group flex items-center gap-4 w-full px-5 py-4 bg-white dark:bg-slate-800 rounded-[calc(2rem-1.5px)] shadow-sm hover:shadow-lg hover:shadow-petroleum/5 transition-all duration-300 cursor-pointer text-left border border-transparent hover:border-petroleum/20 dark:hover:border-petroleum/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/40 ${
        isTopicCompleted
          ? "bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/10"
          : ""
      }`}
      aria-label={t("ialab.topic.resources_aria", {
        title: tema.title,
      })}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
          isTopicCompleted
            ? "bg-emerald-100 dark:bg-emerald-900/30"
            : "bg-gradient-to-br from-petroleum/15 to-corporate/15 group-hover:from-petroleum/20 group-hover:to-corporate/20 dark:from-petroleum/20 dark:to-corporate/20"
        }`}
      >
        <Icon
          name={tema.icon}
          className={`text-xl ${
            isTopicCompleted
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-petroleum dark:text-corporate"
          }`}
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className={`text-base font-semibold line-clamp-2 transition-colors duration-300 flex items-center gap-2 font-montserrat ${
            isTopicCompleted
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-slate-800 group-hover:text-petroleum dark:text-slate-100"
          }`}
        >
          {tema.title}
          {isTopicCompleted && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-1.5 py-0.5 rounded-md flex-shrink-0">
              {t("ialab.completed")}
            </span>
          )}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-petroleum dark:text-petroleum bg-gradient-to-r from-petroleum/[0.06] to-transparent">
            <Icon name="fa-file" className="w-3 h-3" aria-hidden="true" />
            {tema.resources} {t("ialab.resources_label")}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-corporate bg-corporate/10 dark:bg-corporate/20">
            <Icon name="fa-clock" className="w-3 h-3" aria-hidden="true" />
            {topicDuration}
          </span>
        </div>
      </div>

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ml-2 ${
          expandedTopic === index
            ? "bg-petroleum/10 rotate-180 dark:bg-petroleum/20"
            : "bg-corporate/15 group-hover:scale-110 group-hover:bg-petroleum/15 dark:bg-corporate/20"
        }`}
      >
        <Icon
          name="fa-chevron-down"
          className={`w-3.5 h-3.5 transition-colors ${
            expandedTopic === index ? "text-petroleum" : "text-corporate"
          }`}
          aria-hidden="true"
        />
      </div>
    </motion.button>
  </div>
);

TopicHeader.propTypes = {
  tema: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.string,
    resources: PropTypes.number,
  }),
  index: PropTypes.number,
  expandedTopic: PropTypes.number,
  setExpandedTopic: PropTypes.func,
  isTopicCompleted: PropTypes.bool,
  topicDuration: PropTypes.string,
  prefersReducedMotion: PropTypes.bool,
  t: PropTypes.func,
};

export default TopicHeader;
