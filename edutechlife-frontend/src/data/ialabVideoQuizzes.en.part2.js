export const EN_PART2 = {
  "claude-video-proyectos-1": [
    {
      q: "What is a Project for?",
      options: [
        "Save instructions and files",
        "Uploading files with no limit",
        "Replacing Claude's memory",
      ],
      correct: 0,
      feedback: "A Project gathers the context of one specific piece of work.",
    },
    {
      q: "What should you check before connecting a tool?",
      options: [
        "Only that it has a nice logo",
        "What permissions it asks you for",
        "Nothing: it is always safe to use",
      ],
      correct: 1,
      feedback:
        "Connectors work with permissions you approve. Check them first.",
    },
    {
      q: "What can a Skill be?",
      options: [
        "A saved repeated process",
        "A backup password",
        "A model other than Claude",
      ],
      correct: 0,
      feedback: "A Skill turns a repeated procedure into something reusable.",
    },
  ],
  "herramientas-video-1": [
    {
      q: "What do you do with a figure from data analysis?",
      options: [
        "Use it directly; it is an automatic calculation",
        "Recalculate a few rows by hand and compare",
        "Ask for another figure until I like it",
      ],
      correct: 1,
      feedback:
        "Recalculating a few rows by hand confirms the analysis is correct.",
    },
    {
      q: "Which question should you ask before turning on a tool?",
      options: [
        "How many tools can I turn on at once?",
        "Which one is newest in the menu?",
        "How will I verify the result?",
      ],
      correct: 2,
      feedback: "If you cannot check the result, rethink the tool or the task.",
    },
    {
      q: "What data is OK to upload to a tool?",
      options: [
        "Only what you would show in a public document",
        "Everything that adds more context",
        "Personal data, to personalize",
      ],
      correct: 0,
      feedback: "Remove personal and confidential data first.",
    },
  ],
  "fachada-video-1": [
    {
      q: "What should you start with for work that repeats?",
      options: [
        "An agent that does it alone",
        "A Project with your instructions and files",
        "A GPT, without checking your account",
      ],
      correct: 1,
      feedback:
        "A Project stores instructions and files; also, OpenAI has scheduled the retirement of custom GPTs for December 11, 2026 (date subject to change).",
    },
    {
      q: "Which test checks that a GPT does not repeat data about minors?",
      options: ["Consistency", "Normal case", "Sensitive data"],
      correct: 2,
      feedback:
        "In the sensitive-data test, the GPT must not ask for or repeat personal data or data about minors.",
    },
    {
      q: "What is your role when an agent runs several steps?",
      options: [
        "Review the plan and approve the important actions",
        "Approve the final result without checking the steps",
        "Leave it alone to save time",
      ],
      correct: 0,
      feedback:
        "An early error spreads to the whole result: supervise the plan and the steps.",
    },
  ],
  "grounding-video-1": [
    {
      q: "What does grounding an answer mean?",
      options: [
        "The AI answers faster",
        "The AI backs what it says with real sources you can open",
        "The AI saves your questions",
      ],
      correct: 1,
      feedback:
        "Grounding means backing the answer with real sources you can open and check.",
    },
    {
      q: "An answer includes a figure with no source. What do you do?",
      options: [
        "Use it if it sounds confident",
        "Round it so it looks exact",
        "Ask for the source and open the link before using it",
      ],
      correct: 2,
      feedback:
        "A figure without a source is not evidence: ask for the source and open it.",
    },
    {
      q: "How many sources should you open to back the key conclusions?",
      options: ["At least three", "Only one", "None, if it sounds confident"],
      correct: 0,
      feedback: "Open at least three sources that support the key conclusions.",
    },
  ],
  "curaduria-video-1": [
    {
      q: "Which notebook usually answers better?",
      options: [
        "One with fifty messy documents",
        "One with five well-chosen sources",
        "One with sources from mixed dates",
      ],
      correct: 1,
      feedback: "A few well-chosen sources beat many messy ones.",
    },
    {
      q: "Which is a good source for your notebook?",
      options: [
        "An anonymous text with no date",
        "Loose notes that contradict each other",
        "An official report with a date and author",
      ],
      correct: 2,
      feedback: "A good source has an author, a date and verifiable backing.",
    },
    {
      q: "A notebook answer includes citations. What do you do?",
      options: [
        "Open at least one to check the passage",
        "Ignore them; they are already reliable",
        "Delete them so it looks clean",
      ],
      correct: 0,
      feedback:
        "An answer with citations still needs your judgment: open one and confirm.",
    },
  ],
};
