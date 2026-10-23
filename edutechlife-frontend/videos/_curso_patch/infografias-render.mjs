// Infografías de alto impacto de IALab: ilustración protagonista, pasos numerados y logo original pequeño.
// Uso: node infografias-render.mjs
import { readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire("/Users/home/Desktop/edutechlife/edutechlife-frontend/package.json");
const puppeteer = require("puppeteer-core");
const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const img = async (rel, mime = "image/jpeg") =>
  `data:${mime};base64,${(await readFile(join(PUBLIC, rel))).toString("base64")}`;

const CSS = `
  *{box-sizing:border-box} html,body{margin:0;width:1600px;height:900px;font-family:Helvetica,Arial,sans-serif;color:#fff}
  .wrap{width:1600px;height:900px;position:relative;overflow:hidden;background:
    radial-gradient(circle at 85% 10%,rgba(25,157,185,.55) 0,rgba(25,157,185,0) 38%),
    radial-gradient(circle at 10% 100%,rgba(127,216,232,.25) 0,rgba(127,216,232,0) 40%),
    linear-gradient(160deg,#0b3d56 0%,#072f46 55%,#06243a 100%);padding:52px 64px}
  .logo{position:absolute;top:40px;right:56px;background:#fff;border-radius:10px;padding:5px 10px;box-shadow:0 6px 18px rgba(0,0,0,.25)}
  .logo img{height:24px;display:block}
  .tag{display:inline-block;background:#199db9;color:#fff;font-weight:700;font-size:15px;letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border-radius:999px}
  h1{font-size:56px;line-height:1.05;margin:18px 0 10px;max-width:1150px;letter-spacing:-.01em}
  .sub{font-size:24px;color:#9fe3ef}
  .hero{position:absolute;left:64px;top:270px;width:520px;height:560px;border-radius:26px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.35);border:2px solid rgba(127,216,232,.35)}
  .hero img{width:100%;height:100%;object-fit:cover;display:block}
  .steps{position:absolute;left:630px;top:270px;width:906px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .step{background:rgba(255,255,255,.07);border:1px solid rgba(127,216,232,.25);border-radius:20px;padding:20px 22px;backdrop-filter:blur(4px)}
  .n{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#199db9,#7fd8e8);color:#072f46;font-size:24px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
  .step h3{font-size:24px;margin:0 0 8px;color:#fff} .step p{font-size:17px;line-height:1.45;margin:0;color:#d6eef4}
  .foot{position:absolute;left:630px;right:64px;bottom:44px;background:#199db9;color:#072f46;border-radius:18px;padding:18px 24px;font-size:20px;line-height:1.4;font-weight:600}
  .foot b{color:#fff}
  .badge{position:absolute;left:64px;top:846px;font-size:14px;color:#7fd8e8;letter-spacing:.08em}
`;

const page = ({ tag, title, sub, heroSrc, steps, footer, extra = "" }) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="wrap">
  <div class="logo"><img src="LOGO_SRC"></div>
  <span class="tag">${tag}</span>
  <h1>${title}</h1><div class="sub">${sub}</div>
  <div class="hero"><img src="${heroSrc}"></div>
  ${extra}
  <div class="steps">${steps.map(([h, p], i) => `<div class="step"><div class="n">${i + 1}</div><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>
  <div class="foot">${footer}</div>
  <div class="badge">EDUTECHLIFE · IALAB</div>
</div></body></html>`;

const logo = await img("images/logo-edutechlife.webp", "image/webp");


const radialHub = ({ tag, title, sub, center, nodes, footer }) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box} html,body{margin:0;width:1600px;height:900px;font-family:Helvetica,Arial,sans-serif;color:#072f46}
  .wrap{width:1600px;height:900px;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 50%,#ffffff 0,#eaf8fa 60%,#d6f0f5 100%)}
  .tag{position:absolute;left:64px;top:56px;background:#199db9;color:#fff;font-weight:700;font-size:15px;letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border-radius:999px}
  h1{position:absolute;left:64px;top:96px;font-size:50px;margin:0;color:#072f46} .sub{position:absolute;left:64px;top:162px;font-size:22px;color:#0b5f73}
  .logo{position:absolute;right:56px;top:56px;background:#fff;border-radius:10px;padding:5px 10px;box-shadow:0 6px 16px rgba(7,47,70,.12)} .logo img{height:24px;display:block}
  .ring{position:absolute;left:650px;top:330px;width:300px;height:300px;border-radius:50%;padding:10px;background:linear-gradient(135deg,#199db9,#7fd8e8);box-shadow:0 18px 40px rgba(25,157,185,.35)}
  .ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;border:6px solid #fff}
  svg.lines{position:absolute;left:0;top:0;width:1600px;height:900px}
  .node{position:absolute;width:430px;background:#fff;border-radius:22px;padding:22px 24px;box-shadow:0 14px 34px rgba(7,47,70,.12);border:1px solid #cdeff5}
  .node .n{position:absolute;top:-16px;left:24px;width:38px;height:38px;border-radius:50%;background:#072f46;color:#fff;font-weight:900;font-size:18px;display:flex;align-items:center;justify-content:center}
  .node h3{margin:6px 0 8px;font-size:24px;color:#072f46} .node p{margin:0;font-size:17px;line-height:1.45;color:#2b4a57}
  .foot{position:absolute;left:64px;right:64px;bottom:40px;background:#072f46;color:#e6f7fa;border-radius:18px;padding:18px 26px;font-size:20px;line-height:1.4}
</style></head><body><div class="wrap">
  <span class="tag">${tag}</span><h1>${title}</h1><div class="sub">${sub}</div>
  <div class="logo"><img src="LOGO_SRC"></div>
  <svg class="lines" viewBox="0 0 1600 900"><g stroke="#199db9" stroke-width="3" stroke-dasharray="8 8" fill="none"><path d="M800 480 L300 330"/><path d="M800 480 L1300 330"/><path d="M800 480 L300 690"/><path d="M800 480 L1300 690"/></g></svg>
  <div class="ring"><img src="${center}"></div>
  <div class="node" style="left:64px;top:300px"><span class="n">1</span><h3>${nodes[0][0]}</h3><p>${nodes[0][1]}</p></div>
  <div class="node" style="left:1106px;top:300px"><span class="n">2</span><h3>${nodes[1][0]}</h3><p>${nodes[1][1]}</p></div>
  <div class="node" style="left:64px;top:660px;width:430px"><span class="n">3</span><h3>${nodes[2][0]}</h3><p>${nodes[2][1]}</p></div>
  <div class="node" style="left:1106px;top:660px"><span class="n">4</span><h3>${nodes[3][0]}</h3><p>${nodes[3][1]}</p></div>
  <div class="foot" style="left:520px;right:520px;bottom:24px;font-size:17px;padding:14px 20px;text-align:center">${footer}</div>
</div></body></html>`;

const timeline = ({ tag, title, sub, accent, steps, footer }) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box} html,body{margin:0;width:1600px;height:900px;font-family:Helvetica,Arial,sans-serif;color:#fff}
  .wrap{width:1600px;height:900px;position:relative;overflow:hidden;background:linear-gradient(180deg,#041f2e 0%,#072f46 100%)}
  .glow{position:absolute;right:-120px;top:-120px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(127,216,232,.45),rgba(127,216,232,0) 70%)}
  .tag{position:absolute;left:64px;top:56px;background:#7fd8e8;color:#072f46;font-weight:800;font-size:15px;letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border-radius:999px}
  h1{position:absolute;left:64px;top:96px;font-size:54px;margin:0} .sub{position:absolute;left:64px;top:166px;font-size:22px;color:#9fe3ef}
  .logo{position:absolute;right:56px;top:56px;background:#fff;border-radius:10px;padding:5px 10px} .logo img{height:24px;display:block}
  .accent{position:absolute;right:90px;top:250px;width:250px;height:250px;border-radius:28px;overflow:hidden;border:2px solid rgba(127,216,232,.45);box-shadow:0 20px 50px rgba(0,0,0,.4);transform:rotate(-4deg)}
  .accent img{width:100%;height:100%;object-fit:cover;display:block}
  .track{position:absolute;left:120px;right:120px;top:520px;height:6px;background:linear-gradient(90deg,#199db9,#7fd8e8,#199db9);border-radius:6px}
  .stop{position:absolute;width:300px;text-align:left}
  .dot{width:64px;height:64px;border-radius:50%;background:#072f46;border:5px solid #7fd8e8;color:#7fd8e8;font-size:26px;font-weight:900;display:flex;align-items:center;justify-content:center;margin:489px 0 22px -6px;box-shadow:0 0 0 8px rgba(127,216,232,.15)}
  .stop h3{margin:0 0 8px;font-size:25px;color:#fff} .stop p{margin:0;font-size:17px;line-height:1.45;color:#c8eef6}
  .foot{position:absolute;left:64px;right:64px;bottom:40px;background:#199db9;color:#072f46;border-radius:18px;padding:18px 26px;font-size:20px;font-weight:700;line-height:1.4}
</style></head><body><div class="wrap"><div class="glow"></div>
  <span class="tag">${tag}</span><h1>${title}</h1><div class="sub">${sub}</div>
  <div class="logo"><img src="LOGO_SRC"></div>
  <div class="accent"><img src="${accent}"></div>
  <div class="track"></div>
  ${steps.map(([h, p], i) => `<div class="stop" style="left:${120 + i * 380}px;top:${i % 2 ? 0 : 0}px"><div class="dot">${i + 1}</div><h3>${h}</h3><p>${p}</p></div>`).join("")}
  <div class="foot">${footer}</div>
</div></body></html>`;

const INFOS = [
  {
    file: "modulo4/infografia-resumenes-es.jpg",
    html: page({
      tag: "Módulo 4 · Gemini Notebook",
      title: "Resúmenes inteligentes con Gemini Notebook",
      sub: "Cuatro pasos para resumir tus fuentes sin perder rigor",
      heroSrc: await img("ialab-resources/modulo4/ilustraciones/cuaderno-fuentes.jpg"),
      steps: [
        ["Carga fuentes de calidad", "De 3 a 5 documentos confiables: informes oficiales, artículos o tus apuntes ordenados."],
        ["Pide un resumen estructurado", "Ideas principales con el autor y la fecha de cada fuente."],
        ["Verifica con citas", "Cada número lleva al fragmento original. Abre al menos una cita por idea."],
        ["Transforma el resumen", "Tarjetas de estudio, mapa mental, cuestionario o audio para repasar."],
      ],
      footer: "<b>Regla de oro:</b> si una idea no tiene cita, no la uses sin verificarla. Un resumen compartido es tu responsabilidad.",
    }).replace('LOGO_SRC', logo),
  },
  {
    file: "modulo3/infografia-ecosistema-gemini-es.jpg",
    html: page({
      tag: "Módulo 3 · Gemini",
      title: "Mapa del ecosistema Gemini",
      sub: "Qué herramienta usar según la tarea de investigación",
      heroSrc: await img("ialab-resources/modulo3/ilustraciones/explorador-gemini.jpg"),
      steps: [
        ["Workspace: tus archivos", "Gmail, Docs, Drive y Sheets: resume hilos, redacta y busca en tus documentos."],
        ["Search: datos recientes", "Respuestas con enlaces. Abre las fuentes antes de usar una cifra."],
        ["Deep Research: investigación guiada", "Investiga en varios pasos y entrega un informe. Tú defines la pregunta."],
        ["Multimodal: imágenes y audio", "Interpreta gráficos, transcribe grabaciones y compara documentos."],
      ],
      footer: "<b>Antes de investigar:</b> revisa el modelo y el plan de tu cuenta. Las versiones cambian; verifica con al menos tres fuentes.",
      extra: `<img src="${await img("ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg")}" style="position:absolute;right:56px;top:118px;width:160px;height:150px;object-fit:cover;border-radius:22px;border:2px solid rgba(127,216,232,.4);box-shadow:0 10px 30px rgba(0,0,0,.35)">`,
    }).replace('LOGO_SRC', logo),
  },
  {
    // Diseño 1: mapa radial claro. Ilustración al centro y cuatro herramientas conectadas alrededor.
    file: "modulo2/infografia-ecosistema-chatgpt-es.jpg",
    html: radialHub({
      tag: "Módulo 2 · ChatGPT",
      title: "Ecosistema de ChatGPT",
      sub: "Cuatro herramientas, un solo flujo de trabajo",
      center: await img("ialab-resources/modulo2/portada-chatgpt.jpg"),
      nodes: [
        ["Chat", "Pensar y redactar. Pide con rol, tarea, formato y contexto."],
        ["Búsqueda web", "Datos recientes. Pide fuentes y ábrelas antes de usar una cifra."],
        ["Proyectos", "Un espacio por trabajo, con instrucciones y archivos propios."],
        ["GPTs y agente", "Asistentes con tus reglas y tareas de varios pasos que apruebas."],
      ],
      footer: "Regla de oro: verifica cada cifra y cada cita. Elige el modelo según la tarea y tu plan.",
    }).replace('LOGO_SRC', logo),
  },
  {
    // Diseño 2: línea de tiempo oscura con nodos de conexión y sin persona.
    file: "modulo2/infografia-conectores-chatgpt-es.jpg",
    html: timeline({
      tag: "Módulo 2 · Aplicaciones",
      title: "Aplicaciones y conectores",
      sub: "Cómo conectar, qué permisos aceptas y cuándo desconectar",
      accent: await img("ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg"),
      steps: [
        ["Elige", "Conecta solo lo que vas a usar esta semana."],
        ["Revisa permisos", "Lee qué datos pide cada conexión antes de aprobarla."],
        ["Autoriza fuera del chat", "Nunca des contraseñas en la conversación."],
        ["Desconecta", "Lo que no usas se revoca. Menos conexiones, menos riesgo."],
      ],
      footer: "Antes de conectar pregunta: ¿qué datos verá la aplicación y para qué? Si no lo sabes, no lo conectes.",
    }).replace('LOGO_SRC', logo),
  },
];

await mkdir(join(PUBLIC, "ialab-resources/modulo3"), { recursive: true });
await mkdir(join(PUBLIC, "ialab-resources/modulo4"), { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
try {
  for (const info of INFOS) {
    const p = await browser.newPage();
    await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    await p.setContent(info.html, { waitUntil: "load" });
    await p.screenshot({ path: join(PUBLIC, "ialab-resources", info.file), type: "jpeg", quality: 92 });
    await p.close();
    console.log("ok", info.file);
  }
} finally {
  await browser.close();
}
