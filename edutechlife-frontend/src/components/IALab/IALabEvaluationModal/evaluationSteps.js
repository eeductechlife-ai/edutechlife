// Componentes y claves de traducción de los pasos de cada desafío por módulo
import IALabEvaluationStep1 from "../IALabEvaluationStep1";
import IALabEvaluationStep2 from "../IALabEvaluationStep2";
import IALabEvaluationStep3 from "../IALabEvaluationStep3";
import ChatGPTStep1 from "../challenges/module2/ChatGPTStep1";
import ChatGPTStep2 from "../challenges/module2/ChatGPTStep2";
import ChatGPTStep3 from "../challenges/module2/ChatGPTStep3";
import GeminiStep1 from "../challenges/module3/GeminiStep1";
import GeminiStep2 from "../challenges/module3/GeminiStep2";
import GeminiStep3 from "../challenges/module3/GeminiStep3";
import GeminiStep4 from "../challenges/module3/GeminiStep4";
import NotebookStep1 from "../challenges/module4/NotebookStep1";
import NotebookStep2 from "../challenges/module4/NotebookStep2";
import NotebookStep3 from "../challenges/module4/NotebookStep3";
import ClaudeStep1 from "../challenges/module5/ClaudeStep1";
import ClaudeStep2 from "../challenges/module5/ClaudeStep2";
import ClaudeStep3 from "../challenges/module5/ClaudeStep3";

export const STEP_COMPONENTS = {
  1: [IALabEvaluationStep1, IALabEvaluationStep2, IALabEvaluationStep3],
  2: [ChatGPTStep1, ChatGPTStep2, ChatGPTStep3],
  3: [GeminiStep1, GeminiStep2, GeminiStep3, GeminiStep4],
  4: [NotebookStep1, NotebookStep2, NotebookStep3],
  5: [ClaudeStep1, ClaudeStep2, ClaudeStep3],
};

export const STEP_TITLE_KEYS = {
  1: [
    "ialab.evaluation.modal.step1_title",
    "ialab.evaluation.modal.step2_title",
    "ialab.evaluation.modal.step3_title",
  ],
  2: [
    "ialab.challenge.m2.step1_title",
    "ialab.challenge.m2.step2_title",
    "ialab.challenge.m2.step3_title",
  ],
  3: [
    "ialab.challenge.m3.step1_title",
    "ialab.challenge.m3.step2_title",
    "ialab.challenge.m3.step3_title",
    "ialab.challenge.m3.step4_title",
  ],
  4: [
    "ialab.challenge.m4.step1_title",
    "ialab.challenge.m4.step2_title",
    "ialab.challenge.m4.step3_title",
  ],
  5: [
    "ialab.challenge.m5.step1_title",
    "ialab.challenge.m5.step2_title",
    "ialab.challenge.m5.step3_title",
  ],
};

export const STEP_DESC_KEYS = {
  1: [
    "ialab.evaluation.modal.step1_desc",
    "ialab.evaluation.modal.step2_desc",
    "ialab.evaluation.modal.step3_desc",
  ],
  2: [
    "ialab.challenge.m2.step1_desc",
    "ialab.challenge.m2.step2_desc",
    "ialab.challenge.m2.step3_desc",
  ],
  3: [
    "ialab.challenge.m3.step1_desc",
    "ialab.challenge.m3.step2_desc",
    "ialab.challenge.m3.step3_desc",
    "ialab.challenge.m3.step4_desc",
  ],
  4: [
    "ialab.challenge.m4.step1_desc",
    "ialab.challenge.m4.step2_desc",
    "ialab.challenge.m4.step3_desc",
  ],
  5: [
    "ialab.challenge.m5.step1_desc",
    "ialab.challenge.m5.step2_desc",
    "ialab.challenge.m5.step3_desc",
  ],
};
