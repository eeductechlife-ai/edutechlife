export const MODULE_4_EN = [
  {
    id: "m4q1",
    question:
      'You are a marine biology researcher and need to analyze 15 academic papers on climate change impact on coral reefs for a publication. Your supervisor asks: "Why would you use NotebookLM instead of ChatGPT for this research?" What is the most compelling reason?',
    options: [
      {
        id: "m4q1_a",
        label:
          "NotebookLM works exclusively with your documents and textually cites each source, eliminating the risk of inventing data not in your papers",
      },
      {
        id: "m4q1_b",
        label: "ChatGPT cannot read academic PDFs, only plain text documents",
      },
      {
        id: "m4q1_c",
        label:
          "NotebookLM is faster because it does not need internet connection",
      },
      {
        id: "m4q1_d",
        label:
          "ChatGPT only processes information in English and papers may be in other languages",
      },
    ],
    correctAnswer: "m4q1_a",
    topic: "NotebookLM",
    difficulty: "medium",
    feedback:
      'NotebookLM is designed for research based on your own sources: zero hallucinations, verifiable citations, and deep contextual analysis. ChatGPT is excellent for general tasks, but for academic research with specific sources, NotebookLM is the right tool. Review the video "First Steps with NotebookLM".',
  },
  {
    id: "m4q2",
    question:
      "You are an environmental science student and find 30 documents on climate change: 10 peer-reviewed academic papers, 5 verified news articles, 8 personal opinion blogs, 4 government datasets, and 3 science documentaries. Your NotebookLM notebook accepts up to 50 sources. What is the smartest curation strategy?",
    options: [
      {
        id: "m4q2_a",
        label:
          "Select the 10 papers + 4 datasets + 3 documentaries as priority sources, leaving out unverified opinion blogs",
      },
      {
        id: "m4q2_b",
        label:
          "Upload all 30 documents because there is space available in the notebook",
      },
      {
        id: "m4q2_c",
        label: "Upload only the 8 blogs because they use simpler language",
      },
      {
        id: "m4q2_d",
        label:
          "Upload only the 5 news articles because they have the most recent dates",
      },
    ],
    correctAnswer: "m4q2_a",
    topic: "NotebookLM",
    difficulty: "medium",
    feedback:
      'Curation is not about space — it is about selecting reliable and relevant sources. Academic papers and government datasets are verifiable; opinion blogs add noise and unfounded bias. Review the lesson "Select Sources Like an Expert" and the OVA "Simulator: Document Analysis".',
  },
  {
    id: "m4q3",
    question:
      "You are a medical student and have 3 PDFs on cardiac physiology to study for an exam. Tomorrow you have a 45-minute bus ride and want to use that time to review. What is the best strategy using NotebookLM?",
    options: [
      {
        id: "m4q3_a",
        label:
          "Upload the 3 PDFs to a notebook, generate an Audio Overview that analyzes them, and listen during the trip",
      },
      {
        id: "m4q3_b",
        label: "Read all 3 PDFs on the bus despite movement and poor lighting",
      },
      {
        id: "m4q3_c",
        label: "Ask ChatGPT for a general summary and read it on the bus",
      },
      {
        id: "m4q3_d",
        label: "Wait until you get home to read the PDFs calmly",
      },
    ],
    correctAnswer: "m4q3_a",
    topic: "Audio Overview",
    difficulty: "medium",
    feedback:
      'Audio Overview turns your documents into a conversational podcast with two AI voices analyzing the content. It is ideal for reviewing dense material when you cannot read, like during a trip. Review the video "Audio Overview: Your Content as a Podcast".',
  },
  {
    id: "m4q4",
    question:
      'NotebookLM responds: "Neuroplasticity occurs mainly in childhood (Source: neuroplasticity.pdf, page 5)." You click the citation and read in the PDF: "Neuroplasticity is most active during childhood, but continues throughout life." What do you conclude?',
    options: [
      {
        id: "m4q4_a",
        label:
          "The AI interpreted correctly but simplified the nuance — the original citation says something more precise, showing why you should always verify textual citations",
      },
      {
        id: "m4q4_b",
        label:
          "NotebookLM was completely wrong; the source says nothing similar",
      },
      {
        id: "m4q4_c",
        label:
          "The PDF is poorly written and should be removed from the notebook",
      },
      {
        id: "m4q4_d",
        label:
          "The AI response is correct because it cited the PDF properly, you do not need to read the original source",
      },
    ],
    correctAnswer: "m4q4_a",
    topic: "Precision",
    difficulty: "hard",
    feedback:
      'This is a classic case of why verifying citations is essential. The AI did not hallucinate — it interpreted correctly but lost an important nuance ("most active" vs "occurs mainly"). AI gives you speed; you give it precision. Review the infographic "Smart Summaries with NotebookLM".',
  },
  {
    id: "m4q5",
    question:
      "What is the best practice when organizing your sources in NotebookLM for research?",
    options: [
      {
        id: "m4q5_a",
        label: "Upload all 50 sources at once without organizing",
      },
      {
        id: "m4q5_b",
        label:
          "Select relevant and reliable sources, organize them by topics and categories for better results",
      },
      {
        id: "m4q5_c",
        label: "Upload only summaries, never the complete documents",
      },
      {
        id: "m4q5_d",
        label: "Mix academic sources with blogs without distinction",
      },
    ],
    correctAnswer: "m4q5_b",
    topic: "Curation",
    difficulty: "medium",
    feedback:
      'The quality of your sources determines the quality of responses. Review the topic "Select Sources Like an Expert".',
  },
  {
    id: "m4q6",
    question:
      "If you find two sources that contradict each other in NotebookLM, what should you do?",
    options: [
      { id: "m4q6_a", label: "Remove both sources and look for new ones" },
      {
        id: "m4q6_b",
        label:
          "Analyze both, identify the reasons for the contradiction, and document it as part of your research",
      },
      { id: "m4q6_c", label: "Keep only the most recent source" },
      { id: "m4q6_d", label: "Ignore the contradiction and move on" },
    ],
    correctAnswer: "m4q6_b",
    topic: "Critical Analysis",
    difficulty: "hard",
    feedback:
      "Contradictions are learning opportunities. Analyzing them strengthens your research. Review the document analysis simulator.",
  },
  {
    id: "m4q7",
    question:
      "According to the module's best practices, what should you ALWAYS do when NotebookLM gives you an answer with citations?",
    options: [
      {
        id: "m4q7_a",
        label:
          "Verify the citations by clicking them to confirm the information is correct and in context",
      },
      { id: "m4q7_b", label: "Copy and paste the response without reviewing" },
      {
        id: "m4q7_c",
        label: "Delete the original document since you no longer need it",
      },
      {
        id: "m4q7_d",
        label: "Translate the response to another language to verify quality",
      },
    ],
    correctAnswer: "m4q7_a",
    topic: "Verification",
    difficulty: "medium",
    feedback:
      "Always verify citations. AI is your assistant, but you are the final responsible party. Review the module OVA.",
  },
  {
    id: "m4q8",
    question:
      "A team of 4 students researches the same topic for an integrative project. Each has different documents and they want to use NotebookLM to work together. What is the most efficient collaborative workflow?",
    options: [
      {
        id: "m4q8_a",
        label:
          "Each student creates their notebook with their sources and shares the link with the team; everyone can consult and ask questions about each other's sources",
      },
      {
        id: "m4q8_b",
        label:
          "One student creates a notebook and the others ask them to make queries on their behalf",
      },
      {
        id: "m4q8_c",
        label:
          "Each student works separately and at the end they manually compare results",
      },
      {
        id: "m4q8_d",
        label:
          "All 4 students take turns using one computer with a single open notebook",
      },
    ],
    correctAnswer: "m4q8_a",
    topic: "Collaboration",
    difficulty: "medium",
    feedback:
      'NotebookLM allows sharing notebooks like Google Docs. Each member can have their thematic notebook and share it, giving the whole team access to consult sources and ask questions independently. Review the OVA "Lab: Create your Notebook".',
  },
  {
    id: "m4q9",
    question:
      'You have 10 sources in your notebook and want to extract only the main conclusions on a specific topic (e.g., "energy efficiency"). What is the most efficient way to do it?',
    options: [
      {
        id: "m4q9_a",
        label:
          'Ask NotebookLM a specific question like "According to my sources, what are the main conclusions about energy efficiency? Answers must cite sources textually"',
      },
      {
        id: "m4q9_b",
        label: "Read all 10 complete sources one by one and take manual notes",
      },
      {
        id: "m4q9_c",
        label: "Ask ChatGPT to do the analysis without uploading the sources",
      },
      {
        id: "m4q9_d",
        label:
          "Use the automatic Study Guide and copy everything without filtering",
      },
    ],
    correctAnswer: "m4q9_a",
    topic: "NotebookLM",
    difficulty: "medium",
    feedback:
      'The advantage of NotebookLM is that you can ask specific questions and get cited answers from your sources. You do not need to read everything — the AI finds the relevant sections for you. Review the video "First Steps with NotebookLM".',
  },
  {
    id: "m4q10",
    question:
      "What is the current limit of sources you can add to a single notebook in NotebookLM?",
    options: [
      {
        id: "m4q10_a",
        label:
          "Up to 50 sources per notebook, each source up to approximately 500,000 words",
      },
      {
        id: "m4q10_b",
        label: "Unlimited, you can upload as many sources as you want",
      },
      {
        id: "m4q10_c",
        label: "Maximum 10 sources per notebook, regardless of size",
      },
      { id: "m4q10_d", label: "Maximum 100 sources but each only 10 pages" },
    ],
    correctAnswer: "m4q10_a",
    topic: "NotebookLM Limits",
    difficulty: "medium",
    feedback:
      "Knowing the technical limits of tools is part of professional use. NotebookLM allows up to 50 sources with a considerable word limit. Review the module documentation and resources on NotebookLM.",
  },
  {
    id: "m4q11",
    question:
      "You generate an Audio Overview from your notebook and the AI hosts discuss your sources. What control do you have over the generated audio content?",
    options: [
      {
        id: "m4q11_a",
        label:
          "You can customize the topics to cover and regenerate if you do not like the result, but the format is conversational between two AI voices",
      },
      {
        id: "m4q11_b",
        label:
          "You have no control, the audio is generated automatically without options",
      },
      {
        id: "m4q11_c",
        label:
          "You can choose the exact voice, tone, and write the full script manually",
      },
      {
        id: "m4q11_d",
        label: "You can only decide whether to include background music or not",
      },
    ],
    correctAnswer: "m4q11_a",
    topic: "Audio Overview",
    difficulty: "easy",
    feedback:
      'Audio Overview generates an automatic conversational podcast. You can regenerate it if it does not fit your needs and guide it with notebook instructions. Review the video "Audio Overview: Your Content as a Podcast".',
  },
  {
    id: "m4q12",
    question:
      'A lawyer uploads 30 legal contracts to a notebook and asks: "Which contracts have confidentiality clauses expiring in less than 2 years?" NotebookLM responds citing 5 specific contracts with page numbers. What additional validation should the lawyer do?',
    options: [
      {
        id: "m4q12_a",
        label:
          "Click each citation to verify the AI interpretation matches the full clause text, not just the quoted fragment",
      },
      {
        id: "m4q12_b",
        label:
          "Trust the response because NotebookLM textually cites the sources",
      },
      {
        id: "m4q12_c",
        label: "Review only 1 of the 5 cited contracts to save time",
      },
      {
        id: "m4q12_d",
        label: "Ask ChatGPT to verify whether NotebookLM was right",
      },
    ],
    correctAnswer: "m4q12_a",
    topic: "Legal Validation",
    difficulty: "hard",
    feedback:
      "In legal contexts, human verification is mandatory. Although NotebookLM cites textually, the full clause context can change the interpretation. AI speeds up review, but the legal professional is the final responsible party. Review the source verification topic in the module.",
  },
];
