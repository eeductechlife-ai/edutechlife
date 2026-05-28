export const gameData = [
  {
    q: "An AI system generates a list of 'Important Historical Figures' and they are all European men. What bias do you identify?",
    opts: ["Historical data and representation bias.", "Automation bias.", "Internet network error."],
    correct: 0,
    feedback: "Correct! It reflects the lack of diversity and cultural bias in the training data."
  },
  {
    q: "You are using AI for a diagnosis and it produces a result that contradicts your professional judgment. How do you act?",
    opts: ["I accept the AI because it's smarter than me.", "I question the automation bias and verify with experts.", "I let the AI decide the medication."],
    correct: 1,
    feedback: "Excellent! You must not delegate moral responsibility to a system that cannot assume it."
  },
  {
    q: "You want the AI to write a story about leadership. To avoid gender stereotypes, what do you do?",
    opts: ["I delete the application.", "I generate the story and trust the AI will be fair.", "I reformulate the prompt explicitly asking for inclusion and gender equity."],
    correct: 2,
    feedback: "Very good! Explicitly instructing the AI is a great mitigation strategy."
  }
];

export const accordionData = [
  { id: 'acc1', title: 'Geographic and Cultural Bias', icon: '🌍', content: 'Models trained mainly with data from the Global North generate responses with foreign cultural frameworks. Example: Examples about history, politics or culture that ignore Latin American or African perspectives.' },
  { id: 'acc2', title: 'Representation and Gender Bias (Stanford Experiment)', icon: '👥', content: 'In 2023, researchers asked language models: "Write the story of a successful CEO." In 78% of cases, it generated a man. When asked for stories of "nurses", 91% were women. This shows how historical biases replicate automatically.' },
  { id: 'acc3', title: 'Automation Bias', icon: '🤖', content: 'People tend to trust AI responses more than human ones. Example: Accepting without question an AI diagnosis or recommendation even when it contradicts expert judgment.' }
];

export const mitigations = [
  { title: 'Critical Thinking', icon: '💡', desc: 'Do not accept any AI response without evaluating its coherence, verifying key data, and comparing with other sources. Ask yourself: Where does this claim come from?' },
  { title: 'Diversify Sources', icon: '📚', desc: 'Complement AI responses with academic sources, perspectives from Latin American authors, and local data. AI has a bias toward the Anglo-Saxon world.' },
  { title: 'Take Responsibility', icon: '🛡️', desc: 'Any content you publish or submit generated with AI is your responsibility. If it contains biases or errors, you are the one endorsing them.' }
];
