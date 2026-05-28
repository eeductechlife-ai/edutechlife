export const contentScreens = [
  {
    id: 'sourcing',
    title: 'Source Selection and Curation',
    subtitle: 'Quality over quantity in your research',
    objective: 'Learn to select, organize, and evaluate sources for your notebook',
    valerioText: 'The foundation of good document analysis begins with source selection. It is not about accumulating documents, but about choosing the most relevant and reliable ones. A well-curated source makes the difference between superficial and deep analysis. Learn to identify primary sources, evaluate their credibility, and organize them thematically to maximize your research value.',
    achievements: [
      { text: 'Identify relevant primary and secondary sources' },
      { text: 'Evaluate the credibility and timeliness of each source' },
      { text: 'Organize documents by thematic categories' },
    ],
    warnings: [
      { text: 'Accumulating sources without selection criteria' },
      { text: 'Trusting sources without verifying their origin' },
      { text: 'Mixing information of uneven quality without context' },
    ],
    example: { weak: 'Download 30 PDFs about AI without reading titles or authors', strong: 'Select 8 peer-reviewed papers, organized by topic: 3 on ethics, 3 technical, 2 on practical applications' },
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'synthesis',
    title: 'Cross-Synthesis Between Sources',
    subtitle: 'Connecting ideas across multiple documents',
    objective: 'Generate syntheses that integrate information from diverse sources',
    valerioText: 'The true power of document analysis lies in the ability to connect ideas across different sources. Cross-synthesis allows you to identify patterns, contradictions, and complements between documents that, viewed separately, would not be evident. NotebookLM facilitates this process by letting you ask questions that span all your sources simultaneously.',
    achievements: [
      { text: 'Identify common points between different authors' },
      { text: 'Detect contradictions and academic debates' },
      { text: 'Build a comprehensive view of the researched topic' },
    ],
    warnings: [
      { text: 'Citing sources without having read them fully' },
      { text: 'Ignoring findings that contradict your hypothesis' },
      { text: 'Synthesizing without maintaining the original context' },
    ],
    example: { weak: 'Summarizing each paper separately without relating them to each other', strong: 'Create a comparative matrix showing coincidences and divergences between 5 authors on the same topic, with supporting verbatim citations' },
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'analysis',
    title: 'Critical Content Analysis',
    subtitle: 'Evaluate and question the information',
    objective: 'Develop critical thinking when analyzing documents',
    valerioText: 'Critical analysis is the most important skill you can develop. It is not just about understanding what a document says, but about questioning it, evaluating its arguments, and determining its validity. Always ask yourself: Who wrote this? For what purpose? What evidence supports their claims? What biases might they have?',
    achievements: [
      { text: 'Evaluate the strength of the presented arguments' },
      { text: 'Identify biases and limitations in sources' },
      { text: 'Formulate critical questions about the content' },
    ],
    warnings: [
      { text: 'Accepting information without questioning its validity' },
      { text: 'Confusing correlation with causation' },
      { text: 'Generalizing conclusions from small samples' },
    ],
    example: { weak: 'Accepting as absolute truth a study with a 20-person sample', strong: 'Critically analyze: identify sample size, methodology, potential biases, and limitations before drawing conclusions' },
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000',
  },
];

export const questionsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question: "What is the first recommended step before uploading documents to NotebookLM for analysis?",
    options: [
      "Upload all available documents without reviewing them.",
      "Select and curate sources based on their relevance and quality.",
      "Translate all documents to the same language.",
      "Compress the files to take up less space."
    ],
    correct: 1,
    explanation: "Correct. Source curation is essential. You should select relevant, reliable, and up-to-date documents before uploading them to your notebook.",
    hint: "Think about quality versus quantity. It's not about accumulating, but about selecting."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question: "What does 'cross-synthesis' between sources mean?",
    options: [
      "Reading documents in alphabetical order.",
      "Comparing and contrasting information from multiple documents to find patterns and differences.",
      "Copying all conclusions verbatim into a single file.",
      "Translating each source into several languages to compare."
    ],
    correct: 1,
    explanation: "Exactly. Cross-synthesis lets you connect ideas across different documents, identifying where authors agree and where there are divergences.",
    hint: "It's not about summarizing each source separately, but finding connections between them."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question: "What should you do if you find two sources that contradict each other in your research?",
    options: [
      "Ignore both sources and look for others.",
      "Delete the older source and keep the new one.",
      "Analyze both, identify the reasons for the contradiction, and document it in your analysis.",
      "Choose the source that confirms your initial hypothesis."
    ],
    correct: 2,
    explanation: "Excellent! Contradictions are learning opportunities. You should analyze why they disagree, considering methodologies, contexts, and dates.",
    hint: "Academic controversies are common; facing them critically strengthens your research."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question: "What is the best practice when organizing sources in NotebookLM?",
    options: [
      "Upload all 50 allowed sources into a single notebook without sorting.",
      "Create separate notebooks by topics or categories with related sources.",
      "Upload only the summary of each document, not the full document.",
      "Mix academic sources with blogs indiscriminately."
    ],
    correct: 1,
    explanation: "Correct. Organizing your sources by topics or categories allows you to ask more precise questions and get more relevant answers from the AI.",
    hint: "Thematic organization helps you maintain context and ask more specific questions."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question: "Why is it important to verify the citations provided by NotebookLM?",
    options: [
      "Because AI can sometimes hallucinate or incorrectly interpret context.",
      "Because citations are always wrong.",
      "Because NotebookLM only works if you manually verify each citation.",
      "Because citations are decorative and don't need verification."
    ],
    correct: 0,
    explanation: "Very good! Although NotebookLM is very precise with citations, you should always verify that the citation matches the correct context within the original document.",
    hint: "AI is a powerful tool, but human verification is still essential."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question: "What strategy is most effective when asking NotebookLM questions about multiple sources?",
    options: [
      "Asking very general questions like 'what are these documents about?'",
      "Formulating specific questions that require comparing information across sources.",
      "Asking the AI to guess information not in the documents.",
      "Asking all questions at once in a single long paragraph."
    ],
    correct: 1,
    explanation: "Correct. Specific questions that require comparison across sources make the most of NotebookLM's ability to perform cross-synthesis.",
    hint: "The more specific your question, the more useful the AI's answer will be."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question: "What is the main benefit of using NotebookLM for document analysis?",
    options: [
      "It completely replaces reading the original documents.",
      "It allows processing and consulting multiple sources simultaneously with grounded responses.",
      "It automatically writes your thesis without needing research.",
      "It translates all documents to any language in seconds."
    ],
    correct: 1,
    explanation: "Exactly! NotebookLM is an assistant that amplifies your analysis capabilities, allowing you to work with multiple sources at once, but it still requires your supervision and critical thinking.",
    hint: "AI is an augmentation tool, not a replacement for human critical thinking."
  }
];
