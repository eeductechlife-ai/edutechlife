// Versões em português (Brasil) das guias do Módulo 4 (Gemini Notebook e modelos).
// A mudança de nome de NotebookLM para Gemini Notebook (16 de julho de 2026) está confirmada.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const PT_M4_GUIA = {
  lang: "pt",
  chip: "Módulo 4 · Gemini Notebook",
  module: 4,
  title: "Gemini Notebook",
  subtitle: "Guia didático: fontes próprias, respostas com citações, resumos e áudio para estudar e trabalhar",
  edition: "Edição 2026",
  art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "O Gemini Notebook é um caderno de pesquisa que responde <strong>apenas com as suas fontes</strong> e cita de onde vem cada resposta. É ideal para estudar, sintetizar documentos e transformar material longo em resumos, mapas mentais, cartões de estudo e áudio.",
  kpis: [["16 jul", "data da mudança de nome"], ["3–5", "fontes para começar"], ["Citações", "cada resposta mostra sua fonte"]],
  sections: [
    {
      h: "A mudança de nome",
      html: `<p>Em <strong>16 de julho de 2026</strong> o Google renomeou o NotebookLM como <strong>Gemini Notebook</strong>. É o mesmo produto: o nome mudou, e os cadernos que você começou no Gemini se sincronizam com o aplicativo.</p>
${box("tip", "Se você vir NotebookLM em um tutorial", "<p>É a mesma ferramenta. Encontre o caderno pelo nome atual e confira as opções da sua conta, já que alguns recursos são liberados por etapas.</p>")}`,
    },
    {
      h: "O que o diferencia de um chat",
      html: `${cards([
  ["Apenas as suas fontes", "Responde a partir dos documentos que você enviou. Se a informação não estiver lá, ele diz."],
  ["Citações verificáveis", "Cada afirmação tem um número que leva ao trecho exato do documento."],
  ["Transforma o que você lê", "Gera resumos, mapas mentais, cartões de estudo, questionários e áudio."],
  ["Estudo sem invenção", "Ideal para revisar o seu próprio material, em vez de depender do que o modelo lembra."],
])}`,
    },
    {
      h: "Crie o seu primeiro caderno",
      html: `${steps([
  "Entre com sua conta Google e crie um caderno novo, com um nome que descreva o tema.",
  "Envie de três a cinco fontes de qualidade: anotações, um artigo acadêmico, um relatório oficial.",
  "Aguarde o processamento das fontes e revise o resumo que o caderno propõe.",
  "Faça uma pergunta específica e abra uma citação para conferir o trecho original.",
])}
${figure("/ialab-resources/modulo4/ilustraciones/cuaderno-fuentes.jpg", "Envie as suas fontes: o caderno responde apenas com o que elas contêm.", "55%")}`,
    },
    {
      h: "Escolher boas fontes",
      html: `<p>A qualidade das fontes define a qualidade das respostas. Mais fontes nem sempre significam melhores resultados: um caderno com 50 documentos desorganizados responde pior do que um com cinco bem escolhidos.</p>
${table(["Boa fonte", "Fonte fraca"], [
  ["Relatório de órgão oficial com data e autor", "Texto sem autor, sem data e sem referências"],
  ["Artigo acadêmico revisado por pares", "Publicação anônima e sem referências"],
  ["Suas próprias anotações organizadas por tema", "Anotações soltas que se contradizem"],
  ["Documentos do mesmo período e tema", "Mistura de datas que muda a conclusão"],
])}`,
    },
    {
      h: "Perguntar com citações",
      html: `<p>As respostas incluem números entre colchetes. Cada número abre o trecho do documento de onde vem a afirmação.</p>
${checks([
  "Abra pelo menos uma citação para cada resposta importante.",
  "Se uma afirmação não tiver citação, não a use antes de verificar.",
  "Peça comparações: «onde essas fontes discordam?»",
])}
${box("warn", "Regra prática", "<p>Uma resposta sem citações é uma hipótese. Uma resposta com citações ainda exige o seu julgamento: confirme que o trecho diz o que a resposta afirma.</p>")}`,
    },
    {
      h: "Formatos de estudo",
      html: `${table(["Formato", "Para que serve", "Como pedir"], [
  ["<b>Resumo</b>", "Entender a ideia central em minutos", "«Resuma as fontes em cinco ideias, cada uma com sua citação»"],
  ["<b>Mapa mental</b>", "Ver as relações entre conceitos", "«Crie um mapa dos conceitos-chave e de como se relacionam»"],
  ["<b>Cartões de estudo</b>", "Memorizar termos e definições", "«Crie 15 cartões de pergunta e resposta com citação»"],
  ["<b>Questionário</b>", "Verificar o que você entendeu", "«Crie 10 perguntas de múltipla escolha com justificativas»"],
])}`,
    },
    {
      h: "Audio Overviews: revisar ouvindo",
      html: `<p>Os resumos em áudio transformam as suas fontes em uma conversa entre duas vozes. São excelentes para revisar em movimento. Use-os como primeira leitura, não como substituto das fontes críticas: depois, abra as citações que mais interessam.</p>
${figure("/ialab-resources/modulo4/ilustraciones/audio-overview.jpg", "Ouça primeiro; depois verifique nas citações.", "52%")}
${box("tip", "Como aproveitar", "<p>Ouça uma vez sem pausar, depois escreva três ideias com as suas palavras e compare com as citações.</p>")}`,
    },
    {
      h: "Análise com código",
      html: `<p>O Gemini Notebook pode escrever e executar código em um ambiente seguro na nuvem para analisar as suas fontes com mais profundidade. Este recurso é liberado por plano: confira na sua conta se ele já está disponível. Antes de usar seus resultados, confira os números com uma amostra.</p>`,
    },
    {
      h: "Curadoria e uso responsável",
      html: `<p>Curar é escolher o que entra no caderno e como ele será usado. Antes de compartilhar um resumo gerado:</p>
${checks([
  "Conferi os números e as citações com o documento original.",
  "Não incluí dados pessoais de terceiros nem informações confidenciais.",
  "Declarei que o resumo foi gerado com IA, quando for o caso.",
])}
${figure("/ialab-resources/modulo4/ilustraciones/equipo-curaduria.jpg", "Cure em equipe: revise, cite e decida o que entra no caderno.", "100%")}
<p class="muted">No Brasil, se você trabalha com dados pessoais, vale a <strong>LGPD (Lei 13.709/2018)</strong>.</p>`,
    },
    {
      h: "Exemplo prático: preparar uma prova em 60 minutos",
      html: `${steps([
  "<b>Minutos 0–10:</b> envie suas três fontes principais (anotações, um capítulo, um guia oficial) e peça um resumo das ideias centrais com as citações.",
  "<b>Minutos 10–25:</b> peça um mapa mental dos conceitos e de como se relacionam. Confira se cada relação tem citação.",
  "<b>Minutos 25–40:</b> gere 15 cartões de estudo com citação. Estude primeiro os que você erra.",
  "<b>Minutos 40–60:</b> peça um questionário de 10 perguntas com justificativas e citações. Responda sem olhar e revise cada erro com a citação original.",
])}
${box("tip", "Sinal de que você estudou bem", "<p>Você consegue explicar cada conceito sem olhar as anotações e encontrar a citação que o sustenta. Se não conseguir, volte à fonte.</p>")}`,
    },
    {
      h: "Plano de prática",
      html: `${steps([
  "Crie um caderno com três fontes sobre um tema que você estuda.",
  "Faça cinco perguntas e verifique uma citação em cada uma.",
  "Gere um mapa mental e um conjunto de cartões de estudo.",
  "Ouça um Audio Overview e escreva três ideias com as suas palavras.",
  "Compare duas fontes e registre onde elas se contradizem.",
])}`,
    },
  ],
  closing: `${checks([
    "Uso o Gemini Notebook com poucas fontes, bem escolhidas e de qualidade.",
    "Verifico as citações antes de usar uma afirmação.",
    "Transformo o material em formatos de estudo que me fazem lembrar.",
    "Protejo os dados pessoais e declaro o uso de IA quando for o caso.",
  ])}`,
};

export const PT_M4_PLANTILLAS = {
  lang: "pt",
  chip: "Módulo 4 · Modelos",
  module: 4,
  title: "O caderno do futuro",
  subtitle: "Modelos de resumo e estudo para cada tipo de documento no Gemini Notebook",
  edition: "Kit de ferramentas 2026",
  art: null,
  lead: "Um bom resumo começa com uma boa instrução. Estes modelos servem para pedir resumos conforme o tipo de documento e o objetivo, e para conferir se o resultado é fiel à fonte.",
  kpis: [["6", "modelos prontos para usar"], ["4", "passos para revisar um resumo"], ["1", "regra: toda ideia com citação"]],
  sections: [
    {
      h: "Como usar estes modelos",
      html: `${steps([
  "Escolha o modelo conforme o tipo de documento.",
  "Substitua os colchetes pelo seu contexto real.",
  "Peça uma citação para cada ideia e confira duas delas.",
  "Salve o resumo com o nome da fonte e a data.",
])}`,
    },
    {
      h: "Modelo 1: documento acadêmico",
      html: `<p><b>Use para:</b> artigos, teses, capítulos de livros.</p>
<div class="prompt">Resuma [documento] para [público] em cinco ideias.
Para cada ideia: a afirmação, a principal evidência com sua citação e a limitação do estudo.
Termine com as três perguntas que continuam em aberto.</div>`,
    },
    {
      h: "Modelo 2: relatório empresarial",
      html: `<p><b>Use para:</b> relatórios de gestão, propostas, atas de reunião.</p>
<div class="prompt">Resuma [documento] para uma decisão sobre [decisão].
Entregue: 1) o principal resultado com número e citação, 2) riscos, 3) ações com responsável, se aparecer, 4) dados que faltam.</div>`,
    },
    {
      h: "Modelo 3: documento técnico",
      html: `<p><b>Use para:</b> manuais, especificações, documentação de software.</p>
<div class="prompt">Explique [documento] para alguém sem formação técnica.
Inclua: o que faz, como usar passo a passo, erros comuns e em qual seção está cada ponto.</div>`,
    },
    {
      h: "Modelo 4: norma ou documento jurídico",
      html: `<p><b>Use para:</b> normas, políticas internas, contratos. O resumo orienta; não substitui a orientação jurídica.</p>
<div class="prompt">Resuma as obrigações e prazos de [documento].
Indique cada artigo ou cláusula com sua citação.
Não interprete consequências jurídicas: marque o que um advogado deve revisar.</div>`,
    },
    {
      h: "Modelo 5: notícias e pesquisa",
      html: `<p><b>Use para:</b> artigos de imprensa, relatórios de mercado, estudos de caso.</p>
<div class="prompt">Compare [fonte A] e [fonte B] sobre [tema].
Entregue: os dados em que coincidem, os dados em que divergem, qual fonte tem mais respaldo e por quê.</div>`,
    },
    {
      h: "Modelo 6: estudo pessoal",
      html: `<p><b>Use para:</b> preparar uma prova ou revisar um tema.</p>
<div class="prompt">Crie 10 perguntas de múltipla escolha sobre [tema] com base apenas nestas fontes.
Para cada pergunta: quatro alternativas, a correta, a citação que a sustenta e uma explicação de por que as outras estão erradas.</div>`,
    },
    {
      h: "Como revisar um resumo",
      html: `${table(["Passo", "Pergunta de revisão"], [
  ["1. Fidelidade", "Cada ideia aparece no documento original?"],
  ["2. Números", "Os números coincidem exatamente com a fonte?"],
  ["3. Nuances", "Alguma condição, exceção ou limitação se perdeu?"],
  ["4. Uso", "O que vou fazer com o resumo é coerente com o que a fonte diz?"],
])}
${box("warn", "Antes de compartilhar", "<p>Um resumo compartilhado é sua responsabilidade. Verifique-o, declare o uso de IA quando for o caso e não inclua dados pessoais de terceiros.</p>")}`,
    },
  ],
  closing: `${checks([
    "Escolhi o modelo conforme o tipo de documento.",
    "Conferi cada número e cada citação com a fonte.",
    "Declarei o uso de IA e protegi os dados pessoais.",
  ])}`,
};
