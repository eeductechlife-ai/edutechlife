import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../../../i18n/I18nProvider";
import { readableTextOn } from "../../../../utils/contrast";

// Fits a phone screen with the top bar and bottom nav visible.
const CARD_H = "min(480px, calc(100dvh - 300px))";

const QuizCard = memo((props) => {
  const { t } = useTranslation();
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

  const frontRef = useRef(null);
  const backRef = useRef(null);
  const mounted = useRef(false);

  // El foco sigue a la cara visible: al voltear pasa a la respuesta y al pasar
  // a la tarjeta siguiente vuelve al frente. No se mueve en el primer render.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    (flipped ? backRef : frontRef).current?.focus({ preventScroll: true });
  }, [flipped]);

  if (!card) {
    return (
      <div
        className="flex items-center justify-center w-full"
        style={{ minHeight: CARD_H }}
      >
        <p className="text-sm text-[#64748B]">
          {t("kid.flashcards.card_unavailable")}
        </p>
      </div>
    );
  }

  // Cards built from a reto are questions, not vocabulary: label them so.
  const isQuestion = /[?？]\s*$/.test(card.front || "");
  const frontLabel = t(
    isQuestion
      ? "kid.flashcards.question_label"
      : "kid.flashcards.keyword_label",
  );
  const backLabel = t(
    isQuestion
      ? "kid.flashcards.answer_label"
      : "kid.flashcards.definition_label",
  );
  const exampleLabel = t(
    isQuestion ? "kid.flashcards.why_label" : "kid.flashcards.example_label",
  );

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-sm text-[#64748B]">
        {idx + 1} / {total}
      </p>
      <div
        className="w-full"
        style={{ perspective: "1000px", maxWidth: "700px", minHeight: CARD_H }}
      >
        <motion.div
          className="relative w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d", minHeight: CARD_H }}
        >
          {/* Cara visible: un botón de verdad (Espacio/Enter). Al voltear se
              oculta a lectores de pantalla y al foco con aria-hidden + inert. */}
          <button
            ref={frontRef}
            type="button"
            onClick={onFlip}
            aria-expanded={flipped}
            aria-label={`${frontLabel}: ${card.front}. ${t("kid.flashcards.tap_to_reveal")}`}
            aria-hidden={flipped ? "true" : undefined}
            inert={flipped ? "" : undefined}
            className="absolute inset-0 w-full rounded-2xl bg-white border-2 shadow-lg p-5 sm:p-8 flex flex-col justify-between text-left cursor-pointer"
            style={{
              backfaceVisibility: "hidden",
              borderColor: themeColor || "#E2E8F0",
              minHeight: CARD_H,
            }}
          >
            <span className="flex flex-col items-center justify-center flex-1 relative w-full">
              {gradeLabel && (
                <span
                  className="absolute top-0 right-0 px-2 py-1 rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: `${themeColor || "#4DA8C4"}1A`,
                    color: themeColor || "#4DA8C4",
                  }}
                >
                  {gradeLabel}
                </span>
              )}
              <span
                className="text-xs font-semibold mb-3 block tracking-wider"
                style={{ color: themeColor || "#4DA8C4" }}
              >
                {frontLabel}
              </span>
              <span className="block text-2xl sm:text-3xl font-bold text-[#004B63] text-center mb-4">
                {card.front}
              </span>
              <span className="text-5xl sm:text-6xl" aria-hidden="true">
                {card.icon || themeIcon || "📚"}
              </span>
            </span>
            <span className="block w-full text-sm font-semibold text-[#64748B] text-center">
              👆 {t("kid.flashcards.tap_to_reveal")}
            </span>
          </button>

          <div
            ref={backRef}
            tabIndex={-1}
            role="group"
            aria-label={`${backLabel}: ${card.front}`}
            aria-hidden={flipped ? undefined : "true"}
            inert={flipped ? undefined : ""}
            className="absolute inset-0 rounded-2xl bg-white border-2 shadow-lg p-4 sm:p-6 flex flex-col outline-none"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: themeColor || "#4DA8C4",
              minHeight: CARD_H,
            }}
          >
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <div>
                <span
                  className="text-sm font-bold block mb-2"
                  style={{ color: themeColor || "#66CCCC" }}
                >
                  {backLabel}
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
                    {exampleLabel}
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
                    {t("kid.flashcards.related_terms_label")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {card.relatedTerms.map((term, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                        style={{
                          backgroundColor: themeColor,
                          color: readableTextOn(themeColor),
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
                {t("kid.flashcards.not_understood")}
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
                {t("kid.flashcards.understood")}
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
