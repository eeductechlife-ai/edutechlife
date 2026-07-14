export const MODULE_5_EN = [
  {
    id: "m5q1",
    question:
      'An AI-based hiring system was trained on historical data from a tech company where 78% of employees were men. The system learned to prioritize CVs with words like "engineer" and "tech lead", and penalized terms like "volunteering" or "parental leave". Female candidates with equivalent qualifications received lower scores. What type of bias is present and at what stage of the AI pipeline did it originate?',
    options: [
      {
        id: "m5q1_a",
        label:
          "Sampling bias — the training data did not equitably represent the population, originating in data collection",
      },
      {
        id: "m5q1_b",
        label:
          "Automation bias — the system decided on its own without human supervision",
      },
      {
        id: "m5q1_c",
        label:
          "Confirmation bias — recruiters were looking to confirm their own beliefs",
      },
      {
        id: "m5q1_d",
        label:
          "Labeling bias — labels were incorrectly placed by external annotators",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Bias in AI",
    difficulty: "medium",
    feedback:
      'This is a classic case of sampling bias. Historical data from a company with 78% men does not represent the general candidate population. The bias originated in data collection, before training. Review the OVA "Lab: Detect the Bias" and the PDF "Bias Detection Guide".',
  },
  {
    id: "m5q2",
    question:
      'You use ChatGPT to research an anxiety treatment. The AI responds: "According to a 2023 Harvard study, 89% of patients reduced symptoms with this therapy." You try to find the study and find nothing. The numbers and source seem invented. What is the most responsible action?',
    options: [
      {
        id: "m5q2_a",
        label:
          "Do not use that information until verified with reliable sources, report the possible error, and document that the AI hallucinated",
      },
      {
        id: "m5q2_b",
        label:
          "Use the information anyway because AI rarely gets concrete data wrong",
      },
      {
        id: "m5q2_c",
        label:
          "Ask the same AI to search for the source again and trust whatever it responds",
      },
      {
        id: "m5q2_d",
        label:
          "Ignore the incident because hallucinations are uncommon and do not matter",
      },
    ],
    correctAnswer: "m5q2_a",
    topic: "Hallucinations",
    difficulty: "medium",
    feedback:
      'Hallucinations are false information that appears truthful. They are especially dangerous in health contexts where they can have serious consequences. Always verify sources for critical information. Review the lab "Detect the Bias".',
  },
  {
    id: "m5q3",
    question:
      "You are using AI for a medical diagnosis and the result contradicts your professional judgment. How do you act ethically?",
    options: [
      {
        id: "m5q3_a",
        label: "Accept the AI without question because it is smarter",
      },
      {
        id: "m5q3_b",
        label:
          "Question the possible automation bias, verify with other experts, and use your professional judgment",
      },
      { id: "m5q3_c", label: "Let the AI decide the treatment" },
      { id: "m5q3_d", label: "Turn off the computer and start over" },
    ],
    correctAnswer: "m5q3_b",
    topic: "Responsibility",
    difficulty: "medium",
    feedback:
      'Automation bias makes us blindly trust AI. Your professional judgment is irreplaceable. Review the topic "AI Ethics: The Essentials".',
  },
  {
    id: "m5q4",
    question:
      "Which of the following is NOT a good privacy practice when using AI?",
    options: [
      {
        id: "m5q4_a",
        label:
          "Uploading client personal data to a public chatbot for analysis",
      },
      {
        id: "m5q4_b",
        label: "Reading privacy policies before using an AI tool",
      },
      {
        id: "m5q4_c",
        label: "Not sharing confidential information in AI conversations",
      },
      {
        id: "m5q4_d",
        label: "Using enterprise versions that offer data protection",
      },
    ],
    correctAnswer: "m5q4_a",
    topic: "Privacy",
    difficulty: "medium",
    feedback:
      'Never upload sensitive data to public tools. Review the PDF "Privacy Manual in AI" and the module video.',
  },
  {
    id: "m5q5",
    question:
      'A bank implements an AI system to approve or reject credit applications. A client is rejected and asks why. The bank responds: "It is an AI decision, we cannot explain how it works internally." What ethical principle is violated and what should the bank do?',
    options: [
      {
        id: "m5q5_a",
        label:
          "Transparency and explainability — the bank should audit the model and provide understandable explanations to the client",
      },
      {
        id: "m5q5_b",
        label:
          "Privacy — the bank should hide the use of AI to protect the client",
      },
      {
        id: "m5q5_c",
        label: "Speed — the bank should process applications faster",
      },
      {
        id: "m5q5_d",
        label: "Efficiency — the bank should replace human analysts",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Transparency",
    difficulty: "medium",
    feedback:
      'Transparency is a fundamental ethical pillar. Citizens have the right to understand automated decisions affecting them. The EU AI Act requires explainability for high-risk decisions like credit. Review the video "Ethical AI: Principles and Practice" and the PDF "Code of Ethics for AI Use".',
  },
  {
    id: "m5q6",
    question:
      "You are a UX designer at a digital agency. Your boss asks you to use AI to generate 50 fake positive reviews for a product that has not launched yet, to improve its early reputation on social media. What is the most ethical stance?",
    options: [
      {
        id: "m5q6_a",
        label:
          "Refuse to generate fake reviews, explain that it violates ethical principles of transparency, and propose legitimate promotion alternatives",
      },
      {
        id: "m5q6_b",
        label:
          "Generate the reviews because your boss asked and it is part of your job",
      },
      {
        id: "m5q6_c",
        label:
          "Generate the reviews but modify some details to make them seem less fake",
      },
      { id: "m5q6_d", label: "Resign immediately without explanation" },
    ],
    correctAnswer: "m5q6_a",
    topic: "Responsible Use",
    difficulty: "medium",
    feedback:
      'Generating fake reviews violates ethical principles of transparency and honesty, and can have legal consequences (false advertising). The best path is to propose ethical alternatives. Review the OVA "Lab: Ethical Dilemmas" and the ethical user decalogue.',
  },
  {
    id: "m5q7",
    question:
      "A driver with autopilot is distracted looking at their phone. The system detects an obstacle and brakes in time. The driver trusts it will always work. Weeks later, in low light, the system does not detect a small object and an accident occurs. What bias describes this situation and how to prevent it?",
    options: [
      {
        id: "m5q7_a",
        label:
          "Automation bias — the driver delegated attention without critical supervision. Prevention: training on system limitations and active supervision",
      },
      {
        id: "m5q7_b",
        label:
          "Sampling bias — training data did not include small objects in low light",
      },
      {
        id: "m5q7_c",
        label:
          "Algorithmic bias — the system discriminated against certain types of objects",
      },
      {
        id: "m5q7_d",
        label: "Normal human error — accidents happen, no bias involved",
      },
    ],
    correctAnswer: "m5q7_a",
    topic: "Automation Bias",
    difficulty: "hard",
    feedback:
      'Automation bias is the human tendency to excessively trust automated systems, abandoning critical thinking. The driver assumed the system was infallible. Review the OVA "Lab: Detect the Bias" and the topic "Algorithmic Biases and Fairness".',
  },
  {
    id: "m5q8",
    question:
      "You want to use AI for a project but are concerned about data privacy. According to the module, what is the most responsible strategy?",
    options: [
      { id: "m5q8_a", label: "Never use AI for anything related to data" },
      {
        id: "m5q8_b",
        label:
          "Use tools with enterprise data protection, anonymize sensitive information, and never share personal data in public chats",
      },
      {
        id: "m5q8_c",
        label: "Share the data on social media for the community to help",
      },
      { id: "m5q8_d", label: "Trust that AI automatically protects all data" },
    ],
    correctAnswer: "m5q8_b",
    topic: "Data Protection",
    difficulty: "hard",
    feedback:
      'Data protection is your responsibility. Use secure tools, anonymize, and never share sensitive information. Review "Protect Your Data in the AI Era".',
  },
  {
    id: "m5q9",
    question:
      'The European Union classifies AI systems by risk level (minimal, limited, high, unacceptable). A system that determines access to essential financial services (like approving a mortgage) falls into the "high risk" category. What obligation does this classification impose?',
    options: [
      {
        id: "m5q9_a",
        label:
          "Conformity assessments, technical documentation, transparency, and mandatory human oversight",
      },
      {
        id: "m5q9_b",
        label: "Total prohibition of AI use in financial services",
      },
      {
        id: "m5q9_c",
        label: "Voluntary registration without specific obligations",
      },
      { id: "m5q9_d", label: "Just paying an annual fee for using the system" },
    ],
    correctAnswer: "m5q9_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    feedback:
      'The EU AI Act is the first comprehensive AI regulatory framework. High-risk systems require conformity assessments, documentation, transparency, and human oversight. It is important to know the regulatory framework when developing AI solutions. Review the topic "Legal and Regulatory Framework of AI".',
  },
  {
    id: "m5q10",
    question:
      "A data science team trains a model to predict academic success. They discover the model assigns lower scores to students from certain geographic regions, even when controlling for grades and resources. What fairness metric should they prioritize to diagnose the problem?",
    options: [
      {
        id: "m5q10_a",
        label:
          "Demographic parity — check if the positive prediction rate is similar across geographic groups",
      },
      {
        id: "m5q10_b",
        label: "Overall model accuracy without breaking down by groups",
      },
      { id: "m5q10_c", label: "Model training speed" },
      { id: "m5q10_d", label: "Total amount of training data" },
    ],
    correctAnswer: "m5q10_a",
    topic: "Algorithmic Fairness",
    difficulty: "hard",
    feedback:
      'Demographic parity measures whether model predictions are equitable across groups. If the model predicts success less frequently for certain regions, there is a bias that must be investigated and corrected. Review the OVA "Lab: Detect the Bias".',
  },
  {
    id: "m5q11",
    question:
      "You are developing an educational app with AI that collects student performance data. Following the data minimization principle, what is the correct practice?",
    options: [
      {
        id: "m5q11_a",
        label:
          "Collect only the data strictly necessary for the educational functionality, with informed consent and a clear deletion policy",
      },
      {
        id: "m5q11_b",
        label: 'Collect all possible data "just in case" it is needed later',
      },
      {
        id: "m5q11_c",
        label:
          "Automatically share the data with third parties without notifying users",
      },
      { id: "m5q11_d", label: "Store data indefinitely with no deletion plan" },
    ],
    correctAnswer: "m5q11_a",
    topic: "Privacy by Design",
    difficulty: "medium",
    feedback:
      'Data minimization is a fundamental privacy principle: only collect what is necessary, with consent, and have a clear deletion plan. Review the topic "Protect Your Data in the AI Era" and the PDF "Privacy Manual in AI".',
  },
  {
    id: "m5q12",
    question:
      "An AI team documents their model with a model card. According to best practices, what information MUST it include?",
    options: [
      {
        id: "m5q12_a",
        label:
          "Model purpose, training data, performance metrics by subgroup, known limitations, and ethical considerations",
      },
      { id: "m5q12_b", label: "Only the model name and version" },
      {
        id: "m5q12_c",
        label: "The full names of developers and their salaries",
      },
      { id: "m5q12_d", label: "The complete source code of the model" },
    ],
    correctAnswer: "m5q12_a",
    topic: "Ethical Documentation",
    difficulty: "medium",
    feedback:
      "Model cards are a transparency standard in AI. They include purpose, data, subgroup metrics, limitations, and ethical considerations. They allow users to understand the model capabilities and limitations before using it. Review the transparency topic in the module resources.",
  },
];
