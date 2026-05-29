import React from 'react';
import { Scale, Eye, Lock, Shield, Users, Zap } from 'lucide-react';

export const contentData = {
  intro: { title: "Introduction to AI Ethics", text: "Artificial intelligence has arrived to transform areas like medicine, education, and justice. But its power does not make it neutral. AI systems make decisions that affect millions, and they can be incorrect or unfair. Understanding this is an urgent civic skill.", extended: "This module offers tools to use AI responsibly, recognize risks, and mitigate algorithmic biases." },
  cap1: {
    title: "1. Ethical Foundations", text: "AI ethics studies the values and norms that should guide its design and use, always seeking the well-being of all people.",
    principles: [
      { icon: <Scale className="w-5 h-5"/>, name: "Fairness and Justice", desc: "Must not discriminate or favor specific groups." },
      { icon: <Eye className="w-5 h-5"/>, name: "Transparency", desc: "Users should understand how and why AI makes decisions." },
      { icon: <Lock className="w-5 h-5"/>, name: "Privacy", desc: "Protection of personal data and use with consent." },
      { icon: <Shield className="w-5 h-5"/>, name: "Accountability", desc: "There must always be a responsible human or institution." },
      { icon: <Users className="w-5 h-5"/>, name: "Social Benefit", desc: "Must improve the well-being of all society." }
    ]
  },
  cap2: {
    title: "2. Proper Use of AI", text: "Proper use is conscious use that does not replace critical thinking or intellectual authorship.",
    dos: ["Use AI to generate drafts and enrich them with your own judgment.", "Explicitly cite AI use in academic work.", "Verify data against primary sources to avoid hallucinations.", "Use AI as a tutor to expand learning."],
    toolTitle: "Featured Tool: NotebookLM", toolDesc: "NotebookLM is an example of how to use AI responsibly for research, allowing you to centralize sources and verify information with direct citations."
  },
  cap3: {
    title: "3. Risks and Disadvantages", text: "Recognizing risks allows you to use technology with greater intelligence and caution.",
    risks: [
      { name: "Hallucinations", desc: "Generation of false information with the appearance of truth (e.g., non-existent legal citations)." },
      { name: "Labor Impact", desc: "Automation of routine jobs and the need for retraining." },
      { name: "Privacy and Surveillance", desc: "Risks from facial recognition and mass data analysis." },
      { name: "Power Concentration", desc: "Global decisions made by a few technology companies." }
    ],
    critical: "Cognitive Dependency: Delegating thinking to AI reduces the ability to argue and memorize deep learning."
  },
  cap4: {
    title: "4. AI Biases", text: "Biases are systematic errors that reflect historical inequalities present in training data.",
    biases: [
      { name: "Historical Data Bias", desc: "Reflects past discrimination (e.g., gender preference in hiring)." },
      { name: "Representation Bias", desc: "Underrepresentation of minorities (e.g., errors in facial recognition for dark skin)." },
      { name: "Automation Bias", desc: "Excessive trust in AI over expert human judgment." },
      { name: "Cultural Bias", desc: "Foreign cultural frameworks that ignore local perspectives." }
    ]
  }
};

export const gameData = [
  { id: 1, case: "A lawyer uses AI for a trial and presents laws that don't exist.", concept: "Model Hallucination" },
  { id: 2, case: "A scholarship system rejects candidates solely based on their zip code.", concept: "Historical Data Bias" },
  { id: 3, case: "A student stops reading books because AI does all the summaries.", concept: "Cognitive Dependency" },
  { id: 4, case: "A bank cannot explain why its algorithm denied a loan.", concept: "Lack of Transparency" },
  { id: 5, case: "A user assumes the AI is right even though it contradicts their technical manual.", concept: "Automation Bias" }
];
