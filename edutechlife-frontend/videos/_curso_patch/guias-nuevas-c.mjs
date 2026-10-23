// Guías nuevas: Módulo 3 Deep Research y Módulo 4 fórmula sonora (Audio Overviews y gestión documental).
// Español, inglés y portugués.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const ES_DEEP = {
  lang: "es", chip: "Módulo 3 · Gemini", module: 3,
  title: "Deep Research paso a paso", subtitle: "Investigar en varias etapas, verificar cada hallazgo y decidir con evidencia",
  edition: "Guía didáctica 2026", art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "Deep Research explora muchas fuentes, las sintetiza y entrega un informe. Su valor está en el <strong>proceso</strong>: definir bien la pregunta, revisar el plan, verificar las fuentes que sostienen cada conclusión y declarar lo que no se pudo comprobar.",
  kpis: [["4", "etapas del proceso"], ["3", "fuentes mínimas por conclusión"], ["1", "regla: sin fuente no hay conclusión"]],
  sections: [
    { h: "Etapa 1: define una pregunta investigable", html: `<p>Una pregunta vaga produce un informe genérico. Una pregunta investigable tiene tema, público, periodo y lo que queda fuera.</p>${table(["Vaga", "Investigable"], [
      ["¿Qué pasa con la educación y la IA?", "¿Qué estudios recientes en Colombia miden el uso de IA en educación superior, para una rectora que decide un programa?"],
      ["Dame info sobre el mercado.", "Demanda de cursos de IA para adultos en Colombia en los últimos dos años, con fuentes oficiales o académicas."],
    ])}` },
    { h: "Etapa 2: revisa el plan antes de ejecutar", html: `<p>Antes de que busque, el sistema propone las líneas de investigación. Revísalas: ¿faltan fuentes oficiales? ¿Sobra un tema que no te sirve?</p>${checks(["El plan incluye fuentes primarias (organismos, universidades, estadísticas).", "Las líneas cubren el público y el periodo que definiste.", "Quedó claro qué no se va a investigar."])}` },
    { h: "Etapa 3: verifica las conclusiones", html: `${steps([
      "Cada conclusión clave debe tener al menos <b>tres fuentes</b> o una fuente primaria sólida.",
      "Abre la parte de la fuente que sostiene la cifra o la afirmación; no te quedes con el resumen.",
      "Anota fecha y autor de cada fuente. Descarta lo que esté desactualizado para tu pregunta.",
      "Si dos fuentes se contradicen, regístralo: la contradicción también es información.",
    ])}${box("warn", "Señal de alerta", "<p>Un informe que no separa hechos de interpretaciones, o que no declara límites, no está listo para decidir.</p>")}` },
    { h: "Etapa 4: escribe el informe con tus palabras", html: `<p>Reescribe los hallazgos con tus palabras y con el mismo nivel de matiz de las fuentes. Declara lo que no pudiste verificar en una sección propia.</p>${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "El informe final es tu responsabilidad: la herramienta propone, tú decides.", "55%")}${checks(["Resumen ejecutivo de cinco líneas.", "Hallazgos con fuente y fecha.", "Contradicciones y límites declarados.", "Recomendación acotada a lo que la evidencia sostiene."])}` },
  ],
  closing: `${checks(["Defino una pregunta investigable antes de empezar.", "Verifico tres fuentes por conclusión clave.", "Declaro lo que no pude comprobar."])}`,
};

export const EN_DEEP = {
  lang: "en", chip: "Module 3 · Gemini", module: 3,
  title: "Deep Research, Step by Step", subtitle: "Investigating in several stages, verifying each finding and deciding with evidence",
  edition: "Teaching guide 2026", art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "Deep Research explores many sources, synthesizes them and delivers a report. Its value lies in the <strong>process</strong>: defining the question well, reviewing the plan, verifying the sources behind each conclusion and stating what could not be checked.",
  kpis: [["4", "stages in the process"], ["3", "minimum sources per conclusion"], ["1", "rule: no source, no conclusion"]],
  sections: [
    { h: "Stage 1: define a researchable question", html: `<p>A vague question produces a generic report. A researchable question has a topic, an audience, a time frame and a clear exclusion.</p>${table(["Vague", "Researchable"], [
      ["What is happening with education and AI?", "Which recent studies in Colombia measure AI use in higher education, for a dean deciding on a program?"],
      ["Give me information about the market.", "Demand for AI courses for adults in Colombia over the last two years, with official or academic sources."],
    ])}` },
    { h: "Stage 2: review the plan before it runs", html: `<p>Before it searches, the system proposes its research lines. Review them: are official sources missing? Is there a topic you do not need?</p>${checks(["The plan includes primary sources (agencies, universities, statistics).", "The lines cover the audience and period you defined.", "It is clear what will not be investigated."])}` },
    { h: "Stage 3: verify the conclusions", html: `${steps([
      "Each key conclusion needs at least <b>three sources</b> or one solid primary source.",
      "Open the part of the source that supports the figure or claim; do not stop at the summary.",
      "Note the date and author of each source. Discard what is outdated for your question.",
      "If two sources contradict each other, record it: the contradiction is information too.",
    ])}${box("warn", "Warning sign", "<p>A report that does not separate facts from interpretations, or that states no limits, is not ready for a decision.</p>")}` },
    { h: "Stage 4: write the report in your own words", html: `<p>Rewrite the findings in your own words, with the same level of nuance as the sources. State what you could not verify in its own section.</p>${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "The final report is your responsibility: the tool proposes, you decide.", "55%")}${checks(["Five-line executive summary.", "Findings with source and date.", "Contradictions and stated limits.", "A recommendation limited to what the evidence supports."])}` },
  ],
  closing: `${checks(["I define a researchable question before starting.", "I verify three sources per key conclusion.", "I state what I could not verify."])}`,
};

export const PT_DEEP = {
  lang: "pt", chip: "Módulo 3 · Gemini", module: 3,
  title: "Deep Research passo a passo", subtitle: "Pesquisar em várias etapas, verificar cada achado e decidir com evidência",
  edition: "Guia didático 2026", art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "O Deep Research explora muitas fontes, as sintetiza e entrega um relatório. Seu valor está no <strong>processo</strong>: definir bem a pergunta, revisar o plano, verificar as fontes que sustentam cada conclusão e declarar o que não foi possível comprovar.",
  kpis: [["4", "etapas do processo"], ["3", "fontes mínimas por conclusão"], ["1", "regra: sem fonte, não há conclusão"]],
  sections: [
    { h: "Etapa 1: defina uma pergunta pesquisável", html: `<p>Uma pergunta vaga gera um relatório genérico. Uma pergunta pesquisável tem tema, público, período e o que fica de fora.</p>${table(["Vaga", "Pesquisável"], [
      ["O que está acontecendo com a educação e a IA?", "Quais estudos recentes no Brasil medem o uso de IA no ensino superior, para uma reitora que decide um programa?"],
      ["Me dê informações sobre o mercado.", "Demanda por cursos de IA para adultos no Brasil nos últimos dois anos, com fontes oficiais ou acadêmicas."],
    ])}` },
    { h: "Etapa 2: revise o plano antes de executar", html: `<p>Antes de pesquisar, o sistema propõe as linhas de investigação. Revise: faltam fontes oficiais? Sobra algum tema que você não precisa?</p>${checks(["O plano inclui fontes primárias (órgãos, universidades, estatísticas).", "As linhas cobrem o público e o período que você definiu.", "Ficou claro o que não será investigado."])}` },
    { h: "Etapa 3: verifique as conclusões", html: `${steps([
      "Cada conclusão-chave precisa de pelo menos <b>três fontes</b> ou de uma fonte primária sólida.",
      "Abra a parte da fonte que sustenta o número ou a afirmação; não fique só no resumo.",
      "Anote a data e o autor de cada fonte. Descarte o que está desatualizado para a sua pergunta.",
      "Se duas fontes se contradizem, registre: a contradição também é informação.",
    ])}${box("warn", "Sinal de alerta", "<p>Um relatório que não separa fatos de interpretações, ou que não declara limites, não está pronto para decidir.</p>")}` },
    { h: "Etapa 4: escreva o relatório com as suas palavras", html: `<p>Reescreva os achados com as suas palavras e com o mesmo nível de nuance das fontes. Declare o que não foi possível verificar em uma seção própria.</p>${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "O relatório final é sua responsabilidade: a ferramenta propõe, você decide.", "55%")}${checks(["Resumo executivo de cinco linhas.", "Achados com fonte e data.", "Contradições e limites declarados.", "Recomendação limitada ao que a evidência sustenta."])}` },
  ],
  closing: `${checks(["Defino uma pergunta pesquisável antes de começar.", "Verifico três fontes por conclusão-chave.", "Declaro o que não consegui comprovar."])}`,
};

export const ES_AUDIO = {
  lang: "es", chip: "Módulo 4 · Gemini Notebook", module: 4,
  title: "La fórmula sonora: audio y documentos", subtitle: "Convertir fuentes en audio para repasar y gestionar documentos con orden y privacidad",
  edition: "Guía didáctica 2026", art: null,
  lead: "Los resúmenes en audio convierten tus fuentes en una conversación para escuchar mientras repasas. Pero el audio es una <strong>primera lectura</strong>, no una verdad verificada. Esta guía te enseña a usarlo bien y a organizar los documentos para que lo que escuchas siempre se pueda comprobar.",
  kpis: [["2", "voces en un Audio Overview"], ["3", "pasos para preparar las fuentes"], ["1", "regla: escuchar, luego verificar"]],
  sections: [
    { h: "Qué es un Audio Overview", html: `<p>Es un resumen hablado de tus fuentes, presentado como una conversación entre dos voces que comentan las ideas principales. Sirve para entender el panorama en pocos minutos.</p>${box("tip", "Cuándo usarlo", "<p>Para repasar en movimiento, para tener una primera idea de un documento largo o para explicar un tema a alguien sin leerle el material.</p>")}` },
    { h: "Preparar las fuentes antes de generar el audio", html: `${steps([
      "<b>Selecciona:</b> solo las fuentes del mismo tema y periodo. Un audio mezclado confunde.",
      "<b>Nombra:</b> usa títulos que digan qué es cada documento y de qué año es.",
      "<b>Revisa:</b> confirma que el texto se lee bien (un PDF escaneado sin texto no sirve).",
    ])}` },
    { h: "Escuchar y verificar", html: `${steps([
      "Escucha el audio completo una vez, sin pausar.",
      "Anota tres ideas con tus palabras.",
      "Abre las citas de las ideas que te interesan y compara con el original.",
      "Si el audio dice algo que no encuentras en la fuente, no lo uses.",
    ])}${box("warn", "Límite importante", "<p>El audio resume, y al resumir se pierden matices: condiciones, excepciones y cifras exactas. Para decisiones, vuelve siempre al documento.</p>")}` },
    { h: "Gestión documental: orden y privacidad", html: `${table(["Práctica", "Por qué importa"], [
      ["Un cuaderno por tema o proyecto", "Evita mezclar fuentes que no deben responderse juntas"],
      ["Versiones con fecha en el nombre", "Sabes qué documento usaste y cuándo"],
      ["Quitar datos personales antes de subir", "Los documentos suelen traer nombres, cédulas o teléfonos ocultos"],
      ["Revisar quién tiene acceso al cuaderno", "Compartir un cuaderno comparte también sus fuentes"],
    ])}${checks(["Confirmé que las fuentes son del mismo tema y periodo.", "Quité datos personales antes de subir los documentos.", "Verifiqué las ideas del audio contra las citas."])}` },
  ],
  closing: `${checks(["Escucho el audio y luego verifico en las citas.", "Organizo un cuaderno por tema y con fechas claras.", "Protejo los datos personales antes de subir documentos."])}`,
};

export const EN_AUDIO = {
  lang: "en", chip: "Module 4 · Gemini Notebook", module: 4,
  title: "The Secret Formula: Audio and Documents", subtitle: "Turning sources into audio for review, and managing documents with order and privacy",
  edition: "Teaching guide 2026", art: null,
  lead: "Audio summaries turn your sources into a conversation you can listen to while you review. But audio is a <strong>first reading</strong>, not verified truth. This guide shows you how to use it well and how to organize documents so that everything you hear can always be checked.",
  kpis: [["2", "voices in an Audio Overview"], ["3", "steps to prepare the sources"], ["1", "rule: listen, then verify"]],
  sections: [
    { h: "What an Audio Overview is", html: `<p>It is a spoken summary of your sources, presented as a conversation between two voices who discuss the main ideas. It helps you grasp the overall picture in a few minutes.</p>${box("tip", "When to use it", "<p>To review on the move, to get a first idea of a long document, or to explain a topic to someone without reading the material aloud.</p>")}` },
    { h: "Prepare the sources before generating audio", html: `${steps([
      "<b>Select:</b> only sources on the same topic and period. Mixed audio is confusing.",
      "<b>Name:</b> use titles that say what each document is and what year it is from.",
      "<b>Check:</b> make sure the text reads properly (a scanned PDF without text is useless).",
    ])}` },
    { h: "Listen and verify", html: `${steps([
      "Listen to the full audio once, without pausing.",
      "Write down three ideas in your own words.",
      "Open the citations for the ideas you care about and compare with the original.",
      "If the audio says something you cannot find in the source, do not use it.",
    ])}${box("warn", "Key limit", "<p>A summary loses nuance: conditions, exceptions and exact figures. For decisions, always go back to the document.</p>")}` },
    { h: "Document management: order and privacy", html: `${table(["Practice", "Why it matters"], [
      ["One notebook per topic or project", "Avoids mixing sources that should not be answered together"],
      ["Versions with dates in the name", "You know which document you used and when"],
      ["Remove personal data before uploading", "Documents often carry hidden names, ID numbers or phone numbers"],
      ["Check who can access the notebook", "Sharing a notebook also shares its sources"],
    ])}${checks(["I confirmed the sources are on the same topic and period.", "I removed personal data before uploading documents.", "I checked the audio ideas against the citations."])}` },
  ],
  closing: `${checks(["I listen to the audio and then verify against the citations.", "I organize one notebook per topic with clear dates.", "I protect personal data before uploading documents."])}`,
};

export const PT_AUDIO = {
  lang: "pt", chip: "Módulo 4 · Gemini Notebook", module: 4,
  title: "A fórmula sonora: áudio e documentos", subtitle: "Transformar fontes em áudio para revisar e gerenciar documentos com ordem e privacidade",
  edition: "Guia didático 2026", art: null,
  lead: "Os resumos em áudio transformam as suas fontes em uma conversa para ouvir enquanto revisa. Mas o áudio é uma <strong>primeira leitura</strong>, não uma verdade verificada. Este guia ensina a usá-lo bem e a organizar os documentos para que tudo o que você ouve possa sempre ser conferido.",
  kpis: [["2", "vozes em um Audio Overview"], ["3", "passos para preparar as fontes"], ["1", "regra: ouvir, depois verificar"]],
  sections: [
    { h: "O que é um Audio Overview", html: `<p>É um resumo falado das suas fontes, apresentado como uma conversa entre duas vozes que comentam as ideias principais. Ajuda a entender o panorama em poucos minutos.</p>${box("tip", "Quando usar", "<p>Para revisar em movimento, para ter uma primeira ideia de um documento longo ou para explicar um tema a alguém sem ler o material em voz alta.</p>")}` },
    { h: "Preparar as fontes antes de gerar o áudio", html: `${steps([
      "<b>Selecione:</b> só fontes do mesmo tema e período. Um áudio misturado confunde.",
      "<b>Nomeie:</b> use títulos que digam o que é cada documento e de que ano é.",
      "<b>Confira:</b> garanta que o texto é legível (um PDF escaneado sem texto não serve).",
    ])}` },
    { h: "Ouvir e verificar", html: `${steps([
      "Ouça o áudio completo uma vez, sem pausar.",
      "Anote três ideias com as suas palavras.",
      "Abra as citações das ideias que lhe interessam e compare com o original.",
      "Se o áudio disser algo que você não encontra na fonte, não use.",
    ])}${box("warn", "Limite importante", "<p>O resumo perde nuances: condições, exceções e números exatos. Para decisões, volte sempre ao documento.</p>")}` },
    { h: "Gestão documental: ordem e privacidade", html: `${table(["Prática", "Por que importa"], [
      ["Um caderno por tema ou projeto", "Evita misturar fontes que não devem ser respondidas juntas"],
      ["Versões com data no nome", "Você sabe qual documento usou e quando"],
      ["Retirar dados pessoais antes de enviar", "Documentos costumam trazer nomes, CPFs ou telefones escondidos"],
      ["Revisar quem tem acesso ao caderno", "Compartilhar um caderno também compartilha as suas fontes"],
    ])}${checks(["Confirmei que as fontes são do mesmo tema e período.", "Retirei dados pessoais antes de enviar os documentos.", "Conferi as ideias do áudio com as citações."])}` },
  ],
  closing: `${checks(["Ouço o áudio e depois verifico nas citações.", "Organizo um caderno por tema, com datas claras.", "Protejo os dados pessoais antes de enviar documentos."])}`,
};
