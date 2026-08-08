import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, MessageSquare, Heart, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * Crisis Resources Modal
 * Shows emergency resources and crisis support lines
 * Triggered when suicidal ideation is detected
 */
const CrisisResourcesModal = ({ isOpen, onClose, crisisLevel }) => {
  const { t } = useTranslation();
  const [expandedTab, setExpandedTab] = useState("immediate");

  const resources = {
    immediate: {
      title: t("kid.crisis.section_immediate"),
      color: "from-red-600 to-red-700",
      items: [
        {
          label: t("kid.crisis.immediate.emergencies"),
          value: "123",
          description: t("kid.crisis.immediate.emergencies_desc"),
          action: "tel:123",
        },
        {
          label: t("kid.crisis.immediate.pas_line"),
          value: "+57 (2) 5149100",
          description: t("kid.crisis.immediate.pas_line_desc"),
          action: "tel:+5725149100",
        },
        {
          label: t("kid.crisis.immediate.friend_phone"),
          value: t("kid.crisis.immediate.friend_phone_value"),
          description: t("kid.crisis.immediate.friend_phone_desc"),
          action: null,
        },
      ],
    },
    emotional: {
      title: t("kid.crisis.section_emotional"),
      color: "from-pink-600 to-pink-700",
      items: [
        {
          label: t("kid.crisis.emotional.talk_parents"),
          description: t("kid.crisis.emotional.talk_parents_desc"),
          icon: Heart,
        },
        {
          label: t("kid.crisis.emotional.school_counselor"),
          description: t("kid.crisis.emotional.school_counselor_desc"),
          icon: Heart,
        },
        {
          label: t("kid.crisis.emotional.crisis_text_line"),
          value: "Text HOME to 741741",
          description: t("kid.crisis.emotional.crisis_text_line_desc"),
          icon: MessageSquare,
        },
      ],
    },
    reasons: {
      title: t("kid.crisis.section_reasons"),
      color: "from-blue-600 to-blue-700",
      items: [
        {
          title: t("kid.crisis.reasons.life_matters"),
          description: t("kid.crisis.reasons.life_matters_desc"),
        },
        {
          title: t("kid.crisis.reasons.emotions_change"),
          description: t("kid.crisis.reasons.emotions_change_desc"),
        },
        {
          title: t("kid.crisis.reasons.people_love_you"),
          description: t("kid.crisis.reasons.people_love_you_desc"),
        },
        {
          title: t("kid.crisis.reasons.future_surprises"),
          description: t("kid.crisis.reasons.future_surprises_desc"),
        },
      ],
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2
                    id="crisis-title"
                    className="text-2xl font-bold text-[#004B63]"
                  >
                    {t("kid.crisis.we_are_here")}
                  </h2>
                  <p className="text-[#004B63]/60 text-sm">
                    {t("kid.crisis.support_subtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label={t("kid.crisis.close_aria")}
                className="text-[#004B63]/40 hover:text-[#004B63] transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Alert Message */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-6">
              <p className="text-red-900 text-sm">
                <strong>{t("kid.crisis.alert_1")}</strong>{" "}
                {t("kid.crisis.alert_2")}
                <strong> {t("kid.crisis.alert_3")}</strong>.
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {["immediate", "emotional", "reasons"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setExpandedTab(tab)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    expandedTab === tab
                      ? "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white"
                      : "bg-slate-100 text-[#004B63] hover:bg-slate-200"
                  }`}
                >
                  {tab === "immediate" && "🆘"}
                  {tab === "emotional" && "❤️"}
                  {tab === "reasons" && "✨"}{" "}
                  {tab === "immediate" && t("kid.crisis.tab_immediate")}
                  {tab === "emotional" && t("kid.crisis.tab_emotional")}
                  {tab === "reasons" && t("kid.crisis.tab_reasons")}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {expandedTab === "immediate" && (
                <motion.div
                  key="immediate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {resources.immediate.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-red-900">{item.label}</p>
                          <p className="text-red-700 text-sm">
                            {item.description}
                          </p>
                          {item.value && (
                            <p className="text-red-600 font-mono text-lg mt-2">
                              {item.value}
                            </p>
                          )}
                        </div>
                        {item.action && (
                          <a
                            href={item.action}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
                          >
                            <Phone className="w-4 h-4" />
                            {t("kid.crisis.call")}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {expandedTab === "emotional" && (
                <motion.div
                  key="emotional"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {resources.emotional.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4"
                    >
                      <p className="font-bold text-pink-900">{item.label}</p>
                      <p className="text-pink-700 text-sm mt-1">
                        {item.description}
                      </p>
                      {item.value && (
                        <p className="text-pink-600 font-mono text-sm mt-2">
                          {item.value}
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {expandedTab === "reasons" && (
                <motion.div
                  key="reasons"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {resources.reasons.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
                    >
                      <p className="font-bold text-blue-900">{item.title}</p>
                      <p className="text-blue-700 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-[#004B63]/60 text-sm mb-4">
                {t("kid.crisis.footer")}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white font-bold hover:shadow-lg transition"
              >
                {t("kid.crisis.understood_thanks")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CrisisResourcesModal;
