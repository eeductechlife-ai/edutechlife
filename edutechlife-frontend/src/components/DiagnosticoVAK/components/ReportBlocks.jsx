import { motion } from "framer-motion";

/**
 * Piezas visuales del resultado, compartidas por la pantalla de resultado y la
 * vista previa del informe. Leen el informe armado por `buildVakReport`.
 */

/** Anillo con la mezcla (conic-gradient), en el mismo orden que el PDF. */
export function MixDonut({ report, size = 168, reduceMotion, dark = true }) {
  let from = 0;
  const stops = report.styles
    .filter((s) => s.pct > 0)
    .map((s) => {
      const stop = `${s.fill} ${from}% ${from + s.pct}%`;
      from += s.pct;
      return stop;
    })
    .join(", ");
  const main = report.styles.find((s) => s.key === report.main);
  const balanced = report.tie === "three";

  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 0.85, opacity: 0, rotate: -40 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${stops})`,
        boxShadow: dark
          ? "0 0 0 6px rgba(255,255,255,0.06)"
          : "0 0 0 6px rgba(7,47,70,0.04)",
      }}
      role="img"
      aria-label={report.styles.map((s) => `${s.label} ${s.pct}%`).join(", ")}
    >
      <div
        className={`absolute rounded-full flex flex-col items-center justify-center text-center ${dark ? "bg-[#0B3A55] text-white" : "bg-white text-[#072F46]"}`}
        style={{ inset: size * 0.16 }}
        aria-hidden="true"
      >
        {balanced ? (
          <span className="text-lg font-extrabold leading-none">3 formas</span>
        ) : (
          <span className="text-4xl font-black tabular-nums leading-none tracking-tight">
            {main.pct}
            <span className="text-xl font-extrabold">%</span>
          </span>
        )}
        <span
          className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? "text-white/60" : "text-[#64748B]"}`}
        >
          {balanced ? "Por igual" : main.label}
        </span>
      </div>
    </motion.div>
  );
}

/** Tres tarjetas con el porcentaje de cada forma de aprender. */
export function StyleMixCards({ report, reduceMotion, t }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:gap-3 p-0 m-0 list-none">
      {report.styles.map((s, i) => (
        <li
          key={s.key}
          className="relative rounded-2xl p-3 sm:p-4 border transition-shadow"
          style={{
            background: `${s.fill}14`,
            borderColor: s.isMain ? s.fill : `${s.fill}40`,
            boxShadow: s.isMain ? `0 10px 24px -14px ${s.fill}` : "none",
          }}
        >
          <div className="flex items-start justify-between gap-1">
            <p
              className="!m-0 text-xs sm:text-sm font-bold"
              style={{ color: s.ink }}
            >
              {s.label}
            </p>
            {(s.isMain || s.isSecond) && (
              <span
                className="hidden sm:inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                style={{ background: s.ink }}
              >
                {s.isMain
                  ? t("vak.ui.result_main_badge")
                  : t("vak.ui.result_also_badge")}
              </span>
            )}
          </div>
          <p
            className="!m-0 !mt-1 text-2xl sm:text-3xl font-black tabular-nums tracking-tight"
            style={{ color: s.ink }}
          >
            {s.pct}%
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: s.fill }}
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.12,
                ease: "easeOut",
              }}
            />
          </div>
          <p className="!m-0 !mt-2 hidden sm:block text-xs leading-snug text-[#64748B]">
            {s.meaning}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Lista numerada con el color del estilo principal. */
export function NumberedList({
  items,
  accent,
  ink,
  start = 1,
  className = "",
}) {
  return (
    <ol start={start} className={`!m-0 p-0 list-none space-y-2.5 ${className}`}>
      {items.map((item, i) => (
        <li
          key={item}
          className="flex gap-3 text-[15px] leading-snug text-[#1E293B]"
        >
          <span
            className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: `${accent}2E`, color: ink }}
            aria-hidden="true"
          >
            {start + i}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

/** Plan de cuatro pasos para la semana; el último es la charla en familia. */
export function WeekPlan({ report, accent, ink }) {
  return (
    <ol className="!m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {report.weekPlan.map((step, i) => {
        const last = i === report.weekPlan.length - 1;
        return (
          <li
            key={step.day}
            className={`rounded-2xl p-3.5 border ${last ? "bg-[#072F46] border-[#072F46] text-white" : "bg-white border-[#E2E8F0] text-[#1E293B]"}`}
          >
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
              style={
                last
                  ? { background: "#199DB9", color: "#fff" }
                  : { background: `${accent}2E`, color: ink }
              }
            >
              {step.day}
            </span>
            <p className="!m-0 !mt-2 text-sm leading-snug">{step.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
