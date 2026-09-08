export const MODULE_1_EN = [
  {
    id: "m1q1",
    question: "Why is it useful to give good prompts to a generative AI?",
    options: [
      { id: "m1q1_a", label: "To make the answers longer and more detailed" },
      { id: "m1q1_b", label: "To get useful answers that match what I need" },
      { id: "m1q1_c", label: "To make the AI run faster without errors" },
      { id: "m1q1_d", label: "To make the AI write the code for me" },
    ],
    correctAnswer: "m1q1_b",
    topic: "Prompt Engineering",
    difficulty: "easy",
    source: "Video: How to Create Effective Prompts",
    feedback:
      "A good prompt is a clear instruction. Review the video and the Prompt Anatomy guide.",
  },
  {
    id: "m1q2",
    question:
      'A student writes: "Write a text about artificial intelligence for students." Using RTF (Role, Task, Format), what does it have and what is missing?',
    options: [
      {
        id: "m1q2_a",
        label: "It has the Task, but it is missing the Role and Format",
      },
      {
        id: "m1q2_b",
        label: "It has the Role, but it is missing the Task and Format",
      },
      {
        id: "m1q2_c",
        label: "It has the Format, but it is missing the Role and Task",
      },
      { id: "m1q2_d", label: "It already includes all three RTF components" },
    ],
    correctAnswer: "m1q2_a",
    topic: "RTF Method",
    difficulty: "medium",
    source: "PDF Guide: Prompt Anatomy",
    feedback:
      'That prompt asks to "write a text" (Task) but does not say the AI role or the delivery format. Review the Prompt Anatomy guide.',
  },
  {
    id: "m1q3",
    question: "What does the RTF method (Role, Task, Format) achieve?",
    options: [
      { id: "m1q3_a", label: "It turns the instruction into a shorter prompt" },
      {
        id: "m1q3_b",
        label: "It structures the request to get a clear, organized answer",
      },
      { id: "m1q3_c", label: "It removes the need for any extra context" },
      { id: "m1q3_d", label: "It guarantees the AI answers without review" },
    ],
    correctAnswer: "m1q3_b",
    topic: "RTF Method",
    difficulty: "easy",
    source: "OVA: How to Talk to AI (prompts)",
    feedback:
      "RTF orders the request into Role, Task and Format. Practice in the OVA.",
  },
  {
    id: "m1q4",
    question:
      "You need a summary about the water cycle. Which prompt gives the best result?",
    options: [
      {
        id: "m1q4_a",
        label: '"Act as a science teacher and summarize the cycle in 4 steps."',
      },
      {
        id: "m1q4_b",
        label:
          '"Explain everything you know about the water cycle, no limits."',
      },
      {
        id: "m1q4_c",
        label: '"Water cycle. Give me general and varied information."',
      },
      {
        id: "m1q4_d",
        label: '"Tell me about water and about other nature topics."',
      },
    ],
    correctAnswer: "m1q4_a",
    topic: "Prompt Structure",
    difficulty: "medium",
    source: "Video: How to Create Effective Prompts",
    feedback:
      "Option A defines role, task and format. The others are vague or mix topics.",
  },
  {
    id: "m1q5",
    question:
      'You ask for an executive summary for non-technical managers. The prompt is: "Summarize this article." The AI gives a very technical text. What is missing?',
    options: [
      {
        id: "m1q5_a",
        label: "To state who it is for and the style of the summary",
      },
      { id: "m1q5_b", label: "To split the article into smaller pieces" },
      {
        id: "m1q5_c",
        label: "To change tools because the AI missed the topic",
      },
      { id: "m1q5_d", label: "To use synonyms for the word summary" },
    ],
    correctAnswer: "m1q5_a",
    topic: "RTF in Practice",
    difficulty: "medium",
    source: "OVA: How to Talk to AI (prompts)",
    feedback:
      "A generic prompt does not state audience or format. Add role, audience and length.",
  },
  {
    id: "m1q6",
    question: "What is generative artificial intelligence?",
    options: [
      {
        id: "m1q6_a",
        label: "A system that creates new content from what it has learned",
      },
      { id: "m1q6_b", label: "A database that stores already written answers" },
      {
        id: "m1q6_c",
        label: "A program that only classifies images and texts",
      },
      { id: "m1q6_d", label: "A search engine that returns web pages" },
    ],
    correctAnswer: "m1q6_a",
    topic: "Generative AI",
    difficulty: "easy",
    source: "Video: What is AI and how it is changing the world",
    feedback:
      "Generative AI produces new text, images or other content. Watch the video.",
  },
  {
    id: "m1q7",
    question: "What is a prompt?",
    options: [
      { id: "m1q7_a", label: "The instruction or message you write to the AI" },
      { id: "m1q7_b", label: "The automatic answer that the AI generates" },
      { id: "m1q7_c", label: "The visual design of the tool interface" },
      { id: "m1q7_d", label: "A type of file that the AI can open" },
    ],
    correctAnswer: "m1q7_a",
    topic: "Prompt Basics",
    difficulty: "easy",
    source: "OVA: How to Talk to AI (prompts)",
    feedback:
      "A prompt is what you ask the AI. The Prompt Anatomy guide explains how to build one.",
  },
  {
    id: "m1q8",
    question:
      'Why is it useful to give the AI a role (for example, "act as a tutor")?',
    options: [
      {
        id: "m1q8_a",
        label: "Because it adjusts the style and focus of the answer",
      },
      { id: "m1q8_b", label: "Because it makes the AI always answer shorter" },
      { id: "m1q8_c", label: "Because it stops the AI from needing context" },
      { id: "m1q8_d", label: "Because it is required for the AI to work" },
    ],
    correctAnswer: "m1q8_a",
    topic: "RTF Method",
    difficulty: "easy",
    source: "PDF Guide: Prompt Anatomy",
    feedback:
      "The role gives the AI a focus and tone, so the answer fits your goal.",
  },
  {
    id: "m1q9",
    question:
      "The AI gives you a generic or off-topic answer. What is the best next action?",
    options: [
      {
        id: "m1q9_a",
        label: "Add clear context: goal, audience and desired format",
      },
      {
        id: "m1q9_b",
        label: "Repeat the same prompt without changing anything",
      },
      {
        id: "m1q9_c",
        label: "Choose another AI tool without understanding the issue",
      },
      { id: "m1q9_d", label: "Ask again until the answer improves on its own" },
    ],
    correctAnswer: "m1q9_a",
    topic: "Prompt Refinement",
    difficulty: "easy",
    source: "OVA: Live Prompt Lab",
    feedback:
      "Refine the prompt by adding context. Practice in the Live Prompt Lab.",
  },
  {
    id: "m1q10",
    question:
      "You want the AI to explain a hard topic. Which prompt asks for a clearer explanation?",
    options: [
      {
        id: "m1q10_a",
        label: '"Explain it with simple examples and everyday language."',
      },
      {
        id: "m1q10_b",
        label: '"Give me all the theory about the topic in one answer."',
      },
      {
        id: "m1q10_c",
        label: '"Tell me about this topic and also about similar ones."',
      },
      { id: "m1q10_d", label: '"Explain it as an advanced expert would."' },
    ],
    correctAnswer: "m1q10_a",
    topic: "Prompt Clarity",
    difficulty: "medium",
    source: "OVA: How to Talk to AI (prompts)",
    feedback:
      "Asking for examples and simple language makes the explanation clearer.",
  },
];
