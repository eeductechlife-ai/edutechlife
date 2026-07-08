import { motion } from "framer-motion";

/**
 * AnimatedTitle - Título con efecto de entrada en dos líneas
 *
 * @param {string} text1 - Primera línea del título
 * @param {string} text2 - Segunda línea del título (con gradiente)
 */
export const AnimatedTitle = ({
  text1 = "Liderando la",
  text2 = "Educación del Futuro",
}) => {
  return (
    <motion.h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6 text-petroleum"
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
    >
      {text1}
      <br />
      <span className="text-gradient-accent pr-1">{text2}</span>
    </motion.h1>
  );
};

AnimatedTitle.displayName = "AnimatedTitle";
