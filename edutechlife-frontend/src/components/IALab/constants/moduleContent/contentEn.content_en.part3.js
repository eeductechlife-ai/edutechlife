export const CONTENT_EN_PART3 = {
  3: {
    objective:
      "Wield your digital magnifying glass: investigate with Gemini, review every clue, and check every fact against its source before you use it.",
    learningPoints: [
      {
        text: "Analyze text, images, and code as a single body of evidence",
        icon: "fa-cubes",
      },
      {
        text: "Ask for answers with current web sources and open them to check",
        icon: "fa-signal",
      },
      {
        text: "Dig until you find the truth — step-by-step deep investigations with sources you can check",
        icon: "fa-search",
      },
      {
        text: "Separate facts from hallucinations by checking every fact against its source",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "The Data Detective: Research and Verify with Gemini",
      description:
        "Welcome to the digital detective academy. Here you'll learn to cross-reference clues in real-time, analyze any type of evidence (text, image, audio, video), and check every fact against its source before you use it.",
      mission:
        "Your mission: investigate like a data detective. Use Google Gemini to cross-reference clues, verify every source, and deliver a short report in which every key fact has its source. Every lesson brings you closer to your digital detective badge.",
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
          "Imagine a magnifying glass that doesn't just see images — it reads documents, listens to audio, and analyzes video, all at the same time. That's Gemini. In this lesson, you'll learn to ask it to analyze a photo, a document, or an audio file in the same conversation, and to check what it understood. Use it as a tutor too: have it explain, quiz you and make you practice. Unlike a search engine, which gives you a list of links, Gemini drafts an answer to your question; that is why you check it. With an audio file, ask for the transcript and compare the lines you will quote with the recording. Two more features of the app (depending on your plan; check your account): Canvas opens a space next to the chat where you edit a document or code with Gemini, section by section. Gems are custom assistants that save your instructions so you can reuse them; Google is turning Gems into 'skills' (reusable instructions), so you may see them under that name.",
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
          "What good is a magnifying glass if you can't verify what you see? Grounding (connecting the AI to verifiable sources: the live web and your own Workspace files) makes Gemini answer with live data, not frozen knowledge. Learn to combine images, documents, and real-time data to get answers that aren't just smart — they're verifiable. Also ask it to explain a Sheets formula step by step, and test it with a case whose result you know. Before uploading internal data, check your organization's policy and anonymize anything confidential; declare which parts come from Gemini.",
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
          "For questions that need many sources, Gemini has Deep Research: it searches many pages and gives you a report with links. You'll learn to commission it, review its sources one by one, and turn the result into a short report you can defend. Before starting, Deep Research shows you its research plan: review and adjust it. If it does not appear in your account, make the same request in a normal conversation and verify each source. A hallucination is a fact the AI makes up with confidence: mark every unsupported claim and check it. Present projections as estimates, with the source they are based on. For multi-step tasks there is Gemini's agent (in the app it may appear as 'Task'): it shows you the steps it follows, asks for confirmation before sensitive actions such as sending a message or making a purchase, and you can stop it at any time. It is for people 18 and over with a paid plan (depending on your plan; check your account).",
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
          "Gemini processes text, images, audio, and video as one language. One conversation to review several kinds of evidence.",
        achievements: [
          {
            icon: "fa-check",
            text: "Understand how Gemini processes text, images, audio, and video as a single language",
          },
          {
            icon: "fa-check",
            text: "Configure your arsenal: in the app, the selector offers automatic model selection, Flash-Lite, Flash and Pro (depending on your plan; check your account) and Low, Medium and High reasoning levels (Low by default). Raise it for multi-step problems",
          },
          {
            icon: "fa-check",
            text: "Decide when Gemini suits you and when another tool does, depending on the task",
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
            "✅ Detective: Upload a photo of a chart, ask it to describe the trend, search the web for a current fact that explains it (with its link), and ask for a 5-line summary that you check before sharing it",
        },
      },
      2: {
        objective: "🔬 Multimodal Reasoning",
        objectiveDesc:
          "Process several evidence types at once: text, images, audio, and code. Four detectives in one mind.",
        achievements: [
          {
            icon: "fa-check",
            text: "Ask Gemini to describe an image or a document and check what it understood",
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
            text: "Blindly trusting grounding without verification — even the best source can be wrong or outdated: check its date",
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
            "✅ Detective: 'This is a photo of my utility bill. Give me the total, the due date, and this month's usage in a table. If any figure is hard to read, tell me instead of guessing.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "For complex cases: deep investigations with verifiable sources and source verification. Confirm every key fact with an independent source. Before citing an author, check who they are and that the fact is in their text.",
        achievements: [
          {
            icon: "fa-check",
            text: "Commission a Deep Research investigation and review its plan before it starts",
          },
          {
            icon: "fa-check",
            text: "Check key facts by opening their source — your safety net against misinformation",
          },
          {
            icon: "fa-check",
            text: "Write a short report in which every key fact carries its link",
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
            text: "Not cross-referencing with primary sources (whoever produced the data, not whoever comments on it) — quality investigation works with original documents",
          },
        ],
        example: {
          label: "Practical example",
          weak: "❌ Novice: 'What are the AI trends in 2026?' — a question anyone can Google",
          strong:
            "✅ Detective: 'Research 3 uses of AI in schools in Colombia in 2026. For each one: what it is, a real example with its source, and one risk. End with a table and flag anything you could not confirm.'",
        },
      },
    },
  },
};
