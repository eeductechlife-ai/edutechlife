import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Headphones, BookOpen, Wrench, Lightbulb } from "lucide-react";
import { useTranslation } from "../../../../i18n/I18nProvider";

const VAK_TIPS_KEYS = {
  visual: {
    icon: "👁️",
    titleKey: "parent_dashboard.resources_vak_visual_title",
    tipKeys: [
      "parent_dashboard.resources_vak_visual_tip1",
      "parent_dashboard.resources_vak_visual_tip2",
      "parent_dashboard.resources_vak_visual_tip3",
    ],
  },
  auditivo: {
    icon: "👂",
    titleKey: "parent_dashboard.resources_vak_auditivo_title",
    tipKeys: [
      "parent_dashboard.resources_vak_auditivo_tip1",
      "parent_dashboard.resources_vak_auditivo_tip2",
      "parent_dashboard.resources_vak_auditivo_tip3",
    ],
  },
  kinestesico: {
    icon: "✋",
    titleKey: "parent_dashboard.resources_vak_kinestesico_title",
    tipKeys: [
      "parent_dashboard.resources_vak_kinestesico_tip1",
      "parent_dashboard.resources_vak_kinestesico_tip2",
      "parent_dashboard.resources_vak_kinestesico_tip3",
    ],
  },
};

const Card = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-xl p-5 border border-[#E2E8F0] ${className}`}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-[#4DA8C4]" />
    <h3 className="font-bold text-[#004B63]">{title}</h3>
  </div>
);

const ParentResources = ({ vakStyle, parentFirstName }) => {
  const { t } = useTranslation();
  const vakKey = vakStyle?.toLowerCase();
  const tip = VAK_TIPS_KEYS[vakKey]
    ? {
        icon: VAK_TIPS_KEYS[vakKey].icon,
        title: t(VAK_TIPS_KEYS[vakKey].titleKey),
        tips: VAK_TIPS_KEYS[vakKey].tipKeys.map((k) => t(k)),
      }
    : null;

  const PODCASTS = [
    {
      title: t("parent_dashboard.resources_podcast1_title"),
      desc: t("parent_dashboard.resources_podcast1_desc"),
      tags: ["10-15 min", t("parent_dashboard.resources_freq_weekly")],
    },
    {
      title: t("parent_dashboard.resources_podcast2_title"),
      desc: t("parent_dashboard.resources_podcast2_desc"),
      tags: ["20 min", t("parent_dashboard.resources_freq_biweekly")],
    },
    {
      title: t("parent_dashboard.resources_podcast3_title"),
      desc: t("parent_dashboard.resources_podcast3_desc"),
      tags: ["15 min", t("parent_dashboard.resources_freq_weekly")],
    },
  ];

  const BOOKS = [
    {
      title: t("parent_dashboard.resources_book1_title"),
      author: "Juan Cruz Ripoll",
      desc: t("parent_dashboard.resources_book1_desc"),
      emoji: "👨‍👩‍👧",
    },
    {
      title: t("parent_dashboard.resources_book2_title"),
      author: "Yalda Uhls",
      desc: t("parent_dashboard.resources_book2_desc"),
      emoji: "🧒",
    },
    {
      title: t("parent_dashboard.resources_book3_title"),
      author: "Victoria Dunckley",
      desc: t("parent_dashboard.resources_book3_desc"),
      emoji: "📱",
    },
  ];

  const TOOLS = [
    {
      name: "Google Family Link",
      desc: t("parent_dashboard.resources_tool1_desc"),
      emoji: "🔒",
      free: true,
    },
    {
      name: "Khan Academy Kids",
      desc: t("parent_dashboard.resources_tool2_desc"),
      emoji: "🎓",
      free: true,
    },
    {
      name: "Common Sense Media",
      desc: t("parent_dashboard.resources_tool3_desc"),
      emoji: "⭐",
      free: true,
    },
    {
      name: "Qustodio",
      desc: t("parent_dashboard.resources_tool4_desc"),
      emoji: "🛡️",
      free: false,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Personalized VAK tip — lo más personal de toda la sección */}
      {tip ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 border border-[#4DA8C4]/25 bg-gradient-to-r from-[#004B63]/5 to-[#4DA8C4]/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{tip.icon}</span>
            <div>
              <p className="font-bold text-[#004B63] text-sm">{tip.title}</p>
              <p className="text-xs text-[#64748B]">
                {t("parent_dashboard.resources_vak_how", {
                  name: parentFirstName,
                })}
              </p>
            </div>
          </div>
          <ul className="space-y-2 mt-1">
            {tip.tips.map((tTip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#334155]"
              >
                <span className="text-[#4DA8C4] font-bold mt-0.5 flex-shrink-0">
                  →
                </span>
                {tTip}
              </li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <div className="rounded-xl p-4 border border-[#4DA8C4]/20 bg-[#F0F9FF] text-sm text-[#0369A1]">
          {t("parent_dashboard.resources_vak_pending")}
        </div>
      )}

      {/* Podcasts */}
      <Card>
        <SectionTitle
          icon={Headphones}
          title={t("parent_dashboard.resources_podcasts_title")}
        />
        <div className="space-y-3">
          {PODCASTS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-[#4DA8C4]/15 flex items-center justify-center text-lg flex-shrink-0">
                🎙️
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#004B63]">
                  {p.title}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">{p.desc}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {p.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[10px] px-2 py-0.5 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Books */}
      <Card>
        <SectionTitle
          icon={BookOpen}
          title={t("parent_dashboard.resources_books_title")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BOOKS.map((b, i) => (
            <div
              key={i}
              className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"
            >
              <p className="text-3xl mb-2">{b.emoji}</p>
              <p className="font-bold text-sm text-[#004B63] leading-snug">
                {b.title}
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">{b.author}</p>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tools */}
      <Card>
        <SectionTitle
          icon={Wrench}
          title={t("parent_dashboard.resources_tools_title")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOOLS.map((tool, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg"
            >
              <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-[#004B63] truncate">
                    {tool.name}
                  </p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${tool.free ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    {tool.free
                      ? t("parent_dashboard.resources_free")
                      : t("parent_dashboard.resources_premium")}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#004B63] to-[#0077B6] rounded-xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-[#4DA8C4]" />
          <h3 className="font-bold">
            {t("parent_dashboard.resources_weekly_tip_title", {
              name: parentFirstName,
            })}
          </h3>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          {t("parent_dashboard.resources_weekly_tip_body1")}{" "}
          <strong className="text-white">
            {t("parent_dashboard.resources_weekly_tip_strong")}
          </strong>{" "}
          {t("parent_dashboard.resources_weekly_tip_body2")}
        </p>
        <p className="text-[#4DA8C4] text-xs mt-3 font-semibold">
          {t("parent_dashboard.resources_weekly_tip_citation")}
        </p>
      </motion.div>
    </div>
  );
};

ParentResources.propTypes = {
  vakStyle: PropTypes.string,
  parentFirstName: PropTypes.string,
};

export default ParentResources;
