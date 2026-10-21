// English versions of the Module 2 (ChatGPT) and Module 3 (Gemini) guides.
// Model names are kept generic: versions and plan limits change, so readers are sent to their account selector.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const EN_M2_CHATGPT = {
  lang: "en",
  chip: "Module 2 · ChatGPT",
  module: 2,
  title: "The Complete ChatGPT Guide",
  subtitle: "From blueprint to build: tools, Projects, GPTs and agents for working with judgment",
  edition: "Edition 2026",
  art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "ChatGPT is not a search engine or an encyclopedia. It is a collaborator that writes, analyzes and carries out tasks when you give it <strong>context</strong>, a <strong>goal</strong> and <strong>review</strong>. This guide gives you what you need to use it like a professional.",
  kpis: [["6", "elements of a strong prompt"], ["3", "steps to verify before using"], ["8", "tools in the ecosystem"]],
  sections: [
    {
      h: "The ecosystem map",
      html: `<p>Each tool solves a different kind of work. Choosing the right one saves time and reduces errors.</p>
${table(["Tool", "What it is for", "When to use it"], [
  ["<b>Chat</b>", "Thinking, writing, summarizing and explaining", "Almost always the starting point"],
  ["<b>Web search</b>", "Recent data with sources", "Figures, prices, news, current rules"],
  ["<b>Data analysis</b>", "Processing CSV, Excel and tables; creating charts", "When there are numbers to check"],
  ["<b>Image generation</b>", "Illustrations and visual pieces", "Visual ideas; text inside images is written separately"],
  ["<b>Canvas</b>", "Editing a document or code side by side with the conversation", "Long texts that change over time"],
  ["<b>Projects</b>", "Grouping instructions and files for one piece of work", "When the same context keeps coming back"],
  ["<b>GPTs</b>", "Assistants with their own instructions and knowledge", "Recurring tasks with the same rules"],
  ["<b>Agent</b>", "Multi-step tasks carried out under your supervision", "Researching, comparing and building a deliverable"],
])}`,
    },
    {
      h: "Choosing the right model",
      html: `<p>ChatGPT offers several models from the GPT-6 family. Their names, limits and availability <strong>depend on your plan</strong> and change often. What stays stable is the decision rule:</p>
${cards([
  ["Fast model", "Drafts, summaries, emails, ideas, translations and simple tasks."],
  ["Reasoning or more powerful model", "Complex analysis, decisions with several factors, long documents and logic-heavy work."],
])}
${box("warn", "Before you decide", "<p>Open the model selector in your account: what you see depends on your plan. A more powerful model is not always better: it is slower and uses more resources. Use it when the task justifies it.</p>")}`,
    },
    {
      h: "Prompts that work: the six elements",
      html: `<p>A strong prompt answers six questions. Not every one is needed every time, but the more you answer, the less the model has to guess.</p>
${table(["Element", "Question it answers", "Example"], [
  ["<b>Role</b>", "Who should answer?", "You are a customer-care advisor at a language school in Manizales."],
  ["<b>Context</b>", "What happened, and what do we know?", "A student asked for a refund after a class was cancelled."],
  ["<b>Task</b>", "What should it produce?", "Write an empathetic email that explains the refund policy."],
  ["<b>Format</b>", "What should it look like?", "Three paragraphs, 150 words at most, no lists."],
  ["<b>Constraints</b>", "What must it avoid?", "Do not promise dates or amounts that are not in the policy."],
  ["<b>Examples</b>", "What does a good result look like?", "Include an example of a warm, professional tone."],
])}
<h3>A real comparison</h3>
${box("warn", "Weak", `<div class="prompt">Write an email for customers.</div>`)}
${box("tip", "Strong", `<div class="prompt">You are a customer-care advisor at a language school in Manizales.
Context: a student asked for a refund after a class was cancelled.
Task: write an empathetic email that explains the refund policy.
Format: three paragraphs, 150 words at most, no lists.
Constraints: do not promise dates or amounts that are not in the policy.</div>`)}
<p class="muted">Iterate: ask for small changes ("shorten the second paragraph") instead of starting over, and compare versions before accepting one.</p>`,
    },
    {
      h: "Web search and data analysis",
      html: `<h3>Web search</h3>
<p>Turn it on when you need recent information. Always ask for sources and open at least one before using a figure. If an answer cites no sources, treat it as a hypothesis.</p>
<h3>Data analysis</h3>
<p>Upload your file (CSV or Excel), state the specific question and ask for the method. Check the result against a small sample, and ask for the steps or the code used.</p>
${box("tip", "Good question", "<p>What is the monthly change in enrollments between January and September? Show me the table, the method and a bar chart, and tell me if any months have missing data.</p>")}`,
    },
    {
      h: "Projects: context that does not have to be repeated",
      html: `<p>A <strong>Project</strong> groups instructions and files for one piece of work. Every conversation inside the Project uses that context without you pasting it again.</p>
${figure("/ialab-resources/modulo2/portada-chatgpt.jpg", "One space for each piece of work, with its own context.", "60%")}
${checks([
  "Create one Project per topic, not one giant Project for everything.",
  "Write clear instructions: role, tone, limits and what must always be checked.",
  "Upload only the files you need, and review what each one contains.",
])}`,
    },
    {
      h: "Custom GPTs: assistants built for you",
      html: `${box("warn", "Status of GPTs", "<p>OpenAI has announced it will retire custom GPTs on provisional dates: check in your account whether your GPT is still available, and consider moving its instructions to a Project.</p>")}
<p>A GPT combines three parts: <strong>instructions</strong> (role, tone and limits), <strong>knowledge</strong> (reference files) and, if you need them, <strong>actions</strong> (connections to other services).</p>
${box("warn", "Before you share a GPT", "<p>Decide who can use it and review which files it contains. Never load personal data about others, minors' data or confidential documents without authorization.</p>")}
<h3>How to evaluate a GPT before sharing it</h3>
<p>A GPT can look good in your first conversation and fail on a real case. Test it with these five cases before you share it.</p>
${table(["Test", "What the GPT should do"], [
  ["Normal case", "Handles the task it was designed for"],
  ["Edge case", "Asks for the missing information before answering"],
  ["Out of scope", "Says clearly that it cannot help and suggests whom to ask"],
  ["Sensitive data", "Neither asks for nor repeats personal or minors' data"],
  ["Consistency", "Keeps the tone and rules through the whole conversation"],
])}`,
    },
    {
      h: "The agent: multi-step tasks",
      html: `<p>The agent carries out a sequence of steps (searching, comparing, summarizing and building a deliverable). You stay in control: <strong>you approve each step</strong> before using the result.</p>
${steps([
  "Define the deliverable: what must exist at the end and in which format.",
  "Set the limits: permitted sources, search scope and data it must not use.",
  "Review the plan the agent proposes before it runs.",
  "Verify every source and every figure in the final result.",
])}`,
    },
    {
      h: "Applications and connectors",
      html: `<p>ChatGPT can connect to external applications (for example travel, music, design or productivity tools). Each connection asks for permissions that you should read before you approve them.</p>
${figure("/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg", "Connections multiply what the assistant can do: so does the responsibility for each one.", "38%")}
${checks([
  "Connect only the applications you will actually use.",
  "Read the permissions each one asks for before approving them.",
  "Disconnect what you no longer use. Never give passwords in the chat.",
])}`,
    },
    {
      h: "Verify before you use",
      html: `<p>Models can be wrong with confidence. Verification is part of the work, not an optional step.</p>
${steps([
  "<b>Sources:</b> does every fact have a source you can open?",
  "<b>Figures and names:</b> did you check them against the original?",
  "<b>Sense:</b> does the result meet the goal and suit the audience?",
])}
${box("tip", "Golden rule", "<p>If a figure, a quote or a rule matters for your decision, verify it in the original source before using it.</p>")}`,
    },
    {
      h: "Personal data and minors",
      html: `<p>In Colombia, the processing of personal data is governed by <strong>Law 1581 of 2012</strong>. Minimize: share only what is necessary, anonymize before uploading, and never load minors' data, identity documents or third parties' financial information.</p>`,
    },
    {
      h: "Worked example: a commercial proposal",
      html: `<p>Goal: prepare a three-page proposal for the principal's office of a school. Here is the full process in four steps.</p>
${steps([
  "<b>First prompt with the six elements:</b> role (education advisor), context (a school of 900 students in Manizales), task (a teacher training proposal on AI), format (three pages, with objective, a three-month plan and pricing), constraints (no guaranteed results).",
  "<b>Review the first answer:</b> it shows what is missing. Here, the price has no assumptions and the tone is too sales-driven.",
  "<b>Iterate one change at a time:</b> “Keep the structure. Change the tone to institutional and explain the price per student with its assumptions.”",
  "<b>Verify before sending:</b> ask for sources for the market figures, open two of them and adjust anything you cannot confirm.",
])}
<div class="prompt">You are an education advisor. Context: a school of 900 students in Manizales that wants to train its teachers in AI.
Task: write a three-page proposal with objective, a three-month plan and price per student.
Format: clear headings and a schedule table.
Constraints: institutional tone; do not promise guaranteed results; mark every market figure with [VERIFY].</div>`,
    },
    {
      h: "Practice plan: five steps",
      html: `${steps([
  "Create a Project for a real piece of your own work and write its instructions.",
  "Write a request with the six elements and compare it with a weak version.",
  "Run a search with sources and verify two of them.",
  "Analyze a small table and ask for the method and a chart.",
  "Design a GPT with instructions, limits and a test with three real cases.",
])}`,
    },
  ],
  closing: `${checks([
    "I chose the model for the task and checked the selector for my plan.",
    "My requests include goal, context, format and constraints.",
    "I verified sources and figures before using a result.",
    "I did not load personal or minors' data without authorization.",
  ])}`,
};

export const EN_M3_GEMINI = {
  lang: "en",
  chip: "Module 3 · Gemini",
  module: 3,
  title: "Gemini in Practice",
  subtitle: "Google's AI ecosystem, Deep Research and workflows for investigating with verifiable sources",
  edition: "Edition 2026",
  art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "Gemini is Google's family of models for conversation, analysis and research. Its biggest advantage is that it <strong>lives where you already work</strong>: Gmail, Docs, Drive and Search. Here you will learn to use it for research without letting it invent data.",
  kpis: [["5", "products in the ecosystem"], ["4", "steps in Deep Research"], ["3", "sources needed before you conclude"]],
  sections: [
    {
      h: "What Gemini is today",
      html: `<p>Gemini is developed by Google DeepMind and is available in the Gemini app, in Google Search and inside Google Workspace. Google updates its models often, so the version you use depends on your account.</p>
${box("tip", "Check your version", "<p>Open the model selector in your account and note which version you have. If a tutorial mentions a different one, it has probably changed.</p>")}`,
    },
    {
      h: "The ecosystem you already use",
      html: `${table(["Product", "What it adds", "Example of use"], [
  ["<b>Gmail</b>", "Summaries and drafts of long threads", "Summarize 30 emails from a supplier and list the open commitments."],
  ["<b>Docs</b>", "Drafting, rewriting and tone review", "Turn your class notes into a text with an introduction and a conclusion."],
  ["<b>Drive</b>", "Searching and summarizing your own files", "Find where you mentioned a budget across your documents from this year."],
  ["<b>Sheets</b>", "Analyzing tables and suggesting formulas", "Calculate the average per course and flag unusual values."],
  ["<b>Search</b>", "Answers with links to sources", "Compare two rules or prices and review the sites it cites."],
])}`,
    },
    {
      h: "Deep Research: multi-step investigation",
      html: `<p>Deep Research explores dozens of sources, synthesizes them and delivers a report. It is powerful, but <strong>you define the question and verify the result</strong>.</p>
${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "Deep Research explores sources; you review the plan and the report.", "55%")}
${steps([
  "<b>Define the question:</b> topic, audience, time frame and what to exclude.",
  "<b>Review the plan:</b> the researcher proposes its search lines; adjust what is missing or unnecessary.",
  "<b>Read the report with its sources:</b> open at least three sources that support the key conclusions.",
  "<b>Ask for the limitations:</b> what could it not verify? Do not use that part without further review.",
])}
<h3>Worked example: a market report</h3>
<p>Example: investigate demand for AI courses for adults in Colombia.</p>
<div class="prompt">Investigate demand for AI courses for adults in Colombia over the last two years.
Audience: the director of a continuing-education institution.
Deliver: 1) a five-line executive summary, 2) five findings with source and date, 3) figures that conflict between sources, 4) what you could not verify.</div>
${box("warn", "Before you use the report", "<p>Open three sources that support its main conclusions. If a figure does not appear in the source it cites, discard it.</p>")}`,
    },
    {
      h: "Investigating without invented facts",
      html: `<p>A good research workflow separates three things: <strong>facts with a source</strong>, <strong>interpretations</strong> and <strong>assumptions</strong>. Ask for that separation explicitly.</p>
${box("warn", "Warning signs", "<ul><li>A figure with no source, or a source that does not contain it.</li><li>A name or quote you cannot find when you search for it.</li><li>An answer that sounds very certain about a recent topic.</li></ul>")}`,
    },
    {
      h: "Multimodal: text, images, audio and video",
      html: `<p>Gemini can analyze documents, images, charts, audio and video. Use it to extract information from a chart, transcribe a recording or compare two documents. Check the size and format limits of your plan.</p>
${figure("/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg", "Multimodal models combine text, images and audio in a single workflow.", "38%")}`,
    },
    {
      h: "A research prompt",
      html: `<div class="prompt">Investigate [topic] for [audience].
Look for sources from the last [years] years from official bodies, universities or recognized media.
Deliver: 1) a five-line summary, 2) findings with their source, 3) contradictions between sources.
Cite every claim with its source and separate facts from interpretations.
State what you could not verify.</div>`,
    },
    {
      h: "Privacy and permissions",
      html: `<p>Before you connect Gmail, Drive or Docs, check what permissions it asks for and grant only those you need. Do not upload personal data about others, medical records, minors' data or financial information without authorization. In Colombia, <strong>Law 1581 of 2012</strong> applies.</p>`,
    },
    {
      h: "Common mistakes",
      html: `${table(["Mistake", "What happens", "How to avoid it"], [
  ["Accepting the first result", "Unverified data gets used", "Open and check the key sources"],
  ["Questions that are too broad", "Generic answers", "Narrow the topic, audience and period"],
  ["Trusting the summary, not the original", "Nuance gets lost", "Read the part of the original that supports each conclusion"],
  ["Uploading sensitive data", "Privacy risk", "Anonymize before uploading"],
])}`,
    },
    {
      h: "Worked example: grading a report",
      html: `<p>Use this rubric to decide whether a report is ready for a decision. Score each criterion as strong, partial or insufficient.</p>
${table(["Criterion", "Strong", "Partial", "Insufficient"], [
  ["Sources", "Every finding has a verifiable source and date", "Some sources without a date", "Claims with no source"],
  ["Accuracy", "Figures match the original source", "Rounded figures without explanation", "Figures that are not in the source"],
  ["Nuance", "Points out contradictions and conditions", "Presents only one version", "Presents the conclusion as final"],
  ["Limitations", "States what it could not verify", "Mentions limits in general terms", "States no limits"],
])}`,
    },
    {
      h: "Field exercises",
      html: `${steps([
  "<b>Local map:</b> research three competitors in your city using public sources. Deliver a table with price, offer and source.",
  "<b>Verification:</b> take a news item that reached you on WhatsApp and check it with Search. Note which sources confirm or contradict it.",
  "<b>Report with Deep Research:</b> research a topic from your field, verify three sources and rewrite the report in your own words.",
])}`,
    },
  ],
  closing: `${checks([
    "I define the question, audience and scope before I investigate.",
    "I verify at least three sources before I use a conclusion.",
    "I separate facts, interpretations and assumptions.",
    "I check permissions and do not share sensitive data about others.",
  ])}`,
};

export const EN_M3_PRACTICA = {
  lang: "en",
  chip: "Module 3 · Practice",
  module: 3,
  title: "Gemini in Practice: Field Exercises",
  subtitle: "Templates, field exercises and evidence tables for investigating with sources",
  edition: "Templates 2026",
  art: null,
  lead: "Investigating well means checking. These templates take Gemini into real cases, ask for sources in every answer, and leave a record of what you verified.",
  kpis: [["4", "field exercises"], ["5", "columns in the evidence table"], ["3", "sources before you conclude"]],
  sections: [
    {
      h: "Before you start",
      html: `<p>Gemini changes often. Before each exercise, check which model your account offers and which features your plan includes. Note the date of your research: a source from two years ago may no longer be valid.</p>`,
    },
    {
      h: "Exercise 1: a local competitor map",
      html: `<p>Identify three competitors in your city or sector and compare them using public sources.</p>
<div class="prompt">Research the three main [service] providers in [city].
For each one, deliver: value proposition, published price, contact channel and the source of each fact.
If a fact does not appear in a public source, write “not verified”.</div>`,
    },
    {
      h: "Exercise 2: verify a news item",
      html: `${steps([
  "Copy the headline and the sentence that caught your attention most.",
  "Ask Gemini to find sources that confirm it and sources that contradict it.",
  "Open at least two primary sources (official bodies, media with named authors).",
  "Classify the item: confirmed, partial, not verified or false.",
])}`,
    },
    {
      h: "Exercise 3: a report with Deep Research",
      html: `<div class="prompt">Investigate [topic] for [audience], using sources from the last [years] years.
Deliver: 1) a five-line summary, 2) findings with their source, 3) contradictions between sources, 4) what you could not verify.</div>
${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "A good report is a verified report.", "45%")}
${box("warn", "Before you use the report", "<p>Open three sources that support the key conclusions. If a figure does not appear in the cited source, do not use it.</p>")}`,
    },
    {
      h: "Exercise 4: summarize your email thread",
      html: `<p>If you have a long email thread, you can ask for a summary of the open decisions. Always check the summary against the original thread before replying.</p>
<div class="prompt">Summarize this email thread as: 1) context in two lines, 2) decisions made, 3) open items with owner and date if one appears.
Do not invent dates or owners: if they are not in the thread, write “not stated”.</div>`,
    },
    {
      h: "Evidence table",
      html: `<p>Keep a record of what you researched. Every important claim needs a row.</p>
${table(["Claim", "Source", "Date", "Verified (yes / no)", "Notes"], [
  ["E.g.: the price rose 10%", "Link or official document", "Publication date", "Yes", "Checked in the original"],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
])}`,
    },
    {
      h: "Common mistakes",
      html: `${table(["Mistake", "How to avoid it"], [
  ["Trusting the summary without opening the source", "Open the part of the original that supports each conclusion"],
  ["Using undated sources", "Note the date and drop anything out of date"],
  ["Mixing facts with opinions", "In the table, separate what is verified from what is interpretation"],
  ["Pasting personal data about others", "Anonymize before sharing documents"],
])}`,
    },
  ],
  closing: `${checks([
    "Before researching, I checked the model and plan of my account.",
    "Every important claim has a source in my evidence table.",
    "I do not use a figure I cannot find in the cited source.",
  ])}`,
};
