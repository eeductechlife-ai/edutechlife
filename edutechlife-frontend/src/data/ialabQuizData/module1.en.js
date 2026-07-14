export const MODULE_1_EN = [
  {
    id: "m1q1",
    question: "What is the main purpose of prompt engineering?",
    options: [
      { id: "m1q1_a", label: "To ask longer questions to AI" },
      {
        id: "m1q1_b",
        label: "To give clear and effective instructions for useful results",
      },
      { id: "m1q1_c", label: "To use complicated technical words" },
      { id: "m1q1_d", label: "To make AI write code automatically" },
    ],
    correctAnswer: "m1q1_b",
    topic: "Prompt Engineering",
    difficulty: "easy",
    feedback:
      'Review the topic "Generative AI: Your First Step" in the module resources.',
  },
  {
    id: "m1q2",
    question:
      'A student writes: "Write a text about artificial intelligence for students." According to the RTF method (Role, Task, Format), which components are present and which are missing?',
    options: [
      {
        id: "m1q2_a",
        label:
          "The Task is present; Role and Format are missing — it does not define what AI profile to adopt nor how to structure the response",
      },
      { id: "m1q2_b", label: "All RTF components are present in the prompt" },
      {
        id: "m1q2_c",
        label: "Only Role is missing; Task and Format are well defined",
      },
      {
        id: "m1q2_d",
        label: "Only Format is missing; Role and Task are well defined",
      },
    ],
    correctAnswer: "m1q2_a",
    topic: "RTF Method",
    difficulty: "medium",
    feedback:
      'The prompt has a clear Task ("write a text") but does not define the AI Role (science communicator? teacher?) nor the Format (list? essay? how many words?). Review the "Anatomy of a Prompt" (PDF) and the video "How to Create a Good Prompt".',
  },
  {
    id: "m1q3",
    question: "What is a key advantage of the RTF method (Role, Task, Format)?",
    options: [
      { id: "m1q3_a", label: "It makes questions shorter" },
      {
        id: "m1q3_b",
        label:
          "It structures instructions to get organized and aligned responses",
      },
      { id: "m1q3_c", label: "It eliminates the need for context" },
      { id: "m1q3_d", label: "It fully automates the process" },
    ],
    correctAnswer: "m1q3_b",
    topic: "Mastery Framework",
    difficulty: "easy",
    feedback: 'Review "The Perfect Prompt Formula" in the module resources.',
  },
  {
    id: "m1q4",
    question:
      'According to the "Anatomy of a Prompt" guide (module PDF) and the video "How to Create a Good Prompt", which of these prompts is BEST structured for an accurate and useful response?',
    options: [
      { id: "m1q4_a", label: '"Tell me everything about climate change"' },
      {
        id: "m1q4_b",
        label:
          '"Act as a science communicator. Explain 3 causes of climate change and their concrete effects. Use accessible language for the general public and end with a 2-line conclusion."',
      },
      { id: "m1q4_c", label: '"Climate change: causes and effects"' },
      {
        id: "m1q4_d",
        label: '"I need information about climate change for a school project"',
      },
    ],
    correctAnswer: "m1q4_b",
    topic: "Prompt Structure",
    difficulty: "medium",
    feedback:
      "Prompt B follows the recommended structure: defines a Role (science communicator), a specific Task (explain 3 causes and effects), and a clear Format (accessible tone, 2-line conclusion).",
  },
  {
    id: "m1q5",
    question:
      'A student needs an executive summary of an article about neural networks to present to executives with no technical background. They write: "Summarize this article about neural networks." The AI returns a 3-page technical text. What is the cause of the problem and how should the prompt be modified?',
    options: [
      {
        id: "m1q5_a",
        label:
          "The article is too long; they should split the text into smaller parts",
      },
      {
        id: "m1q5_b",
        label:
          'Role, Audience, and Format are missing. It should be: "Act as a technology consultant. Executive summary in 5 bullet points for non-technical executives. Maximum 200 words."',
      },
      {
        id: "m1q5_c",
        label:
          "AI does not understand the topic; they should use a different AI tool",
      },
      {
        id: "m1q5_d",
        label:
          'The problem is the word "summarize"; they should use "synthesize" instead',
      },
    ],
    correctAnswer: "m1q5_b",
    topic: "RTF Application",
    difficulty: "hard",
    feedback:
      'The original prompt only has a generic Task. For a useful result, it needs Role (technology consultant), Audience (non-technical executives), and Format (5 bullet points, 200 words). Review the OVA "How to Communicate with AI" and the PDF guide.',
  },
  {
    id: "m1q6",
    question: "What ethical considerations are key when using generative AI?",
    options: [
      { id: "m1q6_a", label: "Only response speed" },
      {
        id: "m1q6_b",
        label: "Bias, privacy, transparency, and responsible use",
      },
      { id: "m1q6_c", label: "API cost" },
      { id: "m1q6_d", label: "Number of tokens used" },
    ],
    correctAnswer: "m1q6_b",
    topic: "AI Ethics",
    difficulty: "medium",
    feedback: "Review the module resources on responsible AI use.",
  },
  {
    id: "m1q7",
    question:
      'Compare these two prompts for the same task:\n\nPrompt A: "Tell me about the water cycle."\nPrompt B: "Act as a science teacher. Explain the water cycle in 4 key stages for 10-12 year old students. Include one simple analogy per stage and end with a verification question."\n\nWhat is the main reason Prompt B will get a better result?',
    options: [
      {
        id: "m1q7_a",
        label: "Prompt B is longer, so AI tries harder on the response",
      },
      {
        id: "m1q7_b",
        label:
          "Prompt B uses the full RTF method (Role + Task + Format + Audience), giving clear and specific instructions",
      },
      { id: "m1q7_c", label: "Prompt A uses words that are too simple for AI" },
      { id: "m1q7_d", label: "Prompt B uses a more formal and technical tone" },
    ],
    correctAnswer: "m1q7_b",
    topic: "RTF Comparative Analysis",
    difficulty: "hard",
    feedback:
      'Prompt B follows the RTF method: defines a Role (science teacher), a specific Task (explain in 4 stages), an Audience (10-12 year old students), and a Format (analogies + question). Prompt A is generic and lacks structure. Review the PDF "Anatomy of a Prompt".',
  },
  {
    id: "m1q8",
    question: "How do you structure a prompt using RTF for market analysis?",
    options: [
      { id: "m1q8_a", label: 'By directly asking "analyze the market"' },
      {
        id: "m1q8_b",
        label: "By defining Role, Task, and Format to guide the AI response",
      },
      { id: "m1q8_c", label: "By using as few words as possible" },
      { id: "m1q8_d", label: "By copying prompts from the internet" },
    ],
    correctAnswer: "m1q8_b",
    topic: "Mastery Framework",
    difficulty: "hard",
    feedback:
      "Practice with the module's JSON templates to master the RTF structure.",
  },
  {
    id: "m1q9",
    question:
      "You work at a company that launches a new product every month. You need ChatGPT to draft promotional emails consistent with the brand voice. What is the most efficient strategy to maintain consistency without rewriting instructions every time?",
    options: [
      {
        id: "m1q9_a",
        label:
          "Create a custom GPT with tone and voice instructions plus brand examples in the knowledge base",
      },
      {
        id: "m1q9_b",
        label:
          "Copy and paste instructions manually into each new conversation",
      },
      {
        id: "m1q9_c",
        label: "Use standard chat and ask it to remember the tone each time",
      },
      { id: "m1q9_d", label: "Write the emails manually without AI help" },
    ],
    correctAnswer: "m1q9_a",
    topic: "Custom GPTs",
    difficulty: "medium",
    feedback:
      "A custom GPT with persistent instructions and knowledge base is the most efficient way to maintain consistency. Review the custom GPTs topic in the module resources.",
  },
  {
    id: "m1q10",
    question:
      "You write a prompt asking for a marketing plan. The AI gives something generic. What is the best next step?",
    options: [
      {
        id: "m1q10_a",
        label: "Accept the generic result because the AI already gave its best",
      },
      {
        id: "m1q10_b",
        label:
          "Refine the prompt by adding specific context: industry, budget, target audience, and examples of past campaigns",
      },
      { id: "m1q10_c", label: "Completely change the topic and start over" },
      { id: "m1q10_d", label: "Complain to the AI support team" },
    ],
    correctAnswer: "m1q10_b",
    topic: "Iterative Refinement",
    difficulty: "easy",
    feedback:
      'Prompt engineering is an iterative process. Each refinement adds context the AI needs to give you specific and useful results. Review the "Prompt Refinement" topic in the module resources.',
  },
  {
    id: "m1q11",
    question:
      "What is the key difference between a zero-shot and a few-shot prompt?",
    options: [
      {
        id: "m1q11_a",
        label:
          "Zero-shot uses no examples; few-shot includes examples in the prompt to guide the AI",
      },
      {
        id: "m1q11_b",
        label: "Zero-shot works without internet; few-shot needs a connection",
      },
      {
        id: "m1q11_c",
        label: "Zero-shot only works with images; few-shot only with text",
      },
      {
        id: "m1q11_d",
        label: "There is no difference, the terms are interchangeable",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "Prompting Strategies",
    difficulty: "medium",
    feedback:
      "In zero-shot you give a direct instruction (one shot). In few-shot you provide examples (multiple samples) to establish the desired response pattern. Review the prompting strategies topic in the module resources.",
  },
  {
    id: "m1q12",
    question:
      "What advantage does using a system prompt have over including instructions in each message?",
    options: [
      {
        id: "m1q12_a",
        label:
          "The system prompt sets the AI baseline behavior for the entire conversation, avoiding repeated instructions",
      },
      { id: "m1q12_b", label: "The system prompt makes the AI respond faster" },
      {
        id: "m1q12_c",
        label: "The system prompt only works in the paid version of ChatGPT",
      },
      {
        id: "m1q12_d",
        label: "There is no difference, both methods work the same",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "System Prompts",
    difficulty: "medium",
    feedback:
      "System prompts define the role, tone, and base rules for the entire interaction. This is especially useful in custom GPTs and applications where consistency is key. Review the system prompts topic in the module resources.",
  },
];
