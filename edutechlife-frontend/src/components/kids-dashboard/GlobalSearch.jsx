import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const MOCK_SEARCH_DATA = {
  materias: [
    { id: 1, name: "Matemáticas", icon: "🔢", category: "materias" },
    { id: 2, name: "Lenguaje", icon: "📖", category: "materias" },
    { id: 3, name: "Ciencias Naturales", icon: "🔬", category: "materias" },
    { id: 4, name: "Ciencias Sociales", icon: "🌍", category: "materias" },
    { id: 5, name: "Inglés", icon: "🗣️", category: "materias" },
  ],
  misiones: [
    {
      id: 1,
      name: "Misión: Álgebra Avanzada",
      icon: "🎯",
      category: "misiones",
    },
    {
      id: 2,
      name: "Misión: Comprensión Lectora",
      icon: "📚",
      category: "misiones",
    },
    { id: 3, name: "Misión: Ecosistemas", icon: "🌿", category: "misiones" },
  ],
  recursos: [
    {
      id: 1,
      name: "PDF: Guía de Fracciones",
      icon: "📄",
      category: "recursos",
    },
    { id: 2, name: "Video: Ciclo del Agua", icon: "🎬", category: "recursos" },
    {
      id: 3,
      name: "Artículo: Historia de Colombia",
      icon: "📰",
      category: "recursos",
    },
  ],
  conversaciones: [
    {
      id: 1,
      name: "Charla con Dani sobre Fotosíntesis",
      icon: "💬",
      category: "conversaciones",
    },
    {
      id: 2,
      name: "Debate: Impacto Ambiental",
      icon: "🗨️",
      category: "conversaciones",
    },
  ],
  logros: [
    {
      id: 1,
      name: "Medalla: Matemático Brillante",
      icon: "🏅",
      category: "logros",
    },
    {
      id: 2,
      name: "Certificado: 30 Días Consecutivos",
      icon: "📜",
      category: "logros",
    },
    { id: 3, name: "Insignia: Lector Voraz", icon: "⭐", category: "logros" },
  ],
};

const categoryLabels = {
  materias: "Materias",
  misiones: "Misiones",
  recursos: "Recursos",
  conversaciones: "Conversaciones",
  logros: "Logros",
};

const categoryEmojis = {
  materias: "📚",
  misiones: "🎯",
  recursos: "📁",
  conversaciones: "💬",
  logros: "🏆",
};

const GlobalSearch = () => {
  const { darkMode } = useSmartBoardKids();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Flatten and filter search results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results = {};

    Object.entries(MOCK_SEARCH_DATA).forEach(([category, items]) => {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(query),
      );
      if (filtered.length > 0) {
        results[category] = filtered;
      }
    });

    return results;
  }, [searchQuery]);

  // Flatten for navigation
  const flatResults = useMemo(() => {
    return Object.values(filteredResults).flat();
  }, [filteredResults]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen) {
          setTimeout(() => searchInputRef.current?.focus(), 50);
        }
      }

      // Only handle these if search is open
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && flatResults[selectedIndex]) {
            handleSelectResult(flatResults[selectedIndex]);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, flatResults]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsContainerRef.current) {
      const selected = resultsContainerRef.current.children[selectedIndex];
      if (selected) {
        selected.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelectResult = useCallback((result) => {
    // TODO: Route to appropriate page based on category
    console.log("Selected:", result);
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  }, []);

  return (
    <>
      {/* Search Button Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => searchInputRef.current?.focus(), 50);
        }}
        className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
          darkMode
            ? "bg-[#1E293B] border-[#334155] hover:border-[#4DA8C4]"
            : "bg-white border-[#E2E8F0] hover:border-[#4DA8C4]"
        }`}
        title="Presiona Cmd+K o Ctrl+K"
      >
        <Search className="w-4 h-4 text-[#4DA8C4]" />
        <span
          className={`text-sm ${darkMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}
        >
          {t("kid.search.placeholder") || "Buscar..."}
        </span>
        <kbd
          className={`ml-auto text-xs px-2 py-1 rounded ${
            darkMode
              ? "bg-[#0F172A] text-[#94A3B8]"
              : "bg-[#F1F5F9] text-[#64748B]"
          }`}
        >
          ⌘K
        </kbd>
      </motion.button>

      {/* Mobile Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => searchInputRef.current?.focus(), 50);
        }}
        className="md:hidden p-2.5 rounded-lg hover:bg-[#4DA8C4]/10"
      >
        <Search className="w-5 h-5 text-[#4DA8C4]" />
      </motion.button>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
                darkMode ? "bg-[#0F172A]" : "bg-white"
              }`}
            >
              {/* Search Input */}
              <div
                className={`flex items-center gap-3 px-6 py-4 border-b ${
                  darkMode
                    ? "border-[#334155] bg-[#1E293B]"
                    : "border-[#E2E8F0]"
                }`}
              >
                <Search className="w-5 h-5 text-[#4DA8C4]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  placeholder={
                    t("kid.search.placeholder") ||
                    "Busca materias, misiones, recursos..."
                  }
                  className={`flex-1 bg-transparent outline-none text-lg ${
                    darkMode
                      ? "text-white placeholder-[#64748B]"
                      : "text-[#004B63] placeholder-[#94A3B8]"
                  }`}
                  autoFocus
                />
                {searchQuery && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedIndex(-1);
                    }}
                    className="p-1 hover:bg-[#4DA8C4]/20 rounded-lg"
                  >
                    <X className="w-5 h-5 text-[#64748B]" />
                  </motion.button>
                )}
              </div>

              {/* Results */}
              {searchQuery.trim() ? (
                <div
                  ref={resultsContainerRef}
                  className={`max-h-[60vh] overflow-y-auto ${
                    darkMode ? "bg-[#0F172A]" : "bg-white"
                  }`}
                >
                  {flatResults.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {Object.entries(filteredResults).map(
                        ([category, items]) => (
                          <div key={category}>
                            <p
                              className={`text-xs font-semibold mb-2 uppercase tracking-wider ${
                                darkMode ? "text-[#4DA8C4]" : "text-[#004B63]"
                              }`}
                            >
                              {categoryEmojis[category]}{" "}
                              {categoryLabels[category]}
                            </p>
                            <div className="space-y-2 pl-4">
                              {items.map((item) => {
                                const isSelected =
                                  flatResults[selectedIndex]?.id === item.id &&
                                  flatResults[selectedIndex]?.category ===
                                    item.category;
                                return (
                                  <motion.button
                                    key={`${item.category}-${item.id}`}
                                    whileHover={{ x: 4 }}
                                    onClick={() => handleSelectResult(item)}
                                    onMouseEnter={() => {
                                      const index = flatResults.findIndex(
                                        (r) =>
                                          r.id === item.id &&
                                          r.category === item.category,
                                      );
                                      setSelectedIndex(index);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                                      isSelected
                                        ? darkMode
                                          ? "bg-[#4DA8C4]/20 text-white"
                                          : "bg-[#4DA8C4]/10 text-[#004B63]"
                                        : darkMode
                                          ? "text-[#CBD5E1] hover:bg-[#334155]"
                                          : "text-[#475569] hover:bg-[#F1F5F9]"
                                    }`}
                                  >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">
                                      {item.name}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center py-16 px-6 ${
                        darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                      }`}
                    >
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-center">
                        {t("kid.search.no_results") ||
                          "No se encontraron resultados"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`p-8 text-center ${
                    darkMode ? "bg-[#0F172A]" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-sm mb-4 ${
                      darkMode ? "text-[#94A3B8]" : "text-[#64748B]"
                    }`}
                  >
                    {t("kid.search.quick_tips") || "Escribe para buscar en:"}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                          darkMode
                            ? "bg-[#1E293B] text-[#CBD5E1]"
                            : "bg-[#F8FAFC] text-[#475569]"
                        }`}
                      >
                        <span className="text-lg">{categoryEmojis[key]}</span>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p
                    className={`text-xs mt-4 ${
                      darkMode ? "text-[#64748B]" : "text-[#94A3B8]"
                    }`}
                  >
                    Presiona ESC para cerrar
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

GlobalSearch.displayName = "GlobalSearch";
export default GlobalSearch;
