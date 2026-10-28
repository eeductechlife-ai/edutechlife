export const MODULE_3_EN_PART3 = [
  {
    id: "m3q29",
    question:
      "You need Gemini to answer with the agreements in the minutes you saved in your Drive. What do you do?",
    options: [
      {
        id: "m3q29_a",
        label: "Give it the minutes and ask it to answer from them",
      },
      {
        id: "m3q29_b",
        label: "Ask it to search the web for similar minutes",
      },
      {
        id: "m3q29_c",
        label: "Tell it from memory what the minutes say",
      },
      {
        id: "m3q29_d",
        label: "Ask it to answer with what it already knows",
      },
    ],
    correctAnswer: "m3q29_a",
    topic: "Grounding",
    difficulty: "medium",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Grounding can also use your own Workspace files. If the answer must come from the minutes, give them as the source: neither the web nor the model's memory knows that document. Check in your account how to attach Drive files.",
  },
  {
    id: "m3q30",
    question: "What is the best way to ask Gemini for a data analysis?",
    options: [
      {
        id: "m3q30_a",
        label: "State your data, your goal and the format",
      },
      {
        id: "m3q30_b",
        label: "Upload the file without saying what you need from it",
      },
      {
        id: "m3q30_c",
        label: "Say 'analyze this' and accept whatever it answers",
      },
      {
        id: "m3q30_d",
        label: "Request a conclusion without showing the underlying data",
      },
    ],
    correctAnswer: "m3q30_a",
    topic: "Analysis with Gemini",
    difficulty: "medium",
    source: "Gemini in Practice: Field Exercises",
    feedback:
      "Specify data, goal and format for a truly useful analysis. Review the field exercises.",
  },
  {
    id: "m3q31",
    question:
      "Gemini gives two different answers to the same research question. What do you do?",
    options: [
      {
        id: "m3q31_a",
        label: "Ask for a third answer and keep the one that repeats",
      },
      {
        id: "m3q31_b",
        label: "Contrast both with sources and decide afterwards",
      },
      {
        id: "m3q31_c",
        label: "Keep the one that cites more sources",
      },
      {
        id: "m3q31_d",
        label: "Ask Gemini to compare its answers and choose",
      },
    ],
    correctAnswer: "m3q31_b",
    topic: "Critical Thinking",
    difficulty: "hard",
    source:
      "Academic research with AI in minutes: Gemini and Deep Research without losing rigor",
    feedback:
      "Two different answers are contrasted with sources you open. Neither the one that repeats, nor the one that cites more, nor Gemini's choice proves which is right.",
  },
  {
    id: "m3q32",
    question:
      "You are about to upload internal company data to Gemini. What is most prudent?",
    options: [
      {
        id: "m3q32_a",
        label: "Review the data policy and anonymize anything confidential",
      },
      {
        id: "m3q32_b",
        label: "Upload everything without review because the tool is corporate",
      },
      {
        id: "m3q32_c",
        label: "Upload only what you cannot later delete from the history",
      },
      {
        id: "m3q32_d",
        label: "Share the system access credentials inside the chat",
      },
    ],
    correctAnswer: "m3q32_a",
    topic: "Privacy",
    difficulty: "medium",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Review the policy and anonymize before uploading internal data. Review the manual.",
  },
  {
    id: "m3q33",
    question: "What is Deep Research for, rather than a normal search?",
    options: [
      {
        id: "m3q33_a",
        label: "A topic with many sources and a cited report",
      },
      {
        id: "m3q33_b",
        label: "A quick question with a single answer",
      },
      {
        id: "m3q33_c",
        label: "Generating supporting images for the report",
      },
      {
        id: "m3q33_d",
        label: "Answering faster than any search",
      },
    ],
    correctAnswer: "m3q33_a",
    topic: "Deep Research",
    difficulty: "medium",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Deep Research gathers several sources and delivers a report with citations. A quick question is solved with a normal search.",
  },
  {
    id: "m3q34",
    question:
      "You want Gemini to analyze a sales chart you have on screen. What do you do?",
    options: [
      {
        id: "m3q34_a",
        label: "Upload a screenshot of the chart and ask for the analysis",
      },
      {
        id: "m3q34_b",
        label: "Describe the chart to it in my own words",
      },
      {
        id: "m3q34_c",
        label: "Copy only the chart's title and legend",
      },
      {
        id: "m3q34_d",
        label: "Dictate the figures I remember from the chart",
      },
    ],
    correctAnswer: "m3q34_a",
    topic: "Multimodality",
    difficulty: "easy",
    source:
      "Multimodal Gemini: your lens for images, documents, audio and video",
    feedback:
      "Gemini can read the chart image directly. Describing it, copying only the title or dictating figures from memory leaves out part of the evidence or adds your mistakes to it.",
  },
  {
    id: "m3q35",
    question: "Which rule must an academic work with Gemini support follow?",
    options: [
      {
        id: "m3q35_a",
        label: "Declaring the use and citing the sources you consulted",
      },
      {
        id: "m3q35_b",
        label: "Hiding that AI was used to avoid suspicion",
      },
      {
        id: "m3q35_c",
        label: "Not citing, because AI already summarizes everything",
      },
      {
        id: "m3q35_d",
        label: "Handing it in as it is, even if the teacher does not ask",
      },
    ],
    correctAnswer: "m3q35_a",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Declaring the use and citing the sources consulted is the honest rule. Hiding AI or not citing is not.",
  },
  {
    id: "m3q36",
    question:
      "When is it better for Gemini to check the web instead of answering from memory?",
    options: [
      {
        id: "m3q36_a",
        label: "When the question is a joke with no data",
      },
      {
        id: "m3q36_b",
        label: "When it depends on changing data, such as prices",
      },
      {
        id: "m3q36_c",
        label: "For every question, even one about a poem",
      },
      {
        id: "m3q36_d",
        label: "When the question is long and has several parts",
      },
    ],
    correctAnswer: "m3q36_b",
    topic: "Grounding",
    difficulty: "medium",
    source: "Gemini in Practice: Field Exercises",
    feedback:
      "Changing data needs current sources. A long question does not require it by itself, and a poem or a joke needs no web check.",
  },
  {
    id: "m3q37",
    question:
      "You must hand in a research report and Deep Research does not appear in your account. What do you do?",
    options: [
      {
        id: "m3q37_a",
        label: "Use the same request in the chat and verify each source",
      },
      {
        id: "m3q37_b",
        label: "Wait until I have Deep Research before starting",
      },
      {
        id: "m3q37_c",
        label: "Ask the chat for a report and submit it with its citations",
      },
      {
        id: "m3q37_d",
        label: "Ask another AI that does research for the report",
      },
    ],
    correctAnswer: "m3q37_a",
    topic: "Deep Research",
    difficulty: "hard",
    source: "Guide: Deep Research, step by step",
    feedback:
      "If Deep Research does not appear in your account, the same request works in the normal conversation; what does not change is your check of each source. Waiting or submitting citations you did not open does not solve the case. Review the Guide: Deep Research, step by step.",
  },
  {
    id: "m3q38",
    question: "What use of Gemini for planning a trip is most responsible?",
    options: [
      {
        id: "m3q38_a",
        label: "Booking without checking anything, only with Gemini's answer",
      },
      {
        id: "m3q38_b",
        label: "Sharing your passport so it can keep it",
      },
      {
        id: "m3q38_c",
        label: "Checking options and confirming prices on the official page",
      },
      {
        id: "m3q38_d",
        label: "Avoiding every other website forever",
      },
    ],
    correctAnswer: "m3q38_c",
    topic: "Source verification",
    difficulty: "easy",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Gemini helps compare options; the booking and your personal data are confirmed on the official site.",
  },
  {
    id: "m3q39",
    question: "What do you look at before citing an author in your report?",
    options: [
      {
        id: "m3q39_a",
        label: "That they are identifiable and the data is in their text",
      },
      {
        id: "m3q39_b",
        label: "That several blogs on the topic cite them",
      },
      {
        id: "m3q39_c",
        label: "That Gemini mentions them with a link",
      },
      {
        id: "m3q39_d",
        label: "That they hold a recognized post at an institution",
      },
    ],
    correctAnswer: "m3q39_a",
    topic: "Source Verification",
    difficulty: "hard",
    source: "Guide: Deep Research, step by step",
    feedback:
      "To cite, you need to know who the author is and find the data in their own text. Being cited by blogs, linked by Gemini or holding a post does not prove the data is theirs.",
  },
  {
    id: "m3q40",
    question:
      "Case: a report with data on a recent topic. What do you verify before handing it in?",
    options: [
      {
        id: "m3q40_a",
        label: "That each figure has a source cited by Gemini",
      },
      {
        id: "m3q40_b",
        label: "That each figure has a source you opened and its date",
      },
      {
        id: "m3q40_c",
        label: "That the figures match a classmate's report",
      },
      {
        id: "m3q40_d",
        label: "That the sources are from the last five years",
      },
    ],
    correctAnswer: "m3q40_b",
    topic: "Professional Research",
    difficulty: "hard",
    source:
      "Academic research with AI in minutes: Gemini and Deep Research without losing rigor",
    feedback:
      "On a recent topic, each figure needs a source you opened and its date. An unopened Gemini citation, a classmate's report or a range of years does not confirm the figure is correct and current.",
  },
];
