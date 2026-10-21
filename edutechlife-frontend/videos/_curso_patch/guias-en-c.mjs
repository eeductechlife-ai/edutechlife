// English versions of the Module 4 guides (Gemini Notebook and its templates).
// The rename from NotebookLM to Gemini Notebook (16 July 2026) is confirmed.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const EN_M4_GUIA = {
  lang: "en",
  chip: "Module 4 · Gemini Notebook",
  module: 4,
  title: "Gemini Notebook",
  subtitle: "Teaching guide: your own sources, cited answers, summaries and audio for studying and working",
  edition: "Edition 2026",
  art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "Gemini Notebook is a research notebook that answers <strong>only from your sources</strong> and cites where each answer comes from. It is ideal for studying, synthesizing documents and turning long material into summaries, mind maps, study cards and audio.",
  kpis: [["Jul 16", "date of the renaming"], ["3–5", "sources to start with"], ["Citations", "every answer shows its source"]],
  sections: [
    {
      h: "The renaming",
      html: `<p>On <strong>16 July 2026</strong> Google renamed NotebookLM as <strong>Gemini Notebook</strong>. It is the same product: the name changed, and notebooks you started in Gemini sync with the app.</p>
${box("tip", "If you see NotebookLM in a tutorial", "<p>It is the same tool. Find the notebook under its current name and check the options in your account, since some features roll out in stages.</p>")}`,
    },
    {
      h: "What makes it different from a chat",
      html: `${cards([
  ["Only your sources", "It answers from the documents you uploaded. If the information is not there, it says so."],
  ["Verifiable citations", "Every claim carries a number that leads to the exact passage in the document."],
  ["Turns what you read into study material", "Generates summaries, mind maps, study cards, quizzes and audio."],
  ["Study without invention", "Ideal for reviewing your own material instead of relying on what the model remembers."],
])}`,
    },
    {
      h: "Create your first notebook",
      html: `${steps([
  "Sign in with your Google account and create a new notebook with a name that describes the topic.",
  "Upload three to five quality sources: notes, a journal article, an official report.",
  "Wait for the sources to be processed and review the summary the notebook proposes.",
  "Ask one specific question and open a citation to check the original passage.",
])}
${figure("/ialab-resources/modulo4/ilustraciones/cuaderno-fuentes.jpg", "Upload your sources: the notebook only answers with what they contain.", "55%")}`,
    },
    {
      h: "Choosing good sources",
      html: `<p>Source quality sets answer quality. More sources do not always mean better results: a notebook with 50 messy documents answers worse than one with five well-chosen ones.</p>
${table(["Good source", "Weak source"], [
  ["An official report with date and author", "Text with no author, no date and no references"],
  ["A peer-reviewed journal article", "An anonymous publication with no references"],
  ["Your own notes, ordered by topic", "Loose notes that contradict each other"],
  ["Documents from the same period and topic", "A mix of dates that changes the conclusion"],
])}`,
    },
    {
      h: "Asking with citations",
      html: `<p>Answers include numbers in square brackets. Each number opens the passage in the document where the claim comes from.</p>
${checks([
  "Open at least one citation for every important answer.",
  "If a claim has no citation, do not use it until you verify it.",
  "Ask for comparisons: “Where do these sources disagree?”",
])}
${box("warn", "Working rule", "<p>An answer without citations is a hypothesis. An answer with citations still needs your judgment: confirm that the passage says what the answer claims.</p>")}`,
    },
    {
      h: "Study formats",
      html: `${table(["Format", "What it is for", "How to ask for it"], [
  ["<b>Summary</b>", "Understanding the main idea in minutes", "“Summarize the sources in five ideas, each with its citation”"],
  ["<b>Mind map</b>", "Seeing the relationships between concepts", "“Map the key concepts and how they relate”"],
  ["<b>Study cards</b>", "Memorizing terms and definitions", "“Create 15 question-and-answer cards with citations”"],
  ["<b>Quiz</b>", "Checking what you understood", "“Create 10 multiple-choice questions with explanations”"],
])}`,
    },
    {
      h: "Audio Overviews: review by listening",
      html: `<p>Audio summaries turn your sources into a conversation between two voices. They are excellent for reviewing on the move. Use them as a first pass, not as a replacement for the critical sources: afterwards, open the citations you care about.</p>
${figure("/ialab-resources/modulo4/ilustraciones/audio-overview.jpg", "Listen first; then verify in the citations.", "52%")}
${box("tip", "Getting the most out of it", "<p>Listen once without pausing, then write three ideas in your own words and compare them with the citations.</p>")}`,
    },
    {
      h: "Analysis with code",
      html: `<p>Gemini Notebook can write and run code in a secure cloud environment to analyze your sources in more depth. This feature rolls out by plan: check your account to see whether it is available. Before using its results, verify the figures against a sample.</p>`,
    },
    {
      h: "Curation and responsible use",
      html: `<p>Curating means choosing what goes into the notebook and how it is used. Before you share a generated summary:</p>
${checks([
  "I checked the figures and citations against the original document.",
  "I did not include personal data about third parties or confidential information.",
  "I disclosed that the summary was generated with AI, where appropriate.",
])}
${figure("/ialab-resources/modulo4/ilustraciones/equipo-curaduria.jpg", "Curate as a team: review, cite and decide what enters the notebook.", "100%")}
<p class="muted">In Colombia, if you work with personal data, see <strong>Law 1581 of 2012</strong>.</p>`,
    },
    {
      h: "Worked example: preparing for an exam in 60 minutes",
      html: `${steps([
  "<b>Minutes 0–10:</b> upload your three main sources (notes, a chapter, an official guide) and ask for a summary of the central ideas with their citations.",
  "<b>Minutes 10–25:</b> ask for a mind map of the concepts and how they relate. Check that every relationship has a citation.",
  "<b>Minutes 25–40:</b> generate 15 study cards with citations. Study first the ones you get wrong.",
  "<b>Minutes 40–60:</b> ask for a 10-question quiz with explanations and citations. Answer without looking, then review each error against the original citation.",
])}
${box("tip", "A sign you studied well", "<p>You can explain each concept without looking at your notes, and you can find the citation that supports it. If you cannot, go back to the source.</p>")}`,
    },
    {
      h: "Practice plan",
      html: `${steps([
  "Create a notebook with three sources on a topic you are studying.",
  "Ask five questions and verify one citation for each.",
  "Generate a mind map and a set of study cards.",
  "Listen to an Audio Overview and write three ideas in your own words.",
  "Compare two sources and record where they contradict each other.",
])}`,
    },
  ],
  closing: `${checks([
    "I use Gemini Notebook with a few high-quality, well-chosen sources.",
    "I verify citations before I use a claim.",
    "I turn material into study formats that make me recall it.",
    "I protect personal data and disclose AI use where appropriate.",
  ])}`,
};

export const EN_M4_PLANTILLAS = {
  lang: "en",
  chip: "Module 4 · Templates",
  module: 4,
  title: "The Notebook of the Future",
  subtitle: "Summary and study templates for each type of document in Gemini Notebook",
  edition: "Toolkit 2026",
  art: null,
  lead: "A good summary starts with a good instruction. These templates help you ask for summaries by document type and goal, and check that the result stays faithful to the source.",
  kpis: [["6", "ready-to-use templates"], ["4", "steps to review a summary"], ["1", "rule: every idea needs a citation"]],
  sections: [
    {
      h: "How to use these templates",
      html: `${steps([
  "Choose the template that fits the document type.",
  "Replace the brackets with your real context.",
  "Ask for a citation for each idea and check two of them.",
  "Save the summary with the source name and date.",
])}`,
    },
    {
      h: "Template 1: academic document",
      html: `<p><b>Use it for:</b> articles, theses, book chapters.</p>
<div class="prompt">Summarize [document] for [audience] in five ideas.
For each idea: the claim, the main evidence with its citation and the study's limitation.
End with the three questions that remain open.</div>`,
    },
    {
      h: "Template 2: business report",
      html: `<p><b>Use it for:</b> management reports, proposals, meeting minutes.</p>
<div class="prompt">Summarize [document] for a decision about [decision].
Deliver: 1) the main result with figure and citation, 2) risks, 3) actions with owner if one appears, 4) missing data.</div>`,
    },
    {
      h: "Template 3: technical document",
      html: `<p><b>Use it for:</b> manuals, specifications, software documentation.</p>
<div class="prompt">Explain [document] to someone without a technical background.
Include: what it does, how to use it step by step, common errors and which section covers each point.</div>`,
    },
    {
      h: "Template 4: regulation or legal document",
      html: `<p><b>Use it for:</b> rules, internal policies, contracts. A summary orients you; it does not replace legal advice.</p>
<div class="prompt">Summarize the obligations and deadlines in [document].
Cite each article or clause.
Do not interpret legal consequences: mark what a lawyer should review.</div>`,
    },
    {
      h: "Template 5: news and research",
      html: `<p><b>Use it for:</b> press articles, market reports, case studies.</p>
<div class="prompt">Compare [source A] and [source B] on [topic].
Deliver: the data they agree on, the data where they differ, which source has more support and why.</div>`,
    },
    {
      h: "Template 6: personal study",
      html: `<p><b>Use it for:</b> preparing for an exam or reviewing a topic.</p>
<div class="prompt">Create 10 multiple-choice questions about [topic] based only on these sources.
For each question: four options, the correct one, the citation that supports it and an explanation of why the others are wrong.</div>`,
    },
    {
      h: "How to review a summary",
      html: `${table(["Step", "Review question"], [
  ["1. Faithfulness", "Does every idea appear in the original document?"],
  ["2. Figures", "Do the figures match the source exactly?"],
  ["3. Nuance", "Was any condition, exception or limitation lost?"],
  ["4. Use", "Is what I plan to do with the summary consistent with what the source says?"],
])}
${box("warn", "Before you share", "<p>A shared summary is your responsibility. Verify it, disclose AI use where appropriate and do not include personal data about others.</p>")}`,
    },
  ],
  closing: `${checks([
    "I chose the template for the document type.",
    "I checked every figure and citation against the source.",
    "I disclosed AI use and protected personal data.",
  ])}`,
};
