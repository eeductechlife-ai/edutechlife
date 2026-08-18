import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, FileText, ExternalLink } from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const MOCK_RESOURCES = {
  books: [
    {
      id: 1,
      title: "Guía de Fracciones",
      subject: "Matemáticas",
      grade: "5-6",
      url: "#",
      icon: "📐",
    },
    {
      id: 2,
      title: "Álgebra para Principiantes",
      subject: "Matemáticas",
      grade: "7-8",
      url: "#",
      icon: "🔢",
    },
    {
      id: 3,
      title: "La Literatura Latinoamericana",
      subject: "Lenguaje",
      grade: "9-11",
      url: "#",
      icon: "📖",
    },
    {
      id: 4,
      title: "Comprensión Lectora Avanzada",
      subject: "Lenguaje",
      grade: "6-8",
      url: "#",
      icon: "📚",
    },
    {
      id: 5,
      title: "Ecosistemas y Biodiversidad",
      subject: "Ciencias Naturales",
      grade: "5-7",
      url: "#",
      icon: "🌿",
    },
    {
      id: 6,
      title: "Química Orgánica Básica",
      subject: "Ciencias Naturales",
      grade: "10-11",
      url: "#",
      icon: "⚗️",
    },
  ],
  videos: [
    {
      id: 1,
      title: "¿Cómo funciona el Machine Learning?",
      subject: "Tecnología/IA",
      duration: "12:45",
      youtubeId: "dQw4w9WgXcQ",
      icon: "🤖",
    },
    {
      id: 2,
      title: "Introducción a los Algoritmos",
      subject: "Tecnología",
      duration: "8:30",
      youtubeId: "dQw4w9WgXcQ",
      icon: "⚙️",
    },
    {
      id: 3,
      title: "El Ciclo del Agua Explicado",
      subject: "Ciencias Naturales",
      duration: "6:15",
      youtubeId: "dQw4w9WgXcQ",
      icon: "💧",
    },
    {
      id: 4,
      title: "Revolución Industrial: Contexto Histórico",
      subject: "Ciencias Sociales",
      duration: "14:20",
      youtubeId: "dQw4w9WgXcQ",
      icon: "🏭",
    },
    {
      id: 5,
      title: "English Grammar Essentials",
      subject: "Inglés",
      duration: "9:10",
      youtubeId: "dQw4w9WgXcQ",
      icon: "🗣️",
    },
    {
      id: 6,
      title: "Fracciones y Números Decimales",
      subject: "Matemáticas",
      duration: "11:50",
      youtubeId: "dQw4w9WgXcQ",
      icon: "📊",
    },
  ],
  articles: [
    {
      id: 1,
      title: "La IA en la Educación: Transformando Aulas",
      source: "Medium",
      category: "Tecnología",
      url: "https://medium.com",
      icon: "💡",
    },
    {
      id: 2,
      title: "Por Qué el Aprendizaje Activo Funciona Mejor",
      source: "Substack",
      category: "Educación",
      url: "https://substack.com",
      icon: "🧠",
    },
    {
      id: 3,
      title: "Deep Learning: Redes Neuronales Explicadas",
      source: "Medium",
      category: "Tecnología",
      url: "https://medium.com",
      icon: "🧬",
    },
    {
      id: 4,
      title: "Gamificación en Educación: Estrategias Probadas",
      source: "Substack",
      category: "Educación",
      url: "https://substack.com",
      icon: "🎮",
    },
    {
      id: 5,
      title: "Inclusión Digital en Escuelas Rurales",
      source: "Medium",
      category: "Sociedad",
      url: "https://medium.com",
      icon: "📱",
    },
    {
      id: 6,
      title: "Tendencias en EdTech para 2024",
      source: "Substack",
      category: "Tecnología",
      url: "https://substack.com",
      icon: "🚀",
    },
  ],
};

const dc = (dm, l, d) => (dm ? d : l);

const ResourceCenter = memo(() => {
  const { darkMode } = useSmartBoardKids();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("books");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = useMemo(() => {
    const allSubjects = new Set();
    MOCK_RESOURCES.books.forEach((b) => allSubjects.add(b.subject));
    MOCK_RESOURCES.videos.forEach((v) => allSubjects.add(v.subject));
    return Array.from(allSubjects).sort();
  }, []);

  const filteredResources = useMemo(() => {
    let resources = MOCK_RESOURCES[activeTab];
    if (selectedSubject && (activeTab === "books" || activeTab === "videos")) {
      resources = resources.filter((r) => r.subject === selectedSubject);
    }
    return resources;
  }, [activeTab, selectedSubject]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md bg-gradient-to-br from-[#FFD166] to-[#FF8E53]">
          📚
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${dc(darkMode, "text-[#004B63]", "text-[#E2F0FF]")}`}
          >
            {t("kid.resources.title") || "Centro de Recursos"}
          </h3>
          <p
            className={`text-xs ${dc(darkMode, "text-[#64748B]", "text-[#94A3B8]")}`}
          >
            {t("kid.resources.subtitle") ||
              "Libros, videos y artículos para aprender"}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "books", label: "Libros", icon: "📖" },
          { id: "videos", label: "Videos", icon: "🎬" },
          { id: "articles", label: "Artículos", icon: "📰" },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedSubject(null);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-white shadow-md bg-gradient-to-r from-[#FFD166] to-[#FF8E53]"
                : dc(
                    darkMode,
                    "bg-white border border-[#E2E8F0] text-[#64748B]",
                    "bg-[#1E293B] border border-[#334155] text-[#94A3B8]",
                  )
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Subject Filter (Books & Videos) */}
      {(activeTab === "books" || activeTab === "videos") && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedSubject(null)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              selectedSubject === null
                ? "bg-[#4DA8C4] text-white"
                : dc(
                    darkMode,
                    "bg-white border border-[#E2E8F0] text-[#64748B]",
                    "bg-[#1E293B] border border-[#334155] text-[#94A3B8]",
                  )
            }`}
          >
            Todos
          </motion.button>
          {subjects.map((subject) => (
            <motion.button
              key={subject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                selectedSubject === subject
                  ? "bg-[#4DA8C4] text-white"
                  : dc(
                      darkMode,
                      "bg-white border border-[#E2E8F0] text-[#64748B]",
                      "bg-[#1E293B] border border-[#334155] text-[#94A3B8]",
                    )
              }`}
            >
              {subject}
            </motion.button>
          ))}
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource, idx) => (
            <motion.a
              key={`${activeTab}-${resource.id}`}
              href={resource.url}
              target={resource.url !== "#" ? "_blank" : undefined}
              rel={resource.url !== "#" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className={`group relative rounded-2xl border overflow-hidden transition-all cursor-pointer ${dc(
                darkMode,
                "bg-[#1E293B] border-[#334155] hover:border-[#4DA8C4] hover:shadow-lg",
                "bg-white border-[#E2E8F0] hover:border-[#FFD166] hover:shadow-lg",
              )}`}
            >
              {/* Content */}
              <div className="p-5 h-full flex flex-col">
                <div className="text-4xl mb-3">{resource.icon}</div>

                {/* Title */}
                <h4
                  className={`font-bold line-clamp-2 mb-2 ${dc(darkMode, "text-white", "text-[#004B63]")}`}
                >
                  {resource.title}
                </h4>

                {/* Meta Info */}
                <div
                  className={`text-xs mb-4 flex-grow ${dc(darkMode, "text-[#94A3B8]", "text-[#64748B]")}`}
                >
                  {activeTab === "books" && (
                    <>
                      <p>{resource.subject}</p>
                      <p>
                        {t("kid.resources.grade") || "Grado"}: {resource.grade}
                      </p>
                    </>
                  )}
                  {activeTab === "videos" && (
                    <>
                      <p>{resource.subject}</p>
                      <p>{resource.duration}</p>
                    </>
                  )}
                  {activeTab === "articles" && (
                    <>
                      <p>{resource.source}</p>
                      <p className="text-[#4DA8C4] font-semibold">
                        {resource.category}
                      </p>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`flex items-center gap-2 pt-3 border-t ${dc(
                    darkMode,
                    "border-[#334155] text-[#4DA8C4]",
                    "border-[#E2E8F0] text-[#FFD166]",
                  )}`}
                >
                  {activeTab === "books" && (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {t("kid.resources.open") || "Abrir"}
                      </span>
                    </>
                  )}
                  {activeTab === "videos" && (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {t("kid.resources.watch") || "Ver"}
                      </span>
                    </>
                  )}
                  {activeTab === "articles" && (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {t("kid.resources.read") || "Leer"}
                      </span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Gradient Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-[#4DA8C4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex flex-col items-center justify-center py-12 px-6 rounded-2xl ${dc(
            darkMode,
            "bg-[#1E293B] text-[#64748B]",
            "bg-[#F8FAFC] text-[#94A3B8]",
          )}`}
        >
          <div className="text-4xl mb-4">📭</div>
          <p className="font-semibold">
            {t("kid.resources.no_results") || "No hay recursos disponibles"}
          </p>
        </motion.div>
      )}
    </div>
  );
});

ResourceCenter.displayName = "ResourceCenter";
export default ResourceCenter;
