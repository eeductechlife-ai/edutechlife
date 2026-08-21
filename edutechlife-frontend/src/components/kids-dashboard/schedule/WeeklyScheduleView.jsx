import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import useTimetable from "../../../hooks/useTimetable";
import {
  DAY_KEYS,
  DAY_LABELS,
  subjectColor,
  subjectEmoji,
  formatHHMM,
  timeToMinutes,
} from "./timetableUtils";

const ScheduleScanner = lazy(() => import("./ScheduleScanner"));
const ScheduleEditor = lazy(() => import("./ScheduleEditor"));

const LoadingBlock = () => (
  <div className="p-8 text-center text-sm text-[#64748B]">Cargando…</div>
);

const groupByDay = (slots) => {
  const map = new Map();
  DAY_KEYS.forEach((d) => map.set(d, []));
  slots.forEach((s) => map.get(s.day_of_week)?.push(s));
  return map;
};

// ── Current / Next class banner ──────────────────────────────────────────
const NowNextBanner = ({ current, next }) => {
  if (!current && !next) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-lg"
    >
      {current ? (
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>
            {subjectEmoji(current.subject_label || current.subject)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wide opacity-80">
              Ahora mismo
            </div>
            <div className="text-lg sm:text-xl font-bold truncate">
              {current.subject_label || current.subject}
            </div>
            <div className="text-sm opacity-90">
              {formatHHMM(current.start_time)} – {formatHHMM(current.end_time)}
              {current.teacher ? ` · ${current.teacher}` : ""}
              {current.room ? ` · Aula ${current.room}` : ""}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm opacity-90">Sin clase en este momento.</div>
      )}
      {next && (!current || next.id !== current.id) && (
        <div className="mt-3 pt-3 border-t border-white/20 text-sm">
          <span className="opacity-80">Sigue: </span>
          <span className="font-semibold">
            {subjectEmoji(next.subject_label || next.subject)}{" "}
            {next.subject_label || next.subject}
          </span>
          <span className="opacity-80">
            {" "}
            · {DAY_LABELS.es[next.day_of_week]} {formatHHMM(next.start_time)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ── Weekly grid ──────────────────────────────────────────────────────────
const WeeklyGrid = ({ slots, todayIso }) => {
  const grouped = useMemo(() => groupByDay(slots), [slots]);
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
      <div className="min-w-[640px] grid grid-cols-7 gap-2 px-4 sm:px-0">
        {DAY_KEYS.map((d) => {
          const daySlots = grouped.get(d) || [];
          const isToday = d === todayIso;
          return (
            <div
              key={d}
              className={`rounded-2xl border ${
                isToday
                  ? "border-[#4DA8C4] bg-[#F0F9FB]"
                  : "border-[#E2E8F0] bg-white"
              } p-2 sm:p-3 space-y-2`}
            >
              <div
                className={`text-xs font-bold text-center uppercase ${
                  isToday ? "text-[#004B63]" : "text-[#64748B]"
                }`}
              >
                {DAY_LABELS.es[d]}
                {isToday && (
                  <div className="text-[10px] font-normal text-[#4DA8C4]">
                    HOY
                  </div>
                )}
              </div>
              {daySlots.length === 0 && (
                <div className="text-[10px] text-center text-[#94A3B8] py-4">
                  Libre
                </div>
              )}
              {daySlots
                .sort(
                  (a, b) =>
                    timeToMinutes(a.start_time) - timeToMinutes(b.start_time),
                )
                .map((s) => {
                  const color = s.color || subjectColor(s.subject);
                  return (
                    <div
                      key={s.id || `${s.day_of_week}-${s.start_time}`}
                      className="rounded-xl px-2 py-1.5 text-left shadow-sm border-l-4"
                      style={{
                        borderLeftColor: color,
                        backgroundColor: `${color}12`,
                      }}
                    >
                      <div className="text-[10px] text-[#64748B]">
                        {formatHHMM(s.start_time)}–{formatHHMM(s.end_time)}
                      </div>
                      <div className="text-xs font-semibold text-[#004B63] leading-tight">
                        <span aria-hidden className="mr-1">
                          {subjectEmoji(s.subject_label || s.subject)}
                        </span>
                        {s.subject_label || s.subject}
                      </div>
                      {s.room && (
                        <div className="text-[10px] text-[#64748B]">
                          {s.room}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Upcoming exams strip ────────────────────────────────────────────────
const UpcomingExams = ({ exams, onRemove }) => {
  if (!exams.length) return null;
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <header className="flex items-center gap-2 mb-3">
        <span className="text-lg" aria-hidden>
          📋
        </span>
        <h4 className="text-sm font-bold text-[#004B63]">Próximos exámenes</h4>
      </header>
      <ul className="space-y-2">
        {exams.map((x) => (
          <li
            key={x.id}
            className="flex items-center gap-3 rounded-xl border border-[#F1F5F9] p-2.5"
          >
            <span
              className="text-xl"
              aria-hidden
              style={{ color: subjectColor(x.subject) }}
            >
              {subjectEmoji(x.subject)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#004B63] truncate">
                {x.exam_name || x.subject}
              </div>
              <div className="text-xs text-[#64748B]">
                {new Date(x.exam_date).toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
                {x.topic ? ` · ${x.topic}` : ""}
              </div>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(x.id)}
                className="text-red-300 hover:text-red-500 px-2 py-1 rounded-lg text-sm"
                aria-label="Eliminar examen"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

// ── Main container ──────────────────────────────────────────────────────
const WeeklyScheduleView = () => {
  const {
    timetable,
    slots,
    loading,
    error,
    saveTimetable,
    saveSlots,
    currentClass,
    nextClass,
    upcomingExams,
    removeExam,
  } = useTimetable();

  const [mode, setMode] = useState("view"); // view | scan | edit
  const [pendingSlots, setPendingSlots] = useState(null);
  const [pendingMeta, setPendingMeta] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const todayIso = useMemo(() => {
    const js = new Date().getDay();
    return js === 0 ? 7 : js;
  }, []);

  const handleExtracted = useCallback(({ slots: sc, ...meta }) => {
    setPendingSlots(sc);
    setPendingMeta(meta);
    setMode("edit");
  }, []);

  const handleSave = useCallback(
    async ({ meta, slots: edited }) => {
      setSaving(true);
      setSaveError("");
      try {
        const tt = await saveTimetable({
          ...meta,
          source: pendingSlots ? "scan" : "manual",
        });
        // Pass tt.id directly so saveSlots doesn't depend on the React state
        // update (which arrives after re-render, too late for the next await).
        await saveSlots(edited, tt?.id);
        setPendingSlots(null);
        setPendingMeta({});
        setMode("view");
      } catch (e) {
        setSaveError(e?.message || "No se pudo guardar el horario.");
      } finally {
        setSaving(false);
      }
    },
    [saveTimetable, saveSlots, pendingSlots],
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center text-[#64748B]">
        Cargando tu horario…
      </div>
    );
  }

  if (error) {
    // Show a friendlier message for any error (assume it's missing schedule)
    // since we only show this when useTimetable can't load data
    const errorStr = String(error || "").toLowerCase();
    const isScheduleError =
      errorStr.includes("student") ||
      errorStr.includes("profile") ||
      errorStr.includes("no rows") ||
      errorStr.includes("404") ||
      error; // If there's any error, show friendly message

    if (isScheduleError) {
      return (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-[#004B63] via-[#4DA8C4] to-[#66CCCC] text-white p-6 sm:p-8 shadow-lg text-center"
          >
            <div className="text-5xl mb-3">📅</div>
            <h3 className="text-2xl font-black mb-1">Agrega tu horario</h3>
            <p className="text-sm opacity-90 mb-5 max-w-md mx-auto">
              Escanea el horario del colegio y SmartBoard te recordará tus
              clases y exámenes. También podrás hablar con Dani sobre la materia
              del momento.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => setMode("scan")}
                className="px-5 py-3 rounded-xl bg-white text-[#004B63] font-bold shadow hover:shadow-md"
              >
                📸 Escanear horario
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingSlots([]);
                  setPendingMeta({});
                  setMode("edit");
                }}
                className="px-5 py-3 rounded-xl bg-white/15 text-white font-semibold border border-white/40 hover:bg-white/25"
              >
                ✏️ Ingresar manualmente
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  // Editor takes priority (either fresh scan or edit existing).
  if (mode === "edit") {
    const initial = pendingSlots ? pendingSlots : slots.map((s) => ({ ...s }));
    const meta = pendingSlots
      ? pendingMeta
      : {
          school_name: timetable?.school_name,
          term_label: timetable?.term_label,
        };
    return (
      <Suspense fallback={<LoadingBlock />}>
        {saveError && (
          <div className="mb-3 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {saveError}
          </div>
        )}
        <ScheduleEditor
          initialSlots={initial}
          meta={meta}
          onSave={handleSave}
          onCancel={() => {
            setPendingSlots(null);
            setPendingMeta({});
            setMode("view");
          }}
          saving={saving}
        />
      </Suspense>
    );
  }

  if (mode === "scan") {
    return (
      <Suspense fallback={<LoadingBlock />}>
        <ScheduleScanner
          onExtracted={handleExtracted}
          onCancel={() => setMode("view")}
        />
      </Suspense>
    );
  }

  // Empty state.
  if (!timetable || slots.length === 0) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-[#004B63] via-[#4DA8C4] to-[#66CCCC] text-white p-6 sm:p-8 shadow-lg text-center"
        >
          <div className="text-5xl mb-3">📅</div>
          <h3 className="text-2xl font-black mb-1">Agrega tu horario</h3>
          <p className="text-sm opacity-90 mb-5 max-w-md mx-auto">
            Escanea el horario del colegio y SmartBoard te recordará tus clases
            y exámenes. También podrás hablar con Dani sobre la materia del
            momento.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setMode("scan")}
              className="px-5 py-3 rounded-xl bg-white text-[#004B63] font-bold shadow hover:shadow-md"
            >
              📸 Escanear horario
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingSlots([]);
                setPendingMeta({});
                setMode("edit");
              }}
              className="px-5 py-3 rounded-xl bg-white/15 text-white font-semibold border border-white/40 hover:bg-white/25"
            >
              ✏️ Ingresar manualmente
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Normal view.
  return (
    <div className="space-y-4">
      <NowNextBanner current={currentClass} next={nextClass} />

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="text-sm text-[#64748B]">
          {timetable.school_name || "Mi horario"}
          {timetable.term_label ? ` · ${timetable.term_label}` : ""}
          {" · "}
          <span className="text-[#004B63] font-semibold">
            {slots.length} bloques
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="px-3 py-2 rounded-lg text-sm border border-[#E2E8F0] text-[#004B63] hover:bg-[#F0F9FB] font-semibold"
          >
            ✏️ Editar
          </button>
          <button
            type="button"
            onClick={() => setMode("scan")}
            className="px-3 py-2 rounded-lg text-sm bg-[#004B63] text-white font-semibold hover:bg-[#003347]"
          >
            📸 Escanear de nuevo
          </button>
        </div>
      </div>

      <WeeklyGrid slots={slots} todayIso={todayIso} />

      <UpcomingExams exams={upcomingExams} onRemove={removeExam} />
    </div>
  );
};

export default WeeklyScheduleView;
