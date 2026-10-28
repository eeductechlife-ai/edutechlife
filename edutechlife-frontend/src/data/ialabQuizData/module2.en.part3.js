export const MODULE_2_EN_PART3 = [
  {
    id: "m2q29",
    question:
      "You want the assistant to answer in your brand's tone. What do you put in its instructions?",
    options: [
      {
        id: "m2q29_a",
        label: "Two or three sample answers in that tone",
      },
      {
        id: "m2q29_b",
        label: "The sentence «use a friendly, professional tone»",
      },
      {
        id: "m2q29_c",
        label: "The brand's name, so it infers its style",
      },
      {
        id: "m2q29_d",
        label: "A long list of forbidden words",
      },
    ],
    correctAnswer: "m2q29_a",
    topic: "Instructions",
    difficulty: "medium",
    source: "The Project Workshop",
    feedback:
      "Examples show the tone in action and teach more than adjectives: «friendly» or «professional» mean different things to different people. The brand's name or a list of forbidden words don't show it how it should sound.",
  },
  {
    id: "m2q30",
    question:
      "You ask the agent to book a room and send the invitation to 20 people. How do you supervise it?",
    options: [
      {
        id: "m2q30_a",
        label: "I review its plan and approve key steps, like sending",
      },
      {
        id: "m2q30_b",
        label: "I give it full access and check the result at the end",
      },
      {
        id: "m2q30_c",
        label: "I ask it to be quick and to tell me if something fails",
      },
      {
        id: "m2q30_d",
        label: "I let it work alone, because the task is simple",
      },
    ],
    correctAnswer: "m2q30_a",
    topic: "Agent",
    difficulty: "medium",
    source: "Guide: GPTs, Projects and agents",
    feedback:
      "The agent executes and you approve: reviewing its plan and confirming the steps that have effects, like sending invitations, prevents mistakes that can't be undone. Checking at the end or waiting for a failure notice comes too late.",
  },
  {
    id: "m2q31",
    question: "What tells you whether a support assistant answers well?",
    options: [
      {
        id: "m2q31_a",
        label: "Counting how many answers it gave in a day",
      },
      {
        id: "m2q31_b",
        label: "Measuring only response time, even if it is wrong",
      },
      {
        id: "m2q31_c",
        label: "Reviewing a sample of answers against written criteria",
      },
      {
        id: "m2q31_d",
        label: "Asking the assistant to grade itself",
      },
    ],
    correctAnswer: "m2q31_c",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "Complete ChatGPT Guide",
    feedback:
      "A reviewed sample with written criteria measures quality. Volume and speed do not tell you whether an answer is right.",
  },
  {
    id: "m2q32",
    question:
      "An assistant must use customer data. What is the most suitable practice?",
    options: [
      {
        id: "m2q32_a",
        label: "Using only the data needed and anonymizing it",
      },
      {
        id: "m2q32_b",
        label: "Uploading the full database with names and phone numbers",
      },
      {
        id: "m2q32_c",
        label: "Sharing access with anyone on the team",
      },
      {
        id: "m2q32_d",
        label: "Storing the data in the platform's public chat",
      },
    ],
    correctAnswer: "m2q32_a",
    topic: "GPT Privacy",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Using only what is needed and anonymizing it protects your customers' personal data.",
  },
  {
    id: "m2q33",
    question:
      "When is it right for the assistant to answer alone, without a person?",
    options: [
      {
        id: "m2q33_a",
        label: "For simple complaints, if it already handled similar ones well",
      },
      {
        id: "m2q33_b",
        label: "For frequent questions with reviewed answers and a clear limit",
      },
      {
        id: "m2q33_c",
        label: "For frequent questions, with answers it drafts on the spot",
      },
      {
        id: "m2q33_d",
        label: "For every inquiry outside business hours",
      },
    ],
    correctAnswer: "m2q33_b",
    topic: "Automation",
    difficulty: "hard",
    source: "The Toolbox",
    feedback:
      "It can answer alone when the questions are frequent, the answers are already reviewed and there is a clear limit on what it answers; the rest goes to a person. A complaint, even if it seems simple, can hide a risk, and nobody reviewed an answer drafted on the spot.",
  },
  {
    id: "m2q34",
    question:
      "A six-month-old tutorial recommends a model that doesn't appear in your account. What do you do?",
    options: [
      {
        id: "m2q34_a",
        label: "Look for a way to turn on that exact model",
      },
      {
        id: "m2q34_b",
        label: "Use the ones my account's model picker shows today",
      },
      {
        id: "m2q34_c",
        label: "Wait for that model to return before starting",
      },
      {
        id: "m2q34_d",
        label: "Follow the tutorial with the model whose name is closest",
      },
    ],
    correctAnswer: "m2q34_b",
    topic: "Models",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Models change often, and your account's model picker shows the ones you can use today. Chasing or waiting for an old tutorial's model holds you back, and a similar name doesn't guarantee the same model.",
  },
  {
    id: "m2q35",
    question: "What is the best way to ask ChatGPT for something?",
    options: [
      {
        id: "m2q35_a",
        label: "With a clear prompt stating task, context and format",
      },
      {
        id: "m2q35_b",
        label: "With a single loose word and hoping that it guesses well",
      },
      {
        id: "m2q35_c",
        label: "By repeating the same message many times",
      },
      {
        id: "m2q35_d",
        label: "By typing in capital letters so that it understands better",
      },
    ],
    correctAnswer: "m2q35_a",
    topic: "ChatGPT Basics",
    difficulty: "easy",
    source: "ChatGPT in practice",
    feedback:
      "Task, context and format: a clear instruction works best. Review the intro video.",
  },
  {
    id: "m2q36",
    question:
      "You find a tutorial that teaches how to create a custom GPT. What currency fact do you keep in mind?",
    options: [
      {
        id: "m2q36_a",
        label: "OpenAI scheduled their retirement for December 11, 2026",
      },
      {
        id: "m2q36_b",
        label: "OpenAI announced they will stay unchanged in 2027",
      },
      {
        id: "m2q36_c",
        label:
          "OpenAI will migrate them on its own, without you doing anything",
      },
      {
        id: "m2q36_d",
        label: "OpenAI retired them in 2024 and they no longer work",
      },
    ],
    correctAnswer: "m2q36_a",
    topic: "GPT retirement",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "The currency note in lesson 1 says OpenAI scheduled the retirement of custom GPTs for December 11, 2026 (date subject to change). Check the notice in your account and work with Projects and plugins.",
  },
  {
    id: "m2q37",
    question:
      "Your assistant needs data that changes often and rules that almost never change. How do you organize it?",
    options: [
      {
        id: "m2q37_a",
        label: "Rules in instructions, data in an updated source",
      },
      {
        id: "m2q37_b",
        label: "Rules and data in the instructions, updated every month",
      },
      {
        id: "m2q37_c",
        label: "Rules and data in a Project file uploaded when creating it",
      },
      {
        id: "m2q37_d",
        label: "Rules in a Project file and data pasted into each chat",
      },
    ],
    correctAnswer: "m2q37_a",
    topic: "Assistant design",
    difficulty: "hard",
    source: "Complete ChatGPT Guide",
    feedback:
      "Stable rules go in the instructions, which apply to every chat; data that changes is checked in an updated source. Updating every month or uploading a file when creating the Project leaves old data, and pasting it by hand into each chat depends on nobody forgetting.",
  },
  {
    id: "m2q38",
    question:
      "A plugin asks for access to your email and calendar to summarize your meetings. What do you do before connecting it?",
    options: [
      {
        id: "m2q38_a",
        label: "Connect it, because it appears inside ChatGPT",
      },
      {
        id: "m2q38_b",
        label: "Connect it and check later what it did in my account",
      },
      {
        id: "m2q38_c",
        label: "Ask ChatGPT to tell me whether the plugin is safe",
      },
      {
        id: "m2q38_d",
        label: "Read what it can see and do, and grant only what's needed",
      },
    ],
    correctAnswer: "m2q38_d",
    topic: "Plugin permissions",
    difficulty: "medium",
    source: "Guide: GPTs, Projects and agents",
    feedback:
      "Permissions say what the plugin can see and do in your account; grant only those the task needs. Appearing inside ChatGPT or ChatGPT recommending it doesn't tell you what data it accesses, and checking later comes too late.",
  },
  {
    id: "m2q39",
    question:
      "You are preparing a report with current market figures, an infographic with those figures and a final text that comments on it. In what order do you use the tools?",
    options: [
      {
        id: "m2q39_a",
        label: "Web Search, Data Analysis, image and Canvas",
      },
      {
        id: "m2q39_b",
        label: "Data Analysis, Web Search, image and Canvas",
      },
      {
        id: "m2q39_c",
        label: "Web Search, image, Data Analysis and Canvas",
      },
      {
        id: "m2q39_d",
        label: "Web Search, Data Analysis, Canvas and image",
      },
    ],
    correctAnswer: "m2q39_a",
    topic: "Tool workflows",
    difficulty: "hard",
    source: "Integrated ChatGPT Tools",
    feedback:
      "First you bring the figures with Web Search, then you process them with Data Analysis, then you make the infographic from those results, and finally you write in Canvas the text that comments on it. Analyzing before searching has no data, the infographic before the analysis shows unprocessed figures, and the text before the image can't comment on it.",
  },
  {
    id: "m2q40",
    question:
      "A support assistant has clear instructions, the knowledge base and today's prices. What is it missing?",
    options: [
      {
        id: "m2q40_a",
        label: "More documents and examples in the knowledge base",
      },
      {
        id: "m2q40_b",
        label: "A friendlier tone, with brand examples",
      },
      {
        id: "m2q40_c",
        label: "Permission to also resolve complex cases",
      },
      {
        id: "m2q40_d",
        label: "A route to hand complex cases over to a person",
      },
    ],
    correctAnswer: "m2q40_d",
    topic: "Assistant design",
    difficulty: "hard",
    source: "Guide: GPTs, Projects and agents",
    feedback:
      "A good assistant has a narrow scope and hands over to a person what it cannot solve. It already has rules, knowledge and today's data; what it lacks is that route. More documents or a friendlier tone don't cover complex cases, and resolving them alone increases the risk.",
  },
];
