import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n/I18nProvider";
import { getMetrics, getStandards } from "./AutomationData";
import IngenIATilt3D from "./ingenia/IngenIATilt3D";

const AutomationHero = ({ onStartDiagnosis }) => {
  const { t, locale } = useTranslation();
  const metrics = getMetrics(locale);
  const standards = getStandards(locale);
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-bg-dark to-white">
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 -top-[300px] -right-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(77,168,196,0.25), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 -bottom-[250px] -left-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,75,99,0.2), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-1/3 right-[20%]"
          style={{
            background:
              "radial-gradient(circle, rgba(102,204,204,0.15), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-petroleum leading-tight mb-4">
            {t("automation.hero.title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-mint">
              {t("automation.hero.title_2")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t("automation.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onStartDiagnosis}
              className="px-8 py-3.5 bg-gradient-to-r from-petroleum to-primary-light text-white rounded-full font-bold text-sm hover:shadow-premium-lg transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {t("automation.hero.btn_diagnosis")}
            </button>
          </div>

          <div className="max-w-md mx-auto mb-12">
            {metrics.map((m) => (
              <IngenIATilt3D key={m.label} intensity={5}>
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-4 text-center shadow-premium">
                  <div
                    className="text-3xl md:text-4xl font-black mb-1"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {m.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    {m.source}
                  </div>
                </div>
              </IngenIATilt3D>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {t("automation.hero.standards_label")}
            </span>
            {standards.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-xl border border-white/40 rounded-full shadow-premium"
              >
                <svg
                  className="w-4 h-4 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-xs font-semibold text-petroleum">
                  {s.name}
                </span>
                <span className="text-xs text-slate-400">— {s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AutomationHero;
