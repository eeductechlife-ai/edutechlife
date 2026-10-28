export default {
  badge: "Module 2 · Explanation",
  title: "The Master Blueprint",
  subtitle:
    "How ChatGPT answers, what its modes mean, and what permission you give when you connect an account",
  intro:
    "Before choosing a tool, it helps to understand the system behind it. Here you will learn the terms of the ChatGPT ecosystem: model, mode, connector and memory, and what to check in each case.",
  objectives: [
    "Explain what a language model is and how it builds an answer",
    "Tell apart model, mode and plan",
    "Understand what a connector is and what permission it grants",
    "Control what your account's memory keeps",
  ],
  sections: [
    {
      title: "1. How a model builds an answer",
      explain: [
        "A language model does not look up a stored answer: it writes one piece after another, choosing the piece that makes most sense after the previous one. That is why the same question can get different answers.",
        "It works with text fragments called tokens. What fits in a conversation has a limit: the context window. If the text is very long, the distant parts can be lost.",
      ],
      terms: [
        {
          term: "Language model",
          def: "A system trained on large amounts of text to predict and generate language.",
        },
        {
          term: "Token",
          def: "A text fragment (a word, part of a word or a sign) that the model processes.",
        },
        {
          term: "Context window",
          def: "The amount of text the model can consider at once in a conversation.",
        },
      ],
      how: [
        "It receives your request and splits it into tokens.",
        "It predicts the next piece, one after another.",
        "It delivers the full answer. It can be wrong even when it sounds sure.",
      ],
      example:
        "If you paste a very long document and then ask about its first page, the model may not take it into account if it falls outside the context window.",
      mistake:
        "Thinking the AI «searches» an internal database. It generates the answer on the spot, which is why you must verify it.",
    },
    {
      title: "2. Model, mode and plan",
      explain: [
        "The model is the engine that answers. Modes are ways of using it: some prioritize speed, others reason more slowly for complex tasks.",
        "Your plan defines which models and features you have. Names and options change often, so check the model selector in your account.",
      ],
      terms: [
        {
          term: "Mode",
          def: "A way of using a model: faster for simple tasks, more deliberate for complex problems.",
        },
        {
          term: "Plan",
          def: "The set of models and features your account includes.",
        },
      ],
      how: [
        "Open the model selector in your account.",
        "Use the fast mode for drafts and simple summaries.",
        "Use the more deliberate mode for multi-step analysis.",
      ],
      example:
        "To summarize an email, the fast mode is enough. To compare three contracts with different clauses, the more deliberate mode is better.",
      mistake:
        "Believing the most powerful mode is always better. For a simple task it takes longer and does not improve the result.",
    },
    {
      title: "3. Tools and connectors",
      explain: [
        "Built-in tools extend what the model can do: searching the web, analyzing files, generating images or working with documents.",
        "A connector is a permission that lets the AI read or use an external account, for example an email or a calendar. Before you connect, check what data it will see.",
      ],
      terms: [
        {
          term: "Tool",
          def: "A feature that lets the model do more than write text.",
        },
        {
          term: "Connector",
          def: "A permission that gives access to an external account or service.",
        },
        {
          term: "Permission",
          def: "What the app can read or do on your behalf. You grant it when you connect.",
        },
      ],
      how: [
        "Choose the tool for the task: search, analyze, create an image or read files.",
        "Before connecting an account, check which permissions it asks for.",
        "Disconnect what you do not use.",
      ],
      example:
        "Connecting your calendar lets you ask «what do I have on Thursday?». But it also gives access to your events: grant it only if you need it.",
      mistake:
        "Accepting every permission without reading them, or connecting an account that holds other people's data.",
    },
    {
      title: "4. Memory and control",
      explain: [
        "Memory is what the account keeps from your conversations so it can answer better in the future. You can review it, edit it and decide what is kept.",
        "Remembering more is not always better: a useful preference helps, but a sensitive detail kept without need is a risk.",
      ],
      terms: [
        {
          term: "Memory",
          def: "What the account keeps from your conversations to use in others.",
        },
        {
          term: "Custom instructions",
          def: "Preferences you define once and that apply to your chats.",
        },
      ],
      how: [
        "Check in the settings what the memory keeps.",
        "Delete what you do not want kept.",
        "For a one-off job, use a chat without memory or a Project.",
      ],
      example:
        "Saving «answer me in a formal tone» is useful. Saving a client's ID number is not.",
      mistake:
        "Forgetting that memory exists and sharing data as if every chat started from zero.",
    },
  ],
  summary: [
    "A model writes the answer piece by piece; it can be wrong even when it sounds sure.",
    "The model is the engine, the mode is how you use it, and the plan defines what you have.",
    "A tool extends what the model does; a connector gives it access to an external account.",
    "Memory keeps what you decide; review it and delete when needed.",
    "Before you connect or save anything, ask what permission you give and what data stays.",
  ],
  check: [
    {
      q: "What is a token?",
      options: [
        "A payment made for each answer.",
        "A text fragment that the model processes.",
        "Your account password.",
      ],
      correct: 1,
      feedback:
        "A token is a text fragment (a word, part of a word or a sign) that the model processes.",
    },
    {
      q: "You want the AI to read your calendar to remind you of appointments. What should you check first?",
      options: [
        "Nothing: connecting is always safe.",
        "What permissions the connector asks for and whether you need that access.",
        "That the app's logo looks nice.",
      ],
      correct: 1,
      feedback:
        "A connector grants real permissions over your account: check what it can see before connecting.",
    },
    {
      q: "You need to summarize a short email. Which mode fits?",
      options: [
        "The most deliberate one, because it is always better.",
        "The fast one, because the task is simple.",
        "None: AI cannot summarize emails.",
      ],
      correct: 1,
      feedback:
        "For a simple task, the fast mode is enough and responds sooner.",
    },
  ],
};
