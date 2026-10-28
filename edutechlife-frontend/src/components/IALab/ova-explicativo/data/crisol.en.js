export default {
  badge: "Module 4 · Explanation",
  title: "The Crucible",
  subtitle:
    "How to melt several sources into your own synthesis and evaluate it with a critical eye",
  intro:
    "A crucible melts different metals to make a new alloy. Synthesizing does the same with sources: it joins what several documents say into your own conclusion, and then examines it with judgement. Here you will learn the terms to do it well.",
  objectives: [
    "Tell primary and secondary sources apart in a synthesis",
    "Build a cross-synthesis matrix",
    "Explain what a representative sample and confirmation bias are",
    "Distinguish correlation from causation",
  ],
  sections: [
    {
      title: "1. Cross-synthesis",
      explain: [
        "To synthesize is to join ideas from several sources into one conclusion. Cross-synthesis compares the sources with each other: what they agree on, where they differ, and what none of them says.",
        "A two-axis table (sources in rows, ideas in columns) makes the crossing visible and stops you from relying on a single voice.",
      ],
      terms: [
        {
          term: "Synthesis",
          def: "Your own conclusion that joins ideas from several sources.",
        },
        {
          term: "Cross-synthesis",
          def: "Comparing several sources to see agreements, differences and gaps.",
        },
        {
          term: "Matrix",
          def: "A table crossing sources and topics to compare without losing detail.",
        },
      ],
      how: [
        "Write the sources in rows and the topics in columns.",
        "Mark in each cell what each source says about each topic.",
        "Write the conclusion from the agreements and the differences.",
      ],
      example:
        "Three reports on solar energy: two agree on the initial cost and one leaves it out. The synthesis says «two sources say the initial cost is high; the third does not mention it».",
      mistake:
        "Writing a summary of each source separately and calling it a synthesis. Without crossing them, there is no conclusion of your own.",
    },
    {
      title: "2. Primary and secondary sources in a synthesis",
      explain: [
        "When you synthesize, prefer the primary source: the original document. A secondary one can simplify or change a figure without you noticing.",
        "If you only have secondary sources, say so in the synthesis and look for the primary one when possible.",
      ],
      terms: [
        {
          term: "Primary source",
          def: "The original document: a study, a regulation, an official record.",
        },
        {
          term: "Secondary source",
          def: "A text that comments on, summarizes or interprets a primary source.",
        },
      ],
      how: [
        "Identify which source is primary and which secondary.",
        "Use the primary one for data and the secondary one for context.",
        "Make the origin of each figure clear in the synthesis.",
      ],
      example:
        "A blog says «40% of young people use AI». The original survey is the primary source; without it, the 40% cannot be used with confidence.",
      mistake:
        "Citing the secondary source as if it were the source of a figure you never checked in the original.",
    },
    {
      title: "3. Sample and confirmation bias",
      explain: [
        "A sample is the group of people or cases studied. It is representative if it reflects the population it talks about well. A small or convenience sample can lead to false conclusions.",
        "Confirmation bias is seeking and accepting only the sources that confirm what you already thought. An honest synthesis also includes sources that contradict your idea.",
      ],
      terms: [
        {
          term: "Representative sample",
          def: "A studied group that reflects the whole population well.",
        },
        {
          term: "Confirmation bias",
          def: "The tendency to look for and accept only what confirms what we already believe.",
        },
      ],
      how: [
        "Ask how many people or cases were studied, and who they were.",
        "Look for sources that contradict your hypothesis.",
        "Write the synthesis including what does not fit.",
      ],
      example:
        "A survey of 30 students from one school cannot support a claim about all young people in the country.",
      mistake:
        "Accepting a general conclusion from a small or very specific sample.",
    },
    {
      title: "4. Correlation is not causation",
      explain: [
        "Correlation means two things change together. Causation means one produces the change in the other. Occurring together does not prove that one causes the other.",
        "Before claiming a cause, look for another explanation: a third variable or simple coincidence.",
      ],
      terms: [
        {
          term: "Correlation",
          def: "A relationship in which two variables tend to change together.",
        },
        {
          term: "Causation",
          def: "A relationship in which one variable produces the change in another.",
        },
      ],
      how: [
        "Identify the two variables that appear together.",
        "Ask whether a third variable could explain both.",
        "Claim a cause only if the source demonstrates it.",
      ],
      example:
        "Countries with more ice cream shops have more drownings: temperature explains both. Correlation does not mean ice cream shops cause drownings.",
      mistake:
        "Claiming one thing causes another because they appear together on a chart.",
    },
  ],
  summary: [
    "To synthesize is to join ideas from several sources; cross-synthesis compares agreements, differences and gaps.",
    "Use the primary source for data and recognize when only secondary ones exist.",
    "A sample must represent the population; confirmation bias requires including what contradicts you.",
    "Correlation is not causation: look for other explanations before claiming a cause.",
    "A good synthesis is your own conclusion, with clear origins and stated limits.",
  ],
  check: [
    {
      q: "What does cross-synthesis do?",
      options: [
        "It copies each source's summary separately.",
        "It compares the sources to see agreements, differences and gaps.",
        "It picks the longest source and uses it.",
      ],
      correct: 1,
      feedback:
        "Cross-synthesis compares sources with each other; without that crossing there is no conclusion of your own.",
    },
    {
      q: "A survey of 30 students from one school. Which conclusion is valid?",
      options: [
        "What all young people in the country think.",
        "What those 30 students think, without generalizing.",
        "Nothing: surveys are never useful.",
      ],
      correct: 1,
      feedback:
        "A small, specific sample only describes that group; it does not allow generalization.",
    },
    {
      q: "Two variables rise together. What can you claim?",
      options: [
        "That one causes the other.",
        "That they are related, but you must check whether there is a cause.",
        "That one of them is false.",
      ],
      correct: 1,
      feedback:
        "Correlation does not prove causation: look for another explanation before claiming a cause.",
    },
  ],
};
