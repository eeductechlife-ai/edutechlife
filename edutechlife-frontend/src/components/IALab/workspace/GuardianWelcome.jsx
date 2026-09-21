/**
 * GuardianWelcome — Módulo 5 (Guardián Digital).
 * Identidad IALab original: petroleum #004b63 + teal #259eb5, escudo como ícono central.
 */
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTranslation } from "../../../i18n/I18nProvider";

const SHIELD_PATH = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
const SHIELD_CHECK_PATH =
  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4";

const SUGGEST_CARDS = [
  {
    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
    labelKey: "ialab.workspace.guardian.card_objectives",
    descKey: "ialab.workspace.guardian.card_objectives_desc",
    section: "objetivos",
    bg: "rgba(0,75,99,0.08)",
    color: "#004b63",
  },
  {
    icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6",
    labelKey: "ialab.workspace.guardian.card_content",
    descKey: "ialab.workspace.guardian.card_content_desc",
    section: "contenido",
    bg: "rgba(37,158,181,0.08)",
    color: "#259eb5",
  },
  {
    icon: SHIELD_CHECK_PATH,
    labelKey: "ialab.workspace.guardian.card_ethics",
    descKey: "ialab.workspace.guardian.card_ethics_desc",
    section: "actividades",
    bg: "rgba(0,75,99,0.08)",
    color: "#004b63",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3",
    labelKey: "ialab.workspace.guardian.card_practice",
    descKey: "ialab.workspace.guardian.card_practice_desc",
    section: "practica",
    bg: "rgba(37,158,181,0.08)",
    color: "#259eb5",
  },
];

export default function GuardianWelcome({
  topics = [],
  description,
  onSelectSection,
  onSelectTopic,
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      key="guardian-welcome"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl pt-8 pb-4"
    >
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
          style={{
            background:
              "linear-gradient(135deg, #003d52 0%, #004b63 50%, #259eb5 100%)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={SHIELD_PATH} />
          </svg>
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold leading-tight"
          style={{
            background:
              "linear-gradient(135deg, #003d52 0%, #004b63 50%, #259eb5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("ialab.workspace.guardian.heading")}
        </h2>
        <p className="text-sm theme-text-muted max-w-sm">
          {t("ialab.workspace.guardian.sub", { n: 5 })}
        </p>
      </div>

      {/* Burbuja de bienvenida */}
      <div className="w-full mb-6 flex gap-3">
        <div
          className="flex-shrink-0 mt-1 h-6 w-6 rounded-full flex items-center justify-center shadow-sm"
          style={{
            background: "linear-gradient(135deg, #003d52, #004b63, #259eb5)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={SHIELD_PATH} />
          </svg>
        </div>
        <div className="flex-1 space-y-2.5">
          <p className="text-sm font-semibold theme-text leading-snug">
            {t("ialab.workspace.guardian.intro_1")}
          </p>
          {description ? (
            <p className="text-sm theme-text-muted leading-relaxed">
              {description
                .split(". ")
                .filter(Boolean)
                .slice(0, 3)
                .join(". ")
                .trim()
                .replace(/\.$/, "") + "."}
            </p>
          ) : (
            <>
              <p className="text-sm theme-text-muted leading-relaxed">
                {t("ialab.workspace.guardian.intro_2")}
              </p>
              <p className="text-sm font-semibold theme-text leading-snug">
                {t("ialab.workspace.guardian.intro_3")}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGEST_CARDS.map(
          ({ icon, labelKey, descKey, section, bg, color }) => (
            <button
              key={labelKey}
              type="button"
              onClick={() => {
                if (section === "contenido") onSelectTopic(0);
                else onSelectSection(section);
              }}
              className={`theme-prompt-card flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#259eb5]/40 ${section === "practica" ? "max-md:hidden" : ""}`}
            >
              <span
                className="mt-0.5 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center"
                style={{ background: bg }}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={icon} />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold theme-text leading-snug">
                  {t(labelKey)}
                </p>
                <p className="text-xs theme-text-muted mt-0.5 leading-snug">
                  {t(descKey)}
                </p>
              </div>
            </button>
          ),
        )}
      </div>
    </motion.div>
  );
}

GuardianWelcome.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  description: PropTypes.string,
  onSelectSection: PropTypes.func.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};
