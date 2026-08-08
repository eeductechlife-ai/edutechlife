import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import curriculoData from "../../data/curriculo_col.json";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const dc = (dm, l, d) => (dm ? d : l);

const gradeMeta = [
  { grado: 1, label: "1°", color: "#22C55E" },
  { grado: 2, label: "2°", color: "#14B8A6" },
  { grado: 3, label: "3°", color: "#06B6D4" },
  { grado: 4, label: "4°", color: "#3B82F6" },
  { grado: 5, label: "5°", color: "#8B5CF6" },
  { grado: 6, label: "6°", color: "#4DA8C4" },
  { grado: 7, label: "7°", color: "#66CCCC" },
  { grado: 8, label: "8°", color: "#FFD166" },
  { grado: 9, label: "9°", color: "#FF6B9D" },
  { grado: 10, label: "10°", color: "#A855F7" },
  { grado: 11, label: "11°", color: "#F59E0B" },
];

const CurriculumView = memo(() => {
  const { darkMode: dm } = useSmartBoardKids();
  const { t } = useTranslation();
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedMateria, setSelectedMateria] = useState(null);

  const gradeData = useMemo(() => {
    const g = curriculoData.grades.find((g) => g.grado === selectedGrade);
    if (!g) return null;
    const meta = gradeMeta.find((m) => m.grado === selectedGrade);
    return { ...g, color: meta?.color || "#4DA8C4" };
  }, [selectedGrade]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC]`}
        >
          📋
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
          >
            {t("kid.curriculum.title")}
          </h3>
          <p
            className={`text-xs ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
          >
            {t("kid.curriculum.subtitle")}
          </p>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {gradeMeta.map((g) => (
          <motion.button
            key={g.grado}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedGrade(g.grado);
              setSelectedMateria(null);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              selectedGrade === g.grado
                ? "text-white shadow-md"
                : dc(
                    dm,
                    "bg-white border border-[#E2E8F0] text-[#64748B]",
                    "bg-[#1E293B] border border-[#334155] text-[#94A3B8]",
                  )
            }`}
            style={
              selectedGrade === g.grado
                ? {
                    background: `linear-gradient(135deg, ${g.color}, ${g.color}dd)`,
                  }
                : {}
            }
          >
            {g.label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gradeData?.materias?.map((mat, idx) => (
          <motion.div
            key={mat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() =>
              setSelectedMateria(selectedMateria?.id === mat.id ? null : mat)
            }
            className={`rounded-2xl border overflow-hidden cursor-pointer transition-all ${
              selectedMateria?.id === mat.id
                ? "ring-2 ring-[#4DA8C4] shadow-lg"
                : ""
            } ${dc(dm, "bg-[#1E293B] border-[#334155]", "bg-white border-[#E2E8F0] shadow-sm hover:shadow-md")}`}
          >
            <div
              className="p-4 flex items-center gap-3 border-b"
              style={{ borderColor: dm ? "#334155" : "#E2E8F0" }}
            >
              <span className="text-2xl">{mat.icon}</span>
              <div>
                <h4
                  className={`font-bold ${dc(dm, "text-white", "text-[#004B63]")}`}
                >
                  {mat.nombre}
                </h4>
                <p
                  className={`text-xs ${dc(dm, "text-[#94A3B8]", "text-[#64748B]")}`}
                >
                  {t("kid.curriculum.competencias_count", {
                    count: mat.competencias?.length,
                    dba: mat.dba?.length,
                  })}
                </p>
              </div>
            </div>
            <AnimatePresence>
              {selectedMateria?.id === mat.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <p
                        className={`text-xs font-semibold mb-2 uppercase tracking-wider ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
                      >
                        {t("kid.curriculum.competencias")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {mat.competencias.map((c, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-1 rounded-full ${dc(dm, "bg-[#334155] text-[#CBD5E1]", "bg-[#F1F5F9] text-[#475569]")}`}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold mb-2 uppercase tracking-wider ${dc(dm, "text-[#4DA8C4]", "text-[#004B63]")}`}
                      >
                        DBA
                      </p>
                      <div className="space-y-1">
                        {mat.dba.map((dba, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`p-2 rounded-lg text-xs flex items-start gap-2 ${dc(dm, "bg-[#0F172A]", "bg-[#F8FAFC]")}`}
                          >
                            <span className="text-[#4DA8C4] font-bold mt-0.5">
                              ◆
                            </span>
                            <span
                              className={dc(
                                dm,
                                "text-[#CBD5E1]",
                                "text-[#475569]",
                              )}
                            >
                              {dba}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

CurriculumView.displayName = "CurriculumView";
export { CurriculumView };
export default CurriculumView;
