// Contenido adicional del "Taller de Artifacts": tipos de pieza, cambios, verificación de cifras.
export const ARTIFACTS_EXTRA = {
  es: {
    verifyTitle: "Verifica antes de compartir: ¿qué confirmas con una fuente?",
    verifyHint:
      "Marca las líneas que contienen datos que deben comprobarse. Luego revisa la explicación.",
    verifyItems: [
      {
        t: "Ingresos del tercer trimestre: 4,2 millones",
        check: true,
        why: "Es una cifra: compárala con el reporte financiero antes de publicarla.",
      },
      {
        t: "Clientes nuevos: 320",
        check: true,
        why: "Es un dato medible: confírmalo en tu sistema de registro.",
      },
      {
        t: "Satisfacción de los estudiantes: 92 %",
        check: true,
        why: "Un porcentaje sin fuente puede ser inventado o de otra encuesta: verifica origen y fecha.",
      },
      {
        t: "Guía de uso: 3 pasos",
        check: false,
        why: "Es contenido de la pieza que tú defines: no necesita una fuente externa, pero sí revisar que sea correcto.",
      },
    ],
    verifyCheck: "Comprobar selección",
    verifyOk:
      "Bien: marcaste todas las cifras que deben comprobarse y no marcaste lo que es contenido propio.",
    verifyBad:
      "Revisa: toda cifra de datos, encuesta o informe debe confirmarse con una fuente antes de compartir.",
    types: [
      {
        key: "doc",
        name: "Documento",
        use: "Informes, guías y propuestas que se leen y se editan.",
        example:
          "Redacta una guía de 2 páginas para docentes nuevos sobre cómo usar la plataforma.",
        gets: "Texto con títulos, secciones y listas, listo para editar y descargar.",
      },
      {
        key: "pres",
        name: "Presentación",
        use: "Exponer una idea con pocas diapositivas.",
        example:
          "Presentación de 6 diapositivas para directivos sobre los resultados del trimestre, con una cifra por diapositiva y su fuente.",
        gets: "Diapositivas con títulos y notas, que puedes ajustar una por una.",
      },
      {
        key: "table",
        name: "Tabla o gráfico",
        use: "Comparar opciones o mostrar datos.",
        example:
          "Tabla que compare tres planes por precio, incluido, límite de uso y condiciones.",
        gets: "Tabla ordenada que puedes ajustar columna por columna.",
      },
      {
        key: "app",
        name: "Mini aplicación",
        use: "Practicar, simular o calcular algo.",
        example:
          "Mini app que calcule la nota final con tres evaluaciones y su peso porcentual.",
        gets: "Una pequeña herramienta interactiva que puedes probar antes de usarla.",
      },
    ],
    changes: [
      {
        label: "Acortar",
        after:
          "Guía rápida: crea tu cuenta, elige un curso y revisa tu progreso.",
        lesson:
          "Un cambio, un efecto: la extensión cambió y los pasos se conservaron.",
      },
      {
        label: "Cambiar el tono",
        after:
          "¡Bienvenido! Crea tu cuenta, elige un curso y revisa tu progreso.",
        lesson:
          "El tono cambió sin tocar el contenido. Así sabes qué produjo el cambio.",
      },
      {
        label: "Agregar una advertencia",
        after:
          "¡Bienvenido! Crea tu cuenta, elige un curso y revisa tu progreso. No compartas tu contraseña.",
        lesson:
          "Una advertencia clara protege a quien lee. No es lo mismo que un límite del pedido, que limita lo que Claude escribe.",
      },
      {
        label: "Cambiar a tabla",
        after:
          "Paso | Qué hacer\n1 | Crear cuenta\n2 | Elegir curso\n3 | Revisar progreso",
        lesson:
          "Cambiar el formato es un cambio grande: en la tabla se perdieron el saludo y la advertencia. Revisa que no falte nada importante.",
      },
    ],
    compare: {
      weakLabel: "Pedido vago",
      title: "Practica: compara dos Artifacts",
      weak: "Haz una guía para docentes.",
      strongLabel: "Pedido completo",
      strong:
        "Guía breve para docentes nuevos con estos pasos: entrar con el correo institucional, crear el primer curso e invitar a los estudiantes con el enlace del curso. Tono cercano, sin precios ni datos de estudiantes. Si falta un dato, déjalo entre corchetes y avísame.",
      a: "Guía para docentes\n\nLa tecnología es muy importante en la educación actual. En esta guía encontrarás información útil para mejorar tus clases y aprovechar las herramientas digitales.",
      b: "Guía rápida para docentes nuevos de [nombre de la plataforma]\n\n1. Entra con tu correo institucional.\n2. Crea tu primer curso.\n3. Invita a tus estudiantes con el enlace del curso.\n\nNota: falta el nombre de la plataforma. Confírmalo antes de compartir.",
      whyA: "Es el resultado del pedido vago: habla en general y no le sirve a un docente nuevo.",
      whyB: "Usa solo los pasos que le diste, deja entre corchetes el nombre que falta y te avisa, como pediste. Antes de compartir, revisa los pasos en la plataforma real.",
      chooseA: "Compartiría A",
      chooseB: "Compartiría B",
      done: "Ya comparaste: el pedido completo da una pieza útil y verificable.",
    },
  },
  en: {
    verifyTitle:
      "Verify before sharing: which figures do you confirm with a source?",
    verifyHint:
      "Mark the lines that contain data that must be checked. Then read the explanation.",
    verifyItems: [
      {
        t: "Third-quarter revenue: 4.2 million",
        check: true,
        why: "It is a figure: compare it with the financial report before publishing.",
      },
      {
        t: "New customers: 320",
        check: true,
        why: "It is measurable data: confirm it in your records system.",
      },
      {
        t: "Student satisfaction: 92 %",
        check: true,
        why: "A percentage without a source may be invented or from another survey: check origin and date.",
      },
      {
        t: "Usage guide: 3 steps",
        check: false,
        why: "It is content you define: it does not need an external source, but check it is correct.",
      },
    ],
    verifyCheck: "Check selection",
    verifyOk:
      "Good: you marked every figure that must be checked and did not mark your own content.",
    verifyBad:
      "Look again: every figure from data, a survey or a report must be confirmed with a source before sharing.",
    types: [
      {
        key: "doc",
        name: "Document",
        use: "Reports, guides and proposals that are read and edited.",
        example:
          "Write a 2-page guide for new teachers on how to use the platform.",
        gets: "Text with titles, sections and lists, ready to edit and download.",
      },
      {
        key: "pres",
        name: "Presentation",
        use: "Present an idea in a few slides.",
        example:
          "A 6-slide presentation for directors on this quarter's results, one figure per slide with its source.",
        gets: "Slides with titles and notes that you can adjust one by one.",
      },
      {
        key: "table",
        name: "Table or chart",
        use: "Compare options or show data.",
        example:
          "A table comparing three plans by price, what is included, usage limit and conditions.",
        gets: "A tidy table you can adjust column by column.",
      },
      {
        key: "app",
        name: "Mini app",
        use: "Practice, simulate or calculate something.",
        example:
          "A mini app that calculates the final grade from three assessments and their weights.",
        gets: "A small interactive tool you can test before using it.",
      },
    ],
    changes: [
      {
        label: "Shorten",
        after:
          "Quick guide: create your account, choose a course and check your progress.",
        lesson:
          "One change, one effect: the length changed and the steps were kept.",
      },
      {
        label: "Change the tone",
        after:
          "Welcome! Create your account, choose a course and check your progress.",
        lesson:
          "The tone changed without touching the content. Now you know what caused the change.",
      },
      {
        label: "Add a warning",
        after:
          "Welcome! Create your account, choose a course and check your progress. Do not share your password.",
        lesson:
          "A clear warning protects the reader. It is not the same as a limit in the request, which limits what Claude writes.",
      },
      {
        label: "Switch to a table",
        after:
          "Step | What to do\n1 | Create account\n2 | Choose course\n3 | Check progress",
        lesson:
          "Changing the format is a big change: the table lost the greeting and the warning. Check that nothing important is missing.",
      },
    ],
    compare: {
      weakLabel: "Vague request",
      title: "Practice: compare two Artifacts",
      weak: "Make a guide for teachers.",
      strongLabel: "Complete request",
      strong:
        "A short guide for new teachers with these steps: sign in with the school email, create the first course and invite students with the course link. Warm tone, no prices or student data. If a detail is missing, leave it in brackets and tell me.",
      a: "Guide for teachers\n\nTechnology is very important in today's education. In this guide you will find useful information to improve your classes and make the most of digital tools.",
      b: "Quick guide for new teachers of [platform name]\n\n1. Sign in with your school email.\n2. Create your first course.\n3. Invite your students with the course link.\n\nNote: the platform name is missing. Confirm it before sharing.",
      whyA: "It is the result of the vague request: it speaks in general terms and does not help a new teacher.",
      whyB: "It uses only the steps you gave it, leaves the missing name in brackets and tells you, as you asked. Before sharing, check the steps on the real platform.",
      chooseA: "I would share A",
      chooseB: "I would share B",
      done: "You compared: the complete request gives a useful, verifiable piece.",
    },
  },
  pt: {
    verifyTitle:
      "Confira antes de compartilhar: quais números você confirma com uma fonte?",
    verifyHint:
      "Marque as linhas com dados que precisam ser conferidos. Depois leia a explicação.",
    verifyItems: [
      {
        t: "Receita do terceiro trimestre: 4,2 milhões",
        check: true,
        why: "É um número: compare com o relatório financeiro antes de publicar.",
      },
      {
        t: "Clientes novos: 320",
        check: true,
        why: "É um dado mensurável: confirme no seu sistema de registro.",
      },
      {
        t: "Satisfação dos alunos: 92 %",
        check: true,
        why: "Uma porcentagem sem fonte pode ter sido inventada ou ser de outra pesquisa: confira a origem e a data.",
      },
      {
        t: "Guia de uso: 3 passos",
        check: false,
        why: "É conteúdo que você define: não precisa de fonte externa, mas confira se está correto.",
      },
    ],
    verifyCheck: "Conferir seleção",
    verifyOk:
      "Bem: você marcou todos os números que precisam de conferência e não marcou o conteúdo próprio.",
    verifyBad:
      "Revise: todo número de dados, pesquisa ou relatório deve ser confirmado com uma fonte antes de compartilhar.",
    types: [
      {
        key: "doc",
        name: "Documento",
        use: "Relatórios, guias e propostas que se leem e se editam.",
        example:
          "Escreva um guia de 2 páginas para professores novos sobre como usar a plataforma.",
        gets: "Texto com títulos, seções e listas, pronto para editar e baixar.",
      },
      {
        key: "pres",
        name: "Apresentação",
        use: "Expor uma ideia com poucos slides.",
        example:
          "Apresentação de 6 slides para diretores sobre os resultados do trimestre, com um número e sua fonte por slide.",
        gets: "Slides com títulos e notas, que você pode ajustar um a um.",
      },
      {
        key: "table",
        name: "Tabela ou gráfico",
        use: "Comparar opções ou mostrar dados.",
        example:
          "Tabela que compare três planos por preço, o que inclui, limite de uso e condições.",
        gets: "Tabela organizada que você ajusta coluna por coluna.",
      },
      {
        key: "app",
        name: "Mini aplicativo",
        use: "Praticar, simular ou calcular algo.",
        example:
          "Mini app que calcule a nota final com três avaliações e seus pesos percentuais.",
        gets: "Uma pequena ferramenta interativa que você pode testar antes de usar.",
      },
    ],
    changes: [
      {
        label: "Encurtar",
        after:
          "Guia rápido: crie a sua conta, escolha um curso e acompanhe o seu progresso.",
        lesson:
          "Uma mudança, um efeito: o tamanho mudou e os passos foram mantidos.",
      },
      {
        label: "Mudar o tom",
        after:
          "Bem-vindo! Crie a sua conta, escolha um curso e acompanhe o seu progresso.",
        lesson:
          "O tom mudou sem tocar no conteúdo. Assim você sabe o que causou a mudança.",
      },
      {
        label: "Acrescentar um aviso",
        after:
          "Bem-vindo! Crie a sua conta, escolha um curso e acompanhe o seu progresso. Não compartilhe a sua senha.",
        lesson:
          "Um aviso claro protege quem lê. Não é o mesmo que um limite do pedido, que limita o que o Claude escreve.",
      },
      {
        label: "Mudar para tabela",
        after:
          "Passo | O que fazer\n1 | Criar conta\n2 | Escolher curso\n3 | Acompanhar progresso",
        lesson:
          "Mudar o formato é uma mudança grande: a tabela perdeu a saudação e o aviso. Confira se não falta nada importante.",
      },
    ],
    compare: {
      weakLabel: "Pedido vago",
      title: "Pratique: compare dois Artifacts",
      weak: "Faça um guia para professores.",
      strongLabel: "Pedido completo",
      strong:
        "Guia curto para professores novos com estes passos: entrar com o e-mail institucional, criar o primeiro curso e convidar os alunos com o link do curso. Tom cordial, sem preços nem dados de alunos. Se faltar um dado, deixe entre colchetes e me avise.",
      a: "Guia para professores\n\nA tecnologia é muito importante na educação atual. Neste guia você encontrará informações úteis para melhorar as suas aulas e aproveitar as ferramentas digitais.",
      b: "Guia rápido para professores novos de [nome da plataforma]\n\n1. Entre com o seu e-mail institucional.\n2. Crie o seu primeiro curso.\n3. Convide os seus alunos com o link do curso.\n\nNota: falta o nome da plataforma. Confirme-o antes de compartilhar.",
      whyA: "É o resultado do pedido vago: fala de forma geral e não ajuda um professor novo.",
      whyB: "Usa só os passos que você deu, deixa o nome que falta entre colchetes e avisa, como você pediu. Antes de compartilhar, confira os passos na plataforma real.",
      chooseA: "Compartilharia A",
      chooseB: "Compartilharia B",
      done: "Você comparou: o pedido completo gera uma peça útil e verificável.",
    },
  },
};
