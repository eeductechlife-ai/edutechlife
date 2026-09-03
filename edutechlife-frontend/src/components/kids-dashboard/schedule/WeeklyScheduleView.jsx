import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSmartBoardKids } from "../../../context/SmartBoardKidsContext";
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

const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

// ── Clase actual ─────────────────────────────────────────────────────────
const AhoraCard = ({ current, next, todayIso }) => {
  const nowM = nowMinutes();

  if (!current) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 flex items-center gap-4">
        <span className="text-4xl">☕</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[#64748B] mb-0.5">Sin clase ahora</div>
          {next ? (
            <>
              <div className="text-base font-bold text-[#004B63]">
                {subjectEmoji(next.subject_label || next.subject)}{" "}
                {next.subject_label || next.subject}
              </div>
              <div className="text-xs text-[#64748B]">
                Próxima ·{" "}
                {next.day_of_week === todayIso
                  ? formatHHMM(next.start_time)
                  : `${DAY_LABELS.es[next.day_of_week]} ${formatHHMM(next.start_time)}`}
              </div>
            </>
          ) : (
            <div className="text-sm font-semibold text-[#004B63]">
              No hay más clases por hoy
            </div>
          )}
        </div>
      </div>
    );
  }

  const color = current.color || subjectColor(current.subject);
  const startM = timeToMinutes(current.start_time);
  const endM = timeToMinutes(current.end_time);
  const duration = endM - startM || 1;
  const elapsed = nowM - startM;
  const remaining = Math.max(0, endM - nowM);
  const progress = Math.min(100, Math.round((elapsed / duration) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ backgroundColor: `${color}16`, border: `2px solid ${color}50` }}
    >
      <div className="flex items-start gap-4">
        <span className="text-5xl leading-none mt-0.5">
          {subjectEmoji(current.subject_label || current.subject)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              ● En curso
            </span>
            {remaining > 0 && (
              <span className="text-xs text-[#64748B]">
                {remaining} min restantes
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-[#004B63] leading-tight truncate">
            {current.subject_label || current.subject}
          </div>
          <div className="text-sm text-[#64748B] mt-0.5">
            {formatHHMM(current.start_time)} – {formatHHMM(current.end_time)}
            {current.teacher ? ` · ${current.teacher}` : ""}
            {current.room ? ` · Aula ${current.room}` : ""}
          </div>
        </div>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-white/60">
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>

      {next && next.id !== current.id && (
        <div className="mt-3 pt-3 border-t border-black/5 flex items-center gap-2 text-xs">
          <span className="text-[#64748B]">Sigue:</span>
          <span className="font-semibold text-[#004B63]">
            {subjectEmoji(next.subject_label || next.subject)}{" "}
            {next.subject_label || next.subject}
          </span>
          <span className="text-[#64748B] ml-auto">
            {formatHHMM(next.start_time)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ── Horario de hoy ───────────────────────────────────────────────────────
const TodayTimeline = ({ slots, todayIso }) => {
  const nowM = nowMinutes();
  const todaySlots = slots
    .filter((s) => s.day_of_week === todayIso)
    .sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

  if (todaySlots.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <div className="text-sm font-semibold text-[#004B63]">
          Hoy no tienes clases
        </div>
        <div className="text-xs text-[#64748B] mt-1">
          ¡Disfruta tu día libre!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-[#F1F5F9]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#004B63]">
          Hoy
        </span>
        <span className="text-xs text-[#94A3B8]">
          {todaySlots.length} {todaySlots.length === 1 ? "clase" : "clases"}
        </span>
      </div>
      <ul>
        {todaySlots.map((s, i) => {
          const startM = timeToMinutes(s.start_time);
          const endM = timeToMinutes(s.end_time);
          const isCurrent = startM <= nowM && endM > nowM;
          const isPast = endM <= nowM;
          const color = s.color || subjectColor(s.subject);

          return (
            <li
              key={s.id || `${s.day_of_week}-${s.start_time}`}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < todaySlots.length - 1 ? "border-b border-[#F1F5F9]" : ""
              } ${isCurrent ? "bg-[#F0F9FB]" : ""} ${isPast ? "opacity-40" : ""}`}
            >
              <div className="text-xs text-[#64748B] w-[68px] shrink-0 tabular-nums">
                {formatHHMM(s.start_time)}
                <div className="text-[10px]">{formatHHMM(s.end_time)}</div>
              </div>
              <div
                className="w-1 self-stretch rounded-full shrink-0 min-h-[2.5rem]"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm text-[#004B63] truncate ${
                    isCurrent ? "font-black" : "font-semibold"
                  }`}
                >
                  <span aria-hidden className="mr-1">
                    {subjectEmoji(s.subject_label || s.subject)}
                  </span>
                  {s.subject_label || s.subject}
                </div>
                {(s.teacher || s.room) && (
                  <div className="text-xs text-[#94A3B8] truncate">
                    {[s.teacher, s.room && `Aula ${s.room}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                )}
              </div>
              {isCurrent && (
                <span
                  className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full text-white shrink-0"
                  style={{ backgroundColor: color }}
                >
                  Ahora
                </span>
              )}
              {isPast && (
                <span className="text-[#94A3B8] shrink-0 text-sm">✓</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ── Semana completa (colapsable) ─────────────────────────────────────────
const WeeklyGrid = ({ slots, todayIso }) => {
  const grouped = useMemo(() => groupByDay(slots), [slots]);
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
      <div className="min-w-[560px] grid grid-cols-7 gap-1.5 px-4 sm:px-0">
        {DAY_KEYS.map((d) => {
          const daySlots = (grouped.get(d) || []).sort(
            (a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time),
          );
          const isToday = d === todayIso;
          return (
            <div
              key={d}
              className={`rounded-xl border p-2 space-y-1.5 ${
                isToday
                  ? "border-[#4DA8C4] bg-[#F0F9FB]"
                  : "border-[#E2E8F0] bg-white"
              }`}
            >
              <div
                className={`text-[10px] font-bold text-center uppercase ${
                  isToday ? "text-[#004B63]" : "text-[#94A3B8]"
                }`}
              >
                {DAY_LABELS.es[d]}
                {isToday && (
                  <div className="text-[9px] text-[#4DA8C4] font-normal">
                    HOY
                  </div>
                )}
              </div>
              {daySlots.length === 0 && (
                <div className="text-[10px] text-center text-[#CBD5E1] py-2">
                  –
                </div>
              )}
              {daySlots.map((s) => {
                const color = s.color || subjectColor(s.subject);
                return (
                  <div
                    key={s.id || `${s.day_of_week}-${s.start_time}`}
                    className="rounded-lg px-1.5 py-1 border-l-2 text-left"
                    style={{
                      borderLeftColor: color,
                      backgroundColor: `${color}12`,
                    }}
                  >
                    <div className="text-[9px] text-[#64748B]">
                      {formatHHMM(s.start_time)}
                    </div>
                    <div className="text-[10px] font-semibold text-[#004B63] leading-tight">
                      {subjectEmoji(s.subject_label || s.subject)}{" "}
                      {s.subject_label || s.subject}
                    </div>
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

// ── Contenedor principal ─────────────────────────────────────────────────
const WeeklyScheduleView = () => {
  const {
    timetable,
    slots,
    timetableLoading,
    timetableError,
    saveTimetableWithSlots,
    currentClass,
    nextClass,
  } = useSmartBoardKids();

  const loading = timetableLoading;
  const error = timetableError;

  const [mode, setMode] = useState("view");
  const [showWeek, setShowWeek] = useState(false);
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
        await saveTimetableWithSlots({
          meta: { ...meta, source: pendingSlots ? "scan" : "manual" },
          slots: edited,
        });
        setPendingSlots(null);
        setPendingMeta({});
        setMode("view");
      } catch (e) {
        setSaveError(
          e?.message || "No se pudo guardar el horario. Intenta de nuevo.",
        );
      } finally {
        setSaving(false);
      }
    },
    [saveTimetableWithSlots, pendingSlots],
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center text-[#64748B]">
        Cargando tu horario…
      </div>
    );
  }

  // Estado vacío (error o sin horario)
  if ((error || !timetable || slots.length === 0) && mode === "view") {
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
            y exámenes.
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

  // Vista principal — hoy primero
  return (
    <div className="space-y-3">
      <AhoraCard current={currentClass} next={nextClass} todayIso={todayIso} />

      <TodayTimeline slots={slots} todayIso={todayIso} />

      <button
        type="button"
        onClick={() => setShowWeek((v) => !v)}
        className="w-full py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#004B63] font-semibold hover:bg-[#F0F9FB] flex items-center justify-center gap-2"
      >
        {showWeek ? "▲ Ocultar semana" : "📆 Ver semana completa"}
      </button>

      {showWeek && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WeeklyGrid slots={slots} todayIso={todayIso} />
        </motion.div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className="flex-1 py-2.5 rounded-xl text-sm border border-[#E2E8F0] text-[#004B63] hover:bg-[#F0F9FB] font-semibold"
        >
          ✏️ Editar
        </button>
        <button
          type="button"
          onClick={() => setMode("scan")}
          className="flex-1 py-2.5 rounded-xl text-sm bg-[#004B63] text-white font-semibold hover:bg-[#003347]"
        >
          📸 Actualizar horario
        </button>
      </div>
    </div>
  );
};

export default WeeklyScheduleView;
