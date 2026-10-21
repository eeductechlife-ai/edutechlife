// Infografías en inglés y portugués (mismo diseño que las de español, texto traducido).
import { readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/Users/home/Desktop/edutechlife/edutechlife-frontend/package.json");
const puppeteer = require("puppeteer-core");
const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const img = async (rel, mime = "image/jpeg") => `data:${mime};base64,${(await readFile(join(PUBLIC, rel))).toString("base64")}`;
const logo = await img("images/logo-edutechlife.webp", "image/webp");

const CSS = `*{box-sizing:border-box} html,body{margin:0;width:1600px;height:900px;font-family:Helvetica,Arial,sans-serif;color:#fff}
.wrap{width:1600px;height:900px;position:relative;overflow:hidden;background:radial-gradient(circle at 85% 10%,rgba(25,157,185,.55) 0,rgba(25,157,185,0) 38%),radial-gradient(circle at 10% 100%,rgba(127,216,232,.25) 0,rgba(127,216,232,0) 40%),linear-gradient(160deg,#0b3d56 0%,#072f46 55%,#06243a 100%);padding:52px 64px}
.logo{position:absolute;top:40px;right:56px;background:#fff;border-radius:10px;padding:5px 10px}.logo img{height:24px;display:block}
.tag{display:inline-block;background:#199db9;color:#fff;font-weight:700;font-size:15px;letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border-radius:999px}
h1{font-size:56px;line-height:1.05;margin:18px 0 10px;max-width:1150px}.sub{font-size:24px;color:#9fe3ef}
.hero{position:absolute;left:64px;top:270px;width:520px;height:560px;border-radius:26px;overflow:hidden;border:2px solid rgba(127,216,232,.35)}.hero img{width:100%;height:100%;object-fit:cover;display:block}
.steps{position:absolute;left:630px;top:270px;width:906px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.step{background:rgba(255,255,255,.07);border:1px solid rgba(127,216,232,.25);border-radius:20px;padding:20px 22px}
.n{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#199db9,#7fd8e8);color:#072f46;font-size:24px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.step h3{font-size:24px;margin:0 0 8px}.step p{font-size:17px;line-height:1.45;margin:0;color:#d6eef4}
.foot{position:absolute;left:630px;right:64px;bottom:44px;background:#199db9;color:#072f46;border-radius:18px;padding:18px 24px;font-size:20px;line-height:1.4;font-weight:600}.foot b{color:#fff}
.badge{position:absolute;left:64px;top:846px;font-size:14px;color:#7fd8e8;letter-spacing:.08em}`;

const page = ({ tag, title, sub, hero, steps, footer, extra = "" }) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="wrap">
<div class="logo"><img src="${logo}"></div><span class="tag">${tag}</span><h1>${title}</h1><div class="sub">${sub}</div>
<div class="hero"><img src="${hero}"></div>${extra}
<div class="steps">${steps.map(([h, p], i) => `<div class="step"><div class="n">${i + 1}</div><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>
<div class="foot">${footer}</div><div class="badge">EDUTECHLIFE · IALAB</div></div></body></html>`;

const HERO = {
  notebook: await img("ialab-resources/modulo4/ilustraciones/cuaderno-fuentes.jpg"),
  gemini: await img("ialab-resources/modulo3/ilustraciones/explorador-gemini.jpg"),
  chatgpt: await img("ialab-resources/modulo2/portada-chatgpt.jpg"),
};
const ROBOT = await img("ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg");

const T = {
  en: {
    resumenes: { file: "modulo4/infografia-resumenes-en.jpg", tag: "Module 4 · Gemini Notebook", title: "Smart summaries with Gemini Notebook", sub: "Four steps to summarize your sources without losing rigor", hero: HERO.notebook,
      steps: [["Load quality sources", "3 to 5 reliable documents: official reports, articles or your well-organized notes. Quality over quantity."], ["Ask for a structured summary", "Main ideas with the author and date of each source, so you know where each idea comes from."], ["Verify with citations", "Each number leads to the original passage. Open at least one citation per key idea."], ["Turn the summary into practice", "Study cards, a mind map, a quiz or audio to review on the move."]],
      footer: "<b>Golden rule:</b> if an idea has no citation, do not use it until you verify it. A summary you share is your responsibility." },
    ecosistema: { file: "modulo3/infografia-ecosistema-gemini-en.jpg", tag: "Module 3 · Gemini", title: "Gemini ecosystem map", sub: "Which tool to use for each research task", hero: HERO.gemini,
      steps: [["Workspace: your files", "Gmail, Docs, Drive and Sheets: summarize threads, draft, search your documents and analyze tables."], ["Search: recent data", "Answers with links. Open the sources before you use a figure."], ["Deep Research: guided investigation", "Research in several steps and deliver a report. You define the question."], ["Multimodal: images and audio", "Read charts, transcribe recordings and compare documents. Check the limits of your plan."]],
      footer: "<b>Before you research:</b> check the model and plan of your account. Versions change; verify with at least three sources." },
    conectores: { file: "modulo2/infografia-conectores-chatgpt-en.jpg", tag: "Module 2 · Apps", title: "Apps and connectors", sub: "What to connect, which permissions you accept, and when to disconnect", hero: HERO.chatgpt,
      steps: [["Choose", "Connect only what you will use this week."], ["Review permissions", "Read what data each connection asks for before you approve it."], ["Authorize outside the chat", "Never give passwords in the conversation."], ["Disconnect", "What you no longer use gets revoked. Fewer connections, less risk."]],
      footer: "Before connecting, ask: what data will the app see, and for what? If you do not know, do not connect it." },
  },
  pt: {
    resumenes: { file: "modulo4/infografia-resumenes-pt.jpg", tag: "Módulo 4 · Gemini Notebook", title: "Resumos inteligentes com o Gemini Notebook", sub: "Quatro passos para resumir as suas fontes sem perder rigor", hero: HERO.notebook,
      steps: [["Carregue fontes de qualidade", "De 3 a 5 documentos confiáveis: relatórios oficiais, artigos ou anotações bem organizadas. Qualidade antes de quantidade."], ["Peça um resumo estruturado", "Ideias principais com o autor e a data de cada fonte, para saber de onde vem cada ideia."], ["Verifique com citações", "Cada número leva ao trecho original. Abra pelo menos uma citação por ideia importante."], ["Transforme o resumo em prática", "Cartões de estudo, mapa mental, questionário ou áudio para revisar em movimento."]],
      footer: "<b>Regra de ouro:</b> se uma ideia não tem citação, não a use sem verificar. Um resumo que você compartilha é responsabilidade sua." },
    ecosistema: { file: "modulo3/infografia-ecosistema-gemini-pt.jpg", tag: "Módulo 3 · Gemini", title: "Mapa do ecossistema Gemini", sub: "Qual ferramenta usar para cada tarefa de pesquisa", hero: HERO.gemini,
      steps: [["Workspace: seus arquivos", "Gmail, Docs, Drive e Sheets: resuma conversas, redija, pesquise nos seus documentos e analise tabelas."], ["Search: dados recentes", "Respostas com links. Abra as fontes antes de usar um número."], ["Deep Research: pesquisa guiada", "Pesquisa em várias etapas e entrega um relatório. Você define a pergunta."], ["Multimodal: imagens e áudio", "Interpreta gráficos, transcreve gravações e compara documentos. Confira os limites do seu plano."]],
      footer: "<b>Antes de pesquisar:</b> confira o modelo e o plano da sua conta. As versões mudam; verifique com pelo menos três fontes." },
    conectores: { file: "modulo2/infografia-conectores-chatgpt-pt.jpg", tag: "Módulo 2 · Aplicativos", title: "Aplicativos e conectores", sub: "O que conectar, quais permissões aceitar e quando desconectar", hero: HERO.chatgpt,
      steps: [["Escolha", "Conecte só o que você vai usar nesta semana."], ["Revise as permissões", "Leia que dados cada conexão pede antes de aprovar."], ["Autorize fora do chat", "Nunca dê senhas na conversa."], ["Desconecte", "O que você não usa deve ser revogado. Menos conexões, menos risco."]],
      footer: "Antes de conectar, pergunte: que dados o aplicativo vai ver, e para quê? Se não souber, não conecte." },
  },
};

await mkdir(join(PUBLIC, "ialab-resources/modulo2"), { recursive: true });
await mkdir(join(PUBLIC, "ialab-resources/modulo3"), { recursive: true });
await mkdir(join(PUBLIC, "ialab-resources/modulo4"), { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
try {
  for (const lang of ["en", "pt"]) {
    for (const key of Object.keys(T[lang])) {
      const info = T[lang][key];
      const p = await browser.newPage();
      await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
      const extra = key === "ecosistema" ? `<img src="${ROBOT}" style="position:absolute;right:56px;top:118px;width:160px;height:150px;object-fit:cover;border-radius:22px;border:2px solid rgba(127,216,232,.4)">` : "";
      await p.setContent(page({ tag: info.tag, title: info.title, sub: info.sub, hero: info.hero, steps: info.steps, footer: info.footer, extra }), { waitUntil: "load" });
      await p.screenshot({ path: join(PUBLIC, "ialab-resources", info.file), type: "jpeg", quality: 92 });
      await p.close();
      console.log("ok", info.file);
    }
  }
} finally {
  await browser.close();
}
