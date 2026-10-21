// Guías nuevas (temas que no tenían PDF): Módulo 1 fundamentos y Módulo 2 fachada.
// Español, inglés y portugués. Afirmaciones generales y verificables; los modelos y planes se remiten a la cuenta.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const ES_FUNDAMENTOS = {
  lang: "es", chip: "Módulo 1 · Fundamentos", module: 1,
  title: "Qué es la IA generativa", subtitle: "Cómo funciona, qué puede y qué no puede hacer, y cómo usarla con criterio",
  edition: "Guía didáctica 2026", art: null,
  lead: "La IA generativa produce textos, imágenes, audio y código a partir de patrones aprendidos de enormes cantidades de datos. No <strong>sabe</strong> como una persona: predice lo que tiene más sentido después de lo que ya escribiste. Entender esa diferencia es la base de todo lo que harás en el curso.",
  kpis: [["3", "tipos de IA que conviene distinguir"], ["4", "límites que debes recordar"], ["1", "regla de oro: verificar"]],
  sections: [
    { h: "Qué es y cómo aprende", html: `<p>Un modelo generativo se entrena con textos y otros datos para predecir la siguiente pieza de información: una palabra, un fragmento de imagen o un tono de voz. Al repetir esa predicción miles de millones de veces, aprende estructuras del lenguaje, del razonamiento y del estilo.</p><p>Por eso puede escribir un correo convincente sin haber leído tu correo: no recupera una respuesta guardada, la construye.</p>${box("tip", "Idea central", "<p>La IA generativa construye respuestas plausibles. Plausible no siempre significa correcto: por eso la verificación es parte del trabajo.</p>")}` },
    { h: "Tres tipos de IA que conviene distinguir", html: `${table(["Tipo", "Qué hace", "Ejemplo en la vida diaria"], [
      ["<b>IA estrecha</b>", "Resuelve una tarea concreta muy bien", "Filtro de spam, reconocimiento facial del teléfono"],
      ["<b>IA generativa</b>", "Crea contenido nuevo a partir de un pedido", "Redactar un correo, generar una imagen, resumir un informe"],
      ["<b>IA general (hipotética)</b>", "Igualaría la versatilidad humana en cualquier tarea", "Todavía no existe; no debe confundirse con las herramientas actuales"],
    ])}` },
    { h: "Qué puede hacer bien", html: `${cards([
      ["Transformar", "Resumir, reescribir, traducir o cambiar el tono de un texto propio."],
      ["Estructurar", "Convertir notas desordenadas en esquemas, tablas o listas de pasos."],
      ["Explorar", "Generar ideas, alternativas y preguntas para pensar un problema."],
      ["Acelerar", "Hacer en minutos un primer borrador que tú luego revisas y mejoras."],
    ])}` },
    { h: "Sus límites que debes recordar", html: `${steps([
      "<b>Puede inventar:</b> cifras, citas y referencias con total seguridad (las llamadas alucinaciones).",
      "<b>No tiene tu contexto:</b> lo que no le dices, lo adivina.",
      "<b>Hereda sesgos:</b> sus datos de entrenamiento pueden repetir estereotipos.",
      "<b>Cambia con el tiempo:</b> modelos, planes y precios se actualizan con frecuencia.",
    ])}` },
    { h: "Cómo usarla con criterio", html: `<p>Usa la IA para empezar, ordenar y revisar. Decide tú el contenido final, verifica lo importante y declara cuándo la usaste.</p>${checks([
      "Antes de usar una cifra o una cita, la comprobé en la fuente original.",
      "Di al modelo qué necesito, para quién y con qué límites.",
      "No compartí datos personales ni confidenciales.",
      "Declaré el uso de IA cuando el resultado sale de mi nombre.",
    ])}` },
  ],
  closing: `${checks(["Distingo IA estrecha, generativa y la general hipotética.", "Sé que puede inventar y verifico lo que importa.", "Uso la IA para empezar y revisar, no para pensar por mí."])}`,
};

export const EN_FUNDAMENTOS = {
  lang: "en", chip: "Module 1 · Foundations", module: 1,
  title: "What Generative AI Is", subtitle: "How it works, what it can and cannot do, and how to use it with judgment",
  edition: "Teaching guide 2026", art: null,
  lead: "Generative AI produces text, images, audio and code from patterns learned from enormous amounts of data. It does not <strong>know</strong> the way a person does: it predicts what makes most sense after what you have written. Understanding that difference is the foundation of everything you will do in this course.",
  kpis: [["3", "types of AI worth telling apart"], ["4", "limits to remember"], ["1", "golden rule: verify"]],
  sections: [
    { h: "What it is and how it learns", html: `<p>A generative model is trained on text and other data to predict the next piece of information: a word, a fragment of an image or a voice tone. By repeating that prediction billions of times, it learns the structures of language, reasoning and style.</p><p>That is why it can write a convincing email without having read yours: it does not retrieve a stored answer, it builds one.</p>${box("tip", "Core idea", "<p>Generative AI builds plausible answers. Plausible does not always mean correct, which is why verification is part of the work.</p>")}` },
    { h: "Three types of AI worth telling apart", html: `${table(["Type", "What it does", "Everyday example"], [
      ["<b>Narrow AI</b>", "Solves one specific task very well", "Spam filter, face unlock on your phone"],
      ["<b>Generative AI</b>", "Creates new content from a request", "Drafting an email, generating an image, summarizing a report"],
      ["<b>General AI (hypothetical)</b>", "Would match human versatility across any task", "Does not exist yet; do not confuse it with today's tools"],
    ])}` },
    { h: "What it does well", html: `${cards([
      ["Transform", "Summarize, rewrite, translate or change the tone of your own text."],
      ["Structure", "Turn messy notes into outlines, tables or step-by-step lists."],
      ["Explore", "Generate ideas, alternatives and questions to think a problem through."],
      ["Accelerate", "Produce a first draft in minutes that you then review and improve."],
    ])}` },
    { h: "Its limits you must remember", html: `${steps([
      "<b>It can invent:</b> figures, quotes and references with complete confidence (so-called hallucinations).",
      "<b>It does not have your context:</b> whatever you do not tell it, it guesses.",
      "<b>It inherits biases:</b> its training data can repeat stereotypes.",
      "<b>It changes over time:</b> models, plans and prices are updated often.",
    ])}` },
    { h: "How to use it with judgment", html: `<p>Use AI to start, organize and review. You decide the final content, verify what matters and disclose when you used it.</p>${checks([
      "Before using a figure or quote, I checked it against the original source.",
      "I tell the model what I need, for whom, and with which limits.",
      "I did not share personal or confidential data.",
      "I disclose AI use when the result goes out under my name.",
    ])}` },
  ],
  closing: `${checks(["I can tell narrow, generative and hypothetical general AI apart.", "I know it can invent, and I verify what matters.", "I use AI to start and review, not to think for me."])}`,
};

export const PT_FUNDAMENTOS = {
  lang: "pt", chip: "Módulo 1 · Fundamentos", module: 1,
  title: "O que é a IA generativa", subtitle: "Como funciona, o que pode e o que não pode fazer, e como usá-la com critério",
  edition: "Guia didático 2026", art: null,
  lead: "A IA generativa produz textos, imagens, áudio e código a partir de padrões aprendidos em enormes quantidades de dados. Ela não <strong>sabe</strong> como uma pessoa: prevê o que mais faz sentido depois do que você escreveu. Entender essa diferença é a base de tudo o que você vai fazer no curso.",
  kpis: [["3", "tipos de IA que vale distinguir"], ["4", "limites para lembrar"], ["1", "regra de ouro: verificar"]],
  sections: [
    { h: "O que é e como aprende", html: `<p>Um modelo generativo é treinado com textos e outros dados para prever a próxima peça de informação: uma palavra, um trecho de imagem ou um tom de voz. Ao repetir essa previsão bilhões de vezes, ele aprende estruturas da linguagem, do raciocínio e do estilo.</p><p>Por isso consegue escrever um e-mail convincente sem ter lido o seu: não recupera uma resposta guardada, ele a constrói.</p>${box("tip", "Ideia central", "<p>A IA generativa constrói respostas plausíveis. Plausível nem sempre quer dizer correto, e por isso a verificação faz parte do trabalho.</p>")}` },
    { h: "Três tipos de IA que vale distinguir", html: `${table(["Tipo", "O que faz", "Exemplo do dia a dia"], [
      ["<b>IA restrita</b>", "Resolve bem uma tarefa específica", "Filtro de spam, reconhecimento facial do celular"],
      ["<b>IA generativa</b>", "Cria conteúdo novo a partir de um pedido", "Redigir um e-mail, gerar uma imagem, resumir um relatório"],
      ["<b>IA geral (hipotética)</b>", "Igualaria a versatilidade humana em qualquer tarefa", "Ainda não existe; não deve ser confundida com as ferramentas atuais"],
    ])}` },
    { h: "O que faz bem", html: `${cards([
      ["Transformar", "Resumir, reescrever, traduzir ou mudar o tom do seu próprio texto."],
      ["Estruturar", "Transformar anotações desorganizadas em esquemas, tabelas ou listas de passos."],
      ["Explorar", "Gerar ideias, alternativas e perguntas para pensar um problema."],
      ["Acelerar", "Produzir em minutos um primeiro rascunho que você revisa e melhora."],
    ])}` },
    { h: "Os limites que você precisa lembrar", html: `${steps([
      "<b>Pode inventar:</b> números, citações e referências com total segurança (as chamadas alucinações).",
      "<b>Não tem o seu contexto:</b> o que você não disser, ela adivinha.",
      "<b>Herda vieses:</b> os dados de treinamento podem repetir estereótipos.",
      "<b>Muda com o tempo:</b> modelos, planos e preços são atualizados com frequência.",
    ])}` },
    { h: "Como usá-la com critério", html: `<p>Use a IA para começar, organizar e revisar. A decisão sobre o conteúdo final é sua: verifique o que importa e declare quando a usou.</p>${checks([
      "Antes de usar um número ou uma citação, conferi na fonte original.",
      "Digo à IA do que preciso, para quem e com quais limites.",
      "Não compartilhei dados pessoais nem confidenciais.",
      "Declarei o uso de IA quando o resultado sai em meu nome.",
    ])}` },
  ],
  closing: `${checks(["Distingo IA restrita, generativa e a geral hipotética.", "Sei que ela pode inventar e verifico o que importa.", "Uso a IA para começar e revisar, não para pensar por mim."])}`,
};
