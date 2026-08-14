import { memo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const COLORS = [
  "#4DA8C4",
  "#66CCCC",
  "#FFD166",
  "#FF6B9D",
  "#B2D8E5",
  "#004B63",
];

export const UploadZone = memo(({ onUpload, busy }) => {
  const { t } = useTranslation();
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const d = (e, val) => {
    e.preventDefault();
    setDrag(val);
  };
  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer backdrop-blur-xl ${
        drag
          ? "border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]"
          : "border-[#E2E8F0]/50 bg-white/70 hover:border-[#4DA8C4]/50"
      }`}
      onDragEnter={(e) => d(e, true)}
      onDragLeave={(e) => d(e, false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
      }}
      onClick={() => !busy && ref.current?.click()}
      whileHover={!busy ? { scale: 1.02 } : {}}
    >
      <input
        ref={ref}
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        className="hidden"
      />
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-2 shadow-lg">
        <span className="text-lg">📄</span>
      </div>
      <p className="text-sm font-semibold text-[#004B63] mb-0.5">
        {t("kid.smartbook.upload_file")}
      </p>
      <p className="text-xs text-[#64748B]">PDF o TXT</p>
    </motion.div>
  );
});
UploadZone.displayName = "UZ";

export const StepBar = memo(({ step }) => {
  const { t } = useTranslation();
  const steps = [
    t("kid.smartbook.stepbar_extracting"),
    t("kid.smartbook.stepbar_analyzing"),
    t("kid.smartbook.stepbar_organizing"),
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              i === step
                ? "bg-[#4DA8C4]/20 text-[#004B63]"
                : i < step
                  ? "bg-[#66CCCC]/20 text-[#66CCCC]"
                  : "bg-[#E2E8F0] text-[#94A3B8]"
            }`}
            animate={i === step ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {s}
          </motion.span>
          {i < 2 && (
            <div
              className={`w-5 h-0.5 rounded ${i < step ? "bg-[#66CCCC]" : "bg-[#E2E8F0]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
});
StepBar.displayName = "SB";

export const HistoryItem = memo(({ book, i, dark, onSelect }) => {
  const { locale } = useTranslation();
  const dateLocale =
    { en: "en-US", pt: "pt-BR", es: "es-CO" }[locale] || "es-CO";
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.04 }}
      onClick={() => onSelect(book)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full text-left p-3 rounded-xl border transition-all hover:shadow-md ${
        dark
          ? "bg-[#1E293B] border-[#334155] hover:border-[#4DA8C4]/30"
          : "bg-white border-[#E2E8F0] hover:border-[#4DA8C4]/30"
      }`}
    >
      <h5
        className={`text-sm font-bold truncate ${dark ? "text-white" : "text-[#004B63]"}`}
      >
        {book.title}
      </h5>
      <p
        className={`text-xs mt-1 ${dark ? "text-[#64748B]" : "text-[#94A3B8]"}`}
      >
        {new Date(book.createdAt).toLocaleDateString(dateLocale)}
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {book.keyConcepts?.slice(0, 3).map((c, j) => (
          <span
            key={j}
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `${COLORS[j % COLORS.length]}15`,
              color: COLORS[j % COLORS.length],
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </motion.button>
  );
});
HistoryItem.displayName = "HI";
