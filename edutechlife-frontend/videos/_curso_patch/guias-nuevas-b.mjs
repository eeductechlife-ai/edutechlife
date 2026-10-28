// Guías nuevas: Módulo 2 fachada (GPTs, Proyectos y agentes), Módulo 3 Deep Research y Módulo 4 fórmula sonora.
// Español, inglés y portugués. Los nombres de modelos y planes se remiten al selector de la cuenta.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const ES_FACHADA = {
  lang: "es", chip: "Módulo 2 · ChatGPT", module: 2,
  title: "Proyectos, plugins y agentes", subtitle: "Cuándo usar cada uno, cómo configurarlos y cómo probarlos antes de usarlos en serio",
  edition: "Guía didáctica 2026", art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "Un Proyecto, un plugin y un agente resuelven problemas distintos. El <strong>Proyecto</strong> guarda el contexto de un trabajo; el <strong>plugin</strong> reúne reglas, archivos y apps para una tarea repetida; el <strong>agente</strong> ejecuta varios pasos bajo tu supervisión. Esta guía te ayuda a elegir, configurar y probar cada uno.",
  kpis: [["3", "herramientas comparadas"], ["5", "pruebas antes de compartir"], ["1", "regla: tú apruebas cada paso"]],
  sections: [
    { h: "Elegir entre Proyecto, plugin y agente", html: `${table(["Pregunta", "Usa un Proyecto", "Usa un plugin", "Usa un agente"], [
      ["¿Qué guarda?", "Instrucciones y archivos de un trabajo", "Reglas, archivos y apps para una tarea repetida", "Un plan de varios pasos"],
      ["¿Quién decide?", "Tú, en cada conversación", "Tú, al definir reglas y permisos", "Tú, aprobando cada paso"],
      ["Ejemplo", "Propuestas comerciales de un cliente", "Asistente de propuestas con tu tono, tus plantillas y tu calendario", "Comparar cinco proveedores y armar una tabla"],
    ])}${box("warn", "Estado de los GPT personalizados", "<p>OpenAI programó retirar los GPT personalizados el 11 de diciembre de 2026 (fecha sujeta a cambios; algunas cuentas Enterprise tienen otra fecha). Si usas uno: copia sus instrucciones y archivos a un Proyecto (o migra a un plugin si tu cuenta lo ofrece) y prueba el resultado con tres casos reales.</p>")}` },
    { h: "Un Proyecto bien armado", html: `<p>Un Proyecto agrupa lo que siempre se repite en un trabajo: instrucciones, archivos y conversaciones. Así no pegas el mismo contexto cada vez.</p>${steps([
      "Dale un nombre que describa el trabajo, no el tema general. Un Proyecto por objetivo o por cliente.",
      "Escribe instrucciones: rol, público, tono, límites y lo que siempre debe revisarse.",
      "Reglas estables en las instrucciones; datos que cambian (precios, fechas), en una fuente actualizada.",
      "Sube solo los archivos necesarios, revisa qué contienen y anonimiza los datos personales.",
    ])}` },
    { h: "Antes de conectar un plugin", html: `<p>Un plugin puede leer o actuar en tus apps. Antes de conectarlo, lee qué puede ver y qué puede hacer, y da solo el acceso que la tarea necesita.</p>${table(["Revisa", "Pregunta"], [
      ["Permisos", "¿Qué datos lee y qué acciones puede ejecutar?"],
      ["Alcance", "¿Necesita todo tu correo o solo una carpeta?"],
      ["Datos sensibles", "¿Hay datos personales o de menores que no debería ver?"],
    ])}${box("tip", "Regla", "<p>Si no entiendes un permiso, no lo apruebes. Revisa en tu cuenta qué plugins tienes disponibles.</p>")}` },
    { h: "Probar antes de compartir", html: `<p>Un Proyecto o un plugin puede parecer bueno en tu primera conversación y fallar en un caso real. Prueba estos cinco casos, con datos ficticios.</p>${table(["Prueba", "Qué debe hacer"], [
      ["Caso normal", "Resolver bien la tarea para la que fue configurado"],
      ["Caso límite", "Pedir la información que falta antes de responder"],
      ["Fuera de alcance", "Decir «no lo sé» y pasar el caso a una persona"],
      ["Dato sensible", "No pedir ni repetir datos personales o de menores"],
      ["Coherencia", "Mantener el tono y las reglas en toda la conversación"],
    ])}` },
    { h: "El agente: varios pasos, tu aprobación", html: `<p>El agente ejecuta una secuencia (buscar, comparar, resumir, armar un entregable). Primero propone un plan; tu papel es definir el objetivo, fijar límites y aprobar cada paso importante antes de usar el resultado.</p>${box("warn", "Error frecuente", "<p>Aprobar el resultado final sin revisar las fuentes de los pasos intermedios. Un error temprano se propaga a todo el entregable.</p>")}` },
    { h: "Caso práctico: una propuesta para un cliente", html: `${steps([
      "<b>Proyecto:</b> crea el Proyecto del cliente con sus instrucciones y su brief.",
      "<b>Plugin:</b> si la propuesta se repite y necesitas tus apps, conecta un plugin con tu tono y tus plantillas, y revisa sus permisos.",
      "<b>Agente:</b> pídele comparar tres referencias del sector y armar una tabla con fuentes.",
      "<b>Verificación:</b> abre dos fuentes de la tabla y ajusta lo que no se confirme.",
    ])}` },
  ],
  closing: `${checks(["Elijo Proyecto, plugin o agente según la pregunta del trabajo.", "Leo los permisos de un plugin y doy solo el acceso necesario.", "Pruebo con cinco casos antes de compartir.", "Apruebo cada paso de un agente y verifico sus fuentes."])}`,
};

export const EN_FACHADA = {
  lang: "en", chip: "Module 2 · ChatGPT", module: 2,
  title: "GPTs, Projects and Agents", subtitle: "When to use each one, how to design them, and how to test them before using them seriously",
  edition: "Teaching guide 2026", art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "A GPT, a Project and an agent solve different problems. A <strong>Project</strong> keeps the context of one piece of work; a <strong>GPT</strong> keeps rules and knowledge for a repeated task; an <strong>agent</strong> carries out several steps under your supervision. This guide helps you choose and test each one.",
  kpis: [["3", "tools compared"], ["5", "tests to evaluate a GPT"], ["1", "rule: you approve every step"]],
  sections: [
    { h: "Choosing between a Project, a GPT and an agent", html: `${table(["Question", "Use a Project", "Use a GPT", "Use an agent"], [
      ["What does it keep?", "Instructions and files for one piece of work", "Rules and knowledge for a repeated task", "A multi-step plan"],
      ["Who decides?", "You, in each conversation", "You, when you define the rules", "You, approving each step"],
      ["Example", "Proposals for one client", "A proposal advisor with your tone and prices", "Comparing five suppliers and building a table"],
    ])}${box("warn", "Status of GPTs", "<p>OpenAI has announced it will retire custom GPTs on provisional dates. Before you build one, check in your account whether the feature is still available; if you already have a GPT, consider moving its instructions to a Project.</p>")}` },
    { h: "A well-built Project", html: `<p>A Project groups what repeats in a piece of work: instructions, files and conversations. That way you do not paste the same context every time.</p>${steps([
      "Name it after the piece of work, not the general topic.",
      "Write instructions: role, audience, tone, limits and what must always be checked.",
      "Upload only the files you need and review what they contain.",
      "Use one conversation per task inside the Project.",
    ])}` },
    { h: "Testing a GPT before you share it", html: `<p>A GPT can look good in your first conversation and fail on a real case. Test these five cases.</p>${table(["Test", "What the GPT should do"], [
      ["Normal case", "Handle well the task it was designed for"],
      ["Edge case", "Ask for the missing information before answering"],
      ["Out of scope", "Say it cannot help and suggest whom to ask"],
      ["Sensitive data", "Neither ask for nor repeat personal or minors' data"],
      ["Consistency", "Keep the tone and rules throughout the conversation"],
    ])}` },
    { h: "The agent: several steps, your approval", html: `<p>The agent runs a sequence (search, compare, summarize, build a deliverable). Your role is to set the goal, fix the limits and approve each step before using the result.</p>${box("warn", "Common mistake", "<p>Approving the final result without checking the sources of the intermediate steps. An early error spreads through the whole deliverable.</p>")}` },
    { h: "Worked example: a proposal for a client", html: `${steps([
      "<b>Project:</b> create the client's Project with its instructions and brief.",
      "<b>GPT:</b> if the proposal repeats, define an advisor with your tone, your templates and your pricing policy.",
      "<b>Agent:</b> ask it to compare three industry references and build a table with sources.",
      "<b>Verification:</b> open two sources from the table and adjust anything you cannot confirm.",
    ])}` },
  ],
  closing: `${checks(["I choose a Project, a GPT or an agent based on the question of the work.", "I test a GPT with five cases before using it.", "I approve each agent step and verify its sources."])}`,
};

export const PT_FACHADA = {
  lang: "pt", chip: "Módulo 2 · ChatGPT", module: 2,
  title: "GPTs, Projetos e agentes", subtitle: "Quando usar cada um, como desenhá-los e como testá-los antes de usar a sério",
  edition: "Guia didático 2026", art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "Um GPT, um Projeto e um agente resolvem problemas diferentes. O <strong>Projeto</strong> guarda o contexto de um trabalho; o <strong>GPT</strong> guarda regras e conhecimento para uma tarefa repetida; o <strong>agente</strong> executa várias etapas sob a sua supervisão. Este guia ajuda a escolher e a testar cada um.",
  kpis: [["3", "ferramentas comparadas"], ["5", "testes para avaliar um GPT"], ["1", "regra: você aprova cada etapa"]],
  sections: [
    { h: "Escolher entre Projeto, GPT e agente", html: `${table(["Pergunta", "Use um Projeto", "Use um GPT", "Use um agente"], [
      ["O que guarda?", "Instruções e arquivos de um trabalho", "Regras e conhecimento para uma tarefa repetida", "Um plano de várias etapas"],
      ["Quem decide?", "Você, em cada conversa", "Você, ao definir as regras", "Você, aprovando cada etapa"],
      ["Exemplo", "Propostas comerciais de um cliente", "Assessor de propostas com o seu tom e os seus preços", "Comparar cinco fornecedores e montar uma tabela"],
    ])}${box("warn", "Situação dos GPTs", "<p>A OpenAI anunciou a descontinuação dos GPTs personalizados em datas provisórias. Antes de criar um, verifique na sua conta se o recurso ainda está disponível; se você já tem um GPT, considere migrar as instruções para um Projeto.</p>")}` },
    { h: "Um Projeto bem montado", html: `<p>Um Projeto reúne o que se repete em um trabalho: instruções, arquivos e conversas. Assim você não cola o mesmo contexto toda vez.</p>${steps([
      "Dê um nome que descreva o trabalho, e não o tema geral.",
      "Escreva instruções: papel, público, tom, limites e o que deve ser sempre conferido.",
      "Envie só os arquivos necessários e revise o conteúdo de cada um.",
      "Use uma conversa por tarefa dentro do Projeto.",
    ])}` },
    { h: "Testar um GPT antes de compartilhar", html: `<p>Um GPT pode parecer bom na sua primeira conversa e falhar em um caso real. Teste estes cinco casos.</p>${table(["Teste", "O que o GPT deve fazer"], [
      ["Caso normal", "Resolver bem a tarefa para a qual foi criado"],
      ["Caso limite", "Pedir a informação que falta antes de responder"],
      ["Fora do escopo", "Dizer que não pode ajudar e sugerir a quem recorrer"],
      ["Dado sensível", "Não pedir nem repetir dados pessoais ou de menores"],
      ["Coerência", "Manter o tom e as regras em toda a conversa"],
    ])}` },
    { h: "O agente: várias etapas, a sua aprovação", html: `<p>O agente executa uma sequência (buscar, comparar, resumir, montar uma entrega). O seu papel é definir o objetivo, fixar os limites e aprovar cada etapa antes de usar o resultado.</p>${box("warn", "Erro frequente", "<p>Aprovar o resultado final sem conferir as fontes das etapas intermediárias. Um erro no início se espalha por toda a entrega.</p>")}` },
    { h: "Exemplo prático: uma proposta para um cliente", html: `${steps([
      "<b>Projeto:</b> crie o Projeto do cliente com as instruções e o briefing.",
      "<b>GPT:</b> se a proposta se repete, defina um assessor com o seu tom, os seus modelos e a sua política de preços.",
      "<b>Agente:</b> peça que compare três referências do setor e monte uma tabela com fontes.",
      "<b>Verificação:</b> abra duas fontes da tabela e ajuste o que não puder confirmar.",
    ])}` },
  ],
  closing: `${checks(["Escolho Projeto, GPT ou agente conforme a pergunta do trabalho.", "Testo um GPT com cinco casos antes de usá-lo.", "Aprovo cada etapa de um agente e verifico as fontes."])}`,
};
