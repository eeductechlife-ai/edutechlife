export const MODULE_5_EN = [
  {
    id: "m5q1",
    question:
      "A hiring system was trained on data from a mostly male company and penalized CVs with certain terms. What bias appears and where does it start?",
    options: [
      { id: "m5q1_a", label: "Sampling bias, starting in the training data" },
      { id: "m5q1_b", label: "Automation bias, due to a lack of human review" },
      {
        id: "m5q1_c",
        label: "Confirmation bias, from the recruiter's prior ideas",
      },
      { id: "m5q1_d", label: "Labeling bias, from wrong annotators" },
    ],
    correctAnswer: "m5q1_a",
    topic: "AI Bias",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "The historical data did not represent the population, so the bias began in collection. Review the bias lab.",
  },
  {
    id: "m5q2",
    question:
      "ChatGPT cites a health study that does not exist in any search. What do you do?",
    options: [
      {
        id: "m5q2_a",
        label: "Do not use the fact and verify the source yourself",
      },
      { id: "m5q2_b", label: "Use the fact because the AI is rarely wrong" },
      { id: "m5q2_c", label: "Ask the AI again and trust its answer" },
      {
        id: "m5q2_d",
        label: "Ignore it because hallucinations are not common",
      },
    ],
    correctAnswer: "m5q2_a",
    topic: "Hallucinations",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "A hallucination is false information that looks real. Always verify critical data like health.",
  },
  {
    id: "m5q3",
    question:
      "An AI gives a diagnosis that contradicts your professional judgment. How do you act?",
    options: [
      { id: "m5q3_a", label: "I question the AI and consult other experts" },
      { id: "m5q3_b", label: "I accept the AI because it is smarter" },
      { id: "m5q3_c", label: "I let the AI decide the treatment" },
      { id: "m5q3_d", label: "I restart the system and ask again" },
    ],
    correctAnswer: "m5q3_a",
    topic: "Responsibility",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Do not fall for automation bias: your professional judgment is irreplaceable.",
  },
  {
    id: "m5q4",
    question: "Which of these is NOT a good privacy practice with AI?",
    options: [
      { id: "m5q4_a", label: "Uploading client data to a public chatbot" },
      { id: "m5q4_b", label: "Reading the privacy policies of the tool" },
      { id: "m5q4_c", label: "Avoiding sharing confidential data with the AI" },
      { id: "m5q4_d", label: "Using enterprise versions with data protection" },
    ],
    correctAnswer: "m5q4_a",
    topic: "Privacy",
    difficulty: "easy",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Never upload sensitive data to public tools. Review the privacy manual.",
  },
  {
    id: "m5q5",
    question:
      "A bank rejects a loan with AI and does not explain why. Which principle is violated?",
    options: [
      {
        id: "m5q5_a",
        label: "Transparency and explainability of the decision",
      },
      { id: "m5q5_b", label: "Privacy, by hiding the use of the AI" },
      { id: "m5q5_c", label: "The speed of the decision process" },
      { id: "m5q5_d", label: "Efficiency, by using human analysts" },
    ],
    correctAnswer: "m5q5_a",
    topic: "Transparency",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "People have the right to understand automatic decisions that affect them. Review the code of ethics.",
  },
  {
    id: "m5q6",
    question:
      "Your boss asks you to generate fake reviews of a product with AI. What is the ethical stance?",
    options: [
      {
        id: "m5q6_a",
        label: "Refuse and propose honest promotion alternatives",
      },
      { id: "m5q6_b", label: "Do it because it is part of your job" },
      {
        id: "m5q6_c",
        label: "Do it changing details so they do not look fake",
      },
      { id: "m5q6_d", label: "Quit without an explanation" },
    ],
    correctAnswer: "m5q6_a",
    topic: "Responsible Use",
    difficulty: "medium",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "Fake reviews deceive and can be illegal. Propose ethical alternatives. Review the dilemmas lab.",
  },
  {
    id: "m5q7",
    question:
      "A distracted driver trusts the autopilot and has an accident. What bias does this describe?",
    options: [
      {
        id: "m5q7_a",
        label: "Automation bias: they trusted without critical review",
      },
      { id: "m5q7_b", label: "Sampling bias in the training data" },
      { id: "m5q7_c", label: "Algorithmic bias against certain objects" },
      { id: "m5q7_d", label: "A normal human error with no bias" },
    ],
    correctAnswer: "m5q7_a",
    topic: "Automation Bias",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Automation bias is trusting the machine too much. Keep active supervision.",
  },
  {
    id: "m5q8",
    question:
      "What is the most responsible strategy to protect data when using AI?",
    options: [
      {
        id: "m5q8_a",
        label: "Use secure tools and anonymize sensitive information",
      },
      { id: "m5q8_b", label: "Avoid using AI with any data at all" },
      {
        id: "m5q8_c",
        label: "Post the data on social media for the community to help",
      },
      {
        id: "m5q8_d",
        label: "Trust that the AI protects everything automatically",
      },
    ],
    correctAnswer: "m5q8_a",
    topic: "Data Protection",
    difficulty: "medium",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Protecting data is your responsibility: secure tools and anonymized data.",
  },
  {
    id: "m5q9",
    question:
      "A high-risk AI system (for example, approving a mortgage) under the EU must comply with:",
    options: [
      { id: "m5q9_a", label: "Conformity assessment and human supervision" },
      { id: "m5q9_b", label: "A total ban on using AI in that case" },
      { id: "m5q9_c", label: "Voluntary registration with no obligations" },
      { id: "m5q9_d", label: "Paying an annual fee to use it" },
    ],
    correctAnswer: "m5q9_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "High-risk systems require transparency, documentation and human supervision. Review the regulatory framework.",
  },
  {
    id: "m5q10",
    question:
      "Your educational app collects student performance data. Which data-minimization practice is correct?",
    options: [
      {
        id: "m5q10_a",
        label: "Store only what is needed with informed consent",
      },
      {
        id: "m5q10_b",
        label: "Collect all the data just in case it is needed",
      },
      {
        id: "m5q10_c",
        label: "Share the data with third parties without telling users",
      },
      { id: "m5q10_d", label: "Store the data with no deletion plan" },
    ],
    correctAnswer: "m5q10_a",
    topic: "Privacy by Design",
    difficulty: "medium",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Minimize the data: only what is needed, with consent and a clear deletion plan.",
  },
];
