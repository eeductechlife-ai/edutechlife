import { memo, useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  X,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Star,
  Layers,
  Trash2,
  ChevronDown,
  Download,
} from "lucide-react";
import { callDeepseekSmartboard } from "../../../utils/api";
import { CONTENT_TYPES } from "./practicarConfig";
import { logPractice } from "./practicarProgress";
import { setHandoff, HANDOFF_FLASHCARDS_TOPIC } from "./practicarHandoff";
import {
  gradeTopics,
  buildMaterialRequest,
  parseMaterial,
} from "./materialPrompts";
import { useSavedMaterials } from "./useSavedMaterials";
import {
  MindMapImage,
  InfographicImage,
  downloadSvgAsPng,
} from "./MaterialImages";
import {
  SummaryView,
  ExercisesView,
  VideosView,
  ListenButton,
  materialToText,
} from "./MaterialViews";

const LOADING_TEXT = {
  resumen: "Escribiendo tu resumen…",
  mapa: "Dibujando tu mapa mental…",
  infografia: "Diseñando tu infografía…",
  ejercicios: "Preparando tus ejercicios…",
  video: "Buscando los mejores videos…",
};

const typeMeta = (id) => CONTENT_TYPES.find((c) => c.id === id);

const ContentGenerator = memo(
  ({ subject, grade, age, onClose, onTabChange, darkMode: dm }) => {
    const topics = useMemo(
      () => gradeTopics(subject.id, grade).slice(0, 4),
      [subject.id, grade],
    );
    const [pickedTopic, setPickedTopic] = useState(null);
    const [customTopic, setCustomTopic] = useState("");
    const [contentType, setContentType] = useState("resumen");
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [savedId, setSavedId] = useState(null);
    const [showSaved, setShowSaved] = useState(false);
    const { saved, save, remove } = useSavedMaterials();
    const resultRef = useRef(null);
    const imageRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const gradeLabel = grade ? `grado ${grade}°` : "primaria";
    const topic =
      customTopic.trim() ||
      pickedTopic ||
      `Lo más importante de ${subject.label}`;

    useEffect(() => {
      if (material || loading)
        resultRef.current?.scrollIntoView?.({
          behavior: "smooth",
          block: "nearest",
        });
    }, [material, loading]);

    const generate = useCallback(async () => {
      setLoading(true);
      setError("");
      setMaterial(null);
      setSavedId(null);
      const req = buildMaterialRequest(contentType, {
        subjectLabel: subject.label,
        topic,
        gradeLabel,
        age,
      });
      try {
        const raw = await callDeepseekSmartboard(req.messages, {
          isJson: req.isJson,
          temperature: 0.6,
          maxTokens: req.maxTokens,
        });
        const data = parseMaterial(contentType, raw);
        if (!data) throw new Error("unusable");
        setMaterial({
          type: contentType,
          topic,
          data,
          subjectId: subject.id,
          subjectLabel: subject.label,
        });
        logPractice({
          type: "material",
          subject: subject.id,
          kind: contentType,
        });
      } catch (e) {
        const known =
          e?.code === "PARENTAL_CONSENT_REQUIRED" ||
          /sesión|servidor|minuto|consentimiento/i.test(e?.message || "");
        setError(
          e?.message === "unusable" || e?.raw !== undefined
            ? "La IA no respondió bien esta vez. Toca «Crear» otra vez."
            : known
              ? e.message
              : "No pudimos crear el material. Revisa tu conexión e intenta de nuevo.",
        );
      } finally {
        setLoading(false);
      }
    }, [contentType, subject, topic, gradeLabel, age]);

    const copy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(
          `${material.topic}\n\n${materialToText(material.type, material.data)}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        // clipboard blocked; nothing else to do
      }
    }, [material]);

    const makeCards = () => {
      setHandoff(HANDOFF_FLASHCARDS_TOPIC, material.topic.slice(0, 80));
      onTabChange?.("flashcards");
    };

    const card = dm
      ? "bg-[#1E293B] border-[#334155]"
      : "bg-white border-[#E2E8F0]";
    const text = dm ? "text-white" : "text-[#1E293B]";
    const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";
    const idle = dm
      ? "bg-[#0F172A] border-[#334155] text-white"
      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]";
    const action = `flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border ${idle}`;

    return (
      <section
        aria-label="Crear material de estudio"
        className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${card}`}
      >
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={`font-bold text-base ${text}`}>
              Crear material de {subject.label}
            </h3>
            <p className={`text-xs mt-0.5 ${sub}`}>
              La IA lo prepara para tu {gradeLabel}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={`w-11 h-11 -mr-2 -mt-2 flex items-center justify-center rounded-xl shrink-0 ${sub} hover:bg-black/5`}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="space-y-2">
          <p className={`text-xs font-black uppercase tracking-wide ${sub}`}>
            1. ¿De qué tema?
          </p>
          {topics.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Temas de tu grado"
            >
              {topics.map((tp) => {
                const sel = pickedTopic === tp && !customTopic.trim();
                return (
                  <button
                    key={tp}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => {
                      setPickedTopic(sel ? null : tp);
                      setCustomTopic("");
                    }}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 text-xs font-semibold leading-snug ${sel ? "text-white border-transparent" : idle}`}
                    style={sel ? { background: subject.color } : {}}
                  >
                    {tp}
                  </button>
                );
              })}
            </div>
          )}
          <label htmlFor="practicar-topic" className="sr-only">
            Otro tema
          </label>
          <input
            id="practicar-topic"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && generate()}
            maxLength={120}
            placeholder={
              topics.length
                ? "…o escribe otro tema de tu clase"
                : "Escribe el tema de tu clase"
            }
            className={`w-full px-3 py-3 rounded-xl border text-base sm:text-sm outline-none focus:border-[#9D4EDD] ${idle}`}
          />
        </div>

        <div className="space-y-2">
          <p className={`text-xs font-black uppercase tracking-wide ${sub}`}>
            2. ¿Qué quieres?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_TYPES.map((ct, i) => {
              const sel = contentType === ct.id;
              const lastOdd =
                CONTENT_TYPES.length % 2 === 1 &&
                i === CONTENT_TYPES.length - 1;
              return (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setContentType(ct.id)}
                  aria-pressed={sel}
                  className={`flex items-start gap-2 p-3 rounded-xl border-2 text-left ${lastOdd ? "col-span-2" : ""} ${sel ? "text-white border-transparent" : idle}`}
                  style={sel ? { background: subject.color } : {}}
                >
                  <span className="text-lg leading-none" aria-hidden="true">
                    {ct.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold">{ct.label}</span>
                    <span
                      className={`block text-[11px] leading-snug mt-0.5 ${sel ? "text-white/85" : sub}`}
                    >
                      {ct.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm text-red-600 bg-red-500/10 px-3 py-2.5 rounded-xl"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-black text-sm text-white disabled:opacity-60"
          style={{
            background: `linear-gradient(135deg, ${subject.color} 0%, #9D4EDD 100%)`,
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />{" "}
              {LOADING_TEXT[contentType]}
            </span>
          ) : (
            `✨ Crear ${typeMeta(contentType)?.label.toLowerCase()}`
          )}
        </button>

        <div ref={resultRef}>
          {loading && (
            <div className="space-y-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-12 rounded-xl animate-pulse ${dm ? "bg-[#0F172A]" : "bg-[#F1F5F9]"}`}
                />
              ))}
            </div>
          )}

          {material && !loading && (
            <article
              className={`rounded-2xl border p-4 space-y-3 ${dm ? "border-[#334155]" : "border-[#E2E8F0]"}`}
            >
              <header>
                <p
                  className="text-[11px] font-black uppercase tracking-wide"
                  style={{ color: subject.color }}
                >
                  {typeMeta(material.type)?.emoji}{" "}
                  {typeMeta(material.type)?.label}
                </p>
                <p className={`text-sm font-bold leading-snug ${text}`}>
                  {material.topic}
                </p>
              </header>

              <div className={text}>
                {material.type === "resumen" && (
                  <SummaryView data={material.data} />
                )}
                {material.type === "mapa" && (
                  <div className="rounded-2xl overflow-hidden border border-black/5">
                    <MindMapImage
                      ref={imageRef}
                      data={material.data}
                      color={subject.color}
                      layout={
                        typeof window !== "undefined" && window.innerWidth < 640
                          ? "tree"
                          : "radial"
                      }
                    />
                  </div>
                )}
                {material.type === "infografia" && (
                  <div className="rounded-2xl overflow-hidden border border-black/5">
                    <InfographicImage
                      ref={imageRef}
                      data={material.data}
                      color={subject.color}
                    />
                  </div>
                )}
                {material.type === "ejercicios" && (
                  <ExercisesView
                    data={material.data}
                    color={subject.color}
                    dm={dm}
                  />
                )}
                {material.type === "video" && (
                  <VideosView data={material.data} dm={dm} />
                )}
              </div>

              {(material.type === "mapa" || material.type === "infografia") && (
                <button
                  type="button"
                  disabled={downloading}
                  onClick={async () => {
                    if (!imageRef.current) return;
                    setDownloading(true);
                    try {
                      const name =
                        `${typeMeta(material.type)?.label}-${material.topic}`
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[^a-z0-9]+/g, "-")
                          .slice(0, 60);
                      await downloadSvgAsPng(imageRef.current, name);
                    } finally {
                      setDownloading(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white disabled:opacity-60"
                  style={{ background: subject.color }}
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  {downloading ? "Preparando imagen…" : "Descargar imagen"}
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSavedId(save(material))}
                  disabled={!!savedId}
                  className={action}
                >
                  <Star
                    className={`w-4 h-4 ${savedId ? "fill-amber-400 text-amber-400" : ""}`}
                    aria-hidden="true"
                  />
                  {savedId ? "Guardado" : "Guardar"}
                </button>
                {["resumen", "mapa", "infografia"].includes(material.type) ? (
                  <ListenButton
                    text={materialToText(material.type, material.data)}
                    className={action}
                  />
                ) : (
                  <button type="button" onClick={copy} className={action}>
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                )}
                <button type="button" onClick={makeCards} className={action}>
                  <Layers className="w-4 h-4" aria-hidden="true" /> Hacer
                  EduCards
                </button>
                <button
                  type="button"
                  onClick={() => setMaterial(null)}
                  className={action}
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" /> Limpiar
                </button>
              </div>
            </article>
          )}
        </div>

        {saved.length > 0 && (
          <div
            className={`rounded-2xl border ${dm ? "border-[#334155]" : "border-[#E2E8F0]"}`}
          >
            <button
              type="button"
              onClick={() => setShowSaved((v) => !v)}
              aria-expanded={showSaved}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold ${text}`}
            >
              <span>⭐ Mis materiales guardados ({saved.length})</span>
              <ChevronDown
                className={`w-4 h-4 opacity-50 transition-transform ${showSaved ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {showSaved && (
              <ul className="px-2 pb-2 space-y-1">
                {saved.map((m) => (
                  <li key={m.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMaterial(m);
                        setSavedId(m.id);
                        setShowSaved(false);
                      }}
                      className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-xl hover:bg-black/5 ${text}`}
                    >
                      <span className="block text-sm font-semibold truncate">
                        {typeMeta(m.type)?.emoji} {m.topic}
                      </span>
                      <span className={`block text-[11px] ${sub}`}>
                        {m.subjectLabel} ·{" "}
                        {new Date(m.savedAt).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(m.id)}
                      aria-label={`Borrar ${m.topic}`}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    );
  },
);

ContentGenerator.displayName = "ContentGenerator";
export default ContentGenerator;
