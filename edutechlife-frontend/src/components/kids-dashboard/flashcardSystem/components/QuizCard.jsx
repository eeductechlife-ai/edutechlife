import { memo } from "react";
import { motion } from "framer-motion";

const QuizCard = memo((props) => {
  const {
    card,
    flipped,
    onFlip,
    onResult,
    idx,
    total,
    themeColor,
    themeIcon,
    gradeLabel,
  } = props;

  if (!card) {
    return (
      <div className="flex items-center justify-center w-full" style={{ minHeight: "480px" }}>
        <p className="text-sm text-[#64748B]">
          Esta tarjeta no está disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-[#64748B]">
        {idx + 1} / {total}
      </p>
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px", maxWidth: "700px", minHeight: "480px" }}
        onClick={onFlip}
      >
        <motion.div
          className="relative w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d", minHeight: "480px" }}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-white border-2 shadow-lg p-8 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              borderColor: themeColor || "#E2E8F0",
              minHeight: "480px",
            }}
          >
            <div className="flex flex-col items-center justify-center flex-1 relative">
              {gradeLabel && (
                <span
                  className="absolute top-0 right-0 px-2 py-1 rounded-lg text-xs font-bold bg-opacity-10 text-white"
                  style={{ backgroundColor: themeColor, color: themeColor }}
                >
                  {gradeLabel}
                </span>
              )}
              <span
                className="text-xs font-semibold mb-3 block tracking-wider"
                style={{ color: themeColor || "#4DA8C4" }}
              >
                PALABRA CLAVE
              </span>
              <p className="text-3xl font-bold text-[#004B63] text-center mb-6">
                {card.front}
              </p>
              <span className="text-6xl">{card.icon || themeIcon || "📚"}</span>
            </div>
            <p className="text-xs text-[#64748B] text-center">
              Toca para ver la respuesta
            </p>
          </div>

          <div
            className="absolute inset-0 rounded-2xl bg-white border-2 shadow-lg p-6 flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: themeColor || "#4DA8C4",
              minHeight: "480px",
            }}
          >
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <div>
                <span
                  className="text-sm font-bold block mb-2"
                  style={{ color: themeColor || "#66CCCC" }}
                >
                  📖 DEFINICIÓN
                </span>
                <p className="text-base font-semibold text-[#004B63] leading-relaxed">
                  {card.back}
                </p>
              </div>

              {card.example && (
                <div
                  className="border-t pt-3"
                  style={{ borderColor: themeColor + "30" }}
                >
                  <span
                    className="text-sm font-bold block mb-2"
                    style={{ color: themeColor || "#66CCCC" }}
                  >
                    💡 EJEMPLO
                  </span>
                  <p className="text-base text-[#404B5C] leading-relaxed">
                    {card.example}
                  </p>
                </div>
              )}

              {card.relatedTerms && card.relatedTerms.length > 0 && (
                <div
                  className="border-t pt-3"
                  style={{ borderColor: themeColor + "30" }}
                >
                  <span
                    className="text-sm font-bold block mb-2"
                    style={{ color: themeColor || "#66CCCC" }}
                  >
                    🔗 TÉRMINOS RELACIONADOS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {card.relatedTerms.map((term, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                        style={{
                          backgroundColor: themeColor,
                        }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex gap-3 pt-4 mt-3 border-t shrink-0"
              style={{ borderColor: themeColor + "25" }}
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(false);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-3.5 bg-white border-2 border-red-400 text-red-500 rounded-xl font-bold text-base hover:bg-red-50 shadow-sm transition-all"
              >
                ❌ No Entendí
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(true);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-3.5 text-white rounded-xl font-bold text-base shadow-md transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)",
                }}
              >
                ✅ Entendí
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});
QuizCard.displayName = "QuizCard";

export default QuizCard;
