export const learningObjectives = [
  "Understand what ChatGPT does and how it builds an answer",
  "Tell the ways of answering apart: quick or with more reasoning",
  "Pick the right tool for each task (search, files, Canvas, Projects)",
  "Ask for an everyday task and review the answer before using it",
];

export const furtherReading = [
  {
    title: "OpenAI Help Center",
    url: "https://help.openai.com/",
    description:
      "Official documentation: features, plans and availability for your account.",
  },
];

export const infographicData = {
  header: {
    title: "The Master Blueprint: your ChatGPT map",
    subtitle: "From your first request to a useful answer",
  },
  sections: [
    {
      id: "evolution",
      title: "How ChatGPT answers",
      icon: "TrendingUp",
      content:
        "ChatGPT is a conversational assistant: you read its answer, adjust it with your next message and check it before using it.",
      details: [
        {
          title: "1 · Your request",
          date: "Step 1",
          text: "You write what you need, for whom and in what format.",
          extendedText:
            "The clearer your request, the less it guesses. Example: “Help me write a WhatsApp message to confirm an appointment, friendly tone, 3 lines at most”.",
        },
        {
          title: "2 · Its answer",
          date: "Step 2",
          text: "ChatGPT builds the answer piece by piece.",
          extendedText:
            "It does not look up a stored answer: it builds one from patterns. That is why it can sound very sure even when it is wrong.",
        },
        {
          title: "3 · Your review",
          date: "Step 3",
          text: "You adjust and check.",
          extendedText:
            "Ask for small changes (“make it shorter”) and check dates, figures and names before using the result.",
        },
      ],
    },
    {
      id: "modes",
      title: "Ways of answering",
      icon: "Cpu",
      content:
        "Depending on your account, ChatGPT may offer different ways of answering. Names and options change: check the selector in yours.",
      details: [
        {
          title: "Quick answer",
          text: "For simple, direct tasks.",
          extendedText:
            "Ideal for summarizing an email, suggesting ideas, fixing wording or translating. It favors speed over deep analysis.",
        },
        {
          title: "Answer with more reasoning",
          text: "For tasks that need analysis. It takes a little longer.",
          extendedText:
            "Useful when there are several factors: comparing options, planning a trip with constraints or reviewing a long document. It is slower, but usually more careful.",
        },
      ],
    },
    {
      id: "tools",
      title: "The toolbox",
      icon: "Wrench",
      content:
        "ChatGPT is more than a chat: it has tools to search, read your files, edit and keep context. Which ones you see depends on your plan.",
      details: [
        {
          title: "Web search and files",
          icon: "Search",
          text: "Recent data with sources, and reading your documents.",
          extendedText:
            "Turn on search for prices, news or current rules and open the sources. Upload a PDF or a spreadsheet to ask for a summary or a table, and recompute one row by hand to check.",
        },
        {
          title: "Canvas",
          icon: "Layout",
          text: "A panel next to the chat to edit a text with you.",
          extendedText:
            "Instead of regenerating the whole text, you select a paragraph and ask “make it more formal”. Useful for long documents.",
        },
        {
          title: "Projects and memory",
          icon: "Database",
          text: "They keep the instructions and files of a job.",
          extendedText:
            "A Project gathers the context of a job (tone, rules, files) so you do not repeat it in every chat. Review memory from time to time and delete what you do not want it to keep.",
        },
      ],
    },
    {
      id: "automation",
      title: "Apps and agents, with your permission",
      icon: "Share2",
      content:
        "ChatGPT can connect to other apps and do multi-step tasks, always with permissions you approve.",
      details: [
        {
          title: "Connectors",
          icon: "Zap",
          text: "Permissions for ChatGPT to use your apps.",
          extendedText:
            "A connector is a permission for ChatGPT to read one of your tools, such as your calendar or documents. Read what permissions it asks for, grant only what is needed and disconnect what you no longer use.",
        },
        {
          title: "Agent",
          icon: "Settings",
          text: "Multi-step tasks under your supervision.",
          extendedText:
            "You give it a goal (for example, compare three options and build a table). You review the plan, approve the important actions and open the sources before using the result.",
        },
        {
          title: "Share with care",
          icon: "MessageSquare",
          text: "Before sharing a chat, check what it contains.",
          extendedText:
            "A shared link shows the whole conversation. Do not include other people's personal data, minors' data or confidential documents.",
        },
      ],
    },
  ],
  quiz: {
    questions: [
      {
        question: "When is the option with more reasoning worth it?",
        options: [
          {
            text: "For simple tasks, like fixing a sentence",
            score: 1,
            feedback:
              "A quick answer is enough for that: extra reasoning takes longer and adds nothing.",
          },
          {
            text: "When there are several factors to compare, like planning a trip with constraints",
            score: 3,
            feedback:
              "Correct! That option is usually more careful with multi-factor tasks.",
          },
          {
            text: "Always, because it is better at everything",
            score: 1,
            feedback:
              "Not always: it is slower and simple tasks do not need it.",
          },
        ],
      },
      {
        question: "What does Canvas do in ChatGPT?",
        options: [
          {
            text: "Generates images from text",
            score: 1,
            feedback:
              "Image creation is another tool. Canvas is an editor next to the chat.",
          },
          {
            text: "Connects ChatGPT to social networks",
            score: 1,
            feedback: "No: Canvas has nothing to do with social networks.",
          },
          {
            text: "Lets you edit a document next to the chat, in a side panel",
            score: 3,
            feedback:
              "Exactly! You can select a paragraph and ask for a change without regenerating everything.",
          },
        ],
      },
      {
        question: "How would a teacher benefit from using Projects in ChatGPT?",
        options: [
          {
            text: "They can keep the syllabus and course guides so they do not repeat the context in every chat",
            score: 3,
            feedback:
              "Correct! A Project gathers the instructions and files of a job.",
          },
          {
            text: "It creates exams automatically with no review",
            score: 1,
            feedback:
              "AI helps prepare exams, but they always need human review.",
          },
          {
            text: "It replaces the teacher in class",
            score: 1,
            feedback:
              "ChatGPT supports, it does not replace: the teacher's judgment is irreplaceable.",
          },
        ],
      },
      {
        question: "Before approving a connector, what do you do?",
        options: [
          {
            text: "I read what permissions it asks for and grant only what is needed",
            score: 3,
            feedback:
              "Correct! The permissions are yours: give the minimum and disconnect what you no longer use.",
          },
          {
            text: "I approve everything so I do not have to repeat the step",
            score: 1,
            feedback: "Granting more permissions than needed raises the risk.",
          },
          {
            text: "I share my password in the chat so it can get in",
            score: 1,
            feedback: "Never give passwords in the chat.",
          },
        ],
      },
      {
        question: "What is the best way to start with ChatGPT?",
        options: [
          {
            text: "Try every feature on day one",
            score: 1,
            feedback: "It is overwhelming and you will not know what helped.",
          },
          {
            text: "Start with an everyday task, review the answer and improve it",
            score: 3,
            feedback:
              "Exactly! One concrete task, one review and one adjustment: that is how you learn.",
          },
          {
            text: "Wait for the technology to mature",
            score: 1,
            feedback:
              "It already works for many everyday tasks; starting now lets you learn step by step.",
          },
        ],
      },
    ],
  },
};
