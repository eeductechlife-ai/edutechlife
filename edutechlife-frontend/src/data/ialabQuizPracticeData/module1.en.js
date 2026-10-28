export const MODULE_1_EN = [
  {
    id: "pp-m1-1",
    question: "In the RTF formula, which element defines who should answer?",
    options: [
      { id: "pp-m1-1_a", label: "Output format" },
      { id: "pp-m1-1_b", label: "The task to perform" },
      { id: "pp-m1-1_c", label: "The role the AI takes on" },
      { id: "pp-m1-1_d", label: "The date of the answer" },
    ],
    correctAnswer: "pp-m1-1_c",
    topic: "RTF",
    difficulty: "easy",
    feedback:
      "RTF stands for Role, Task and Format. The role tells the AI which perspective to answer from.",
  },
  {
    id: "pp-m1-2",
    question: "Why is it useful to give context in a prompt?",
    options: [
      { id: "pp-m1-2_a", label: "So the answer is longer" },
      {
        id: "pp-m1-2_b",
        label: "So the AI guesses less about the audience and the goal",
      },
      { id: "pp-m1-2_c", label: "To use more tokens" },
      {
        id: "pp-m1-2_d",
        label: "Because the AI cannot answer without context",
      },
    ],
    correctAnswer: "pp-m1-2_b",
    topic: "Context",
    difficulty: "easy",
    feedback:
      "Context reduces guesswork: the model knows who the result is for and what it is for.",
  },
  {
    id: "pp-m1-3",
    question: "You get a weak answer. What is the best way to improve it?",
    options: [
      {
        id: "pp-m1-3_a",
        label: "Rewrite the prompt from scratch without changing anything",
      },
      {
        id: "pp-m1-3_b",
        label: "Add the missing element and compare with the previous version",
      },
      { id: "pp-m1-3_c", label: "Ask the AI to be smarter" },
      { id: "pp-m1-3_d", label: "Accept the answer if it is short" },
    ],
    correctAnswer: "pp-m1-3_b",
    topic: "Iteration",
    difficulty: "medium",
    feedback:
      "Changing one thing at a time shows what actually improved the result.",
  },
  {
    id: "pp-m1-4",
    question: "Which data should NOT be pasted into an AI tool?",
    options: [
      { id: "pp-m1-4_a", label: "An example text without personal data" },
      { id: "pp-m1-4_b", label: "Your own draft" },
      {
        id: "pp-m1-4_c",
        label: "An ID number, a password or a bank account number",
      },
      { id: "pp-m1-4_d", label: "A list of study topics" },
    ],
    correctAnswer: "pp-m1-4_c",
    topic: "Privacy",
    difficulty: "easy",
    feedback:
      "Identity documents, passwords and financial data should never be shared with an AI tool.",
  },
  {
    id: "pp-m1-5",
    question:
      "Before using a fact the AI generated in your work, what should you do?",
    options: [
      { id: "pp-m1-5_a", label: "Share it as is" },
      { id: "pp-m1-5_b", label: "Verify it in an original source" },
      { id: "pp-m1-5_c", label: "Ask the same AI to confirm it" },
      { id: "pp-m1-5_d", label: "Wait until nobody notices" },
    ],
    correctAnswer: "pp-m1-5_b",
    topic: "Verification",
    difficulty: "easy",
    feedback:
      "AI can be wrong with confidence: checking is done against the original source.",
  },
  {
    id: "pp-m1-6",
    question: "What does it mean to disclose AI use?",
    options: [
      { id: "pp-m1-6_a", label: "Hide that you used it" },
      {
        id: "pp-m1-6_b",
        label: "Say when and how it was used, and what you reviewed yourself",
      },
      { id: "pp-m1-6_c", label: "Pay a special license" },
      { id: "pp-m1-6_d", label: "Use it only in English" },
    ],
    correctAnswer: "pp-m1-6_b",
    topic: "Transparency",
    difficulty: "easy",
    feedback:
      "Transparency builds trust: you explain the use and the part the person reviewed.",
  },
  {
    id: "pp-m1-7",
    question:
      "A student hands in an essay written almost entirely by AI. What is the main problem?",
    options: [
      { id: "pp-m1-7_a", label: "The AI writes badly" },
      { id: "pp-m1-7_b", label: "The essay is too short" },
      {
        id: "pp-m1-7_c",
        label: "There is no personal learning and no academic honesty",
      },
      { id: "pp-m1-7_d", label: "No word processor was used" },
    ],
    correctAnswer: "pp-m1-7_c",
    topic: "Academic honesty",
    difficulty: "medium",
    feedback:
      "The core problem is that the student did not learn or represent their own work.",
  },
];
