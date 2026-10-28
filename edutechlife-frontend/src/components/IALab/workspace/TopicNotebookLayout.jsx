import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";
import { Icon } from "../../../utils/iconMapping.jsx";
import { RESOURCE_ICON } from "./TopicChatThreadExtras";

const ease = [0.22, 0.61, 0.36, 1];

const nlmFont = {
  fontFamily: "'Google Sans Text','Roboto','Inter',sans-serif",
};

const NLM_RESOURCE_COLOR = {
  video: { bg: "#e8f0fe", color: "#1a73e8" },
  pdf: { bg: "#fff8e1", color: "#f9ab00" },
  ova_interactive: { bg: "#e6f4ea", color: "#188038" },
  ova: { bg: "#e6f4ea", color: "#188038" },
  document: { bg: "#f3e8fd", color: "#9334e9" },
};

/* ── NotebookLM layout ─────────────────────────────────── */
// Vista del tema con estética NotebookLM (módulo 4): encabezado, descripción
// y la lista de fuentes del tema con su estado (vista, bloqueada o pendiente).
export default function TopicNotebookLayout({
  lesson,
  topicData,
  topicMeta,
  content,
  resources,
  getResourceState,
  onOpenResource,
  prefersReducedMotion,
  children,
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease }
      }
      className="w-full max-w-3xl mx-auto pb-6"
    >
      <div
        className="rounded-2xl border bg-white overflow-hidden"
        style={{ borderColor: "#e0e0e6" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-b"
          style={{ background: "#f8f9ff", borderColor: "#e0e0e6" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#e8f0fe" }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a73e8"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p
              style={{
                ...nlmFont,
                fontSize: 15,
                fontWeight: 600,
                color: "#202124",
              }}
              className="truncate"
            >
              {lesson.title}
            </p>
            <p style={{ ...nlmFont, fontSize: 12, color: "#5f6368" }}>
              {resources.length} fuentes · {topicData.duration || ""}
            </p>
          </div>
        </div>

        {/* Descripción */}
        {(content?.objectiveDesc || lesson.detailedDescription) && (
          <div
            className="px-6 py-5 border-b"
            style={{ borderColor: "#f1f3f4" }}
          >
            {content?.objectiveDesc && (
              <p
                style={{
                  ...nlmFont,
                  fontSize: 14,
                  color: "#5f6368",
                  lineHeight: 1.65,
                  marginBottom: 10,
                }}
              >
                {content.objectiveDesc}
              </p>
            )}
            <p
              style={{
                ...nlmFont,
                fontSize: 15,
                color: "#3c4043",
                lineHeight: 1.7,
              }}
            >
              {lesson.detailedDescription}
            </p>
            {topicMeta?.outcome && (
              <p
                style={{
                  ...nlmFont,
                  fontSize: 15,
                  color: "#3c4043",
                  lineHeight: 1.7,
                  marginTop: 10,
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {t("ialab.topic.outcome_label")}{" "}
                </span>
                {topicMeta.outcome}
              </p>
            )}
          </div>
        )}

        {/* Fuentes del tema */}
        <div className="px-6 py-5">
          <p
            style={{
              ...nlmFont,
              fontSize: 12,
              fontWeight: 600,
              color: "#5f6368",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Fuentes de este tema
          </p>
          <div className="space-y-2">
            {resources.map((resource) => {
              const icon = RESOURCE_ICON[resource.type] || "fa-file";
              const nlmColor = NLM_RESOURCE_COLOR[resource.type] || {
                bg: "#f1f3f4",
                color: "#5f6368",
              };
              const meta =
                resource.duration ||
                resource.estimatedTime ||
                (resource.pages ? `${resource.pages} págs.` : "") ||
                resource.format ||
                "";
              const { isCompleted, locked } = getResourceState(resource);
              return (
                <motion.button
                  key={resource.id}
                  data-testid={`resource-btn-${resource.id}`}
                  disabled={locked}
                  aria-disabled={locked}
                  onClick={locked ? undefined : () => onOpenResource(resource)}
                  whileHover={
                    prefersReducedMotion || locked
                      ? {}
                      : { backgroundColor: "#f8f9ff" }
                  }
                  whileTap={
                    prefersReducedMotion || locked ? {} : { scale: 0.99 }
                  }
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 focus:outline-none ${locked ? "opacity-60 cursor-not-allowed bg-white" : "bg-white cursor-pointer"}`}
                  style={{ borderColor: isCompleted ? "#a8dab5" : "#e0e0e6" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: locked
                        ? "#f1f3f4"
                        : isCompleted
                          ? "#e6f4ea"
                          : nlmColor.bg,
                    }}
                  >
                    <Icon
                      name={
                        locked ? "fa-lock" : isCompleted ? "fa-check" : icon
                      }
                      className="text-sm"
                      style={{
                        color: locked
                          ? "#9aa0a6"
                          : isCompleted
                            ? "#188038"
                            : nlmColor.color,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        ...nlmFont,
                        fontSize: 14,
                        fontWeight: 600,
                        color: locked ? "#9aa0a6" : "#202124",
                      }}
                      className="truncate group-hover:text-[#1a73e8] transition-colors"
                    >
                      {resource.title}
                    </p>
                    {meta && (
                      <p style={{ ...nlmFont, fontSize: 12, color: "#5f6368" }}>
                        {meta}
                      </p>
                    )}
                    {locked && (
                      <p
                        style={{ ...nlmFont, fontSize: 11, color: "#9aa0a6" }}
                        className="mt-0.5"
                      >
                        {t("ialab.status.locked_hint")}
                      </p>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isCompleted ? "#188038" : "#9aa0a6"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="flex-shrink-0"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

TopicNotebookLayout.propTypes = {
  lesson: PropTypes.object.isRequired,
  topicData: PropTypes.object.isRequired,
  topicMeta: PropTypes.object,
  content: PropTypes.object,
  resources: PropTypes.array.isRequired,
  getResourceState: PropTypes.func.isRequired,
  onOpenResource: PropTypes.func.isRequired,
  prefersReducedMotion: PropTypes.bool,
  children: PropTypes.node,
};
