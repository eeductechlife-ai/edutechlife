import { useState, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";

const UploadDropzone = memo(
  ({ onUpload, isUploading, uploadProgress, uploadStatus }) => {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onUpload(files[0]);
    };

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) onUpload(file);
    };

    const statusMessages = {
      parsing: t("kid.activity.status_parsing"),
      analyzing: t("kid.activity.status_analyzing"),
      complete: t("kid.activity.status_complete"),
      error: t("kid.activity.status_error"),
    };

    return (
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer backdrop-blur-xl ${
          isDragging
            ? "border-[#4DA8C4] bg-[#4DA8C4]/10 scale-[1.02]"
            : uploadStatus === "error"
              ? "border-red-300 bg-red-50/50"
              : "border-[#E2E8F0]/50 bg-white/70 hover:border-[#4DA8C4]/50 hover:bg-white/80"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        whileHover={
          !isUploading
            ? { scale: 1.02, boxShadow: "0 10px 30px rgba(77, 168, 196, 0.15)" }
            : {}
        }
        animate={{ scale: isDragging ? 1.02 : 1 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4DA8C4]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">
                  {uploadStatus === "parsing"
                    ? "📄"
                    : uploadStatus === "analyzing"
                      ? "🤖"
                      : "✅"}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#004B63] mb-2">
                {statusMessages[uploadStatus] ||
                  t("kid.activity.status_processing")}
              </p>
              <div className="w-48 h-2 bg-[#E2E8F0] rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {uploadStatus === "parsing" && (
                <p className="text-xs text-[#64748B] mt-2">
                  {t("kid.activity.parsing_detail")}
                </p>
              )}
              {uploadStatus === "analyzing" && (
                <p className="text-xs text-[#64748B] mt-2">
                  {t("kid.activity.analyzing_detail")}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center mx-auto mb-4 shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl">📤</span>
              </motion.div>
              <p className="text-lg font-semibold text-[#004B63] mb-2">
                {t("kid.activity.drag_activity")}
              </p>
              <p className="text-sm text-[#64748B] mb-4">
                {t("kid.activity.click_select")}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-[#64748B]">
                {["PDF", "TXT", "JPG", "PNG"].map((type) => (
                  <span key={type} className="px-2 py-1 bg-[#F8FAFC] rounded">
                    {type}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

UploadDropzone.displayName = "UploadDropzone";

export default UploadDropzone;
