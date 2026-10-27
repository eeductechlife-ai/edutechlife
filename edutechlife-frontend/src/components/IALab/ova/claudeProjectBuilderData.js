// Etapa "Tu Proyecto y tu Skill" del Tablero de Delegación (Módulo 5, tema 3).
// Archivos: ok = conviene subirlo; los que no, explican por qué.
export const PROJECT_BUILDER = {
  es: {
    title: "Arma tu Proyecto y tu Skill",
    intro:
      "Un Proyecto guarda las reglas y los archivos de un trabajo que se repite. Una Skill guarda un procedimiento que haces siempre igual. Arma los dos para una escuela de idiomas.",
    planNote:
      "Proyectos, Skills y conectores dependen de tu plan y de la configuración de tu cuenta.",
    projectTitle: "1. Instrucciones del Proyecto",
    projectFields: [
      {
        key: "name",
        label: "Nombre del Proyecto",
        placeholder: "Voz de marca de la escuela",
      },
      {
        key: "purpose",
        label: "Para qué sirve",
        placeholder: "Escribir correos y publicaciones con el mismo tono",
      },
      {
        key: "role",
        label: "Instrucción 1: quién eres",
        placeholder: "Eres el asistente de comunicaciones de la escuela",
      },
      {
        key: "tone",
        label: "Instrucción 2: cómo suena",
        placeholder: "Cercano, claro y sin tecnicismos",
      },
      {
        key: "avoid",
        label: "Instrucción 3: qué nunca hacer",
        placeholder: "No prometas fechas ni precios sin confirmar",
      },
    ],
    filesTitle: "2. ¿Qué archivos subes al Proyecto?",
    files: [
      {
        t: "Guía de estilo de la marca",
        ok: true,
        why: "Le da a Claude el tono y las palabras de la escuela.",
      },
      {
        t: "Ejemplos de correos que funcionaron",
        ok: true,
        why: "Un buen ejemplo guía mejor que una descripción.",
      },
      {
        t: "Calendario académico aprobado",
        ok: true,
        why: "Fechas oficiales para no inventar ninguna.",
      },
      {
        t: "Base de datos de estudiantes con teléfonos",
        ok: false,
        why: "Son datos personales: no los subas sin autorización (Ley 1581 de 2012).",
      },
    ],
    skillTitle: "3. Tu Skill: un procedimiento que repites",
    skillFields: [
      {
        key: "sname",
        label: "Nombre de la Skill",
        placeholder: "Revisión de correos antes de enviar",
      },
      {
        key: "when",
        label: "Cuándo usarla",
        placeholder: "Antes de enviar cualquier correo a estudiantes",
      },
      {
        key: "s1",
        label: "Paso 1",
        placeholder: "Confirma que las fechas estén en el calendario aprobado",
      },
      {
        key: "s2",
        label: "Paso 2",
        placeholder: "Quita datos personales que no hagan falta",
      },
      {
        key: "s3",
        label: "Paso 3",
        placeholder: "Ajusta el tono a cercano y claro",
      },
    ],
    connectorTitle: "4. Conectores: da solo el acceso necesario",
    connectorQ:
      "Quieres que Claude lea el calendario académico y redacte recordatorios. ¿Qué haces?",
    connectorOptions: [
      "Conecto solo el calendario y reviso los permisos que pide.",
      "Conecto todas mis herramientas para no tener que volver a hacerlo.",
      "No conecto nada y pego en el chat la lista de estudiantes con sus teléfonos.",
    ],
    connectorCorrect: 0,
    connectorWhy:
      "Activa solo lo que la tarea necesita y revisa qué permisos pide cada conector. Puedes desconectarlo cuando termines.",
    outputTitle: "Tu Proyecto y tu Skill, listos para copiar",
    projectHeading: "PROYECTO",
    filesHeading: "Archivos",
    skillHeading: "SKILL",
    ready: "Listo: tu Proyecto, tu Skill y tu conector están bien armados.",
    notReady:
      "Completa todos los campos (mínimo 2 palabras), elige solo archivos seguros y el conector adecuado.",
    copy: "Copiar",
    copied: "Copiado",
  },
  en: {
    title: "Build your Project and your Skill",
    intro:
      "A Project stores the rules and files for work that repeats. A Skill stores a procedure you always do the same way. Build both for a language school.",
    planNote:
      "Projects, Skills and connectors depend on your plan and your account settings.",
    projectTitle: "1. Project instructions",
    projectFields: [
      {
        key: "name",
        label: "Project name",
        placeholder: "School brand voice",
      },
      {
        key: "purpose",
        label: "What it is for",
        placeholder: "Writing emails and posts with the same tone",
      },
      {
        key: "role",
        label: "Instruction 1: who you are",
        placeholder: "You are the school's communications assistant",
      },
      {
        key: "tone",
        label: "Instruction 2: how it sounds",
        placeholder: "Warm, clear and jargon-free",
      },
      {
        key: "avoid",
        label: "Instruction 3: what never to do",
        placeholder: "Do not promise dates or prices that are not confirmed",
      },
    ],
    filesTitle: "2. Which files do you upload to the Project?",
    files: [
      {
        t: "Brand style guide",
        ok: true,
        why: "It gives Claude the school's tone and wording.",
      },
      {
        t: "Examples of emails that worked",
        ok: true,
        why: "A good example guides better than a description.",
      },
      {
        t: "Approved academic calendar",
        ok: true,
        why: "Official dates, so none get invented.",
      },
      {
        t: "Student database with phone numbers",
        ok: false,
        why: "That is personal data: do not upload it without authorization.",
      },
    ],
    skillTitle: "3. Your Skill: a procedure you repeat",
    skillFields: [
      {
        key: "sname",
        label: "Skill name",
        placeholder: "Email review before sending",
      },
      {
        key: "when",
        label: "When to use it",
        placeholder: "Before sending any email to students",
      },
      {
        key: "s1",
        label: "Step 1",
        placeholder: "Check that dates are in the approved calendar",
      },
      {
        key: "s2",
        label: "Step 2",
        placeholder: "Remove personal data that is not needed",
      },
      {
        key: "s3",
        label: "Step 3",
        placeholder: "Adjust the tone to warm and clear",
      },
    ],
    connectorTitle: "4. Connectors: give only the access needed",
    connectorQ:
      "You want Claude to read the academic calendar and draft reminders. What do you do?",
    connectorOptions: [
      "I connect only the calendar and review the permissions it asks for.",
      "I connect all my tools so I never have to do it again.",
      "I connect nothing and paste the student list with phone numbers into the chat.",
    ],
    connectorCorrect: 0,
    connectorWhy:
      "Turn on only what the task needs and review the permissions each connector asks for. You can disconnect it when you are done.",
    outputTitle: "Your Project and your Skill, ready to copy",
    projectHeading: "PROJECT",
    filesHeading: "Files",
    skillHeading: "SKILL",
    ready: "Ready: your Project, Skill and connector are well built.",
    notReady:
      "Complete every field (at least 2 words), choose only safe files and the right connector.",
    copy: "Copy",
    copied: "Copied",
  },
  pt: {
    title: "Monte o seu Projeto e a sua Skill",
    intro:
      "Um Projeto guarda as regras e os arquivos de um trabalho que se repete. Uma Skill guarda um procedimento que você faz sempre igual. Monte os dois para uma escola de idiomas.",
    planNote:
      "Projetos, Skills e conectores dependem do seu plano e da configuração da sua conta.",
    projectTitle: "1. Instruções do Projeto",
    projectFields: [
      {
        key: "name",
        label: "Nome do Projeto",
        placeholder: "Voz da marca da escola",
      },
      {
        key: "purpose",
        label: "Para que serve",
        placeholder: "Escrever e-mails e publicações com o mesmo tom",
      },
      {
        key: "role",
        label: "Instrução 1: quem você é",
        placeholder: "Você é o assistente de comunicação da escola",
      },
      {
        key: "tone",
        label: "Instrução 2: como soa",
        placeholder: "Cordial, claro e sem jargão",
      },
      {
        key: "avoid",
        label: "Instrução 3: o que nunca fazer",
        placeholder: "Não prometa datas nem preços sem confirmar",
      },
    ],
    filesTitle: "2. Quais arquivos você sobe para o Projeto?",
    files: [
      {
        t: "Guia de estilo da marca",
        ok: true,
        why: "Dá ao Claude o tom e as palavras da escola.",
      },
      {
        t: "Exemplos de e-mails que funcionaram",
        ok: true,
        why: "Um bom exemplo orienta melhor que uma descrição.",
      },
      {
        t: "Calendário acadêmico aprovado",
        ok: true,
        why: "Datas oficiais, para não inventar nenhuma.",
      },
      {
        t: "Base de dados de alunos com telefones",
        ok: false,
        why: "São dados pessoais: não suba sem autorização (LGPD no Brasil, Lei 1581 na Colômbia).",
      },
    ],
    skillTitle: "3. Sua Skill: um procedimento que você repete",
    skillFields: [
      {
        key: "sname",
        label: "Nome da Skill",
        placeholder: "Revisão de e-mails antes de enviar",
      },
      {
        key: "when",
        label: "Quando usar",
        placeholder: "Antes de enviar qualquer e-mail aos alunos",
      },
      {
        key: "s1",
        label: "Passo 1",
        placeholder: "Confira se as datas estão no calendário aprovado",
      },
      {
        key: "s2",
        label: "Passo 2",
        placeholder: "Retire dados pessoais que não sejam necessários",
      },
      {
        key: "s3",
        label: "Passo 3",
        placeholder: "Ajuste o tom para cordial e claro",
      },
    ],
    connectorTitle: "4. Conectores: dê só o acesso necessário",
    connectorQ:
      "Você quer que o Claude leia o calendário acadêmico e redija lembretes. O que você faz?",
    connectorOptions: [
      "Conecto só o calendário e reviso as permissões que ele pede.",
      "Conecto todas as minhas ferramentas para não ter que fazer isso de novo.",
      "Não conecto nada e colo no chat a lista de alunos com os telefones.",
    ],
    connectorCorrect: 0,
    connectorWhy:
      "Ative só o que a tarefa precisa e revise as permissões que cada conector pede. Você pode desconectar quando terminar.",
    outputTitle: "Seu Projeto e sua Skill, prontos para copiar",
    projectHeading: "PROJETO",
    filesHeading: "Arquivos",
    skillHeading: "SKILL",
    ready:
      "Pronto: o seu Projeto, a sua Skill e o seu conector estão bem montados.",
    notReady:
      "Complete todos os campos (no mínimo 2 palavras), escolha só arquivos seguros e o conector adequado.",
    copy: "Copiar",
    copied: "Copiado",
  },
};
