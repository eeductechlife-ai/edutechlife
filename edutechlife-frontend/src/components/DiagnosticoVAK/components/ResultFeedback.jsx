import { useState } from "react";
import { track } from "../../../lib/analytics";
import { EVENTS } from "../../../lib/analyticsEvents";

const OPTIONS = [
  { value: "yes", emoji: "🙂", labelKey: "vak.ui.feedback_yes" },
  { value: "some", emoji: "😐", labelKey: "vak.ui.feedback_some" },
  { value: "no", emoji: "🙁", labelKey: "vak.ui.feedback_no" },
];

// Una sola pregunta de un toque: ¿el resultado se parece a la persona?
export default function ResultFeedback({ t, dominantStyle }) {
  const [answer, setAnswer] = useState(null);

  const choose = (value) => {
    setAnswer(value);
    track(EVENTS.VAK_RESULT_FEEDBACK, {
      rating: value,
      dominant_style: dominantStyle,
    });
  };

  return (
    <div className="rounded-2xl border border-[#B2D8E5] bg-white p-4 text-center">
      <p className="!m-0 text-sm font-bold text-[#004B63]">
        {answer ? t("vak.ui.feedback_thanks") : t("vak.ui.feedback_question")}
      </p>
      {!answer && (
        <div className="mt-3 grid grid-cols-3 gap-2" role="group">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => choose(o.value)}
              className="min-h-[56px] rounded-xl border-2 border-[#B2D8E5] text-sm font-semibold text-[#004B63] hover:border-[#4DA8C4] flex flex-col items-center justify-center"
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {o.emoji}
              </span>
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
