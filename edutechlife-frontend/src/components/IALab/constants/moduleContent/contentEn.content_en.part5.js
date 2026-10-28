export const CONTENT_EN_PART5 = {
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
          "Before giving instructions, know the instrument. What Claude is, how it differs from a search engine, how to write a request with goal, audience and format, how memory works and when to choose a faster model or a more capable one. Memory is reviewed and adjusted in the settings; an incognito chat is not saved to your history or to memory, and it is only available outside Projects (Claude help center, checked in October 2026).",
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
