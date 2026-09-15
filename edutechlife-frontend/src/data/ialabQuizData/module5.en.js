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
  {
    id: "m5q11",
    question: "What are the 4 key ethical principles that guide the responsible use of AI?",
    options: [
      {
        id: "m5q11_a",
        label: "Transparency, fairness, accountability and privacy",
      },
      { id: "m5q11_b", label: "Speed, savings, automation and efficiency" },
      { id: "m5q11_c", label: "Popularity, profit, scale and competition" },
      { id: "m5q11_d", label: "Innovation, investment, patent and ownership" },
    ],
    correctAnswer: "m5q11_a",
    topic: "Ethical Principles",
    difficulty: "easy",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Transparency, fairness, accountability and privacy are the pillars. Review the principles video.",
  },
  {
    id: "m5q12",
    question: "What does the principle of transparency mean in an AI system?",
    options: [
      {
        id: "m5q12_a",
        label: "That people can understand how and why the AI decides",
      },
      { id: "m5q12_b", label: "That the system works without anyone knowing how it does it" },
      { id: "m5q12_c", label: "That it uses only public data with no controls of any kind" },
      { id: "m5q12_d", label: "That its code stays secret in order to protect the business" },
    ],
    correctAnswer: "m5q12_a",
    topic: "Transparency",
    difficulty: "easy",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Transparency lets people understand and audit the decisions. Review the code of ethics.",
  },
  {
    id: "m5q13",
    question: "What is sampling bias in an AI model?",
    options: [
      {
        id: "m5q13_a",
        label: "The training data does not represent the whole population",
      },
      { id: "m5q13_b", label: "The system runs slowly with very large databases" },
      { id: "m5q13_c", label: "The model switches language without you asking it to" },
      { id: "m5q13_d", label: "The AI forgets its data when it is shut down completely" },
    ],
    correctAnswer: "m5q13_a",
    topic: "Bias in AI",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Sampling bias comes from unrepresentative data. Practice in the bias lab.",
  },
  {
    id: "m5q14",
    question: "What is confirmation bias applied to AI?",
    options: [
      {
        id: "m5q14_a",
        label: "The system reinforces existing patterns without questioning them",
      },
      { id: "m5q14_b", label: "The AI always confirms that its data is fully complete" },
      { id: "m5q14_c", label: "The model asks for confirmation before every answer" },
      { id: "m5q14_d", label: "The user confirms their password in order to use the AI" },
    ],
    correctAnswer: "m5q14_a",
    topic: "Bias in AI",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Confirmation bias reinforces what is already in the data. Review the bias lab.",
  },
  {
    id: "m5q15",
    question: "What is labeling bias?",
    options: [
      {
        id: "m5q15_a",
        label: "Training labels carry the prejudices of the people who create them",
      },
      { id: "m5q15_b", label: "The system classifies the data automatically and neutrally" },
      { id: "m5q15_c", label: "The AI puts a visible label on each generated answer" },
      { id: "m5q15_d", label: "The model disables the labels when there is a lot of data" },
    ],
    correctAnswer: "m5q15_a",
    topic: "Bias in AI",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "If the labeler has biases, the model learns them. Review the bias lab.",
  },
  {
    id: "m5q16",
    question: "What is automation bias?",
    options: [
      {
        id: "m5q16_a",
        label: "Trusting the machine without enough human supervision",
      },
      { id: "m5q16_b", label: "Automating a task without documenting the internal process" },
      { id: "m5q16_c", label: "The AI automating every single bias that is in the data" },
      { id: "m5q16_d", label: "Using too many different AI tools at the same time" },
    ],
    correctAnswer: "m5q16_a",
    topic: "Automation Bias",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Automation bias is over-trusting the machine. Keep active human supervision.",
  },
  {
    id: "m5q17",
    question: "An AI systematically penalizes a certain group in hiring. What do you do?",
    options: [
      {
        id: "m5q17_a",
        label: "Stop the system, document the bias and correct the data",
      },
      { id: "m5q17_b", label: "Ignore it because the model works fast and cheap" },
      { id: "m5q17_c", label: "Hide the results in order to avoid legal complaints" },
      { id: "m5q17_d", label: "Upload more of the same historical data to the affected system" },
    ],
    correctAnswer: "m5q17_a",
    topic: "Bias Mitigation",
    difficulty: "hard",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "When bias is detected, stop, document and correct. Practice in the bias lab.",
  },
  {
    id: "m5q18",
    question: "What is fairness in an AI system?",
    options: [
      {
        id: "m5q18_a",
        label: "Treating groups fairly and avoiding disproportionate impacts",
      },
      { id: "m5q18_b", label: "Always giving the same answer to any type of user" },
      { id: "m5q18_c", label: "Assigning the resources to the user with the most seniority" },
      { id: "m5q18_d", label: "Optimizing only the speed of the computer system" },
    ],
    correctAnswer: "m5q18_a",
    topic: "Fairness",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Fairness aims to avoid unjust impacts between groups. Review the code of ethics.",
  },
  {
    id: "m5q19",
    question: "What does the explainability of an AI model aim for?",
    options: [
      {
        id: "m5q19_a",
        label: "That automatic decisions can be justified to people",
      },
      { id: "m5q19_b", label: "That the model explains why it consumes so many resources" },
      { id: "m5q19_c", label: "That the system summarizes its answers in fewer words" },
      { id: "m5q19_d", label: "That its answers can be translated into other languages" },
    ],
    correctAnswer: "m5q19_a",
    topic: "Explainability",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Explainability lets you justify decisions to the people affected. Review the code of ethics.",
  },
  {
    id: "m5q20",
    question: "What does the principle of accountability imply?",
    options: [
      {
        id: "m5q20_a",
        label: "That there are clear people and processes that answer for the results",
      },
      { id: "m5q20_b", label: "That the AI is the only one responsible for any possible failure" },
      { id: "m5q20_c", label: "That the system is guaranteed to never have any errors" },
      { id: "m5q20_d", label: "That responsibility is diluted among all of the users" },
    ],
    correctAnswer: "m5q20_a",
    topic: "Accountability",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "There must always be people responsible for the results. Review the code of ethics.",
  },
  {
    id: "m5q21",
    question: "A medical AI suggests a treatment. What is the best supervision practice?",
    options: [
      {
        id: "m5q21_a",
        label: "A professional validates the suggestion before applying it to the patient",
      },
      { id: "m5q21_b", label: "Applying the recommended treatment without any review at all" },
      { id: "m5q21_c", label: "Discarding the AI because it can never be useful in health" },
      { id: "m5q21_d", label: "Letting the patient decide without consulting anyone" },
    ],
    correctAnswer: "m5q21_a",
    topic: "Human Supervision",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "In critical areas, a professional validates the final decision. Review the principles video.",
  },
  {
    id: "m5q22",
    question: "Which is an example of sensitive data you should NOT upload to a public AI?",
    options: [
      {
        id: "m5q22_a",
        label: "Medical records or identity documents of real customers",
      },
      { id: "m5q22_b", label: "A public Wikipedia text about ancient history" },
      { id: "m5q22_c", label: "A general idea for a newspaper headline" },
      { id: "m5q22_d", label: "A question about any academic topic" },
    ],
    correctAnswer: "m5q22_a",
    topic: "Privacy",
    difficulty: "easy",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Health or identity data is sensitive: never upload it to public tools. Review the manual.",
  },
  {
    id: "m5q23",
    question: "What is privacy by design?",
    options: [
      {
        id: "m5q23_a",
        label: "Building data protection in from the very start of the system",
      },
      { id: "m5q23_b", label: "Adding privacy only if there is a user complaint" },
      { id: "m5q23_c", label: "Hiding the data use in the small print of the contract" },
      { id: "m5q23_d", label: "Collecting everything and deciding privacy at the end" },
    ],
    correctAnswer: "m5q23_a",
    topic: "Privacy by Design",
    difficulty: "medium",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Privacy is designed in from the start, not added at the end. Review the privacy manual.",
  },
  {
    id: "m5q24",
    question: "What is the principle of data minimization?",
    options: [
      {
        id: "m5q24_a",
        label: "Collecting and storing only the data that is strictly necessary",
      },
      { id: "m5q24_b", label: "Collecting all possible data just in case it is needed" },
      { id: "m5q24_c", label: "Compressing the data so that it takes up less space" },
      { id: "m5q24_d", label: "Deleting the data randomly every so often" },
    ],
    correctAnswer: "m5q24_a",
    topic: "Data Protection",
    difficulty: "medium",
    source: "PDF: AI Privacy Manual",
    feedback:
      "Minimizing means asking for and storing only what is necessary. Review the manual.",
  },
  {
    id: "m5q25",
    question: "How are AI systems classified by risk level (EU)?",
    options: [
      {
        id: "m5q25_a",
        label: "Unacceptable, high, limited and minimal risk",
      },
      { id: "m5q25_b", label: "Small, medium, large and gigantic risk" },
      { id: "m5q25_c", label: "Technical, human and financial risk only" },
      { id: "m5q25_d", label: "Public, private and confidential risk only" },
    ],
    correctAnswer: "m5q25_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "The EU distinguishes unacceptable, high, limited and minimal risk. Review the code of ethics.",
  },
  {
    id: "m5q26",
    question: "What kind of AI systems are prohibited because of their unacceptable risk?",
    options: [
      {
        id: "m5q26_a",
        label: "Those that seriously manipulate or discriminate against people",
      },
      { id: "m5q26_b", label: "Those that summarize internal company documents" },
      { id: "m5q26_c", label: "Those that translate texts into other common languages" },
      { id: "m5q26_d", label: "Those that suggest ideas for a marketing campaign" },
    ],
    correctAnswer: "m5q26_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Uses that seriously manipulate or discriminate are prohibited. Review the code of ethics.",
  },
  {
    id: "m5q27",
    question: "A high-risk AI system must, among other things…",
    options: [
      {
        id: "m5q27_a",
        label: "Be documented, evaluated and have human supervision",
      },
      { id: "m5q27_b", label: "Work with no registration or evaluation of any kind" },
      { id: "m5q27_c", label: "Operate only at night to consume less energy" },
      { id: "m5q27_d", label: "Publish all of its code openly as a mandatory rule" },
    ],
    correctAnswer: "m5q27_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "High risk requires documentation, evaluation and human supervision. Review the framework.",
  },
  {
    id: "m5q28",
    question: "An AI app makes decisions about student scholarships. What must you guarantee?",
    options: [
      {
        id: "m5q28_a",
        label: "Fair criteria, human review and a way to appeal the decision",
      },
      { id: "m5q28_b", label: "That it decides without ever explaining its selection criteria" },
      { id: "m5q28_c", label: "That it grants scholarships only to whoever uses the app most" },
      { id: "m5q28_d", label: "That the decision is final with no possibility of appeal" },
    ],
    correctAnswer: "m5q28_a",
    topic: "Governance",
    difficulty: "hard",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "Decisions that affect people require fairness, review and the right to appeal.",
  },
  {
    id: "m5q29",
    question: "What is a bias audit in an AI system?",
    options: [
      {
        id: "m5q29_a",
        label: "Systematically checking whether the model treats any group unfairly",
      },
      { id: "m5q29_b", label: "Measuring only the response speed of the whole system" },
      { id: "m5q29_c", label: "Checking how many registered users the platform has" },
      { id: "m5q29_d", label: "Verifying only the monthly cost of the tool" },
    ],
    correctAnswer: "m5q29_a",
    topic: "Audit",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Auditing bias means checking whether any group ends up harmed. Practice in the bias lab.",
  },
  {
    id: "m5q30",
    question: "A model discriminates even after the 'gender' field is removed. What do you do?",
    options: [
      {
        id: "m5q30_a",
        label: "Look for proxy variables and correct the indirect bias",
      },
      { id: "m5q30_b", label: "Consider the problem solved just by removing that field" },
      { id: "m5q30_c", label: "Add more data and trust that it will fix itself" },
      { id: "m5q30_d", label: "Hide the results until nobody notices again" },
    ],
    correctAnswer: "m5q30_a",
    topic: "Bias Mitigation",
    difficulty: "hard",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Some variables substitute for the removed attribute (indirect bias). Review the bias lab.",
  },
  {
    id: "m5q31",
    question: "Which is an UNETHICAL use of AI?",
    options: [
      {
        id: "m5q31_a",
        label: "Impersonating a person's identity with generated voice or image",
      },
      { id: "m5q31_b", label: "Summarizing your own report for a work meeting" },
      { id: "m5q31_c", label: "Checking the spelling of a text before publishing it" },
      { id: "m5q31_d", label: "Generating ideas for a personal learning project" },
    ],
    correctAnswer: "m5q31_a",
    topic: "Responsible Use",
    difficulty: "easy",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "Impersonating identities with AI is unethical and can be illegal. Review the principles video.",
  },
  {
    id: "m5q32",
    question: "You must explain to a user why the AI rejected their request. What do you apply?",
    options: [
      {
        id: "m5q32_a",
        label: "Explainability: give understandable reasons and a review option",
      },
      { id: "m5q32_b", label: "Opacity: answer only that 'the system decided it that way'" },
      { id: "m5q32_c", label: "Speed: close the case as fast as possible without explaining" },
      { id: "m5q32_d", label: "Automation: let nobody else intervene in the case at all" },
    ],
    correctAnswer: "m5q32_a",
    topic: "Explainability",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Explain the reasons in clear language and allow review. Review the code of ethics.",
  },
  {
    id: "m5q33",
    question: "An educational chatbot starts giving inappropriate answers to minors. What do you do?",
    options: [
      {
        id: "m5q33_a",
        label: "Pause the system, investigate and add content safeguards",
      },
      { id: "m5q33_b", label: "Let it keep running and warn only if someone complains" },
      { id: "m5q33_c", label: "Remove moderation so that it answers with more freedom" },
      { id: "m5q33_d", label: "Blame the minors for the way they use the system" },
    ],
    correctAnswer: "m5q33_a",
    topic: "Safeguards",
    difficulty: "hard",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "With minors, pause, investigate and strengthen content safeguards. Review the dilemmas lab.",
  },
  {
    id: "m5q34",
    question: "What does it mean for an AI system to be 'auditable'?",
    options: [
      {
        id: "m5q34_a",
        label: "That third parties can review how it works and how it decides",
      },
      { id: "m5q34_b", label: "That its code stays hidden even from its own creator" },
      { id: "m5q34_c", label: "That it needs no technical maintenance during its useful life" },
      { id: "m5q34_d", label: "That it works the same even if the base data changes completely" },
    ],
    correctAnswer: "m5q34_a",
    topic: "Audit",
    difficulty: "medium",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Auditable means it can be reviewed by third parties. Review the code of ethics.",
  },
  {
    id: "m5q35",
    question: "The AI suggests a decision that affects many people. Which principle requires reviewing it?",
    options: [
      {
        id: "m5q35_a",
        label: "Accountability and transparency with human supervision",
      },
      { id: "m5q35_b", label: "Efficiency, to settle the case in the shortest possible time" },
      { id: "m5q35_c", label: "Scalability, so the AI decides the largest possible volume" },
      { id: "m5q35_d", label: "Automation, to eliminate the intervention of people" },
    ],
    correctAnswer: "m5q35_a",
    topic: "Accountability",
    difficulty: "medium",
    source: "Video: Ethical AI: Principles and Practice",
    feedback:
      "High-impact decisions require transparency and human supervision. Review the principles video.",
  },
  {
    id: "m5q36",
    question: "How is a detected bias in a model mitigated?",
    options: [
      {
        id: "m5q36_a",
        label: "Improving the data and adding ongoing testing and monitoring",
      },
      { id: "m5q36_b", label: "Ignoring it, because biases usually fix themselves over time" },
      { id: "m5q36_c", label: "Hiding the negative results of the brand-new system" },
      { id: "m5q36_d", label: "Increasing the speed of the model so it is not noticed" },
    ],
    correctAnswer: "m5q36_a",
    topic: "Bias Mitigation",
    difficulty: "medium",
    source: "OVA: Lab: Detect the Bias",
    feedback:
      "Mitigation combines better data, testing and monitoring. Practice in the bias lab.",
  },
  {
    id: "m5q37",
    question: "What characterizes limited-risk AI systems (EU)?",
    options: [
      {
        id: "m5q37_a",
        label: "Transparency obligations, without being high risk",
      },
      { id: "m5q37_b", label: "A total ban on their use in any possible context" },
      { id: "m5q37_c", label: "A special license requirement in order to develop them" },
      { id: "m5q37_d", label: "A ban on publishing that AI is being used in them" },
    ],
    correctAnswer: "m5q37_a",
    topic: "Regulatory Framework",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Limited risk requires transparency, not prohibition. Review the code of ethics.",
  },
  {
    id: "m5q38",
    question: "You are about to deploy an AI system at work. Which governance practice helps most?",
    options: [
      {
        id: "m5q38_a",
        label: "Defining owners, fairness metrics and a monitoring plan",
      },
      { id: "m5q38_b", label: "Publishing it with no owners and no tracking metrics" },
      { id: "m5q38_c", label: "Measuring only how much money the system saves each month" },
      { id: "m5q38_d", label: "Avoiding registering any incident that happens afterward" },
    ],
    correctAnswer: "m5q38_a",
    topic: "Governance",
    difficulty: "hard",
    source: "PDF: Code of Ethics for AI Use",
    feedback:
      "Owners, metrics and monitoring are the basis of governance. Review the code of ethics.",
  },
  {
    id: "m5q39",
    question: "An employee uses AI to decide about people without leaving a trace. What is breached?",
    options: [
      {
        id: "m5q39_a",
        label: "The traceability and the accountability of the decisions",
      },
      { id: "m5q39_b", label: "The speed of the process for settling that single case" },
      { id: "m5q39_c", label: "The popularity of the system among the internal users" },
      { id: "m5q39_d", label: "The operating cost of keeping that tool active" },
    ],
    correctAnswer: "m5q39_a",
    topic: "Accountability",
    difficulty: "hard",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "Without traceability there is no possible accountability. Review the ethical dilemmas lab.",
  },
  {
    id: "m5q40",
    question:
      "Case: AI that decides on credit must be fair, explainable and regulated. Which plan is most complete?",
    options: [
      {
        id: "m5q40_a",
        label: "Audit biases, explain decisions, supervise humans and comply with the law",
      },
      { id: "m5q40_b", label: "Automate everything to eliminate any human intervention" },
      { id: "m5q40_c", label: "Hide the criteria to avoid questions from the applicants" },
      { id: "m5q40_d", label: "Optimize only the approval speed of each single request" },
    ],
    correctAnswer: "m5q40_a",
    topic: "Governance",
    difficulty: "hard",
    source: "OVA: Lab: Ethical Dilemmas",
    feedback:
      "The complete plan combines auditing, explainability, supervision and regulatory compliance.",
  },
];
