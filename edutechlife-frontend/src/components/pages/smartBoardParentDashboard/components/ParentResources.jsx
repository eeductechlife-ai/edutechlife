import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Headphones, BookOpen, Wrench, Lightbulb } from "lucide-react";

const PODCASTS = [
  {
    title: "Padres en la era digital",
    desc: "Consejos prácticos para acompañar a tus hijos en el mundo digital con confianza.",
    tags: ["10-15 min", "Semanal"],
  },
  {
    title: "Educar con sentido",
    desc: "Neurociencia aplicada a la crianza moderna: cómo aprende el cerebro de tu hijo.",
    tags: ["20 min", "Quincenal"],
  },
  {
    title: "Familia y tecnología",
    desc: "Hábitos saludables con pantallas, límites con amor y comunicación digital en familia.",
    tags: ["15 min", "Semanal"],
  },
];

const BOOKS = [
  { title: "Mis hijos y las pantallas", author: "Juan Cruz Ripoll", desc: "Estrategias probadas para padres modernos en Latinoamérica.", emoji: "👨‍👩‍👧" },
  { title: "El niño en la era digital", author: "Yalda Uhls", desc: "Cómo navegar la tecnología junto a tus hijos con confianza.", emoji: "🧒" },
  { title: "Criar sin miedo digital", author: "Victoria Dunckley", desc: "Bienestar emocional y tiempo de pantalla en equilibrio.", emoji: "📱" },
];

const TOOLS = [
  { name: "Google Family Link", desc: "Control parental: tiempo, ubicación y apps autorizadas.", emoji: "🔒", free: true },
  { name: "Khan Academy Kids", desc: "Aprendizaje gratuito y adaptado por edad, sin anuncios.", emoji: "🎓", free: true },
  { name: "Common Sense Media", desc: "Reseñas de apps, juegos y contenido seguro para niños.", emoji: "⭐", free: true },
  { name: "Qustodio", desc: "Monitoreo avanzado de actividad digital en todos los dispositivos.", emoji: "🛡️", free: false },
];

const VAK_TIPS = {
  visual: {
    icon: "👁️",
    title: "Tu hijo/a aprende de forma visual",
    tips: [
      "Usa mapas mentales y diagramas para explicar temas nuevos juntos.",
      "Comparte videos educativos cortos antes de dormir (5-10 min).",
      "Crea listas de tareas coloridas con pictogramas en casa.",
    ],
  },
  auditivo: {
    icon: "👂",
    title: "Tu hijo/a aprende escuchando",
    tips: [
      "Explícale los temas en voz alta mientras están juntos en el carro.",
      "Prueba audiolibros o podcasts educativos cortos antes de estudiar.",
      "Habla de lo que aprendió hoy durante la cena — sin presión.",
    ],
  },
  kinestesico: {
    icon: "✋",
    title: "Tu hijo/a aprende haciendo",
    tips: [
      "Propón proyectos manuales relacionados con lo que está estudiando.",
      "Los juegos de mesa educativos refuerzan lo que aprende en SmartBoard.",
      "Visitas a museos, ferias de ciencia o talleres potencian su aprendizaje.",
    ],
  },
};

const Card = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl p-5 border border-[#E2E8F0] ${className}`}>
    {children}
  </motion.div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-[#4DA8C4]" />
    <h3 className="font-bold text-[#004B63]">{title}</h3>
  </div>
);

const ParentResources = ({ vakStyle, parentFirstName }) => {
  const tip = VAK_TIPS[vakStyle?.toLowerCase()] || null;

  return (
    <div className="space-y-5">

      {/* Personalized VAK tip — lo más personal de toda la sección */}
      {tip ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 border border-[#4DA8C4]/25 bg-gradient-to-r from-[#004B63]/5 to-[#4DA8C4]/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{tip.icon}</span>
            <div>
              <p className="font-bold text-[#004B63] text-sm">{tip.title}</p>
              <p className="text-xs text-[#64748B]">Así puedes acompañarle mejor, {parentFirstName}</p>
            </div>
          </div>
          <ul className="space-y-2 mt-1">
            {tip.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#334155]">
                <span className="text-[#4DA8C4] font-bold mt-0.5 flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <div className="rounded-xl p-4 border border-[#4DA8C4]/20 bg-[#F0F9FF] text-sm text-[#0369A1]">
          💡 Cuando tu hijo/a complete el diagnóstico VAK en SmartBoard, aquí verás consejos personalizados según su estilo de aprendizaje.
        </div>
      )}

      {/* Podcasts */}
      <Card>
        <SectionTitle icon={Headphones} title="Podcasts para padres modernos" />
        <div className="space-y-3">
          {PODCASTS.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-[#4DA8C4]/15 flex items-center justify-center text-lg flex-shrink-0">🎙️</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#004B63]">{p.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{p.desc}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {p.tags.map((tag, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 bg-[#4DA8C4]/10 text-[#4DA8C4] rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Books */}
      <Card>
        <SectionTitle icon={BookOpen} title="Lecturas recomendadas para ti" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BOOKS.map((b, i) => (
            <div key={i} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <p className="text-3xl mb-2">{b.emoji}</p>
              <p className="font-bold text-sm text-[#004B63] leading-snug">{b.title}</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">{b.author}</p>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tools */}
      <Card>
        <SectionTitle icon={Wrench} title="Herramientas para familias digitales" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOOLS.map((tool, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
              <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-[#004B63] truncate">{tool.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${tool.free ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {tool.free ? "Gratis" : "Premium"}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly insight */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#004B63] to-[#0077B6] rounded-xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-[#4DA8C4]" />
          <h3 className="font-bold">Consejo de la semana para {parentFirstName}</h3>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          Dedica 5 minutos al día a preguntarle a tu hijo/a qué aprendió hoy en SmartBoard — no como control, sino con genuina curiosidad. Eso refuerza su aprendizaje <strong className="text-white">3 veces más</strong> que cualquier premio o castigo.
        </p>
        <p className="text-[#4DA8C4] text-xs mt-3 font-semibold">
          📚 Basado en investigación de metacognición educativa · Hattie (2009)
        </p>
      </motion.div>

    </div>
  );
};

ParentResources.propTypes = {
  vakStyle: PropTypes.string,
  parentFirstName: PropTypes.string,
};

export default ParentResources;
