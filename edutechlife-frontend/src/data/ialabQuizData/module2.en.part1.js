export const MODULE_2_EN_PART1 = [
  {
    id: "m2q1",
    question:
      "You have a sales CSV and want to find which products grow most. Which tool combination is the most useful?",
    options: [
      {
        id: "m2q1_a",
        label: "data analysis for the CSV and Web Search for trends",
      },
      {
        id: "m2q1_b",
        label: "Canvas to paste data and the image generator for the charts",
      },
      {
        id: "m2q1_c",
        label: "Only Web Search to read market articles",
      },
      {
        id: "m2q1_d",
        label: "The image generator to analyze the file automatically",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "ChatGPT Tools",
    difficulty: "medium",
    source: "The Toolbox",
    feedback:
      "data analysis analyzes the CSV and Web Search brings market data. Practice in the activity The Toolbox.",
  },
  {
    id: "m2q2",
    question:
      "A law firm wants an assistant to draft contracts with its templates. Which setup is right?",
    options: [
      {
        id: "m2q2_a",
        label: "Templates in a Project, reviewed by a person",
      },
      {
        id: "m2q2_b",
        label:
          "A chat with no instructions, with the template pasted each time",
      },
      {
        id: "m2q2_c",
        label: "Ask it to draft without review, since it already knows the law",
      },
      {
        id: "m2q2_d",
        label: "Copy the first result of a generic internet search",
      },
    ],
    correctAnswer: "m2q2_a",
    topic: "Custom GPTs",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "A Project keeps templates and instructions for all its chats, and a person reviews the text before it is signed.",
  },
  {
    id: "m2q3",
    question:
      "Inside a Project you upload a client's base contract and templates. What advantage does it have over starting a new chat?",
    options: [
      {
        id: "m2q3_a",
        label: "Every chat uses those files and instructions",
      },
      {
        id: "m2q3_b",
        label: "The files are published automatically in the GPT Store",
      },
      {
        id: "m2q3_c",
        label: "It edits your files",
      },
      {
        id: "m2q3_d",
        label: "The files are deleted when the conversation closes",
      },
    ],
    correctAnswer: "m2q3_a",
    topic: "Projects",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "A Project keeps files and instructions for one piece of work, so you don't paste them into every chat. Review the Projects topic.",
  },
  {
    id: "m2q4",
    question: "What are a Project's instructions for?",
    options: [
      {
        id: "m2q4_a",
        label: "Defining role, tone, scope and what it must not do",
      },
      {
        id: "m2q4_b",
        label: "Storing the account's billing history",
      },
      {
        id: "m2q4_c",
        label: "Switching the AI model automatically depending on the time",
      },
      {
        id: "m2q4_d",
        label: "Publishing the work to a public store of the platform",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Custom GPTs",
    difficulty: "easy",
    source: "Complete ChatGPT Guide",
    feedback:
      "Instructions set role, tone, scope and limits for every conversation in the Project.",
  },
  {
    id: "m2q5",
    question:
      "A community manager gets many frequently asked questions every day. How do they answer them best?",
    options: [
      {
        id: "m2q5_a",
        label: "Replying to each comment by hand with a copied template",
      },
      {
        id: "m2q5_b",
        label:
          "Letting each customer ask the generic chat without instructions",
      },
      {
        id: "m2q5_c",
        label:
          "With answers based on the brand's FAQs, a defined tone and human review",
      },
      {
        id: "m2q5_d",
        label:
          "Posting the questions online and waiting for other users to answer",
      },
    ],
    correctAnswer: "m2q5_c",
    topic: "Automation",
    difficulty: "medium",
    source: "The Project Workshop",
    feedback:
      "An assistant with the brand's FAQs, a defined tone and human review answers quickly without making things up. Answers with no instructions or no review are the mistake.",
  },
  {
    id: "m2q6",
    question:
      "A complaints assistant sometimes gives wrong data about returns. What is the most responsible practice?",
    options: [
      {
        id: "m2q6_a",
        label: "Human oversight and alerts when it doubts a data point",
      },
      {
        id: "m2q6_b",
        label: "Letting it answer alone, since it is almost always right",
      },
      {
        id: "m2q6_c",
        label: "Removing the return policies so it does not invent",
      },
      {
        id: "m2q6_d",
        label: "Changing its tone so it sounds more confident",
      },
    ],
    correctAnswer: "m2q6_a",
    topic: "Responsible Use",
    difficulty: "medium",
    source: "Complete ChatGPT Guide",
    feedback:
      "Alerts and human oversight stop a wrong data point from reaching the customer.",
  },
  {
    id: "m2q7",
    question:
      "A sales team wants to share updated product knowledge. What strategy is best?",
    options: [
      {
        id: "m2q7_a",
        label: "A shared Project with common knowledge",
      },
      {
        id: "m2q7_b",
        label: "Each seller keeps their own instructions",
      },
      {
        id: "m2q7_c",
        label: "Use a public GPT that everyone downloads",
      },
      {
        id: "m2q7_d",
        label: "Share chat screenshots by email",
      },
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
      "Your assistant must answer with prices that change every day. What is the least recommended option?",
    options: [
      {
        id: "m2q8_a",
        label: "Checking an updated price source each time",
      },
      {
        id: "m2q8_b",
        label: "Leaving the prices fixed in the instructions, never updated",
      },
      {
        id: "m2q8_c",
        label: "Showing the date of each price in the answer",
      },
      {
        id: "m2q8_d",
        label: "Reviewing the source before giving a figure to the client",
      },
    ],
    correctAnswer: "m2q8_b",
    topic: "Custom GPTs",
    difficulty: "medium",
    source: "The Project Workshop",
    feedback:
      "A figure that changes should not stay fixed in the instructions: it is checked in an updated source and shown with its date.",
  },
  {
    id: "m2q9",
    question:
      "You plan to share an assistant you use at work with other people. What do you check first?",
    options: [
      {
        id: "m2q9_a",
        label: "That it does not expose sensitive data",
      },
      {
        id: "m2q9_b",
        label: "The number of stars it has in the public store",
      },
      {
        id: "m2q9_c",
        label: "That it has the biggest logo possible",
      },
      {
        id: "m2q9_d",
        label: "How many times you used it last week",
      },
    ],
    correctAnswer: "m2q9_a",
    topic: "GPT Privacy",
    difficulty: "easy",
    source: "Complete ChatGPT Guide",
    feedback:
      "Before sharing, the first thing is that it does not expose confidential information.",
  },
  {
    id: "m2q10",
    question:
      "You want AI to detect urgent complaints on social media and alert support. What combination is most sensible?",
    options: [
      {
        id: "m2q10_a",
        label:
          "An assistant that sorts the complaints and a person who gets the alert",
      },
      {
        id: "m2q10_b",
        label:
          "Letting the assistant reply and close complaints without review",
      },
      {
        id: "m2q10_c",
        label: "A shared document the team reviews whenever it can",
      },
      {
        id: "m2q10_d",
        label:
          "Copying the complaints by hand each morning and answering all alike",
      },
    ],
    correctAnswer: "m2q10_d",
    topic: "Automation",
    difficulty: "hard",
    source: "The Toolbox",
    feedback:
      "The assistant sorts and alerts fast; a person reviews the reply to an urgent complaint. Closing complaints without review or waiting without an alert are the mistakes.",
  },
  {
    id: "m2q11",
    question: "What is ChatGPT, in essence?",
    options: [
      {
        id: "m2q11_a",
        label: "A language model that answers your instructions",
      },
      {
        id: "m2q11_b",
        label: "A spreadsheet software with artificial intelligence features",
      },
      {
        id: "m2q11_c",
        label: "A search engine that returns links",
      },
      {
        id: "m2q11_d",
        label: "A program for designing images without writing anything at all",
      },
    ],
    correctAnswer: "m2q11_a",
    topic: "ChatGPT Basics",
    difficulty: "easy",
    source: "ChatGPT from Scratch in 6 Minutes",
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
        label: "It may be outdated; verify critical data first",
      },
      {
        id: "m2q12_b",
        label: "It always knows the news",
      },
      {
        id: "m2q12_c",
        label: "It never makes mistakes with exact dates or exact figures",
      },
      {
        id: "m2q12_d",
        label: "It only answers with verified links to official public portals",
      },
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
        label: "To check today's news, prices or recent market data",
      },
      {
        id: "m2q13_b",
        label:
          "To generate a decorative image from a short written description",
      },
      {
        id: "m2q13_c",
        label:
          "To run calculations on a local sales file stored on your laptop",
      },
      {
        id: "m2q13_d",
        label: "To create a custom GPT",
      },
    ],
    correctAnswer: "m2q13_a",
    topic: "Web Search",
    difficulty: "medium",
    source: "The Master Blueprint",
    feedback:
      "Web Search brings updated information from the internet. Explore the activity The Master Blueprint.",
  },
  {
    id: "m2q14",
    question:
      "You have a CSV with sales and want a monthly bar chart. What do you use?",
    options: [
      {
        id: "m2q14_a",
        label: "The Code Interpreter, which builds the chart from the file",
      },
      {
        id: "m2q14_b",
        label: "Web Search, to read articles about charts",
      },
      {
        id: "m2q14_c",
        label: "The image generator, drawing the bars by hand",
      },
      {
        id: "m2q14_d",
        label: "Canvas, pasting each row into a table",
      },
    ],
    correctAnswer: "m2q14_a",
    topic: "data analysis",
    difficulty: "medium",
    source: "The Toolbox",
    feedback:
      "The Code Interpreter reads the file and builds the chart; then check that the totals match your CSV.",
  },
];
