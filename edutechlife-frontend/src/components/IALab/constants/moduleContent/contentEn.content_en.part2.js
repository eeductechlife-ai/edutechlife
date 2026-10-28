export const CONTENT_EN_PART2 = {
  2: {
    objective:
      "Build with ChatGPT like a digital architect: write clear requests, choose the right tool for each task, organize your recurring work in Projects, and review every step you delegate.",
    learningPoints: [
      {
        text: "Draw a Project's blueprint: instructions with role, tone, and limits",
        icon: "fa-sliders",
      },
      {
        text: "Build Projects and use plugins that work with your context",
        icon: "fa-code",
      },
      {
        text: "Organize a Project with instructions and files as an architectural module",
        icon: "fa-robot",
      },
      {
        text: "Delegate a multi-step task to the agent and approve each step",
        icon: "fa-cog",
      },
    ],
    overviewData: {
      title:
        "The Digital Architect: ChatGPT & Automation — Build Your Own Work Ecosystem",
      description:
        "Welcome to the construction site. Here you won't just use ChatGPT — you'll build with it. Learn to write a Project's instructions like architectural blueprints, use integrated tools as scaffolding, organize Projects as construction modules, and delegate multi-step tasks to ChatGPT's agent, always under your supervision.",
      mission:
        "Your mission as an architect: complete each lesson and build with ChatGPT a Project you can use in your real work. Every structure you design brings you closer to your certification. Build your first structure!",
      topics: [
        {
          title: "The Architect's Blueprints: Complete ChatGPT Guide",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
          outcome:
            "Ask ChatGPT for an everyday task and get a useful answer on the first try.",
        },
        {
          title: "The Architect's Scaffolding: Integrated Tools",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
          outcome:
            "Choose the right ChatGPT tool (search, files, images or voice) and check what it gives you.",
        },
        {
          title: "The Building's Facade: GPTs, Projects and Agents",
          icon: "fa-code",
          resources: 3,
          duration: "20 min",
          outcome:
            "Organize a repeated task in a Project and decide when a Project, a plugin or an agent makes sense.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Architect's Blueprints: Complete ChatGPT Guide",
        description: "The foundations of every great digital construction",
        detailedDescription:
          "Every building starts with a blueprint. In this lesson you'll get to know ChatGPT end to end: what it is, which models exist, when to use each one, and how to write clear prompts (with task, context, and format) to get a useful answer in fewer tries. ChatGPT is a language model: it generates text from your instructions by predicting the most likely words, and without Web Search its knowledge only reaches a cutoff date. Models change often: use the ones your account's model picker shows today, the fast one for simple tasks and the more powerful one for complex analysis. Every chat has a context limit: in a very long conversation it may stop taking into account what you said at the beginning; summarize what matters and continue in a new chat with that summary. If the first answer doesn't work for you, tell it what is wrong and ask it to adjust only that part. This is the foundation you need before delegating longer tasks to it. Currency note: OpenAI has scheduled the retirement of custom GPTs for December 11, 2026 (date subject to change), to be replaced by plugins. Work now with Projects and with the plugins connected to your account, and check the notice in your account.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC",
      },
      {
        id: 2,
        title: "The Architect's Scaffolding: Integrated Tools",
        description: "The tools that raise your digital construction",
        detailedDescription:
          "An architect doesn't build with bare hands — they use cranes, scaffolding, and specialized tools. Discover ChatGPT's main tools: Web Search for current data, Data Analysis with Python to process figures, image generation, Canvas to edit documents, voice mode to talk out loud (for example, to rehearse a presentation), and Projects to organize your work. For an exact calculation on a file, ask it to use Data Analysis: calculating \"from memory\" can give wrong figures. With Web Search, prefer primary sources (whoever produced the figure), with an author and a date. Learn to combine them in a simple two- or three-step workflow and to review what each one delivers. Check in your account which tools you have available.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA",
      },
      {
        id: 3,
        title: "The Building's Facade: GPTs, Projects and Agents",
        description: "Connect your work to the real world",
        detailedDescription:
          "The facade is what the world sees. Here you build tailored assistants: Projects with your instructions and knowledge, plugins that connect your tools, and ChatGPT's agent for multi-step tasks. Learn to design, test, and use them without losing control of any decision. A Project's instructions tell it which role to play, with what tone, which topics it covers, and what it must not do, in all its chats; show the tone with two or three sample answers, which teach more than adjectives. Keep stable rules in the instructions and check data that changes, such as prices, in an updated source. Upload only the data the task needs and anonymize personal data. A good assistant has a narrow scope, can say \"I don't know\", and hands over to a person what it cannot solve. Ask it to state which file and section each piece of data comes from, so you can check it. Before connecting a plugin, read which permissions it asks for (what it can see and what it can do in your account) and grant only those the task needs. Before sharing an assistant, test it with real cases using fictitious data; afterwards, review a sample of its answers against written criteria from time to time. AI prepares; you review, decide, and answer for what you deliver. Check the currency note in lesson 1: if you use a GPT, move its instructions and files to a Project and test that it answers the same way.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 The Architect's Foundations",
        objectiveDesc:
          "Learn ChatGPT's basics: which models there are, what their limits are, and how to write a clear request.",
        achievements: [
          {
            icon: "fa-check",
            text: "Explain in your own words what a language model is and why it has a cutoff date",
          },
          {
            icon: "fa-check",
            text: "Write a request with task, context, and format, and adjust it when the answer doesn't work",
          },
          {
            icon: "fa-check",
            text: "Select the optimal model based on cost and capability — the right material for each job",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Using the most expensive model for simple tasks — like using a pile driver for a picture frame",
          },
          {
            icon: "fa-times",
            text: "Ignoring context limits — like building without measuring the land",
          },
          {
            icon: "fa-times",
            text: "Not keeping up with new model updates — an ignorant architect builds castles of cards",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Amateur: Using the most powerful model for everything, even for tasks the fast model solves in seconds",
          strong:
            "✅ Architect: a fast model for quick drafts and summaries, and a stronger model for complex structural analysis — the right material for each layer of the build, depending on your plan",
        },
      },
      2: {
        objective: "🏗️ The Architect's Scaffolding",
        objectiveDesc:
          "Get to know ChatGPT's tools: Web Search, Data Analysis, image generation, Canvas, voice, and Projects.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identify when to use each tool like an architect picks the right instrument",
          },
          {
            icon: "fa-check",
            text: "Combine multiple tools in a single workflow like phases of construction",
          },
          {
            icon: "fa-check",
            text: "Solve a real task with two or three tools and review the result — your finished building",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Asking image generation for long text or brand logos without reviewing it — text inside images comes out with errors; write it in Canvas",
          },
          {
            icon: "fa-times",
            text: "Relying on training data for current information — like building with outdated blueprints",
          },
          {
            icon: "fa-times",
            text: "Not organizing Projects by goal (one per client or per job) — like mixing materials from 5 different sites",
          },
        ],
        example: {
          label: "Integrated workflow example",
          weak: "❌ Isolated: Asking for updated data without enabling Web Search → outdated results like a building without foundations",
          strong:
            "✅ Integrated: Search current data (Web Search) → analyze it with Python (Data Analysis) → generate the infographic from those results (image) → write in Canvas the text that comments on it — a construction in 4 phases, each one checked before moving on to the next",
        },
      },
      3: {
        objective: "🧱 The Architect's Facade",
        objectiveDesc:
          "Build Projects, with instructions and files, so ChatGPT works with your context on every task.",
        achievements: [
          {
            icon: "fa-check",
            text: "Create a Project with clear instructions, your own files, and a defined goal, or a plugin connected to your account",
          },
          {
            icon: "fa-check",
            text: "Organize a Project with files, instructions, and conversations for one piece of work",
          },
          {
            icon: "fa-check",
            text: "Use ChatGPT's agent on multi-step tasks, reviewing each step before you approve it",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Loading sensitive or minors' data into a Project or plugin without checking who can see it or whether your institution allows it — like leaving confidential blueprints on the street",
          },
          {
            icon: "fa-times",
            text: "Delegating to the agent decisions that need your judgment — the agent executes, you approve",
          },
          {
            icon: "fa-times",
            text: "Sharing a Project or plugin without testing it on real cases — like handing over a facade without inspection",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic: Starting every conversation from scratch, with no instructions or files, and repeating the same context",
          strong:
            "✅ Facade: A «Proposal advisor» Project with your tone, your templates, and your prices, which stores each client's documents. Every answer comes with your context already loaded.",
        },
      },
    },
  },
};
