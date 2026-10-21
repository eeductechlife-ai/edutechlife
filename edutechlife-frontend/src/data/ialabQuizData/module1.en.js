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
    source: "How to Create Effective Prompts: The Formula to Master AI",
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
    source: "Guide: Anatomy of a Prompt",
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
    source: "The Chisel",
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
    source: "How to Create Effective Prompts: The Formula to Master AI",
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
    source: "What is AI and how it is changing the world",
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
        label: "Because it adjusts the style and focus of the answer",
      },
      { id: "m1q8_b", label: "Because it makes the AI always answer shorter" },
      { id: "m1q8_c", label: "Because it stops the AI from needing context" },
      { id: "m1q8_d", label: "Because it is required for the AI to work" },
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
    source: "The Hammer",
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
    source: "The Chisel",
    feedback:
      "Asking for examples and simple language helps make the explanation clearer and more useful.",
  },
  {
    id: "m1q11",
    question:
      "A generative AI produces new text instead of only classifying data. What is the key difference?",
    options: [
      {
        id: "m1q11_a",
        label: "It creates original content from learned patterns",
      },
      {
        id: "m1q11_b",
        label: "It only copies and pastes texts that already exist online",
      },
      { id: "m1q11_c", label: "It works only with spreadsheets" },
      { id: "m1q11_d", label: "It does not need data to learn" },
    ],
    correctAnswer: "m1q11_a",
    topic: "Generative AI",
    difficulty: "easy",
    source: "What is AI and how it is changing the world",
    feedback:
      "Generative AI produces new content (text, image, audio) based on learned patterns. Watch the topic video.",
  },
  {
    id: "m1q12",
    question: "Which statement BEST describes generative AI?",
    options: [
      {
        id: "m1q12_a",
        label:
          "It learns patterns from large volumes of data and generates new answers",
      },
      {
        id: "m1q12_b",
        label:
          "It is a search engine that only returns a list of internet links",
      },
      {
        id: "m1q12_c",
        label:
          "It stores answers written by people and reuses them as they are",
      },
      {
        id: "m1q12_d",
        label: "It only translates texts from one language to another",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "Generative AI",
    difficulty: "easy",
    source: "What is AI and how it is changing the world",
    feedback:
      "It learns from data and generates new content; it does not retrieve stored answers. Review the topic video.",
  },
  {
    id: "m1q13",
    question:
      "What does knowing the beginnings of artificial intelligence add to how you use it today?",
    options: [
      {
        id: "m1q13_a",
        label:
          "Understanding where its current capabilities and limits come from",
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
      "History explains why AI came to generate content and where its limits are. Review 'Beginnings of Artificial Intelligence'.",
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
      "It generates and transforms text, but it does not guarantee truth or replace your judgment. Review topic 1.",
  },
  {
    id: "m1q15",
    question:
      "The AI states data with confidence even when it is false. What is this phenomenon called?",
    options: [
      {
        id: "m1q15_a",
        label:
          "Hallucination: it generates information that looks true but is not",
      },
      {
        id: "m1q15_b",
        label:
          "Automatic translation: it changes the language without checking meaning",
      },
      {
        id: "m1q15_c",
        label:
          "Data compression: it reduces file size so they are easier to send",
      },
      {
        id: "m1q15_d",
        label: "Real-time update: it checks the internet and shows live data",
      },
    ],
    correctAnswer: "m1q15_a",
    topic: "AI Limits",
    difficulty: "medium",
    source: "What is AI and how it is changing the world",
    feedback:
      "Hallucinations are plausible but incorrect answers. Always verify critical data.",
  },
  {
    id: "m1q16",
    question:
      "Before using a piece of data the AI gave you in a job, what is the most responsible step?",
    options: [
      {
        id: "m1q16_a",
        label: "Verify it in a reliable source before using it",
      },
      {
        id: "m1q16_b",
        label: "Use it anyway because the AI is almost never wrong",
      },
      { id: "m1q16_c", label: "Copy it as is without reviewing it at all" },
      {
        id: "m1q16_d",
        label: "Ask the same AI to confirm it and then trust it",
      },
    ],
    correctAnswer: "m1q16_a",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "The Chisel",
    feedback:
      "You are responsible for the result: verify important data in reliable sources.",
  },
  {
    id: "m1q17",
    question:
      "Which three basic elements should a prompt include to get good results?",
    options: [
      {
        id: "m1q17_a",
        label: "Role, task and format (or clear context)",
      },
      { id: "m1q17_b", label: "Greeting, emoji and farewell" },
      { id: "m1q17_c", label: "Password, username and date" },
      { id: "m1q17_d", label: "Topic, opinion and signature" },
    ],
    correctAnswer: "m1q17_a",
    topic: "Prompt Fundamentals",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Role (who the AI is), task (what you want) and format (how you want it). Review the Prompt Anatomy guide.",
  },
  {
    id: "m1q18",
    question: "What is context in a prompt for?",
    options: [
      {
        id: "m1q18_a",
        label: "So the answer fits your real situation",
      },
      {
        id: "m1q18_b",
        label: "So the AI writes more text without any meaning",
      },
      { id: "m1q18_c", label: "So the AI takes less time to respond" },
      { id: "m1q18_d", label: "So you do not have to state the task at all" },
    ],
    correctAnswer: "m1q18_a",
    topic: "Prompt Structure",
    difficulty: "medium",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Context (goal, audience, situation) steers the answer toward what you need.",
  },
  {
    id: "m1q19",
    question: "Which prompt is MORE specific?",
    options: [
      {
        id: "m1q19_a",
        label:
          '"Summarize in 5 bullets the risks of a sedentary life for older adults"',
      },
      {
        id: "m1q19_b",
        label:
          '"Tell me about health in general and other similar topics you can think of"',
      },
      {
        id: "m1q19_c",
        label:
          '"Give me varied and extensive information on many topics of general interest"',
      },
      {
        id: "m1q19_d",
        label:
          '"Write something interesting and useful I can use in my daily work"',
      },
    ],
    correctAnswer: "m1q19_a",
    topic: "Prompt Clarity",
    difficulty: "easy",
    source: "How to Create Effective Prompts: The Formula to Master AI",
    feedback:
      "A defines topic, format and audience; the others are vague. Review 'How to Create Effective Prompts'.",
  },
  {
    id: "m1q20",
    question:
      "You need the answer in a table. What should you state in the prompt?",
    options: [
      {
        id: "m1q20_a",
        label: "The output format: a table with specific columns",
      },
      { id: "m1q20_b", label: "That it should respond as fast as possible" },
      { id: "m1q20_c", label: "Only the first letter of each idea" },
      { id: "m1q20_d", label: "That it should not use numbers or details" },
    ],
    correctAnswer: "m1q20_a",
    topic: "Output Format",
    difficulty: "medium",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Stating the format (table, bullets, length) makes the AI deliver exactly what you need.",
  },
  {
    id: "m1q21",
    question:
      "You will share the answer with elementary school students. What should you specify?",
    options: [
      {
        id: "m1q21_a",
        label: "The audience and the appropriate language level",
      },
      { id: "m1q21_b", label: "The background color of the tool" },
      { id: "m1q21_c", label: "The brand of your computer" },
      { id: "m1q21_d", label: "The language of the operating system" },
    ],
    correctAnswer: "m1q21_a",
    topic: "Audience",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "Stating the audience (children) and language level adjusts tone and complexity.",
  },
  {
    id: "m1q22",
    question:
      "The first answer is not what you want. What is the best strategy?",
    options: [
      {
        id: "m1q22_a",
        label: "Adjust the prompt with more detail and ask again",
      },
      { id: "m1q22_b", label: "Give up because the AI is not good for this" },
      { id: "m1q22_c", label: "Repeat the same prompt many times in a row" },
      { id: "m1q22_d", label: "Switch tools without changing the prompt" },
    ],
    correctAnswer: "m1q22_a",
    topic: "Prompt Refinement",
    difficulty: "easy",
    source: "The Hammer",
    feedback:
      "Iterating the prompt is part of the work. Practice in the Live Prompt Lab.",
  },
  {
    id: "m1q23",
    question:
      "You want a short explanation: 'in no more than 100 words'. What are you using?",
    options: [
      { id: "m1q23_a", label: "A length constraint in the prompt" },
      { id: "m1q23_b", label: "An error that breaks the AI" },
      { id: "m1q23_c", label: "A type of file" },
      { id: "m1q23_d", label: "A password for the tool" },
    ],
    correctAnswer: "m1q23_a",
    topic: "Constraints",
    difficulty: "medium",
    source: "How to Create Effective Prompts: The Formula to Master AI",
    feedback:
      "Constraints (length, tone, audience) narrow the answer to the desired result.",
  },
  {
    id: "m1q24",
    question:
      "Including an example of the expected result inside the prompt serves to…",
    options: [
      {
        id: "m1q24_a",
        label: "Guide the AI with the style and structure you want to get",
      },
      {
        id: "m1q24_b",
        label: "Make the AI completely ignore the example you gave it",
      },
      {
        id: "m1q24_c",
        label: "Force the AI to answer in a different language than yours",
      },
      {
        id: "m1q24_d",
        label: "Have no real effect on the result the AI delivers",
      },
    ],
    correctAnswer: "m1q24_a",
    topic: "Examples in Prompts",
    difficulty: "hard",
    source: "The Hammer",
    feedback:
      "Giving an example (few-shot) helps the AI copy the expected style/format without guessing.",
  },
  {
    id: "m1q25",
    question:
      "The text is for a formal report. What should you state in the prompt?",
    options: [
      { id: "m1q25_a", label: "The tone: formal and professional" },
      { id: "m1q25_b", label: "That it should use emojis and slang" },
      { id: "m1q25_c", label: "That it should write like in a friends' chat" },
      { id: "m1q25_d", label: "That it should omit all the details" },
    ],
    correctAnswer: "m1q25_a",
    topic: "Prompt Tone",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Tone (formal/informal, technical/close) adjusts the register of the answer.",
  },
  {
    id: "m1q26",
    question:
      'Prompt: "Do something about marketing." What is the main problem?',
    options: [
      {
        id: "m1q26_a",
        label: "It is ambiguous: it does not state task, format or goal",
      },
      {
        id: "m1q26_b",
        label: "It is too long and contains too much irrelevant data",
      },
      {
        id: "m1q26_c",
        label: "It includes too many examples that end up confusing the AI",
      },
      {
        id: "m1q26_d",
        label: "It uses a tone that is too formal for the target audience",
      },
    ],
    correctAnswer: "m1q26_a",
    topic: "Avoiding Ambiguity",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "Without task, format or goal, the AI guesses. Be specific and narrow the result.",
  },
  {
    id: "m1q27",
    question:
      "What is the difference between asking only the task and asking role + task?",
    options: [
      {
        id: "m1q27_a",
        label: "The role guides the focus and style of the answer",
      },
      {
        id: "m1q27_b",
        label:
          "There is no real difference between asking role or only the task",
      },
      {
        id: "m1q27_c",
        label: "The role makes the AI answer with less detail than before",
      },
      {
        id: "m1q27_d",
        label: "The role completely replaces the task you asked for",
      },
    ],
    correctAnswer: "m1q27_a",
    topic: "RTF Method",
    difficulty: "medium",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "The role ('act as…') gives focus; the task says what to do. Together they improve the result.",
  },
  {
    id: "m1q28",
    question:
      "You want a summary for management. Which prompt is MOST appropriate?",
    options: [
      {
        id: "m1q28_a",
        label:
          '"Summarize this report in 5 executive bullets for non-technical management"',
      },
      {
        id: "m1q28_b",
        label:
          '"Summarize this in whatever way you think is best and with no limits"',
      },
      {
        id: "m1q28_c",
        label:
          '"Write a lot of text about the report and all its technical details"',
      },
      {
        id: "m1q28_d",
        label: '"Translate the report into another language so it is clearer"',
      },
    ],
    correctAnswer: "m1q28_a",
    topic: "RTF Application",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "A defines format (bullets), length (5) and audience (management). It is the most useful and clear.",
  },
  {
    id: "m1q29",
    question:
      "You want 10 ideas for a campaign. Which prompt will give you better ideas?",
    options: [
      {
        id: "m1q29_a",
        label:
          '"Generate 10 campaign ideas for a local coffee shop, close tone, in bullets"',
      },
      {
        id: "m1q29_b",
        label:
          '"Give me varied ideas about marketing for businesses of any kind"',
      },
      {
        id: "m1q29_c",
        label: '"What do you think about marketing and how companies use it?"',
      },
      {
        id: "m1q29_d",
        label: '"Write a long, detailed essay about modern advertising"',
      },
    ],
    correctAnswer: "m1q29_a",
    topic: "Prompt Application",
    difficulty: "easy",
    source: "The Hammer",
    feedback:
      "A specifies amount, context, tone and format: that focuses the ideas on what you need.",
  },
  {
    id: "m1q30",
    question:
      "You want to learn a topic step by step. Which prompt helps most?",
    options: [
      {
        id: "m1q30_a",
        label:
          '"Explain it step by step, with an example in each step and simple language"',
      },
      {
        id: "m1q30_b",
        label: '"Give me all the theory in one dense paragraph"',
      },
      {
        id: "m1q30_c",
        label: '"Tell me about several topics at the same time"',
      },
      {
        id: "m1q30_d",
        label: '"Summarize the topic in just a single short sentence"',
      },
    ],
    correctAnswer: "m1q30_a",
    topic: "Prompt Application",
    difficulty: "medium",
    source: "The Hammer",
    feedback:
      "Asking for steps, examples and simple language produces a clearer, more applicable explanation.",
  },
  {
    id: "m1q31",
    question: "What is a common mistake when writing prompts?",
    options: [
      {
        id: "m1q31_a",
        label: "Asking vaguely without goal, audience or format",
      },
      {
        id: "m1q31_b",
        label:
          "Clearly stating the role the artificial intelligence should take",
      },
      {
        id: "m1q31_c",
        label: "Clarifying the exact format and length you expect to receive",
      },
      {
        id: "m1q31_d",
        label: "Giving a concrete example of the result you want to get",
      },
    ],
    correctAnswer: "m1q31_a",
    topic: "Common Mistakes",
    difficulty: "medium",
    source: "How to Create Effective Prompts: The Formula to Master AI",
    feedback:
      "Vagueness is the most common mistake: without goal, audience or format the AI guesses.",
  },
  {
    id: "m1q32",
    question:
      "A prompt includes a lot of irrelevant information. What effect does it have?",
    options: [
      {
        id: "m1q32_a",
        label: "It confuses the AI and steers the answer away from the goal",
      },
      {
        id: "m1q32_b",
        label: "It always improves the quality of the result the AI delivers",
      },
      {
        id: "m1q32_c",
        label: "It has no real effect on the final answer at all",
      },
      {
        id: "m1q32_d",
        label: "It forces the AI to answer much faster than before",
      },
    ],
    correctAnswer: "m1q32_a",
    topic: "Prompt Structure",
    difficulty: "hard",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Less is more: include only what is relevant (task, context, format) to keep the goal clear.",
  },
  {
    id: "m1q33",
    question: "Saving and reusing good prompt templates serves to…",
    options: [
      {
        id: "m1q33_a",
        label: "Save time and keep results consistent",
      },
      { id: "m1q33_b", label: "Make the AI stop learning over time" },
      { id: "m1q33_c", label: "Avoid having to review the results at all" },
      { id: "m1q33_d", label: "Prevent adjusting the prompt afterwards" },
    ],
    correctAnswer: "m1q33_a",
    topic: "Reuse",
    difficulty: "medium",
    source: "The Hammer",
    feedback:
      "Reusable templates save time and make results consistent; adjust them for each case.",
  },
  {
    id: "m1q34",
    question:
      "The AI gives you two different answers to the same prompt. What is the most critical step?",
    options: [
      {
        id: "m1q34_a",
        label: "Compare and validate the information before deciding",
      },
      { id: "m1q34_b", label: "Choose the longest one without reading it" },
      { id: "m1q34_c", label: "Trust the first one that comes out" },
      { id: "m1q34_d", label: "Ask another AI which of the two it prefers" },
    ],
    correctAnswer: "m1q34_a",
    topic: "Critical Evaluation",
    difficulty: "hard",
    source: "The Chisel",
    feedback:
      "When answers diverge, validate the data and use your judgment. Not every answer is equally reliable.",
  },
  {
    id: "m1q35",
    question:
      "You are about to paste confidential company information into the AI. What should you do?",
    options: [
      {
        id: "m1q35_a",
        label: "Avoid sensitive data or anonymize it before using it",
      },
      { id: "m1q35_b", label: "Paste it anyway without any problem" },
      { id: "m1q35_c", label: "Ask the AI to delete it afterwards" },
      { id: "m1q35_d", label: "Share it only through a private chat" },
    ],
    correctAnswer: "m1q35_a",
    topic: "Responsible Use",
    difficulty: "medium",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Do not share confidential data: anonymize or avoid sensitive information before asking the AI for help.",
  },
  {
    id: "m1q36",
    question:
      "The AI answers with bias or incomplete information. What is the best action?",
    options: [
      {
        id: "m1q36_a",
        label: "Question it, ask for other perspectives and check sources",
      },
      {
        id: "m1q36_b",
        label: "Accept it as is because the AI is always neutral and objective",
      },
      {
        id: "m1q36_c",
        label:
          "Publish it as is without reviewing because the topic is not sensitive",
      },
      {
        id: "m1q36_d",
        label: "Ignore the detected bias and continue with the next task",
      },
    ],
    correctAnswer: "m1q36_a",
    topic: "Critical Thinking",
    difficulty: "hard",
    source: "What is AI and how it is changing the world",
    feedback:
      "AI can be biased: contrast, ask for other perspectives and validate. You bring the judgment.",
  },
  {
    id: "m1q37",
    question: "What is the most honest use of AI in academic work?",
    options: [
      {
        id: "m1q37_a",
        label: "Use it as support and declare when you used it",
      },
      {
        id: "m1q37_b",
        label: "Submit its output as your own without reviewing it",
      },
      { id: "m1q37_c", label: "Copy it without citing any part of it" },
      { id: "m1q37_d", label: "Use it to impersonate another person" },
    ],
    correctAnswer: "m1q37_a",
    topic: "Ethics and Responsible Use",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "AI is support: review it, add your own value and be transparent about its use.",
  },
  {
    id: "m1q38",
    question:
      "AI is an assistant, not a replacement. What does this mean for the student?",
    options: [
      {
        id: "m1q38_a",
        label: "Review and decide the final result with your own judgment",
      },
      {
        id: "m1q38_b",
        label: "Accept everything the AI delivers without reviewing it first",
      },
      {
        id: "m1q38_c",
        label: "Delegate all important decisions to the AI completely",
      },
      {
        id: "m1q38_d",
        label:
          "Avoid learning the topic because the AI already solves everything",
      },
    ],
    correctAnswer: "m1q38_a",
    topic: "Responsible Use",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "AI speeds up the work, but the review and the final decision are yours.",
  },
  {
    id: "m1q39",
    question:
      "Iterating the prompt several times until reaching the goal is a…",
    options: [
      {
        id: "m1q39_a",
        label:
          "Recommended practice: it improves the result with each adjustment",
      },
      {
        id: "m1q39_b",
        label: "Wrong practice: you have to get it right the first time",
      },
      { id: "m1q39_c", label: "Forbidden practice in the tools" },
      {
        id: "m1q39_d",
        label: "Optional, only if the first answer comes out wrong",
      },
    ],
    correctAnswer: "m1q39_a",
    topic: "Prompt Refinement",
    difficulty: "medium",
    source: "The Hammer",
    feedback:
      "Iterating is normal and effective: each prompt adjustment brings the answer closer to what you need.",
  },
  {
    id: "m1q40",
    question:
      "Case: you need an email to remind about a meeting. Which prompt gathers the MOST quality elements?",
    options: [
      {
        id: "m1q40_a",
        label:
          '"Act as an executive assistant; write a formal reminder email for the meeting on Thursday at 10 a.m., cordial tone and subject included"',
      },
      {
        id: "m1q40_b",
        label:
          '"Write a short email to remind a teammate of yours about a work meeting tomorrow"',
      },
      {
        id: "m1q40_c",
        label:
          '"Draft a simple message to announce we will have a meeting soon, no more details"',
      },
      {
        id: "m1q40_d",
        label:
          '"Write a text about work meetings and explain their importance in modern companies today"',
      },
    ],
    correctAnswer: "m1q40_a",
    topic: "RTF Application",
    difficulty: "hard",
    source: "The Hammer",
    feedback:
      "A gathers role, task, context (date/time), tone, format/length and subject: a complete, professional prompt.",
  },

  {
    id: "m1e01",
    question:
      "A hiring system was trained on data from a mostly male company and penalized CVs with certain terms. What bias appears and where does it start?",
    options: [
      {
        id: "m1e01_a",
        label: "Sampling bias, starting in the training data",
      },
      {
        id: "m1e01_b",
        label: "Automation bias, due to a lack of human review",
      },
      {
        id: "m1e01_c",
        label: "Confirmation bias, from the recruiter's prior ideas",
      },
      {
        id: "m1e01_d",
        label: "Labeling bias, from wrong annotators",
      },
    ],
    correctAnswer: "m1e01_a",
    topic: "AI Bias",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "The historical data did not represent the population, so the bias began in collection. Review the bias lab.",
  },
  {
    id: "m1e02",
    question:
      "An AI gives a diagnosis that contradicts your professional judgment. How do you act?",
    options: [
      {
        id: "m1e02_a",
        label: "I question the AI and consult other experts",
      },
      {
        id: "m1e02_b",
        label: "I accept the AI because it is smarter",
      },
      {
        id: "m1e02_c",
        label: "I let the AI decide the treatment",
      },
      {
        id: "m1e02_d",
        label: "I restart the system and ask again",
      },
    ],
    correctAnswer: "m1e02_a",
    topic: "Responsibility",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Do not fall for automation bias: your professional judgment is irreplaceable.",
  },
  {
    id: "m1e03",
    question:
      "A bank rejects a loan with AI and does not explain why. Which principle is violated?",
    options: [
      {
        id: "m1e03_a",
        label: "Transparency and explainability of the decision",
      },
      {
        id: "m1e03_b",
        label: "Privacy, by hiding the use of the AI",
      },
      {
        id: "m1e03_c",
        label: "The speed of the decision process",
      },
      {
        id: "m1e03_d",
        label: "Efficiency, by using human analysts",
      },
    ],
    correctAnswer: "m1e03_a",
    topic: "Transparency",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "People have the right to understand automatic decisions that affect them. Review the code of ethics.",
  },
  {
    id: "m1e04",
    question:
      "A distracted driver trusts the autopilot and has an accident. What bias does this describe?",
    options: [
      {
        id: "m1e04_a",
        label: "Automation bias: they trusted without critical review",
      },
      {
        id: "m1e04_b",
        label: "Sampling bias in the training data",
      },
      {
        id: "m1e04_c",
        label: "Algorithmic bias against certain objects",
      },
      {
        id: "m1e04_d",
        label: "A normal human error with no bias",
      },
    ],
    correctAnswer: "m1e04_a",
    topic: "Automation Bias",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Automation bias is trusting the machine too much. Keep active supervision.",
  },
  {
    id: "m1e05",
    question:
      "A high-risk AI system (for example, approving a mortgage) under the EU must comply with:",
    options: [
      {
        id: "m1e05_a",
        label: "Conformity assessment and human supervision",
      },
      {
        id: "m1e05_b",
        label: "A total ban on using AI in that case",
      },
      {
        id: "m1e05_c",
        label: "Voluntary registration with no obligations",
      },
      {
        id: "m1e05_d",
        label: "Paying an annual fee to use it",
      },
    ],
    correctAnswer: "m1e05_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "High-risk systems require transparency, documentation and human supervision. Review the regulatory framework.",
  },
  {
    id: "m1e06",
    question:
      "What are the 4 key ethical principles that guide the responsible use of AI?",
    options: [
      {
        id: "m1e06_a",
        label: "Transparency, fairness, accountability and privacy",
      },
      {
        id: "m1e06_b",
        label: "Speed, savings, automation and efficiency",
      },
      {
        id: "m1e06_c",
        label: "Popularity, profit, scale and competition",
      },
      {
        id: "m1e06_d",
        label: "Innovation, investment, patent and ownership",
      },
    ],
    correctAnswer: "m1e06_a",
    topic: "Ethical Principles",
    difficulty: "easy",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Transparency, fairness, accountability and privacy are the pillars. Review the principles video.",
  },
  {
    id: "m1e07",
    question: "What is sampling bias in an AI model?",
    options: [
      {
        id: "m1e07_a",
        label: "The training data does not represent the whole population",
      },
      {
        id: "m1e07_b",
        label: "The system runs slowly with very large databases",
      },
      {
        id: "m1e07_c",
        label: "The model switches language without you asking it to",
      },
      {
        id: "m1e07_d",
        label: "The model retrains itself with every user query",
      },
    ],
    correctAnswer: "m1e07_a",
    topic: "Bias in AI",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Sampling bias comes from unrepresentative data. Practice in the bias lab.",
  },
  {
    id: "m1e08",
    question: "What is labeling bias?",
    options: [
      {
        id: "m1e08_a",
        label:
          "Training labels carry the prejudices of the people who create them",
      },
      {
        id: "m1e08_b",
        label: "The system classifies the data automatically and neutrally",
      },
      {
        id: "m1e08_c",
        label: "The AI puts a visible label on each generated answer",
      },
      {
        id: "m1e08_d",
        label: "The model disables the labels when there is a lot of data",
      },
    ],
    correctAnswer: "m1e08_a",
    topic: "Bias in AI",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "If the labeler has biases, the model learns them. Review the bias lab.",
  },
  {
    id: "m1e09",
    question:
      "An AI systematically penalizes a certain group in hiring. What do you do?",
    options: [
      {
        id: "m1e09_a",
        label: "Stop the system, document the bias and correct the data",
      },
      {
        id: "m1e09_b",
        label: "Ignore it because the model works fast and cheap",
      },
      {
        id: "m1e09_c",
        label: "Hide the results in order to avoid legal complaints",
      },
      {
        id: "m1e09_d",
        label: "Upload more of the same historical data to the affected system",
      },
    ],
    correctAnswer: "m1e09_a",
    topic: "Bias Mitigation",
    difficulty: "hard",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "When bias is detected, stop, document and correct. Practice in the bias lab.",
  },
  {
    id: "m1e10",
    question: "What does the explainability of an AI model aim for?",
    options: [
      {
        id: "m1e10_a",
        label: "That automatic decisions can be justified to people",
      },
      {
        id: "m1e10_b",
        label: "That the model explains why it consumes so many resources",
      },
      {
        id: "m1e10_c",
        label: "That the system summarizes its answers in fewer words",
      },
      {
        id: "m1e10_d",
        label: "That its answers can be translated into other languages",
      },
    ],
    correctAnswer: "m1e10_a",
    topic: "Explainability",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Explainability lets you justify decisions to the people affected. Review the code of ethics.",
  },
  {
    id: "m1e11",
    question:
      "A medical AI suggests a treatment. What is the best supervision practice?",
    options: [
      {
        id: "m1e11_a",
        label:
          "A professional validates the suggestion before applying it to the patient",
      },
      {
        id: "m1e11_b",
        label: "Applying the recommended treatment without any review at all",
      },
      {
        id: "m1e11_c",
        label: "Discarding the AI because it can never be useful in health",
      },
      {
        id: "m1e11_d",
        label: "Letting the patient decide without consulting anyone",
      },
    ],
    correctAnswer: "m1e11_a",
    topic: "Human Supervision",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "In critical areas, a professional validates the final decision. Review the principles video.",
  },
  {
    id: "m1e12",
    question: "What is privacy by design?",
    options: [
      {
        id: "m1e12_a",
        label: "Building data protection in from the very start of the system",
      },
      {
        id: "m1e12_b",
        label: "Adding privacy only if there is a user complaint",
      },
      {
        id: "m1e12_c",
        label: "Hiding the data use in the small print of the contract",
      },
      {
        id: "m1e12_d",
        label: "Collecting everything and deciding privacy at the end",
      },
    ],
    correctAnswer: "m1e12_a",
    topic: "Privacy by Design",
    difficulty: "medium",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Privacy is designed in from the start, not added at the end. Review the privacy manual.",
  },
  {
    id: "m1e13",
    question: "How are AI systems classified by risk level (EU)?",
    options: [
      {
        id: "m1e13_a",
        label: "Unacceptable, high, limited and minimal risk",
      },
      {
        id: "m1e13_b",
        label: "Small, medium, large and gigantic risk",
      },
      {
        id: "m1e13_c",
        label: "Technical, human and financial risk only",
      },
      {
        id: "m1e13_d",
        label: "Public, private and confidential risk only",
      },
    ],
    correctAnswer: "m1e13_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "The EU distinguishes unacceptable, high, limited and minimal risk. Review the code of ethics.",
  },
  {
    id: "m1e14",
    question: "A high-risk AI system must, among other things…",
    options: [
      {
        id: "m1e14_a",
        label: "Be documented, evaluated and have human supervision",
      },
      {
        id: "m1e14_b",
        label: "Work with no registration or evaluation of any kind",
      },
      {
        id: "m1e14_c",
        label: "Operate only at night to consume less energy",
      },
      {
        id: "m1e14_d",
        label: "Publish all of its code openly as a mandatory rule",
      },
    ],
    correctAnswer: "m1e14_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "High risk requires documentation, evaluation and human supervision. Review the framework.",
  },
  {
    id: "m1e15",
    question: "What is a bias audit in an AI system?",
    options: [
      {
        id: "m1e15_a",
        label:
          "Systematically checking whether the model treats any group unfairly",
      },
      {
        id: "m1e15_b",
        label: "Measuring only the response speed of the whole system",
      },
      {
        id: "m1e15_c",
        label: "Checking how many registered users the platform has",
      },
      {
        id: "m1e15_d",
        label: "Verifying only the monthly cost of the tool",
      },
    ],
    correctAnswer: "m1e15_a",
    topic: "Audit",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Auditing bias means checking whether any group ends up harmed. Practice in the bias lab.",
  },
  {
    id: "m1e16",
    question: "Which is an UNETHICAL use of AI?",
    options: [
      {
        id: "m1e16_a",
        label:
          "Impersonating a person's identity with generated voice or image",
      },
      {
        id: "m1e16_b",
        label: "Summarizing your own report for a work meeting",
      },
      {
        id: "m1e16_c",
        label: "Checking the spelling of a text before publishing it",
      },
      {
        id: "m1e16_d",
        label: "Generating ideas for a personal learning project",
      },
    ],
    correctAnswer: "m1e16_a",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Impersonating identities with AI is unethical and can be illegal. Review the principles video.",
  },
  {
    id: "m1e17",
    question:
      "An educational chatbot starts giving inappropriate answers to minors. What do you do?",
    options: [
      {
        id: "m1e17_a",
        label: "Pause the system, investigate and add content safeguards",
      },
      {
        id: "m1e17_b",
        label: "Let it keep running and warn only if someone complains",
      },
      {
        id: "m1e17_c",
        label: "Remove moderation so that it answers with more freedom",
      },
      {
        id: "m1e17_d",
        label: "Blame the minors for the way they use the system",
      },
    ],
    correctAnswer: "m1e17_a",
    topic: "Safeguards",
    difficulty: "hard",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "With minors, pause, investigate and strengthen content safeguards. Review the dilemmas lab.",
  },
  {
    id: "m1e18",
    question:
      "The AI suggests a decision that affects many people. Which principle requires reviewing it?",
    options: [
      {
        id: "m1e18_a",
        label: "Accountability and transparency with human supervision",
      },
      {
        id: "m1e18_b",
        label: "Efficiency, to settle the case in the shortest possible time",
      },
      {
        id: "m1e18_c",
        label: "Scalability, so the AI decides the largest possible volume",
      },
      {
        id: "m1e18_d",
        label: "Automation, to eliminate the intervention of people",
      },
    ],
    correctAnswer: "m1e18_a",
    topic: "Accountability",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "High-impact decisions require transparency and human supervision. Review the principles video.",
  },
  {
    id: "m1e19",
    question: "What characterizes limited-risk AI systems (EU)?",
    options: [
      {
        id: "m1e19_a",
        label: "Transparency obligations, without being high risk",
      },
      {
        id: "m1e19_b",
        label: "A total ban on their use in any possible context",
      },
      {
        id: "m1e19_c",
        label: "A special license requirement in order to develop them",
      },
      {
        id: "m1e19_d",
        label: "A ban on publishing that AI is being used in them",
      },
    ],
    correctAnswer: "m1e19_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Limited risk requires transparency, not prohibition. Review the code of ethics.",
  },
  {
    id: "m1e20",
    question:
      "An employee uses AI to decide about people without leaving a trace. What is breached?",
    options: [
      {
        id: "m1e20_a",
        label: "The traceability and the accountability of the decisions",
      },
      {
        id: "m1e20_b",
        label: "The speed of the process for settling that single case",
      },
      {
        id: "m1e20_c",
        label: "The popularity of the system among the internal users",
      },
      {
        id: "m1e20_d",
        label: "The operating cost of keeping that tool active",
      },
    ],
    correctAnswer: "m1e20_a",
    topic: "Accountability",
    difficulty: "hard",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "Without traceability there is no possible accountability. Review the ethical dilemmas lab.",
  },
];
