import { memo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { useMediaQuery } from "../useMediaQuery";
import { useIngenIAKidsSafe } from "../../../../context/IngenIAKidsContext";
import { MindMapImage } from "./MindMapImage";
import { InfographicImage } from "./InfographicImage";
import { THEMES, THEME_LIST, downloadSvgAsPng } from "./imageKit";

const THEME_KEY = "practicar_image_theme";
const KIND = { mapa: "mapa mental", infografia: "infografía" };

function readTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return THEMES[t] ? t : "colorido";
  } catch {
    return "colorido";
  }
}

// The ideas a kid can ask Dani about, one per branch / block / side.
export function daniTopics(type, data) {
  if (type === "mapa")
    return data.ramas.map((r) => ({
      label: r.idea,
      emoji: r.emoji,
      detail: r.detalles,
    }));
  if (data.formato === "comparacion" && data.comparacion)
    return [data.comparacion.izquierda, data.comparacion.derecha].map((s) => ({
      label: s.titulo,
      emoji: s.emoji,
      detail: s.puntos,
    }));
  return data.bloques.map((b) => ({
    label: b.titulo,
    emoji: b.emoji,
    detail: [b.texto],
  }));
}

const fileNameFor = (type, title) =>
  `${KIND[type]}-${title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const ImagePanel = memo(({ material, title, color, dm }) => {
  const [themeId, setThemeId] = useState(readTheme);
  const [downloading, setDownloading] = useState(false);
  const imageRef = useRef(null);
  // Phones get the vertical layout so text stays readable at ~300 px wide.
  const narrow = useMediaQuery("(max-width: 639px)");
  const kids = useIngenIAKidsSafe();
  const { type, data } = material;

  const pickTheme = (id) => {
    setThemeId(id);
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      // storage blocked: the choice just won't be remembered
    }
  };

  const download = async () => {
    if (!imageRef.current) return;
    setDownloading(true);
    try {
      await downloadSvgAsPng(imageRef.current, fileNameFor(type, title));
    } finally {
      setDownloading(false);
    }
  };

  const askDani = ({ label, detail }) => {
    const kind = KIND[type];
    const key = detail.filter(Boolean).join("; ");
    kids?.setDocumentForDani?.({
      title: `${label} · ${title}`,
      subject: material.subjectLabel,
      summary: `El estudiante creó un ${kind} sobre "${title}" y quiere entender mejor "${label}". Lo que dice el ${kind}: ${key}.`,
      tutoringQuestions: [`¿Qué parte de "${label}" quieres que te explique?`],
      welcome: `🧠 Hablemos de "${label}", de tu ${kind} sobre "${title}". Lo clave: ${key}. ¿Qué parte quieres que te explique con un ejemplo?`,
    });
    window.dispatchEvent(new CustomEvent("smartboard:open-dani"));
  };

  const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";
  const idle = dm
    ? "bg-[#0F172A] border-[#334155] text-white"
    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B]";

  return (
    <div className="space-y-3">
      <div
        role="radiogroup"
        aria-label="Estilo de la imagen"
        className="grid grid-cols-3 gap-2"
      >
        {THEME_LIST.map((t) => {
          const sel = themeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => pickTheme(t.id)}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl border-2 text-xs font-bold ${sel ? "text-white border-transparent" : idle}`}
              style={sel ? { background: color } : {}}
            >
              <span aria-hidden="true">{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden border border-black/5">
        {type === "mapa" ? (
          <MindMapImage
            ref={imageRef}
            data={data}
            color={color}
            themeId={themeId}
            layout={narrow ? "tree" : "radial"}
          />
        ) : (
          <InfographicImage
            ref={imageRef}
            data={data}
            color={color}
            themeId={themeId}
          />
        )}
      </div>

      <button
        type="button"
        disabled={downloading}
        onClick={download}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white disabled:opacity-60"
        style={{ background: color }}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        {downloading ? "Preparando imagen…" : "Descargar imagen"}
      </button>

      {kids?.setDocumentForDani && (
        <div className="space-y-2">
          <p className={`text-xs font-black uppercase tracking-wide ${sub}`}>
            🤔 ¿Dudas? Pregúntale a Dani
          </p>
          <div className="flex flex-wrap gap-2">
            {daniTopics(type, data).map((tp) => (
              <button
                key={tp.label}
                type="button"
                onClick={() => askDani(tp)}
                className={`min-h-[40px] max-w-full inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold text-left ${idle}`}
              >
                <span aria-hidden="true">{tp.emoji}</span>
                <span className="break-words min-w-0">{tp.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ImagePanel.displayName = "ImagePanel";
export default ImagePanel;
