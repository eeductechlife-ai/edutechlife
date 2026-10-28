export const CONTENT_EN_PART1 = {
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
};
