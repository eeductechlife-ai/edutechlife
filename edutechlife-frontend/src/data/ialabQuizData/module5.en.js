// Banco del módulo 5 (Claude), en inglés: mismo contenido, ids, orden de opciones y correctAnswer que module5.js.
// La correcta nunca es la opción más larga ni la más corta. La clave vive en src/data/ialab.js.
export const MODULE_5_EN = [
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
    source: "Lesson 1: Get to know Claude",
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
    source: "Lesson 2: Create with Claude",
    feedback:
      "An Artifact is a piece (document, table or small app) that lives next to the chat: you see it, improve it step by step and export it. Fixed instructions go in a Project, preferences in memory and access to your apps in connectors.",
  },
  {
    id: "m5q3",
    question:
      "Claude gives you a table with sales figures. What do you do before presenting it to the team?",
    options: [
      {
        id: "m5q3_a",
        label: "Ask Claude to check its own figures and trust its answer",
      },
      {
        id: "m5q3_b",
        label:
          "Compare each figure with the original source and redo one calculation",
      },
      {
        id: "m5q3_c",
        label:
          "Check spelling and format, since the figures come from the file",
      },
      {
        id: "m5q3_d",
        label:
          "Ask it to add the source for each figure and present the table like that",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Oversight",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Claude can get figures wrong and still sound sure, even when it checks itself. Citing a source is not checking it: compare with the original data before presenting.",
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
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A Project stores the instructions and files for a specific job that repeats, so you do not repeat them in every chat. Mixing topics or uploading extra files gives it useless context and can expose data.",
  },
  {
    id: "m5q5",
    question:
      "You want Claude to read your correo to prepare a reply to a client. What do you do?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Connect only correo, check its permissions and approve the reply yourself",
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
        label: "Connect correo and let Claude send the reply",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "With a connector you give access only to what the task needs and you approve its permissions. You can disconnect it when you finish, and you review and send the reply yourself.",
  },
  {
    id: "m5q6",
    question: "What is the difference between a Skill and a Project?",
    options: [
      {
        id: "m5q6_a",
        label:
          "A Skill keeps the files of a job; a Project keeps the steps of a procedure",
      },
      {
        id: "m5q6_b",
        label:
          "A Skill keeps the conversations of a job; a Project keeps your tone and preferences",
      },
      {
        id: "m5q6_c",
        label:
          "A Skill keeps a procedure with steps and templates; a Project, the context of a job",
      },
      {
        id: "m5q6_d",
        label:
          "They are the same thing with another name: both keep instructions and files for one job",
      },
    ],
    correctAnswer: "m5q6_c",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A Skill stores a procedure you always do the same way: steps, templates and examples. A Project stores the context of a job that repeats, with its instructions and files. Connectors give access to your apps.",
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
        label: "Use an incognito chat so Claude always starts clean",
      },
      {
        id: "m5q7_d",
        label: "Create a new Project every Monday with the same steps",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegating with Claude",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A procedure you always do the same way is saved as a Skill: Claude applies the same steps each time and you only review the result. Incognito does not keep the procedure for the following week, and creating a Project every week repeats the work.",
  },
  {
    id: "m5q8",
    question: "What does 'delegating with judgment' to Claude mean?",
    options: [
      {
        id: "m5q8_a",
        label: "Delegate only easy tasks and do the important ones yourself",
      },
      {
        id: "m5q8_b",
        label:
          "Delegate everything Claude does well and review only if something fails",
      },
      {
        id: "m5q8_c",
        label:
          "Hand over the task and the decision if the request has all five parts",
      },
      {
        id: "m5q8_d",
        label:
          "Hand over the draft, review what goes out and keep the decision",
      },
    ],
    correctAnswer: "m5q8_d",
    topic: "Delegating with Claude",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Delegating is not walking away: you hand over the form and the draft, review what goes to third parties and keep the decision. A good request improves the result, but it does not transfer responsibility.",
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
          "Always write in incognito, even if you need it to remember your tone",
      },
      {
        id: "m5q9_d",
        label:
          "Ask it to save everything, because more memory always gives better answers in every chat",
      },
    ],
    correctAnswer: "m5q9_a",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
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
    source: "Lesson 3: Delegate with Claude",
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
    source: "Lesson 1: Get to know Claude",
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
    source: "Lesson 3: Delegate with Claude",
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
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Form tasks with no underlying decision are ideal to delegate. Whatever goes to third parties, contains personal data or figures for decisions is delegated and reviewed.",
  },
  {
    id: "m5q14",
    question:
      "You want Claude to create a presentation for your board. What do you provide first?",
    options: [
      {
        id: "m5q14_a",
        label: "The topic and the number of slides; Claude decides the message",
      },
      {
        id: "m5q14_b",
        label: "The quarter's figures so Claude chooses what to highlight",
      },
      {
        id: "m5q14_c",
        label:
          "The main message, who will see it, the checked figures and the length",
      },
      {
        id: "m5q14_d",
        label:
          "A previous presentation from another company so it copies the design and the content",
      },
    ],
    correctAnswer: "m5q14_c",
    topic: "Creating with Claude",
    difficulty: "medium",
    source: "Lesson 2: Create with Claude",
    feedback:
      "A good presentation starts with the message and the audience. If Claude chooses what to highlight, the decision is its own, not yours; and the figures are checked before they go on a slide.",
  },
  {
    id: "m5q15",
    question:
      "Claude made a change to a document you had already edited. What should you do?",
    options: [
      {
        id: "m5q15_a",
        label:
          "Accept the new version, because every change improves the last one",
      },
      {
        id: "m5q15_b",
        label: "Compare it with the previous version and keep what improves",
      },
      {
        id: "m5q15_c",
        label: "Ask it to redo everything from scratch with a longer request",
      },
      {
        id: "m5q15_d",
        label: "Go back to your version without checking what changed",
      },
    ],
    correctAnswer: "m5q15_b",
    topic: "Creating with Claude",
    difficulty: "medium",
    source: "Lesson 2: Create with Claude",
    feedback:
      "Each change leaves a different version: compare before and after and decide what stays. Starting over or discarding without looking wastes what already worked.",
  },
  {
    id: "m5q16",
    question:
      "The text Claude wrote is almost right, but the tone came out too formal. What do you do?",
    options: [
      {
        id: "m5q16_a",
        label: "Ask again for the whole document from scratch",
      },
      {
        id: "m5q16_b",
        label: "Ask for one small, specific change to the tone",
      },
      {
        id: "m5q16_c",
        label: "Accept it as it is to save time",
      },
      {
        id: "m5q16_d",
        label: "Switch models and hope for a different result",
      },
    ],
    correctAnswer: "m5q16_b",
    topic: "Limits and errors",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "A small, specific change improves the result without redoing what already works. Starting over or accepting a tone you do not want are the common mistakes.",
  },
  {
    id: "m5q17",
    question:
      "What is the best practice when writing a Project's instructions?",
    options: [
      {
        id: "m5q17_a",
        label: "State Claude's role, purpose, tone and what it must never do",
      },
      {
        id: "m5q17_b",
        label: "Paste the company's full manual instead of instructions",
      },
      {
        id: "m5q17_c",
        label:
          "Write only the tone, because Claude infers the rest from the files you upload",
      },
      {
        id: "m5q17_d",
        label: "Include the clients' phone numbers to personalize each reply",
      },
    ],
    correctAnswer: "m5q17_a",
    topic: "Projects and memory",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A Project's instructions say who Claude is, what it is for, how it sounds and what it must never do. Files complement them, and personal data is not uploaded without authorization.",
  },
  {
    id: "m5q18",
    question:
      "A colleague asks you for a report made with Claude that contains confidential company data. What do you do?",
    options: [
      {
        id: "m5q18_a",
        label:
          "Publish it with an open link, because only my colleague will have it",
      },
      {
        id: "m5q18_b",
        label:
          "Share it in full, because an AI made it and it is not an official document",
      },
      {
        id: "m5q18_c",
        label: "Check whether they may see it and share only what is allowed",
      },
      {
        id: "m5q18_d",
        label: "Ask Claude for a summary and send it without reviewing it",
      },
    ],
    correctAnswer: "m5q18_c",
    topic: "Privacy and data",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A tool generating a document does not change how confidential it is. Anyone who receives an open link can see it: share only what the policy allows and only with the right people.",
  },
  {
    id: "m5q19",
    question:
      "You need a decision that only you can make, such as approving a proposal. What does the AI do?",
    options: [
      {
        id: "m5q19_a",
        label: "It approves it, because it already has all the data",
      },
      {
        id: "m5q19_b",
        label:
          "It prepares the options and the risks; the final decision is yours",
      },
      {
        id: "m5q19_c",
        label: "It delegates it entirely to save time",
      },
      {
        id: "m5q19_d",
        label: "It records it as approved in your name",
      },
    ],
    correctAnswer: "m5q19_b",
    topic: "Delegating with Claude",
    difficulty: "hard",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "AI speeds up the preparation, but a decision with consequences stays yours. Delegating the approval is the mistake.",
  },
  {
    id: "m5q20",
    question:
      "Claude compared the résumés for a job opening and recommends one candidate. What do you do with that recommendation?",
    options: [
      {
        id: "m5q20_a",
        label:
          "Hire her if the analysis quotes the data from each résumé correctly",
      },
      {
        id: "m5q20_b",
        label: "Ask Claude to confirm its choice and then follow it",
      },
      {
        id: "m5q20_c",
        label: "Accept it, because the request had all five parts",
      },
      {
        id: "m5q20_d",
        label: "Review the analysis as input and decide yourself whom to hire",
      },
    ],
    correctAnswer: "m5q20_d",
    topic: "Oversight",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Choosing whom to hire is a decision about a person: that decision is not delegated. Claude can sort and compare; you review the analysis and decide. Neither a confirmation from Claude nor a good request transfers the responsibility.",
  },
  {
    id: "m5q21",
    question:
      "You are going to ask Claude for a report with a group's average grades. What do you share?",
    options: [
      {
        id: "m5q21_a",
        label: "Full names and grades, so the report is accurate",
      },
      {
        id: "m5q21_b",
        label: "Only the group averages, with no names or identifiable data",
      },
      {
        id: "m5q21_c",
        label: "The list with phone numbers, to contact families later",
      },
      {
        id: "m5q21_d",
        label: "The full file, in an incognito chat so it is not saved",
      },
    ],
    correctAnswer: "m5q21_b",
    topic: "Privacy and data",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Group averages allow the analysis without identifying anyone. Personal data about minors is not shared with an AI tool (Colombian Law 1581 of 2012).",
  },
  {
    id: "m5q22",
    question:
      "You need a six-page document that you will edit several times. Where do you ask for it?",
    options: [
      {
        id: "m5q22_a",
        label: "In one long message, pasting the document into every reply",
      },
      {
        id: "m5q22_b",
        label: "In an Artifact, to view and edit it beside the chat",
      },
      {
        id: "m5q22_c",
        label: "In an incognito chat, so it is not saved",
      },
      {
        id: "m5q22_d",
        label: "In a short message, then copy the text by hand",
      },
    ],
    correctAnswer: "m5q22_b",
    topic: "Limits and errors",
    difficulty: "medium",
    source: "Lesson 1: Get to know Claude",
    feedback:
      "An Artifact is a piece that lives beside the chat: you view it, edit it and download it without losing the thread of the conversation.",
  },
  {
    id: "m5q23",
    question: "Which of these is a good way to create an interactive Artifact?",
    options: [
      {
        id: "m5q23_a",
        label:
          "Ask for every feature in one very long message so you never have to iterate",
      },
      {
        id: "m5q23_b",
        label:
          "Say what it is for, what data it takes and what it shows; then iterate",
      },
      {
        id: "m5q23_c",
        label: "Ask for 'an interactive app' and let Claude choose the rest",
      },
      {
        id: "m5q23_d",
        label: "Share it with the team as soon as it appears and fix it later",
      },
    ],
    correctAnswer: "m5q23_b",
    topic: "Creating with Claude",
    difficulty: "medium",
    source: "Lesson 2: Create with Claude",
    feedback:
      "Describe the use, the input data and the result, improve it with small changes and test the piece before sharing it.",
  },
  {
    id: "m5q24",
    question:
      "Claude wrote a technical report and you need it for families. What do you ask for?",
    options: [
      {
        id: "m5q24_a",
        label: "That it shorten it and nothing more, keeping the same language",
      },
      {
        id: "m5q24_b",
        label:
          "That it rewrite it for families: plain language, no acronyms, clear actions",
      },
      {
        id: "m5q24_c",
        label: "That it translate it into English to review it better",
      },
      {
        id: "m5q24_d",
        label:
          "That you send it as it is, because the family must understand it",
      },
    ],
    correctAnswer: "m5q24_b",
    topic: "Oversight",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Adapting a text to its audience changes the language, not only the length. A request with a clear audience and tone gives better results.",
  },
  {
    id: "m5q25",
    question:
      "You will use the same instructions in several chats of one job. Where do you leave them?",
    options: [
      {
        id: "m5q25_a",
        label: "Pasted into each new chat, one by one",
      },
      {
        id: "m5q25_b",
        label: "In a Project, so all its chats use them",
      },
      {
        id: "m5q25_c",
        label: "In an Artifact shared with all the chats",
      },
      {
        id: "m5q25_d",
        label: "In a separate chat that nobody else can see",
      },
    ],
    correctAnswer: "m5q25_b",
    topic: "Connectors and Skills",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "A Project stores instructions and files that apply to all its chats. Pasting them each time repeats work, and it is easy to forget one.",
  },
  {
    id: "m5q26",
    question:
      "You have the case of a student with special needs. What do you do?",
    options: [
      {
        id: "m5q26_a",
        label: "I ask Claude for the decision and apply it",
      },
      {
        id: "m5q26_b",
        label: "I decide with the team; AI only helps to write",
      },
      {
        id: "m5q26_c",
        label: "I send Claude the full name so it can review it",
      },
      {
        id: "m5q26_d",
        label: "I leave it to AI, because it is more objective",
      },
    ],
    correctAnswer: "m5q26_b",
    topic: "Delegating with Claude",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Decisions about people, and especially about minors, are human. AI can help write, but not decide or receive identifiable data.",
  },
  {
    id: "m5q27",
    question:
      "You want Claude to analyze a large data file. What do you do to get a reliable result?",
    options: [
      {
        id: "m5q27_a",
        label: "Ask directly for the final conclusion to save time",
      },
      {
        id: "m5q27_b",
        label: "Ask for the analysis steps and check a sample by hand",
      },
      {
        id: "m5q27_c",
        label: "Ask Claude to confirm the result twice",
      },
      {
        id: "m5q27_d",
        label: "Ask for a chart: if it looks consistent, the data is right",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Limits and errors",
    difficulty: "hard",
    source: "Lesson 2: Create with Claude",
    feedback:
      "Ask for the method and check a sample with an independent calculation. Claude confirming or a chart looking good does not prove the data is right.",
  },
  {
    id: "m5q28",
    question:
      "Claude drafted a report for a client and you reviewed and adjusted it. What do you do about the use of AI when you deliver it?",
    options: [
      {
        id: "m5q28_a",
        label:
          "Nothing: I reviewed and adjusted it, so the report is now only mine",
      },
      {
        id: "m5q28_b",
        label: "I mention it only if the client asks how it was made",
      },
      {
        id: "m5q28_c",
        label: "I credit Claude as author, since it wrote most of it",
      },
      {
        id: "m5q28_d",
        label: "I disclose how I used AI and who answers for the content",
      },
    ],
    correctAnswer: "m5q28_d",
    topic: "Delegating with Claude",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Disclosing your use of AI is part of delivering honestly: you say what it helped with and who reviewed and answers for the result. Reviewing it does not erase that you used AI, and responsibility belongs to a person, not to the tool.",
  },
  {
    id: "m5q29",
    question:
      "You want Claude to remember a preference in all your work chats. What do you do?",
    options: [
      {
        id: "m5q29_a",
        label: "You write it in each new chat so it is not forgotten",
      },
      {
        id: "m5q29_b",
        label:
          "You put it in the Project instructions and review what Claude remembers",
      },
      {
        id: "m5q29_c",
        label: "You ask it to keep it in an incognito chat",
      },
      {
        id: "m5q29_d",
        label:
          "You wait: Claude learns your preferences by itself, without control",
      },
    ],
    correctAnswer: "m5q29_b",
    topic: "Privacy and data",
    difficulty: "easy",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "Project instructions apply to all its chats, and memory can be reviewed and controlled. An incognito chat does not help Claude remember anything.",
  },
  {
    id: "m5q30",
    question:
      "When you finish a project with Claude, which practice leaves a better base for the next one?",
    options: [
      {
        id: "m5q30_a",
        label: "Delete the Project to start the next one without context",
      },
      {
        id: "m5q30_b",
        label: "Leave everything in memory so Claude remembers it on its own",
      },
      {
        id: "m5q30_c",
        label:
          "Save instructions, examples and lessons learned in a Project or Skill",
      },
      {
        id: "m5q30_d",
        label:
          "Keep the full chat history and reread all of it the next time you start",
      },
    ],
    correctAnswer: "m5q30_c",
    topic: "Projects and memory",
    difficulty: "medium",
    source: "Lesson 3: Delegate with Claude",
    feedback:
      "What works should be saved in a Project or a Skill: that way every new job starts from what you learned, without rereading chats or relying on what memory keeps.",
  },
];
