export const learningObjectives = [
  "Understand the concept of AI based on your own sources",
  "Learn to create and manage notebooks in Gemini Notebook",
  "Differentiate Gemini Notebook from traditional chatbots",
  "Apply research strategies with your own documents",
];

export const furtherReading = [
  {
    title: "Gemini Notebook Guide — Google",
    url: "https://notebooklm.google.com/",
    description: "Google's official Gemini Notebook platform.",
  },
  {
    title: "How to Use Gemini Notebook for Research",
    url: "https://blog.google/technology/ai/notebooklm/",
    description: "Official Google guide on using Gemini Notebook.",
  },
];

export const contentScreens = [
  {
    id: "intro",
    title: "What is Gemini Notebook and what is it for?",
    subtitle:
      "Guided exploration of Gemini Notebook: create your first notebook with your own documents",
    objective:
      "Understand the concept of AI based on your own sources and create your first notebook",
    maxText:
      "Gemini Notebook is a Google tool that revolutionizes personal knowledge management. Unlike traditional chatbots, it works exclusively with the documents you provide. This means its responses are grounded in your sources, which reduces the risk of hallucinations (it does not eliminate it). Your goal is to understand how it works and why it is different from generic chatbots.",
    achievements: [
      { text: "Understand the concept of AI based on your own sources" },
      { text: "Create your first notebook with documents" },
      { text: "Differentiate Gemini Notebook from generic chatbots" },
    ],
    warnings: [
      { text: "Uploading documents without curating or organizing them" },
      { text: "Expecting it to work without quality sources" },
      { text: "Not understanding it only responds based on your sources" },
    ],
    example: {
      weak: "Empty notebook: No sources uploaded, no context",
      strong:
        "Powerful notebook: 5 academic research PDFs + 3 industry articles = Expert assistant that responds with verbatim citations from your documents",
    },
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "features",
    title: "Source Curation and Document Synthesis",
    subtitle: "Quality over quantity in your research",
    objective:
      "Learn to select, organize, and synthesize documents to maximize your notebook value",
    maxText:
      "Source curation is the key to getting the most out of Gemini Notebook. It is not about uploading the largest number of documents, but about selecting the most relevant ones and organizing them strategically. You will learn to choose reliable sources, categorize them by topic, and generate cross-references that give you a comprehensive view of your research.",
    achievements: [
      { text: "Select relevant and reliable sources" },
      { text: "Organize documents by thematic categories" },
      { text: "Generate cross-references between multiple sources" },
    ],
    warnings: [
      { text: "Uploading documents without quality filtering" },
      { text: "Mixing contradictory sources without context" },
      { text: "Not updating sources regularly" },
    ],
    example: {
      weak: "Upload everything I find about AI without any criteria",
      strong:
        "10 papers selected by relevance, organized by topic (ethics, technical, applications), with context notes for each group",
    },
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "practices",
    title: "Audio Overviews and AI Document Management",
    subtitle: "Your knowledge in podcast format",
    objective:
      "Transform complex documents into audio conversations with two virtual hosts",
    maxText:
      "One of the most impressive Gemini Notebook features is Audio Overview. This tool turns your documents into AI-generated podcast conversations, with two virtual hosts discussing key findings. It is perfect for reviewing content on the go, but remember to complement it with written summaries and always review the generated content.",
    achievements: [
      { text: "Generate Audio Overviews from your documents" },
      { text: "Customize the podcast tone and focus" },
      { text: "Use audio for review and mobile learning" },
    ],
    warnings: [
      { text: "Expecting perfect audio with short documents" },
      { text: "Not reviewing generated content before sharing" },
      { text: "Using only audio without complementing with written summaries" },
    ],
    example: {
      weak: "Vague and generic conversation about the topic with no depth",
      strong:
        "15-minute podcast where two hosts discuss key findings from 5 papers on neuroplasticity, with practical examples and clear analogies",
    },
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
  },
];

export const questionsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "According to the guide, what is Gemini Notebook's main 'superpower'?",
    options: [
      "It searches the entire internet to give you longer answers.",
      "It works exclusively with the sources and documents you provide.",
      "It automatically translates documents into over 100 languages.",
      "It creates animated videos from your study texts.",
    ],
    correct: 1,
    explanation:
      "Correct! Gemini Notebook stands out because it only uses the information you upload. This ensures it doesn't make up data that isn't in your notes.",
    hint: "Read the options carefully; this assistant is designed to be completely faithful to your own documents, not the internet.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question:
      "What is the most important difference between using ChatGPT and Gemini Notebook for studying?",
    options: [
      "ChatGPT uses 'the whole internet' and Gemini Notebook uses 'only your uploaded sources'.",
      "They use the same information: only the name changes.",
      "Gemini Notebook uses the same general internet knowledge as ChatGPT.",
      "ChatGPT is for math and Gemini Notebook is for history.",
    ],
    correct: 0,
    explanation:
      "Exactly. While ChatGPT has general knowledge from across the web, Gemini Notebook focuses on being super precise and strict only with the documents you chose.",
    hint: "Think about the data source for each. One searches the whole world and the other only what you give it.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question:
      "What amazing feature does Gemini Notebook have to help you 'listen' to your documents?",
    options: [
      "A rap-style song with the most important keywords.",
      "A monotonous audiobook narrated by your own cloned voice.",
      "An alarm to wake you up by reciting the main text.",
      "An AI-generated 'Podcast' (Audio Overview) with two voices discussing your topic.",
    ],
    correct: 3,
    explanation:
      "Very good! The 'Audio Overview' tool creates a very realistic podcast simulation where two hosts discuss your notes, ideal for studying while listening.",
    hint: "It's a very popular audio format today where two hosts talk about a topic.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question:
      "Gemini Notebook usually answers from your documents. What does that mean for checking?",
    options: [
      "It doesn't let you upload documents about science fiction topics.",
      "It automatically blocks websites with viruses or misleading ads.",
      "It can still be wrong, so open the citation and check the original passage.",
      "It corrects your spelling and grammar without you noticing.",
    ],
    correct: 2,
    explanation:
      "Correct. Lowering the risk does not remove it: the citation lets you check every claim.",
    hint: "In the AI world, 'hallucinating' means making up things that aren't real.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question:
      "If you're doing a group project for school or university, can you use Gemini Notebook with your classmates?",
    options: [
      "No, it's strictly for individual use.",
      "Yes, you can share your 'Notebooks' with your team just like a Google Doc.",
      "Only if everyone is connected to the same Wi-Fi network in the same room.",
      "Yes, but the AI will only answer questions for the group creator.",
    ],
    correct: 1,
    explanation:
      "That's right! You can collaborate as a team. Everyone can read the same notebook, ask questions from the same sources, and listen to the same generated podcast.",
    hint: "Since it's a Google tool, its sharing feature works much like how you share files in Google Drive.",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question:
      "According to the guide's 'Best Practices', what should you ALWAYS do when Gemini Notebook gives you an answer?",
    options: [
      "Always verify the citation or the exact part where it got the information.",
      "Delete the original document from your computer since you no longer need it.",
      "Ask it to translate it into another language to ensure good quality.",
      "Copy and paste the answer directly into your assignment without reading it.",
    ],
    correct: 0,
    explanation:
      "Excellent. Gemini Notebook is a great assistant, but you are the student. You should always verify by clicking the citations to see which part of the original text the idea came from.",
    hint: "Remember you are the student and the machine is the assistant. Make sure to review the sources.",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question:
      "According to the manual, how many different documents or sources can you upload to a single notebook in Gemini Notebook?",
    options: [
      "Only 1 very long source at a time.",
      "Up to 5 small sources.",
      "It depends on your account: check the current limit and upload few sources on the same topic.",
      "Upload all your sources without choosing, whatever the topic.",
    ],
    correct: 2,
    explanation:
      "Correct. Few sources, on the same topic, with author and date work best. The source limit depends on your account: check it there.",
    hint: "Check the source limit in your account before uploading.",
  },
];
