// Contenido del curso IALab (generado desde el parche del rediseño 2026-10).
const CONTENT_EN = {
  1: {
    objective:
      "By the end of this module you will be able to write prompts with the RTF formula (Role + Task + Format) plus the needed context, getting useful answers from any AI model on the first try.",
    learningPoints: [
      {
        text: "Explain what generative AI is and why it sometimes gets things wrong",
        icon: "fa-brain",
      },
      {
        text: "Write prompts with the RTF formula and improve them by iterating",
        icon: "fa-wand-magic-sparkles",
      },
      {
        text: "Spot bias, privacy risks and fake citations before you use a result",
        icon: "fa-shield-halved",
      },
      {
        text: "Use AI transparently and within the law",
        icon: "fa-scale-balanced",
      },
    ],
    overviewData: {
      title:
        "The Digital Craftsman: Prompts and Ethics — The Foundations of Every AI Interaction",
      description:
        "Every artisan starts with basic tools and, with practice, becomes a master. Here you'll learn to sculpt instructions that AI understands perfectly. From fundamentals to advanced techniques that will transform how you work with artificial intelligence. A responsible craftsman also knows when not to use the tool: here you will learn to verify, protect data and use AI within the law.",
      mission:
        "Your mission as an artisan: complete each lesson and multimedia resource (videos, guides, and labs). Every tool you master brings you 20% closer to your certification. Precise instructions are your quality seal! This module includes the guardian's oath: without verifying, protecting data and disclosing your AI use, no prompt is finished.",
      topics: [
        {
          title: "The Artisan's Foundations: What is Generative AI?",
          icon: "fa-brain",
          resources: 3,
          duration: "20 min",
          outcome:
            "Explain in your own words what generative AI is, what it does well and why it sometimes gets things wrong.",
        },
        {
          title: "The Artisan's Chisel: What is a Prompt?",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
          outcome:
            "Write a clear request with the Role + Task + Format formula and improve it until it works for you.",
        },
        {
          title: "The Guardian's Shield: What You Should Not Share",
          icon: "fa-lock",
          resources: 3,
          duration: "20 min",
          outcome:
            "Decide which data you never share with an AI and anonymize a text before pasting it.",
        },
        {
          title: "The Guardian's Oath: Ethics and Bias",
          icon: "fa-shield-halved",
          resources: 3,
          duration: "20 min",
          outcome:
            "Spot a bias in an AI answer, apply three questions (is it true? is it fair? do I disclose it?) and disclose when you used AI.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Artisan's Foundations: What is Generative AI?",
        description: "Understand the tool before you use it",
        detailedDescription:
          "Before you ask AI for anything, it helps to know how it works. You will see what generative AI is, why it answers confidently even when it is wrong, what it does well and where its limits are. With that foundation you can use it with judgment from day one, even if you have never used it before. You will also review how AI began, from its first models to today, to understand where its limits come from.",
        duration: "20 min",
        format: "Video",
        icon: "fa-brain",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#4DA8C4",
      },
      {
        id: 2,
        title: "The Artisan's Chisel: What is a Prompt?",
        description: "Ask for exactly what you need",
        detailedDescription:
          "A prompt is the instruction you give the AI. You will learn the RTF formula (Role + Task + Format), how to add the context the AI does not have, and how to improve an answer by asking for adjustments instead of starting over. You will practice with study, work and everyday cases until you get useful results on the first try.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-comments",
        badgeColor: "bg-sky-100 text-sky-800",
        themeColor: "#199DB9",
      },
      {
        id: 3,
        title: "The Guardian's Shield: What You Should Not Share",
        description: "Protect your data and other people's data",
        detailedDescription:
          "Everything you paste into an AI leaves your computer. You will learn which data you never share (identity, health, minors, passwords), how to anonymize a text before pasting it and what to do if you already shared something sensitive. That protects your privacy and other people's.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-lock",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#0E7490",
      },
      {
        id: 4,
        title: "The Guardian's Oath: Ethics and Bias",
        description: "Decide with judgment, spot bias and disclose your use",
        detailedDescription:
          "Ethics is deciding well even when nobody forces you to. You will learn three of the five questions for every result (is it true? is it fair? do I disclose it?), how to spot bias in an answer and how to declare your AI use. At the end, you will see how the European Union classifies AI systems by risk. You will also learn that impersonating someone with AI is unethical, and how to protect minors when a system answers badly.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-shield-halved",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#0E7490",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 The Artisan's Foundations",
        objectiveDesc:
          "Understand what generative AI is and how it creates new content. This is where your digital craft begins.",
      },
      2: {
        objective: "🎯 The Artisan's Chisel",
        objectiveDesc:
          "A well-crafted prompt is your most powerful tool: learn to write instructions AI understands the first time.",
      },
      3: {
        objective: "🔒 The Guardian's Shield",
        objectiveDesc:
          "Before you paste anything into an AI, decide what goes in and what stays with you.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identify personal data: ID numbers, phones, health and minors' data",
          },
          {
            icon: "fa-check",
            text: "Anonymize a text before pasting it (roles instead of names)",
          },
          {
            icon: "fa-check",
            text: "Know what to do if you already shared a sensitive piece of data",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Pasting other people's data without their permission",
          },
          {
            icon: "fa-times",
            text: "Uploading information about minors",
          },
          {
            icon: "fa-times",
            text: "Sharing passwords or verification codes",
          },
        ],
        example: {
          label: "The Guardian vs. The Reckless",
          weak: "❌ The reckless: Pasted the grade list with students' full names to ask for report-card comments.",
          strong:
            "✅ The guardian: Replaced the names with “Student A, B, C”, removed the school and ID numbers, and asked only for the comment format.",
        },
      },
      4: {
        objective: "🛡️ The Guardian's Oath",
        objectiveDesc:
          "Before you trust a result, look at it in the mirror: spot bias, decide with judgment, protect people and disclose how you used AI.",
        achievements: [
          {
            icon: "fa-check",
            text: "Recognize which people or perspectives an answer leaves out",
          },
          {
            icon: "fa-check",
            text: "Apply the three questions: is it true? is it fair? do I disclose it?",
          },
          {
            icon: "fa-check",
            text: "Disclose when and how you used AI and keep a person responsible for decisions",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Believing an answer just because it sounds sure: it may be biased or carry invented citations",
          },
          {
            icon: "fa-times",
            text: "Letting AI decide alone about hiring, grading or sanctioning",
          },
          {
            icon: "fa-times",
            text: "Presenting AI-generated work as your own without reviewing or disclosing it",
          },
        ],
        example: {
          label: "The Guardian vs. The Reckless",
          weak: "❌ The reckless: A student handed in an AI-generated essay with invented citations and examples of only one kind of person. The professor found out and the student lost credibility.",
          strong:
            "✅ The guardian: Used AI as an assistant, asked for the same task with different profiles to see the bias, checked every source, disclosed the use and handed in solid, honest work.",
        },
      },
    },
  },
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
            "✅ Architect: GPT-6 Luna for quick drafts and summaries, GPT-6 Sol for complex structural analysis — the right material for each layer of the build, depending on your plan",
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
  3: {
    objective:
      "Wield your digital magnifying glass: investigate deeply, verify every clue, and analyze information with the precision of a master detective.",
    learningPoints: [
      {
        text: "Analyze text, images, and code as a single body of evidence",
        icon: "fa-cubes",
      },
      {
        text: "Pull fresh clues from the real world in real-time",
        icon: "fa-signal",
      },
      {
        text: "Dig until you find the truth — step-by-step deep investigations with sources you can check",
        icon: "fa-search",
      },
      {
        text: "Separate facts from hallucinations with AI-powered forensic verification",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "The Data Detective: Elite Research with Gemini",
      description:
        "Welcome to the digital detective academy. Here you'll learn to cross-reference clues in real-time, analyze any type of evidence (text, image, audio, video), and verify every fact with the precision of a data forensics expert.",
      mission:
        "Your mission: become the world's best data detective. Master Google Gemini to cross-reference clues, verify every source, and deliver reports any CEO would sign. Every lesson brings you closer to your digital detective badge.",
      topics: [
        {
          title: "The Multimodal Detective Awakens",
          icon: "fa-google",
          resources: 3,
          duration: "20 min",
          outcome:
            "Ask Gemini to read a photo, a document or an audio recording and check what it understood.",
        },
        {
          title: "Grounding: When Evidence Touches the Real World",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
          outcome:
            "Tell an answer with sources from one that only sounds good, and open the sources to check it.",
        },
        {
          title: "Deep Research: The Forensic Toolkit",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
          outcome:
            "Commission a research task from Gemini and review its report source by source.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Multimodal Detective Awakens",
        description:
          "Gemini: your all-terrain magnifying glass that sees, reads, and listens simultaneously",
        detailedDescription:
          "Imagine a magnifying glass that doesn't just see images — it reads documents, listens to audio, and analyzes video, all at the same time. That's Gemini. In this lesson, you'll learn to wield this multimodal superpower to analyze, create, and crack cases that used to require 4 different tools.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4",
      },
      {
        id: 2,
        title: "Grounding: When Evidence Touches the Real World",
        description:
          "Connect your magnifying glass to solid ground: live data from the real world",
        detailedDescription:
          "What good is a magnifying glass if you can't verify what you see? Grounding connects Gemini to live internet information. Learn to combine images, documents, and real-time data to get answers that aren't just smart — they're verifiable.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4",
      },
      {
        id: 3,
        title: "Deep Research: The Forensic Toolkit",
        description:
          "Dig until you find the truth with deep investigation tools",
        detailedDescription:
          "The most complex cases demand the most powerful tools. Master deep research with AI: Deep Research to explore topics in their entirety, source verification to verify every source, and technical report generation any expert would endorse.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Activate Your Multimodal Magnifying Glass",
        objectiveDesc:
          "Gemini processes text, images, audio, and video as one language. Your new secret research weapon.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand how Gemini processes text, images, audio, and video as a single language",
          },
          {
            icon: "fa-check",
            text: "Configure your arsenal: Gemini Advanced, Google AI Studio, and every detective tool available",
          },
          {
            icon: "fa-check",
            text: "Know exactly when to use Gemini vs. other models — the right tool for every case",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Treating Gemini like a regular chatbot — like using a scalpel to cut bread",
          },
          {
            icon: "fa-times",
            text: "Ignoring its visual analysis power — the richest evidence is often in images",
          },
          {
            icon: "fa-times",
            text: "Not using grounding — it's like investigating with your eyes closed",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Novice: Asking 'What is Gemini?' — like a tourist asking for the time",
          strong:
            "✅ Detective: Upload a financial chart, request trend analysis with historical data correlation, cross-reference with real-time economic indicators search, and receive an executive report ready for your board meeting",
        },
      },
      2: {
        objective: "🔬 Multimodal Reasoning",
        objectiveDesc:
          "Process several evidence types at once: text, images, audio, and code. Four detectives in one mind.",
        achievements: [
          {
            icon: "fa-check",
            text: "Analyze images and documents like a digital forensics expert",
          },
          {
            icon: "fa-check",
            text: "Use grounding for fresh internet data — live information, not frozen knowledge",
          },
          {
            icon: "fa-check",
            text: "Fuse text, image, audio, and code into a single coherent analysis",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Uploading blurry evidence without context — detectives work with clear clues",
          },
          {
            icon: "fa-times",
            text: "Blindly trusting grounding without verification — even the best source can be wrong",
          },
          {
            icon: "fa-times",
            text: "Not telling Gemini what analysis you need — like asking a forensics expert 'look at this'",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Novice: 'Analyze this image' — no context, no instructions, no direction",
          strong:
            "✅ Detective: 'Analyze this architecture diagram as if you were a systems auditor. Identify every component, trace the data flow, flag scalability vulnerabilities, and compare against the AWS 2024 standard. Deliver a 3-paragraph executive report with action priorities.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "For complex cases: deep investigations with verifiable sources and source verification.",
        achievements: [
          {
            icon: "fa-check",
            text: "Execute deep investigations that cross-reference dozens of sources automatically",
          },
          {
            icon: "fa-check",
            text: "Verify every fact instantly — your safety net against misinformation",
          },
          {
            icon: "fa-check",
            text: "Produce consultant-level reports with verifiable references and exact citations",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Accepting unverified sources — even the best detective double-checks",
          },
          {
            icon: "fa-times",
            text: "Stopping at the first answer — the truth is usually in the second layer",
          },
          {
            icon: "fa-times",
            text: "Not cross-referencing with primary sources — quality investigation works with original documents",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Novice: 'What are the AI trends in 2026?' — a question anyone can Google",
          strong:
            "✅ Detective: 'Conduct a forensic investigation of the top 5 generative AI trends in 2026. For each trend: verified primary source, quantitative enterprise adoption data, 2 real company use cases, identified risks with criticality level, and 3-year projection with sources. Deliver as an executive report with verifiable links to every source.'",
        },
      },
    },
  },
  4: {
    objective:
      "Turn documents into gold: podcasts that sound like professional radio, summaries that cut to the chase, and answers that cite every source without making things up.",
    learningPoints: [
      {
        text: "Curate your sources like a jeweler picks gemstones",
        icon: "fa-book-open",
      },
      {
        text: "Distill documents into pure knowledge with AI",
        icon: "fa-file-alt",
      },
      {
        text: "Create radio-quality podcasts from your files",
        icon: "fa-microphone",
      },
      {
        text: "Manage your digital library with superhuman intelligence",
        icon: "fa-folder-open",
      },
    ],
    overviewData: {
      title:
        "The Digital Alchemist: Gemini Notebook — Where Your Documents Become Knowledge",
      description:
        "In this module, you will become a digital alchemist: your PDFs, articles, and notes hold hidden potential you never imagined. Learn to extract, transform, and share them in formats that captivate, educate, and transform.",
      mission:
        "Become a digital alchemist: your PDFs, articles, and notes hold hidden potential you never imagined. Learn to extract, transform, and share them in ways that captivate, educate, and transform.",
      topics: [
        {
          title:
            "The Document Alchemist: Your First Spell with Gemini Notebook",
          icon: "fa-microphone",
          resources: 3,
          duration: "20 min",
          outcome:
            "Create your first notebook with your documents and ask it questions it answers with citations.",
        },
        {
          title: "The Art of Curation: How to Choose and Synthesize Sources",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
          outcome:
            "Choose good sources and turn them into a summary or study guide you can verify.",
        },
        {
          title: "The Secret Formula: Audio Overviews and Document Management",
          icon: "fa-podcast",
          resources: 3,
          duration: "20 min",
          outcome:
            "Generate an audio summary of your documents and organize your notebooks so you can find everything.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Document Alchemist: Your First Spell with Gemini Notebook",
        description: "Where PDFs come to life",
        detailedDescription:
          "Meet Gemini Notebook, Google's tool that turns your PDFs, articles, and notes into a personal assistant that responds with exact citations. It doesn't hallucinate. It doesn't make things up. It's your librarian with superpowers.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B",
      },
      {
        id: 2,
        title: "The Art of Curation: How to Choose and Synthesize Sources",
        description: "Quality over quantity, always",
        detailedDescription:
          "Learn to select the best sources like a jeweler picks gemstones, organize them by topic, and weave ideas across documents to create professional-level summaries and analyses.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981",
      },
      {
        id: 3,
        title: "The Secret Formula: Audio Overviews and Document Management",
        description: "Your documents speak for themselves",
        detailedDescription:
          "Transform your documents into podcast conversations with two AI voices. A sonic experience that sounds like professional radio. Perfect for learning on the go. Manage your digital library with superhuman intelligence.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 The First Spell",
        objectiveDesc:
          "Gemini Notebook only talks about what it knows: your sources. AI that revolutionizes knowledge management.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand why AI based on your own sources is more trustworthy",
          },
          {
            icon: "fa-check",
            text: "Create your first notebook and watch documents come to life",
          },
          {
            icon: "fa-check",
            text: "Tell the difference between an expert librarian (Gemini Notebook) and a generic chatbot",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Uploading documents without any order — like stuffing a drawer full of papers",
          },
          {
            icon: "fa-times",
            text: "Expecting magic without putting quality sources in the cauldron",
          },
          {
            icon: "fa-times",
            text: "Forgetting it only responds with what YOU give it — garbage in, garbage out",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Sarah uploaded 50 disorganized PDFs and got confusing answers. Garbage in, garbage out.",
          strong:
            "✅ Felipe selected 5 key papers, organized them by topic, added context — and his notebook became an expert assistant that answered with exact citations. The difference: quality over quantity.",
        },
      },
      2: {
        objective: "📚 Curation: The Art of Choosing Well",
        objectiveDesc:
          "Discover why a handful of well-chosen sources is worth more than an entire library in disarray.",
        achievements: [
          {
            icon: "fa-check",
            text: "Select sources like a wine taster chooses their vintage",
          },
          {
            icon: "fa-check",
            text: "Organize documents by themes so connections emerge naturally",
          },
          {
            icon: "fa-check",
            text: "Create cross-source syntheses that bridge ideas like a knowledge highway",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Uploading 50 documents without filtering — more is not better, it's noise",
          },
          {
            icon: "fa-times",
            text: "Mixing contradictory sources without context, like mixing oil and water",
          },
          {
            icon: "fa-times",
            text: "Letting sources grow stale — knowledge expires",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Without curation: Uploading everything I find about AI — no filter, no order, no criteria",
          strong:
            "✅ With curation: 10 papers selected by relevance, organized by topic (ethics, technical, applications), with context notes for each group — like a library curated by an expert",
        },
      },
      3: {
        objective: "🎙️ Audio Overviews",
        objectiveDesc:
          "Turn your documents into AI-generated audio conversations, like a show made just for you. 🧪 The Master Alchemist: master the full workflow, from your documents to a podcast ready to share.",
        achievements: [
          {
            icon: "fa-check",
            text: "Generate Audio Overviews from your documents and hear them come alive",
          },
          {
            icon: "fa-check",
            text: "Customize the tone: deep academic or casual chat — you choose",
          },
          {
            icon: "fa-check",
            text: "Turn studying into an audio experience you can take anywhere",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Expecting a 30-minute podcast from just 2 paragraphs of source material",
          },
          {
            icon: "fa-times",
            text: "Not reviewing the content before sharing — every alchemist verifies their potion",
          },
          {
            icon: "fa-times",
            text: "Using only audio without written summaries — the two formats amplify each other",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic audio: Two voices reading the document with no spark or structure",
          strong:
            "✅ Focused audio: 15-minute podcast where two hosts discuss key findings from 5 papers on neuroplasticity, with practical examples, analogies, and even an 'aha!' moment that makes it unforgettable",
        },
      },
    },
  },
  5: {
    objective:
      "Conduct Claude like an orchestra conductor: delegate real work, create documents and pieces, and supervise every result with human judgment.",
    learningPoints: [
      {
        text: "Write instructions Claude understands on the first try",
        icon: "fa-comments",
      },
      {
        text: "Create documents, presentations and interactive pieces with Artifacts",
        icon: "fa-pen-nib",
      },
      {
        text: "Delegate recurring work with Projects, connectors and Skills",
        icon: "fa-diagram-project",
      },
      {
        text: "Supervise every result: verify data and protect information",
        icon: "fa-shield-halved",
      },
    ],
    overviewData: {
      title: "The Conductor: Claude — Delegate with Judgment",
      description:
        "Claude is no longer just a chat: it creates documents and presentations, connects to your work tools, remembers context and can carry out multi-step tasks. This module teaches you to conduct it: what to ask, how to review what it delivers and what you must never delegate.",
      mission:
        "Your mission as conductor: complete every lesson and delegate one real task from your work. A good conductor doesn't play every instrument; they set the score, listen and correct. Conduct with judgment!",
      topics: [
        {
          title: "Get to Know Claude: the AI That Works With You",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
          outcome:
            "Write a first complete request for Claude, with goal, audience, format and limits.",
        },
        {
          title: "Create with Claude: Artifacts, Documents and Presentations",
          icon: "fa-pen-nib",
          resources: 3,
          duration: "25 min",
          outcome:
            "Ask Claude for a document or a presentation, adjust it with small changes and check the facts before sharing it.",
        },
        {
          title: "Delegate with Claude: Projects, Connectors and Skills",
          icon: "fa-diagram-project",
          resources: 3,
          duration: "30 min",
          outcome:
            "Decide what to delegate to Claude, what you review and what you never delegate, and set up a Project for recurring work.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Get to Know Claude: the AI That Works With You",
        description: "How to think and ask like an orchestra conductor",
        detailedDescription:
          "Before giving instructions, know the instrument. What Claude is, how it differs from a search engine, how to write a request with goal, audience and format, how memory works and when to choose a faster model or a more capable one.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-comments",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#D97757",
      },
      {
        id: 2,
        title: "Create with Claude: Artifacts, Documents and Presentations",
        description: "From an idea to a document or piece ready to share",
        detailedDescription:
          "Artifacts are pieces you see and edit next to the conversation: documents, charts, presentations and small applications. Learn to describe the result, iterate with small adjustments, compare versions and review before sharing.",
        duration: "25 min",
        format: "Lab",
        icon: "fa-pen-nib",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#E8A33D",
      },
      {
        id: 3,
        title: "Delegate with Claude: Projects, Connectors and Skills",
        description: "Recurring work without losing control",
        detailedDescription:
          "A Project keeps the context of one piece of work; connectors give access to your tools with permissions you approve; a Skill reuses a procedure; scheduled tasks automate recurring work. Delegating means defining the goal, the limits and the review: the final decision is still yours.",
        duration: "30 min",
        format: "Video",
        icon: "fa-diagram-project",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#0097A7",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎼 Know your instrument",
        objectiveDesc:
          "Understand what Claude is, how it keeps context and how to ask for what you need on the first try.",
        achievements: [
          {
            icon: "fa-check",
            text: "Write a request with goal, audience, format and tone",
          },
          {
            icon: "fa-check",
            text: "Control what Claude remembers between conversations",
          },
          {
            icon: "fa-check",
            text: "Choose the right model for each type of task",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Asking without context and expecting it to guess the result",
          },
          {
            icon: "fa-times",
            text: "Using the most powerful model for simple tasks: spending without gaining",
          },
          {
            icon: "fa-times",
            text: "Assuming recent data is right without checking a current source",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Vague: 'Write me a proposal for a client'. Generic result, no audience or tone.",
          strong:
            "✅ Clear: 'A 2-page proposal for a school principal's office in Manizales, formal but warm tone, with objective, a 3-month plan and pricing in pesos'. Useful on the first try.",
        },
      },
      2: {
        objective: "🖋️ Create with Artifacts",
        objectiveDesc:
          "Turn an idea into a document, a presentation or an interactive piece, and review it before sharing.",
        achievements: [
          {
            icon: "fa-check",
            text: "Describe the final result before asking for the content",
          },
          {
            icon: "fa-check",
            text: "Iterate with small adjustments instead of redoing everything",
          },
          {
            icon: "fa-check",
            text: "Verify figures, names and dates before presenting",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Accepting a change without comparing it with your version",
          },
          {
            icon: "fa-times",
            text: "Presenting a figure without checking its source",
          },
          {
            icon: "fa-times",
            text: "Sharing an interactive piece without testing it",
          },
        ],
        example: {
          label: "Iteration example",
          weak: "❌ One request: 'Make me a company presentation'. Ten generic slides.",
          strong:
            "✅ Iterating: first a 6-slide outline, then the message of each slide, then charts with verified figures. Three steps, a result ready for the board.",
        },
      },
      3: {
        objective: "🎛️ Delegate with judgment",
        objectiveDesc:
          "Use Projects, connectors and Skills so recurring work moves forward without losing control of decisions.",
        achievements: [
          {
            icon: "fa-check",
            text: "Create a Project with instructions and reference files",
          },
          {
            icon: "fa-check",
            text: "Connect a tool while reviewing the permissions you grant",
          },
          {
            icon: "fa-check",
            text: "Turn a repeated procedure into a reusable Skill",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Giving passwords in the chat or accepting permissions without reading them",
          },
          {
            icon: "fa-times",
            text: "Letting a multi-step task act without confirming important actions",
          },
          {
            icon: "fa-times",
            text: "Uploading third parties' personal data without judgment or a clear policy",
          },
        ],
        example: {
          label: "The conductor vs. the spectator",
          weak: "❌ Spectator: Connected their email, asked 'reply to everything' and sent replies unread. A client received a wrong figure.",
          strong:
            "✅ Conductor: Defined what to reply to, reviewed each draft and used a scheduled task for the weekly summary. They decide what gets sent.",
        },
      },
    },
  },
};

export { CONTENT_EN };
