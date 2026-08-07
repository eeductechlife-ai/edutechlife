/**
 * CONSTANTES: contentEn.js
 *
 * English educational content for IALab modules 2-5
 * Module 1 remains with its original hardcoded data
 */

const CONTENT_EN = {
  1: {
    objective:
      "Master the art of forging precise instructions with AI as a digital artisan apprentice, creating prompts any model understands perfectly.",
    learningPoints: [
      { text: "Forge clear instructions like a master artisan", icon: "fa-bullseye" },
      {
        text: "Refine questions and answers with surgical precision",
        icon: "fa-wand-magic-sparkles",
      },
      { text: "Detect and fix imperfections in your creations", icon: "fa-exclamation-triangle" },
      { text: "Apply your artisan craft in study and work", icon: "fa-rocket" },
    ],
    overviewData: {
      title: "The Digital Artisan: Prompt Engineering — The Foundation of Every AI Interaction",
      description:
        "Every artisan starts with basic tools and, with practice, becomes a master. Here you'll learn to sculpt instructions that AI understands perfectly. From fundamentals to advanced techniques that will transform how you work with artificial intelligence.",
      mission:
        "Your mission as an artisan: complete each lesson and multimedia resource (videos, guides, and labs). Every tool you master brings you 20% closer to your certification. Precise instructions are your quality seal!",
      topics: [
        {
          title: "The Artisan's Foundations: What is Generative AI?",
          icon: "fa-brain",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "The Artisan's Chisel: What is a Prompt?",
          icon: "fa-comments",
          resources: 4,
          duration: "20 min",
        },
      ],
    },
    lessons: [],
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
    },
  },

  2: {
    objective:
      "Design and build intelligent systems with ChatGPT: from foundations to full automation of your daily work as a true digital architect.",
    learningPoints: [
      { text: "Design master blueprints with advanced System Prompts", icon: "fa-sliders" },
      { text: "Connect structures with external APIs", icon: "fa-code" },
      { text: "Build your own custom GPT as an architectural module", icon: "fa-robot" },
      { text: "Automate complete construction workflows", icon: "fa-cog" },
    ],
    overviewData: {
      title: "The Digital Architect: ChatGPT & Automation — Build Your Own Work Ecosystem",
      description:
        "Welcome to the masterpiece of automation. Here you won't just use ChatGPT — you'll build with it. Learn to design system prompts like architectural blueprints, use integrated tools as scaffolding, create GPTs as construction modules, and connect everything with external APIs to raise digital structures that work on their own.",
      mission:
        "Your mission as an architect: complete each lesson and master the art of building with ChatGPT. Every structure you design brings you closer to your automation architect certification. Build your digital masterpiece!",
      topics: [
        {
          title: "The Architect's Blueprints: Complete ChatGPT Guide",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "The Architect's Scaffolding: Integrated Tools",
          icon: "fa-layer-group",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "The Architect's Flow: Real-World Automation",
          icon: "fa-robot",
          resources: 1,
          duration: "22 min",
        },
        {
          title: "The Building's Facade: GPTs and Function Calling",
          icon: "fa-code",
          resources: 2,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Architect's Blueprints: Complete ChatGPT Guide",
        description: "The foundations of every great digital construction",
        detailedDescription:
          "Every building starts with a blueprint. In this lesson, you'll learn the complete architecture of ChatGPT: from available models to professional prompt engineering best practices. Learn to select the right tool for each phase of your construction and lay the foundations of your automation projects.",
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
          "An architect doesn't build with bare hands — they use cranes, scaffolding, and specialized tools. Discover ChatGPT's arsenal: Web Search, Data Analysis with Python, DALL-E 3, Canvas, and Projects. Learn to combine them to build powerful automations that multiply your productivity.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA",
      },
      {
        id: 3,
        title: "The Building's Facade: GPTs and Function Calling",
        description: "Connect your work to the real world",
        detailedDescription:
          "The facade is what the world sees, but behind it lies a complex structure that holds it up. Take your constructions to the next level: connect custom GPTs with APIs, databases, and external services. Create automated workflows that solve real problems while you design the next project.",
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
          weak: "❌ Amateur: Using GPT-4 for everything, even tasks GPT-3.5 handles in seconds",
          strong:
            "✅ Architect: GPT-3.5 for quick drafts and summaries, GPT-4 for complex structural analysis and deep reasoning — the right material for each layer of construction",
        },
      },
      2: {
        objective: "🏗️ The Architect's Scaffolding",
        objectiveDesc:
          "Master ChatGPT's tool ecosystem: Web Search, Code, DALL-E 3, Canvas, and Projects.",
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
            text: "Using DALL-E 3 for long text or brand logos — like using a chisel as a hammer",
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
            "✅ Integrated: Search current data (Browse) → analyze with Python (Code Interpreter) → generate infographic (DALL-E 3) → edit in Canvas — a construction in 4 perfectly orchestrated phases",
        },
      },
      3: {
        objective: "⚡ The Architect's Flow",
        objectiveDesc:
          "Connect your ChatGPT builds to the outside world via APIs: data, actions, and full automation.",
        achievements: [
          {
            icon: "fa-check",
            text: "Configure Function Calling with the OpenAI API like digital plumbing systems",
          },
          {
            icon: "fa-check",
            text: "Define functions with clear JSON schemas — the blueprints of your connections",
          },
          { icon: "fa-check", text: "Create multi-step automated workflows that run 24/7" },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Not validating API responses before using them — like not inspecting construction materials",
          },
          {
            icon: "fa-times",
            text: "Sending sensitive data without authentication — like leaving doors open at your construction site",
          },
          {
            icon: "fa-times",
            text: "Not handling connection errors properly — like having no earthquake contingency plan",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Basic prompt: What's the weather today? — like asking the weather by looking out the window",
          strong:
            "✅ Function Calling: ChatGPT detects the intent, calls the weather API, receives JSON data, and generates: The current weather in Bogotá is 18°C with 65% humidity. We recommend bringing an umbrella due to 80% rain probability this afternoon. An elegant facade connecting to live real-world data.",
        },
      },
      4: {
        objective: "⚡ The Building's Facade",
        objectiveDesc:
          "Create custom GPTs and connect them to the real world with Function Calling: automate your daily work.",
      },
    },
  },

  3: {
    objective:
      "Wield your digital magnifying glass: investigate deeply, verify every clue, and analyze information with the precision of a master detective.",
    learningPoints: [
      { text: "Analyze text, images, and code as a single body of evidence", icon: "fa-cubes" },
      { text: "Pull fresh clues from the real world in real-time", icon: "fa-signal" },
      { text: "Dig until you find the truth — deep investigations no other detective can match", icon: "fa-search" },
      { text: "Separate facts from hallucinations with AI-powered forensic verification", icon: "fa-shield-alt" },
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
        },
        {
          title: "Grounding: When Evidence Touches the Real World",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Deep Research: The Forensic Toolkit",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Multimodal Detective Awakens",
        description: "Gemini: your all-terrain magnifying glass that sees, reads, and listens simultaneously",
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
        description: "Connect your magnifying glass to solid ground: live data from the real world",
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
        description: "Dig until you find the truth with deep investigation tools",
        detailedDescription:
          "The most complex cases demand the most powerful tools. Master deep research with AI: Deep Research to explore topics in their entirety, automatic fact-checking to verify every source, and technical report generation any expert would endorse.",
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
          { icon: "fa-times", text: "Not using grounding — it's like investigating with your eyes closed" },
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
          "For complex cases: deep investigations with verifiable sources and automatic fact-checking.",
        achievements: [
          { icon: "fa-check", text: "Execute deep investigations that cross-reference dozens of sources automatically" },
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
          { icon: "fa-times", text: "Accepting unverified sources — even the best detective double-checks" },
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
      { text: "Curate your sources like a jeweler picks gemstones", icon: "fa-book-open" },
      { text: "Distill documents into pure knowledge with AI", icon: "fa-file-alt" },
      { text: "Create radio-quality podcasts from your files", icon: "fa-microphone" },
      { text: "Manage your digital library with superhuman intelligence", icon: "fa-folder-open" },
    ],
    overviewData: {
      title: "The Digital Alchemist: NotebookLM — Where Your Documents Become Knowledge",
      description:
        "In this module, you will become a digital alchemist: your PDFs, articles, and notes hold hidden potential you never imagined. Learn to extract, transform, and share them in formats that captivate, educate, and transform.",
      mission:
        "Become a digital alchemist: your PDFs, articles, and notes hold hidden potential you never imagined. Learn to extract, transform, and share them in ways that captivate, educate, and transform.",
      topics: [
        {
          title: "The Document Alchemist: Your First Spell with NotebookLM",
          icon: "fa-microphone",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "The Art of Curation: How to Choose and Synthesize Sources",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "The Secret Formula: Audio Overviews and Document Management",
          icon: "fa-podcast",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "The Master Alchemist: Complete Document-to-Podcast Flow",
          icon: "fa-headphones",
          resources: 1,
          duration: "24 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Document Alchemist: Your First Spell with NotebookLM",
        description: "Where PDFs come to life",
        detailedDescription:
          "Meet NotebookLM, Google's tool that turns your PDFs, articles, and notes into a personal assistant that responds with exact citations. It doesn't hallucinate. It doesn't make things up. It's your librarian with superpowers.",
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
          "NotebookLM only talks about what it knows: your sources. AI that revolutionizes knowledge management.",
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
            text: "Tell the difference between an expert librarian (NotebookLM) and a generic chatbot",
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
          { icon: "fa-times", text: "Letting sources grow stale — knowledge expires" },
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
          "Turn your documents into AI-generated audio conversations, like a show made just for you.",
        achievements: [
          {
            icon: "fa-check",
            text: "Generate Audio Overviews from your documents and hear them come alive",
          },
          { icon: "fa-check", text: "Customize the tone: deep academic or casual chat — you choose" },
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
      4: {
        objective: "🧪 The Master Alchemist",
        objectiveDesc:
          "Master the full workflow: from your documents to a podcast ready to share.",
      },
    },
  },

  5: {
    objective:
      "Master the 4 ethical pillars that companies demand today and become the guardian who ensures AI serves humanity.",
    learningPoints: [
      { text: "Detect algorithmic biases like a guardian", icon: "fa-shield-check" },
      { text: "Master AI regulations that protect millions", icon: "fa-briefcase" },
      { text: "Shield data and privacy from threats", icon: "fa-lock" },
      { text: "Create ethical protocols that save reputations", icon: "fa-clipboard-check" },
    ],
    overviewData: {
      title: "The Digital Guardian: AI Ethics & Governance — The Mark of a Responsible Professional",
      description:
        "Every time you use AI, you're making ethical decisions — whether you know it or not. Are your uploaded files protected? Is the output fair for everyone? Who's accountable if something goes wrong? This module isn't just theory — it's your training to become an AI guardian.",
      mission:
        "Become the guardian AI needs. Complete your global certification with the ethical skills that separate responsible professionals from those who risk their careers.",
      topics: [
        {
          title: "The Guardian's Vow: 4 Sacred Principles",
          icon: "fa-balance-scale",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "The Mirror of Truth: Is Your AI Fair?",
          icon: "fa-exclamation-triangle",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "The Guardian's Legacy: Navigating the Law",
          icon: "fa-shield-alt",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "The Guardian's Vow: 4 Sacred Principles",
        description: "The ethical foundations every AI guardian must know",
        detailedDescription:
          "Welcome to guardian training. Before you use any AI tool, there are 4 principles you must engrave in your professional DNA: transparency, fairness, accountability, and privacy. These aren't abstract theory — they're the shield that protects your users, your organization, and your reputation.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444",
      },
      {
        id: 2,
        title: "The Mirror of Truth: Is Your AI Fair?",
        description: "Detect and destroy hidden biases in algorithms",
        detailedDescription:
          "Every algorithm inherits the prejudices of its creators and its data. In this lesson, you'll become a bias hunter: learn to detect algorithmic discrimination, understand its root causes, and apply fairness strategies that make your systems truly inclusive.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316",
      },
      {
        id: 3,
        title: "The Guardian's Legacy: Navigating the Law",
        description: "The legal framework and best practices every guardian must master",
        detailedDescription:
          "Wanting to do right isn't enough — you need to know the law. From the EU AI Act to local regulations, data protection to corporate governance, this lesson gives you the legal map to navigate AI without putting anyone at risk.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B",
      },
    ],
    accordionContent: {
      1: {
        objective: "🛡️ The Guardian's Ethical Oath",
        objectiveDesc:
          "Build a bulletproof ethical framework for generative AI: protect users, organizations, and society.",
        achievements: [
          {
            icon: "fa-check",
            text: "Internalize the 4 sacred pillars of the AI guardian",
          },
          {
            icon: "fa-check",
            text: "Detect ethical dilemmas in real-world cases before they cause harm",
          },
          {
            icon: "fa-check",
            text: "Apply a fail-safe ethical checklist before every AI interaction",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Using AI as a weapon without a shield — ignoring the impact on people",
          },
          {
            icon: "fa-times",
            text: "Believing AI is neutral — unguarded technology is dangerous",
          },
          { icon: "fa-times", text: "Ignoring unintended consequences until it's too late" },
        ],
        example: {
          label: "The Guardian vs. The Reckless",
          weak: "❌ The reckless: A student used AI to generate an entire essay without verification. The AI invented data, fake citations, and non-existent references. The professor caught everything, and the student lost all academic credibility.",
          strong:
            "✅ The guardian: A student used AI as an assistant, verified every source with real data, disclosed AI use to the professor, and submitted an impeccable paper. Result: deep learning + professor trust + perfect grade.",
        },
      },
      2: {
        objective: "🔍 The Bias Hunter",
        objectiveDesc:
          "Detect and eliminate the biases AI inherits from its data before they cause harm.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identify 7 types of algorithmic biases like a forensic expert",
          },
          {
            icon: "fa-check",
            text: "Analyze real cases where AI discriminated — and understand why",
          },
          {
            icon: "fa-check",
            text: "Apply surgical bias mitigation techniques",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Blindly trusting AI results without verifying fairness",
          },
          { icon: "fa-times", text: "Feeding AI training data that excludes entire groups" },
          { icon: "fa-times", text: "Never auditing AI outputs — silence is not safety" },
        ],
        example: {
          label: "The AI That Discriminated Without Knowing It",
          weak: "❌ Biased: A hiring AI learned from 10 years of historical data where only men held certain positions. It automatically began filtering out women — not out of malice, but from corrupted data.",
          strong:
            "✅ Fair: The audit team detected the bias in the testing phase, retrained the model with balanced data, included fairness variables, and established quarterly audits. The AI now selects without prejudice.",
        },
      },
      3: {
        objective: "📜 The Guardian's Code",
        objectiveDesc:
          "Learn the laws governing AI and design protocols that shield your organization.",
        achievements: [
          { icon: "fa-check", text: "Master the European Union AI Act like a compliance expert" },
          {
            icon: "fa-check",
            text: "Understand legal obligations for privacy and transparency",
          },
          {
            icon: "fa-check",
            text: "Design an ethical AI protocol worthy of a guardian",
          },
        ],
        warnings: [
          { icon: "fa-times", text: "Ignoring current AI regulations — ignorance is no defense" },
          {
            icon: "fa-times",
            text: "Processing personal data with AI without legal protection",
          },
          {
            icon: "fa-times",
            text: "Implementing AI in your organization without governance policies",
          },
        ],
        example: {
          label: "Two Worlds, One Algorithm",
          weak: "❌ No protocol: A startup deployed customer service chatbots without ethical oversight. Within 48 hours, the chatbot had insulted clients in 3 different languages, violated privacy norms, and triggered a PR crisis.",
          strong:
            "✅ With protocol: An AI ethics committee approved every implementation, quarterly audits caught problems before they reached the public, a mandatory privacy checklist before every deployment, and transparent disclosure to end users. Result: customer trust, zero incidents.",
        },
      },
    },
  },
};

export { CONTENT_EN };
