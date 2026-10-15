import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Smile,
  UserRound,
} from "lucide-react";
import { STYLE_INSIGHTS } from "../vakStyles";

const STYLES = [
  {
    style: "visual",
    key: "vak.ui.chip_visual",
    desc: "vak.ui.welcome_style_visual_desc",
  },
  {
    style: "auditivo",
    key: "vak.ui.chip_auditory",
    desc: "vak.ui.welcome_style_auditory_desc",
  },
  {
    style: "kinestesico",
    key: "vak.ui.chip_kinesthetic",
    desc: "vak.ui.welcome_style_kinesthetic_desc",
  },
];

const BADGES = [
  { icon: Clock, key: "vak.ui.welcome_badge_time" },
  { icon: Smile, key: "vak.ui.welcome_badge_no_wrong" },
  { icon: UserRound, key: "vak.ui.welcome_badge_no_account" },
];

const STEPS = [
  "vak.ui.welcome_step_1",
  "vak.ui.welcome_step_2",
  "vak.ui.welcome_step_3",
];

const FAMILY = [
  { icon: FileText, key: "vak.ui.welcome_family_report" },
  { icon: HeartHandshake, key: "vak.ui.welcome_family_not_diagnosis" },
  { icon: ShieldCheck, key: "vak.ui.welcome_family_privacy" },
];

const Eyebrow = ({ children }) => (
  <h2 className="!m-0 !mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E7490]">
    {children}
  </h2>
);

export default function renderWelcome({
  t,
  startTest,
  resumeOffer,
  resumeProgress,
  discardProgress,
  questionsTotal,
  skipEntrance = false,
}) {
  const rise = (delay) =>
    skipEntrance
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
        };

  const startButton = (
    <div>
      <button
        type="button"
        onClick={startTest}
        className="group w-full min-h-[60px] rounded-2xl bg-[#072F46] text-white text-lg font-bold shadow-[0_14px_30px_-14px_rgba(7,47,70,0.8)] hover:bg-[#0B3A55] flex items-center justify-center gap-2 transition-colors"
      >
        {t("vak.ui.start_diagnosis_btn")}
        <ArrowRight
          size={22}
          strokeWidth={2.5}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
      <p className="!m-0 !mt-2 text-center text-sm text-[#004B63]/70">
        {t("vak.ui.start_hint")}
      </p>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 sm:p-2">
      {/* ---------- portada con Valeria ---------- */}
      <motion.section
        {...rise(0)}
        className="relative overflow-hidden rounded-[28px] bg-[#072F46] px-5 py-7 sm:px-8 sm:py-9 text-white shadow-[0_24px_60px_-28px_rgba(7,47,70,0.75)]"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#199DB9]/25 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#06D6A0]/10"
          aria-hidden="true"
        />
        <div className="relative flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="!m-0 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7FD3E3]">
              {t("vak.ui.welcome_eyebrow")}
            </p>
            <h1 className="!m-0 !mt-2 text-[28px] sm:text-3xl md:text-4xl font-black leading-tight text-white">
              {t("vak.ui.hero_title")}
            </h1>
            <p className="!m-0 !mt-3 text-base md:text-lg leading-snug text-white/80">
              {t("vak.ui.welcome_subtitle")}
            </p>
            <ul className="!m-0 !mt-5 flex flex-wrap justify-center gap-2 p-0 list-none sm:justify-start">
              {BADGES.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15"
                >
                  <Icon size={14} strokeWidth={2.4} aria-hidden="true" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          {/* En móvil Valeria saluda primero, con su globo al lado. */}
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-0">
            <img
              src="/valeria.webp"
              alt="Valeria"
              width="112"
              height="112"
              className="h-16 w-16 sm:h-28 sm:w-28 shrink-0 rounded-full border-[3px] sm:border-4 border-white/90 object-cover shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
            />
            <p className="!m-0 sm:!mt-3 max-w-[220px] rounded-2xl rounded-tl-sm sm:rounded-tl-2xl sm:rounded-tr-sm bg-white px-3.5 py-2 text-left text-sm font-medium leading-snug text-[#072F46] shadow-sm">
              {t("vak.ui.welcome_valeria_hello")}
            </p>
          </div>
        </div>
      </motion.section>

      {resumeOffer && (
        <div
          className="rounded-2xl border-2 border-[#199DB9] bg-[#F0FAFC] p-4 text-left"
          role="region"
          aria-label={t("vak.ui.resume_title")}
        >
          <p className="!m-0 font-bold text-[#004B63]">
            {t("vak.ui.resume_title")}
          </p>
          <p className="!m-0 !mt-1 text-sm text-[#004B63]/80">
            {t("vak.ui.resume_body", {
              name: resumeOffer.studentName || "",
              current: Math.min(
                (resumeOffer.currentQuestion || 0) + 1,
                questionsTotal,
              ),
              total: questionsTotal,
            })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resumeProgress}
              className="min-h-[44px] px-5 rounded-xl bg-[#072F46] text-white text-sm font-bold"
            >
              {t("vak.ui.resume_continue")}
            </button>
            <button
              type="button"
              onClick={discardProgress}
              className="min-h-[44px] px-5 rounded-xl border-2 border-[#072F46] text-[#072F46] text-sm font-bold"
            >
              {t("vak.ui.resume_restart")}
            </button>
          </div>
        </div>
      )}

      {/* ---------- las tres formas ---------- */}
      <motion.section {...rise(0.08)}>
        <Eyebrow>{t("vak.ui.welcome_styles_title")}</Eyebrow>
        {/* En móvil, filas (ícono + texto); desde tablet, tres columnas. */}
        <ul className="!m-0 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 p-0 list-none">
          {STYLES.map(({ style, key, desc }) => {
            const info = STYLE_INSIGHTS[style];
            return (
              <li
                key={style}
                className="flex items-center gap-3 rounded-2xl border p-3 sm:flex-col sm:gap-0 sm:p-4 sm:text-center"
                style={{
                  background: `${info.fill}14`,
                  borderColor: `${info.fill}55`,
                }}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm"
                  aria-hidden="true"
                >
                  {info.emoji}
                </span>
                <div className="min-w-0">
                  <p
                    className="!m-0 sm:!mt-2 text-base font-extrabold"
                    style={{ color: info.ink }}
                  >
                    {t(key)}
                  </p>
                  <p className="!m-0 !mt-0.5 text-sm leading-snug text-[#475569]">
                    {t(desc)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="!m-0 !mt-3 text-center text-sm text-[#475569]">
          {t("vak.ui.welcome_styles_note")}
        </p>
      </motion.section>

      {/* ---------- cómo funciona ---------- */}
      <motion.section
        {...rise(0.16)}
        className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5"
      >
        <Eyebrow>{t("vak.ui.welcome_steps_title")}</Eyebrow>
        <ol className="!m-0 grid gap-3 p-0 list-none sm:grid-cols-3">
          {STEPS.map((key, i) => (
            <li key={key} className="flex gap-3 sm:flex-col sm:gap-2">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#072F46] text-sm font-bold text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="!m-0 text-[15px] leading-snug text-[#1E293B]">
                {t(key)}
              </p>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* ---------- empezar ---------- */}
      <motion.div {...rise(0.22)}>{startButton}</motion.div>

      {/* ---------- para la familia ---------- */}
      <motion.section
        {...rise(0.28)}
        className="rounded-3xl border border-[#E2E8F0] bg-white p-5"
      >
        <Eyebrow>{t("vak.ui.welcome_family_title")}</Eyebrow>
        <ul className="!m-0 space-y-3 p-0 list-none">
          {FAMILY.map(({ icon: Icon, key }) => (
            <li
              key={key}
              className="flex items-start gap-3 text-[15px] leading-snug text-[#1E293B]"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F0FAFC] text-[#0E7490]"
                aria-hidden="true"
              >
                <Icon size={17} strokeWidth={2.2} />
              </span>
              <span className="pt-1">{t(key)}</span>
            </li>
          ))}
        </ul>
        <details className="group mt-3">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center text-sm font-bold text-[#0E7490] [&::-webkit-details-marker]:hidden">
            {t("vak.ui.welcome_family_more")}
          </summary>
          <div className="space-y-2 text-sm leading-relaxed text-[#475569]">
            <p className="!m-0">{t("vak.ui.vak_intro")}</p>
            <p className="!m-0">{t("vak.ui.parents_note")}</p>
          </div>
        </details>
      </motion.section>

      <p className="!m-0 text-center text-xs text-[#004B63]/60">
        {t("vak.ui.developed_by")} <strong>EdutechLife</strong>
      </p>
    </div>
  );
}
