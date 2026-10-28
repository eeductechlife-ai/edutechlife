export const MODULE_5_EN_PART1 = [
  {
    id: "m5q1",
    question:
      "You are going to ask Claude for a proposal for a client. Which request keeps Claude from having to guess key details?",
    options: [
      {
        id: "m5q1_a",
        label:
          "Goal, the client who reads it, format, tone and what not to promise",
      },
      {
        id: "m5q1_b",
        label:
          "The goal and the format; Claude can decide the tone and the limits on its own",
      },
      {
        id: "m5q1_c",
        label: "A previous proposal and the line 'make one like this'",
      },
      {
        id: "m5q1_d",
        label:
          "A list of adjectives: professional, creative, complete and persuasive",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Getting to know Claude",
    difficulty: "easy",
    source: "Lesson 1 · Get to Know Claude: the AI That Works With You",
    feedback:
      "A complete request has five parts: goal, audience, format, tone and limits. Every missing part is an assumption Claude makes for you.",
  },
  {
    id: "m5q2",
    question: "What does an Artifact let you do in Claude?",
    options: [
      {
        id: "m5q2_a",
        label: "Store fixed instructions that apply to every chat",
      },
      {
        id: "m5q2_b",
        label: "Connect Claude to Gmail or Drive so it can read your files",
      },
      {
        id: "m5q2_c",
        label: "See and improve a piece next to the chat, step by step",
      },
      {
        id: "m5q2_d",
        label: "Remember your preferred tone from one chat to the next",
      },
    ],
    correctAnswer: "m5q2_c",
    topic: "Creating with Claude",
    difficulty: "easy",
    source:
      "Lesson 2 · Create with Claude: Artifacts, Documents and Presentations",
    feedback:
      "An Artifact is a piece (document, table or small app) that lives next to the chat: you see it and improve it step by step. Fixed instructions go in a Project, preferences in memory and access to your apps in connectors.",
  },
  {
    id: "m5q3",
    question:
      "Today you must fix the spelling of 20 short emails and, separately, analyze a long contract with complex clauses. How do you choose Claude's model?",
    options: [
      {
        id: "m5q3_a",
        label:
          "The most capable one for both tasks, to ensure the best quality",
      },
      {
        id: "m5q3_b",
        label:
          "A fast one for the emails and a more capable one for the contract",
      },
      {
        id: "m5q3_c",
        label: "A fast one for both, since they are both text tasks",
      },
      {
        id: "m5q3_d",
        label:
          "The most capable one for the emails, since there are more, and a fast one for the contract",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Getting to know Claude",
    difficulty: "medium",
    source: "Lesson 1 · Get to Know Claude: the AI That Works With You",
    feedback:
      "A fast model is enough for simple, repetitive tasks, such as fixing short emails; a more capable one is better for a long text that requires reasoning, such as the contract. Using the most powerful one for everything spends without gaining, and a fast one may fall short on the contract.",
  },
  {
    id: "m5q4",
    question: "What is the best way to use a Project in Claude?",
    options: [
      {
        id: "m5q4_a",
        label:
          "One single Project for all your work, so Claude has all the context",
      },
      {
        id: "m5q4_b",
        label:
          "Paste the same instructions at the start of every chat in the Project",
      },
      {
        id: "m5q4_c",
        label: "Upload all the company's files in case one is needed",
      },
      {
        id: "m5q4_d",
        label: "One Project per recurring job, with its own rules and files",
      },
    ],
    correctAnswer: "m5q4_d",
    topic: "Projects and memory",
    difficulty: "easy",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "A Project stores the instructions and files for a specific job that repeats, so you do not repeat them in every chat. Mixing topics or uploading extra files gives it useless context and can expose data.",
  },
  {
    id: "m5q5",
    question:
      "You want Claude to read your email to prepare a reply to a client. What do you do?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Connect only email, check its permissions and approve the reply yourself",
      },
      {
        id: "m5q5_b",
        label:
          "Connect email, files and calendar at once so you do not repeat the process",
      },
      {
        id: "m5q5_c",
        label:
          "Copy the client's full emails into the chat, with their details",
      },
      {
        id: "m5q5_d",
        label: "Connect email and let Claude send the reply",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "With a connector you give access only to what the task needs and you approve its permissions. You can disconnect it when you finish, and you review and send the reply yourself.",
  },
  {
    id: "m5q6",
    question:
      "So that Claude can review your sales platform, a coworker suggests typing your username and password into the chat. What do you do?",
    options: [
      {
        id: "m5q6_a",
        label: "I share it and change it as soon as Claude finishes the review",
      },
      {
        id: "m5q6_b",
        label: "I type it in an incognito chat so that it is not saved",
      },
      {
        id: "m5q6_c",
        label:
          "I use a connector for that platform and read the permissions it asks for",
      },
      {
        id: "m5q6_d",
        label: "I give it to Claude in the instructions of a private Project",
      },
    ],
    correctAnswer: "m5q6_c",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "A password opens your whole account and is not typed into a chat, whether incognito or in a Project. To give access to a tool you use a connector, and before approving it you read the permissions it asks for. Changing it afterwards does not undo that you already shared it.",
  },
  {
    id: "m5q7",
    question:
      "Every Monday you prepare the same to-do report and always explain the same steps to Claude. What should you do?",
    options: [
      {
        id: "m5q7_a",
        label:
          "Keep writing out the full steps in every chat so that none of them get lost",
      },
      {
        id: "m5q7_b",
        label:
          "Save those steps in a Skill, use it every Monday and review the report",
      },
      {
        id: "m5q7_c",
        label:
          "Use an incognito chat so Claude starts from scratch each Monday",
      },
      {
        id: "m5q7_d",
        label: "Create a new Project every Monday with the same steps",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegating with Claude",
    difficulty: "medium",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "A procedure you always do the same way is saved as a Skill: Claude applies the same steps each time and you only review the result. Incognito does not keep the procedure for the following week, and creating a Project every week repeats the work.",
  },
  {
    id: "m5q8",
    question:
      "You ask Claude for a multi-step task: check your calendar, write invitations and send them to 30 clients. Where do you put the checkpoint?",
    options: [
      {
        id: "m5q8_a",
        label:
          "At the end: I review the summary of what it did once it finishes",
      },
      {
        id: "m5q8_b",
        label: "At the start: I give it detailed instructions and let it work",
      },
      {
        id: "m5q8_c",
        label:
          "At the drafting step: I approve the template and let it send the rest",
      },
      {
        id: "m5q8_d",
        label:
          "Before sending: I review the invitations and confirm the sending myself",
      },
    ],
    correctAnswer: "m5q8_d",
    topic: "Delegating with Claude",
    difficulty: "medium",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "In a multi-step task, important actions, such as sending something to clients, are confirmed before they happen, because they cannot be undone afterwards. Reviewing at the end comes too late, good instructions do not replace the review and approving the template does not check each invitation.",
  },
  {
    id: "m5q9",
    question:
      "Claude seems to remember details from earlier conversations. What do you do if you want to control that information?",
    options: [
      {
        id: "m5q9_a",
        label:
          "Review memory in the settings and edit or delete what you do not want",
      },
      {
        id: "m5q9_b",
        label: "Create a Project, because Projects erase the general memory",
      },
      {
        id: "m5q9_c",
        label:
          "Move your work to incognito chats, even if you want it to remember your tone",
      },
      {
        id: "m5q9_d",
        label:
          "Ask it to save everything, because with more memory it gives better answers",
      },
    ],
    correctAnswer: "m5q9_a",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 1 · Get to Know Claude: the AI That Works With You",
    feedback:
      "Memory is reviewed and adjusted in the settings: you decide what it should remember. Incognito is for a one-off chat you do not want kept in memory, not for all your work.",
  },
  {
    id: "m5q10",
    question:
      "You are going to upload to Claude a contract that contains clients' personal data. What is the most prudent step?",
    options: [
      {
        id: "m5q10_a",
        label: "Upload it in full, because it is an internal company document",
      },
      {
        id: "m5q10_b",
        label: "Upload it in full and delete the chat as soon as you finish",
      },
      {
        id: "m5q10_c",
        label:
          "Anonymize the personal data and share only the clauses you need",
      },
      {
        id: "m5q10_d",
        label:
          "Upload it in full and ask Claude not to take the names or phone numbers into account",
      },
    ],
    correctAnswer: "m5q10_c",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "Minimize the data you share: anonymize it or get authorization before uploading, and follow your organization's policy and the law (in Colombia, Law 1581 of 2012). Deleting the chat afterwards or asking it to ignore the names does not undo the fact that you already shared them.",
  },
  {
    id: "m5q11",
    question: "What is the difference between a Project and Claude's memory?",
    options: [
      {
        id: "m5q11_a",
        label:
          "The Project remembers your preferences in every chat; memory, only inside a single one",
      },
      {
        id: "m5q11_b",
        label:
          "The Project stores a job's rules and files; memory, details across chats",
      },
      {
        id: "m5q11_c",
        label: "None: both store the same thing, only where you see it changes",
      },
      {
        id: "m5q11_d",
        label:
          "Memory stores reference files; the Project, your preferred tone",
      },
    ],
    correctAnswer: "m5q11_b",
    topic: "Projects and memory",
    difficulty: "medium",
    source: "Lesson 1 · Get to Know Claude: the AI That Works With You",
    feedback:
      "The Project is the context of a specific job: instructions and files. Memory remembers preferences and useful details across conversations. For example, your brand goes in a Project and your tone preference, in memory.",
  },
  {
    id: "m5q12",
    question:
      "Claude offers you a fact with a citation to a study. What is the right step?",
    options: [
      {
        id: "m5q12_a",
        label: "Ask it for the study's link and cite it if Claude provides one",
      },
      {
        id: "m5q12_b",
        label: "Cite it if the author and journal sound famous",
      },
      {
        id: "m5q12_c",
        label:
          "Ask Claude if it is sure about the fact and cite it if it confirms",
      },
      {
        id: "m5q12_d",
        label: "Find the original study and confirm it says the same thing",
      },
    ],
    correctAnswer: "m5q12_d",
    topic: "Limits and errors",
    difficulty: "easy",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "A citation can look real and not exist or say something else; a link or a confirmation from Claude does not prove it. Always check the primary source.",
  },
  {
    id: "m5q13",
    question:
      "Which task is best suited to delegate to Claude with minimal review?",
    options: [
      {
        id: "m5q13_a",
        label: "Format a minutes template that you already approved",
      },
      {
        id: "m5q13_b",
        label: "Write and send the reply to a client's complaint",
      },
      {
        id: "m5q13_c",
        label: "Sort 200 client emails that include names and phone numbers",
      },
      {
        id: "m5q13_d",
        label: "Summarize a report with figures for the board",
      },
    ],
    correctAnswer: "m5q13_a",
    topic: "Delegating with Claude",
    difficulty: "easy",
    source: "Lesson 3 · Delegate with Claude: Projects, Connectors and Skills",
    feedback:
      "Form tasks with no underlying decision are ideal to delegate. Whatever goes to third parties, contains personal data or figures for decisions is delegated and reviewed.",
  },
];
