export const contentScreens = [
  {
    id: 'intro',
    title: 'What is NotebookLM and what is it for?',
    subtitle: 'Understanding what NotebookLM is, how it works, and why it is revolutionary',
    objective: 'Understand the concept of AI based on your own sources and create your first notebook',
    valerioText: 'NotebookLM is a Google tool that revolutionizes personal knowledge management. Unlike traditional chatbots, it works exclusively with the documents you provide. This means its responses are 100% grounded in your sources, eliminating the risk of hallucinations. Your goal is to understand how it works and why it is different from generic chatbots.',
    achievements: [
      { text: 'Understand the concept of AI based on your own sources' },
      { text: 'Create your first notebook with documents' },
      { text: 'Differentiate NotebookLM from generic chatbots' },
    ],
    warnings: [
      { text: 'Uploading documents without curating or organizing them' },
      { text: 'Expecting it to work without quality sources' },
      { text: 'Not understanding it only responds based on your sources' },
    ],
    example: { weak: 'Empty notebook: No sources uploaded, no context', strong: 'Powerful notebook: 5 academic research PDFs + 3 industry articles = Expert assistant that responds with verbatim citations from your documents' },
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'features',
    title: 'Source Curation and Document Synthesis',
    subtitle: 'Quality over quantity in your research',
    objective: 'Learn to select, organize, and synthesize documents to maximize your notebook value',
    valerioText: 'Source curation is the key to getting the most out of NotebookLM. It is not about uploading the largest number of documents, but about selecting the most relevant ones and organizing them strategically. You will learn to choose reliable sources, categorize them by topic, and generate cross-references that give you a comprehensive view of your research.',
    achievements: [
      { text: 'Select relevant and reliable sources' },
      { text: 'Organize documents by thematic categories' },
      { text: 'Generate cross-references between multiple sources' },
    ],
    warnings: [
      { text: 'Uploading 50 documents without quality filtering' },
      { text: 'Mixing contradictory sources without context' },
      { text: 'Not updating sources regularly' },
    ],
    example: { weak: 'Upload everything I find about AI without any criteria', strong: '10 papers selected by relevance, organized by topic (ethics, technical, applications), with context notes for each group' },
    image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'practices',
    title: 'Audio Overviews and AI Document Management',
    subtitle: 'Your knowledge in podcast format',
    objective: 'Transform complex documents into audio conversations with two virtual hosts',
    valerioText: 'One of the most impressive NotebookLM features is Audio Overview. This tool turns your documents into AI-generated podcast conversations, with two virtual hosts discussing key findings. It is perfect for reviewing content on the go, but remember to complement it with written summaries and always review the generated content.',
    achievements: [
      { text: 'Generate Audio Overviews from your documents' },
      { text: 'Customize the podcast tone and focus' },
      { text: 'Use audio for review and mobile learning' },
    ],
    warnings: [
      { text: 'Expecting perfect audio with short documents' },
      { text: 'Not reviewing generated content before sharing' },
      { text: 'Using only audio without complementing with written summaries' },
    ],
    example: { weak: 'Vague and generic conversation about the topic with no depth', strong: '15-minute podcast where two hosts discuss key findings from 5 papers on neuroplasticity, with practical examples and clear analogies' },
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
  },
];

export const questionsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question: "According to the guide, what is NotebookLM's main 'superpower'?",
    options: [
      "It searches the entire internet to give you longer answers.",
      "It works exclusively with the sources and documents you provide.",
      "It automatically translates documents into over 100 languages.",
      "It creates animated videos from your study texts."
    ],
    correct: 1,
    explanation: "Correct! NotebookLM stands out because it only uses the information you upload. This ensures it doesn't make up data that isn't in your notes.",
    hint: "Read the options carefully; this assistant is designed to be completely faithful to your own documents, not the internet."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question: "What is the most important difference between using ChatGPT and NotebookLM for studying?",
    options: [
      "ChatGPT uses 'the whole internet' and NotebookLM uses 'only your uploaded sources'.",
      "ChatGPT is free and NotebookLM is always paid.",
      "NotebookLM only works on phones and ChatGPT on computers.",
      "ChatGPT is for math and NotebookLM is for history."
    ],
    correct: 0,
    explanation: "Exactly. While ChatGPT has general knowledge from across the web, NotebookLM focuses on being super precise and strict only with the documents you chose.",
    hint: "Think about the data source for each. One searches the whole world and the other only what you give it."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question: "What amazing feature does NotebookLM have to help you 'listen' to your documents?",
    options: [
      "A rap-style song with the most important keywords.",
      "A monotonous audiobook narrated by your own cloned voice.",
      "An alarm to wake you up by reciting the main text.",
      "An AI-generated 'Podcast' (Audio Overview) with two voices discussing your topic."
    ],
    correct: 3,
    explanation: "Very good! The 'Audio Overview' tool creates a very realistic podcast simulation where two hosts discuss your notes, ideal for studying while listening.",
    hint: "It's a very popular audio format today where two hosts talk about a topic."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question: "NotebookLM is said to be 'hallucination-free'. What does this mean?",
    options: [
      "It doesn't let you upload documents about science fiction topics.",
      "It automatically blocks websites with viruses or misleading ads.",
      "The AI doesn't make up data; its responses are 100% based on evidence from your texts.",
      "It corrects your spelling and grammar without you noticing."
    ],
    correct: 2,
    explanation: "Correct. Since the AI is restricted only to your PDFs or documents, the risk of it making up false information (hallucination) is almost completely eliminated.",
    hint: "In the AI world, 'hallucinating' means making up things that aren't real."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question: "If you're doing a group project for school or university, can you use NotebookLM with your classmates?",
    options: [
      "No, it's strictly for individual use.",
      "Yes, you can share your 'Notebooks' with your team just like a Google Doc.",
      "Only if everyone is connected to the same Wi-Fi network in the same room.",
      "Yes, but the AI will only answer questions for the group creator."
    ],
    correct: 1,
    explanation: "That's right! You can collaborate as a team. Everyone can read the same notebook, ask questions from the same sources, and listen to the same generated podcast.",
    hint: "Since it's a Google tool, its sharing feature works much like how you share files in Google Drive."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question: "According to the guide's 'Best Practices', what should you ALWAYS do when NotebookLM gives you an answer?",
    options: [
      "Always verify the citation or the exact part where it got the information.",
      "Delete the original document from your computer since you no longer need it.",
      "Ask it to translate it into another language to ensure good quality.",
      "Copy and paste the answer directly into your assignment without reading it."
    ],
    correct: 0,
    explanation: "Excellent. NotebookLM is a great assistant, but you are the student. You should always verify by clicking the citations to see which part of the original text the idea came from.",
    hint: "Remember you are the student and the machine is the assistant. Make sure to review the sources."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question: "According to the manual, how many different documents or sources can you upload to a single notebook in NotebookLM?",
    options: [
      "Only 1 very long source at a time.",
      "Up to 5 small sources.",
      "Unlimited sources (everything you have on your computer).",
      "Up to 50 sources in various formats."
    ],
    correct: 3,
    explanation: "Correct. You can feed your notebook with up to 50 different sources (like PDFs, documents, links, etc.) so the AI can cross-reference information between all of them.",
    hint: "It's not infinite, but it's a large enough number to build a complete thesis (half a hundred)."
  }
];
