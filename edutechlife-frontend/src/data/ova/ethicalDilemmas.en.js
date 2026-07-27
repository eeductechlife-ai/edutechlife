export const dilemmas = [
  {
    id: 1,
    scenario:
      "You are a medical student using AI to draft a diagnosis. The AI suggests a treatment you don't know. What do you do?",
    opts: [
      "Copy the diagnosis and submit it as my own, the AI never makes mistakes.",
      "Verify the treatment with updated medical sources and consult my professor before deciding.",
      "Slightly modify the text so it doesn't look like AI and submit it.",
    ],
    correct: 1,
    feedback:
      "AI is a support tool, not a substitute for professional judgment. Verifying sources is your ethical responsibility.",
  },
  {
    id: 2,
    scenario:
      "A classmate asks you to use AI to generate a complete academic essay that they will submit as their own. How do you respond?",
    opts: [
      "I help them, everyone uses AI nowadays.",
      "I explain that academic plagiarism also applies to AI-generated content and offer to teach them how to use it as a support tool.",
      "I do it but ask them not to tell anyone.",
    ],
    correct: 1,
    feedback:
      "Using AI to generate content presented as your own is plagiarism. AI should be a learning tool, not a shortcut to deceive.",
  },
  {
    id: 3,
    scenario:
      "A recruitment company uses an AI algorithm to filter resumes. The system systematically rejects women for technical positions. What is the main ethical issue?",
    opts: [
      "There is no problem, the algorithm just follows historical data.",
      "The algorithm perpetuates historical gender biases and must be audited and corrected to ensure fairness.",
      "The problem is that women don't apply for those positions.",
    ],
    correct: 1,
    feedback:
      "Algorithms can perpetuate and amplify historical biases. It is an ethical responsibility to audit AI systems to ensure fairness.",
  },
  {
    id: 4,
    scenario:
      "You are developing an educational AI app for children. What ethical consideration is PRIORITY?",
    opts: [
      "That the app is visually appealing and has many colors.",
      "Guarantee children's data privacy, transparency in how the AI works, and parental supervision.",
      "That the AI responds as quickly as possible.",
    ],
    correct: 1,
    feedback:
      "When working with minors, privacy, security, and transparency are priority ethical and legal obligations.",
  },
  {
    id: 5,
    scenario:
      "Your boss asks you to implement an AI chatbot for customer service, but says: 'Don't tell customers they're talking to an AI.' What do you do?",
    opts: [
      "Implement it without saying anything, that's what the boss wants.",
      "Explain that hiding it is an AI violates transparency and trust principles, and propose clearly informing at the start of the interaction.",
      "Implement it but tell a colleague in confidence.",
    ],
    correct: 1,
    feedback:
      "Transparency is a fundamental ethical principle in AI. Users have the right to know if they are interacting with a human or a machine.",
  },
  {
    id: 6,
    scenario:
      "You use AI to generate fake reviews of your product to improve your online reputation. Is it ethical?",
    opts: [
      "Yes, all companies do it to compete.",
      "No, generating fake reviews is deceptive, violates honesty principles, and can have legal consequences.",
      "Just a couple of fake reviews don't hurt anyone.",
    ],
    correct: 1,
    feedback:
      "Generating false or deceptive content violates ethical principles of transparency and honesty, and is illegal in many countries.",
  },
];

export const accordionData = [
  {
    id: "ac1",
    title: "Transparency Principle",
    icon: "🔍",
    content:
      "Users should know when they are interacting with AI. Hiding the nature of the interaction erodes trust and violates fundamental ethical principles.",
  },
  {
    id: "ac2",
    title: "Human Responsibility",
    icon: "👤",
    content:
      "There must always be a human responsible for decisions made with AI assistance. You cannot delegate moral responsibility to a machine.",
  },
  {
    id: "ac3",
    title: "Fairness and Non-Discrimination",
    icon: "⚖️",
    content:
      "AI systems must be regularly audited to detect and correct biases that may discriminate based on gender, race, age, or other characteristics.",
  },
];

export const learningObjectives = [
  "Analyze ethical dilemmas in the use of artificial intelligence",
  "Develop criteria for ethical decision-making with AI",
  "Understand the principles of transparency and accountability in AI",
  "Evaluate the social impact of automated decisions",
];

export const furtherReading = [
  {
    title: "AI Ethics Guidelines — European Commission",
    url: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence",
    description:
      "Ethical guidelines for trustworthy AI from the European Commission.",
  },
  {
    title: "MIT Moral Machine",
    url: "https://www.moralmachine.net/",
    description:
      "Interactive experiment on ethical dilemmas for autonomous vehicles.",
  },
];
