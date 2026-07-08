import { motion } from "framer-motion";
import { useSplitText } from "../../hooks/useSplitText";
import { useGradientShift } from "../../hooks/useGradientShift";

/**
 * AnimatedTitle - Título animado premium con split text y gradient shift
 *
 * @param {string} text - Texto completo del título
 * @param {string} highlightText - Palabra a destacar con glow
 * @param {string} splitMode - 'words' | 'chars' para dividir el texto
 * @param {array} gradientColors - Array de colores para el gradiente
 */
export const AnimatedTitle = ({
  text = "Liderando la Educación del Futuro",
  highlightText = "Futuro",
  splitMode = "words",
  gradientColors = ["#004B63", "#4DA8C4", "#66CCCC"],
}) => {
  const parts = useSplitText(text, splitMode);
  const { gradient, backgroundPosition, backgroundSize } =
    useGradientShift(gradientColors);

  // Variantes de animación para contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Variantes para cada palabra/carácter (entrada con blur)
  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1], // custom easing: elasticOut
      },
    },
  };

  // Variantes para palabra destacada
  const highlightVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    hover: {
      scale: 1.1,
      filter: "brightness(1.3)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6"
      style={{
        background: gradient,
        backgroundSize: backgroundSize,
        backgroundPosition: `${backgroundPosition} 0`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {splitMode === "words"
        ? parts.map((part, i) => (
            <motion.span
              key={part.id}
              variants={wordVariants}
              className="inline-block"
            >
              {part.word === highlightText ? (
                <motion.span
                  className="text-cyan-500 drop-shadow-lg inline-block"
                  variants={highlightVariants}
                  whileHover="hover"
                  style={{
                    textShadow: "0 0 30px rgba(77, 168, 196, 0.6)",
                  }}
                >
                  {part.word}
                </motion.span>
              ) : (
                part.word
              )}
              {/* Agregar espacio entre palabras excepto en la última */}
              {i < parts.length - 1 && " "}
            </motion.span>
          ))
        : parts.map((part) => (
            <motion.span
              key={part.id}
              variants={wordVariants}
              className="inline-block"
            >
              {part.char === " " ? " " : part.char}
            </motion.span>
          ))}
    </motion.h1>
  );
};

AnimatedTitle.displayName = "AnimatedTitle";
