export const MODULE_1_EN_PART2 = [
  {
    id: "m1q15",
    question:
      "The AI states data with confidence even when it is false. What is this phenomenon called?",
    options: [
      {
        id: "m1q15_a",
        label:
          "Hallucination: it generates information that looks true but is not",
      },
      {
        id: "m1q15_b",
        label:
          "Automatic translation: it changes the language without checking meaning",
      },
      {
        id: "m1q15_c",
        label:
          "Data compression: it reduces file size so they are easier to send",
      },
      {
        id: "m1q15_d",
        label: "Real-time update: it checks the internet and shows live data",
      },
    ],
    correctAnswer: "m1q15_a",
    topic: "AI Limits",
    difficulty: "medium",
    source: "What is AI and how it is changing the world",
    feedback:
      "Hallucinations are plausible but incorrect answers. Always verify critical data.",
  },
  {
    id: "m1q16",
    question: "What should you know about recent data an AI gives you?",
    options: [
      {
        id: "m1q16_a",
        label: "It may be outdated: ask for sources and dates",
      },
      {
        id: "m1q16_b",
        label: "It always includes the latest events in the world",
      },
      {
        id: "m1q16_c",
        label: "It updates itself every minute",
      },
      {
        id: "m1q16_d",
        label: "It only describes what happened ten years ago, with no sources",
      },
    ],
    correctAnswer: "m1q16_a",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "The Chisel",
    feedback:
      "A model may not have the most recent information. For current data, ask for dated sources and verify them.",
  },
  {
    id: "m1q17",
    question: "What should you do when the task is very large?",
    options: [
      {
        id: "m1q17_a",
        label: "Split it into steps and review each part",
      },
      {
        id: "m1q17_b",
        label: "Ask for it all at once, with no pauses",
      },
      {
        id: "m1q17_c",
        label: "Ask it to decide when to stop",
      },
      {
        id: "m1q17_d",
        label: "Write it in capitals so it does not get lost",
      },
    ],
    correctAnswer: "m1q17_a",
    topic: "Prompt Fundamentals",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Splitting into steps reduces errors and lets you review each part. Review the Prompt Anatomy guide.",
  },
  {
    id: "m1q18",
    question:
      "The Guardian's Oath proposes three questions for every AI result: is it true?, is it fair?, do I disclose it? When can you use the result?",
    options: [
      {
        id: "m1q18_a",
        label: "When all three get a yes: it is true, fair and disclosed",
      },
      {
        id: "m1q18_b",
        label: "When it is true; being fair and disclosing it are optional",
      },
      {
        id: "m1q18_c",
        label: "When at least two of the three questions get a yes",
      },
      {
        id: "m1q18_d",
        label: "When you disclose it, because then the AI is responsible",
      },
    ],
    correctAnswer: "m1q18_a",
    topic: "The Guardian's Three Questions",
    difficulty: "medium",
    source: "PDF: Ethics of Artificial Intelligence",
    feedback:
      "The three questions go together: a result that is true but unfair, or fair but undisclosed, is not ready yet. Disclosing your use does not shift responsibility to the AI: a person still answers for the final decision. Review the ethics guide.",
  },
  {
    id: "m1q19",
    question:
      "You pasted a customer list and a password into an AI chat by mistake. What do you do?",
    options: [
      {
        id: "m1q19_a",
        label: "I stay in that chat and ask the AI to forget it",
      },
      {
        id: "m1q19_b",
        label: "I delete only my last message and keep using that chat",
      },
      {
        id: "m1q19_c",
        label:
          "I stop pasting data, delete the chat if possible, change the password and tell the person in charge",
      },
      {
        id: "m1q19_d",
        label: "I change the password but tell no one, since it was my mistake",
      },
    ],
    correctAnswer: "m1q19_c",
    topic: "If You Already Shared Sensitive Data",
    difficulty: "easy",
    source: "AI Privacy Manual",
    feedback:
      'If you already shared something sensitive, act fast and in order: stop pasting information, delete the conversation if the tool allows it, change the passwords and tell the person in charge of data if it belongs to others. Asking the AI to forget it or keeping quiet protects no one. Review the "AI Privacy Manual".',
  },
  {
    id: "m1q20",
    question:
      "You need the answer in a table. What should you state in the prompt?",
    options: [
      {
        id: "m1q20_a",
        label: "The output format: a table with columns",
      },
      {
        id: "m1q20_b",
        label: "That it should respond as fast as possible",
      },
      {
        id: "m1q20_c",
        label: "Only the first letter of each idea",
      },
      {
        id: "m1q20_d",
        label: "That it should not use numbers or details",
      },
    ],
    correctAnswer: "m1q20_a",
    topic: "Output Format",
    difficulty: "medium",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Stating the format (table, bullets or list) makes the AI deliver the answer in the shape you need.",
  },
  {
    id: "m1q21",
    question:
      "You need a three-line answer for a mobile chat. What should you specify?",
    options: [
      {
        id: "m1q21_a",
        label: "The maximum length: three lines",
      },
      {
        id: "m1q21_b",
        label: "A warm tone, like in a chat",
      },
      {
        id: "m1q21_c",
        label: "That it answers in a table for easier reading",
      },
      {
        id: "m1q21_d",
        label: "That the AI decides how much to write",
      },
    ],
    correctAnswer: "m1q21_a",
    topic: "Length",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "Stating the length (three lines) avoids long answers that do not fit the chat. Tone or a table do not control how much the AI writes.",
  },
  {
    id: "m1q22",
    question:
      "What happens if you paste a list of customer names and phone numbers into the chat?",
    options: [
      {
        id: "m1q22_a",
        label: "AI deletes it instantly, leaving no trace",
      },
      {
        id: "m1q22_b",
        label: "Nothing: the chat is private and only you see it",
      },
      {
        id: "m1q22_c",
        label: "AI uses it to improve your course score",
      },
      {
        id: "m1q22_d",
        label: "That data leaves your control and may stay stored",
      },
    ],
    correctAnswer: "m1q22_d",
    topic: "Privacy",
    difficulty: "easy",
    source: "Guide: Anatomy of a Prompt",
    feedback:
      "Personal data pasted into a tool leaves your control and may be stored. That is why you anonymize it before sharing.",
  },
  {
    id: "m1q23",
    question:
      "A teacher wants AI to help with report card comments. How does she prepare the list before pasting it?",
    options: [
      {
        id: "m1q23_a",
        label:
          'She changes names to "Student A, B, C" and removes school and ID',
      },
      {
        id: "m1q23_b",
        label:
          "She keeps the names but removes the grades so they are not exposed",
      },
      {
        id: "m1q23_c",
        label: "She uses each student's initials and keeps the school",
      },
      {
        id: "m1q23_d",
        label: "She pastes the full list and asks the AI not to store it",
      },
    ],
    correctAnswer: "m1q23_a",
    topic: "Anonymizing",
    difficulty: "easy",
    source: "AI Privacy Manual",
    feedback:
      'Replacing people with roles and removing school and ID lets the AI help with the format without knowing anyone. Initials plus the school can still identify a student, and asking the AI not to store the list does not give you back control of that data. Review the "AI Privacy Manual".',
  },
  {
    id: "m1q24",
    question:
      "You are about to use an AI tool for the first time. What is a good first step to protect your privacy?",
    options: [
      {
        id: "m1q24_a",
        label: "Create a strong password and assume your chats are private",
      },
      {
        id: "m1q24_b",
        label: "Assume that, if it is free, the tool stores nothing",
      },
      {
        id: "m1q24_c",
        label:
          "Check in the settings whether your chats are used to improve the service",
      },
      {
        id: "m1q24_d",
        label: "Try it by pasting your real data to see how it answers",
      },
    ],
    correctAnswer: "m1q24_c",
    topic: "Privacy Settings",
    difficulty: "medium",
    source: "AI Privacy Manual",
    feedback:
      'Often you do not know whether what you write is used to improve the service. Checking the settings and turning it off if you can is the first step the "AI Privacy Manual" suggests. A password protects your account, but it does not decide what happens to what you write.',
  },
  {
    id: "m1q25",
    question:
      "You are going to publish an article made with AI help on the school blog, and it uses ideas from other authors. In Colombia, Law 23 of 1982 protects their works. What do you do?",
    options: [
      {
        id: "m1q25_a",
        label:
          "I cite the sources, copy no protected text and declare the AI help",
      },
      {
        id: "m1q25_b",
        label: "I copy the excerpts, since the AI already reworded them",
      },
      {
        id: "m1q25_c",
        label:
          "I publish without citing, since what AI generates has no author",
      },
      {
        id: "m1q25_d",
        label: "I cite only famous authors; the others need no credit",
      },
    ],
    correctAnswer: "m1q25_a",
    topic: "Intellectual Property",
    difficulty: "easy",
    source: "PDF: Ethics of Artificial Intelligence",
    feedback:
      "Law 23 of 1982 protects authors' works, and using AI gives you no rights over them. That is why you cite the sources, do not copy protected texts and declare what you generated with AI when you publish it. Review the ethics guide, section 6.",
  },
  {
    id: "m1q26",
    question:
      "In the RTF formula, which part states the concrete action the AI must take?",
    options: [
      {
        id: "m1q26_a",
        label: "The color of the screen where the answer is read",
      },
      {
        id: "m1q26_b",
        label: "The task",
      },
      {
        id: "m1q26_c",
        label: "The user's purchase history",
      },
      {
        id: "m1q26_d",
        label: "The speed of the server answering",
      },
    ],
    correctAnswer: "m1q26_b",
    topic: "Avoiding Ambiguity",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "In RTF, the task is the concrete action. The other options are not part of the prompt.",
  },
  {
    id: "m1q27",
    question:
      "A 12-year-old student wants to upload photos and names of classmates to an AI for a project. Which rule applies?",
    options: [
      {
        id: "m1q27_a",
        label:
          "With children or teenagers, a responsible adult decides what is shared",
      },
      {
        id: "m1q27_b",
        label: "It is enough that the classmates say yes",
      },
      {
        id: "m1q27_c",
        label: "They can upload them if the tool is educational and free",
      },
      {
        id: "m1q27_d",
        label: "They can upload them if they delete them after the project",
      },
    ],
    correctAnswer: "m1q27_a",
    topic: "Minors",
    difficulty: "medium",
    source: "AI Privacy Manual",
    feedback:
      "With minors, a responsible adult decides what is shared, chooses the tools and supervises their use; the law restricts the processing of children's and teenagers' data. The classmates' yes, an educational tool or deleting afterwards does not change that rule. Review the \"AI Privacy Manual\".",
  },
  {
    id: "m1q28",
    question:
      "You are writing to a client and want a warm tone. What do you ask for?",
    options: [
      {
        id: "m1q28_a",
        label: "An academic bibliography tone, with citations",
      },
      {
        id: "m1q28_b",
        label: "The most technical answer possible",
      },
      {
        id: "m1q28_c",
        label: "A warm tone, no jargon and a short closing",
      },
      {
        id: "m1q28_d",
        label: "That it sounds like a lawyer, with no friendly phrase",
      },
    ],
    correctAnswer: "m1q28_c",
    topic: "RTF Application",
    difficulty: "medium",
    source: "The Chisel",
    feedback:
      "Tone is requested with concrete words: warm, no jargon, short closing. Academic or technical language does not suit a client.",
  },
];
