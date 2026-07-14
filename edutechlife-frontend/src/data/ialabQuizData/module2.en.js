export const MODULE_2_EN = [
  {
    id: "m2q1",
    question:
      "You are a data analyst at an e-commerce startup. You receive a CSV with 10,000 sales records from the last quarter and need to identify which products are growing the most. You also need to compare results with current market trends. What is the best strategy combining ChatGPT tools?",
    options: [
      {
        id: "m2q1_a",
        label:
          "Use Code Interpreter to analyze the CSV and Web Browsing to research market trends",
      },
      {
        id: "m2q1_b",
        label: "Use Canvas to paste data manually and DALL-E to chart it",
      },
      {
        id: "m2q1_c",
        label: "Use only Web Browsing to find articles about market trends",
      },
      {
        id: "m2q1_d",
        label:
          "Use DALL-E 3 to automatically generate the analysis from the CSV",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "ChatGPT Tools",
    difficulty: "medium",
    feedback:
      'Code Interpreter runs Python on the CSV for calculations and charts, while Web Browsing gets current market data. Combining them gives a complete analysis. Review the OVA "Lab: ChatGPT Tools".',
  },
  {
    id: "m2q2",
    question:
      "Which ChatGPT tool should you use to analyze an Excel file with sales data and create charts?",
    options: [
      { id: "m2q2_a", label: "DALL-E 3" },
      { id: "m2q2_b", label: "Code Interpreter (Data Analysis)" },
      { id: "m2q2_c", label: "Canvas" },
      { id: "m2q2_d", label: "Web Browsing" },
    ],
    correctAnswer: "m2q2_b",
    topic: "Data Analysis",
    difficulty: "medium",
    feedback:
      'Code Interpreter runs Python to process files and create visualizations. Review the OVA "Lab: ChatGPT Tools".',
  },
  {
    id: "m2q3",
    question:
      "A law firm asks you to create a custom GPT to help lawyers draft contracts. It needs to access legal templates, verify updated case law, and generate clauses per case. What is the most appropriate configuration?",
    options: [
      {
        id: "m2q3_a",
        label:
          "System prompt with detailed legal instructions + knowledge base with templates + Function Calling to case law database",
      },
      {
        id: "m2q3_b",
        label:
          'Just a generic system prompt saying "you are a legal assistant"',
      },
      {
        id: "m2q3_c",
        label:
          "Enable Web Browsing and DALL-E 3 to find visual examples of contracts",
      },
      {
        id: "m2q3_d",
        label:
          "A GPT without custom instructions, just with data analysis enabled",
      },
    ],
    correctAnswer: "m2q3_a",
    topic: "Custom GPTs",
    difficulty: "medium",
    feedback:
      'An effective custom GPT combines: specialized system prompt, knowledge base with relevant documents, and Function Calling for external data. Review the video "Create Your First GPT in 18 Minutes" and the GPT visual guide.',
  },
  {
    id: "m2q4",
    question:
      'You have a customer service GPT connected to an orders API via Function Calling. The registered function automatically extracts data like order number and email from the conversation. When a user writes "Where is my order #789? My email is ana@example.com", what happens internally?',
    options: [
      {
        id: "m2q4_a",
        label:
          "ChatGPT identifies the relevant data (#789, ana@example.com) and automatically executes the function against the orders API",
      },
      {
        id: "m2q4_b",
        label:
          "The user must fill out a separate form with their data before receiving help",
      },
      {
        id: "m2q4_c",
        label: "ChatGPT searches the internet for the order number to track it",
      },
      {
        id: "m2q4_d",
        label:
          "Function Calling sends the full user message to the API without processing",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "hard",
    feedback:
      'Function Calling lets ChatGPT extract structured parameters from natural language and automatically execute functions. Review "Connect ChatGPT with the Real World" and Lesson 3 of the module.',
  },
  {
    id: "m2q5",
    question: "What does Function Calling with the OpenAI API allow you to do?",
    options: [
      { id: "m2q5_a", label: "Call technical support by phone" },
      {
        id: "m2q5_b",
        label:
          "Connect ChatGPT with external services like databases, weather APIs, or email systems",
      },
      { id: "m2q5_c", label: "Create faster mathematical functions" },
      { id: "m2q5_d", label: "Automatically download all available plugins" },
    ],
    correctAnswer: "m2q5_b",
    topic: "Function Calling",
    difficulty: "hard",
    feedback:
      'Function Calling connects ChatGPT with the real world. Review the resources for the topic "Connect ChatGPT with the Real World".',
  },
  {
    id: "m2q6",
    question:
      "You are preparing a thesis and need ChatGPT to remember your theoretical framework in every session. Which feature should you use?",
    options: [
      { id: "m2q6_a", label: "Web Browsing" },
      { id: "m2q6_b", label: "DALL-E 3" },
      { id: "m2q6_c", label: "Projects and Memory" },
      { id: "m2q6_d", label: "Code Interpreter" },
    ],
    correctAnswer: "m2q6_c",
    topic: "ChatGPT Projects",
    difficulty: "hard",
    feedback:
      "Projects group conversations under common instructions and Memory saves context. Review the ChatGPT guide.",
  },
  {
    id: "m2q7",
    question:
      "A community manager receives 200+ daily comments on social media. Many are frequently asked questions (hours, prices, availability). They want to automate responses with a custom GPT. What is the most effective workflow?",
    options: [
      {
        id: "m2q7_a",
        label:
          "Create a GPT with brand tone instructions, upload a knowledge base with FAQs, and connect it via API to the social media platform",
      },
      {
        id: "m2q7_b",
        label:
          "Ask standard ChatGPT to respond to each comment manually one by one",
      },
      {
        id: "m2q7_c",
        label: "Set up Web Browsing to find automatic answers on the internet",
      },
      {
        id: "m2q7_d",
        label:
          "Use DALL-E 3 to generate images that visually respond to comments",
      },
    ],
    correctAnswer: "m2q7_a",
    topic: "Automation",
    difficulty: "medium",
    feedback:
      'A custom GPT with instructions and knowledge base, connected via API, automates responses while maintaining consistency. Review the OVA "Lab: Build a GPT" and the module\'s automation topic.',
  },
  {
    id: "m2q8",
    question:
      "A company implements an automated GPT to respond to customer complaints on social media. The GPT is fast but occasionally gives incorrect information about return policies. What is the best practice for using AI responsibly in this case?",
    options: [
      {
        id: "m2q8_a",
        label:
          "Implement human supervision with automatic alerts when GPT has low confidence, and periodically audit responses",
      },
      {
        id: "m2q8_b",
        label:
          "Disable the GPT and have the entire team respond manually without AI help",
      },
      {
        id: "m2q8_c",
        label: "Ignore errors because response speed is what matters most",
      },
      {
        id: "m2q8_d",
        label:
          "Configure the GPT to always give generic responses without specific information",
      },
    ],
    correctAnswer: "m2q8_a",
    topic: "Responsible Use",
    difficulty: "medium",
    feedback:
      "AI should augment human capacity, not replace it without supervision. Best practice is a hybrid system: AI for speed + human supervision for accuracy. Review the module's best practices on responsible AI use.",
  },
  {
    id: "m2q9",
    question:
      "A team of 5 salespeople wants to use ChatGPT to keep their product knowledge base updated. Each salesperson has different conversations with different clients. What is the best strategy for everyone to share updated information?",
    options: [
      {
        id: "m2q9_a",
        label:
          "Create a shared Project with product instructions and update the centralized knowledge base",
      },
      {
        id: "m2q9_b",
        label:
          "Each salesperson maintains their own chat with whatever instructions they remember",
      },
      { id: "m2q9_c", label: "Use a public GPT that everyone can download" },
      { id: "m2q9_d", label: "Share screenshots of chats via email" },
    ],
    correctAnswer: "m2q9_a",
    topic: "ChatGPT Projects",
    difficulty: "medium",
    feedback:
      "Projects in ChatGPT allow grouping conversations under shared instructions and files. Review the Projects topic in the module resources.",
  },
  {
    id: "m2q10",
    question:
      "You are designing a customer service GPT. You want it to be able to query a daily-updated product catalog. What functionality should you enable?",
    options: [
      {
        id: "m2q10_a",
        label:
          "Upload the catalog as a knowledge base and use Actions (API) to query real-time updates",
      },
      {
        id: "m2q10_b",
        label: "Ask the user to copy and paste the catalog each time",
      },
      { id: "m2q10_c", label: "Use DALL-E to generate catalog images" },
      {
        id: "m2q10_d",
        label: "It is not possible to query updated data in a GPT",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "Custom GPTs",
    difficulty: "hard",
    feedback:
      'GPTs can have a static knowledge base + Actions (API calls) for dynamic data. This allows querying real-time updated information. Review "Connect ChatGPT with the Real World".',
  },
  {
    id: "m2q11",
    question:
      "A GPT you created for your startup is working great internally. Your partner suggests publishing it on the GPT Store so other startups can use it too. What privacy consideration should you evaluate FIRST?",
    options: [
      {
        id: "m2q11_a",
        label:
          "Whether the GPT contains sensitive company data in the knowledge base or system instructions",
      },
      { id: "m2q11_b", label: "Whether the GPT name is catchy enough" },
      {
        id: "m2q11_c",
        label: "Whether the GPT has enough features to justify its price",
      },
      { id: "m2q11_d", label: "Whether the GPT logo looks professional" },
    ],
    correctAnswer: "m2q11_a",
    topic: "GPT Privacy",
    difficulty: "medium",
    feedback:
      "Before publishing a GPT, verify it does not contain confidential data (trade secrets, customer data, internal strategies). What works internally is not always safe for public release. Review the GPT privacy topic.",
  },
  {
    id: "m2q12",
    question:
      "You want to create an automated flow where ChatGPT analyzes social media comments, identifies urgent complaints, and sends notifications to the support team. What combination of tools do you need?",
    options: [
      {
        id: "m2q12_a",
        label:
          "A custom GPT with Actions (API) connected to the social network + webhook to the team ticket system",
      },
      { id: "m2q12_b", label: "Standard ChatGPT with Web Browsing enabled" },
      {
        id: "m2q12_c",
        label: "DALL-E 3 to generate automatic visual responses",
      },
      { id: "m2q12_d", label: "Canvas to manually edit each comment" },
    ],
    correctAnswer: "m2q12_a",
    topic: "Automation",
    difficulty: "hard",
    feedback:
      "AI automation requires: a GPT prepared for the task + Actions (API) to connect to external services + a webhook or API to trigger actions. Review the automation and Function Calling topic in the module.",
  },
];
