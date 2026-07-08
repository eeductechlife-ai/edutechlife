/**
 * useSplitText - Hook para dividir texto en palabras o caracteres
 * Retorna array de elementos con índice y delay para stagger animation
 */
export const useSplitText = (text, mode = "words") => {
  if (mode === "words") {
    return text.split(" ").map((word, i) => ({
      word,
      id: i,
      delay: i * 0.1, // 100ms stagger entre palabras
    }));
  }

  // mode === 'chars'
  return text.split("").map((char, i) => ({
    char,
    id: i,
    delay: i * 0.05, // 50ms stagger entre caracteres
  }));
};
