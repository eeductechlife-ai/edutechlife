// Escenarios del quiz de "El Primer Pedido". La respuesta correcta no se distingue por longitud ni por posición.
export const FIRST_REQUEST_SCENARIOS = {
  es: [
    {
      weak: "Escribe un correo a mis clientes.",
      options: [
        "Escribe un correo cercano para mis alumnos sobre el nuevo horario de clases.",
        "Eres una persona de atención al cliente. Escribe un correo cordial y profesional, muy bien redactado, sobre el horario.",
        "Correo de una escuela de idiomas a alumnos adultos: nuevo horario, 120 palabras, tono cercano, sin prometer fechas.",
      ],
      correct: 2,
      why: "Define quién escribe, a quién, el objetivo, la extensión, el tono y un límite. Así el resultado sale útil a la primera.",
    },
    {
      weak: "Haz un resumen de este informe.",
      options: [
        "Resume en 5 ideas, con la página de cada una, para un directivo con 3 minutos, en lenguaje sencillo.",
        "Resume este informe en 5 ideas para la junta, en lenguaje sencillo.",
        "Haz un resumen completo y bien hecho de este informe, útil para quien lo necesite leer y tomar decisiones con él.",
      ],
      correct: 0,
      why: "El número de ideas, la página de cada una y el lector hacen que el resumen sea verificable.",
    },
    {
      weak: "Crea una presentación sobre IA.",
      options: [
        "Presentación de 8 diapositivas sobre IA, con tono cercano.",
        "Presentación de 8 diapositivas sobre IA para docentes sin experiencia técnica, tono cercano, una idea por diapositiva.",
        "Crea una presentación muy completa sobre IA, con todo lo que sepas del tema, para que sirva a cualquier público y quede perfecta.",
      ],
      correct: 1,
      why: "Número de diapositivas, público, tono y una regla de contenido: el pedido describe el resultado que quieres.",
    },
    {
      weak: "Explícame la fotosíntesis.",
      options: [
        "Explícame la fotosíntesis para un niño de 12 años, en 6 frases.",
        "Explícame la fotosíntesis, por favor, de la manera más clara que puedas, que se entienda bien y sea agradable de leer.",
        "Analogía de cocina sobre la fotosíntesis, para un estudiante de 12 años, en 6 frases, tono cercano y sin tecnicismos.",
      ],
      correct: 2,
      why: "La analogía, el lector, la extensión y un ejemplo cotidiano dicen qué se espera. 'Completa' o 'clara' no lo dicen.",
    },
    {
      weak: "Dame ideas para mi tienda.",
      options: [
        "Dame 10 ideas de publicaciones para redes de mi tienda de café de barrio, cada una con un gancho y tono cercano.",
        "Dame 10 ideas de publicaciones para mi tienda de café, con tono cercano.",
        "Dame ideas originales y bien pensadas para mi tienda, modernas y que funcionen muy bien en cualquier canal que yo decida.",
      ],
      correct: 0,
      why: "Cantidad, canal, tipo de pieza y tono convierten una idea general en una lista que puedes usar hoy.",
    },
  ],
  en: [
    {
      weak: "Write an email to my customers.",
      options: [
        "Write a warm email to my students about the new class schedule.",
        "You are a customer service person. Write a kind and professional email, very well written, about the schedule change.",
        "Email from a language school to adult students: new schedule, 120 words, warm tone, no unconfirmed dates.",
      ],
      correct: 2,
      why: "It defines who writes, to whom, the goal, the length, the tone and a limit. That way the result is useful on the first try.",
    },
    {
      weak: "Summarize this report.",
      options: [
        "Summarize in 5 ideas, with the page of each, for a director with 3 minutes, in plain language.",
        "Summarize this report in 5 ideas for the board, in plain language.",
        "Write a complete and well-done summary of this report, useful for whoever needs to read it and make decisions with it.",
      ],
      correct: 0,
      why: "The number of ideas, the page of each one and the reader make the summary verifiable.",
    },
    {
      weak: "Make a presentation about AI.",
      options: [
        "An 8-slide presentation about AI, with a warm tone.",
        "An 8-slide presentation about AI for teachers with no technical background, warm tone, one idea per slide.",
        "Make a very complete presentation about AI, with everything you know about the topic, for any audience and perfect in every way.",
      ],
      correct: 1,
      why: "Number of slides, audience, tone and a content rule: the request describes the result you want.",
    },
    {
      weak: "Explain photosynthesis.",
      options: [
        "Explain photosynthesis to a 12-year-old in 6 sentences.",
        "Explain photosynthesis, please, as clearly as you can, so that it is easy to understand and pleasant to read for anyone.",
        "A kitchen analogy about photosynthesis, for a 12-year-old student, in 6 sentences, warm tone and no jargon.",
      ],
      correct: 2,
      why: "The analogy, the reader, the length and an everyday example say what is expected. 'Complete' or 'clear' do not.",
    },
    {
      weak: "Give me ideas for my shop.",
      options: [
        "Give me 10 social media post ideas for my neighborhood coffee shop, each with a hook and a warm tone.",
        "Give me 10 post ideas for my coffee shop, with a warm tone.",
        "Give me original and well-thought-out ideas for my shop, modern ones that work really well on any channel I choose.",
      ],
      correct: 0,
      why: "Quantity, channel, type of piece and tone turn a general idea into a list you can use today.",
    },
  ],
  pt: [
    {
      weak: "Escreva um e-mail para os meus clientes.",
      options: [
        "Escreva um e-mail cordial para os meus alunos sobre o novo horário das aulas.",
        "Você é uma pessoa de atendimento ao cliente. Escreva um e-mail gentil e profissional, bem redigido, sobre a mudança de horário.",
        "E-mail de uma escola de idiomas para alunos adultos: novo horário, 120 palavras, tom cordial, sem prometer datas.",
      ],
      correct: 2,
      why: "Define quem escreve, para quem, o objetivo, a extensão, o tom e um limite. Assim o resultado já sai útil de primeira.",
    },
    {
      weak: "Faça um resumo deste relatório.",
      options: [
        "Resuma em 5 ideias, com a página de cada uma, para um diretor com 3 minutos, em linguagem simples.",
        "Resuma este relatório em 5 ideias para o conselho, em linguagem simples.",
        "Faça um resumo completo e bem feito deste relatório, útil para quem precisa lê-lo e decidir com base nele.",
      ],
      correct: 0,
      why: "O número de ideias, a página de cada uma e o leitor tornam o resumo verificável.",
    },
    {
      weak: "Crie uma apresentação sobre IA.",
      options: [
        "Apresentação de 8 slides sobre IA, com tom cordial.",
        "Apresentação de 8 slides sobre IA para professores sem experiência técnica, tom cordial, uma ideia por slide.",
        "Crie uma apresentação muito completa sobre IA, com tudo o que você sabe sobre o tema, para qualquer público e perfeita.",
      ],
      correct: 1,
      why: "Número de slides, público, tom e uma regra de conteúdo: o pedido descreve o resultado que você quer.",
    },
    {
      weak: "Explique a fotossíntese.",
      options: [
        "Explique a fotossíntese para uma criança de 12 anos em 6 frases.",
        "Explique a fotossíntese, por favor, da forma mais clara possível, para que se entenda bem e seja agradável de ler.",
        "Analogia de cozinha sobre a fotossíntese, para um aluno de 12 anos, em 6 frases, tom cordial e sem jargão.",
      ],
      correct: 2,
      why: "A analogia, o leitor, a extensão e um exemplo do dia a dia dizem o que se espera. 'Completa' ou 'clara' não dizem.",
    },
    {
      weak: "Dê ideias para a minha loja.",
      options: [
        "Dê 10 ideias de publicações para as redes da minha cafeteria de bairro, cada uma com um gancho e tom cordial.",
        "Dê 10 ideias de publicações para a minha cafeteria, com tom cordial.",
        "Dê ideias originais e bem pensadas para a minha loja, modernas e que funcionem muito bem em qualquer canal que eu escolher.",
      ],
      correct: 0,
      why: "Quantidade, canal, tipo de peça e tom transformam uma ideia geral em uma lista que você pode usar hoje.",
    },
  ],
};
