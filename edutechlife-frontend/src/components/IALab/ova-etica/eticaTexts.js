import { useTranslation } from "../../../i18n/I18nProvider";

// Textos del OVA «La Materia Prima» (qué es la IA generativa), en es / en / pt.
// Sustituye al espacio «etica» de hooks/useOVATranslations.js, que ya no se usa.
const TEXTS = {
  es: {
    welcome_label: "Laboratorio Guiado por MAX",
    welcome_title_1: "qué es la",
    welcome_title_2: "IA GENERATIVA",
    welcome_desc:
      "Hola, soy MAX, tu coach de IA. En este laboratorio verás qué es la IA generativa, qué hace bien y por qué a veces se equivoca, para que puedas explicarlo con tus palabras.",
    welcome_voice:
      "Hola, soy MAX, tu coach de IA de Edutechlife. En este laboratorio veremos juntos qué es la IA generativa, cómo construye sus respuestas, qué hace bien y por qué a veces se equivoca. Al final podrás explicarlo con tus propias palabras.",
    welcome_cta: "Comenzar Laboratorio",
    history_title_1: "1950–1980 · Las primeras ideas",
    history_desc_1:
      "En 1950, Alan Turing se preguntó si una máquina podría «pensar». En 1956 se usó por primera vez el nombre «inteligencia artificial». Los primeros programas seguían reglas escritas a mano, y por eso el avance fue lento.",
    history_title_2: "2010–2020 · Más datos, más potencia",
    history_desc_2:
      "Con muchísimos datos en internet y computadores más potentes, la IA aprendió a reconocer imágenes, voces y textos. Así empezaron a funcionar el filtro de spam, los traductores y las recomendaciones de música y video.",
    history_title_3: "2017 · Leer cada palabra en su contexto",
    history_desc_3:
      "Se inventó una forma nueva de entrenar a la IA para que entienda cada palabra según las que la rodean. Esa idea hizo posible las IA que conversan y escriben textos.",
    history_title_4: "2022 en adelante · IA generativa",
    history_desc_4:
      "Con la llegada de ChatGPT, en noviembre de 2022, la IA que escribe, resume y crea imágenes llegó a millones de personas. Hoy hay muchas herramientas, y cada una cambia con frecuencia.",
    prompt_title: "cómo responde la IA",
    prompt_desc:
      "La IA generativa no busca una respuesta guardada: la construye pieza por pieza, adivinando qué palabra tiene más sentido después de la anterior. Aprendió esos patrones leyendo enormes cantidades de textos.",
    prompt_voice:
      "La IA generativa no busca una respuesta guardada: la construye pieza por pieza, adivinando qué palabra tiene más sentido después de la anterior. Aprendió esos patrones leyendo enormes cantidades de textos. Por eso puede sonar muy segura aunque se equivoque.",
    prompt_tip:
      "«Al terminar podrás explicar con tus palabras por qué la IA suena segura aunque a veces se equivoque.»",
    anatomy_rol: "Resumir",
    anatomy_rol_desc: "Convierte un texto largo en pocas ideas claras.",
    anatomy_contexto: "Redactar",
    anatomy_contexto_desc:
      "Escribe un primer borrador de un correo, un mensaje o un informe.",
    anatomia_tarea: "Traducir",
    anatomia_tarea_desc: "Pasa un texto de un idioma a otro o cambia su tono.",
    anatomia_formato: "Ordenar",
    anatomia_formato_desc:
      "Convierte notas sueltas en listas, tablas o esquemas.",
    anatomia_restriccion: "Explicar",
    anatomia_restriccion_desc:
      "Aclara un tema difícil con ejemplos y comparaciones sencillas.",
    anatomia_ejemplos: "Dar ideas",
    anatomia_ejemplos_desc:
      "Propone alternativas y preguntas para pensar un problema.",
    anatomy_placeholder: "Toca cada tarjeta",
    anatomy_element_label: "Lo hace bien:",
    technique_1_title: "Puede inventar",
    technique_1_desc:
      "Puede dar cifras, citas o fuentes falsas con total seguridad. A eso se le llama alucinación.",
    technique_2_title: "No conoce tu situación",
    technique_2_desc:
      "Lo que no le cuentas, lo adivina. Con más contexto, comete menos errores.",
    technique_3_title: "Hereda sesgos",
    technique_3_desc:
      "Aprendió de textos escritos por personas y puede repetir estereotipos.",
    technique_4_title: "Cambia con el tiempo",
    technique_4_desc:
      "Las herramientas y sus funciones se actualizan: lo que hoy ves puede ser distinto mañana.",
    technique_5_title: "Puede no saber lo de hoy",
    technique_5_desc:
      "Si no busca en la web, puede desconocer lo más reciente.",
    technique_6_title: "No decide por ti",
    technique_6_desc:
      "Puede ayudarte a pensar, pero la decisión y la responsabilidad son tuyas.",
    error_1_title: "Creerle sin verificar",
    error_1_desc:
      "Una respuesta que suena segura no es una respuesta comprobada.",
    error_2_title: "Pedir sin contexto",
    error_2_desc:
      "«Ayúdame con mi tarea» no dice la materia, el objetivo ni el formato.",
    error_3_title: "Compartir datos personales",
    error_3_desc:
      "Cédulas, claves o datos de otras personas no se pegan en una IA.",
    error_4_title: "Copiar sin revisar",
    error_4_desc: "Lee, ajusta y haz tuyo el texto antes de usarlo.",
    error_5_title: "Dejarle decidir por ti",
    error_5_desc: "En asuntos importantes sobre personas, decide una persona.",
    error_6_title: "No decir que la usaste",
    error_6_desc:
      "Si el resultado sale con tu nombre, cuenta cómo usaste la IA.",
    quiz_1_q: "¿Cómo construye una respuesta la IA generativa?",
    quiz_1_o1: "Busca la respuesta ya escrita en una base de datos",
    quiz_1_o2:
      "Predice qué palabras tienen más sentido según lo que aprendió y lo que le pides",
    quiz_1_o3: "Llama a una persona que la escribe",
    quiz_1_o4: "Copia la primera página de internet",
    quiz_1_f:
      "No guarda respuestas hechas: las construye pieza por pieza a partir de patrones. Por eso puede sonar bien y estar equivocada.",
    quiz_2_q:
      "La IA te da una cifra con una cita que no logras encontrar. ¿Qué haces?",
    quiz_2_o1: "La uso: la IA sonaba segura",
    quiz_2_o2: "Le pido que me la repita con más seguridad",
    quiz_2_o3: "Busco la fuente original; si no existe, no la uso",
    quiz_2_o4: "La cambio por otra cifra parecida",
    quiz_2_f:
      "La IA puede inventar cifras y citas con total seguridad (alucinaciones). Lo importante se comprueba en la fuente original.",
    quiz_3_q: "¿Para qué sirve mejor la IA generativa?",
    quiz_3_o1:
      "Para empezar un borrador, ordenar ideas y resumir textos que luego tú revisas",
    quiz_3_o2: "Para decidir sola a quién contratar",
    quiz_3_o3: "Para reemplazar la verificación de los datos",
    quiz_3_o4: "Para guardar tus contraseñas",
    quiz_3_f:
      "Es un buen apoyo para empezar, ordenar y revisar. La decisión final y la verificación siguen siendo tuyas.",
    quiz_4_q: "¿Qué puedes hacer para obtener una respuesta más útil?",
    quiz_4_o1: "Pedir lo mismo con menos palabras",
    quiz_4_o2: "Escribir todo en mayúsculas",
    quiz_4_o3: "Hacer varias preguntas a la vez sin decir para qué",
    quiz_4_o4:
      "Contarle el contexto: para quién es, qué necesitas y en qué formato",
    quiz_4_f:
      "Lo que no le dices, lo adivina. Un contexto claro significa menos errores.",
    quiz_5_q: "¿Qué significa que la IA pueda tener sesgos?",
    quiz_5_o1: "Que siempre se equivoca",
    quiz_5_o2:
      "Que puede repetir estereotipos de los textos con los que aprendió, así que conviene revisar a quién deja por fuera",
    quiz_5_o3: "Que solo habla un idioma",
    quiz_5_o4: "Que se cansa si le pides mucho",
    quiz_5_f:
      "Aprende de textos escritos por personas y puede repetir sus prejuicios. Pide la misma tarea con perfiles distintos y compara las respuestas.",
    quiz_result_title: "¡completado!",
    quiz_result_perfect: "¡Puntuación perfecta! MAX está orgulloso de ti.",
    quiz_result_good: "¡Buen trabajo! Repasa los conceptos dudosos.",
    quiz_result_keep_trying:
      "No te preocupes, repasa el laboratorio. MAX confía en ti.",
    quiz_result_cta: "Marcar como visto",
    quiz_label_question: "Pregunta",
    quiz_label_of: "de",
    quiz_label_score: "Aciertos:",
    quiz_label_see_results: "Ver Resultados",
    quiz_label_continue: "Continuar",
    certificate_desc:
      "Has completado el laboratorio guiado por MAX. Ahora puedes explicar qué es la IA generativa, qué hace bien y por qué a veces se equivoca.",
    certificate_mark_done: "Marcar como visto",
    screen_m1: "Breve historia de la IA",
    screen_m2: "Cómo responde la IA",
    screen_m3: "Lo que hace bien",
    screen_m4: "Sus límites",
    screen_m5: "Errores frecuentes al usarla",
    screen_m6: "Reto de comprensión",
    progress_label: "PROGRESO",
    edutechlife_master: "edutechlife master",
    btn_next: "Siguiente",
    btn_listen: "Escuchar con MAX",
    btn_stop: "Detener",
    sidebar_title: "Mapa del Módulo",
    sidebar_welcome: "Inicio",
    sidebar_menu: "Menú",
    sidebar_certificate: "Certificado",
    footer: "Laboratorio guiado por",
    footer_coach: "MAX",
    footer_tagline: "Coach de IA de Edutechlife.",
  },
  en: {
    welcome_label: "Guided Lab by MAX",
    welcome_title_1: "what is",
    welcome_title_2: "GENERATIVE AI",
    welcome_desc:
      "Hello, I'm MAX, your AI coach. In this lab you will see what generative AI is, what it does well and why it is sometimes wrong, so you can explain it in your own words.",
    welcome_voice:
      "Hello, I'm MAX, your AI coach at Edutechlife. In this lab we will look together at what generative AI is, how it builds its answers, what it does well and why it is sometimes wrong. At the end you will be able to explain it in your own words.",
    welcome_cta: "Start Lab",
    history_title_1: "1950–1980 · The first ideas",
    history_desc_1:
      "In 1950, Alan Turing asked whether a machine could “think”. In 1956 the name “artificial intelligence” was used for the first time. Early programs followed rules written by hand, so progress was slow.",
    history_title_2: "2010–2020 · More data, more power",
    history_desc_2:
      "With huge amounts of data on the internet and more powerful computers, AI learned to recognize images, voices and text. That is how spam filters, translators and music and video recommendations started to work.",
    history_title_3: "2017 · Reading each word in context",
    history_desc_3:
      "A new way of training AI was invented so it understands each word based on the words around it. That idea made conversational and text-writing AI possible.",
    history_title_4: "2022 onwards · Generative AI",
    history_desc_4:
      "With the arrival of ChatGPT in November 2022, AI that writes, summarizes and creates images reached millions of people. Today there are many tools, and each one changes often.",
    prompt_title: "how AI answers",
    prompt_desc:
      "Generative AI does not look up a stored answer: it builds one piece by piece, guessing which word makes the most sense after the previous one. It learned those patterns by reading enormous amounts of text.",
    prompt_voice:
      "Generative AI does not look up a stored answer: it builds one piece by piece, guessing which word makes the most sense after the previous one. It learned those patterns by reading enormous amounts of text. That is why it can sound very sure even when it is wrong.",
    prompt_tip:
      "“By the end you will be able to explain in your own words why AI sounds sure even when it is sometimes wrong.”",
    anatomy_rol: "Summarize",
    anatomy_rol_desc: "Turns a long text into a few clear ideas.",
    anatomy_contexto: "Draft",
    anatomy_contexto_desc:
      "Writes a first draft of an email, a message or a report.",
    anatomia_tarea: "Translate",
    anatomia_tarea_desc:
      "Moves a text from one language to another or changes its tone.",
    anatomia_formato: "Organize",
    anatomia_formato_desc: "Turns loose notes into lists, tables or outlines.",
    anatomia_restriccion: "Explain",
    anatomia_restriccion_desc:
      "Clarifies a hard topic with simple examples and comparisons.",
    anatomia_ejemplos: "Give ideas",
    anatomia_ejemplos_desc:
      "Suggests alternatives and questions to think a problem through.",
    anatomy_placeholder: "Tap each card",
    anatomy_element_label: "It does this well:",
    technique_1_title: "It can make things up",
    technique_1_desc:
      "It can give false figures, quotes or sources with total confidence. This is called a hallucination.",
    technique_2_title: "It does not know your situation",
    technique_2_desc:
      "What you do not tell it, it guesses. With more context it makes fewer mistakes.",
    technique_3_title: "It inherits bias",
    technique_3_desc:
      "It learned from texts written by people and can repeat stereotypes.",
    technique_4_title: "It changes over time",
    technique_4_desc:
      "Tools and their features are updated: what you see today may be different tomorrow.",
    technique_5_title: "It may not know today's news",
    technique_5_desc:
      "If it does not search the web, it may not know the latest events.",
    technique_6_title: "It does not decide for you",
    technique_6_desc:
      "It can help you think, but the decision and the responsibility are yours.",
    error_1_title: "Believing it without checking",
    error_1_desc:
      "An answer that sounds sure is not an answer that has been checked.",
    error_2_title: "Asking without context",
    error_2_desc:
      "“Help me with my homework” does not say the subject, the goal or the format.",
    error_3_title: "Sharing personal data",
    error_3_desc:
      "ID numbers, passwords or other people's data are not pasted into an AI.",
    error_4_title: "Copying without reviewing",
    error_4_desc: "Read it, adjust it and make it yours before using it.",
    error_5_title: "Letting it decide for you",
    error_5_desc: "In important matters about people, a person decides.",
    error_6_title: "Not saying you used it",
    error_6_desc:
      "If the result goes out under your name, say how you used AI.",
    quiz_1_q: "How does generative AI build an answer?",
    quiz_1_o1: "It looks up a ready-made answer in a database",
    quiz_1_o2:
      "It predicts which words make the most sense based on what it learned and what you ask",
    quiz_1_o3: "It calls a person who writes it",
    quiz_1_o4: "It copies the first page of the internet",
    quiz_1_f:
      "It does not store ready-made answers: it builds them piece by piece from patterns. That is why it can sound good and still be wrong.",
    quiz_2_q:
      "The AI gives you a figure with a source you cannot find. What do you do?",
    quiz_2_o1: "I use it: the AI sounded sure",
    quiz_2_o2: "I ask it to repeat it with more confidence",
    quiz_2_o3:
      "I look for the original source; if it does not exist, I do not use it",
    quiz_2_o4: "I swap it for a similar figure",
    quiz_2_f:
      "AI can invent figures and sources with total confidence (hallucinations). Anything important is checked against the original source.",
    quiz_3_q: "What is generative AI best used for?",
    quiz_3_o1:
      "Starting a draft, organizing ideas and summarizing texts that you then review",
    quiz_3_o2: "Deciding by itself whom to hire",
    quiz_3_o3: "Replacing the checking of facts",
    quiz_3_o4: "Storing your passwords",
    quiz_3_f:
      "It is a good support for starting, organizing and reviewing. The final decision and the checking remain yours.",
    quiz_4_q: "What can you do to get a more useful answer?",
    quiz_4_o1: "Ask the same thing in fewer words",
    quiz_4_o2: "Write everything in capital letters",
    quiz_4_o3: "Ask several questions at once without saying why",
    quiz_4_o4:
      "Tell it the context: who it is for, what you need and in what format",
    quiz_4_f:
      "What you do not say, it guesses. Clear context means fewer mistakes.",
    quiz_5_q: "What does it mean that AI can have bias?",
    quiz_5_o1: "That it is always wrong",
    quiz_5_o2:
      "That it can repeat stereotypes from the texts it learned from, so it is worth checking whom it leaves out",
    quiz_5_o3: "That it only speaks one language",
    quiz_5_o4: "That it gets tired if you ask too much",
    quiz_5_f:
      "It learns from texts written by people and can repeat their prejudices. Ask for the same task with different profiles and compare the answers.",
    quiz_result_title: "completed!",
    quiz_result_perfect: "Perfect score! MAX is proud of you.",
    quiz_result_good: "Good job! Review the concepts you missed.",
    quiz_result_keep_trying:
      "Don't worry, review the lab. MAX believes in you.",
    quiz_result_cta: "Mark as completed",
    quiz_label_question: "Question",
    quiz_label_of: "of",
    quiz_label_score: "Score:",
    quiz_label_see_results: "See Results",
    quiz_label_continue: "Continue",
    certificate_desc:
      "You have completed the lab guided by MAX. Now you can explain what generative AI is, what it does well and why it is sometimes wrong.",
    certificate_mark_done: "Mark as completed",
    screen_m1: "A brief history of AI",
    screen_m2: "How AI answers",
    screen_m3: "What it does well",
    screen_m4: "Its limits",
    screen_m5: "Common mistakes when using it",
    screen_m6: "Understanding challenge",
    progress_label: "PROGRESS",
    edutechlife_master: "edutechlife master",
    btn_next: "Next",
    btn_listen: "Listen with MAX",
    btn_stop: "Stop",
    sidebar_title: "Module Map",
    sidebar_welcome: "Home",
    sidebar_menu: "Menu",
    sidebar_certificate: "Certificate",
    footer: "Guided lab by",
    footer_coach: "MAX",
    footer_tagline: "AI Coach at Edutechlife.",
  },
  pt: {
    welcome_label: "Laboratório Guiado pelo MAX",
    welcome_title_1: "o que é a",
    welcome_title_2: "IA GENERATIVA",
    welcome_desc:
      "Olá, sou o MAX, seu coach de IA. Neste laboratório você vai ver o que é a IA generativa, o que ela faz bem e por que às vezes erra, para poder explicar com as suas palavras.",
    welcome_voice:
      "Olá, sou o MAX, seu coach de IA da Edutechlife. Neste laboratório vamos ver juntos o que é a IA generativa, como ela constrói suas respostas, o que faz bem e por que às vezes erra. No final você poderá explicar com as suas próprias palavras.",
    welcome_cta: "Começar Laboratório",
    history_title_1: "1950–1980 · As primeiras ideias",
    history_desc_1:
      "Em 1950, Alan Turing perguntou se uma máquina poderia “pensar”. Em 1956 usou-se pela primeira vez o nome “inteligência artificial”. Os primeiros programas seguiam regras escritas à mão, e por isso o avanço foi lento.",
    history_title_2: "2010–2020 · Mais dados, mais potência",
    history_desc_2:
      "Com muitíssimos dados na internet e computadores mais potentes, a IA aprendeu a reconhecer imagens, vozes e textos. Assim passaram a funcionar o filtro de spam, os tradutores e as recomendações de música e vídeo.",
    history_title_3: "2017 · Ler cada palavra no seu contexto",
    history_desc_3:
      "Inventou-se uma nova forma de treinar a IA para que entenda cada palavra segundo as que a rodeiam. Essa ideia tornou possíveis as IAs que conversam e escrevem textos.",
    history_title_4: "2022 em diante · IA generativa",
    history_desc_4:
      "Com a chegada do ChatGPT, em novembro de 2022, a IA que escreve, resume e cria imagens chegou a milhões de pessoas. Hoje há muitas ferramentas, e cada uma muda com frequência.",
    prompt_title: "como a IA responde",
    prompt_desc:
      "A IA generativa não busca uma resposta guardada: ela a constrói peça por peça, adivinhando qual palavra faz mais sentido depois da anterior. Aprendeu esses padrões lendo enormes quantidades de textos.",
    prompt_voice:
      "A IA generativa não busca uma resposta guardada: ela a constrói peça por peça, adivinhando qual palavra faz mais sentido depois da anterior. Aprendeu esses padrões lendo enormes quantidades de textos. Por isso pode soar muito segura mesmo errando.",
    prompt_tip:
      "“Ao terminar você poderá explicar com as suas palavras por que a IA soa segura mesmo quando às vezes erra.”",
    anatomy_rol: "Resumir",
    anatomy_rol_desc: "Transforma um texto longo em poucas ideias claras.",
    anatomy_contexto: "Redigir",
    anatomy_contexto_desc:
      "Escreve um primeiro rascunho de um e-mail, uma mensagem ou um relatório.",
    anatomia_tarea: "Traduzir",
    anatomia_tarea_desc:
      "Passa um texto de um idioma para outro ou muda o seu tom.",
    anatomia_formato: "Organizar",
    anatomia_formato_desc:
      "Transforma anotações soltas em listas, tabelas ou esquemas.",
    anatomia_restriccion: "Explicar",
    anatomia_restriccion_desc:
      "Esclarece um tema difícil com exemplos e comparações simples.",
    anatomia_ejemplos: "Dar ideias",
    anatomia_ejemplos_desc:
      "Propõe alternativas e perguntas para pensar um problema.",
    anatomy_placeholder: "Toque em cada cartão",
    anatomy_element_label: "Ela faz bem:",
    technique_1_title: "Pode inventar",
    technique_1_desc:
      "Pode dar números, citações ou fontes falsas com total segurança. Isso se chama alucinação.",
    technique_2_title: "Não conhece a sua situação",
    technique_2_desc:
      "O que você não conta, ela adivinha. Com mais contexto, comete menos erros.",
    technique_3_title: "Herda vieses",
    technique_3_desc:
      "Aprendeu com textos escritos por pessoas e pode repetir estereótipos.",
    technique_4_title: "Muda com o tempo",
    technique_4_desc:
      "As ferramentas e suas funções são atualizadas: o que você vê hoje pode ser diferente amanhã.",
    technique_5_title: "Pode não saber o de hoje",
    technique_5_desc:
      "Se não pesquisar na web, pode desconhecer o mais recente.",
    technique_6_title: "Não decide por você",
    technique_6_desc:
      "Pode ajudar a pensar, mas a decisão e a responsabilidade são suas.",
    error_1_title: "Acreditar sem verificar",
    error_1_desc: "Uma resposta que soa segura não é uma resposta comprovada.",
    error_2_title: "Pedir sem contexto",
    error_2_desc:
      "“Me ajude com a minha tarefa” não diz a matéria, o objetivo nem o formato.",
    error_3_title: "Compartilhar dados pessoais",
    error_3_desc:
      "Documentos, senhas ou dados de outras pessoas não se colam em uma IA.",
    error_4_title: "Copiar sem revisar",
    error_4_desc: "Leia, ajuste e faça seu o texto antes de usá-lo.",
    error_5_title: "Deixar que decida por você",
    error_5_desc:
      "Em assuntos importantes sobre pessoas, quem decide é uma pessoa.",
    error_6_title: "Não dizer que a usou",
    error_6_desc: "Se o resultado sai com o seu nome, conte como usou a IA.",
    quiz_1_q: "Como a IA generativa constrói uma resposta?",
    quiz_1_o1: "Busca a resposta já escrita em um banco de dados",
    quiz_1_o2:
      "Prevê quais palavras fazem mais sentido segundo o que aprendeu e o que você pede",
    quiz_1_o3: "Liga para uma pessoa que a escreve",
    quiz_1_o4: "Copia a primeira página da internet",
    quiz_1_f:
      "Ela não guarda respostas prontas: constrói peça por peça a partir de padrões. Por isso pode soar bem e estar errada.",
    quiz_2_q:
      "A IA te dá um número com uma fonte que você não encontra. O que você faz?",
    quiz_2_o1: "Uso: a IA soava segura",
    quiz_2_o2: "Peço que repita com mais segurança",
    quiz_2_o3: "Busco a fonte original; se não existir, não uso",
    quiz_2_o4: "Troco por outro número parecido",
    quiz_2_f:
      "A IA pode inventar números e fontes com total segurança (alucinações). O que é importante se confere na fonte original.",
    quiz_3_q: "Para que a IA generativa serve melhor?",
    quiz_3_o1:
      "Para começar um rascunho, organizar ideias e resumir textos que depois você revisa",
    quiz_3_o2: "Para decidir sozinha quem contratar",
    quiz_3_o3: "Para substituir a verificação dos dados",
    quiz_3_o4: "Para guardar suas senhas",
    quiz_3_f:
      "É um bom apoio para começar, organizar e revisar. A decisão final e a verificação continuam sendo suas.",
    quiz_4_q: "O que você pode fazer para obter uma resposta mais útil?",
    quiz_4_o1: "Pedir o mesmo com menos palavras",
    quiz_4_o2: "Escrever tudo em maiúsculas",
    quiz_4_o3: "Fazer várias perguntas de uma vez sem dizer para quê",
    quiz_4_o4:
      "Contar o contexto: para quem é, o que você precisa e em que formato",
    quiz_4_f:
      "O que você não diz, ela adivinha. Um contexto claro significa menos erros.",
    quiz_5_q: "O que significa a IA poder ter vieses?",
    quiz_5_o1: "Que ela sempre erra",
    quiz_5_o2:
      "Que pode repetir estereótipos dos textos com que aprendeu, então vale conferir quem ela deixa de fora",
    quiz_5_o3: "Que só fala um idioma",
    quiz_5_o4: "Que se cansa se você pede muito",
    quiz_5_f:
      "Ela aprende com textos escritos por pessoas e pode repetir seus preconceitos. Peça a mesma tarefa com perfis diferentes e compare as respostas.",
    quiz_result_title: "concluído!",
    quiz_result_perfect: "Pontuação perfeita! O MAX está orgulhoso de você.",
    quiz_result_good: "Bom trabalho! Revise os conceitos em dúvida.",
    quiz_result_keep_trying:
      "Não se preocupe, revise o laboratório. O MAX confia em você.",
    quiz_result_cta: "Marcar como visto",
    quiz_label_question: "Pergunta",
    quiz_label_of: "de",
    quiz_label_score: "Acertos:",
    quiz_label_see_results: "Ver Resultados",
    quiz_label_continue: "Continuar",
    certificate_desc:
      "Você concluiu o laboratório guiado pelo MAX. Agora pode explicar o que é a IA generativa, o que ela faz bem e por que às vezes erra.",
    certificate_mark_done: "Marcar como visto",
    screen_m1: "Breve história da IA",
    screen_m2: "Como a IA responde",
    screen_m3: "O que ela faz bem",
    screen_m4: "Seus limites",
    screen_m5: "Erros frequentes ao usá-la",
    screen_m6: "Desafio de compreensão",
    progress_label: "PROGRESSO",
    edutechlife_master: "edutechlife master",
    btn_next: "Próximo",
    btn_listen: "Ouvir com o MAX",
    btn_stop: "Parar",
    sidebar_title: "Mapa do Módulo",
    sidebar_welcome: "Início",
    sidebar_menu: "Menu",
    sidebar_certificate: "Certificado",
    footer: "Laboratório guiado por",
    footer_coach: "MAX",
    footer_tagline: "Coach de IA da Edutechlife.",
  },
};

export const useEticaTexts = () => {
  const { locale } = useTranslation();
  return TEXTS[locale] || TEXTS.es;
};

export const ETICA_TEXTS = TEXTS;
