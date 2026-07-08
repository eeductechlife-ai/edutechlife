import { motion } from "framer-motion";

/**
 * AnimatedTitle - Título con efecto de entrada simple y estilo original
 *
 * @param {string} text - Texto completo del título
 * @param {string} highlightText - Palabra a destacar con gradiente
 */
export const AnimatedTitle = ({
  text = "Liderando la Educación del Futuro",
  highlightText = "Educación del Futuro",
}) => {
  const words = text.split(" ");
  const highlightWords = highlightText.split(" ");
  const startHighlightIdx = words.length - highlightWords.length;

  return (
    <motion.h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6"
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
    >
      {words.map((word, idx) => {
        const isHighlight = idx >= startHighlightIdx;
        return (
          <span
            key={idx}
            className={
              isHighlight ? "text-gradient-accent pr-1" : "text-petroleum"
            }
          >
            {word}{" "}
          </span>
        );
      })}
    </motion.h1>
  );
};

AnimatedTitle.displayName = "AnimatedTitle";
