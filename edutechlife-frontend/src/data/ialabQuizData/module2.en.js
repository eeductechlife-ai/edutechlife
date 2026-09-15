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
  {
    id: "m2q11",
    question: "What is ChatGPT, in essence?",
    options: [
      {
        id: "m2q11_a",
        label: "A conversational language model that responds to your instructions",
      },
      { id: "m2q11_b", label: "A spreadsheet software with artificial intelligence features" },
      { id: "m2q11_c", label: "A search engine that always returns links from the internet" },
      { id: "m2q11_d", label: "A program for designing images without writing anything at all" },
    ],
    correctAnswer: "m2q11_a",
    topic: "ChatGPT Basics",
    difficulty: "easy",
    source: "Video: ChatGPT from Scratch in 6 Minutes",
    feedback:
      "ChatGPT is a conversational model: you give instructions and it generates text. Watch the video.",
  },
  {
    id: "m2q12",
    question:
      "By default, what should you remember about the information ChatGPT gives?",
    options: [
      {
        id: "m2q12_a",
        label: "It may be outdated, so verify any critical data before you rely on it",
      },
      { id: "m2q12_b", label: "It always knows every news story of the day in real time" },
      { id: "m2q12_c", label: "It never makes mistakes with exact dates or exact figures" },
      { id: "m2q12_d", label: "It only answers with verified links to official public portals" },
    ],
    correctAnswer: "m2q12_a",
    topic: "Models and Capabilities",
    difficulty: "easy",
    source: "Complete ChatGPT Guide",
    feedback:
      "Without search tools, its knowledge has a cutoff date: verify what matters.",
  },
  {
    id: "m2q13",
    question: "For which task is it most appropriate to turn on Web Search?",
    options: [
      {
        id: "m2q13_a",
        label: "To check today's news, prices or recent market data that changes fast",
      },
      { id: "m2q13_b", label: "To generate a decorative image from a short written description" },
      { id: "m2q13_c", label: "To run calculations on a local sales file stored on your laptop" },
      { id: "m2q13_d", label: "To create a custom GPT with its own personal set of actions" },
    ],
    correctAnswer: "m2q13_a",
    topic: "Web Search",
    difficulty: "medium",
    source: "OVA: Explore the ChatGPT Ecosystem",
    feedback:
      "Web Search brings updated information from the internet. Explore the ecosystem OVA.",
  },
  {
    id: "m2q14",
    question: "You have a CSV and need to compute averages and trends. What do you use?",
    options: [
      {
        id: "m2q14_a",
        label: "Code Interpreter, which runs the analysis directly on the file",
      },
      { id: "m2q14_b", label: "Web Search to read articles about the industry sector" },
      { id: "m2q14_c", label: "DALL-E 3 to turn the CSV into a nice bar chart image" },
      { id: "m2q14_d", label: "Canvas to rewrite every row of the file by hand carefully" },
    ],
    correctAnswer: "m2q14_a",
    topic: "Code Interpreter",
    difficulty: "medium",
    source: "OVA: ChatGPT Tools Lab",
    feedback:
      "Code Interpreter runs the calculation on the file. Practice in the ChatGPT tools lab.",
  },
  {
    id: "m2q15",
    question: "You need an illustrative image for a post. Which tool do you use?",
    options: [
      {
        id: "m2q15_a",
        label: "DALL-E 3, describing the scene you want to generate in detail",
      },
      { id: "m2q15_b", label: "Code Interpreter, writing a brand-new formula in the chat" },
      { id: "m2q15_c", label: "Web Search, to copy any image you find on the portal" },
      { id: "m2q15_d", label: "A Project, grouping together the files of the team area" },
    ],
    correctAnswer: "m2q15_a",
    topic: "DALL-E",
    difficulty: "medium",
    source: "OVA: ChatGPT Tools Lab",
    feedback:
      "DALL-E 3 generates images from a detailed description. Review the tools lab.",
  },
  {
    id: "m2q16",
    question:
      "You want to edit a long text and highlight changes without losing the original. What do you use?",
    options: [
      {
        id: "m2q16_a",
        label: "Canvas, which lets you edit and rewrite on a working document",
      },
      { id: "m2q16_b", label: "DALL-E 3, to turn the text into a complete detailed image" },
      { id: "m2q16_c", label: "Web Search, to find the same text already published online" },
      { id: "m2q16_d", label: "Code Interpreter, to delete the original paragraph entirely" },
    ],
    correctAnswer: "m2q16_a",
    topic: "Canvas",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Canvas is the workspace to write and edit text and code with change tracking.",
  },
  {
    id: "m2q17",
    question: "What is a Project in ChatGPT for?",
    options: [
      {
        id: "m2q17_a",
        label: "To group conversations, files and instructions for a piece of work",
      },
      { id: "m2q17_b", label: "To publish a GPT in the platform's official public store" },
      { id: "m2q17_c", label: "To generate images with a consistent brand visual style" },
      { id: "m2q17_d", label: "To connect to the internet with Web Search turned on" },
    ],
    correctAnswer: "m2q17_a",
    topic: "ChatGPT Projects",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Projects gather context and files so you can work on something continuously.",
  },
  {
    id: "m2q18",
    question: "You want ChatGPT to analyze a PDF you have on your computer. What do you do?",
    options: [
      {
        id: "m2q18_a",
        label: "You upload the file into the conversation and ask it to work on it",
      },
      { id: "m2q18_b", label: "You transcribe the whole PDF by hand inside your message" },
      { id: "m2q18_c", label: "You ask it to search for the file online and summarize it alone" },
      { id: "m2q18_d", label: "You ask it to draw the PDF with the image tool DALL-E" },
    ],
    correctAnswer: "m2q18_a",
    topic: "Files",
    difficulty: "easy",
    source: "Video: ChatGPT from Scratch in 6 Minutes",
    feedback:
      "You can attach files and work on them. Review the ChatGPT intro video.",
  },
  {
    id: "m2q19",
    question:
      "Code Interpreter gives you a sales chart. What is the most responsible step?",
    options: [
      {
        id: "m2q19_a",
        label: "Check that the data and the calculation match your real file",
      },
      { id: "m2q19_b", label: "Publish the chart without review because the code made it" },
      { id: "m2q19_c", label: "Assume that any output from code is always correct" },
      { id: "m2q19_d", label: "Change the axes until the chart simply looks better" },
    ],
    correctAnswer: "m2q19_a",
    topic: "Data Analysis",
    difficulty: "hard",
    source: "OVA: ChatGPT Tools Lab",
    feedback:
      "Verify inputs, assumptions and results before deciding with them. Review the tools lab.",
  },
  {
    id: "m2q20",
    question:
      "You must compare your CSV with current industry trends. Which combination is best?",
    options: [
      {
        id: "m2q20_a",
        label: "Code Interpreter for the CSV and Web Search for the current trends",
      },
      { id: "m2q20_b", label: "DALL-E 3 to plot the chart and Canvas to browse the internet" },
      { id: "m2q20_c", label: "An empty Project, with no files and no concrete instructions" },
      { id: "m2q20_d", label: "Only Web Search, ignoring your own local data completely" },
    ],
    correctAnswer: "m2q20_a",
    topic: "ChatGPT Tools",
    difficulty: "medium",
    source: "OVA: Real-World Automation Flows",
    feedback:
      "Combine tools: local data with Code Interpreter and current context with Web Search.",
  },
  {
    id: "m2q21",
    question: "What is a custom GPT?",
    options: [
      {
        id: "m2q21_a",
        label: "A version of ChatGPT with its own instructions, knowledge and actions",
      },
      { id: "m2q21_b", label: "A brand-new model trained completely from scratch by each student" },
      { id: "m2q21_c", label: "A search engine that only answers questions about one narrow topic" },
      { id: "m2q21_d", label: "A PDF file that loads itself and answers questions on its own" },
    ],
    correctAnswer: "m2q21_a",
    topic: "Custom GPTs",
    difficulty: "easy",
    source: "Guide: GPTs and Actions",
    feedback:
      "A custom GPT defines its role, its knowledge and its capabilities. Review the GPTs guide.",
  },
  {
    id: "m2q22",
    question: "Where are the role and the rules of a custom GPT defined?",
    options: [
      {
        id: "m2q22_a",
        label: "In its instructions (system prompt), which guide its behavior",
      },
      { id: "m2q22_b", label: "In the color and the logo chosen for the official store" },
      { id: "m2q22_c", label: "In the number of conversations that each user accumulates" },
      { id: "m2q22_d", label: "In the price that is assigned to it inside the store" },
    ],
    correctAnswer: "m2q22_a",
    topic: "GPT Instructions",
    difficulty: "medium",
    source: "Guide: GPTs and Actions",
    feedback:
      "The instructions (role, tone and rules) define how the GPT responds. Review the guide.",
  },
  {
    id: "m2q23",
    question: "A GPT must answer with the company's internal policies. What do you set up?",
    options: [
      {
        id: "m2q23_a",
        label: "A knowledge base with those internal documents and rules",
      },
      { id: "m2q23_b", label: "Only a friendly tone, with no source of information at all" },
      { id: "m2q23_c", label: "DALL-E 3 enabled to illustrate each possible answer" },
      { id: "m2q23_d", label: "Web Search, even though the policies are not published online" },
    ],
    correctAnswer: "m2q23_a",
    topic: "Knowledge Base",
    difficulty: "medium",
    source: "OVA: Build a GPT",
    feedback:
      "The knowledge base is where the GPT's own information lives. Practice in the GPT lab.",
  },
  {
    id: "m2q24",
    question: "A GPT must consult a catalog that changes every day. What do you use?",
    options: [
      {
        id: "m2q24_a",
        label: "Actions (API) to bring live data from the external system",
      },
      { id: "m2q24_b", label: "A knowledge base, even though it becomes outdated quickly" },
      { id: "m2q24_c", label: "New instructions, writing the whole catalog by hand in the role" },
      { id: "m2q24_d", label: "DALL-E 3, to generate images of every product in the catalog" },
    ],
    correctAnswer: "m2q24_a",
    topic: "Actions / APIs",
    difficulty: "hard",
    source: "Guide: GPTs and Actions",
    feedback:
      "For data that changes, Actions (API) bring live information. Review the GPTs guide.",
  },
  {
    id: "m2q25",
    question: "What does Function Calling do when the user asks for something concrete?",
    options: [
      {
        id: "m2q25_a",
        label: "It extracts the needed parameters and runs the defined function",
      },
      { id: "m2q25_b", label: "It generates an image that explains the user's request" },
      { id: "m2q25_c", label: "It asks the user to rewrite their message more slowly" },
      { id: "m2q25_d", label: "It always answers with generic text without using any data" },
    ],
    correctAnswer: "m2q25_a",
    topic: "Function Calling",
    difficulty: "hard",
    source: "Guide: GPTs and Actions",
    feedback:
      "The model detects the intent, extracts parameters and calls the function. Review the guide.",
  },
  {
    id: "m2q26",
    question: "You share your GPT with other people in the GPT Store. What does it involve?",
    options: [
      {
        id: "m2q26_a",
        label: "Defining who can use it and whether it stores sensitive information",
      },
      { id: "m2q26_b", label: "Losing access to all of your previous chat conversations" },
      { id: "m2q26_c", label: "The GPT no longer accepting files in its future answers" },
      { id: "m2q26_d", label: "The Actions you created being deleted automatically" },
    ],
    correctAnswer: "m2q26_a",
    topic: "GPT Store",
    difficulty: "medium",
    source: "Guide: GPTs and Actions",
    feedback:
      "Before sharing, decide the scope and protect sensitive data. Review the GPTs guide.",
  },
  {
    id: "m2q27",
    question:
      "You are about to publish a GPT you built with work data. What do you check first?",
    options: [
      {
        id: "m2q27_a",
        label: "That it does not expose confidential company or client information",
      },
      { id: "m2q27_b", label: "That its name is short and easy for everyone to remember" },
      { id: "m2q27_c", label: "That it includes the greatest number of capabilities possible" },
      { id: "m2q27_d", label: "That its description has a lot of trendy keywords" },
    ],
    correctAnswer: "m2q27_a",
    topic: "GPT Privacy",
    difficulty: "medium",
    source: "Guide: GPTs and Actions",
    feedback:
      "The first thing is not to leak confidential data. Review the GPT privacy topic.",
  },
  {
    id: "m2q28",
    question:
      "You want your GPT to answer only about one topic and not invent things on others. What do you do?",
    options: [
      {
        id: "m2q28_a",
        label: "You limit its scope and sources, and tell it to say 'I don't know' if needed",
      },
      { id: "m2q28_b", label: "You ask it to answer confidently about absolutely any topic" },
      { id: "m2q28_c", label: "You enable all capabilities so it improvises when data is missing" },
      { id: "m2q28_d", label: "You tell it to fill the gaps with approximate information" },
    ],
    correctAnswer: "m2q28_a",
    topic: "GPT Scope",
    difficulty: "easy",
    source: "Guide: GPTs and Actions",
    feedback:
      "Limiting the scope and allowing 'I don't know' reduces hallucinations. Review the guide.",
  },
  {
    id: "m2q29",
    question: "A support GPT must answer in the brand's tone. What do you set up?",
    options: [
      {
        id: "m2q29_a",
        label: "Tone and style instructions, with examples of brand answers",
      },
      { id: "m2q29_b", label: "Only Web Search, to copy the tone used by other sites" },
      { id: "m2q29_c", label: "DALL-E 3, so that answers always include useful images" },
      { id: "m2q29_d", label: "Nothing: the tone adjusts itself based on the first message" },
    ],
    correctAnswer: "m2q29_a",
    topic: "GPT Instructions",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Define tone, rules and examples in the instructions to keep the brand voice.",
  },
  {
    id: "m2q30",
    question: "After creating your GPT, what is a good next step?",
    options: [
      {
        id: "m2q30_a",
        label: "Testing it with real cases and adjusting instructions or knowledge",
      },
      { id: "m2q30_b", label: "Publishing it right away without doing any prior testing" },
      { id: "m2q30_c", label: "Deleting the rules, because they limit its free answers" },
      { id: "m2q30_d", label: "Adding new capabilities even if they add nothing to the task" },
    ],
    correctAnswer: "m2q30_a",
    topic: "GPT Iteration",
    difficulty: "medium",
    source: "OVA: Build a GPT",
    feedback:
      "Iterating with real cases improves the GPT. Practice in the GPT building lab.",
  },
  {
    id: "m2q31",
    question:
      "The support GPT answers very confidently but is sometimes wrong. What do you do?",
    options: [
      {
        id: "m2q31_a",
        label: "Add human supervision and verification steps in the support flow",
      },
      { id: "m2q31_b", label: "Trust it because it answers in a very confident tone" },
      { id: "m2q31_c", label: "Turn off the AI and answer everything manually forever" },
      { id: "m2q31_d", label: "Hide the sources so that the user stops asking more questions" },
    ],
    correctAnswer: "m2q31_a",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "Complete ChatGPT Guide",
    feedback:
      "A confident tone does not guarantee accuracy: add verification. Review the guide.",
  },
  {
    id: "m2q32",
    question: "A GPT must use customer data. Which practice is most appropriate?",
    options: [
      {
        id: "m2q32_a",
        label: "Minimize and anonymize the data, and limit who can access it",
      },
      { id: "m2q32_b", label: "Load all the available data because it helps the context" },
      { id: "m2q32_c", label: "Share it in the GPT Store to improve the global model" },
      { id: "m2q32_d", label: "Store it in the instructions so you don't search later" },
    ],
    correctAnswer: "m2q32_a",
    topic: "GPT Privacy",
    difficulty: "medium",
    source: "Guide: GPTs and Actions",
    feedback:
      "Minimize and anonymize the data and control access. Review the GPT privacy topic.",
  },
  {
    id: "m2q33",
    question:
      "You want to automate urgent complaint alerts without losing human control. What is the best design?",
    options: [
      {
        id: "m2q33_a",
        label: "A GPT with Actions that detects and notifies, leaving the decision to a person",
      },
      { id: "m2q33_b", label: "A GPT that answers and resolves all complaints with no supervision" },
      { id: "m2q33_c", label: "A GPT that only translates the complaints into another language" },
      { id: "m2q33_d", label: "A GPT that answers with images instead of real solutions" },
    ],
    correctAnswer: "m2q33_a",
    topic: "Automation",
    difficulty: "hard",
    source: "OVA: Real-World Automation Flows",
    feedback:
      "Automate detection and alerting and leave the key decision to a person. Review the OVA.",
  },
  {
    id: "m2q34",
    question:
      "You get many repeated questions every day. How do you automate it best with a GPT?",
    options: [
      {
        id: "m2q34_a",
        label: "Instructions plus knowledge base plus an API connection to answer",
      },
      { id: "m2q34_b", label: "Answering one by one using standard ChatGPT with no setup" },
      { id: "m2q34_c", label: "Letting Web Search answer whatever it finds first" },
      { id: "m2q34_d", label: "Generating a different image for each frequent question" },
    ],
    correctAnswer: "m2q34_a",
    topic: "Automation",
    difficulty: "medium",
    source: "OVA: Build a GPT",
    feedback:
      "A GPT with instructions, knowledge and API automates the repetitive work. Practice in the lab.",
  },
  {
    id: "m2q35",
    question: "What is the best way to ask ChatGPT for something?",
    options: [
      {
        id: "m2q35_a",
        label: "With a clear instruction that states task, context and format",
      },
      { id: "m2q35_b", label: "With a single loose word and hoping that it guesses well" },
      { id: "m2q35_c", label: "By repeating the exact same message many times in a row" },
      { id: "m2q35_d", label: "By typing in capital letters so that it understands better" },
    ],
    correctAnswer: "m2q35_a",
    topic: "ChatGPT Basics",
    difficulty: "easy",
    source: "Video: ChatGPT from Scratch in 6 Minutes",
    feedback:
      "Task, context and format: a clear instruction works best. Review the intro video.",
  },
  {
    id: "m2q36",
    question:
      "What is the main difference between built-in tools and a custom GPT?",
    options: [
      {
        id: "m2q36_a",
        label: "A tool solves one-off tasks; a GPT bundles its own role and rules",
      },
      { id: "m2q36_b", label: "None: they are exactly the same feature with a different name" },
      { id: "m2q36_c", label: "A tool is paid and a GPT is always completely free to use" },
      { id: "m2q36_d", label: "A tool generates images and a GPT only writes code for you" },
    ],
    correctAnswer: "m2q36_a",
    topic: "ChatGPT Ecosystem",
    difficulty: "medium",
    source: "OVA: Explore the ChatGPT Ecosystem",
    feedback:
      "Tools cover one-off tasks; a GPT packages role, knowledge and actions. Explore the ecosystem.",
  },
  {
    id: "m2q37",
    question:
      "Your GPT information changes rarely, but it must always be available. What do you choose?",
    options: [
      {
        id: "m2q37_a",
        label: "Knowledge base for the stable part and Actions for what changes",
      },
      { id: "m2q37_b", label: "Writing all the information inside the role instructions" },
      { id: "m2q37_c", label: "Only Web Search, ignoring your own internal documents" },
      { id: "m2q37_d", label: "Generating images of the documents with the DALL-E tool" },
    ],
    correctAnswer: "m2q37_a",
    topic: "GPT Architecture",
    difficulty: "hard",
    source: "Guide: GPTs and Actions",
    feedback:
      "Stable information goes in the knowledge base; live data goes in Actions. Review the guide.",
  },
  {
    id: "m2q38",
    question:
      "A team wants to share its product knowledge with ChatGPT. Which option is best?",
    options: [
      {
        id: "m2q38_a",
        label: "A shared Project with common files and instructions for the team",
      },
      { id: "m2q38_b", label: "Each person keeping their very own separate private notes" },
      { id: "m2q38_c", label: "Sharing simple screenshots of the chats through email" },
      { id: "m2q38_d", label: "A public GPT that each salesperson downloads on their own" },
    ],
    correctAnswer: "m2q38_a",
    topic: "ChatGPT Projects",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Projects share files and instructions with the team. Review the ChatGPT guide.",
  },
  {
    id: "m2q39",
    question:
      "A support GPT invents policies that do not exist. What is the best correction?",
    options: [
      {
        id: "m2q39_a",
        label: "Anchor its answers to the knowledge base and require citing the source",
      },
      { id: "m2q39_b", label: "Raise the confidence tone so that it answers more securely" },
      { id: "m2q39_c", label: "Remove the knowledge base so that it becomes more creative" },
      { id: "m2q39_d", label: "Disable verification so that it responds much faster" },
    ],
    correctAnswer: "m2q39_a",
    topic: "GPT Hallucinations",
    difficulty: "hard",
    source: "Guide: GPTs and Actions",
    feedback:
      "Anchor answers to sources and require citations to reduce invented content. Review the guide.",
  },
  {
    id: "m2q40",
    question:
      "Case: building a support GPT that uses live data and escalates complex cases. What is the most complete design?",
    options: [
      {
        id: "m2q40_a",
        label: "Instructions plus knowledge base plus API Actions plus escalation to a human",
      },
      { id: "m2q40_b", label: "Only a system prompt that says you are a support agent" },
      { id: "m2q40_c", label: "Web Search enabled and no source of the company's own" },
      { id: "m2q40_d", label: "DALL-E 3 to answer with images instead of solutions" },
    ],
    correctAnswer: "m2q40_a",
    topic: "GPT Architecture",
    difficulty: "hard",
    source: "OVA: Real-World Automation Flows",
    feedback:
      "The ideal flow combines role, knowledge, live data via API and human supervision. Review the OVA.",
  },
];
