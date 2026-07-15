import React from "react";
import { motion } from "framer-motion";
import { Eye, Download, RotateCcw, Rocket, CheckCircle2 } from "lucide-react";
import {
  buildResultsURL,
  getMoodFeedback,
  getMoodLabel,
  formatTime,
  MOOD_OPTIONS,
} from "../vakHelpers";
import ResultsChart from "../components/ResultsChart";

export default function renderResults({
  t,
  diagnosis,
  studentMood,
  elapsedTime,
  onGeneratePDF,
  pdfLoading,
  onViewDocument,
  onReset,
  onGoHome,
  getIconComponent,
  chartRef,
}) {
  if (!diagnosis || !diagnosis.styleDetails) {
    return (
      <div className="p-10 text-center text-gray-500">
        {t("vak.ui.no_results_available")}
      </div>
    );
  }

  const qrUrl = buildResultsURL(diagnosis);
  const StyleIcon = getIconComponent(diagnosis.styleDetails?.icon || "Eye");
  const moodFeedback = getMoodFeedback(studentMood, MOOD_OPTIONS);

  const radarData = [
    { subject: "Visual", A: diagnosis.counts?.visual || 0, fullMark: 10 },
    { subject: "Auditivo", A: diagnosis.counts?.auditivo || 0, fullMark: 10 },
    {
      subject: "Kinestésico",
      A: diagnosis.counts?.kinestesico || 0,
      fullMark: 10,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-[#004B63] text-center">
          {t("vak.ui.diagnosis_completed")}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          {t("vak.ui.hello_greeting_name")}{" "}
          <span className="font-semibold text-[#4DA8C4]">
            {diagnosis.studentName}
          </span>
          {t("vak.ui.hello_results_suffix")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-[#4DA8C4] to-[#66CCCC] opacity-20 hidden md:block"></div>

        <motion.div
          initial={{ opacity: 0, x: -30, rotateY: -10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="rounded-[2rem] bg-gradient-to-br from-[#E6F4F1] to-white border border-[#B2D8E5] p-6 relative overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4DA8C4] to-transparent opacity-30"></div>
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-[#4DA8C4]/10 blur-xl"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4DA8C4] flex items-center justify-center">
              <StyleIcon size={24} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#4DA8C4] uppercase tracking-wide">
                {diagnosis.styleDetails.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {diagnosis.percentage}% {t("vak.ui.percentage_match")}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {diagnosis.styleDetails.description}
          </p>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">
              {t("vak.ui.recommended_strategies")}
            </h3>
            {(diagnosis.styleDetails.strategies || [])
              .slice(0, 5)
              .map((strategy, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#4DA8C4]/10 flex items-center justify-center mt-0.5">
                    <CheckCircle2
                      className="w-5 h-5 text-[#4DA8C4]"
                      size={20}
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-relaxed">
                    {strategy}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-6 p-4 bg-[#F0FDFF] rounded-xl border-l-4 border-[#4DA8C4]">
            <p className="text-xs text-[#004B63] font-medium mb-1">
              {t("vak.ui.personalized_tip_title")}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {diagnosis.styleDetails?.tip}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="space-y-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <ResultsChart radarData={radarData} t={t} chartRef={chartRef} />

          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-[#004B63] mb-4">
              {t("vak.ui.scores")}
            </h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium" style={{ color: "#4DA8C4" }}>
                  Visual
                </span>
                <span className="text-slate-600">
                  {diagnosis.counts?.visual || 0}/10
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(diagnosis.counts?.visual || 0) * 10}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#4DA8C4" }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium" style={{ color: "#66CCCC" }}>
                  Auditivo
                </span>
                <span className="text-slate-600">
                  {diagnosis.counts?.auditivo || 0}/10
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(diagnosis.counts?.auditivo || 0) * 10}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#66CCCC" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium" style={{ color: "#B2D8E5" }}>
                  Kinestésico
                </span>
                <span className="text-slate-600">
                  {diagnosis.counts?.kinestesico || 0}/10
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(diagnosis.counts?.kinestesico || 0) * 10}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#B2D8E5" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl bg-[#F0FDFF] flex items-center justify-center"
                  style={{ color: moodFeedback.color }}
                >
                  {React.createElement(getIconComponent(moodFeedback.icon), {
                    size: 20,
                    strokeWidth: 2,
                  })}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#004B63]">
                    {t("vak.ui.mood_section")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getMoodLabel(studentMood, t)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#004B63]">
                  {t("vak.ui.time_section")}
                </p>
                <p className="text-xs text-slate-500">
                  {formatTime(diagnosis.timeSpent || elapsedTime)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="flex justify-center mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewDocument}
          className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Eye size={20} strokeWidth={2} className="relative z-10" />
          <span className="relative z-10 text-base font-semibold">
            {t("vak.ui.view_document_btn")}
          </span>
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10"
      >
        <motion.button
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGeneratePDF}
          disabled={pdfLoading}
          className="relative bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-full px-8 py-4 shadow-xl flex items-center gap-3 overflow-hidden group"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          {pdfLoading ? (
            <>
              <div className="relative z-10 w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span className="relative z-10 text-base font-semibold">
                {t("vak.ui.generating_pdf")}
              </span>
            </>
          ) : (
            <>
              <Download size={20} strokeWidth={2} className="relative z-10" />
              <span className="relative z-10 text-base font-semibold">
                {t("vak.ui.download_pdf_result")}
              </span>
            </>
          )}

          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-[#4DA8C4]/30 to-[#66CCCC]/30 blur-md rounded-full"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoHome}
          className="relative bg-white border-2 border-[#004B63] text-[#004B63] rounded-full px-8 py-4 flex items-center gap-3 overflow-hidden group"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#004B63]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <Rocket size={20} strokeWidth={2} className="relative z-10" />
          <span className="relative z-10 text-base font-semibold">
            {t("vak.ui.go_home")}
          </span>

          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#004B63]/10 blur-md rounded-full"></div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="text-[#004B63]/50 hover:text-[#4DA8C4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={16} strokeWidth={2} />
          {t("vak.ui.back_to_start")}
        </motion.button>
      </motion.div>

      <div className="text-center mt-6">
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          {t("vak.ui.total_time")}:{" "}
          {formatTime(diagnosis.timeSpent || elapsedTime)} •{" "}
          {t("vak.ui.mood_section")}: {getMoodLabel(studentMood, t)}
        </p>
      </div>
    </div>
  );
}
