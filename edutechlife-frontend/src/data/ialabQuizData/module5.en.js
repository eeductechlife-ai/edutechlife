// Banco del módulo 5 (Claude). Opciones equilibradas: la correcta no se distingue por longitud.
export const MODULE_5_EN = [
  {
    id: "m5q1",
    question:
      "You want Claude to help you prepare a proposal for a client. What information do you give it first to get a good result?",
    options: [
      {
        id: "m5q1_a",
        label: "Only the word 'proposal', so it has creative freedom",
      },
      {
        id: "m5q1_b",
        label: "The goal, the client, the tone and the result you expect",
      },
      {
        id: "m5q1_c",
        label: "A paragraph copied from the internet with no context",
      },
      {
        id: "m5q1_d",
        label: "Let it decide everything without asking you anything",
      },
    ],
    correctAnswer: "m5q1_b",
    topic: "Getting to know Claude",
    difficulty: "easy",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "Claude works better when it knows the goal, the audience and the format. Without context, it guesses.",
  },
  {
    id: "m5q2",
    question: "What does an Artifact let you do in Claude?",
    options: [
      {
        id: "m5q2_a",
        label: "Store your password securely in the app",
      },
      {
        id: "m5q2_b",
        label: "Create and edit documents or pieces in the chat",
      },
      {
        id: "m5q2_c",
        label: "Connect Claude to the company bank account settings",
      },
      {
        id: "m5q2_d",
        label: "Delete the history of all your past conversations",
      },
    ],
    correctAnswer: "m5q2_b",
    topic: "Creating with Claude",
    difficulty: "easy",
    source: "Lesson 2: Create with Claude",
    feedback:
      "Artifacts are pieces you can see and edit next to the conversation: documents, charts or small applications.",
  },
  {
    id: "m5q3",
    question:
      "Claude gives you a table of sales figures. What should you do before presenting it to the team?",
    options: [
      {
        id: "m5q3_a",
        label: "Present it as is, because Claude never gets numbers wrong",
      },
      {
        id: "m5q3_b",
        label:
          "Check the figures against the original source and review the calculations",
      },
      {
        id: "m5q3_c",
        label: "Ask it to change the figures so they match the target",
      },
      {
        id: "m5q3_d",
        label: "Hide that an AI made the table",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Oversight",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Claude can make mistakes with figures and calculations. Human judgment verifies the data before it is used.",
  },
  {
    id: "m5q4",
    question: "What is the best way to use a Project in Claude?",
    options: [
      {
        id: "m5q4_a",
        label: "Mix unrelated topics in the same Project",
      },
      {
        id: "m5q4_b",
        label:
          "Create one Project per topic and keep instructions and reference files there",
      },
      {
        id: "m5q4_c",
        label:
          "Don't use Projects, because starting from scratch is always better",
      },
      {
        id: "m5q4_d",
        label: "Upload all your personal files to every Project",
      },
    ],
    correctAnswer: "m5q4_b",
    topic: "Projects and memory",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A Project gathers the context of one piece of work: instructions and reference documents. You don't have to repeat everything in every chat.",
  },
  {
    id: "m5q5",
    question:
      "You want Claude to review your Gmail before you reply to a client. What should you keep in mind?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Connect Gmail without checking what permissions it asks for, because it's automatic",
      },
      {
        id: "m5q5_b",
        label:
          "Connect the account through a connector, review the permissions it grants and decide what to share",
      },
      {
        id: "m5q5_c",
        label: "Give your password in the chat so Claude can log in for you",
      },
      {
        id: "m5q5_d",
        label: "Ask it to send the reply without you reviewing it",
      },
    ],
    correctAnswer: "m5q5_b",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Connectors give access to your apps with permissions you approve. Never give passwords in the chat, and always review before sending.",
  },
  {
    id: "m5q6",
    question: "What is a Skill in Claude?",
    options: [
      {
        id: "m5q6_a",
        label: "A type of password to protect your files",
      },
      {
        id: "m5q6_b",
        label:
          "A package of instructions, templates and references that Claude reuses for a task",
      },
      {
        id: "m5q6_c",
        label: "An AI model different from Opus, Sonnet or Haiku",
      },
      {
        id: "m5q6_d",
        label: "A function that turns off chat memory",
      },
    ],
    correctAnswer: "m5q6_b",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A Skill turns a procedure you repeat into something reusable: instructions, templates and examples.",
  },
  {
    id: "m5q7",
    question:
      "You want a weekly summary of your pending tasks. Which Claude mode suits you best?",
    options: [
      {
        id: "m5q7_a",
        label: "Ask for it by hand every Monday, with no automation",
      },
      {
        id: "m5q7_b",
        label: "Schedule a recurring task in Cowork, with the sources it needs",
      },
      {
        id: "m5q7_c",
        label: "Paste your whole email history into every conversation",
      },
      {
        id: "m5q7_d",
        label: "Create a new account every week",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegating with Claude",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Scheduled tasks in Cowork run recurring work. You define which sources it uses and you review the result.",
  },
  {
    id: "m5q8",
    question: "What does 'delegating with judgment' to Claude mean?",
    options: [
      {
        id: "m5q8_a",
        label: "Let it decide and execute everything without human review",
      },
      {
        id: "m5q8_b",
        label: "Set the goal and limits, then review it",
      },
      {
        id: "m5q8_c",
        label: "Ask for anything without specifying anything",
      },
      {
        id: "m5q8_d",
        label: "Use it only for tasks that don't matter",
      },
    ],
    correctAnswer: "m5q8_b",
    topic: "Delegating with Claude",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Delegating doesn't mean walking away: you set the goal, the limits and the review. The final responsibility is still yours.",
  },
  {
    id: "m5q9",
    question:
      "Claude seems to remember details from earlier conversations. What should you do if you want to control that information?",
    options: [
      {
        id: "m5q9_a",
        label: "Nothing: memory can't be reviewed",
      },
      {
        id: "m5q9_b",
        label: "Review what Claude remembers, and edit or delete it",
      },
      {
        id: "m5q9_c",
        label: "Share your password so Claude stores it",
      },
      {
        id: "m5q9_d",
        label: "Ask it to keep your clients' data forever",
      },
    ],
    correctAnswer: "m5q9_b",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "Memory is a feature you can review and adjust. Decide what is useful for it to remember and what not.",
  },
  {
    id: "m5q10",
    question:
      "You are going to upload a contract that contains clients' personal data to Claude. What is the most prudent step?",
    options: [
      {
        id: "m5q10_a",
        label: "Upload it in full, because Claude never stores anything",
      },
      {
        id: "m5q10_b",
        label: "Anonymize personal data and share only what is necessary",
      },
      {
        id: "m5q10_c",
        label: "Publish it on a blog so others can review it",
      },
      {
        id: "m5q10_d",
        label: "Send it by WhatsApp to a stranger to translate it",
      },
    ],
    correctAnswer: "m5q10_b",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Minimize the data you share and follow your organization's policy and the data protection law that applies to you (in Colombia, Law 1581 of 2012).",
  },
  {
    id: "m5q11",
    question: "What is the difference between a Project and Claude's memory?",
    options: [
      {
        id: "m5q11_a",
        label: "There is no difference between them",
      },
      {
        id: "m5q11_b",
        label:
          "A Project keeps instructions for a topic; memory, useful details",
      },
      {
        id: "m5q11_c",
        label: "Memory is used to upload 10 GB files",
      },
      {
        id: "m5q11_d",
        label: "A Project is a type of password",
      },
    ],
    correctAnswer: "m5q11_b",
    topic: "Projects and memory",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "A Project is the context of one piece of work. Memory recalls preferences and useful details across conversations.",
  },
  {
    id: "m5q12",
    question:
      "Claude gives you a figure with a citation to a study. What is the right step?",
    options: [
      {
        id: "m5q12_a",
        label: "Cite it as is without looking up the study",
      },
      {
        id: "m5q12_b",
        label: "Find the original study and confirm it says what Claude claims",
      },
      {
        id: "m5q12_c",
        label: "Change the year of the citation so it sounds more recent",
      },
      {
        id: "m5q12_d",
        label: "Assume it's correct because it sounds professional",
      },
    ],
    correctAnswer: "m5q12_b",
    topic: "Limits and errors",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A citation can look real and not exist, or say something else. Always verify against the primary source.",
  },
  {
    id: "m5q13",
    question:
      "Which task is most suitable to delegate to Claude with minimal review?",
    options: [
      {
        id: "m5q13_a",
        label: "Sign a contract on behalf of your company",
      },
      {
        id: "m5q13_b",
        label: "Format a draft that you later review",
      },
      {
        id: "m5q13_c",
        label: "Decide on the dismissal of a person",
      },
      {
        id: "m5q13_d",
        label: "Make a medical diagnosis of a patient",
      },
    ],
    correctAnswer: "m5q13_b",
    topic: "Delegating with Claude",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Drafting and formatting tasks are ideal to delegate. Legal, medical or people decisions require human judgment.",
  },
  {
    id: "m5q14",
    question:
      "You want Claude to generate a presentation for your board of directors. What do you give it first?",
    options: [
      {
        id: "m5q14_a",
        label: "Nothing: Claude can infer the message by itself",
      },
      {
        id: "m5q14_b",
        label: "The core idea, audience, verified figures and the slides",
      },
      {
        id: "m5q14_c",
        label: "Only the word 'presentation', with no details",
      },
      {
        id: "m5q14_d",
        label: "A video from another company to copy word for word",
      },
    ],
    correctAnswer: "m5q14_b",
    topic: "Creating with Claude",
    difficulty: "medium",
    source: "Lesson 2: Create with Claude",
    feedback:
      "A good presentation starts with the message and the audience. Figures must be verified before they go on a slide.",
  },
  {
    id: "m5q15",
    question:
      "Claude made a change to a document you had already edited. What should you do?",
    options: [
      {
        id: "m5q15_a",
        label: "Accept everything without reading it, to save time",
      },
      {
        id: "m5q15_b",
        label:
          "Compare the change, accept what improves it and revert the rest",
      },
      {
        id: "m5q15_c",
        label: "Delete the document and start over, without reviewing",
      },
      {
        id: "m5q15_d",
        label: "Ask it to change your colleague's version too",
      },
    ],
    correctAnswer: "m5q15_b",
    topic: "Creating with Claude",
    difficulty: "medium",
    source: "Lesson 2: Create with Claude",
    feedback: "Co-editing requires review. You decide which version stays.",
  },
  {
    id: "m5q16",
    question:
      "Which Claude model suits a simple, repetitive task such as sorting emails?",
    options: [
      {
        id: "m5q16_a",
        label: "Always the largest model, even when the task is simple",
      },
      {
        id: "m5q16_b",
        label:
          "A fast model for simple work and a capable one for complex work",
      },
      {
        id: "m5q16_c",
        label: "None: it should always be done by hand",
      },
      {
        id: "m5q16_d",
        label: "The one with the longest name, with no other criteria",
      },
    ],
    correctAnswer: "m5q16_b",
    topic: "Limits and errors",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "Choose the model based on the task: fast and low-cost for simple work, more capable for complex work. This saves time and cost.",
  },
  {
    id: "m5q17",
    question:
      "What is the best practice when writing instructions for a Project?",
    options: [
      {
        id: "m5q17_a",
        label: "Write a single generic sentence about the topic",
      },
      {
        id: "m5q17_b",
        label: "Describe the role, goal, rules, tone and examples",
      },
      {
        id: "m5q17_c",
        label: "Paste the company's full manual without summarizing",
      },
      {
        id: "m5q17_d",
        label: "Ask it to 'do whatever it wants' with the topic",
      },
    ],
    correctAnswer: "m5q17_b",
    topic: "Projects and memory",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Good instructions combine role, goal, rules and examples. They are the base for every conversation in the Project to be consistent.",
  },
  {
    id: "m5q18",
    question:
      "A colleague asks you to share a report generated with Claude that contains confidential company data. What do you do?",
    options: [
      {
        id: "m5q18_a",
        label: "Send it in full because it's my colleague",
      },
      {
        id: "m5q18_b",
        label: "Check the data's classification and share only what is allowed",
      },
      {
        id: "m5q18_c",
        label: "Post it on social media so everyone can see it",
      },
      {
        id: "m5q18_d",
        label: "Give them my password so they can open the folder",
      },
    ],
    correctAnswer: "m5q18_b",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A tool generating a document doesn't change its confidentiality. Share only what the policy allows.",
  },
  {
    id: "m5q19",
    question:
      "What role does an 'agent' play in a multi-step task, such as organizing files and writing a summary?",
    options: [
      {
        id: "m5q19_a",
        label: "It executes steps toward your goal, under supervision",
      },
      {
        id: "m5q19_b",
        label: "It acts without anyone knowing or reviewing it",
      },
      {
        id: "m5q19_c",
        label: "It replaces your email account",
      },
      {
        id: "m5q19_d",
        label: "It doesn't exist in Claude; it is just an idea",
      },
    ],
    correctAnswer: "m5q19_a",
    topic: "Delegating with Claude",
    difficulty: "hard",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "An agent executes steps toward a goal. Good practice is to define the scope, ask for confirmation on important actions and review the result.",
  },
  {
    id: "m5q20",
    question:
      "Why is it useful for Claude to explain its steps before carrying out an important action?",
    options: [
      {
        id: "m5q20_a",
        label: "To increase waiting time for no reason",
      },
      {
        id: "m5q20_b",
        label: "To catch misunderstandings before they have consequences",
      },
      {
        id: "m5q20_c",
        label: "Because Claude can't execute anything",
      },
      {
        id: "m5q20_d",
        label: "To keep the user from reading the answer",
      },
    ],
    correctAnswer: "m5q20_b",
    topic: "Oversight",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Reviewing the plan before acting prevents costly mistakes. It is part of delegating with judgment.",
  },
  {
    id: "m5q21",
    question: "What kind of information is riskiest to share with any AI tool?",
    options: [
      {
        id: "m5q21_a",
        label: "A list of blog topics",
      },
      {
        id: "m5q21_b",
        label: "Passwords, bank details and other people's identities",
      },
      {
        id: "m5q21_c",
        label: "A sample text with no real data",
      },
      {
        id: "m5q21_d",
        label: "A class outline with general topics",
      },
    ],
    correctAnswer: "m5q21_b",
    topic: "Privacy and data",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Never share passwords or sensitive data about third parties. Use fictitious data whenever you can.",
  },
  {
    id: "m5q22",
    question:
      "Claude gives you a correct answer about a topic that changed after its last update. What should you do?",
    options: [
      {
        id: "m5q22_a",
        label: "Always trust what the AI says",
      },
      {
        id: "m5q22_b",
        label: "Ask for current data or check a recent source",
      },
      {
        id: "m5q22_c",
        label: "Ignore any recent data completely",
      },
      {
        id: "m5q22_d",
        label: "Change the document's date so it looks recent",
      },
    ],
    correctAnswer: "m5q22_b",
    topic: "Limits and errors",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "Models don't always know the latest information. For data that changes, use search or a current source.",
  },
  {
    id: "m5q23",
    question: "Which of these is a good way to create an interactive Artifact?",
    options: [
      {
        id: "m5q23_a",
        label: "Ask for 'something nice' without describing what it should do",
      },
      {
        id: "m5q23_b",
        label:
          "Describe the use, the input data and the expected result, then iterate",
      },
      {
        id: "m5q23_c",
        label: "Copy the code of another company's app",
      },
      {
        id: "m5q23_d",
        label: "Never test it before sharing it with the team",
      },
    ],
    correctAnswer: "m5q23_b",
    topic: "Creating with Claude",
    difficulty: "medium",
    source: "Lesson 2: Create with Claude",
    feedback:
      "Describe the use and the result, ask for small adjustments and test the piece before sharing it.",
  },
  {
    id: "m5q24",
    question:
      "What is good practice when reviewing a document Claude wrote for your client?",
    options: [
      {
        id: "m5q24_a",
        label: "Skim it, because it's already well written",
      },
      {
        id: "m5q24_b",
        label:
          "Check data, tone, names, dates and that it says what you really mean",
      },
      {
        id: "m5q24_c",
        label: "Send it without changing the previous client's name",
      },
      {
        id: "m5q24_d",
        label: "Remove the signature so it looks neutral",
      },
    ],
    correctAnswer: "m5q24_b",
    topic: "Oversight",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A well-written text can still have wrong data or the wrong name. Human review is mandatory.",
  },
  {
    id: "m5q25",
    question:
      "You want to reuse the same procedure for writing meeting minutes across several projects. What should you create?",
    options: [
      {
        id: "m5q25_a",
        label: "A Skill with instructions, a template and a minutes example",
      },
      {
        id: "m5q25_b",
        label: "A new chat each time, asking for everything again",
      },
      {
        id: "m5q25_c",
        label: "A password to protect the document",
      },
      {
        id: "m5q25_d",
        label: "An email to Claude with the full procedure",
      },
    ],
    correctAnswer: "m5q25_a",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "What you repeat becomes a Skill: the procedure stays the same each time and you save time.",
  },
  {
    id: "m5q26",
    question: "Which statement about AI and work is the most responsible?",
    options: [
      {
        id: "m5q26_a",
        label: "AI completely replaces human review",
      },
      {
        id: "m5q26_b",
        label: "AI speeds up work, but people own the decisions",
      },
      {
        id: "m5q26_c",
        label: "Using AI is always cheating",
      },
      {
        id: "m5q26_d",
        label: "You should never say that AI was used",
      },
    ],
    correctAnswer: "m5q26_b",
    topic: "Delegating with Claude",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "AI speeds up work. The decision and its consequences still belong to the person.",
  },
  {
    id: "m5q27",
    question:
      "You want Claude to analyze a large data file. What do you do to get a reliable result?",
    options: [
      {
        id: "m5q27_a",
        label: "Ask for a conclusion without checking the method",
      },
      {
        id: "m5q27_b",
        label:
          "Ask for the steps and validate a sample with your own calculation",
      },
      {
        id: "m5q27_c",
        label: "Use only the first result that appears",
      },
      {
        id: "m5q27_d",
        label: "Change the data so it gives a nice result",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Limits and errors",
    difficulty: "hard",
    source: "Lesson 2: Create with Claude",
    feedback:
      "Ask for the method and validate a sample with an independent calculation. That way you catch errors before deciding.",
  },
  {
    id: "m5q28",
    question:
      "What should you define first before giving Claude a complex task?",
    options: [
      {
        id: "m5q28_a",
        label: "The color and typography of the document",
      },
      {
        id: "m5q28_b",
        label: "The result, the success criteria and what it must not do",
      },
      {
        id: "m5q28_c",
        label: "The number of emojis in the text",
      },
      {
        id: "m5q28_d",
        label: "Nothing: the less said, the better",
      },
    ],
    correctAnswer: "m5q28_b",
    topic: "Delegating with Claude",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Defining the result, the success criteria and the limits is the step that adds the most quality.",
  },
  {
    id: "m5q29",
    question:
      "You receive an email from 'Claude support' asking for your password to 'verify your account'. What do you do?",
    options: [
      {
        id: "m5q29_a",
        label: "Reply with my password so I don't lose the account",
      },
      {
        id: "m5q29_b",
        label:
          "Don't reply: I check directly in the official app and report the email",
      },
      {
        id: "m5q29_c",
        label: "Forward the email to all my contacts",
      },
      {
        id: "m5q29_d",
        label: "Click the email link and enter my password there",
      },
    ],
    correctAnswer: "m5q29_b",
    topic: "Privacy and data",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "No legitimate company asks for your password by email. Always access through the official app or site.",
  },
  {
    id: "m5q30",
    question:
      "When you finish a project with Claude, which practice gives the best foundation for the next one?",
    options: [
      {
        id: "m5q30_a",
        label: "Delete everything and keep no record",
      },
      {
        id: "m5q30_b",
        label: "Save instructions, templates and lessons in a Project or Skill",
      },
      {
        id: "m5q30_c",
        label: "Share the full history with anyone",
      },
      {
        id: "m5q30_d",
        label: "Forget what worked to avoid repeating mistakes",
      },
    ],
    correctAnswer: "m5q30_b",
    topic: "Projects and memory",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "What works should be saved in a Project or a Skill. That way every new piece of work starts from what you have learned.",
  },
];
