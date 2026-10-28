import { ALL_LESSONS } from "./ialabLessons";
import { ALL_LESSONS_EN } from "./ialabLessonsEn";
import { ALL_LESSONS_PT } from "./ialabLessonsPt";
import { MODULE_QUESTIONS } from "./ialabQuestions";
import { BADGE_INFO, BADGE_INFO_EN, BADGE_INFO_PT } from "./ialabBadges";
export { ALL_LESSONS } from "./ialabLessons";
export { ALL_LESSONS_EN } from "./ialabLessonsEn";
export { ALL_LESSONS_PT } from "./ialabLessonsPt";
export { MODULE_QUESTIONS } from "./ialabQuestions";
export { BADGE_INFO, BADGE_INFO_EN, BADGE_INFO_PT } from "./ialabBadges";

/**
 * @typedef {{ id: number, title: string, description: string, duration: string, type: string, hasMedia: boolean, icon: string, objectives: string[] }} Lesson
 * @typedef {{ id: number, title: string, icon: string, color: string, topics: string[], challenge: string, desc: string, duration: string, level: string, videos: number, projects: number }} Module
 * @typedef {{ id: string, topic: string, correctAnswer: string }} ModuleQuestion
 * @typedef {{ lessonId: number, question: string, options: string[], correct: number }} Checkpoint
 * @typedef {{ icon: string, label: string, desc: string, color: string }} BadgeInfo
 */

/** @type {Module[]} */
export const modules = [
  {
    id: 1,
    title: "Artesano Digital: Prompts",
    icon: "fa-wand-magic-sparkles",
    color: "#4DA8C4",
    topics: [
      "Dar instrucciones claras a la IA",
      "Mejorar cualquier pregunta para obtener mejores respuestas",
      "Entender por qué la IA falla y cómo corregirlo",
      "Obtener resultados útiles en menos tiempo",
      "Aplicar la IA en estudio, trabajo y vida diaria",
      "Pedir exactamente lo que necesita, sin rodeos",
    ],
    challenge:
      "¡Llegó el momento de la práctica! Aplica todo lo aprendido en este módulo resolviendo un caso real. Atrévete a consolidar tu aprendizaje, supera el desafío y lleva tus conocimientos al siguiente nivel.",
    desc: "La IA te da respuestas genéricas que no resuelven lo que necesitas. En este módulo aprenderás a escribir prompts claros y a mejorarlos hasta obtener resultados útiles. Vas a practicar la fórmula RTF (Rol + Tarea + Formato), sumando el contexto necesario, y a aplicar la IA en tu estudio, trabajo y vida diaria.",
    duration: "2h",
    level: "Principiante",
    videos: 12,
    projects: 3,
  },
  {
    id: 2,
    title: "Arquitecto Digital: ChatGPT",
    icon: "fa-robot",
    color: "#66CCCC",
    topics: [
      "Conocer ChatGPT y pedirle resultados útiles",
      "Usar sus herramientas: búsqueda, archivos, imágenes y voz",
      "Organizar tu trabajo con Proyectos, GPTs y agentes",
    ],
    challenge:
      "Elige una tarea real que repites cada semana y resuélvela con ChatGPT: escribe las instrucciones, usa al menos una herramienta integrada y verifica el resultado antes de usarlo.",
    desc: "ChatGPT es la IA más usada del mundo. Vas a conocerla a fondo: cómo pedirle resultados útiles, cómo usar sus herramientas integradas para buscar, analizar archivos y crear imágenes, y cómo organizar tu trabajo con Proyectos para no repetir el mismo contexto cada vez.",
    duration: "2h",
    level: "Principiante",
    videos: 15,
    projects: 4,
  },
  {
    id: 3,
    title: "Detective de Datos: Gemini",
    icon: "fa-search",
    color: "#B2D8E5",
    topics: [
      "Analizar imágenes, documentos y audio",
      "Respuestas con fuentes actualizadas",
      "Investigar a fondo con Deep Research",
      "Verificar datos antes de usarlos",
    ],
    challenge:
      "Usa Gemini Deep Research para investigar un tema de actualidad, verifica cada fuente citada y presenta un informe breve con conclusiones propias.",
    desc: "No basta con preguntar: necesitas respuestas verificadas y actualizadas. Vas a usar Gemini para investigar a fondo, analizar imágenes y texto, y verificar hechos con fuentes reales.",
    duration: "2h",
    level: "Intermedio",
    videos: 10,
    projects: 2,
  },
  {
    id: 4,
    title: "Alquimista Digital: Gemini Notebook",
    icon: "fa-flask",
    color: "#004B63",
    topics: [
      "Elegir buenas fuentes",
      "Resumir y estudiar con tus documentos",
      "Resúmenes en audio",
      "Organizar tus documentos",
    ],
    challenge:
      "Reúne entre 3 y 5 fuentes confiables sobre un tema que te importe, crea un cuaderno en Gemini Notebook y genera un resumen y un audio para compartir, verificando cada idea con su cita.",
    desc: "Hay información que leer te tomaría horas. Con Gemini Notebook vas a convertir documentos densos en resúmenes claros y hasta en podcasts que puedes escuchar donde sea.",
    duration: "2h",
    level: "Intermedio",
    videos: 8,
    projects: 3,
  },
  {
    id: 5,
    title: "Director de Orquesta: Claude",
    icon: "fa-diagram-project",
    color: "#D97757",
    topics: [
      "Conoce a Claude: la IA que trabaja contigo",
      "Crea con Claude: Artifacts, documentos y presentaciones",
      "Delega con Claude: Proyectos, conectores y Skills",
    ],
    challenge:
      "Clasifica qué delegar, escribe un pedido completo para Claude y diseña un protocolo de datos y revisión antes de compartir el resultado.",
    desc: "Claude ya no es solo un chat: crea documentos y presentaciones, se conecta a tus herramientas y ejecuta tareas de varios pasos. Aprende a dirigirlo con criterio.",
    duration: "2h",
    level: "Intermedio",
    videos: 3,
    projects: 2,
  },
];

/** @type {Module[]} */
export const modules_en = [
  {
    id: 1,
    title: "Digital Artisan: Prompts",
    icon: "fa-wand-magic-sparkles",
    color: "#4DA8C4",
    topics: [
      "Giving clear instructions to AI",
      "Improving any question for better answers",
      "Understanding why AI fails and how to fix it",
      "Getting useful results faster",
      "Applying AI in study, work, and daily life",
      "Asking exactly what you need, no beating around the bush",
    ],
    challenge:
      "It's practice time! Apply everything you've learned in this module by solving a real-world case. Consolidate your knowledge, overcome the challenge, and take your skills to the next level.",
    desc: "AI gives you generic answers that don't solve what you need. In this module you'll learn to write clear prompts and improve them until you get useful results. You'll practice the RTF formula (Role + Task + Format), adding the context needed, and apply AI in your studies, work, and daily life.",
    duration: "2h",
    level: "Beginner",
    videos: 12,
    projects: 3,
  },
  {
    id: 2,
    title: "Digital Architect: ChatGPT",
    icon: "fa-robot",
    color: "#66CCCC",
    topics: [
      "Get to know ChatGPT and ask for useful results",
      "Use its tools: search, files, images and voice",
      "Organize your work with Projects, GPTs and agents",
    ],
    challenge:
      "Pick a real task you repeat every week and solve it with ChatGPT: write the instructions, use at least one built-in tool and verify the result before you use it.",
    desc: "ChatGPT is the most widely used AI in the world. You'll get to know it in depth: how to ask for useful results, how to use its built-in tools to search, analyze files and create images, and how to organize your work with Projects so you don't repeat the same context every time.",
    duration: "2h",
    level: "Beginner",
    videos: 15,
    projects: 4,
  },
  {
    id: 3,
    title: "Data Detective: Gemini",
    icon: "fa-search",
    color: "#B2D8E5",
    topics: [
      "Analyze images, documents and audio",
      "Answers with up-to-date sources",
      "Research in depth with Deep Research",
      "Verify facts before using them",
    ],
    challenge:
      "Use Gemini Deep Research to investigate a current topic, verify every cited source, and present a short report with your own conclusions.",
    desc: "Asking isn't enough — you need verified, up-to-date answers. You'll use Gemini to research in depth, analyze images and text, and fact-check with real sources.",
    duration: "2h",
    level: "Intermediate",
    videos: 10,
    projects: 2,
  },
  {
    id: 4,
    title: "Digital Alchemist: Gemini Notebook",
    icon: "fa-flask",
    color: "#004B63",
    topics: [
      "Choose good sources",
      "Summarize and study with your documents",
      "Audio summaries",
      "Organize your documents",
    ],
    challenge:
      "Gather 3 to 5 reliable sources on a topic you care about, create a notebook in Gemini Notebook and generate a summary and an audio overview to share, checking every idea against its citation.",
    desc: "Some documents would take hours to read. With Gemini Notebook you'll turn dense files into clear summaries and even podcasts you can listen to anywhere.",
    duration: "2h",
    level: "Intermediate",
    videos: 8,
    projects: 3,
  },
  {
    id: 5,
    title: "The Conductor: Claude",
    icon: "fa-diagram-project",
    color: "#D97757",
    topics: [
      "Get to Know Claude: the AI That Works With You",
      "Create with Claude: Artifacts, Documents and Presentations",
      "Delegate with Claude: Projects, Connectors and Skills",
    ],
    challenge:
      "Sort what to delegate, write a full request for Claude and design a data and review protocol before sharing the result.",
    desc: "Claude is no longer just a chat: it creates documents and presentations, connects to your tools and runs multi-step tasks. Learn to conduct it with judgment.",
    duration: "2h",
    level: "Intermediate",
    videos: 3,
    projects: 2,
  },
];

/** @type {Module[]} */
export const modules_pt = [
  {
    id: 1,
    title: "Artesão Digital: Prompts",
    icon: "fa-wand-magic-sparkles",
    color: "#4DA8C4",
    topics: [
      "Dar instruções claras à IA",
      "Melhorar qualquer pergunta para obter melhores respostas",
      "Entender por que a IA falha e como corrigir",
      "Obter resultados úteis em menos tempo",
      "Aplicar a IA nos estudos, no trabalho e na vida diária",
      "Pedir exatamente o que você precisa, sem rodeios",
    ],
    challenge:
      "Chegou a hora da prática! Aplique tudo o que aprendeu neste módulo resolvendo um caso real. Atreva-se a consolidar o seu aprendizado, supere o desafio e leve os seus conhecimentos ao próximo nível.",
    desc: "A IA te dá respostas genéricas que não resolvem o que você precisa. Neste módulo, você aprenderá a escrever prompts claros e a melhorá-los até obter resultados úteis. Vai praticar a fórmula RTF (Papel + Tarefa + Formato), somando o contexto necessário, e aplicar a IA nos seus estudos, no trabalho e na vida diária.",
    duration: "2h",
    level: "Iniciante",
    videos: 12,
    projects: 3,
  },
  {
    id: 2,
    title: "Arquiteto Digital: ChatGPT",
    icon: "fa-robot",
    color: "#66CCCC",
    topics: [
      "Conhecer o ChatGPT e pedir resultados úteis",
      "Usar suas ferramentas: pesquisa, arquivos, imagens e voz",
      "Organizar seu trabalho com Projetos, GPTs e agentes",
    ],
    challenge:
      "Escolha uma tarefa real que você repete toda semana e resolva-a com o ChatGPT: escreva as instruções, use pelo menos uma ferramenta integrada e verifique o resultado antes de usá-lo.",
    desc: "O ChatGPT é a IA mais usada do mundo. Você vai conhecê-lo a fundo: como pedir resultados úteis, como usar suas ferramentas integradas para pesquisar, analisar arquivos e criar imagens, e como organizar seu trabalho com Projetos para não repetir o mesmo contexto toda vez.",
    duration: "2h",
    level: "Iniciante",
    videos: 15,
    projects: 4,
  },
  {
    id: 3,
    title: "Detetive de Dados: Gemini",
    icon: "fa-search",
    color: "#B2D8E5",
    topics: [
      "Analisar imagens, documentos e áudio",
      "Respostas com fontes atualizadas",
      "Pesquisar a fundo com o Deep Research",
      "Verificar dados antes de usá-los",
    ],
    challenge:
      "Use o Gemini Deep Research para investigar um tema atual, verifique cada fonte citada e apresente um relatório breve com conclusões próprias.",
    desc: "Não basta perguntar: você precisa de respostas verificadas e atualizadas. Vai usar o Gemini para pesquisar a fundo, analisar imagens e texto e verificar fatos com fontes reais.",
    duration: "2h",
    level: "Intermediário",
    videos: 10,
    projects: 2,
  },
  {
    id: 4,
    title: "Alquimista Digital: Gemini Notebook",
    icon: "fa-flask",
    color: "#004B63",
    topics: [
      "Escolher boas fontes",
      "Resumir e estudar com seus documentos",
      "Resumos em áudio",
      "Organizar seus documentos",
    ],
    challenge:
      "Reúna de 3 a 5 fontes confiáveis sobre um tema que importa para você, crie um caderno no Gemini Notebook e gere um resumo e um áudio para compartilhar, conferindo cada ideia com a citação.",
    desc: "Há informações que levariam horas para ler. Com o Gemini Notebook, você vai transformar documentos densos em resumos claros e até em podcasts que pode ouvir em qualquer lugar.",
    duration: "2h",
    level: "Intermediário",
    videos: 8,
    projects: 3,
  },
  {
    id: 5,
    title: "O Maestro: Claude",
    icon: "fa-diagram-project",
    color: "#D97757",
    topics: [
      "Conheça o Claude: a IA que trabalha com você",
      "Crie com o Claude: Artifacts, documentos e apresentações",
      "Delegue com o Claude: Projetos, conectores e Skills",
    ],
    challenge:
      "Classifique o que delegar, escreva um pedido completo para o Claude e desenhe um protocolo de dados e revisão antes de compartilhar o resultado.",
    desc: "O Claude já não é só um chat: cria documentos e apresentações, conecta-se às suas ferramentas e executa tarefas de várias etapas. Aprenda a dirigi-lo com critério.",
    duration: "2h",
    level: "Intermediário",
    videos: 3,
    projects: 2,
  },
];

/** @type {Record<number, Lesson[]>} */
/** @type {Record<number, Lesson[]>} */
/** @type {Record<number, Lesson[]>} */
/** @type {Record<number, ModuleQuestion[]>} */
/** @type {Record<string, BadgeInfo>} */
/** @type {Record<string, BadgeInfo>} */
/** @type {Record<string, BadgeInfo>} */
export function getModules(locale) {
  return locale === "en" ? modules_en : modules;
}

export function getAllLessons(locale) {
  return locale === "en" ? ALL_LESSONS_EN : ALL_LESSONS;
}

export function getBadgeInfo(locale) {
  if (locale === "en") return BADGE_INFO_EN;
  if (locale === "pt") return BADGE_INFO_PT;
  return BADGE_INFO;
}
