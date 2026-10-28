export const CONTENT_EN_PART4 = {
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
          "Meet Gemini Notebook, Google's tool that turns your PDFs, articles, and notes into a personal assistant that responds with citations you can verify. It reduces the risk of error, but does not eliminate it: each statement is checked against its citation. If you ask about something that is not in your sources, add a reliable source; for general ideas with no documents, a general chat works better. It's your librarian with superpowers.",
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
          "Learn to select the best sources like a jeweler picks gemstones, organize them by topic, and weave ideas across documents to create professional-level summaries and analyses. A reliable source has an identifiable author, a date and references you can check. Include sources with different positions, so your synthesis does not show a single view.",
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
          "Transform your documents into podcast conversations with two AI voices. A sonic experience that sounds like professional radio. Perfect for learning on the go. Manage your digital library with superhuman intelligence: one notebook per project, with a clear name, so you can find everything. Before sharing a notebook, remove personal or sensitive data (anonymize lists of people) and decide who can view it and who can edit it. The audio summarizes; to cite an idea, find it in the notebook's citations and cite the document, not the audio.",
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
          "Gemini Notebook answers based on your sources and shows you where each answer comes from. The AI that transforms knowledge management.",
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
};
