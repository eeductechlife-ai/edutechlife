export const MODULE_1_EN_PART1 = [
  {
    id: "m1q1",
    question: "Why is it useful to give good prompts to a generative AI?",
    options: [
      {
        id: "m1q1_a",
        label: "To make the answers longer and more detailed",
      },
      {
        id: "m1q1_b",
        label: "To get useful answers that match what I need",
      },
      {
        id: "m1q1_c",
        label: "To make the AI run faster without errors",
      },
      {
        id: "m1q1_d",
        label: "To make the AI write the code for me",
      },
    ],
    correctAnswer: "m1q1_b",
    topic: "Prompt Engineering",
    difficulty: "easy",
    source: "How to Create Effective Prompts: The Formula to Master AI",
    feedback:
      "A good prompt tells the AI what you need, for whom and how you want it; that is why the answer fits your goal. Being longer or faster is not what improves it.",
  },
  {
    id: "m1q2",
    question:
      'A student writes: "Write a text about artificial intelligence for students." Using RTF (Role, Task, Format), what does it have and what is missing?',
    options: [
      {
        id: "m1q2_a",
        label: "It has the Task but lacks the Role and Format",
      },
      {
        id: "m1q2_b",
        label: "It has the Role, but it is missing the Task and Format",
      },
      {
        id: "m1q2_c",
        label: "It has the Format, but it is missing the Role and Task",
      },
      {
        id: "m1q2_d",
        label: "It already includes all three RTF components",
      },
    ],
    correctAnswer: "m1q2_a",
    topic: "RTF Method",
    difficulty: "medium",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      'That prompt asks to "write a text" (Task) but does not say the AI role or the delivery format. Review the Prompt Anatomy guide.',
  },
  {
    id: "m1q3",
    question: "What do the three letters of the RTF method stand for?",
    options: [
      {
        id: "m1q3_a",
        label: "Role, Tone and Format",
      },
      {
        id: "m1q3_b",
        label: "Role, Task and Format",
      },
      {
        id: "m1q3_c",
        label: "Response, Topic and Format",
      },
      {
        id: "m1q3_d",
        label: "Role, Task and Facts",
      },
    ],
    correctAnswer: "m1q3_b",
    topic: "RTF Method",
    difficulty: "easy",
    source: "The Chisel",
    feedback:
      "RTF stands for Role (the point of view the AI answers from), Task (the concrete action) and Format (how it delivers the answer). Tone and length are added separately. Practice in the OVA The Chisel.",
  },
  {
    id: "m1q4",
    question:
      "You suspect an AI describes people differently depending on where they come from. What simple test can you run?",
    options: [
      {
        id: "m1q4_a",
        label: "Ask for the same task with different profiles and compare",
      },
      {
        id: "m1q4_b",
        label: "Ask the AI whether it is biased and believe it",
      },
      {
        id: "m1q4_c",
        label: "Repeat the same prompt several times with the same profile",
      },
      {
        id: "m1q4_d",
        label: "Ask it to answer more briefly to reduce the bias",
      },
    ],
    correctAnswer: "m1q4_a",
    topic: "Detecting Bias",
    difficulty: "medium",
    source: "PDF: Ethics of Artificial Intelligence",
    feedback:
      "If you change only the profile and the answer treats each person differently, you found a bias. Asking the AI whether it is neutral or repeating the same profile does not show that difference. Review the ethics guide, section 4.",
  },
  {
    id: "m1q5",
    question:
      'You ask for an executive summary for non-technical managers. The prompt is: "Summarize this article." The AI gives a very technical text. What is missing?',
    options: [
      {
        id: "m1q5_a",
        label: "To state the audience and summary style",
      },
      {
        id: "m1q5_b",
        label: "To split the article into smaller pieces",
      },
      {
        id: "m1q5_c",
        label: "To change tools because the AI missed the topic",
      },
      {
        id: "m1q5_d",
        label: "To use synonyms for the word summary",
      },
    ],
    correctAnswer: "m1q5_a",
    topic: "RTF in Practice",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "A generic prompt does not state audience or format. Add role, audience and length.",
  },
  {
    id: "m1q6",
    question: "What is generative artificial intelligence?",
    options: [
      {
        id: "m1q6_a",
        label: "A system that creates new content from data",
      },
      {
        id: "m1q6_b",
        label: "A database that stores already written answers",
      },
      {
        id: "m1q6_c",
        label: "A program that only classifies images and texts",
      },
      {
        id: "m1q6_d",
        label: "A search engine that returns web pages",
      },
    ],
    correctAnswer: "m1q6_a",
    topic: "Generative AI",
    difficulty: "easy",
    source: "What is AI and how it is changing the world",
    feedback:
      "Generative AI produces new text, images or other content. Watch the video.",
  },
  {
    id: "m1q7",
    question: "What is a prompt?",
    options: [
      {
        id: "m1q7_a",
        label: "The instruction or message you write to the AI",
      },
      {
        id: "m1q7_b",
        label: "The automatic answer that the AI generates",
      },
      {
        id: "m1q7_c",
        label: "The visual design of the tool interface",
      },
      {
        id: "m1q7_d",
        label: "A type of file that the AI can open",
      },
    ],
    correctAnswer: "m1q7_a",
    topic: "Prompt Basics",
    difficulty: "easy",
    source: "The Chisel",
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
        label: "Because it adjusts the style and the focus",
      },
      {
        id: "m1q8_b",
        label: "Because it makes the AI always answer shorter",
      },
      {
        id: "m1q8_c",
        label: "Because it stops the AI from needing context",
      },
      {
        id: "m1q8_d",
        label: "Because it is required for the AI to work",
      },
    ],
    correctAnswer: "m1q8_a",
    topic: "RTF Method",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "The role gives the AI a focus and tone, so the answer fits your goal.",
  },
  {
    id: "m1q9",
    question:
      "You ask AI for a study plan and it gives you a generic one that does not help. What is the prompt missing?",
    options: [
      {
        id: "m1q9_a",
        label:
          "Your situation: how much time you have, your level and the exam date",
      },
      {
        id: "m1q9_b",
        label: 'A flashier role, like "act as a genius"',
      },
      {
        id: "m1q9_c",
        label: "To make it longer and with many more details",
      },
      {
        id: "m1q9_d",
        label: 'Polite words like "please" so it tries harder',
      },
    ],
    correctAnswer: "m1q9_a",
    topic: "Context",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      'The AI does not know your situation. Context (your time, your level and your deadline) is what turns a generic plan into a useful one. A flashier role, more length or polite words do not give it that information. Review the "Guide: Anatomy of a Prompt".',
  },
  {
    id: "m1q10",
    question:
      "You want AI to write messages in your style. What do you give it?",
    options: [
      {
        id: "m1q10_a",
        label: "Two messages you already wrote and liked",
      },
      {
        id: "m1q10_b",
        label: "A vague line: write nicely",
      },
      {
        id: "m1q10_c",
        label: "Only the company name",
      },
      {
        id: "m1q10_d",
        label: "Nothing: AI already knows your style",
      },
    ],
    correctAnswer: "m1q10_a",
    topic: "Prompt Clarity",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "Real examples of your style give the AI a concrete model. A vague line or nothing gives it no reference.",
  },
  {
    id: "m1q11",
    question:
      "You ask for examples of professions and all of them show city men. No fact is false. Which question helps you see the problem?",
    options: [
      {
        id: "m1q11_a",
        label: "Which people or perspectives are left out?",
      },
      {
        id: "m1q11_b",
        label: "Is any of the facts in the answer false?",
      },
      {
        id: "m1q11_c",
        label: "Does the answer cite a reliable source?",
      },
      {
        id: "m1q11_d",
        label: "Do the professions on the list really exist?",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "Omission Bias",
    difficulty: "easy",
    source: "PDF: Ethics of Artificial Intelligence",
    feedback:
      "Bias is sometimes not in what the answer says but in what it leaves out. Asking which people or perspectives are left out reveals it; checking whether the facts are true or whether there are sources does not show it. Review the ethics guide, section 4.",
  },
  {
    id: "m1q12",
    question:
      "Case: a student copies a paragraph from AI into their assignment without checking it. What is the main mistake?",
    options: [
      {
        id: "m1q12_a",
        label: "Not verifying data or citations before using the text",
      },
      {
        id: "m1q12_b",
        label: "Using AI to write at all",
      },
      {
        id: "m1q12_c",
        label: "Writing too fast for the time available",
      },
      {
        id: "m1q12_d",
        label: "Using too formal a tone in a school research assignment",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "Generative AI",
    difficulty: "easy",
    source: "What is AI and how it is changing the world",
    feedback:
      "AI can invent data with confidence. Before using a text, verify data and citations in the source.",
  },
  {
    id: "m1q13",
    question:
      "What does knowing the beginnings of artificial intelligence add to how you use it today?",
    options: [
      {
        id: "m1q13_a",
        label: "Understanding its current capabilities and limits",
      },
      {
        id: "m1q13_b",
        label: "Memorizing dates to pass without really understanding",
      },
      {
        id: "m1q13_c",
        label: "Programming an AI from scratch in one afternoon",
      },
      {
        id: "m1q13_d",
        label: "Nothing, history does not affect current use at all",
      },
    ],
    correctAnswer: "m1q13_a",
    topic: "AI History",
    difficulty: "medium",
    source: "What is AI and how it is changing the world",
    feedback:
      "History explains why AI came to generate content and where its limits are. Review the video 'What is AI and how it is changing the world'.",
  },
  {
    id: "m1q14",
    question: "Which of these is a typical capability of generative AI?",
    options: [
      {
        id: "m1q14_a",
        label: "Writing, summarizing and rewording texts from an instruction",
      },
      {
        id: "m1q14_b",
        label:
          "Guaranteeing that all the information given is verified and true",
      },
      {
        id: "m1q14_c",
        label: "Making legal and medical decisions without human supervision",
      },
      {
        id: "m1q14_d",
        label: "Accessing your personal memories and private files",
      },
    ],
    correctAnswer: "m1q14_a",
    topic: "Generative AI",
    difficulty: "medium",
    source: "What is AI and how it is changing the world",
    feedback:
      "It generates and transforms text, but it does not guarantee truth or replace your judgment. Review the video 'What is AI and how it is changing the world'.",
  },
];
