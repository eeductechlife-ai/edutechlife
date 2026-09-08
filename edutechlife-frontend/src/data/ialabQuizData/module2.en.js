export const MODULE_2_EN = [
  {
    id: "m2q1",
    question:
      "You have a sales CSV and want to find which products grow most. Which tool combination is the most useful?",
    options: [
      {
        id: "m2q1_a",
        label: "Code Interpreter for the CSV and Web Search for trends",
      },
      { id: "m2q1_b", label: "Canvas to paste data and DALL-E for the charts" },
      { id: "m2q1_c", label: "Only Web Search to read market articles" },
      { id: "m2q1_d", label: "DALL-E 3 to analyze the file automatically" },
    ],
    correctAnswer: "m2q1_a",
    topic: "ChatGPT Tools",
    difficulty: "medium",
    source: "OVA: ChatGPT Tools Lab",
    feedback:
      "Code Interpreter analyzes the CSV and Web Search brings market data. Practice in the tools lab.",
  },
  {
    id: "m2q2",
    question:
      "A law firm wants a GPT to draft contracts with templates and current case law. Which setup is right?",
    options: [
      {
        id: "m2q2_a",
        label: "Legal system prompt + knowledge base + function calling",
      },
      {
        id: "m2q2_b",
        label: "A system prompt that only says you are a legal assistant",
      },
      {
        id: "m2q2_c",
        label: "Enable Web Search and DALL-E to look for contracts",
      },
      { id: "m2q2_d", label: "A GPT without instructions, only data analysis" },
    ],
    correctAnswer: "m2q2_a",
    topic: "Custom GPTs",
    difficulty: "medium",
    source: "Guide: GPTs and Actions",
    feedback:
      "A useful GPT combines a specialized prompt, knowledge base and function calling.",
  },
  {
    id: "m2q3",
    question:
      'A GPT uses function calling to read orders. The user writes "Where is order #789 going, email ana@example.com?" What happens internally?',
    options: [
      {
        id: "m2q3_a",
        label: "It extracts #789 and the email, and runs the order function",
      },
      { id: "m2q3_b", label: "It asks the user to fill a separate form" },
      { id: "m2q3_c", label: "It searches for the order number on the web" },
      {
        id: "m2q3_d",
        label: "It sends the full message to the API without parsing",
      },
    ],
    correctAnswer: "m2q3_a",
    topic: "Function Calling",
    difficulty: "hard",
    source: "OVA: ChatGPT Tools Lab",
    feedback:
      "Function calling extracts parameters and runs the function. Review the topic in the module.",
  },
  {
    id: "m2q4",
    question: "What does function calling allow with the ChatGPT API?",
    options: [
      {
        id: "m2q4_a",
        label: "Connect ChatGPT with APIs, databases and external services",
      },
      { id: "m2q4_b", label: "Call the user technical support by phone" },
      { id: "m2q4_c", label: "Create faster math functions in the chat" },
      { id: "m2q4_d", label: "Automatically download all available plugins" },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "easy",
    source: "Guide: GPTs and Actions",
    feedback:
      "Function calling connects ChatGPT to the real world. Review the GPTs guide.",
  },
  {
    id: "m2q5",
    question:
      "A community manager receives many daily FAQs. How do they automate replies best with a GPT?",
    options: [
      {
        id: "m2q5_a",
        label: "GPT with brand tone, FAQs and an API connection",
      },
      {
        id: "m2q5_b",
        label: "Answer each comment by hand with standard ChatGPT",
      },
      { id: "m2q5_c", label: "Let Web Search find the answers on its own" },
      { id: "m2q5_d", label: "Generate images to reply to the comments" },
    ],
    correctAnswer: "m2q5_a",
    topic: "Automation",
    difficulty: "medium",
    source: "OVA: Build a GPT",
    feedback:
      "A GPT with instructions, knowledge base and API automates replies. Practice in the build a GPT lab.",
  },
  {
    id: "m2q6",
    question:
      "A complaints GPT sometimes gives wrong return-policy data. What is the best responsible practice?",
    options: [
      { id: "m2q6_a", label: "Human review and alerts when the AI is unsure" },
      { id: "m2q6_b", label: "Turn off the AI and answer everything by hand" },
      { id: "m2q6_c", label: "Ignore the errors because of the speed" },
      { id: "m2q6_d", label: "Only give generic answers with no data" },
    ],
    correctAnswer: "m2q6_a",
    topic: "Responsible Use",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "The AI speeds up and the person verifies. Review the responsible use practices.",
  },
  {
    id: "m2q7",
    question:
      "A sales team wants to share updated product knowledge. What strategy is best?",
    options: [
      { id: "m2q7_a", label: "A shared Project with a common knowledge base" },
      { id: "m2q7_b", label: "Each seller keeps their own instructions" },
      { id: "m2q7_c", label: "Use a public GPT that everyone downloads" },
      { id: "m2q7_d", label: "Share chat screenshots by email" },
    ],
    correctAnswer: "m2q7_a",
    topic: "ChatGPT Projects",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Projects group conversations with shared instructions and files. Review the ChatGPT guide.",
  },
  {
    id: "m2q8",
    question:
      "You want a GPT to consult a catalog that updates daily. What do you enable?",
    options: [
      { id: "m2q8_a", label: "Knowledge base and Actions (API) for live data" },
      { id: "m2q8_b", label: "Ask the user to paste the catalog each time" },
      { id: "m2q8_c", label: "Generate catalog images with DALL-E" },
      { id: "m2q8_d", label: "Live data cannot be consulted in a GPT" },
    ],
    correctAnswer: "m2q8_a",
    topic: "Custom GPTs",
    difficulty: "medium",
    source: "OVA: Build a GPT",
    feedback:
      "The knowledge base keeps static info and Actions bring changing data. Review the GPT lab.",
  },
  {
    id: "m2q9",
    question:
      "You will publish on the GPT Store a GPT you use in your company. What do you check first?",
    options: [
      { id: "m2q9_a", label: "Whether it stores sensitive company data" },
      { id: "m2q9_b", label: "Whether the name is catchy enough" },
      { id: "m2q9_c", label: "Whether it has features to justify its price" },
      { id: "m2q9_d", label: "Whether its logo looks professional" },
    ],
    correctAnswer: "m2q9_a",
    topic: "GPT Privacy",
    difficulty: "easy",
    source: "Guide: GPTs and Actions",
    feedback:
      "Before publishing, check that it does not contain confidential data. Review the privacy topic.",
  },
  {
    id: "m2q10",
    question:
      "You want ChatGPT to spot urgent complaints on social media and alert support. What combination do you use?",
    options: [
      {
        id: "m2q10_a",
        label: "A GPT with Actions (API) connected to a webhook",
      },
      { id: "m2q10_b", label: "Standard ChatGPT with Web Search enabled" },
      { id: "m2q10_c", label: "DALL-E to reply to comments with images" },
      {
        id: "m2q10_d",
        label: "Canvas to review and edit each comment by hand",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "Automation",
    difficulty: "hard",
    source: "OVA: Real-World Automation Flows",
    feedback:
      "A GPT with Actions and a webhook automates the alert. Review the automation OVA.",
  },
];
