export const tools = [
  {
    id: "browse",
    title: "Web search",
    icon: "Globe",
    iconColor: "text-blue-500",
    desc: "Connects ChatGPT to recent information and shows you the sources. Check: open at least one source and confirm the date before using a figure.",
    pros: [
      "Recent news and prices",
      "Current rules and data",
      "Sources you can open",
    ],
    cons: [
      "Not needed for basic concepts you already know",
      "An answer without sources is only a hypothesis",
    ],
    prompt:
      "Look up the current price of [product] in my city and give me the source links with the date.",
    audio:
      "Web search lets ChatGPT look up recent information. Always ask for the sources and open at least one before using a figure.",
    useCases: ["Compare prices", "Check current rules", "Confirm a news item"],
  },
  {
    id: "files",
    title: "File and data analysis",
    icon: "Code",
    iconColor: "text-emerald-500",
    desc: "Reads your PDFs, spreadsheets and tables to summarize, sort or chart them. Check: recompute one row by hand and ask for the page of each fact.",
    pros: [
      "Summarize long documents",
      "Sort and chart a table",
      "Answer questions about your file",
    ],
    cons: [
      "It can slip on very messy tables",
      "Do not upload other people's personal data",
    ],
    prompt:
      "Review this sales sheet, make me a table by month and a bar chart, and tell me how you calculated each total.",
    audio:
      "File analysis lets you upload a document or a table and ask for a summary or a chart. Recompute one row by hand to check the result.",
    useCases: [
      "Summarize a report",
      "Chart the month's sales",
      "Sort a contact list without sensitive data",
    ],
  },
  {
    id: "images",
    title: "Image creation",
    icon: "ImageIcon",
    iconColor: "text-purple-500",
    desc: "Turns a description into an illustration. Check: review the text inside the image and the rights; an image illustrates, it does not prove.",
    pros: [
      "Illustrate an idea",
      "Backgrounds and covers",
      "Quick visual ideas",
    ],
    cons: [
      "It struggles with long text inside the image",
      "It does not copy logos or brands exactly",
    ],
    prompt:
      "Create a simple illustration of the water cycle with clear stages and no text inside the image.",
    audio:
      "Image creation is for illustrating ideas. Review the details, the text and the rights before publishing.",
    useCases: ["Visual teaching material", "Covers", "Visualize a concept"],
  },
  {
    id: "canvas",
    title: "Canvas",
    icon: "Layout",
    iconColor: "text-orange-500",
    desc: "A panel next to the chat to edit a text with you. Check: read each change before accepting it.",
    pros: [
      "Edit just one paragraph",
      "Adjust tone and length",
      "Keep the rest of the document",
    ],
    cons: ["Most useful for long texts", "Changes must be reviewed one by one"],
    prompt:
      "Open Canvas and help me organize a text about my business; change only the second paragraph.",
    audio:
      "Canvas opens a panel next to the chat where you and ChatGPT work on the same document. Review each change before accepting it.",
    useCases: ["Rewrite a section", "Improve a long email", "Adapt a manual"],
  },
  {
    id: "voice",
    title: "Voice",
    icon: "Mic",
    iconColor: "text-indigo-500",
    desc: "Talk to ChatGPT out loud: it works for practicing, dictating and thinking aloud. Check: confirm the transcript before sending something important.",
    pros: [
      "Practice a language",
      "Dictate ideas while walking",
      "Quick brainstorming",
    ],
    cons: [
      "It can mishear names and figures",
      "It depends on your plan and device",
    ],
    prompt:
      "Let's chat in English about my workday and correct me when I make a mistake.",
    audio:
      "Voice lets you talk to ChatGPT. Always confirm the transcript before using something important.",
    useCases: [
      "Practice a language",
      "Dictate an idea",
      "Prepare a talk out loud",
    ],
  },
];

export const quizScenarios = [
  {
    question:
      "You are a teacher preparing a 20-page lab manual. You need to rewrite only the “Safety rules” section in a teen-friendly tone, without touching the rest. Which tool serves you best?",
    options: ["Web search", "Canvas", "Image creation", "Voice"],
    correct: 1,
    explanation:
      "Canvas lets you edit one section of a long document in a side panel without regenerating the whole text. Review each change before accepting it.",
  },
  {
    question:
      "You have a spreadsheet with a course's grades, messy. You want a table by subject and a chart. Which tool do you use?",
    options: [
      "Image creation",
      "Canvas",
      "Web search",
      "File and data analysis",
    ],
    correct: 3,
    explanation:
      "File analysis reads your sheet, sorts it and charts it. Check the result by recomputing one row by hand.",
  },
  {
    question:
      "A student mentions a price change that happened an hour ago and you want an analysis of the immediate causes. What do you turn on?",
    options: [
      "Canvas",
      "Voice",
      "Web search, and I open the sources",
      "Image creation",
    ],
    correct: 2,
    explanation:
      "For recent events you need web search. An answer without sources is only a hypothesis: open at least one before using it.",
  },
  {
    question:
      "You want a poster for the science fair with a long paragraph of rules and the exact sponsor logos, all inside the image. What will happen?",
    options: [
      "The poster will be perfect and ready to print.",
      "File analysis will block the request for privacy.",
      "The image will have errors in the long text and inexact logos.",
      "Canvas will open a manual graphic editor.",
    ],
    correct: 2,
    explanation:
      "Image creation illustrates well, but it fails with long text and exact logos. Put the text separately and review the image before publishing.",
  },
  {
    question:
      "You want to practice English by talking and dictate ideas for a project while walking. Which tool fits?",
    options: ["Voice", "Canvas", "File and data analysis", "Image creation"],
    correct: 0,
    explanation:
      "Voice is for talking and dictating. Confirm the transcript before using something important, especially names and figures.",
  },
  {
    question:
      "You have a survey in a spreadsheet and need a chart plus background on how these surveys are done. Which combination is best?",
    options: [
      "Only Canvas to edit the sheet.",
      "File analysis for the table and chart, and web search for the background, checking one row by hand and the sources.",
      "Image creation to draw the results.",
      "Only voice to dictate the data.",
    ],
    correct: 1,
    explanation:
      "Combining tools works if you check each step: recompute one row of the analysis and open the search sources.",
  },
  {
    question:
      "You have an 80-page PDF and need the main ideas with their location. How do you do it?",
    options: [
      "I paste the PDF and accept the summary because it sounds sure.",
      "I upload the file, ask for the summary with the page of each idea and open two pages to check them.",
      "I ask it to make up the pages.",
      "I summarize it with web search only.",
    ],
    correct: 1,
    explanation:
      "For long files ask for the page of each fact and open a few to check that they say what the summary claims.",
  },
];

export const learningObjectives = [
  "Identify ChatGPT's tools: search, files, images, Canvas and voice",
  "Pick the right tool for the task",
  "Recognize each tool's limits",
  "Check what each tool gives you before using it",
];

export const furtherReading = [
  {
    title: "OpenAI Help Center",
    url: "https://help.openai.com/",
    description:
      "Official documentation: features and availability for your account.",
  },
  {
    title: "ChatGPT for education",
    url: "https://openai.com/education/",
    description: "Official information on using ChatGPT in education.",
  },
];
