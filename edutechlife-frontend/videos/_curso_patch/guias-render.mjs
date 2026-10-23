// Renderizador premium de las guías PDF de IALab (mismo sistema visual en todos los módulos).
// Portada a sangre completa + cuerpo A4 con encabezado y pie. Se unen con pypdf.
import { readFile, writeFile, mkdtemp, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";

const require = createRequire("/Users/home/Desktop/edutechlife/edutechlife-frontend/package.json");
const puppeteer = require("puppeteer-core");
const run = promisify(execFile);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PUBLIC = "/Users/home/Desktop/edutechlife/edutechlife-frontend/public";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&family=Source+Sans+3:wght@400;500;600&display=swap');`;

// Etiquetas del sistema visual por idioma (las guías usan doc.lang: es | en | pt).
export const LABELS = {
  es: { closing: "Para cerrar", module: "Módulo", guide: "Guía didáctica", official: "Guía didáctica oficial · Edutechlife", revised: "Revisado en octubre de 2026", content: "Contenido 2026", footer: "edutechlife.co · IALab · Guía didáctica" },
  en: { closing: "To wrap up", module: "Module", guide: "Teaching guide", official: "Official teaching guide · Edutechlife", revised: "Reviewed in October 2026", content: "Content 2026", footer: "edutechlife.co · IALab · Teaching guide" },
  pt: { closing: "Para encerrar", module: "Módulo", guide: "Guia didático", official: "Guia didático oficial · Edutechlife", revised: "Revisado em outubro de 2026", content: "Conteúdo 2026", footer: "edutechlife.co · IALab · Guia didático" },
};
const L = (doc) => LABELS[doc.lang || "es"];

const dataUri = async (rel, mime) => {
  const buf = await readFile(join(PUBLIC, rel));
  return `data:${mime};base64,${buf.toString("base64")}`;
};

const BODY_CSS = `
  ${FONTS}
  body{font-family:'Source Sans 3',Helvetica,Arial,sans-serif;color:#1d2b36;font-size:11pt;line-height:1.55;margin:0}
  h2{font-family:Montserrat,Helvetica,sans-serif;font-size:14.5pt;font-weight:800;color:#072f46;margin:26px 0 12px;display:flex;align-items:center;gap:12px;page-break-after:avoid;letter-spacing:-.01em}
  h2 .num{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#199db9,#7fd8e8);color:#072f46;font-size:13pt;font-weight:800;flex-shrink:0}
  h2::after{content:"";flex:1;height:2px;background:linear-gradient(90deg,#dbeef3,transparent)}
  h3{font-family:Montserrat,Helvetica,sans-serif;font-size:11pt;font-weight:700;color:#0b5f73;margin:16px 0 8px;page-break-after:avoid}
  p{margin:0 0 10px}
  ul{margin:4px 0 10px 18px;padding:0} li{margin-bottom:5px}
  strong,b{color:#072f46}
  .lead{position:relative;font-size:12.5pt;line-height:1.5;color:#fff;background:linear-gradient(135deg,#0b5f73 0%,#072f46 100%);border-radius:16px;padding:20px 24px 20px 26px;margin:0 0 18px;overflow:hidden}
  .lead::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(180deg,#7fd8e8,#199db9)}
  .lead strong{color:#7fd8e8}
  .kpis{display:flex;gap:12px;margin:0 0 18px}
  .kpi{flex:1;border-radius:14px;padding:14px 12px;text-align:center;background:#fff;border:1px solid #dbeef3;border-top:3px solid #199db9}
  .kpi b{display:block;font-family:Montserrat,sans-serif;font-size:19pt;font-weight:800;color:#072f46;line-height:1.1}
  .kpi span{font-size:9pt;color:#6b7f8c}
  .box{border-radius:14px;padding:14px 17px;margin:14px 0;page-break-inside:avoid;border:1px solid #b8f0f9;border-left:5px solid #199db9}
  .tip{background:linear-gradient(135deg,#ecfeff,#f5fdff)}
  .warn{background:linear-gradient(135deg,#fff8ef,#fffbf5);border:1px solid #fde4bf;border-left:5px solid #f59e0b}
  .key{background:linear-gradient(135deg,#072f46,#0b4a66);color:#e6f7fa;border:none}
  .key strong{color:#fff}
  .box .t{font-family:Montserrat,sans-serif;font-weight:700;font-size:8.5pt;margin-bottom:6px;text-transform:uppercase;letter-spacing:.09em;color:#0b5f73}
  .key .t{color:#7fd8e8}
  table{width:100%;border-collapse:separate;border-spacing:0;margin:12px 0 16px;font-size:10pt;border-radius:12px;overflow:hidden;border:1px solid #dbeef3}
  thead th{background:linear-gradient(90deg,#072f46,#0b5f73);color:#fff;text-align:left;padding:10px 12px;font-family:Montserrat,sans-serif;font-weight:700;font-size:9pt;letter-spacing:.03em}
  tbody td{padding:9px 12px;border-bottom:1px solid #dbeef3;vertical-align:top}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:nth-child(even) td{background:#f0fafb}
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}
  .card{background:#fff;border:1px solid #dbeef3;border-top:3px solid #199db9;border-radius:14px;padding:13px 15px;page-break-inside:avoid}
  .card b{font-family:Montserrat,sans-serif;color:#072f46;display:block;margin-bottom:4px;font-size:11pt}
  .steps{counter-reset:s;list-style:none;padding:0;margin:12px 0}
  .steps li{counter-increment:s;position:relative;padding:6px 0 8px 46px;margin:0 0 6px;min-height:34px}
  .steps li::before{content:counter(s);position:absolute;left:0;top:4px;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#072f46,#0b5f73);color:#fff;font-family:Montserrat,sans-serif;font-size:10pt;font-weight:800;display:flex;align-items:center;justify-content:center}
  .check{list-style:none;padding:0;margin:10px 0}
  .check li{padding:6px 0 6px 32px;position:relative;margin:0}
  .check li::before{content:"";position:absolute;left:2px;top:9px;width:16px;height:16px;border:2px solid #199db9;border-radius:5px;background:#fff}
  figure{margin:18px auto;page-break-inside:avoid;text-align:center}
  figure img{width:100%;border-radius:18px;display:block}
  figcaption{font-size:9pt;color:#6b7f8c;margin-top:8px;font-style:italic}
  .prompt{position:relative;font-family:Menlo,Consolas,monospace;font-size:9.5pt;background:linear-gradient(160deg,#0f1f2b,#0b2a3a);color:#e4f6fa;padding:26px 16px 12px;border-radius:14px;white-space:pre-wrap;margin:10px 0 14px;line-height:1.55}
  .prompt::before{content:"PROMPT";position:absolute;left:14px;top:9px;font-family:Montserrat,sans-serif;font-size:7.5pt;font-weight:700;letter-spacing:.14em;color:#7fd8e8}
  .muted{color:#6b7f8c;font-size:9.5pt}
  .closing-ok{border-radius:16px;background:linear-gradient(135deg,#072f46,#0b5f73);color:#fff;padding:16px 20px;margin-top:22px;page-break-inside:avoid}
  .closing-ok .t{font-family:Montserrat,sans-serif;font-size:8.5pt;letter-spacing:.12em;text-transform:uppercase;color:#7fd8e8;font-weight:700;margin-bottom:8px}
  .closing-ok .check li::before{background:transparent;border-color:#7fd8e8}
  .closing-ok .check li{color:#e9fbff}
`;

export const bodyHtml = (doc) => `<!doctype html><html lang="${doc.lang || "es"}"><head><meta charset="utf-8"><style>${BODY_CSS}</style></head><body>
<p class="lead">${doc.lead}</p>
${doc.kpis ? `<div class="kpis">${doc.kpis.map(([n, l]) => `<div class="kpi"><b>${n}</b><span>${l}</span></div>`).join("")}</div>` : ""}
${doc.sections
  .map((s, i) => `<section><h2><span class="num">${String(i + 1).padStart(2, "0")}</span>${s.h}</h2>${s.html}</section>`)
  .join("\n")}
<div class="closing-ok"><div class="t">${L(doc).closing}</div>${doc.closing}</div>
</body></html>`;

const coverCss = `
  ${FONTS}
  @page{size:A4;margin:0}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;width:210mm;height:297mm;font-family:'Source Sans 3',Helvetica,Arial,sans-serif}
  .cover{position:relative;width:210mm;height:297mm;overflow:hidden;background:#072f46;color:#fff}
  .art{position:absolute;top:0;left:0;width:210mm;height:200mm;object-fit:cover}
  .fallback{position:absolute;top:0;left:0;width:210mm;height:200mm;background:
    radial-gradient(circle at 78% 22%,rgba(127,216,232,.55) 0,rgba(25,157,185,0) 34%),
    radial-gradient(circle at 12% 88%,rgba(25,157,185,.35) 0,rgba(25,157,185,0) 40%),
    linear-gradient(160deg,#0b5f73 0%,#072f46 70%)}
  .fallback svg{position:absolute;inset:0;width:100%;height:100%;opacity:.55}
  .shade{position:absolute;top:0;left:0;width:210mm;height:200mm;background:linear-gradient(180deg,rgba(7,47,70,.10) 30%,rgba(7,47,70,.92) 88%,#072f46 100%)}
  .num-big{position:absolute;top:60mm;right:14mm;font-family:Montserrat,sans-serif;font-weight:800;font-size:120pt;line-height:1;color:transparent;-webkit-text-stroke:1.2px rgba(127,216,232,.55)}
  .plate{position:absolute;top:14mm;left:16mm;background:#fff;border-radius:9px;padding:5px 10px}
  .plate img{height:7.5mm;display:block}
  .txt{position:absolute;top:166mm;left:16mm;right:16mm}
  .chip{display:inline-block;background:linear-gradient(90deg,#199db9,#7fd8e8);color:#072f46;font-family:Montserrat,sans-serif;font-size:8.5pt;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:6px 14px;border-radius:999px}
  h1{font-family:Montserrat,sans-serif;font-size:40pt;line-height:1.04;margin:16px 0 12px;color:#fff;font-weight:800;letter-spacing:-.02em;max-width:175mm}
  .sub{font-size:14pt;color:#bdeff8;line-height:1.4;max-width:160mm}
  .rule{height:4px;width:60mm;background:linear-gradient(90deg,#199db9,#7fd8e8,transparent);margin:18px 0 14px;border-radius:2px}
  .meta{display:flex;border-top:1px solid rgba(127,216,232,.25);margin-top:6px;padding-top:12px}
  .meta div{flex:1;font-size:9pt;color:#cfeff6;letter-spacing:.02em}
  .meta b{display:block;font-family:Montserrat,sans-serif;font-size:10pt;color:#fff;margin-bottom:2px}
  .foot{position:absolute;bottom:10mm;left:16mm;right:16mm;font-size:8.5pt;color:#7fb8c8;display:flex;justify-content:space-between;letter-spacing:.04em}
`;

const artSvg = `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#7fd8e8" stroke-width="1"><circle cx="620" cy="140" r="90"/><circle cx="620" cy="140" r="150"/><circle cx="620" cy="140" r="210"/><path d="M0 480 L260 300 L520 470 L800 250"/><path d="M0 540 L300 380 L600 520 L800 400"/><circle cx="260" cy="300" r="5" fill="#7fd8e8"/><circle cx="520" cy="470" r="5" fill="#7fd8e8"/><circle cx="620" cy="140" r="6" fill="#7fd8e8"/></g></svg>`;

export const coverHtml = (doc, logo, art) => `<!doctype html><html lang="${doc.lang || "es"}"><head><meta charset="utf-8"><style>${coverCss}</style></head><body>
<div class="cover">
  ${art ? `<img class="art" src="${art}">` : `<div class="fallback">${artSvg}</div>`}
  <div class="shade"></div>
  <div class="num-big">${String(doc.module || "").padStart(2, "0")}</div>
  <div class="plate"><img src="${logo}"></div>
  <div class="txt">
    <span class="chip">${doc.chip}</span>
    <h1>${doc.title}</h1>
    <div class="sub">${doc.subtitle}</div>
    <div class="rule"></div>
    <div class="meta">
      <div><b>${L(doc).module} ${doc.module}</b>IALab · Edutechlife</div>
      <div><b>${doc.edition}</b>${L(doc).guide}</div>
      <div><b>edutechlife.co</b>${L(doc).content}</div>
    </div>
  </div>
  <div class="foot"><span>${L(doc).official}</span><span>${L(doc).revised}</span></div>
</div></body></html>`;

const headerTpl = (logo, label) => `<div style="width:100%;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:8px;color:#6b7f8c;padding:0 20mm;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dbeef3;padding-bottom:5px;"><img src="${logo}" style="height:11px"/><span style="font-family:Montserrat,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#0b5f73;font-weight:700;font-size:7.5px">${label}</span></div>`;
const footerTpl = (doc) => `<div style="width:100%;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:8px;color:#6b7f8c;padding:0 20mm;display:flex;justify-content:space-between;"><span>${L(doc).footer}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

export async function renderGuide(doc, outFile) {
  const logo = await dataUri("images/logo-edutechlife.webp", "image/webp");
  const art = doc.art ? await dataUri(doc.art, "image/jpeg") : null;
  const tmp = await mkdtemp(join(tmpdir(), "guia-"));
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  try {
    const cover = await browser.newPage();
    await cover.setContent(coverHtml(doc, logo, art), { waitUntil: "load" });
    await cover.evaluate(() => document.fonts.ready);
    await cover.pdf({ path: join(tmp, "cover.pdf"), format: "A4", printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
    await cover.close();

    const body = await browser.newPage();
    // Las imágenes del cuerpo se incrustan: setContent no resuelve rutas relativas.
    let bodyMarkup = bodyHtml(doc);
    for (const src of [...new Set([...bodyMarkup.matchAll(/src="(\/ialab-resources\/[^"]+)"/g)].map((m) => m[1]))]) {
      const mime = src.endsWith(".png") ? "image/png" : "image/jpeg";
      bodyMarkup = bodyMarkup.split(`src="${src}"`).join(`src="${await dataUri(src.slice(1), mime)}"`);
    }
    await body.setContent(bodyMarkup, { waitUntil: "load" });
    await body.evaluate(() => document.fonts.ready);
    await body.pdf({
      path: join(tmp, "body.pdf"), format: "A4", printBackground: true, displayHeaderFooter: true,
      headerTemplate: headerTpl(logo, doc.chip),
      footerTemplate: footerTpl(doc),
      margin: { top: "24mm", bottom: "22mm", left: "20mm", right: "20mm" },
    });
    await body.close();
  } finally {
    await browser.close();
  }
  await mkdir(dirname(outFile), { recursive: true });
  const py = `from pypdf import PdfWriter, PdfReader\nw=PdfWriter()\nfor f in ["${join(tmp, "cover.pdf")}","${join(tmp, "body.pdf")}"]:\n    for p in PdfReader(f).pages: w.add_page(p)\nw.add_metadata({"/Title":${JSON.stringify(doc.title + " — " + doc.subtitle)},"/Author":"Edutechlife"})\nw.write("${outFile}")`;
  await writeFile(join(tmp, "merge.py"), py);
  await run("python3", ["-I", join(tmp, "merge.py")]);
  console.log("ok", outFile);
  return outFile;
}
