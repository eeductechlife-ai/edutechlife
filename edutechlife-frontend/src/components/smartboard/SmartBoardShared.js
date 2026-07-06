export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const springUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { type: 'spring', stiffness: 100, damping: 18, delay },
});

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export const childVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 15 } },
};

export const SECTION_IDS = {
  hero: 'smartboard-hero',
  queEs: 'que-es',
  vak: 'estilos-vak',
  beneficios: 'beneficios',
  tranquilidad: 'tranquilidad',
  comoFunciona: 'como-funciona',
  planes: 'planes',
  testimonios: 'testimonios',
  final: 'smartboard-final',
};

export const SCROLL_OFFSET = 80;
