import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../i18n/I18nProvider";
import { getModules } from "../../../data/ialab";
import { useAuth } from "../../../context/AuthContext";
import { Icon } from "../../../utils/iconMapping.jsx";
import DashboardTopBar from "./DashboardTopBar";
import DashboardBgPattern from "./DashboardBgPattern";

const PERKS = [
  { icon: "fa-certificate", label: "Certificado oficial",   sub: "Al completar los 5 módulos" },
  { icon: "fa-check-circle",label: "Habilidades reales",    sub: "5 competencias en IA que ya puedes usar" },
  { icon: "fa-trophy",      label: "5 logros",              sub: "Un premio por módulo superado" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" } }),
};

function DashboardNewStudent() {
  const { locale } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const firstName = useMemo(() => {
    if (profile?.first_name) return profile.first_name;
    if (user?.user_metadata?.first_name) return user.user_metadata.first_name;
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.email) return user.email.split("@")[0];
    return null;
  }, [user, profile]);

  const modules = useMemo(() => getModules(locale), [locale]);

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 space-y-8">
      <DashboardBgPattern />
      <DashboardTopBar />

      {/* Hero greeting */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl shadow-lg text-white"
        style={{
          background: "linear-gradient(145deg, #002c40 0%, #004b63 35%, #0a7090 70%, #259eb5 100%)",
          boxShadow: "0 20px 60px rgba(0,75,99,0.35)",
        }}
      >
        <div className="px-8 pt-8 pb-6 max-md:px-5 max-md:pt-6">
          {firstName && (
            <p className="text-sm font-semibold text-white/80 mb-2">
              ¡Hola, {firstName}! 👋
            </p>
          )}
          <h1 className="text-4xl font-black leading-tight mb-3 max-md:text-3xl">
            <span
              className="block text-white"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.5)" }}
            >
              Domina la IA
            </span>
            <span
              className="text-[#00e5ff]"
              style={{ textShadow: "0 0 24px rgba(0,229,255,0.5), 0 2px 8px rgba(0,0,0,0.4)" }}
            >
              antes que los demás
            </span>
          </h1>
          <p className="text-white/90 text-[15px] leading-relaxed max-w-lg font-medium">
            En <strong className="text-white">10 horas</strong> manejarás ChatGPT, Gemini y NotebookLM como un profesional.{" "}
            <span className="text-white/75">Sin código. Sin experiencia previa. A tu propio ritmo.</span>
          </p>

          {/* Perks row */}
          <div className="flex flex-wrap gap-3 mt-5">
            {PERKS.map((p) => (
              <div key={p.icon} className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2">
                <Icon name={p.icon} className="w-3.5 h-3.5 text-[#00d4f0] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-none">{p.label}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{p.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof + CTA */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/ialab/1")}
              className="inline-flex items-center gap-2 bg-[#00e5ff] hover:bg-[#00d0e8] text-[#002c40] font-extrabold text-[15px] px-7 py-3.5 rounded-2xl shadow-[0_6px_24px_rgba(0,229,255,0.35)] transition-colors"
              data-testid="new-student-start-btn"
            >
              <Icon name="fa-play-circle" className="w-4 h-4" />
              Comenzar →
            </motion.button>
            <p className="text-white/70 text-xs">
              ✅ +1.200 profesionales ya lo completaron
            </p>
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-3 px-1">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3">
          {[
            { icon: "fa-book-open",    step: "1", title: "Estudia el módulo", desc: "Videos, actividades interactivas, lecturas e imágenes. ~2h por módulo.", color: "#0a7090" },
            { icon: "fa-trophy",       step: "2", title: "Mi reto + Desafío",   desc: "Pon a prueba lo aprendido y supera el desafío práctico.", color: "#259eb5" },
            { icon: "fa-certificate",  step: "3", title: "Obtén tu certificado", desc: "Supera los 5 módulos y recibe tu certificado oficial.", color: "#00bcd4" },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <Icon name={s.icon} className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-slate-800 dark:text-white">{s.title}</p>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module roadmap */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-3 px-1">
          Lo que vas a aprender — 5 módulos · 10h
        </h2>
        <div className="grid gap-3">
          {modules.map((mod, i) => {
            const isFirst = mod.id === 1;
            const isLocked = mod.id > 1;
            return (
              <motion.div
                key={mod.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onClick={isFirst ? () => navigate("/ialab/1") : undefined}
                className={[
                  "group rounded-2xl p-4 flex items-start gap-4 transition-all",
                  isFirst
                    ? "bg-white dark:bg-white/8 border-2 cursor-pointer shadow-md hover:shadow-lg"
                    : "bg-white/60 dark:bg-white/3 border border-slate-200 dark:border-white/8 opacity-70",
                ].join(" ")}
                style={isFirst ? { borderColor: mod.color || "#259eb5", boxShadow: `0 4px 20px ${mod.color || "#259eb5"}22` } : {}}
              >
                {/* Step indicator */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm"
                  style={{ background: isLocked ? "#94a3b8" : (mod.color || "#259eb5"), opacity: isLocked ? 0.6 : 1 }}
                >
                  {isLocked ? <Icon name="fa-lock" className="w-3.5 h-3.5" /> : mod.id}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-bold text-sm truncate ${isLocked ? "text-slate-400 dark:text-white/40" : "text-slate-900 dark:text-white"}`}>
                      {mod.title}
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/50 whitespace-nowrap">
                      {mod.duration}
                    </span>
                    {isFirst && (
                      <span className="text-[10px] font-bold text-[#259eb5] bg-[#259eb5]/10 px-2 py-0.5 rounded-full border border-[#259eb5]/30">
                        ¡Empieza aquí!
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30">
                        Se desbloquea al terminar el módulo anterior
                      </span>
                    )}
                  </div>
                  {!isLocked && (
                    <p className="text-xs mt-0.5 line-clamp-2 leading-relaxed text-slate-500 dark:text-white/60">
                      {mod.desc}
                    </p>
                  )}
                  {!isLocked && mod.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mod.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                          style={{
                            borderColor: `${mod.color || "#259eb5"}40`,
                            color: mod.color || "#259eb5",
                            background: `${mod.color || "#259eb5"}12`,
                          }}
                        >
                          {topic.split(" ").slice(0, 3).join(" ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isFirst && (
                  <div className="flex-shrink-0 self-center">
                    <Icon name="fa-arrow-right" className="w-4 h-4" style={{ color: mod.color || "#259eb5" }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

export default memo(DashboardNewStudent);
