// Micro-quizzes de comprensión posteriores al video (Fase 1 pedagógica).
// 3 preguntas por video, con feedback. Se usan para desbloquear el marcado
// "visto" además del gate de reproducción.

import { ES_PART1 } from "./ialabVideoQuizzes.es.part1";
import { ES_PART2 } from "./ialabVideoQuizzes.es.part2";
import { EN_PART1 } from "./ialabVideoQuizzes.en.part1";
import { EN_PART2 } from "./ialabVideoQuizzes.en.part2";
import { PT_PART1 } from "./ialabVideoQuizzes.pt.part1";
import { PT_PART2 } from "./ialabVideoQuizzes.pt.part2";
import { VIDEO_QUIZZES_RESERVA_PART1 } from "./ialabVideoQuizzes.video_quizzes_reserva.part1";
const ES = { ...ES_PART1, ...ES_PART2 };

const EN = { ...EN_PART1, ...EN_PART2 };

const PT = { ...PT_PART1, ...PT_PART2 };

// Cuestionarios de videos que salieron de un tema (regla 1 video + 1 PDF + 1 OVA); se conservan para reasignarlos.
const VIDEO_QUIZZES_RESERVA = { ...VIDEO_QUIZZES_RESERVA_PART1 };

export const VIDEO_QUIZZES = { es: ES, en: EN, pt: PT };

export function getVideoQuiz(videoId, locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  const pack = VIDEO_QUIZZES[lang] || VIDEO_QUIZZES.es;
  return (
    pack[videoId] ||
    (VIDEO_QUIZZES_RESERVA[lang] || VIDEO_QUIZZES_RESERVA.es)[videoId] ||
    null
  );
}

export default VIDEO_QUIZZES;
