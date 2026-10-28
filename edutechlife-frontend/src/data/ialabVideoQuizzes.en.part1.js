export const EN_PART1 = {
  "intro-video-1": [
    {
      q: "What characterizes generative AI?",
      options: [
        "It creates new text, image or audio",
        "It only sorts data into fixed categories",
        "It replaces all human decisions",
      ],
      correct: 0,
      feedback:
        "Generative AI produces new content; it doesn't just classify or decide for you.",
    },
    {
      q: "If a prompt is vague and generic, what is usually missing?",
      options: [
        "More server speed available",
        "Context and specificity",
        "Changing language",
      ],
      correct: 1,
      feedback: "Context and specificity are what prevent generic answers.",
    },
    {
      q: "What is the student's role with AI?",
      options: [
        "Always accept the first answer",
        "Fully delegate decisions",
        "Review and validate the facts",
      ],
      correct: 2,
      feedback:
        "AI speeds up work, but review and the final decision are yours.",
    },
  ],
  "prompt-video-1": [
    {
      q: "Which formula structures a clear prompt?",
      options: [
        "RTF: Role + Task + Format",
        "HTML",
        "SQL, a language for databases",
      ],
      correct: 0,
      feedback:
        "RTF (Role, Task, Format) orders the instruction for clear answers.",
    },
    {
      q: "Why iterate on the prompt?",
      options: [
        "Because you must be right the first time",
        "Because each adjustment gets you closer",
        "Because the AI gets tired otherwise",
      ],
      correct: 1,
      feedback:
        "Iterating is part of the process: each tweak improves the result.",
    },
    {
      q: "What best defines prompt 'clarity'?",
      options: [
        "Using as many words as possible",
        "Less ambiguity, more precision",
        "Writing in capitals",
      ],
      correct: 1,
      feedback:
        "Clarity = less ambiguity, more precision about the expected result.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "What is ChatGPT?",
      options: ["A link search engine", "A text assistant", "A spreadsheet"],
      correct: 1,
      feedback:
        "ChatGPT is a conversational assistant based on a language model.",
    },
    {
      q: "What helps get better answers from ChatGPT?",
      options: [
        "Giving role, context and goal",
        "Writing a single word",
        "Repeating the same prompt unchanged",
      ],
      correct: 0,
      feedback: "Role, context and goal steer the answer.",
    },
    {
      q: "What is a good security practice with ChatGPT?",
      options: [
        "Sharing confidential data without checking",
        "Not uploading any unneeded sensitive info",
        "Trusting critical data without verifying",
      ],
      correct: 1,
      feedback:
        "Avoid exposing sensitive data and verify critical information.",
    },
  ],
  "gemini-video-1": [
    {
      q: "What does it mean that Gemini is multimodal?",
      options: [
        "It only reads text, and does it fast",
        "It reads text, images, audio and video at once",
        "It only works with Google documents",
      ],
      correct: 1,
      feedback:
        "Multimodal means it processes several kinds of material in the same conversation.",
    },
    {
      q: "What do you ask Gemini to check a figure in an image?",
      options: [
        "That it confirms it is right",
        "The exact place where the figure appears",
        "That it makes the image prettier",
      ],
      correct: 1,
      feedback:
        "Asking where the figure appears lets you open it and verify it in the evidence.",
    },
    {
      q: "Gemini gives a very confident answer about a blurry image. What do you do?",
      options: [
        "I accept it because it sounds confident",
        "I ask it to say what cannot be read",
        "I share it right away",
      ],
      correct: 1,
      feedback:
        "A confident answer about something blurry is a warning sign: ask what cannot be confirmed.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "What is the main advantage of Deep Research?",
      options: [
        "It answers from training data",
        "It analyzes many sources",
        "It avoids reading",
      ],
      correct: 1,
      feedback:
        "Deep Research tracks and cites sources: ideal for verifiable reports.",
    },
    {
      q: "Facing two different answers, what is most critical?",
      options: [
        "Choosing the longest",
        "Cross-checking sources",
        "Keeping only the first one",
      ],
      correct: 1,
      feedback: "Cross-checking with evidence is what gives rigor.",
    },
    {
      q: "What improves a research report?",
      options: [
        "Delimiting and citing each source",
        "Avoiding sources",
        "Copying and pasting without reviewing",
      ],
      correct: 0,
      feedback:
        "A delimited question + citations = rigorous, traceable report.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "What does Gemini Notebook base its answers on?",
      options: ["The whole internet", "The files you add", "Random chance"],
      correct: 1,
      feedback:
        "Gemini Notebook answers strictly from the documents you upload.",
    },
    {
      q: "What makes its answers special?",
      options: [
        "It quotes your own docs",
        "It ignores your files",
        "It generates images, too",
      ],
      correct: 0,
      feedback: "It cites your sources, which makes each fact easy to verify.",
    },
    {
      q: "If it can't find a fact you ask for, what does it mean?",
      options: [
        "It is not in your documents",
        "The tool is broken",
        "You should ask it to make it up",
      ],
      correct: 0,
      feedback:
        "Gemini Notebook does not invent: if it's not in your sources, it can't answer.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "What is an Audio Overview in Gemini Notebook?",
      options: ["An audio summary", "A PDF document", "A detailed data table"],
      correct: 0,
      feedback:
        "It turns your sources into a conversational summary to listen to.",
    },
    {
      q: "When is the audio most useful?",
      options: ["To study on the go", "To edit images", "To install software"],
      correct: 0,
      feedback: "It's ideal for passive review during commutes or chores.",
    },
    {
      q: "What should you do before generating the audio?",
      options: [
        "Curate good sources",
        "Upload nothing",
        "Upload files at random",
      ],
      correct: 0,
      feedback:
        "Audio quality depends on the quality and curation of your sources.",
    },
  ],
  "privacy-video-1": [
    {
      q: "What data should NOT be shared with a public AI?",
      options: ["Sensitive data", "A general question", "A public text"],
      correct: 0,
      feedback: "Avoid exposing sensitive personal or confidential data.",
    },
    {
      q: "What does data minimization mean?",
      options: [
        "Collect only what's needed",
        "Collect as much as possible",
        "Store data without limits",
      ],
      correct: 0,
      feedback: "Minimize = use only strictly necessary data.",
    },
    {
      q: "Who is responsible for protecting student data?",
      options: [
        "Nobody",
        "The institution and the user with good practices",
        "Only the AI, with no human control or review at all",
      ],
      correct: 1,
      feedback:
        "Protection is a shared responsibility between institution and user.",
    },
  ],
  "ethics-video-1": [
    {
      q: "What does the transparency principle imply?",
      options: [
        "Hiding that AI is used",
        "Clearly disclosing AI",
        "Hiding decisions",
      ],
      correct: 1,
      feedback: "Transparency is clearly informing the use of AI.",
    },
    {
      q: "What does 'accountability' mean?",
      options: [
        "That AI is solely responsible",
        "That humans are accountable",
        "That nobody is responsible",
      ],
      correct: 1,
      feedback: "There must be human owners and clear processes for outcomes.",
    },
    {
      q: "What does explainability seek?",
      options: [
        "Explainable decisions",
        "That the system never fails",
        "That it is faster",
      ],
      correct: 0,
      feedback:
        "Explainability = being able to understand and justify decisions.",
    },
  ],
  "claude-video-intro-1": [
    {
      q: "What is Claude in everyday use?",
      options: [
        "A search engine that only returns links",
        "An assistant that writes and analyzes",
        "A program that replaces human review",
      ],
      correct: 1,
      feedback:
        "Claude creates and analyzes from your instructions; the review stays yours.",
    },
    {
      q: "What improves a request's result the most?",
      options: [
        "Writing everything in capitals",
        "Give context and goals",
        "Asking faster",
      ],
      correct: 1,
      feedback:
        "Without context Claude has to guess. With goal, audience and format it gets closer.",
    },
    {
      q: "When should you review what Claude delivers most carefully?",
      options: [
        "When it is a style draft",
        "When it has figures, names",
        "Never; review is not needed",
      ],
      correct: 1,
      feedback:
        "Figures, names and decisions must always be checked against the source.",
    },
  ],
  "claude-artifacts-video-1": [
    {
      q: "What is an Artifact?",
      options: [
        "A piece Claude makes next to the chat",
        "A file that is deleted when you close the chat",
        "A password to share chats",
      ],
      correct: 0,
      feedback:
        "An Artifact lives next to the chat: you see it, edit it and share it.",
    },
    {
      q: "Which is the best request for a teacher guide?",
      options: [
        "Make something for teachers.",
        "A 2-page guide for new teachers",
        "Make it nice, long and complete.",
      ],
      correct: 1,
      feedback: "A complete request states format, audience, tone and limits.",
    },
    {
      q: "Claude gives you a figure. What do you do before sharing it?",
      options: [
        "I share it as it is, Claude calculated it",
        "I check it against its original source",
        "I change it so it looks better",
      ],
      correct: 1,
      feedback: "Figures must be checked against a source before sharing.",
    },
  ],
};
