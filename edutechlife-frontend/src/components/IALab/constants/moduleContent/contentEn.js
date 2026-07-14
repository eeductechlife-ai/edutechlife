/**
 * CONSTANTES: contentEn.js
 *
 * English educational content for IALab modules 2-5
 * Module 1 remains with its original hardcoded data
 */

const CONTENT_EN = {
  1: {
    objective:
      "Develop prompt engineering skills to get accurate AI results in real-world contexts.",
    learningPoints: [
      { text: "Giving clear instructions to AI", icon: "fa-bullseye" },
      {
        text: "Improving questions and answers",
        icon: "fa-wand-magic-sparkles",
      },
      { text: "Detecting and fixing errors", icon: "fa-exclamation-triangle" },
      { text: "Applying AI in study and work", icon: "fa-rocket" },
    ],
    overviewData: {
      title: "Master the Instructions",
      description:
        "Learn to communicate with AI like a professional. From fundamentals to advanced techniques that will transform how you work.",
      mission:
        "Complete each lesson and multimedia resource (videos, guides, and labs). Every step brings you 20% closer to your certification. Clear instructions are your superpower!",
      topics: [
        {
          title: "Introduction to Generative Artificial Intelligence",
          icon: "fa-brain",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "What is a Prompt?",
          icon: "fa-comments",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [],
    accordionContent: {},
  },

  2: {
    objective:
      "Become a ChatGPT expert and create intelligent assistants that automate your daily work.",
    learningPoints: [
      { text: "Master advanced System Prompts", icon: "fa-sliders" },
      { text: "Connect GPT with external APIs", icon: "fa-code" },
      { text: "Create your own custom GPT", icon: "fa-robot" },
      { text: "Automate workflows", icon: "fa-cog" },
    ],
    overviewData: {
      title: "ChatGPT Without Limits",
      description:
        "In this module, you will unlock the true potential of ChatGPT. From setting up professional system prompts to creating custom GPTs that work for you.",
      mission:
        "Complete each lesson and master the world's most used AI. Each completed resource brings you closer to a professional level. Take your skills to the next level!",
      topics: [
        {
          title: "Complete ChatGPT Guide",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Workflow Templates",
          icon: "fa-layer-group",
          resources: 2,
          duration: "20 min",
        },
        {
          title: "Function Calling and OpenAI APIs",
          icon: "fa-code",
          resources: 2,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Complete ChatGPT Guide",
        description: "The ultimate guide to mastering ChatGPT",
        detailedDescription:
          "Access the Complete ChatGPT Guide from Edutechlife: a comprehensive resource covering everything from fundamentals to advanced techniques. Learn to leverage every model, set up effective conversations, and master best practices for professional results.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC",
      },
      {
        id: 2,
        title: "Workflow Templates",
        description: "Create automations that work for you",
        detailedDescription:
          "Discover ChatGPT's arsenal of tools: web search, Python data analysis, image generation, and more. Learn to combine them to create powerful automations.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA",
      },
      {
        id: 3,
        title: "Function Calling and OpenAI APIs",
        description: "Connect ChatGPT to the real world",
        detailedDescription:
          "Take ChatGPT to the next level: connect it with APIs, databases, and external services. Create automated workflows that solve real problems.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc:
          "Master ChatGPT completely through Edutechlife's comprehensive guide, from fundamentals to advanced techniques.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand the architecture and evolution of GPT models",
          },
          {
            icon: "fa-check",
            text: "Apply professional prompt engineering techniques",
          },
          {
            icon: "fa-check",
            text: "Select the optimal model based on cost and capability",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Using the most expensive model for simple tasks",
          },
          { icon: "fa-times", text: "Ignoring context limits (tokens)" },
          { icon: "fa-times", text: "Not keeping up with new model updates" },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic usage: Using GPT-4 for simple tasks that GPT-3.5 handles just as well",
          strong:
            "✅ Smart usage: GPT-3.5 for quick summaries, GPT-4 for complex analysis and deep reasoning",
        },
      },
      2: {
        objective: "🏗️ Integrated Tools: The Complete ChatGPT Ecosystem",
        objectiveDesc:
          "Master all of ChatGPT's integrated tools: Web Search, Code Interpreter, DALL-E 3, Canvas, and Projects. Learn to combine them in professional workflows.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identify when to use each integrated tool",
          },
          {
            icon: "fa-check",
            text: "Combine multiple tools in a single workflow",
          },
          {
            icon: "fa-check",
            text: "Create automations that solve real problems",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Using DALL-E 3 for long text or brand logos",
          },
          {
            icon: "fa-times",
            text: "Relying on training data for current information",
          },
          {
            icon: "fa-times",
            text: "Not organizing projects by specific goals",
          },
        ],
        example: {
          label: "Integrated workflow example",
          weak: "❌ Isolated: Asking for updated data without enabling Web Search → outdated results",
          strong:
            "✅ Integrated: Search current data (Browse) → analyze with Python (Code Interpreter) → generate infographic (DALL-E 3) → edit in Canvas",
        },
      },
      3: {
        objective: "⚡ Function Calling: Connect ChatGPT to the Real World",
        objectiveDesc:
          "Integrate ChatGPT with external APIs so it can query data, execute actions, and automate complete workflows.",
        achievements: [
          {
            icon: "fa-check",
            text: "Configure Function Calling with the OpenAI API",
          },
          {
            icon: "fa-check",
            text: "Define functions with clear JSON schemas",
          },
          { icon: "fa-check", text: "Create multi-step automated workflows" },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Not validating API responses before using them",
          },
          {
            icon: "fa-times",
            text: "Sending sensitive data without authentication",
          },
          { icon: "fa-times", text: "Not handling connection errors properly" },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Basic prompt: What's the weather today?",
          strong:
            "✅ Function Calling: ChatGPT detects the intent, calls the weather API, receives JSON data, and generates: The current weather in Bogotá is 18°C with 65% humidity. We recommend bringing an umbrella due to 80% rain probability this afternoon.",
        },
      },
    },
  },

  3: {
    objective:
      "Use Google Gemini to research deeply, verify data, and analyze information like a professional.",
    learningPoints: [
      { text: "Analyze text, images, and code together", icon: "fa-cubes" },
      { text: "Get real-time data", icon: "fa-signal" },
      { text: "Research topics in depth", icon: "fa-search" },
      { text: "Verify information with AI", icon: "fa-shield-alt" },
    ],
    overviewData: {
      title: "Elite Research with Gemini",
      description:
        "In this module, you will master Google Gemini for advanced research. Learn to cross-reference real-time data, analyze multiple formats, and verify information with precision.",
      mission:
        "Become an elite researcher. Master Google Gemini and discover how to cross-reference data, verify sources, and create professional reports with AI.",
      topics: [
        {
          title: "Introduction to Google Gemini",
          icon: "fa-google",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Multimodal Reasoning and Grounding",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Deep Research and Fact-Checking with AI",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Introduction to Google Gemini",
        description: "Gemini: the AI that sees, reads, and listens",
        detailedDescription:
          "Gemini is Google's multimodal AI that processes text, images, audio, and video simultaneously. Learn to use it to analyze, create, and solve complex problems.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4",
      },
      {
        id: 2,
        title: "Multimodal Reasoning and Grounding",
        description: "Analyze images, text, and data together",
        detailedDescription:
          "Learn to combine images, documents, and live data. Gemini analyzes everything simultaneously to give you answers with verifiable real-world sources.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4",
      },
      {
        id: 3,
        title: "Deep Research and Fact-Checking with AI",
        description: "Research like a professional",
        detailedDescription:
          "Master AI-powered research: deep research, automatic data verification, and generation of technical reports with cited and verifiable sources.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc:
          "Learn about Google Gemini, its multimodal capabilities, and how it differs from other AI models.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand Gemini's multimodal architecture",
          },
          {
            icon: "fa-check",
            text: "Set up Gemini Advanced and Google AI Studio",
          },
          {
            icon: "fa-check",
            text: "Compare Gemini with ChatGPT and other models",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Using Gemini as if it were just a chatbot",
          },
          {
            icon: "fa-times",
            text: "Not leveraging its image analysis capabilities",
          },
          { icon: "fa-times", text: "Ignoring grounding with Google Search" },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Basic usage: Asking what Gemini is",
          strong:
            "✅ Advanced usage: Upload an image of a financial chart, request trend analysis, cross-reference with real-time search data, and generate an executive report",
        },
      },
      2: {
        objective: "🔬 Multimodal Reasoning: See, Read, and Analyze",
        objectiveDesc:
          "Master Gemini's ability to process text, images, audio, and code simultaneously with real-time grounding.",
        achievements: [
          {
            icon: "fa-check",
            text: "Analyze images and documents with Gemini",
          },
          {
            icon: "fa-check",
            text: "Use grounding for up-to-date internet data",
          },
          {
            icon: "fa-check",
            text: "Combine multiple inputs in a single analysis",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Uploading low-quality images without context",
          },
          {
            icon: "fa-times",
            text: "Blindly trusting grounding without verification",
          },
          {
            icon: "fa-times",
            text: "Not specifying the expected type of analysis",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Vague prompt: Analyze this image",
          strong:
            "✅ Multimodal prompt: Analyze this technical architecture diagram. Identify the components, explain the data flow, suggest scalability improvements, and compare with the AWS 2024 reference architecture.",
        },
      },
      3: {
        objective: "🔍 Deep Research: Expert-Level Investigation",
        objectiveDesc:
          "Use Gemini for deep research with verifiable sources, automatic fact-checking, and technical report generation.",
        achievements: [
          { icon: "fa-check", text: "Run Deep Research with cited sources" },
          {
            icon: "fa-check",
            text: "Verify information with automatic fact-checking",
          },
          {
            icon: "fa-check",
            text: "Generate technical reports with references",
          },
        ],
        warnings: [
          { icon: "fa-times", text: "Not verifying the sources Gemini cites" },
          {
            icon: "fa-times",
            text: "Accepting the first answer without digging deeper",
          },
          {
            icon: "fa-times",
            text: "Not cross-referencing information with primary sources",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Surface level: What are the AI trends in 2025?",
          strong:
            "✅ Deep Research: Research the top 5 generative AI trends in 2025. For each: primary source, adoption data, real use cases, identified risks, and 3-year projection. Include verifiable URLs.",
        },
      },
    },
  },

  4: {
    objective:
      "Transform documents and sources into podcasts, summaries, and actionable knowledge in minutes.",
    learningPoints: [
      { text: "Select and curate your sources", icon: "fa-book-open" },
      { text: "Synthesize documents with AI", icon: "fa-file-alt" },
      { text: "Create podcasts from your files", icon: "fa-microphone" },
      { text: "Manage intelligent documentation", icon: "fa-folder-open" },
    ],
    overviewData: {
      title: "Your First AI Notebook",
      description:
        "In this module, you will transform any document into useful knowledge. From intelligent summaries to AI-generated podcasts, all from a single tool.",
      mission:
        "Master the art of transforming documents into knowledge. Turn PDFs into intelligent summaries, podcasts, and personalized research assistants.",
      topics: [
        {
          title: "What is NotebookLM and how is it used?",
          icon: "fa-microphone",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Source Curation and Document Synthesis",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Audio Overviews and AI Document Management",
          icon: "fa-podcast",
          resources: 3,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "What is NotebookLM and how is it used?",
        description: "Your AI research assistant",
        detailedDescription:
          "Discover NotebookLM, Google's tool that turns your PDFs, articles, and notes into a personal assistant that responds with exact citations from your documents.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B",
      },
      {
        id: 2,
        title: "Source Curation and Document Synthesis",
        description: "Organize your research like a pro",
        detailedDescription:
          "Learn to select the best sources, organize them by topic, and connect ideas across documents to create professional-level summaries and analyses.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981",
      },
      {
        id: 3,
        title: "Audio Overviews and AI Document Management",
        description: "Turn PDFs into podcasts",
        detailedDescription:
          "Transform your documents into podcast conversations with two AI voices. Ideal for learning on the go. Manage your knowledge library intelligently.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc:
          "Understand what NotebookLM is, how it works, and why it's revolutionary for personal knowledge management.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand the concept of AI based on your own sources",
          },
          {
            icon: "fa-check",
            text: "Create your first notebook with documents",
          },
          {
            icon: "fa-check",
            text: "Differentiate NotebookLM from generic chatbots",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Uploading documents without curating or organizing them",
          },
          {
            icon: "fa-times",
            text: "Expecting it to work without quality sources",
          },
          {
            icon: "fa-times",
            text: "Not understanding it only responds based on your sources",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Empty notebook: No sources uploaded, no context",
          strong:
            "✅ Powerful notebook: 5 academic research PDFs + 3 industry articles = Expert assistant that responds with verbatim citations from your documents",
        },
      },
      2: {
        objective: "📚 Source Curation: Quality over Quantity",
        objectiveDesc:
          "Learn to select, organize, and synthesize documents to maximize the value of your research notebook.",
        achievements: [
          { icon: "fa-check", text: "Select relevant and reliable sources" },
          {
            icon: "fa-check",
            text: "Organize documents by thematic categories",
          },
          {
            icon: "fa-check",
            text: "Generate cross-syntheses across multiple sources",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Uploading 50 documents without quality filtering",
          },
          {
            icon: "fa-times",
            text: "Mixing contradictory sources without context",
          },
          { icon: "fa-times", text: "Not updating sources regularly" },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Without curation: Uploading everything I find about AI",
          strong:
            "✅ With curation: 10 papers selected by relevance, organized by topic (ethics, technical, applications), with context notes for each group",
        },
      },
      3: {
        objective: "🎙️ Audio Overviews: Your Knowledge in Podcast Format",
        objectiveDesc:
          "Transform complex documents into engaging audio conversations generated by AI with two virtual hosts.",
        achievements: [
          {
            icon: "fa-check",
            text: "Generate Audio Overviews from your documents",
          },
          { icon: "fa-check", text: "Customize the podcast tone and focus" },
          {
            icon: "fa-check",
            text: "Use audio for review and mobile learning",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Expecting perfect audio with short documents",
          },
          {
            icon: "fa-times",
            text: "Not reviewing generated content before sharing",
          },
          {
            icon: "fa-times",
            text: "Using only audio without supplementing with written summaries",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic audio: Vague conversation about the topic",
          strong:
            "✅ Focused audio: 15-minute podcast where two hosts discuss key findings from 5 papers on neuroplasticity, with practical examples and clear analogies",
        },
      },
    },
  },

  5: {
    objective:
      "Learn to use AI responsibly, ethically, and legally with frameworks that companies demand today.",
    learningPoints: [
      { text: "Detect algorithmic biases", icon: "fa-shield-check" },
      { text: "Know current AI regulations", icon: "fa-briefcase" },
      { text: "Protect data and privacy", icon: "fa-lock" },
      { text: "Create ethical AI protocols", icon: "fa-clipboard-check" },
    ],
    overviewData: {
      title: "Responsible and Ethical AI",
      description:
        "In this final module, you will develop critical thinking about the ethical impacts of AI. Learn to identify biases, comply with regulations, and create responsible AI frameworks.",
      mission:
        "Become an ethical and responsible AI professional. This module completes your global certification with the skills companies are looking for today.",
      topics: [
        {
          title: "Ethics in Artificial Intelligence",
          icon: "fa-balance-scale",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Algorithmic Biases and Fairness",
          icon: "fa-exclamation-triangle",
          resources: 3,
          duration: "20 min",
        },
        {
          title: "Privacy, Regulation, and Responsible AI",
          icon: "fa-shield-alt",
          resources: 2,
          duration: "20 min",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Ethics in Artificial Intelligence",
        description: "Ethical foundations for using generative AI",
        detailedDescription:
          "Ethical foundations for using generative AI. Understand the principles of transparency, fairness, accountability, and privacy that every professional must apply when working with AI.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444",
      },
      {
        id: 2,
        title: "Algorithmic Biases and Fairness",
        description: "Identify and mitigate biases in AI systems",
        detailedDescription:
          "Identify and mitigate biases in AI systems. Learn to detect algorithmic discrimination, understand its causes, and apply strategies to create fairer and more inclusive systems.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316",
      },
      {
        id: 3,
        title: "Privacy, Regulation, and Responsible AI",
        description: "Legal framework and best practices for ethical AI",
        detailedDescription:
          "Legal framework and best practices for ethical AI. Learn about current regulations (EU AI Act, local laws), data protection, and how to design AI governance frameworks in your organization.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc:
          "Develop a solid ethical framework for using generative AI that protects users, organizations, and society.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand the fundamental ethical principles of AI",
          },
          {
            icon: "fa-check",
            text: "Identify ethical dilemmas in real-world cases",
          },
          {
            icon: "fa-check",
            text: "Apply an ethical checklist before using AI",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Using AI without considering the impact on people",
          },
          {
            icon: "fa-times",
            text: "Assuming AI is neutral because it's technology",
          },
          { icon: "fa-times", text: "Ignoring unintended consequences" },
        ],
        example: {
          label: "Real ethical case",
          weak: "❌ Unethical: Generating fake content with AI and publishing it as real",
          strong:
            "✅ Ethical: Always disclosing when AI is used, verifying generated information, respecting copyright, and protecting personal data",
        },
      },
      2: {
        objective: "⚖️ Algorithmic Biases: The Invisible Enemy",
        objectiveDesc:
          "Learn to detect, understand, and mitigate the biases that AI systems inherit from their training data.",
        achievements: [
          { icon: "fa-check", text: "Identify types of algorithmic biases" },
          { icon: "fa-check", text: "Analyze real cases of AI discrimination" },
          { icon: "fa-check", text: "Apply bias mitigation techniques" },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Trusting results without verifying fairness",
          },
          { icon: "fa-times", text: "Using non-representative training data" },
          { icon: "fa-times", text: "Not auditing AI outputs regularly" },
        ],
        example: {
          label: "Real bias case",
          weak: "❌ Biased: AI recruiting tool that rejects candidates based on gender, trained on biased historical data",
          strong:
            "✅ Fair: Audit the training dataset, include fairness variables, test with diverse groups, and review results periodically",
        },
      },
      3: {
        objective: "🔒 Regulation and Governance: The Legal Framework of AI",
        objectiveDesc:
          "Learn about current AI regulations and how to design governance protocols that protect your organization.",
        achievements: [
          { icon: "fa-check", text: "Know the European Union AI Act" },
          {
            icon: "fa-check",
            text: "Understand privacy and transparency obligations",
          },
          {
            icon: "fa-check",
            text: "Design an ethical AI protocol for your organization",
          },
        ],
        warnings: [
          { icon: "fa-times", text: "Ignoring current AI regulations" },
          {
            icon: "fa-times",
            text: "Not protecting personal data in AI processes",
          },
          {
            icon: "fa-times",
            text: "Implementing AI without governance policies",
          },
        ],
        example: {
          label: "Protocol example",
          weak: "❌ No protocol: Using AI for everything without supervision or audits",
          strong:
            "✅ With protocol: AI ethics committee, quarterly audits, privacy checklist before each implementation, transparent disclosure to end users",
        },
      },
    },
  },
};

export { CONTENT_EN };
