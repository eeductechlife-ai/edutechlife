export default {
  badge: "Module 4 · Explanation",
  title: "The Grimoire",
  subtitle:
    "Gemini Notebook: a notebook that answers from your sources and shows where each fact comes from",
  intro:
    "Gemini Notebook (formerly NotebookLM) answers from the documents you upload. Here you will learn the terms you need to use it well: source, citation, curation and hallucination, and why the notebook does not replace your own verification.",
  objectives: [
    "Explain what a source-based notebook is",
    "Define source, citation, curation and hallucination",
    "Verify a citation by opening the original passage",
    "Recognize when an answer is not supported",
  ],
  sections: [
    {
      title: "1. What a source-based notebook is",
      explain: [
        "A general chat answers with what it learned during training. A source-based notebook answers with the documents you upload: notes, articles, reports.",
        "That is why it can cite where each statement comes from. A citation does not guarantee the answer is true; it guarantees you can go and check it.",
      ],
      terms: [
        {
          term: "Notebook",
          def: "A workspace with a set of sources and a chat to ask them questions.",
        },
        {
          term: "Source",
          def: "A document you upload to the notebook, with author and date when it has them.",
        },
        {
          term: "Source-based AI",
          def: "A system that grounds its answer in the texts you gave it, not only in what it remembers.",
        },
      ],
      how: [
        "You upload your sources to the notebook.",
        "You ask a concrete question about them.",
        "The answer shows citation numbers that lead to the passage in the document.",
      ],
      example:
        "You upload three articles on solar energy and ask «what initial cost do they mention?». Each figure comes with a citation to the article.",
      mistake:
        "Believing that, because it has citations, the answer is already correct. Open the citation and read the original passage.",
    },
    {
      title: "2. Sources and curation",
      explain: [
        "Curation means choosing, with judgement, what goes into the notebook. More sources do not mean a better answer: a notebook full of disorganized or doubtful documents answers worse.",
        "A reliable source has an identifiable author, a date and references you can check. Primary sources are the original document; secondary sources comment on or summarize it.",
      ],
      terms: [
        {
          term: "Curation",
          def: "Choosing, reviewing and organizing sources before you synthesize them.",
        },
        {
          term: "Primary source",
          def: "The original document: a study, a regulation, an official dataset.",
        },
        {
          term: "Secondary source",
          def: "A text that comments on or summarizes a primary source.",
        },
      ],
      how: [
        "Gather a few sources on the same topic.",
        "Check the author, date and references of each one.",
        "Group the sources by subtopic so you can ask more precise questions.",
      ],
      example:
        "For a health assignment you prefer a ministry report with date and author over an unsigned blog.",
      mistake:
        "Uploading everything you find. A notebook full of noise answers generically or mixes contradictions.",
    },
    {
      title: "3. Citation and verification",
      explain: [
        "A citation is the reference that links a statement to the exact passage of the source it came from. Verifying means opening that passage and confirming it says what the answer claims.",
        "If the citation does not exist, or the passage says something else, the statement is not supported.",
      ],
      terms: [
        {
          term: "Citation",
          def: "A number or reference that leads to the passage of the source a statement comes from.",
        },
        {
          term: "Verify",
          def: "To check that the cited passage says what the answer states.",
        },
      ],
      how: [
        "Tap the citation number.",
        "Read the passage in the original document.",
        "Confirm they match. If they do not, do not use the statement.",
      ],
      example:
        "The answer says «30% of households…». Opening the citation, the document says «3%». That figure is corrected or discarded.",
      mistake:
        "Copying a figure just because it has a citation, without opening it.",
    },
    {
      title: "4. Hallucination and limits",
      explain: [
        "A hallucination is an answer that sounds certain but is not supported by the source: an invented figure, a citation that does not exist, or a conclusion nobody wrote.",
        "Reducing the risk helps, but does not remove it. That is why the notebook does not replace your reading or your judgement.",
      ],
      terms: [
        {
          term: "Hallucination",
          def: "A fact the AI produces with confidence that is not in its sources.",
        },
        {
          term: "Synthesis",
          def: "A summary that joins ideas from several sources into your own conclusion.",
        },
      ],
      how: [
        "If a statement has no citation, treat it as a hypothesis.",
        "If the citation says something different, discard the statement.",
        "Write the conclusion in your own words and cite your sources.",
      ],
      example:
        "You ask for «a summary of the three articles» and a fourth author you did not upload appears. That is a hallucination: discard it and review the notebook.",
      mistake:
        "Asking for data that is not in your sources and using it because «the AI found it».",
    },
  ],
  summary: [
    "A source-based notebook answers from the documents you upload.",
    "Curating means choosing few reliable sources, on the same topic, with author and date.",
    "A citation leads to the original passage: open it and confirm it says the same.",
    "A hallucination is a confident statement with no support in your sources.",
    "The notebook helps you study, but the conclusion and the verification are yours.",
  ],
  check: [
    {
      q: "What makes a notebook answer verifiable?",
      options: [
        "That it is long and well written.",
        "That it has a citation you can open and check.",
        "That the AI says it is confident.",
      ],
      correct: 1,
      feedback:
        "The citation leads to the original passage; opening it is what lets you check the fact.",
    },
    {
      q: "A figure in the answer does not appear in any of your sources. What do you do?",
      options: [
        "I use it, because it sounds credible.",
        "I discard it or confirm it at an original source before using it.",
        "I ask it to round it so it looks more precise.",
      ],
      correct: 1,
      feedback:
        "A figure that is not in your sources is not verifiable: do not use it until you confirm it.",
    },
    {
      q: "What is a primary source?",
      options: [
        "A document that comments on another document.",
        "The original document, such as a study or an official dataset.",
        "The source that appears first in the search.",
      ],
      correct: 1,
      feedback:
        "The primary source is the original document; secondary sources comment on or summarize it.",
    },
  ],
};
