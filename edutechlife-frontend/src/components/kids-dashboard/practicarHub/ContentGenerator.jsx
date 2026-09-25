import { memo, useState, useCallback, useMemo, useRef, useEffect } from "react";
import PanelHeader from "./PanelHeader";
import { Loader2, Copy, Check, RotateCcw, Star, Layers } from "lucide-react";
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
import ImagePanel from "./images/ImagePanel";
import SavedMaterialsList from "./SavedMaterialsList";
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

// The model's own title is more specific than the requested topic.
const titleOf = (m) =>
  (m.type === "mapa" && m.data?.centro) ||
  (m.type === "infografia" && m.data?.titulo) ||
  m.topic;

const ContentGenerator = memo(
  ({
    subject,
    grade,
    age,
    onClose,
    onTabChange,
    darkMode: dm,
    fullScreen,
    planTask,
    onFinishPlanTask,
  }) => {
    const topics = useMemo(
      () => gradeTopics(subject.id, grade).slice(0, 4),
      [subject.id, grade],
    );
    const [pickedTopic, setPickedTopic] = useState(null);
    // A "Mi Plan" task arrives with its topic and the best material type.
    const [customTopic, setCustomTopic] = useState(planTask?.topic || "");
    const [contentType, setContentType] = useState(
      CONTENT_TYPES.some((c) => c.id === planTask?.type)
        ? planTask.type
        : "resumen",
    );
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [savedId, setSavedId] = useState(null);
    const { saved, save, remove } = useSavedMaterials();
    const resultRef = useRef(null);
    // Once there is a result the form folds into one line so the result
    // is what the kid sees, not the questions they already answered.
    const [editing, setEditing] = useState(false);
    const showForm = editing || (!material && !loading);

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
      setEditing(false);
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
          key: `${Date.now()}`,
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

    // Plan tasks start generating at once: one tap from the plan to learning.
    const autoStarted = useRef(false);
    useEffect(() => {
      if (!planTask || autoStarted.current) return;
      autoStarted.current = true;
      generate();
    }, [planTask, generate]);

    const copy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(
          `${titleOf(material)}\n\n${materialToText(material.type, material.data)}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        // clipboard blocked; nothing else to do
      }
    }, [material]);

    const makeCards = () => {
      setHandoff(HANDOFF_FLASHCARDS_TOPIC, titleOf(material).slice(0, 80));
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
        className={
          fullScreen
            ? "p-4 space-y-4"
            : `rounded-2xl border p-4 sm:p-5 space-y-4 ${card}`
        }
      >
        <PanelHeader
          title={`${subject.emoji || "✨"} Crear material de ${subject.label}`}
          subtitle={`La IA lo prepara para tu ${gradeLabel}.`}
          onClose={onClose}
          fullScreen={fullScreen}
          darkMode={dm}
        />

        {planTask && (
          <p className="!m-0 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] px-3 py-2.5 text-xs text-[#9A3412]">
            📋 Tarea de tu plan:{" "}
            <span className="font-black">{planTask.topic}</span>
            <span className="block mt-0.5 text-[11px] text-[#C2410C]">
              Estúdiala aquí y, al final, toca «✅ Terminé esta actividad».
            </span>
          </p>
        )}

        {!showForm && material && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`w-full !flex items-center !justify-start gap-2 px-3 py-2.5 rounded-xl border text-left ${idle}`}
          >
            <span className="text-lg" aria-hidden="true">
              {typeMeta(material.type)?.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold truncate">
                {titleOf(material)}
              </span>
              <span className={`block text-[11px] ${sub}`}>
                {typeMeta(material.type)?.label}
              </span>
            </span>
            <span
              className="text-xs font-black shrink-0"
              style={{ color: subject.color }}
            >
              ✏️ Crear otro
            </span>
          </button>
        )}

        {showForm && (
          <>
            <div className="space-y-2">
              <p
                className={`text-xs font-black uppercase tracking-wide ${sub}`}
              >
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
                        title={tp}
                        className={`!justify-start text-left px-3 py-2 rounded-xl border-2 text-xs font-semibold leading-snug ${sel ? "text-white border-transparent" : idle}`}
                        style={sel ? { background: subject.color } : {}}
                      >
                        <span className="line-clamp-2">{tp}</span>
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
              <p
                className={`text-xs font-black uppercase tracking-wide ${sub}`}
              >
                2. ¿Qué quieres?
              </p>
              {/* Phones: compact emoji chips (3 per row); the picked one's
              description shows underneath instead of on every chip. */}
              <div className="grid grid-cols-3 gap-2">
                {CONTENT_TYPES.map((ct) => {
                  const sel = contentType === ct.id;
                  return (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() => setContentType(ct.id)}
                      aria-pressed={sel}
                      className={`!flex flex-col sm:flex-row !items-center sm:!items-start !justify-center sm:!justify-start gap-1 sm:gap-2 p-2 sm:p-3 min-h-[64px] rounded-xl border-2 text-center sm:text-left ${sel ? "text-white border-transparent" : idle}`}
                      style={sel ? { background: subject.color } : {}}
                    >
                      <span
                        className="text-xl sm:text-lg leading-none"
                        aria-hidden="true"
                      >
                        {ct.emoji}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] sm:text-xs font-bold leading-tight">
                          {ct.label}
                        </span>
                        <span
                          className={`hidden sm:block text-[11px] leading-snug mt-0.5 ${sel ? "text-white/85" : sub}`}
                        >
                          {ct.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={`sm:hidden text-[11px] ${sub}`}>
                {typeMeta(contentType)?.emoji} {typeMeta(contentType)?.desc}
              </p>
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
          </>
        )}

        <div ref={resultRef}>
          {loading && (
            <p
              role="status"
              className={`flex items-center justify-center gap-2 text-sm font-bold mb-3 ${text}`}
            >
              <Loader2
                className="w-4 h-4 animate-spin"
                style={{ color: subject.color }}
                aria-hidden="true"
              />
              {LOADING_TEXT[contentType]}
            </p>
          )}
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
                {material.type !== "mapa" && material.type !== "infografia" && (
                  <p className={`text-sm font-bold leading-snug ${text}`}>
                    {titleOf(material)}
                  </p>
                )}
              </header>

              <div className={text}>
                {material.type === "resumen" && (
                  <SummaryView data={material.data} />
                )}
                {(material.type === "mapa" ||
                  material.type === "infografia") && (
                  <ImagePanel
                    material={material}
                    title={titleOf(material)}
                    color={subject.color}
                    dm={dm}
                  />
                )}
                {material.type === "ejercicios" && (
                  <ExercisesView
                    key={material.key || material.id}
                    data={material.data}
                    color={subject.color}
                    dm={dm}
                  />
                )}
                {material.type === "video" && (
                  <VideosView data={material.data} dm={dm} />
                )}
              </div>

              {/* Closes the loop: the task gets ticked in "Mi Plan". */}
              {planTask?.planRef && onFinishPlanTask && (
                <button
                  type="button"
                  onClick={() => onFinishPlanTask(planTask.planRef)}
                  className="w-full min-h-[48px] rounded-xl text-sm font-black text-white bg-green-500 shadow-md"
                >
                  ✅ Terminé esta actividad
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

        <SavedMaterialsList
          saved={saved}
          onOpen={(m) => {
            setMaterial(m);
            setSavedId(m.id);
          }}
          onRemove={remove}
          typeMeta={typeMeta}
          titleOf={titleOf}
          dm={dm}
        />
      </section>
    );
  },
);

ContentGenerator.displayName = "ContentGenerator";
export default ContentGenerator;
