// English versions of the Module 1 guides: prompts, privacy and ethics.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const EN_M1_PROMPT = {
  lang: "en",
  chip: "Module 1 · Prompts",
  module: 1,
  title: "The Art of the Prompt",
  subtitle: "Anatomy of a prompt, the RTF formula, and how to improve it with every attempt",
  edition: "Teaching guide 2026",
  art: null,
  lead: "A prompt is the instruction you give an AI. The difference between a weak answer and a useful one usually comes down to <strong>how much context</strong> you give and <strong>how you ask for the result</strong>. This guide shows you how to write prompts that work from the first try.",
  kpis: [["RTF", "Role, Task, Format"], ["4", "elements that complete a prompt"], ["3", "attempts to improve it"]],
  sections: [
    {
      h: "What a prompt is",
      html: `<p>A prompt is any instruction you write for an AI model. It can be a short question or a detailed brief. The model does not know what is in your head: it only has what you write. Whatever you leave out, it guesses.</p>
${box("tip", "Core idea", "<p>A prompt is a brief to a very fast collaborator who does not know your context. The better you explain the job, the less you will have to correct.</p>")}`,
    },
    {
      h: "The RTF formula",
      html: `<p>The RTF formula organizes any prompt into three basic parts:</p>
${cards([
  ["R · Role", "Who should answer. Example: “You are a high-school history teacher.”"],
  ["T · Task", "What to do, with a clear verb. Example: “Explain the Industrial Revolution.”"],
  ["F · Format", "How the result should look. Example: “Three short paragraphs and a table of dates.”"],
])}
<p>We add two elements that raise quality a lot: <strong>context</strong> (for whom, and why) and <strong>constraints</strong> (what it must not do). When you can, add an <strong>example</strong> of the result you expect.</p>`,
    },
    {
      h: "Weak versus strong",
      html: `<p>Compare two prompts asking for the same thing. The difference is in the detail:</p>
${box("warn", "Weak", `<div class="prompt">Explain the Industrial Revolution to me.</div>`)}
${box("tip", "Strong", `<div class="prompt">You are a high-school history teacher.
Context: my students are 15 years old and this is their first contact with the topic.
Task: explain the causes of the Industrial Revolution in England.
Format: three short paragraphs and a table with the 4 main causes.
Constraints: do not use dates you are not sure of; if you are unsure, say so.</div>`)}`,
    },
    {
      h: "Improving a prompt through iteration",
      html: `<p>Few people get it right on the first try, and that is fine. What matters is <strong>improving with method</strong>.</p>
${figure("/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg", "A good prompt is a clear instruction for a very fast collaborator.", "34%")}
${steps([
  "<b>First attempt:</b> write the prompt with RTF. Review the answer without correcting it yet.",
  "<b>Diagnosis:</b> what is missing? Tone, level, length, examples, concrete data?",
  "<b>Second attempt:</b> add only what was missing. One change at a time tells you what worked.",
  "<b>Compare and save:</b> if the result is useful, save the prompt as a template for next time.",
])}`,
    },
    {
      h: "Common mistakes",
      html: `${table(["Mistake", "Why it fails", "How to fix it"], [
  ["Asking without context", "The AI guesses the audience and level", "Add who it is for and why"],
  ["Asking for “something good”", "“Good” has no measurable criteria", "Define the format and length"],
  ["Asking for many things at once", "The answers get diluted", "Split the brief into steps"],
  ["Accepting data without checking", "The model can be wrong with confidence", "Ask for sources and verify figures"],
  ["Pasting personal data", "A risk to privacy", "Anonymize before pasting the text"],
])}`,
    },
    {
      h: "Ready-to-use templates",
      html: `<h3>For studying</h3>
<div class="prompt">You are a patient tutor of [subject].
Explain [topic] to someone at [level].
Use an everyday analogy, one worked example and three questions to check my understanding.</div>
<h3>For writing</h3>
<div class="prompt">You are a clear-writing editor for [audience].
Rewrite the text I paste so it is brief, free of jargon, and in a [tone] tone.
Keep every fact and tell me if you changed any.</div>
<h3>For reviewing</h3>
<div class="prompt">Review this text the way a demanding evaluator would.
Give me three strengths, three concrete problems and one improvement for each problem.</div>`,
    },
    {
      h: "One rule to close: what you should not paste",
      html: `<p>A prompt is a document that travels to an external service. Before you paste information, ask yourself whether you would share it with a stranger.</p>
${checks([
  "Identity documents, passwords or bank details.",
  "Medical records or health information about other people.",
  "Personal data of students or minors.",
  "Confidential information from your company or clients.",
])}
<p class="muted">In Colombia, the processing of personal data is governed by Law 1581 of 2012.</p>`,
    },
    {
      h: "Practice exercise",
      html: `${steps([
  "Pick a real task from your week (an email, a summary, an idea).",
  "Write a prompt with RTF and context. Note the answer.",
  "Diagnose what is missing and improve the prompt in two attempts.",
  "Save the final version as a template with blanks to fill in.",
])}`,
    },
  ],
  closing: `${checks([
    "I write prompts with role, task and format, and I add context.",
    "I improve prompts one change at a time and compare results.",
    "I verify figures and sources before using an answer.",
    "I do not paste personal or confidential data into an AI.",
  ])}`,
};

export const EN_M1_PRIVACIDAD = {
  lang: "en",
  chip: "Module 1 · Responsible use",
  module: 1,
  title: "Privacy and Responsible Use of AI",
  subtitle: "Personal data, minors, bias and transparency for using AI with judgment",
  edition: "Handbook 2026",
  art: null,
  lead: "AI is useful when you know what you hand over, how you verify what you receive, and whom you must tell that you used it. This handbook gathers the principles every student and professional should apply.",
  kpis: [["1581", "data protection law in Colombia (2012)"], ["4", "principles of responsible use"], ["3", "questions before sharing"]],
  sections: [
    {
      h: "Why privacy matters",
      html: `<p>Every text you paste into an AI tool is information that leaves your computer. Often you do not know how it is stored, who can see it, or whether it is used to improve services. Treating privacy as a habit, not a formality, is what protects it.</p>`,
    },
    {
      h: "A practical dilemma",
      html: `<p>A case that repeats in classrooms and offices: someone must write an essay and asks the AI to write all of it. What happens to their learning, their honesty and the quality of what they hand in?</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0">
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 14px">
    <b style="color:#9a3412;font-size:10pt">Option A · Hand it in unread</b>
    <p style="margin:6px 0 6px">Ask the AI to write the whole essay and submit it as is.</p>
    <ul style="margin:0 0 0 16px;font-size:9.5pt"><li>Academic dishonesty</li><li>Risk of spreading unverified information</li><li>Loss of learning and critical thinking</li></ul>
  </div>
  <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:12px 14px">
    <b style="color:#065f46;font-size:10pt">Option B · AI as scaffolding</b>
    <p style="margin:6px 0 6px">Use AI to structure ideas and check grammar, but write the text yourself.</p>
    <ul style="margin:0 0 0 16px;font-size:9.5pt"><li>Keeps intellectual authorship</li><li>You understand what you write</li><li>Improves your text with your own judgment</li></ul>
  </div>
</div>`,
    },
    {
      h: "Data you should not share",
      html: `${table(["Type of data", "Example", "Why"], [
  ["Identification", "ID number, passport, date of birth", "Enables identity theft"],
  ["Financial", "Account numbers, cards, income", "Risk of fraud"],
  ["Health", "Diagnoses, medical records", "Sensitive data with special protection"],
  ["Minors", "Names, schools, grades of children or teenagers", "Stronger legal protection"],
  ["Credentials", "Passwords, verification codes", "Direct access to your accounts"],
])}`,
    },
    {
      h: "Law 1581 of 2012",
      html: `<p>In Colombia, <strong>Law 1581 of 2012</strong> regulates the processing of personal data. Its principles are the foundation of responsible use:</p>
${cards([
  ["Purpose", "Data is used for a clear purpose that the person has been informed of."],
  ["Security and confidentiality", "Whoever processes data must protect it and limit access."],
  ["Accuracy", "Data must be accurate, complete and up to date."],
  ["Freedom", "No one may use your data without your prior authorization."],
])}
<p>As the data subject, you can know, update, correct and delete your data, and revoke the authorization you gave.</p>`,
    },
    {
      h: "Anonymize before uploading",
      html: `${steps([
  "Remove names, emails, phone numbers and addresses from the text.",
  "Replace people with roles: “student A”, “the patient”, “the supplier”.",
  "Round or change sensitive figures without changing the conclusion.",
  "Check headers, signatures and hidden metadata in documents before uploading them.",
])}`,
    },
    {
      h: "Bias: how to spot it",
      html: `<p>A model learns from data created by people and can repeat their inequalities: stereotypes of gender, region, age or socioeconomic level. Bias is not always obvious; sometimes it shows up in what the answer leaves out.</p>
${checks([
  "Ask for the same task with different profiles and compare.",
  "Ask what perspectives are missing from the answer.",
  "Verify with diverse sources before deciding anything about people.",
])}`,
    },
    {
      h: "Transparency: declaring AI use",
      html: `<p>Saying when you used AI builds trust and prevents misunderstandings. Declare the use when AI took part in a text, an image, an analysis or a decision, and explain which part you reviewed yourself.</p>
${box("tip", "Suggested wording", "<p>“This draft was prepared with AI support and reviewed and revised by me. The figures were checked against the sources cited.”</p>")}`,
    },
    {
      h: "Minors",
      html: `<p>When AI is used with children or teenagers, a responsible adult supervises the use, chooses the tools and prevents the sharing of the minor's data. Data about minors has stronger protection.</p>`,
    },
    {
      h: "Checklist before sharing",
      html: `${checks([
  "Did I verify every figure, citation and name against the original source?",
  "Did I remove personal or confidential data that should not be there?",
  "Did a responsible person review the decision?",
  "Did I declare the use of AI where appropriate?",
])}`,
    },
  ],
  closing: `${checks([
    "I share only what is necessary and anonymize what is personal.",
    "I verify what AI gives me before using it.",
    "I declare when I used AI and protect the data of others and of minors.",
  ])}`,
};

export const EN_M1_ETICA = {
  lang: "en",
  chip: "Module 1 · Ethics",
  module: 1,
  title: "Ethics of AI",
  subtitle: "Principles for using artificial intelligence with honesty, fairness and responsibility",
  edition: "Teaching guide 2026",
  art: null,
  lead: "Using AI well is not only about getting good results: it is about knowing when to trust, when to verify, and when to say you used it. This guide gathers the principles that support responsible use at school, at work and in everyday life.",
  kpis: [["5", "principles of responsible use"], ["5", "questions before publishing"], ["1982", "copyright law in Colombia (Law 23)"]],
  sections: [
    {
      h: "Why ethics matters in AI",
      html: `<p>An AI system can write something false with total confidence, repeat prejudices from its data, and produce content nobody signed. When we use it without judgment, errors multiply and the consequences fall on real people: a student wrongly accused, a client misinformed, or a decision taken on biased data.</p>`,
    },
    {
      h: "The five principles",
      html: `${cards([
  ["Transparency", "Declare when you used AI and explain which part you reviewed yourself."],
  ["Truthfulness", "Verify data, citations and names before using or sharing them."],
  ["Fairness", "Check whether the answer treats every person with the same rigor."],
  ["Privacy", "Do not share personal, minors' or confidential data."],
  ["Human responsibility", "The final decision and its consequences still belong to a person."],
])}`,
    },
    {
      h: "Academic honesty",
      html: `<p>Using AI to understand a topic, organize ideas or check grammar can be a legitimate support, as long as the final text reflects your learning. Handing in work that you did not write or do not understand harms your education and misleads whoever evaluates it.</p>
${table(["Acceptable use", "Dishonest use"], [
  ["Asking for explanations and examples of the topic", "Handing in an essay written entirely by AI"],
  ["Checking the grammar of your own text", "Presenting as yours a text you do not understand"],
  ["Generating questions to study with", "Answering an exam with answers generated on the spot"],
  ["Declaring AI support in your work", "Hiding AI use when the rules require disclosure"],
])}`,
    },
    {
      h: "Bias and fairness",
      html: `<p>Models learn from data created by people, and they can repeat its inequalities: stereotypes of gender, region, age or socioeconomic level. Bias is sometimes not in what the answer says, but in what it leaves out.</p>
${steps([
  "Ask for the same task with different profiles and compare the answers.",
  "Ask what perspectives are missing and look for at least one source that represents them.",
  "Before deciding something that affects people, consult someone who knows the context.",
])}`,
    },
    {
      h: "Truthfulness and misinformation",
      html: `<p>AI can invent quotes, figures and references with total confidence. Misinformation is also produced with AI-generated images, audio and video.</p>
${box("warn", "Before you share something", "<ul><li>Can I open the original source?</li><li>Is the date recent and the author reliable?</li><li>Does at least one other independent source confirm it?</li></ul>")}`,
    },
    {
      h: "Intellectual property and copyright",
      html: `<p>In Colombia, <strong>Law 23 of 1982</strong> protects the works of their authors. Using AI does not give you rights over other people's works: cite your sources, do not copy protected texts, and ask for permission when the use requires it. What you generate with AI must also be declared when it is published or handed in.</p>`,
    },
    {
      h: "Personal data and minors",
      html: `<p><strong>Law 1581 of 2012</strong> regulates the processing of personal data in Colombia. Do not share third parties' data without authorization, and take special care with minors' data: it requires stronger protection and, for children and teenagers, the supervision of a responsible adult.</p>`,
    },
    {
      h: "Decisions about people",
      html: `<p>AI can help organize information about people, but it must not make decisions that affect someone on its own: hiring, evaluating, sanctioning or diagnosing. Those decisions require human judgment, an explanation and the possibility of review.</p>`,
    },
    {
      h: "Responsible use protocol",
      html: `${checks([
  "I verified data, citations and names against the original source.",
  "I declared the use of AI where appropriate.",
  "I did not include personal data of third parties or minors without authorization.",
  "I checked whether the result treats all people fairly.",
  "A responsible person reviewed and approved the final decision.",
])}`,
    },
    { h: "Annex: risk, explainability, privacy and bias", html: "<p><strong>1. Risk classification (European Union):</strong> unacceptable (prohibited, such as social scoring of people), high (hiring, credit, education or health: requires conformity assessment and human oversight), limited (must disclose that it is AI) and minimal (no specific obligations). <em>Status:</em> Regulation (EU) 2026/1744 (digital omnibus) entered into force on 27 July 2026. High-risk obligations apply from December 2027 for standalone systems and from August 2028 for systems embedded in products.</p><p><strong>2. Explainability:</strong> when an AI decides about a person, that person must be able to understand the decision and challenge it.</p><p><strong>3. Privacy by design:</strong> decide which data you need before collecting it; minimize, anonymize and limit access.</p><p><strong>4. Types of bias:</strong> sampling (unrepresentative data), historical (data that reflects past discrimination), labeling (prejudices of whoever labels) and automation (trusting without review).</p>" },
  ],
  closing: `${checks([
    "I declare when I use AI and what I reviewed myself.",
    "I verify before sharing and I cite my sources.",
    "I protect personal data, especially minors' data.",
    "I keep a responsible person in every decision that affects others.",
  ])}`,
};
