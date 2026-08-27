import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useSkillPassport } from "../../hooks/useSkillPassport";

const AREAS = [
  {
    id: "ciencias-salud",
    emoji: "🔬",
    title: "Ciencias & Salud",
    description:
      "Medicina, biología, investigación científica y cuidado humano.",
    competencies: ["ciencias_naturales"],
    color: "#34D399",
    missions: ["exploration_podcast"],
  },
  {
    id: "tecnologia-ia",
    emoji: "🤖",
    title: "Tecnología & IA",
    description:
      "Programación, inteligencia artificial, robótica y diseño digital.",
    competencies: ["tecnologia"],
    color: "#60A5FA",
    missions: ["exploration_podcast"],
  },
  {
    id: "arte-diseno",
    emoji: "🎨",
    title: "Arte & Diseño",
    description:
      "Diseño gráfico, arquitectura, música, cine y expresión creativa.",
    competencies: [],
    color: "#F472B6",
    missions: ["exploration_podcast"],
  },
  {
    id: "negocios-liderazgo",
    emoji: "📈",
    title: "Negocios & Liderazgo",
    description:
      "Emprendimiento, economía, administración y gestión de equipos.",
    competencies: ["ciencias_sociales"],
    color: "#FBBF24",
    missions: ["exploration_podcast"],
  },
  {
    id: "humanidades-derecho",
    emoji: "⚖️",
    title: "Humanidades & Derecho",
    description:
      "Filosofía, historia, derecho, comunicación y ciencias sociales.",
    competencies: ["lenguaje", "ciencias_sociales"],
    color: "#A78BFA",
    missions: ["exploration_podcast"],
  },
  {
    id: "idiomas-culturas",
    emoji: "🌍",
    title: "Idiomas & Culturas",
    description:
      "Lenguas extranjeras, relaciones internacionales y diplomacia.",
    competencies: ["ingles"],
    color: "#FB923C",
    missions: ["exploration_podcast"],
  },
  {
    id: "matematicas-ingenieria",
    emoji: "⚙️",
    title: "Matemáticas & Ingeniería",
    description:
      "Física, ingeniería civil, electrónica y pensamiento lógico-matemático.",
    competencies: ["matematicas"],
    color: "#4DA8C4",
    missions: ["exploration_podcast"],
  },
];

function getAreaScore(area, passport) {
  if (!area.competencies.length || !passport.length) return 0;
  const relevant = passport.filter((p) =>
    area.competencies.includes(p.subject),
  );
  if (!relevant.length) return 0;
  return relevant.reduce((sum, p) => sum + p.mastery, 0) / relevant.length;
}

const AreaCard = memo(({ area, score, isTop, onClick }) => (
  <motion.button
    onClick={() => onClick(area)}
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="relative w-full text-left rounded-2xl border p-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    style={{
      borderColor: isTop ? area.color : "#E2E8F0",
      backgroundColor: isTop ? area.color + "12" : "white",
    }}
    aria-label={`Explorar área: ${area.title}`}
  >
    {isTop && (
      <span
        className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
        style={{ backgroundColor: area.color }}
      >
        Tu fortaleza
      </span>
    )}
    <span className="text-3xl block mb-2">{area.emoji}</span>
    <p className="text-sm font-bold text-[#004B63] mb-1">{area.title}</p>
    <p className="text-[11px] text-[#64748B] leading-relaxed">
      {area.description}
    </p>
    {score > 0 && (
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.round(score * 100)}%`,
              backgroundColor: area.color,
            }}
          />
        </div>
        <span className="text-[10px] font-bold" style={{ color: area.color }}>
          {Math.round(score * 100)}%
        </span>
      </div>
    )}
  </motion.button>
));
AreaCard.displayName = "AreaCard";

const AreaDetail = memo(({ area, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed inset-x-4 bottom-4 z-50 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl p-5 max-w-sm mx-auto"
    role="dialog"
    aria-modal="true"
    aria-label={`Detalles: ${area.title}`}
  >
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-[#94A3B8] hover:text-[#004B63] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F5F9]"
      aria-label="Cerrar"
    >
      ✕
    </button>
    <span className="text-4xl block mb-3">{area.emoji}</span>
    <h3 className="text-base font-black text-[#004B63] mb-1">{area.title}</h3>
    <p className="text-sm text-[#64748B] mb-4">{area.description}</p>
    <p className="text-xs text-[#94A3B8] italic">
      Podrías explorar este camino. Tu perfil muestra afinidad con esta área —
      sigue practicando para descubrir tu potencial.
    </p>
  </motion.div>
));
AreaDetail.displayName = "AreaDetail";

const FutureExplorer = memo(() => {
  const { studentAge, supabaseQueries } = useSmartBoardKids();
  const studentDbId = supabaseQueries?.studentData?.data?.id ?? null;
  const { passport } = useSkillPassport();
  const [selected, setSelected] = useState(null);

  const handleClose = useCallback(() => setSelected(null), []);

  // Only show for age >= 10
  if (!studentAge || studentAge < 10) return null;

  const areasWithScore = AREAS.map((area) => ({
    ...area,
    score: getAreaScore(area, passport),
  })).sort((a, b) => b.score - a.score);

  const topSubject = areasWithScore[0]?.score > 0 ? areasWithScore[0].id : null;

  return (
    <section aria-labelledby="future-explorer-heading" className="space-y-4">
      <div>
        <h2
          id="future-explorer-heading"
          className="text-base font-black text-[#004B63]"
        >
          🚀 Explorador de Futuros
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Descubre áreas del conocimiento que podrían ser tu camino. Podrías
          explorar cualquiera de estas…
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {areasWithScore.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            score={area.score}
            isTop={area.id === topSubject}
            onClick={setSelected}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={handleClose}
              aria-hidden="true"
            />
            <AreaDetail area={selected} onClose={handleClose} />
          </>
        )}
      </AnimatePresence>
    </section>
  );
});

FutureExplorer.displayName = "FutureExplorer";
export default FutureExplorer;
