import { useState } from "react";
import PropTypes from "prop-types";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Trophy,
  ListChecks,
} from "lucide-react";
import { useTranslation } from "../../../i18n/I18nProvider";
import { usePersistedOvaState } from "../../../hooks/IALab/usePersistedOvaState";
import { UI, LETTERS } from "./ovaExplicativoTextos";
import { makeBtn } from "./ovaExplicativoBoton";

// OVA explicativo con la identidad visual de cada OVA (tema por OVA).
// El contenido llega por idioma desde un archivo de datos; la estructura es común.

// Dibuja el tema de cada OVA: colores, fondo, claridad y el icono de la portada.
export function makeOVAExplicativo(ovaId, DATA, THEME) {
  const T = {
    accent: "#199DB9",
    accent2: "#f59e0b",
    dark: false,
    heroIcon: ListChecks,
    ...THEME,
  };
  const ink = T.dark ? "#f1f5f9" : "#0f172a";
  const soft = T.dark ? "#cbd5e1" : "#475569";
  const card = T.dark ? "rgba(255,255,255,0.06)" : "#ffffff";
  const cardBorder = T.dark ? "rgba(255,255,255,0.12)" : "#e2e8f0";
  const pageBg = T.bg || (T.dark ? "#0b1220" : "#f8fafc");
  const Btn = makeBtn(T);

  function OVAExplicativo({ onComplete, onClose }) {
    const { locale } = useTranslation();
    const lang = UI[locale] ? locale : "es";
    const ui = UI[lang];
    const d = DATA[lang] || DATA.es;
    const sections = d.sections;
    const Hero = T.heroIcon;

    const [phase, setPhase] = usePersistedOvaState(ovaId, "phase", "intro");
    const [idx, setIdx] = usePersistedOvaState(ovaId, "section", 0);
    const [answers, setAnswers] = usePersistedOvaState(ovaId, "answers", {});
    const [doneSent, setDoneSent] = useState(false);

    const goSection = (i) => {
      setIdx(i);
      setPhase("section");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const allRight = d.check.every((q, qi) => answers[qi] === q.correct);
    const progress =
      phase === "intro"
        ? 0
        : phase === "section"
          ? ((idx + 1) / (sections.length + 2)) * 100
          : phase === "summary"
            ? ((sections.length + 1) / (sections.length + 2)) * 100
            : phase === "check"
              ? 90
              : 100;

    const finish = () => {
      setPhase("done");
      if (!doneSent) {
        setDoneSent(true);
        onComplete?.();
      }
    };

    const Shell = ({ children }) => (
      <div
        className="min-h-[70vh] rounded-3xl p-4 sm:p-8"
        style={{
          background: pageBg,
          color: ink,
        }}
      >
        <div className="mx-auto max-w-3xl">
          <div
            className="mb-6 h-2 w-full overflow-hidden rounded-full"
            style={{ background: cardBorder }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`,
              }}
            />
          </div>
          {children}
        </div>
      </div>
    );

    if (phase === "intro") {
      return (
        <Shell>
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Hero size={34} />
              </div>
              <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                {d.badge}
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              {d.title}
            </h2>
            <p className="mt-2 text-lg text-white/90">{d.subtitle}</p>
          </div>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: soft }}>
            {d.intro}
          </p>
          <div
            className="mt-6 rounded-2xl border p-5"
            style={{ background: card, borderColor: cardBorder }}
          >
            <h3 className="font-bold" style={{ color: T.accent }}>
              {ui.objectives}:
            </h3>
            <ul className="mt-3 space-y-2">
              {d.objectives.map((o) => (
                <li key={o} className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                    style={{ color: T.accent }}
                  />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex justify-end">
            <Btn primary onClick={() => goSection(0)}>
              {ui.start} <ArrowRight size={18} />
            </Btn>
          </div>
        </Shell>
      );
    }

    if (phase === "section") {
      const s = sections[idx];
      const last = idx === sections.length - 1;
      return (
        <Shell>
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
              style={{ background: T.accent }}
            >
              {idx + 1}
            </span>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: soft }}
              >
                {ui.section} {idx + 1} {ui.of} {sections.length}
              </p>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{s.title}</h2>
            </div>
          </div>

          <div
            className="mt-5 space-y-3 text-[17px] leading-relaxed"
            style={{ color: soft }}
          >
            {s.explain.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {s.terms?.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-bold" style={{ color: T.accent }}>
                {ui.vocab}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {s.terms.map((t) => (
                  <div
                    key={t.term}
                    className="rounded-2xl border-l-4 p-4 shadow-sm"
                    style={{
                      background: card,
                      borderColor: T.accent2,
                      boxShadow: `0 1px 0 ${cardBorder}`,
                    }}
                  >
                    <p className="font-extrabold" style={{ color: T.accent }}>
                      {t.term}
                    </p>
                    <p
                      className="mt-1 text-sm leading-snug"
                      style={{ color: soft }}
                    >
                      {t.def}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {s.how?.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 font-bold" style={{ color: T.accent }}>
                {ui.how}
              </h3>
              <ol className="space-y-3">
                {s.how.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                      style={{ background: i % 2 ? T.accent2 : T.accent }}
                    >
                      {i + 1}
                    </span>
                    <span className="pt-1" style={{ color: soft }}>
                      {h}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {s.example && (
            <div
              className="mt-7 flex gap-3 rounded-2xl p-5"
              style={{
                background: T.dark ? "rgba(16,185,129,0.12)" : "#ecfdf5",
                color: T.dark ? "#d1fae5" : "#065f46",
              }}
            >
              <Lightbulb size={22} className="mt-0.5 shrink-0" />
              <p>
                <strong>{ui.example}: </strong>
                {s.example}
              </p>
            </div>
          )}

          {s.mistake && (
            <div
              className="mt-4 flex gap-3 rounded-2xl p-5"
              style={{
                background: T.dark ? "rgba(245,158,11,0.12)" : "#fffbeb",
                color: T.dark ? "#fde68a" : "#92400e",
              }}
            >
              <AlertTriangle size={22} className="mt-0.5 shrink-0" />
              <p>
                <strong>{ui.mistake}: </strong>
                {s.mistake}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <Btn
              onClick={() =>
                idx === 0 ? setPhase("intro") : goSection(idx - 1)
              }
            >
              <ArrowLeft size={18} /> {ui.prev}
            </Btn>
            {last ? (
              <Btn primary onClick={() => setPhase("summary")}>
                {ui.summary} <ArrowRight size={18} />
              </Btn>
            ) : (
              <Btn primary onClick={() => goSection(idx + 1)}>
                {ui.next} <ArrowRight size={18} />
              </Btn>
            )}
          </div>
        </Shell>
      );
    }

    if (phase === "summary") {
      return (
        <Shell>
          <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
            <ListChecks size={30} style={{ color: T.accent }} />{" "}
            {ui.summaryTitle}
          </h2>
          <div className="mt-6 grid gap-3">
            {d.summary.map((x, i) => (
              <div
                key={x}
                className="flex items-start gap-3 rounded-2xl border p-4 shadow-sm"
                style={{ background: card, borderColor: cardBorder }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ background: i % 2 ? T.accent2 : T.accent }}
                >
                  {i + 1}
                </span>
                <span className="pt-1 leading-relaxed" style={{ color: soft }}>
                  {x}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-3">
            <Btn onClick={() => goSection(sections.length - 1)}>
              <ArrowLeft size={18} /> {ui.prev}
            </Btn>
            <Btn primary onClick={() => setPhase("check")}>
              {ui.check} <ArrowRight size={18} />
            </Btn>
          </div>
        </Shell>
      );
    }

    if (phase === "check") {
      return (
        <Shell>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            {ui.checkTitle}
          </h2>
          <p className="mt-1" style={{ color: soft }}>
            {ui.checkHint}
          </p>
          <div className="mt-6 space-y-8">
            {d.check.map((q, qi) => {
              const chosen = answers[qi];
              const isAnswered = chosen !== undefined;
              const isOk = chosen === q.correct;
              return (
                <div
                  key={q.q}
                  className="rounded-3xl border p-5 shadow-sm"
                  style={{ background: card, borderColor: cardBorder }}
                >
                  <p className="font-bold">
                    <span style={{ color: T.accent }}>{qi + 1}. </span>
                    {q.q}
                  </p>
                  <div className="mt-4 grid gap-3">
                    {q.options.map((o, oi) => {
                      const isChosen = chosen === oi;
                      const isRight = oi === q.correct;
                      let style = {
                        borderColor: cardBorder,
                        color: ink,
                        background: "transparent",
                      };
                      if (isAnswered && isRight)
                        style = {
                          borderColor: "#10b981",
                          color: ink,
                          background: T.dark
                            ? "rgba(16,185,129,0.18)"
                            : "#ecfdf5",
                        };
                      else if (isChosen)
                        style = {
                          borderColor: "#ef4444",
                          color: ink,
                          background: T.dark
                            ? "rgba(239,68,68,0.18)"
                            : "#fef2f2",
                        };
                      return (
                        <button
                          key={o}
                          type="button"
                          disabled={isAnswered && isOk}
                          onClick={() => setAnswers({ ...answers, [qi]: oi })}
                          className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition hover:-translate-y-0.5 disabled:hover:translate-y-0"
                          style={style}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold"
                            style={{ background: T.accent, color: "#fff" }}
                          >
                            {LETTERS[oi]}
                          </span>
                          <span>{o}</span>
                          {isAnswered && isRight && (
                            <CheckCircle2
                              className="ml-auto shrink-0 text-emerald-500"
                              size={20}
                            />
                          )}
                          {isChosen && !isRight && (
                            <XCircle
                              className="ml-auto shrink-0 text-red-500"
                              size={20}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div
                      className="mt-4 flex gap-2 rounded-2xl p-4 text-sm"
                      style={{
                        background: isOk
                          ? T.dark
                            ? "rgba(16,185,129,0.15)"
                            : "#ecfdf5"
                          : T.dark
                            ? "rgba(245,158,11,0.15)"
                            : "#fffbeb",
                        color: isOk
                          ? T.dark
                            ? "#d1fae5"
                            : "#065f46"
                          : T.dark
                            ? "#fde68a"
                            : "#92400e",
                      }}
                    >
                      <strong>{isOk ? ui.correct : ui.incorrect}</strong>
                      <span>{q.feedback}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-3">
            <Btn onClick={() => setPhase("summary")}>
              <ArrowLeft size={18} /> {ui.prev}
            </Btn>
            <Btn primary disabled={!allRight} onClick={finish}>
              <Trophy size={18} /> {ui.finish}
            </Btn>
          </div>
        </Shell>
      );
    }

    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
            }}
          >
            <Trophy size={44} />
          </div>
          <p className="text-2xl font-extrabold">{ui.done}</p>
          {onClose && (
            <Btn primary onClick={onClose}>
              {ui.back}
            </Btn>
          )}
        </div>
      </Shell>
    );
  }

  OVAExplicativo.propTypes = {
    onComplete: PropTypes.func,
    onClose: PropTypes.func,
  };
  return OVAExplicativo;
}
