// Guía nueva: herramientas integradas de ChatGPT (Módulo 2). Inglés y portugués.
// Reemplaza el PDF remoto en español. Los planes y la disponibilidad se remiten a la cuenta.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;

export const EN_HERRAMIENTAS = {
  lang: "en", chip: "Module 2 · ChatGPT", module: 2,
  title: "Integrated ChatGPT Tools", subtitle: "When to use web search, data analysis, image generation, canvas and voice, and how to check what each one returns",
  edition: "Teaching guide 2026", art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "ChatGPT includes tools that expand what it can do: searching the web, analyzing files, generating images, editing documents side by side and talking with you. Each tool solves a different problem and fails in its own way. This guide explains when to activate each one and how to check what it produces.",
  kpis: [["6", "integrated tools covered"], ["3", "questions before you activate a tool"], ["1", "golden rule: check the result"]],
  sections: [
    { h: "What each tool is for", html: `${table(["Tool", "Use it for", "Check before you use it"], [
      ["<b>Web search</b>", "Recent data, news, prices and official documents", "Open the cited sources and confirm the date and author"],
      ["<b>Data analysis</b>", "Calculations and charts from spreadsheets and CSV files", "Recompute a few rows by hand and compare"],
      ["<b>Image generation</b>", "Illustrations, mockups and concept visuals", "Review text inside the image, logos and rights; an image is illustrative, not evidence"],
      ["<b>Canvas</b>", "Editing long documents or code together with you", "Review each change before you accept it"],
      ["<b>Voice</b>", "Practicing, dictating and quick conversations", "Confirm the transcript before sending important content"],
      ["<b>File reading</b>", "Summarizing PDFs, reports and presentations", "Ask for page citations and open two of them"],
    ])}${box("warn", "Availability", "<p>Which tools you see depends on your plan and the model you select. Check your account before you plan a workflow around a tool.</p>")}` },
    { h: "Three questions before you activate a tool", html: `${steps([
      "<b>What do I need?</b> If the model already knows it or you can paste the text, you may not need a tool.",
      "<b>Is the data safe to share?</b> Upload only what you would be comfortable seeing in a public document. Remove personal and confidential data first.",
      "<b>How will I verify the result?</b> If you have no way to check the output, reconsider the tool or the task.",
    ])}` },
    { h: "Verifying what each tool returns", html: `${cards([
      ["Web search", "Prefer primary sources such as official sites, papers and regulators over summaries of summaries."],
      ["Calculations", "Recompute one row by hand. If it does not match, do not use the total."],
      ["Images", "Check hands, text, logos and any real people or brands before you publish."],
      ["Files", "Ask which page each claim comes from, then open that page and read it."],
    ])}` },
    { h: "Combining tools in one workflow", html: `<p>The strongest results come from a clear sequence, with a check at each step. Example: analyzing monthly sales.</p>${steps([
      "Upload the sales spreadsheet and ask for the monthly trend with data analysis.",
      "Recompute one month by hand and confirm the figure matches.",
      "Use web search to find market context, and keep the sources you will cite.",
      "Use canvas to draft the report, keeping every number linked to the sheet.",
      "Review the final text against the sources before you share it.",
    ])}${box("tip", "Activate only what you need", "<p>Fewer active tools mean fewer surprises. Turn on a tool for the task, and turn it off when the task is done.</p>")}` },
  ],
  closing: `${checks(["I know which tool fits each task.", "I verify every figure before I use it.", "I do not share data I would not share publicly."])}`,
};

export const PT_HERRAMIENTAS = {
  lang: "pt", chip: "Módulo 2 · ChatGPT", module: 2,
  title: "Ferramentas integradas do ChatGPT", subtitle: "Quando usar pesquisa na web, análise de dados, geração de imagens, canvas e voz, e como conferir o que cada uma entrega",
  edition: "Guia didático 2026", art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "O ChatGPT inclui ferramentas que ampliam o que ele pode fazer: pesquisar na web, analisar arquivos, gerar imagens, editar documentos lado a lado e conversar em voz. Cada ferramenta resolve um problema diferente e falha de um jeito próprio. Este guia explica quando ativar cada uma e como conferir o que ela produz.",
  kpis: [["6", "ferramentas integradas abordadas"], ["3", "perguntas antes de ativar uma ferramenta"], ["1", "regra de ouro: conferir o resultado"]],
  sections: [
    { h: "Para que serve cada ferramenta", html: `${table(["Ferramenta", "Use para", "Confira antes de usar"], [
      ["<b>Pesquisa na web</b>", "Dados recentes, notícias, preços e documentos oficiais", "Abra as fontes citadas e confirme a data e o autor"],
      ["<b>Análise de dados</b>", "Cálculos e gráficos a partir de planilhas e arquivos CSV", "Refaça à mão algumas linhas e compare"],
      ["<b>Geração de imagens</b>", "Ilustrações, maquetes e visuais de conceito", "Revise textos dentro da imagem, logotipos e direitos; uma imagem é ilustrativa, não é prova"],
      ["<b>Canvas</b>", "Editar documentos longos ou código junto com você", "Revise cada alteração antes de aceitar"],
      ["<b>Voz</b>", "Praticar, ditar e conversas rápidas", "Confirme a transcrição antes de enviar conteúdo importante"],
      ["<b>Leitura de arquivos</b>", "Resumir PDFs, relatórios e apresentações", "Peça citações de página e abra duas delas"],
    ])}${box("warn", "Disponibilidade", "<p>Quais ferramentas você vê depende do seu plano e do modelo selecionado. Confira na sua conta antes de planejar um fluxo de trabalho em torno de uma ferramenta.</p>")}` },
    { h: "Três perguntas antes de ativar uma ferramenta", html: `${steps([
      "<b>Do que eu preciso?</b> Se o modelo já sabe ou se você pode colar o texto, talvez não precise de ferramenta.",
      "<b>Os dados podem ser compartilhados?</b> Envie apenas o que você mostraria em um documento público. Remova antes os dados pessoais e confidenciais.",
      "<b>Como vou verificar o resultado?</b> Se não há como conferir a saída, reconsidere a ferramenta ou a tarefa.",
    ])}` },
    { h: "Conferindo o que cada ferramenta devolve", html: `${cards([
      ["Pesquisa na web", "Prefira fontes primárias, como sites oficiais, artigos científicos e reguladores, a resumos de resumos."],
      ["Cálculos", "Refaça uma linha à mão. Se não bater, não use o total."],
      ["Imagens", "Confira mãos, textos, logotipos e qualquer pessoa ou marca real antes de publicar."],
      ["Arquivos", "Pergunte de qual página vem cada afirmação, depois abra essa página e leia."],
    ])}` },
    { h: "Combinando ferramentas em um fluxo", html: `<p>Os melhores resultados vêm de uma sequência clara, com uma conferência em cada etapa. Exemplo: analisar as vendas mensais.</p>${steps([
      "Envie a planilha de vendas e peça a tendência mensal com análise de dados.",
      "Refaça um mês à mão e confirme que o número bate.",
      "Use a pesquisa na web para o contexto de mercado e guarde as fontes que vai citar.",
      "Use o canvas para redigir o relatório, mantendo cada número ligado à planilha.",
      "Revise o texto final contra as fontes antes de compartilhar.",
    ])}${box("tip", "Ative só o que precisa", "<p>Menos ferramentas ativas significam menos surpresas. Ligue uma ferramenta para a tarefa e desligue quando ela terminar.</p>")}` },
  ],
  closing: `${checks(["Sei qual ferramenta serve a cada tarefa.", "Confiro cada número antes de usá-lo.", "Não compartilho dados que não mostraria publicamente."])}`,
};
