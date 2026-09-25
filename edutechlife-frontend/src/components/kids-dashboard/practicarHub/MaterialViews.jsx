import { memo, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { marked } from "marked";
import { Youtube, Volume2, Square, ChevronDown } from "lucide-react";
import { sanitize } from "../../../utils/sanitize";
import { fetchTopVideos } from "../../../utils/api";
import { speakAsDani, stopDani, isCurrentRun } from "./daniSpeak";

const PROSE =
  "text-sm leading-relaxed break-words [&_h1]:font-bold [&_h1]:text-base [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h3]:font-bold [&_h3]:mt-2 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-bold";

export function ListenButton({
  text,
  className = "",
  label = "Dani lo lee",
  stopLabel = "Detener",
}) {
  const [speaking, setSpeaking] = useState(false);
  const runRef = useRef(null);

  useEffect(
    () => () => {
      if (runRef.current && isCurrentRun(runRef.current)) stopDani();
    },
    [],
  );

  const toggle = useCallback(() => {
    if (speaking) {
      stopDani();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    runRef.current = speakAsDani(text, { onEnd: () => setSpeaking(false) });
  }, [speaking, text]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? "Detener a Dani" : `${label}: escuchar a Dani`}
      className={className}
    >
      {speaking ? (
        <Square className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Volume2 className="w-4 h-4" aria-hidden="true" />
      )}
      {speaking ? stopLabel : label}
    </button>
  );
}

export const SummaryView = memo(function SummaryView({ data }) {
  const html = useMemo(
    () => sanitize(marked.parse(data.text, { breaks: true, gfm: true })),
    [data.text],
  );
  return <div className={PROSE} dangerouslySetInnerHTML={{ __html: html }} />;
});

function ExerciseCard({ ex, n, color, dm, onMark, mark }) {
  const [hint, setHint] = useState(false);
  const [open, setOpen] = useState(false);
  const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";
  return (
    <li
      className={`rounded-2xl border p-3.5 ${dm ? "bg-[#0F172A] border-[#334155]" : "bg-white border-[#E2E8F0]"}`}
    >
      <p className="text-sm font-bold flex gap-2">
        <span
          className="w-6 h-6 rounded-full text-xs text-white flex items-center justify-center shrink-0"
          style={{
            background:
              mark === "ok" ? "#22C55E" : mark === "no" ? "#F59E0B" : color,
          }}
          aria-hidden="true"
        >
          {mark === "ok" ? "✓" : n}
        </span>
        <span className="leading-snug">{ex.pregunta}</span>
      </p>
      {hint && ex.pista && (
        <p className={`mt-2 text-sm ${sub}`}>💡 {ex.pista}</p>
      )}
      {open && (
        <div className="mt-2 rounded-xl p-2.5 text-sm bg-green-500/10">
          <p className="font-bold text-green-700">✓ {ex.respuesta}</p>
          {ex.explicacion && <p className={`mt-1 ${sub}`}>{ex.explicacion}</p>}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {!open && ex.pista && !hint && (
          <button
            type="button"
            onClick={() => setHint(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-800"
          >
            💡 Ver pista
          </button>
        )}
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: color }}
          >
            Ver respuesta
          </button>
        ) : (
          !mark && (
            <>
              <button
                type="button"
                onClick={() => onMark("ok")}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-green-500 text-white"
              >
                ✓ Lo hice bien
              </button>
              <button
                type="button"
                onClick={() => onMark("no")}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-800"
              >
                Me equivoqué
              </button>
            </>
          )
        )}
      </div>
    </li>
  );
}

export const ExercisesView = memo(function ExercisesView({ data, color, dm }) {
  const [marks, setMarks] = useState({});
  const done = Object.keys(marks).length;
  const ok = Object.values(marks).filter((m) => m === "ok").length;
  const total = data.ejercicios.length;
  return (
    <div className="space-y-2.5">
      <p
        className={`text-xs font-bold ${dm ? "text-[#94A3B8]" : "text-[#64748B]"}`}
      >
        Resuélvelo en tu cuaderno y luego revisa.{" "}
        {done > 0 && `${ok} de ${done} bien`}
      </p>
      <ol className="space-y-2.5">
        {data.ejercicios.map((ex, i) => (
          <ExerciseCard
            key={i}
            ex={ex}
            n={i + 1}
            color={color}
            dm={dm}
            mark={marks[i]}
            onMark={(m) => setMarks((prev) => ({ ...prev, [i]: m }))}
          />
        ))}
      </ol>
      {done === total && (
        <p className="text-center text-sm font-black text-green-600">
          {ok === total
            ? "¡Perfecto! Los resolviste todos 🏆"
            : `¡Terminaste! ${ok} de ${total} bien. Repasa los que fallaste 💪`}
        </p>
      )}
    </div>
  );
});

const compact = (n) =>
  new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
const mmss = (sec) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
// sp=CAM%253D → YouTube results sorted by view count.
const searchUrl = (q) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=CAM%253D`;

function VideoSearch({ search, dm, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, setState] = useState({ status: "idle", videos: [] });
  const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";

  const requested = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open || requested.current) return;
    requested.current = true;
    setState({ status: "loading", videos: [] });
    fetchTopVideos(search.texto)
      .then((videos) => {
        if (mounted.current)
          setState(
            videos
              ? { status: "ok", videos }
              : { status: "fallback", videos: [] },
          );
      })
      .catch((e) => {
        if (mounted.current)
          setState({ status: "error", videos: [], message: e.message });
      });
  }, [open, search.texto]);

  return (
    <li
      className={`rounded-2xl border ${dm ? "bg-[#0F172A] border-[#334155] text-white" : "bg-white border-[#E2E8F0] text-[#1E293B]"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <Youtube className="w-7 h-7 text-red-500 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">{search.texto}</span>
          {search.aprenderas && (
            <span className={`block text-xs ${sub}`}>{search.aprenderas}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 opacity-50 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          {state.status === "loading" &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-16 rounded-xl animate-pulse ${dm ? "bg-[#1E293B]" : "bg-[#F1F5F9]"}`}
              />
            ))}
          {state.status === "ok" &&
            state.videos.map((v, i) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-3 p-2 rounded-xl no-underline ${dm ? "text-white hover:bg-[#1E293B]" : "text-[#1E293B] hover:bg-[#F8FAFC]"}`}
              >
                <span className="relative block shrink-0 w-28 h-[63px] rounded-lg overflow-hidden bg-black/10">
                  {v.thumbnail && (
                    <img
                      src={v.thumbnail}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/75 text-white text-[10px] font-bold">
                    {mmss(v.seconds)}
                  </span>
                  {i === 0 && (
                    <span className="absolute top-1 left-1 px-1.5 rounded bg-amber-400 text-amber-950 text-[9px] font-black">
                      TOP
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold leading-snug line-clamp-2 text-inherit">
                    {v.title}
                  </span>
                  <span className={`block text-[11px] mt-0.5 truncate ${sub}`}>
                    {v.channel}
                  </span>
                  <span className={`block text-[11px] ${sub}`}>
                    👁 {compact(v.views)} vistas
                    {v.likes ? ` · 👍 ${compact(v.likes)}` : ""}
                  </span>
                </span>
              </a>
            ))}
          {state.status === "ok" && state.videos.length === 0 && (
            <p className={`text-xs ${sub}`}>
              No encontramos videos adecuados para esta búsqueda.
            </p>
          )}
          {state.status === "error" && (
            <p className="text-xs text-red-600">{state.message}</p>
          )}
          <a
            href={searchUrl(search.texto)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs font-bold text-red-600 py-2"
          >
            {state.status === "ok" && state.videos.length
              ? "Ver más en YouTube →"
              : "Ver los más vistos en YouTube →"}
          </a>
        </div>
      )}
    </li>
  );
}

export const VideosView = memo(function VideosView({ data, dm }) {
  return (
    <ul className="space-y-2">
      {data.busquedas.map((v, i) => (
        <VideoSearch key={v.texto} search={v} dm={dm} defaultOpen={i === 0} />
      ))}
      <li
        className={`text-[11px] px-1 ${dm ? "text-[#64748B]" : "text-[#94A3B8]"}`}
      >
        Videos con búsqueda segura, ordenados por los más vistos y mejor
        valorados. Si tienes dudas, míralos con un adulto.
      </li>
    </ul>
  );
});

export function materialToText(type, data) {
  if (type === "resumen") return data.text;
  if (type === "mapa")
    return [
      data.centro,
      ...data.ramas.map((r) => `- ${r.idea}: ${r.detalles.join("; ")}`),
    ].join("\n");
  if (type === "infografia") {
    const cmp = data.formato === "comparacion" && data.comparacion;
    const body = cmp
      ? [
          ...[cmp.izquierda, cmp.derecha].map(
            (s) => `${s.titulo}: ${s.puntos.join(", ")}`,
          ),
          cmp.semejanzas?.length
            ? `En qué se parecen: ${cmp.semejanzas.join(", ")}`
            : "",
        ]
      : data.bloques.map(
          (b) => `${b.cifra ? `${b.cifra}, ` : ""}${b.titulo}: ${b.texto}`,
        );
    return [
      data.titulo,
      data.subtitulo,
      ...body,
      data.dato ? `Dato curioso: ${data.dato}` : "",
    ]
      .filter(Boolean)
      .join(". ");
  }
  if (type === "ejercicios")
    return data.ejercicios
      .map((e, i) => `${i + 1}. ${e.pregunta}\n   Respuesta: ${e.respuesta}`)
      .join("\n");
  if (type === "video")
    return data.busquedas.map((b) => `- ${b.texto}`).join("\n");
  return "";
}
