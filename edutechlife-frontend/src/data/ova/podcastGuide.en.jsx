import React from 'react';
import {
  Brain, FileText, Play, Headphones, Star, AlertTriangle,
  BookOpen, Link as LinkIcon, Lightbulb
} from 'lucide-react';

export const MODULE_DATA = [
  {
    id: 1, title: "What is NotebookLM?", icon: <Brain className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Your Research Assistant", text: "NotebookLM is an experimental Google tool powered by artificial intelligence. Unlike a traditional chatbot that searches the entire web, NotebookLM becomes a personalized expert solely on the documents you provide." },
      { type: 'comparison', title: "NotebookLM vs ChatGPT", text: "Understanding the difference is crucial to use the right tool:", items: [
        { name: "Data Source", nb: "Your own uploaded documents.", gpt: "The entire internet." },
        { name: "Hallucinations (Errors)", nb: "Nearly none. Includes direct citations to your text.", gpt: "Possible. Can invent information." },
        { name: "Main Purpose", nb: "Synthesize and study your own material.", gpt: "Generate ideas, writing, and general queries." }
      ]},
      { type: 'activity', title: "Check your learning", text: "Imagine you have a 200-page PDF on Colombian History and need a detailed summary with exact page references. Which tool do you choose?", options: [
        { text: "ChatGPT, because it knows a lot about history.", correct: false, feedback: "Incorrect. ChatGPT could summarize general concepts, but won't give you exact citations from that specific PDF." },
        { text: "NotebookLM, because it will work exclusively with my PDF.", correct: true, feedback: "Excellent! NotebookLM will analyze your document and give you answers with direct citations to the original text." }
      ]}
    ]
  },
  {
    id: 2, title: "Tools and Sources", icon: <FileText className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Multiple Formats", text: "For NotebookLM to work, you must create a 'Notebook' and add 'Sources' to it. You can upload various file types to enrich your research." },
      { type: 'grid', title: "Accepted Source Types", items: [
        { title: "Local Files", desc: "PDFs, Text files (.txt) and Markdown.", icon: <FileText className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Google Drive", desc: "Google Docs and Google Slides directly from your cloud.", icon: <BookOpen className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Web Links", desc: "URLs of articles or public web pages.", icon: <LinkIcon className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Multimedia", desc: "Audio (mp3) and YouTube Videos.", icon: <Headphones className="w-8 h-8 text-[#2FA8C6]" /> }
      ]},
      { type: 'activity', title: "Check your learning", text: "What is the main advantage of uploading different types of sources (e.g., a PDF and a YouTube video) to the same notebook?", options: [
        { text: "The AI can cross-reference information and find connections between text and video.", correct: true, feedback: "Exactly! By mixing sources, NotebookLM synthesizes information from all of them, giving you a global view." },
        { text: "It makes the app interface look prettier.", correct: false, feedback: "Incorrect. The real advantage is cross-referencing information for better analysis." }
      ]}
    ]
  },
  {
    id: 3, title: "Step-by-Step Guide", icon: <Play className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Your First Notebook", text: "Creating your study space is very simple. You just need a Google account and follow these 3 fundamental steps." },
      { type: 'steps', title: "Workflow", items: [
        "1. Create: Click 'New Notebook' on the main page.",
        "2. Feed: Upload your PDFs, class notes, or web links in the sources section.",
        "3. Interact: Use the chat bar to ask questions, request summaries, or create study guides."
      ]},
      { type: 'activity', title: "Check your learning", text: "After uploading your sources, the AI gives you an answer, but you want to know where it got that information. What should you do?", options: [
        { text: "Search for the answer on Google manually.", correct: false, feedback: "Incorrect. NotebookLM already does that work for you." },
        { text: "Click on the 'Citation' numbers that appear at the end of the generated text.", correct: true, feedback: "Correct! Those numbers take you directly to the exact line in your original document." }
      ]}
    ]
  },
  {
    id: 4, title: "Audio Overview (Podcasts)", icon: <Headphones className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Your Notes in Audio", text: "One of NotebookLM's most innovative tools is the 'Audio Overview'. With a single click, the AI converts all your documents into a podcast-style conversation between two virtual hosts." },
      { type: 'text', title: "What is it for?", text: "It's ideal for auditory learners or for making use of downtime (like on public transport). The virtual hosts discuss topics from your documents, make jokes, and explain complex concepts with easy-to-understand analogies." },
      { type: 'activity', title: "Check your learning", text: "What would be the best time to use the Audio Overview feature?", options: [
        { text: "When I have to submit a written essay in 10 minutes.", correct: false, feedback: "Incorrect. For that, it would be better to ask the chat for a written outline." },
        { text: "When I'm on the bus going to university and want to review my readings.", correct: true, feedback: "Perfect! The podcast format is ideal for learning while on the move without looking at a screen." }
      ]}
    ]
  },
  {
    id: 5, title: "Academic Applications", icon: <Star className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Real Use Cases", text: "NotebookLM adapts to any field of study. Let's see how different students use it." },
      { type: 'grid', title: "Examples by Faculty", items: [
        { title: "Law", desc: "Upload dozens of court rulings to find cross-referenced case law.", icon: <BookOpen className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Medicine", desc: "Upload medical scientific papers to extract symptoms and treatments in a table.", icon: <Brain className="w-8 h-8 text-[#2FA8C6]" /> },
        { title: "Engineering", desc: "Upload extensive technical manuals to search for precise specifications.", icon: <Lightbulb className="w-8 h-8 text-[#2FA8C6]" /> }
      ]},
      { type: 'activity', title: "Check your learning", text: "You're a Humanities student and you need to read 3 different books about the French Revolution. How does NotebookLM help you?", options: [
        { text: "It reads the books for me and I don't have to do anything.", correct: false, feedback: "Incorrect. AI assists, but learning requires your critical analysis." },
        { text: "I can upload all 3 books and ask it to show me where the authors disagree.", correct: true, feedback: "Excellent! Comparative analysis of multiple sources is NotebookLM's superpower." }
      ]}
    ]
  },
  {
    id: 6, title: "Tips and Limitations", icon: <AlertTriangle className="w-5 h-5" />,
    content: [
      { type: 'text', title: "Best Practices", text: "Remember: AI is an assistant, not a replacement for your intellect. Always verify information by clicking on citations." },
      { type: 'text', title: "Current Limitations", text: "NotebookLM does not search the internet in real-time (it only uses what you upload). Additionally, it has a source limit per notebook (currently 50) and a word limit per document." },
      { type: 'activity', title: "Check your learning", text: "You're researching a breaking news story that happened this morning. Is NotebookLM your best option?", options: [
        { text: "No, because NotebookLM has no internet connection to search for recent news.", correct: true, feedback: "Correct! For real-time events, a traditional web browser or ChatGPT with web browsing is better." },
        { text: "Yes, it's always the best option for anything.", correct: false, feedback: "Incorrect. Know your tools' limitations to use them properly." }
      ]}
    ]
  }
];

export const FINAL_CHALLENGE = [
  { question: "A student has 20 PDFs, 3 YouTube videos, and personal notes to prepare their thesis. What strategy with NotebookLM would be most efficient and why?", options: [
    { text: "Create a different notebook for each file type to avoid confusing the AI.", correct: false },
    { text: "Upload everything to the same notebook so the AI cross-references information, finds patterns, and generates connections between PDFs and videos.", correct: true },
    { text: "Read the PDFs on their own and only upload the videos to the platform.", correct: false }
  ], feedback: "Grouping related sources enables complex and comprehensive analysis." },
  { question: "A classmate uses AI answers without verifying sources. How does NotebookLM help reduce that specific problem?", options: [
    { text: "NotebookLM automatically blocks incorrect answers.", correct: false },
    { text: "NotebookLM forces you to read the entire document before answering.", correct: false },
    { text: "NotebookLM includes hyperlinks (citations) in every answer that take you directly to the exact paragraph in the original document.", correct: true }
  ], feedback: "Verifiable citations are the key to academic trust in NotebookLM." },
  { question: "What would be the best way to use 'Audio Overview' for a student with long daily commute times?", options: [
    { text: "Generate a podcast with all their complex weekly readings to listen to and absorb concepts conversationally on the bus.", correct: true },
    { text: "Use it so the AI dictates the exact text of the book robotically while they sleep.", correct: false },
    { text: "Record their own voice reading and upload it for the AI to edit.", correct: false }
  ], feedback: "Audio Overview converts dense texts into enjoyable chats, ideal for transit times." },
  { question: "Why does mixing different types of sources (e.g. scientific articles + interview videos) improve analysis in NotebookLM?", options: [
    { text: "Because it makes the notebook look more professional and organized.", correct: false },
    { text: "Because it provides different perspectives on the same topic, allowing the AI to give richer, multidimensional answers.", correct: true },
    { text: "Because the platform requires uploading at least 3 different formats.", correct: false }
  ], feedback: "Source diversity enriches the context and quality of AI responses." },
  { question: "Analyze this scenario: A student must submit a report on the economic impact of this week's weather. Why would NotebookLM NOT be the main tool?", options: [
    { text: "Because NotebookLM is bad at analyzing economics and math topics.", correct: false },
    { text: "Because the interface doesn't support numbers or financial charts.", correct: false },
    { text: "Because NotebookLM relies on static uploaded documents and doesn't perform live web searches to get this week's weather data.", correct: true }
  ], feedback: "It's vital to know when to use closed-analysis AI vs AI connected to the web in real time." }
];
