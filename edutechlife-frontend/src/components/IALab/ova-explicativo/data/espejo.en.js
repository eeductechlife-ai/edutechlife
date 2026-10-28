export default {
  badge: "Module 1 · Explanation",
  title: "The Mirror of Truth",
  subtitle:
    "What bias in AI is, where it comes from, how to detect it and how to reduce it",
  intro:
    "AI learns from texts written by people, and those texts carry prejudices. A mirror shows what is there: here you will learn to see the biases the AI can reflect and repeat, and what to do so you do not amplify them.",
  objectives: [
    "Define algorithmic bias and explain where it comes from",
    "Recognize four types of bias with examples",
    "Apply a simple test to detect a bias",
    "Propose measures to reduce a bias in a result",
  ],
  sections: [
    {
      title: "1. Where a bias comes from",
      explain: [
        "A bias is a tendency that systematically favors or harms a group of people. An AI system can have it because it learned from data that already had it.",
        "Bias is not always intentional. It can come from the data, from how it was labeled, or from who designed the system and which problem it was meant to solve.",
      ],
      terms: [
        {
          term: "Algorithmic bias",
          def: "A systematically unfair result produced by an automated system.",
        },
        {
          term: "Training data",
          def: "The texts or records the system learned from.",
        },
      ],
      how: [
        "The data reflects past decisions and prejudices.",
        "The system learns those patterns as if they were normal.",
        "It repeats the pattern in its answers and decisions.",
      ],
      example:
        "If a company's hiring data rarely includes women in leadership roles, a system trained on it may associate «leadership» with men.",
      mistake:
        "Thinking that, because it is a machine, it cannot be unfair. If it learns from unfair data, it reproduces the unfairness.",
    },
    {
      title: "2. Four types of bias",
      explain: [
        "There are several forms of bias. Knowing the type helps you look for it in the right place.",
        "Data bias: the data does not represent everyone. Sampling bias: the people measured were chosen badly. Labeling bias: whoever labeled the data had a skewed view. Confirmation bias: the system tends to give what is expected.",
      ],
      terms: [
        {
          term: "Data bias",
          def: "The data does not represent the real population well.",
        },
        {
          term: "Sampling bias",
          def: "The sample was chosen so that some groups are left out.",
        },
        {
          term: "Labeling bias",
          def: "The labels given to the data reflect the prejudices of whoever assigned them.",
        },
      ],
      how: [
        "Ask whom the data represents.",
        "Ask who labeled it and with what criteria.",
        "Check whether the result favors some groups over others.",
      ],
      example:
        "A system to find «good candidates» trained only on profiles from one city may penalize candidates from other regions: sampling bias.",
      mistake:
        "Looking for bias only in the final result. Sometimes it starts in the data or in how it was labeled.",
    },
    {
      title: "3. How to detect a bias",
      explain: [
        "A simple test is to ask the same question changing only one piece of data that should not matter, such as the name, the age or the place of origin, and compare the answers.",
        "If the answer changes unfairly, there is a bias worth reporting and correcting.",
      ],
      terms: [
        {
          term: "Counterfactual test",
          def: "Changing a single piece of data and seeing whether the result changes unfairly.",
        },
        {
          term: "Affected group",
          def: "The people who receive unfair treatment because of the bias.",
        },
      ],
      how: [
        "Choose the data to change (name, age, region).",
        "Ask the same question two or three times, changing only that data.",
        "Compare the answers and note any unfair differences.",
      ],
      example:
        "You ask for a career recommendation for «Ana» and for «Andrés» with the same academic profile. If one recommendation is more ambitious, there is a bias to review.",
      mistake:
        "Testing only once. A bias is confirmed through several tests and different cases.",
    },
    {
      title: "4. Reducing bias",
      explain: [
        "Reducing a bias means changing the process: including more representative data, reviewing the labels, asking for justifications, and keeping a person in charge of decisions that affect others.",
        "No method removes it completely. What matters is detecting it, reporting it and correcting it in time.",
      ],
      terms: [
        {
          term: "Mitigation",
          def: "Measures that reduce a bias without claiming to eliminate it entirely.",
        },
        {
          term: "Human review",
          def: "A person who reviews and decides when the result affects people.",
        },
      ],
      how: [
        "Ask the system to explain its criteria.",
        "Check whether groups are missing from the data and complete it.",
        "Keep a person in charge of decisions that affect others.",
      ],
      example:
        "Before using a selection tool, you request its criteria and test it with cases from different groups. Only then do you decide how to use it.",
      mistake:
        "Trusting that a result is fair because the system says so. It must be verified.",
    },
  ],
  summary: [
    "A bias is a systematic, unfair tendency; AI can learn it from data.",
    "It can come from the data, the sampling, the labeling or the system's design.",
    "The counterfactual test changes one piece of data to see whether the result changes unfairly.",
    "Reducing bias means reviewing data, asking for criteria and keeping a person in charge.",
    "Detecting, reporting and correcting in time matters more than assuming it does not exist.",
  ],
  check: [
    {
      q: "Where can a bias in AI come from?",
      options: [
        "Only from obvious programming errors.",
        "From the data, the labeling or how the system was designed.",
        "From the color of the screen where it is used.",
      ],
      correct: 1,
      feedback:
        "Bias can start in the data, the labels or the design, not only in the code.",
    },
    {
      q: "What is a counterfactual test?",
      options: [
        "Changing a single piece of data and seeing whether the result changes unfairly.",
        "Asking the AI to evaluate itself.",
        "Deleting the data before testing.",
      ],
      correct: 0,
      feedback:
        "Changing one piece of data that should not matter reveals whether there is unfair treatment.",
    },
    {
      q: "A system gives different answers to two identical profiles that differ only in place of origin. What do you do?",
      options: [
        "I accept it, because AI has no prejudices.",
        "I report it and review the data and criteria that produce it.",
        "I always choose the most favorable answer.",
      ],
      correct: 1,
      feedback:
        "An unfair difference between identical profiles is a bias: report it and review where it comes from.",
    },
  ],
};
