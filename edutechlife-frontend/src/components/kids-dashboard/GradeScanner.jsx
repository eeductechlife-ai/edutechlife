import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGradeScanner } from "./useGradeScanner";
import { gradeColor, gradeEmoji, getAvgScore, getSubjects } from "./gradeUtils";
import { useTranslation } from "../../i18n/I18nProvider";
import AcademicSemaphore from "./AcademicSemaphore";
import GradeRow from "./GradeRow";
import GradeAnalysisPlan from "./GradeAnalysisPlan";
import { getSubjectEmoji } from "../../config/subjectMappings";

export default memo(function GradeScanner({ onTabChange }) {
  const { t } = useTranslation();
  const {
    SUBJECTS,
    grades,
    scanning,
    saving,
    saveSuccess,
    plan,
    setPlan,
    error,
    scanMode,
    setScanMode,
    imgFile,
    setImgFile,
    imgPreview,
    setImgPreview,
    extracting,
    history,
    showHistory,
    setShowHistory,
    fileRef,
    isPdf,
    avg,
    gradeMap,
    addRow,
    updateGrade,
    removeGrade,
    handleSave,
    handleImageFile,
    analyze,
    setDocumentForDani,
  } = useGradeScanner();

  const PROGRESS_GRADIENT =
    "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)";

  return (
    <div className="space-y-5">
      {/* Header banner */}
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{ background: PROGRESS_GRADIENT }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white drop-shadow-sm">
              {t("kid.grades.title")}
            </h3>
            <p className="text-xs text-white/80">{t("kid.grades.subtitle")}</p>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translate(30%, -30%)",
          }}
        />
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-xl">
        {[
          { id: "manual", label: t("kid.grades.tab_manual") },
          { id: "image", label: t("kid.grades.tab_image") },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setScanMode(m.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              scanMode === m.id
                ? "bg-white text-[#1E293B] shadow-sm"
                : "text-[#64748B]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Image scan mode */}
      <AnimatePresence mode="wait">
        {scanMode === "image" && (
          <motion.div
            key="img-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleImageFile(e.target.files[0])
              }
            />
            {imgPreview ? (
              <div className="relative">
                {isPdf ? (
                  <div className="w-full py-5 px-4 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                    <span className="text-3xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1E293B] text-sm truncate">
                        {imgFile.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {(imgFile.size / 1024).toFixed(0)} KB · PDF
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={imgPreview}
                    alt="boletín"
                    className="w-full max-h-48 object-contain rounded-xl border border-[#E2E8F0]"
                  />
                )}
                <button
                  onClick={() => {
                    setImgFile(null);
                    setImgPreview(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-10 border-2 border-dashed border-[#FB8500]/40 rounded-2xl text-center space-y-2 hover:border-[#FB8500] transition-colors"
              >
                <span className="text-4xl block">📷</span>
                <p className="text-sm font-semibold text-[#004B63]">
                  {t("kid.grades.upload_boletin")}
                </p>
                <p className="text-xs text-[#64748B]">
                  {t("kid.grades.boletin_hint")}
                </p>
              </button>
            )}
            {extracting && (
              <div className="flex items-center gap-2 text-sm text-[#FB8500]">
                <motion.div
                  className="w-4 h-4 border-2 border-[#FB8500] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear",
                  }}
                />
                {t("kid.grades.extracting")}
              </div>
            )}
            {error && (
              <p className="text-sm text-orange-500 bg-orange-50 rounded-xl p-3">
                {error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Period legend */}
      <div className="flex items-center gap-3 px-1 text-xs text-[#94A3B8]">
        <span className="font-semibold text-[#64748B]">Períodos:</span>
        {["P1", "P2", "P3", "P4"].map((p) => (
          <span key={p} className="font-mono font-bold">
            {p}
          </span>
        ))}
        <span className="ml-auto font-semibold">
          Prom = promedio períodos ingresados
        </span>
      </div>

      {/* Academic Semaphore */}
      {Object.keys(gradeMap).length > 0 && (
        <AcademicSemaphore gradeMap={gradeMap} compact />
      )}

      {/* Manual grade entry */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#1E293B]">
            📋 {t("kid.grades.my_notes")}{" "}
            {grades.length > 0 && Number(avg) > 0 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs font-black"
                style={{
                  backgroundColor: gradeColor(Number(avg)) + "20",
                  color: gradeColor(Number(avg)),
                }}
              >
                {t("kid.grades.average", { avg })}
              </span>
            )}
          </p>
          <button
            onClick={addRow}
            className="text-xs text-[#FB8500] font-semibold hover:underline"
          >
            {t("kid.grades.add_subject")}
          </button>
        </div>
        {grades.length === 0 && (
          <div className="py-8 text-center space-y-2">
            <span className="text-4xl block">📚</span>
            <p className="text-sm text-[#64748B]">
              Agrega tus materias y escribe la nota de cada período
            </p>
            <button
              onClick={addRow}
              className="mt-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm transition-colors"
              style={{
                background:
                  "linear-gradient(135deg, #FFD166 0%, #FB8500 60%, #F3722C 100%)",
              }}
            >
              + Agregar primera materia
            </button>
          </div>
        )}
        <AnimatePresence>
          {grades.map((g) => (
            <GradeRow
              key={g.id}
              grade={g}
              subjects={SUBJECTS}
              onUpdate={updateGrade}
              onRemove={removeGrade}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Save button */}
      <motion.button
        onClick={handleSave}
        disabled={saving || grades.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-2xl font-black text-white shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
        }}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
            Guardando...
          </span>
        ) : (
          "💾 Guardar calificaciones"
        )}
      </motion.button>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold"
          >
            <span>✅</span> Calificaciones guardadas correctamente
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze button */}
      <motion.button
        onClick={analyze}
        disabled={scanning || grades.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl font-black text-white shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #FB8500 0%, #FFD166 100%)",
        }}
      >
        {scanning ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
            {t("kid.grades.analyzing")}
          </span>
        ) : (
          t("kid.grades.analyze_btn")
        )}
      </motion.button>

      {error && scanMode !== "image" && (
        <p
          className={`text-sm text-center rounded-xl p-3 ${error.startsWith("⚠️") ? "text-orange-600 bg-orange-50" : "text-red-500"}`}
        >
          {error}
        </p>
      )}

      {/* History */}
      {history.length > 0 && !plan && (
        <div className="border border-[#E2E8F0] rounded-2xl overflow-visible">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
          >
            <span>📚 Historial de análisis ({history.length})</span>
            <span className="text-[#64748B]">{showHistory ? "▲" : "▼"}</span>
          </button>
          {showHistory && (
            <div className="divide-y divide-[#F1F5F9]">
              {history.map((h) => (
                <div key={h.id} className="px-4 py-3 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">
                      {new Date(h.created_at).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: gradeColor(Number(h.avg_score)) + "20",
                        color: gradeColor(Number(h.avg_score)),
                      }}
                    >
                      {gradeEmoji(Number(h.avg_score))} {h.avg_score}/5
                    </span>
                  </div>
                  {h.grades?.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 pt-1">
                      {h.grades.map((g, idx) => {
                        const subject = SUBJECTS.find((s) => s.v === g.subject);
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg text-xs font-semibold text-center"
                            title={`${subject?.l || g.subject}: ${g.score}/5`}
                            style={{
                              backgroundColor: gradeColor(g.score) + "15",
                              color: gradeColor(g.score),
                              border: `1px solid ${gradeColor(g.score)}30`,
                            }}
                          >
                            <span className="text-sm">
                              {subject?.i || getSubjectEmoji(g.subject || "")}
                            </span>
                            <span>{g.score}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {h.plan?.overall && (
                    <p className="text-xs text-[#374151] line-clamp-2 pt-1">
                      {h.plan.overall}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <GradeAnalysisPlan
        plan={plan}
        grades={grades}
        setPlan={setPlan}
        SUBJECTS={SUBJECTS}
        onTabChange={onTabChange}
        setDocumentForDani={setDocumentForDani}
        t={t}
      />
    </div>
  );
});
