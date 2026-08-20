import { useCallback, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DAY_KEYS,
  DAY_LABELS,
  subjectColor,
  subjectEmoji,
  normalizeSubject,
  localId,
  timeToMinutes,
} from "./timetableUtils";

const COMMON_SUBJECTS = [
  "Matemáticas",
  "Lenguaje",
  "Ciencias",
  "Sociales",
  "Inglés",
  "Arte",
  "Educación Física",
  "Tecnología",
  "Filosofía",
  "Religión",
  "Música",
];

const SlotRow = memo(({ slot, onChange, onRemove }) => {
  const color = slot.color || subjectColor(slot.subject);
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-[#F1F5F9]"
    >
      <td className="px-2 py-2">
        <select
          value={slot.day_of_week}
          onChange={(e) =>
            onChange(slot._localId, {
              day_of_week: Number(e.target.value),
            })
          }
          className="w-full text-sm rounded-lg border border-[#E2E8F0] px-2 py-1.5 bg-white"
        >
          {DAY_KEYS.map((d) => (
            <option key={d} value={d}>
              {DAY_LABELS.es.long[d]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-2 py-2">
        <input
          type="time"
          value={slot.start_time}
          onChange={(e) =>
            onChange(slot._localId, { start_time: e.target.value })
          }
          className="w-full text-sm rounded-lg border border-[#E2E8F0] px-2 py-1.5 bg-white"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="time"
          value={slot.end_time}
          onChange={(e) =>
            onChange(slot._localId, { end_time: e.target.value })
          }
          className="w-full text-sm rounded-lg border border-[#E2E8F0] px-2 py-1.5 bg-white"
        />
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg" aria-hidden>
            {subjectEmoji(slot.subject_label || slot.subject)}
          </span>
          <input
            list="common-subjects"
            value={slot.subject_label || slot.subject}
            onChange={(e) => {
              const label = e.target.value;
              onChange(slot._localId, {
                subject_label: label,
                subject: normalizeSubject(label),
                color: subjectColor(label),
              });
            }}
            placeholder="Materia"
            className="w-full text-sm rounded-lg border border-[#E2E8F0] px-2 py-1.5 bg-white"
          />
        </div>
      </td>
      <td className="px-2 py-2">
        <input
          value={slot.teacher || ""}
          onChange={(e) =>
            onChange(slot._localId, { teacher: e.target.value || null })
          }
          placeholder="Profesor"
          className="w-full text-sm rounded-lg border border-[#E2E8F0] px-2 py-1.5 bg-white"
        />
      </td>
      <td className="px-2 py-2">
        <input
          value={slot.room || ""}
          onChange={(e) =>
            onChange(slot._localId, { room: e.target.value || null })
          }
          placeholder="Aula"
          className="w-full text-sm rounded-lg border border-[#E2E8F0] px-2 py-1.5 bg-white"
        />
      </td>
      <td className="px-1 py-2 w-8">
        <div
          className="w-2 h-8 rounded-full mx-auto"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      </td>
      <td className="px-1 py-2 w-10 text-right">
        <button
          type="button"
          onClick={() => onRemove(slot._localId)}
          className="text-red-400 hover:text-red-600 px-2 py-1 rounded-lg"
          aria-label="Eliminar bloque"
        >
          ✕
        </button>
      </td>
    </motion.tr>
  );
});
SlotRow.displayName = "SlotRow";

const validate = (slots) => {
  const errors = [];
  slots.forEach((s, i) => {
    if (!s.subject_label && !s.subject) {
      errors.push(`Bloque ${i + 1}: falta materia`);
    }
    if (!s.start_time || !s.end_time) {
      errors.push(`Bloque ${i + 1}: falta hora`);
    } else if (timeToMinutes(s.end_time) <= timeToMinutes(s.start_time)) {
      errors.push(`Bloque ${i + 1}: la hora final debe ser mayor`);
    }
  });
  return errors;
};

const ScheduleEditor = memo(
  ({ initialSlots = [], meta = {}, onSave, onCancel, saving = false }) => {
    const [schoolName, setSchoolName] = useState(meta.school_name || "");
    const [termLabel, setTermLabel] = useState(meta.term_label || "");
    const [slots, setSlots] = useState(() =>
      initialSlots.map((s) => ({ ...s, _localId: s._localId || localId() })),
    );

    const errors = useMemo(() => validate(slots), [slots]);

    const updateSlot = useCallback((id, patch) => {
      setSlots((prev) =>
        prev.map((s) => (s._localId === id ? { ...s, ...patch } : s)),
      );
    }, []);

    const removeSlot = useCallback((id) => {
      setSlots((prev) => prev.filter((s) => s._localId !== id));
    }, []);

    const addSlot = useCallback(() => {
      setSlots((prev) => [
        ...prev,
        {
          _localId: localId(),
          day_of_week: 1,
          start_time: "08:00",
          end_time: "09:00",
          subject: "matematicas",
          subject_label: "Matemáticas",
          color: subjectColor("matematicas"),
          teacher: null,
          room: null,
        },
      ]);
    }, []);

    const handleSave = () => {
      if (errors.length || !slots.length) return;
      // Strip local-only fields.
      onSave({
        meta: {
          school_name: schoolName.trim() || null,
          term_label: termLabel.trim() || null,
        },
        // eslint-disable-next-line no-unused-vars
        slots: slots.map(({ _localId, ...rest }) => rest),
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm"
      >
        <header className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF476F] to-[#FF6B9D] flex items-center justify-center text-lg shadow">
            ✏️
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#004B63]">
              Revisa y ajusta
            </h3>
            <p className="text-xs text-[#64748B]">
              Corrige lo que la IA extrajo mal. Puedes agregar o eliminar
              bloques. Esto se guarda al confirmar.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-[#004B63] mb-1 block">
              Colegio (opcional)
            </span>
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ej. Colegio San José"
              className="w-full text-sm rounded-lg border border-[#E2E8F0] px-3 py-2 bg-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#004B63] mb-1 block">
              Período (opcional)
            </span>
            <input
              value={termLabel}
              onChange={(e) => setTermLabel(e.target.value)}
              placeholder="Ej. 2026-I"
              className="w-full text-sm rounded-lg border border-[#E2E8F0] px-3 py-2 bg-white"
            />
          </label>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#64748B] uppercase">
                <th className="px-2 py-2 font-semibold">Día</th>
                <th className="px-2 py-2 font-semibold">Inicio</th>
                <th className="px-2 py-2 font-semibold">Fin</th>
                <th className="px-2 py-2 font-semibold">Materia</th>
                <th className="px-2 py-2 font-semibold">Profesor</th>
                <th className="px-2 py-2 font-semibold">Aula</th>
                <th className="px-1 py-2 font-semibold w-8"></th>
                <th className="px-1 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {slots.map((s) => (
                  <SlotRow
                    key={s._localId}
                    slot={s}
                    onChange={updateSlot}
                    onRemove={removeSlot}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <datalist id="common-subjects">
          {COMMON_SUBJECTS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addSlot}
            className="px-3 py-2 rounded-lg border-2 border-dashed border-[#4DA8C4]/60 text-sm text-[#004B63] font-semibold hover:bg-[#F0F9FB]"
          >
            + Agregar bloque
          </button>
          {!slots.length && (
            <span className="text-xs text-[#64748B]">
              Agrega al menos un bloque para guardar.
            </span>
          )}
        </div>

        {errors.length > 0 && (
          <ul className="text-xs text-red-600 bg-red-50 rounded-lg p-3 space-y-1">
            {errors.slice(0, 4).map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
            {errors.length > 4 && (
              <li>+ {errors.length - 4} más…</li>
            )}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !slots.length || errors.length > 0}
            className="flex-1 min-w-[10rem] px-4 py-3 rounded-xl bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando…" : "Guardar horario"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
            >
              Cancelar
            </button>
          )}
        </div>
      </motion.div>
    );
  },
);
ScheduleEditor.displayName = "ScheduleEditor";
export default ScheduleEditor;
