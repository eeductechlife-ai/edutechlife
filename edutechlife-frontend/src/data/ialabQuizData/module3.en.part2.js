export const MODULE_3_EN_PART2 = [
  {
    id: "m3q15",
    question:
      "Gemini gives you a Deep Research report. What do you check before using it?",
    options: [
      {
        id: "m3q15_a",
        label: "Only that it has many pages and headings",
      },
      {
        id: "m3q15_b",
        label: "That the tone is enthusiastic and confident",
      },
      {
        id: "m3q15_c",
        label: "That it looks like another report you read",
      },
      {
        id: "m3q15_d",
        label: "The sources: open at least three that support the conclusions",
      },
    ],
    correctAnswer: "m3q15_d",
    topic: "Deep Research",
    difficulty: "easy",
    source:
      "Academic research with AI in minutes: Gemini and Deep Research without losing rigor",
    feedback:
      "A report with sources is checked by opening some of them. Three sources that back the conclusions are the minimum criterion.",
  },
  {
    id: "m3q16",
    question:
      "You want a useful Deep Research report. Which prompt helps most to get one?",
    options: [
      {
        id: "m3q16_a",
        label: "State the topic, the angle and the source type",
      },
      {
        id: "m3q16_b",
        label: "Write just a single word and wait",
      },
      {
        id: "m3q16_c",
        label: "Ask it to search with no limits on topic or on sources",
      },
      {
        id: "m3q16_d",
        label: "Request a summary without asking for sources or hard data",
      },
    ],
    correctAnswer: "m3q16_a",
    topic: "Deep Research",
    difficulty: "medium",
    source: "Guide: Deep Research, step by step",
    feedback:
      "Defining topic, angle and source type improves the report. Review the Guide: Deep Research, step by step.",
  },
  {
    id: "m3q17",
    question:
      "What does it mean to verify a figure with an independent source?",
    options: [
      {
        id: "m3q17_a",
        label: "Checking it in a source that did not copy it from the first",
      },
      {
        id: "m3q17_b",
        label: "Asking the same question to the same AI",
      },
      {
        id: "m3q17_c",
        label: "Searching in one site by the same author",
      },
      {
        id: "m3q17_d",
        label: "Using three different browsers without reading anything",
      },
    ],
    correctAnswer: "m3q17_a",
    topic: "Source Verification",
    difficulty: "medium",
    source: "Gemini in Practice: Field Exercises",
    feedback:
      "An independent source does not copy the first one. When two different sources agree, the figure is firmer.",
  },
  {
    id: "m3q18",
    question:
      "You have a photo of the whiteboard, the class audio and your notes. How do you work with Gemini?",
    options: [
      {
        id: "m3q18_a",
        label:
          "Upload all three and ask for an analysis that cross-checks them",
      },
      {
        id: "m3q18_b",
        label: "Ask for a summary of each one in separate chats",
      },
      {
        id: "m3q18_c",
        label: "Upload only the notes, since they are the clearest",
      },
      {
        id: "m3q18_d",
        label: "Type everything by hand and upload only the text",
      },
    ],
    correctAnswer: "m3q18_a",
    topic: "Multimodality",
    difficulty: "medium",
    source: "Testing the Magnifying Glass",
    feedback:
      "Gemini can analyze image, audio and text in a single request. Cross-checking them shows what is missing from your notes or what does not match. Practice in the activity Testing the Magnifying Glass.",
  },
  {
    id: "m3q19",
    question:
      "Someone shows you a meeting video. What do you ask Gemini to find an agreement?",
    options: [
      {
        id: "m3q19_a",
        label: "That it publishes it automatically online",
      },
      {
        id: "m3q19_b",
        label: "The exact minute where the agreement is stated",
      },
      {
        id: "m3q19_c",
        label: "That it answers for you in the meeting",
      },
      {
        id: "m3q19_d",
        label: "A general summary, with no indication of where each thing is",
      },
    ],
    correctAnswer: "m3q19_b",
    topic: "Video and audio with Gemini",
    difficulty: "medium",
    source: "The Multimodal Lens",
    feedback:
      "Asking for the exact minute lets you review that moment in the video. A summary with no location cannot be checked.",
  },
  {
    id: "m3q20",
    question:
      "You have a photo of a product label and want to know whether its price today in online stores is reasonable. Which request is best?",
    options: [
      {
        id: "m3q20_a",
        label: "Read the label, search today's prices and cite each store",
      },
      {
        id: "m3q20_b",
        label: "Read the label and estimate the price from what you know",
      },
      {
        id: "m3q20_c",
        label: "Search the web for the average price of this kind of product",
      },
      {
        id: "m3q20_d",
        label: "Describe the label and tell me if the price seems good",
      },
    ],
    correctAnswer: "m3q20_a",
    topic: "Grounding",
    difficulty: "hard",
    source: "Grounding: Answers You Can Check",
    feedback:
      "This case combines both pieces: the image identifies the exact product and the search brings current prices with their source. Estimating from memory or searching a generic average leaves one of them out.",
  },
  {
    id: "m3q21",
    question: "What should you check when Gemini drafts in Docs for you?",
    options: [
      {
        id: "m3q21_a",
        label: "Nothing: what AI writes is always correct",
      },
      {
        id: "m3q21_b",
        label: "Only the spelling, without checking the figures",
      },
      {
        id: "m3q21_c",
        label: "That the data and names match your sources",
      },
      {
        id: "m3q21_d",
        label: "That it uses many technical words",
      },
    ],
    correctAnswer: "m3q21_c",
    topic: "Google Workspace",
    difficulty: "easy",
    source: "The Multimodal Lens",
    feedback:
      "What AI drafts can also contain errors in data and names. Check it against your sources.",
  },
  {
    id: "m3q22",
    question:
      "A formula in your Sheets spreadsheet gives an odd result. What do you ask Gemini?",
    options: [
      {
        id: "m3q22_a",
        label: "To explain it step by step, and I test it with a case",
      },
      {
        id: "m3q22_b",
        label: "To write another formula to replace the current one",
      },
      {
        id: "m3q22_c",
        label: "To tell me whether the formula is right or wrong",
      },
      {
        id: "m3q22_d",
        label: "To delete the column that gives the odd result",
      },
    ],
    correctAnswer: "m3q22_a",
    topic: "Analysis with Gemini",
    difficulty: "medium",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Understanding each step of the formula shows where the error is, and testing it with a case whose result you know confirms it. A yes or no, or a new formula you do not understand, does not tell you what failed.",
  },
  {
    id: "m3q23",
    question:
      "Gemini, with web search, gives you a scholarship's requirements and cites its official page. When you open it, you see it is last year's call. What do you do?",
    options: [
      {
        id: "m3q23_a",
        label: "Find the current call and compare the requirements",
      },
      {
        id: "m3q23_b",
        label: "Use the requirements, since the page is official",
      },
      {
        id: "m3q23_c",
        label: "Ask Gemini to confirm they are still current",
      },
      {
        id: "m3q23_d",
        label: "Use them and note that they come from Gemini",
      },
    ],
    correctAnswer: "m3q23_a",
    topic: "Grounding",
    difficulty: "medium",
    source: "Gemini in Practice: Field Exercises",
    feedback:
      "Grounding can also be wrong: an official page can be outdated. Find the current call and compare before using the requirements.",
  },
  {
    id: "m3q24",
    question:
      "You will use Gemini to solve a problem that requires careful multi-step reasoning. What do you adjust in the selector?",
    options: [
      {
        id: "m3q24_a",
        label: "Raise the reasoning level to Medium or High",
      },
      {
        id: "m3q24_b",
        label: "Keep reasoning on Low, since it is faster",
      },
      {
        id: "m3q24_c",
        label: "Choose Flash-Lite so it thinks more calmly",
      },
      {
        id: "m3q24_d",
        label: "Turn on Deep Research to solve the problem",
      },
    ],
    correctAnswer: "m3q24_a",
    topic: "Gemini Basics",
    difficulty: "medium",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "The reasoning level (Low, Medium or High; Low by default) sets how much the model thinks before answering: for several steps, raise it. Flash-Lite is the lightest option and Deep Research is for researching sources, not for reasoning through a problem.",
  },
  {
    id: "m3q25",
    question:
      "What do you do if a cited source does not exist when you search for it?",
    options: [
      {
        id: "m3q25_a",
        label:
          "Search Google Scholar and, if it is not there, cite the closest one",
      },
      {
        id: "m3q25_b",
        label: "Ask Gemini to fix the citation and use the one it suggests",
      },
      {
        id: "m3q25_c",
        label: "Keep the data and cite the website's home page",
      },
      {
        id: "m3q25_d",
        label: "Remove the data and look for another source that backs it",
      },
    ],
    correctAnswer: "m3q25_d",
    topic: "Source Verification",
    difficulty: "hard",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "A citation that does not exist supports nothing. Citing something similar, accepting the citation Gemini suggests or citing a site's home page leaves the data unsupported. Remove it and find another verifiable source.",
  },
  {
    id: "m3q26",
    question:
      "You review a Gemini text to separate facts from hallucinations. Which method do you use?",
    options: [
      {
        id: "m3q26_a",
        label: "Mark every unsupported claim and check it",
      },
      {
        id: "m3q26_b",
        label: "Mark only the claims that sound odd to me",
      },
      {
        id: "m3q26_c",
        label: "Ask Gemini to mark its own mistakes",
      },
      {
        id: "m3q26_d",
        label: "Check that the text sounds coherent and confident",
      },
    ],
    correctAnswer: "m3q26_a",
    topic: "Verification",
    difficulty: "easy",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "A hallucination can sound normal and confident. That is why you mark every unsupported claim and check it in a source, not only the ones that seem odd.",
  },
  {
    id: "m3q27",
    question: "A 200-page document: what does a careful student do?",
    options: [
      {
        id: "m3q27_a",
        label: "Asks for a chapter summary and cites the summary",
      },
      {
        id: "m3q27_b",
        label: "Splits it into parts and accepts each part's answers",
      },
      {
        id: "m3q27_c",
        label:
          "Asks for answers with section and page, and verifies the ones they will use",
      },
      {
        id: "m3q27_d",
        label: "Asks for verbatim quotes to paste into the work",
      },
    ],
    correctAnswer: "m3q27_c",
    topic: "Long documents and citations",
    difficulty: "hard",
    source: "Gemini in Practice: Field Exercises",
    feedback:
      "Asking for section and page lets you go to the original and verify what you will use. A summary, answers by parts or quotes you do not compare with the document do not confirm what the text says.",
  },
  {
    id: "m3q28",
    question:
      "What should you ask for if Gemini describes an image with a doubtful detail?",
    options: [
      {
        id: "m3q28_a",
        label: "That it invents more detail to convince you",
      },
      {
        id: "m3q28_b",
        label:
          "That it points to the part of the image that supports that detail",
      },
      {
        id: "m3q28_c",
        label: "That it does not look at the image again",
      },
      {
        id: "m3q28_d",
        label: "That it changes the description without saying why",
      },
    ],
    correctAnswer: "m3q28_b",
    topic: "Multimodality",
    difficulty: "medium",
    source: "Field Guide: Introduction to Gemini",
    feedback:
      "Asking for the part of the image that supports the detail lets you check it. A detail with no visible basis is not used.",
  },
];
