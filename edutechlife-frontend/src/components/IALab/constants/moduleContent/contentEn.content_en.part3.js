export const CONTENT_EN_PART3 = {
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
          "Imagine a magnifying glass that doesn't just see images — it reads documents, listens to audio, and analyzes video, all at the same time. That's Gemini. In this lesson, you'll learn to wield this multimodal superpower to analyze, create, and crack cases that used to require 4 different tools. Use it as a tutor too: have it explain, quiz you and make you practice. Unlike a search engine, which gives you a list of links, Gemini drafts an answer to your question; that is why you check it. With an audio file, ask for the transcript and compare the lines you will quote with the recording.",
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
          "The most complex cases demand the most powerful tools. Master deep research with AI: Deep Research to explore topics in their entirety, source verification to verify every source, and technical report generation any expert would endorse. Before starting, Deep Research shows you its research plan: review and adjust it. If it does not appear in your account, make the same request in a normal conversation and verify each source. A hallucination is a fact the AI makes up with confidence: mark every unsupported claim and check it. Present projections as estimates, with the source they are based on.",
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
            text: "Configure your arsenal: in the app, the selector offers automatic model selection, Flash-Lite, Flash and Pro (depending on your plan; check your account) and Low, Medium and High reasoning levels (Low by default). Raise it for multi-step problems",
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
            "✅ Detective: 'Analyze this architecture diagram as if you were a systems auditor. Identify every component, trace the data flow, flag scalability vulnerabilities, and compare against the AWS 2024 standard. Deliver a 3-paragraph executive report with action priorities.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "For complex cases: deep investigations with verifiable sources and source verification. Confirm every key fact with an independent source. Before citing an author, check who they are and that the fact is in their text.",
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
            text: "Not cross-referencing with primary sources (whoever produced the data, not whoever comments on it) — quality investigation works with original documents",
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
};
