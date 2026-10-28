export default {
  badge: "Module 2 · Explanation",
  title: "The Project Workshop",
  subtitle:
    "Projects, instructions, plugins and agents: what each one is and when to use it",
  intro:
    "When you repeat the same kind of work, it is better not to start from zero each time. In this lesson you will learn the key terms for organizing that work with ChatGPT, what each tool does, and how to check the result before you use it.",
  objectives: [
    "Explain what a Project is and what it keeps",
    "Define instructions, plugin and agent, and how they differ",
    "Write clear instructions with a role, context and limits",
    "Recognize the mistake of keeping sensitive data in a Project",
  ],
  sections: [
    {
      title: "1. What is a Project?",
      explain: [
        "A Project is a space that groups one job: it keeps its instructions and files, and every chat inside the Project uses that context without you pasting it again.",
        "Think of a work folder with a sheet of instructions on the cover: everything you open inside follows the same rules.",
      ],
      terms: [
        {
          term: "Project",
          def: "A space that groups chats, files and instructions for one job.",
        },
        {
          term: "Context",
          def: "What the AI knows about your situation before it answers: your task, your audience and your rules.",
        },
      ],
      how: [
        "You create the Project and give it a name that describes the job.",
        "You write its instructions and upload the files the job needs.",
        "Each new conversation inside the Project already has that context.",
      ],
      example:
        "A proposal adviser creates a Project «Client proposals» with their tone, prices and templates.",
      mistake:
        "Uploading personal or confidential data about people who did not authorize you to use it.",
    },
    {
      title: "2. Instructions: the base of a Project",
      explain: [
        "Instructions are the text that describes how the AI should work: what role it plays, who it writes for, what tone to use and which limits to respect.",
        "Good instructions are specific. «Answer well» says nothing; «You are a school adviser, you write for families in short sentences and never include student names» guides the result.",
      ],
      terms: [
        {
          term: "Instructions",
          def: "Written rules that guide every answer in the Project.",
        },
        {
          term: "Role",
          def: "The part the AI plays, for example «adviser» or «editor».",
        },
        {
          term: "Limit",
          def: "Something the AI must not do, such as inventing figures or asking for personal data.",
        },
      ],
      how: [
        "Describe the role: who the AI is in this job.",
        "Explain the context: who the result is for and what it is used for.",
        "Define the format and the limits: length, tone and what it must never do.",
      ],
      example:
        "«You write notices for families. Use a warm tone, three paragraphs at most, and never include student names.»",
      mistake:
        "Vague or very long instructions that contradict each other. Review them when the result is not what you expected.",
    },
    {
      title: "3. Plugin, agent and GPT: what sets them apart",
      explain: [
        "A plugin is an add-on that connects the AI with an external tool or service for a repeated task. It gathers rules, files and access to apps.",
        "An agent carries out several steps toward a goal, for example searching, comparing and building a table. You review the plan and approve the important actions.",
        "A custom GPT is a version of ChatGPT with its own instructions and files. OpenAI has scheduled the retirement of custom GPTs for December 11, 2026, and plugins are the planned replacement. Check in your account what you have available.",
      ],
      terms: [
        {
          term: "Plugin",
          def: "An add-on that connects the AI with a tool or service for a repeated task.",
        },
        {
          term: "Agent",
          def: "An assistant that carries out several steps under your supervision.",
        },
        {
          term: "API",
          def: "The way two programs talk to each other to request or send data.",
        },
        {
          term: "Webhook",
          def: "An automatic notice that one service sends to another when something happens, for example a new complaint.",
        },
      ],
      how: [
        "A Project keeps context and files for your work.",
        "A plugin performs a task connected to an external tool.",
        "An agent chains steps: you approve the important ones before it continues.",
      ],
      example:
        "To answer a brand's frequently asked questions, a plugin checks the catalogue; to compare five suppliers and build a table, an agent does the steps.",
      mistake:
        "Thinking the agent makes fewer mistakes because it worked for several minutes. An early error spreads to the whole result.",
    },
    {
      title: "4. Test before you use it",
      explain: [
        "A result can sound confident and still be wrong. Before you use it, separate what comes from your files from what the AI assumed.",
        "Testing means giving it a real case, reviewing the data that does not appear in your files, and confirming it at the original source.",
      ],
      terms: [
        {
          term: "Verify",
          def: "To check a fact against a source you can open.",
        },
        {
          term: "Invented data",
          def: "Data the AI produces that exists neither in your files nor in a source.",
        },
      ],
      how: [
        "Read the answer and mark the concrete data: dates, figures and names.",
        "Look for each one in your files. If it is not there, confirm it at the original source.",
        "If you cannot confirm it, do not use it.",
      ],
      example:
        "A notice says «the meeting will be on Thursday the 5th at 7 p.m.». If the date is not in your files or in the official calendar, confirm it before sending.",
      mistake:
        "Sending the result because the Project «already checked it». The Project only knows what is in its instructions and files.",
    },
  ],
  summary: [
    "A Project groups chats, files and instructions for one job.",
    "Instructions state role, context, format and limits; the more specific, the better the result.",
    "A plugin connects a tool; an agent carries out several steps under your approval.",
    "Custom GPTs are scheduled for retirement on December 11, 2026; plugins are the planned replacement.",
    "Before using a result, verify its concrete data at a source you can open.",
  ],
  check: [
    {
      q: "What does a Project keep?",
      options: [
        "Only your account's billing history.",
        "The instructions and files of one job.",
        "The answers of every user on the platform.",
      ],
      correct: 1,
      feedback: "A Project groups instructions, files and chats for one job.",
    },
    {
      q: "You need the AI to check a catalogue that changes every day. What is most suitable?",
      options: [
        "Write today's prices in the instructions and never touch them again.",
        "Use a plugin that checks the updated source and verify the date of the data.",
        "Ask it to guess today's prices.",
      ],
      correct: 1,
      feedback:
        "Data that changes must come from an updated source, not from a fixed instruction or a guess.",
    },
    {
      q: "An agent gives you a table of suppliers. What do you do before sending it?",
      options: [
        "I send it, because the agent worked for several minutes.",
        "I review the sources and confirm the figures I will use.",
        "I delete the sources so the table looks clean.",
      ],
      correct: 1,
      feedback:
        "The agent saves steps, but you verify the data before using it.",
    },
  ],
};
