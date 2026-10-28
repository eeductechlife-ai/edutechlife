export const CONTENT_EN_PART2 = {
  2: {
    objective:
      "Design and build intelligent systems with ChatGPT: from foundations to full automation of your daily work as a true digital architect.",
    learningPoints: [
      {
        text: "Design master blueprints with advanced System Prompts",
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
        text: "Automate complete construction workflows",
        icon: "fa-cog",
      },
    ],
    overviewData: {
      title:
        "The Digital Architect: ChatGPT & Automation — Build Your Own Work Ecosystem",
      description:
        "Welcome to the masterpiece of automation. Here you won't just use ChatGPT — you'll build with it. Learn to design system prompts like architectural blueprints, use integrated tools as scaffolding, create GPTs as construction modules, organize Projects, and delegate multi-step tasks to ChatGPT's agent, always under your supervision.",
      mission:
        "Your mission as an architect: complete each lesson and master the art of building with ChatGPT. Every structure you design brings you closer to your automation architect certification. Build your digital masterpiece!",
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
          "Every building starts with a blueprint. In this lesson, you'll learn the complete architecture of ChatGPT: from available models to professional prompt engineering best practices. Learn to select the right tool for each phase of your construction and lay the foundations of your automation projects. Currency note: OpenAI has scheduled the retirement of custom GPTs for December 11, 2026 (date subject to change), replaced by plugins. Start with Projects and plugins, and check the notice in your account. Start now with Projects and with the plugins connected to your account.",
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
          "An architect doesn't build with bare hands — they use cranes, scaffolding, and specialized tools. Discover ChatGPT's arsenal: Web Search, Data Analysis with Python, image generation, Canvas, and Projects. Learn to combine them to build powerful automations that multiply your productivity.",
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
          "The facade is what the world sees. Here you build tailored assistants: Projects with your instructions and knowledge, plugins that connect your tools, and ChatGPT's agent for multi-step tasks. Learn to design, test, and use them without losing control of any decision. Check the currency note in lesson 1 and consider moving a GPT's instructions to a Project.",
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
          "Master ChatGPT's fundamentals: models, limits, and professional prompt engineering techniques.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand GPT model architecture and evolution as a master blueprint",
          },
          {
            icon: "fa-check",
            text: "Apply professional prompt engineering techniques as construction tools",
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
          "Master ChatGPT's tool ecosystem: Web Search, Code, image generation, Canvas, and Projects.",
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
            text: "Create automations that solve real problems — your finished building",
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
            text: "Not organizing projects by specific goals — like mixing materials from 5 different sites",
          },
        ],
        example: {
          label: "Integrated workflow example",
          weak: "❌ Isolated: Asking for updated data without enabling Web Search → outdated results like a building without foundations",
          strong:
            "✅ Integrated: Search current data (Browse) → analyze with Python (Code Interpreter) → generate infographic (image) → edit in Canvas — a construction in 4 perfectly orchestrated phases",
        },
      },
      3: {
        objective: "🧱 The Architect's Facade",
        objectiveDesc:
          "Build Projects, with instructions and files, so ChatGPT works with your context on every task.",
        achievements: [
          {
            icon: "fa-check",
            text: "Create a custom GPT with clear instructions, your own knowledge, and a defined goal",
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
            text: "Loading sensitive or minors' data into a GPT without checking who can see it — like leaving confidential blueprints on the street",
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
            "✅ Facade: A «Proposal advisor» GPT with your tone, your templates, and your prices, inside a Project that stores each client's documents. Every answer comes with your context already loaded.",
        },
      },
    },
  },
};
