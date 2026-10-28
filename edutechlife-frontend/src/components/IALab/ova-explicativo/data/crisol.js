// OVA «El Crisol» (ILAB-M4-OVA2). Síntesis cruzada de fuentes y análisis crítico (muestra, sesgo, correlación).
export default {
  es: {
    badge: "Módulo 4 · Explicación",
    title: "El Crisol",
    subtitle:
      "Cómo fundir varias fuentes en una síntesis propia y evaluarla con mirada crítica",
    intro:
      "Un crisol funde metales distintos para obtener una aleación nueva. Sintetizar hace lo mismo con fuentes: une lo que dicen varios documentos en una conclusión propia, y luego la examina con criterio. Aquí aprenderás los términos para hacerlo bien.",
    objectives: [
      "Distinguir fuentes primarias y secundarias en una síntesis",
      "Construir una matriz de síntesis cruzada",
      "Explicar qué es una muestra representativa y un sesgo de confirmación",
      "Diferenciar correlación de causalidad",
    ],
    sections: [
      {
        title: "1. Síntesis cruzada",
        explain: [
          "Sintetizar es unir ideas de varias fuentes en una conclusión. La síntesis cruzada compara las fuentes entre sí: qué dicen igual, qué dicen distinto y qué no dice ninguna.",
          "Una tabla de dos ejes (fuentes en filas, ideas en columnas) hace visible el cruce y evita quedarse con una sola voz.",
        ],
        terms: [
          {
            term: "Síntesis",
            def: "Conclusión propia que une ideas de varias fuentes.",
          },
          {
            term: "Síntesis cruzada",
            def: "Comparación de varias fuentes para ver coincidencias, diferencias y vacíos.",
          },
          {
            term: "Matriz",
            def: "Tabla que cruza fuentes y temas para comparar sin perder detalle.",
          },
        ],
        how: [
          "Escribe las fuentes en filas y los temas en columnas.",
          "Marca en cada celda qué dice cada fuente sobre cada tema.",
          "Redacta la conclusión a partir de las coincidencias y de las diferencias.",
        ],
        example:
          "Tres informes sobre energía solar: dos coinciden en el costo inicial y uno lo omite. La síntesis dice «el costo inicial es alto según dos fuentes; la tercera no lo menciona».",
        mistake:
          "Escribir un resumen de cada fuente por separado y llamarlo síntesis. Sin cruce, no hay conclusión propia.",
      },
      {
        title: "2. Fuentes primarias y secundarias en la síntesis",
        explain: [
          "Al sintetizar, prefiere la fuente primaria: el documento original. Una secundaria puede simplificar o cambiar un dato sin que te des cuenta.",
          "Si solo tienes secundarias, indícalo en la síntesis y busca la primaria cuando sea posible.",
        ],
        terms: [
          {
            term: "Fuente primaria",
            def: "Documento original: estudio, norma, registro oficial.",
          },
          {
            term: "Fuente secundaria",
            def: "Texto que comenta, resume o interpreta una fuente primaria.",
          },
        ],
        how: [
          "Identifica qué fuente es primaria y cuál secundaria.",
          "Usa la primaria para los datos y la secundaria para el contexto.",
          "Deja clara la procedencia de cada dato en la síntesis.",
        ],
        example:
          "Un blog dice «el 40 % de los jóvenes usa IA». La encuesta original es la primaria; sin ella, el 40 % no se puede usar con seguridad.",
        mistake:
          "Citar la secundaria como si fuera la fuente de un dato que nunca revisó en el original.",
      },
      {
        title: "3. Muestra y sesgo de confirmación",
        explain: [
          "Una muestra es el grupo de personas o casos que se estudió. Es representativa si refleja bien a la población de la que se habla. Una muestra pequeña o elegida a conveniencia puede dar conclusiones falsas.",
          "El sesgo de confirmación es buscar y aceptar solo las fuentes que confirman lo que ya pensabas. Una síntesis honesta incluye también las fuentes que contradicen tu idea.",
        ],
        terms: [
          {
            term: "Muestra representativa",
            def: "Grupo estudiado que refleja bien a la población total.",
          },
          {
            term: "Sesgo de confirmación",
            def: "Tendencia a buscar y aceptar solo lo que confirma lo que ya creemos.",
          },
        ],
        how: [
          "Pregunta cuántas personas o casos se estudiaron y a quiénes.",
          "Busca fuentes que contradigan tu hipótesis.",
          "Escribe la síntesis incluyendo lo que no encaja.",
        ],
        example:
          "Una encuesta a 30 estudiantes de un solo colegio no permite afirmar algo sobre todos los jóvenes del país.",
        mistake:
          "Dar por válida una conclusión general a partir de una muestra pequeña o de un grupo muy específico.",
      },
      {
        title: "4. Correlación no es causalidad",
        explain: [
          "Correlación significa que dos cosas cambian juntas. Causalidad significa que una provoca a la otra. Que ocurran juntas no prueba que una cause la otra.",
          "Antes de afirmar una causa, busca otra explicación posible: una tercera variable o una simple coincidencia.",
        ],
        terms: [
          {
            term: "Correlación",
            def: "Relación en la que dos variables tienden a cambiar juntas.",
          },
          {
            term: "Causalidad",
            def: "Relación en la que una variable produce el cambio de otra.",
          },
        ],
        how: [
          "Identifica las dos variables que aparecen juntas.",
          "Pregunta si hay una tercera variable que explique ambas.",
          "Afirma una causa solo si la fuente la demuestra.",
        ],
        example:
          "Los países con más heladerías tienen más ahogamientos: la temperatura explica ambos. La correlación no indica que las heladerías causen ahogamientos.",
        mistake:
          "Afirmar que una cosa causa otra porque aparecen juntas en un gráfico.",
      },
    ],
    summary: [
      "Sintetizar es unir ideas de varias fuentes; la síntesis cruzada compara coincidencias, diferencias y vacíos.",
      "Usa la fuente primaria para los datos y reconoce cuando solo hay secundarias.",
      "Una muestra debe representar a la población; el sesgo de confirmación exige incluir lo que contradice.",
      "Correlación no es causalidad: busca otras explicaciones antes de afirmar una causa.",
      "Una buena síntesis es una conclusión propia, con su procedencia clara y sus límites.",
    ],
    check: [
      {
        q: "¿Qué hace la síntesis cruzada?",
        options: [
          "Copia el resumen de cada fuente por separado.",
          "Compara las fuentes para ver coincidencias, diferencias y vacíos.",
          "Elige la fuente más larga y la usa.",
        ],
        correct: 1,
        feedback:
          "La síntesis cruzada compara las fuentes entre sí; sin ese cruce no hay conclusión propia.",
      },
      {
        q: "Una encuesta a 30 estudiantes de un solo colegio. ¿Qué conclusión es válida?",
        options: [
          "Lo que opinan todos los jóvenes del país.",
          "Lo que opinan esos 30 estudiantes, sin generalizar.",
          "Nada: las encuestas nunca sirven.",
        ],
        correct: 1,
        feedback:
          "Una muestra pequeña y específica solo describe a ese grupo; no permite generalizar.",
      },
      {
        q: "Dos variables suben juntas. ¿Qué puedes afirmar?",
        options: [
          "Que una causa a la otra.",
          "Que están relacionadas, pero hay que comprobar si hay una causa.",
          "Que una de ellas es falsa.",
        ],
        correct: 1,
        feedback:
          "Correlación no demuestra causalidad: hay que buscar otra explicación antes de afirmar una causa.",
      },
    ],
  },
  en: {
    badge: "Module 4 · Explanation",
    title: "The Crucible",
    subtitle:
      "How to melt several sources into your own synthesis and evaluate it with a critical eye",
    intro:
      "A crucible melts different metals to make a new alloy. Synthesizing does the same with sources: it joins what several documents say into your own conclusion, and then examines it with judgement. Here you will learn the terms to do it well.",
    objectives: [
      "Tell primary and secondary sources apart in a synthesis",
      "Build a cross-synthesis matrix",
      "Explain what a representative sample and confirmation bias are",
      "Distinguish correlation from causation",
    ],
    sections: [
      {
        title: "1. Cross-synthesis",
        explain: [
          "To synthesize is to join ideas from several sources into one conclusion. Cross-synthesis compares the sources with each other: what they agree on, where they differ, and what none of them says.",
          "A two-axis table (sources in rows, ideas in columns) makes the crossing visible and stops you from relying on a single voice.",
        ],
        terms: [
          {
            term: "Synthesis",
            def: "Your own conclusion that joins ideas from several sources.",
          },
          {
            term: "Cross-synthesis",
            def: "Comparing several sources to see agreements, differences and gaps.",
          },
          {
            term: "Matrix",
            def: "A table crossing sources and topics to compare without losing detail.",
          },
        ],
        how: [
          "Write the sources in rows and the topics in columns.",
          "Mark in each cell what each source says about each topic.",
          "Write the conclusion from the agreements and the differences.",
        ],
        example:
          "Three reports on solar energy: two agree on the initial cost and one leaves it out. The synthesis says «two sources say the initial cost is high; the third does not mention it».",
        mistake:
          "Writing a summary of each source separately and calling it a synthesis. Without crossing them, there is no conclusion of your own.",
      },
      {
        title: "2. Primary and secondary sources in a synthesis",
        explain: [
          "When you synthesize, prefer the primary source: the original document. A secondary one can simplify or change a figure without you noticing.",
          "If you only have secondary sources, say so in the synthesis and look for the primary one when possible.",
        ],
        terms: [
          {
            term: "Primary source",
            def: "The original document: a study, a regulation, an official record.",
          },
          {
            term: "Secondary source",
            def: "A text that comments on, summarizes or interprets a primary source.",
          },
        ],
        how: [
          "Identify which source is primary and which secondary.",
          "Use the primary one for data and the secondary one for context.",
          "Make the origin of each figure clear in the synthesis.",
        ],
        example:
          "A blog says «40% of young people use AI». The original survey is the primary source; without it, the 40% cannot be used with confidence.",
        mistake:
          "Citing the secondary source as if it were the source of a figure you never checked in the original.",
      },
      {
        title: "3. Sample and confirmation bias",
        explain: [
          "A sample is the group of people or cases studied. It is representative if it reflects the population it talks about well. A small or convenience sample can lead to false conclusions.",
          "Confirmation bias is seeking and accepting only the sources that confirm what you already thought. An honest synthesis also includes sources that contradict your idea.",
        ],
        terms: [
          {
            term: "Representative sample",
            def: "A studied group that reflects the whole population well.",
          },
          {
            term: "Confirmation bias",
            def: "The tendency to look for and accept only what confirms what we already believe.",
          },
        ],
        how: [
          "Ask how many people or cases were studied, and who they were.",
          "Look for sources that contradict your hypothesis.",
          "Write the synthesis including what does not fit.",
        ],
        example:
          "A survey of 30 students from one school cannot support a claim about all young people in the country.",
        mistake:
          "Accepting a general conclusion from a small or very specific sample.",
      },
      {
        title: "4. Correlation is not causation",
        explain: [
          "Correlation means two things change together. Causation means one produces the change in the other. Occurring together does not prove that one causes the other.",
          "Before claiming a cause, look for another explanation: a third variable or simple coincidence.",
        ],
        terms: [
          {
            term: "Correlation",
            def: "A relationship in which two variables tend to change together.",
          },
          {
            term: "Causation",
            def: "A relationship in which one variable produces the change in another.",
          },
        ],
        how: [
          "Identify the two variables that appear together.",
          "Ask whether a third variable could explain both.",
          "Claim a cause only if the source demonstrates it.",
        ],
        example:
          "Countries with more ice cream shops have more drownings: temperature explains both. Correlation does not mean ice cream shops cause drownings.",
        mistake:
          "Claiming one thing causes another because they appear together on a chart.",
      },
    ],
    summary: [
      "To synthesize is to join ideas from several sources; cross-synthesis compares agreements, differences and gaps.",
      "Use the primary source for data and recognize when only secondary ones exist.",
      "A sample must represent the population; confirmation bias requires including what contradicts you.",
      "Correlation is not causation: look for other explanations before claiming a cause.",
      "A good synthesis is your own conclusion, with clear origins and stated limits.",
    ],
    check: [
      {
        q: "What does cross-synthesis do?",
        options: [
          "It copies each source's summary separately.",
          "It compares the sources to see agreements, differences and gaps.",
          "It picks the longest source and uses it.",
        ],
        correct: 1,
        feedback:
          "Cross-synthesis compares sources with each other; without that crossing there is no conclusion of your own.",
      },
      {
        q: "A survey of 30 students from one school. Which conclusion is valid?",
        options: [
          "What all young people in the country think.",
          "What those 30 students think, without generalizing.",
          "Nothing: surveys are never useful.",
        ],
        correct: 1,
        feedback:
          "A small, specific sample only describes that group; it does not allow generalization.",
      },
      {
        q: "Two variables rise together. What can you claim?",
        options: [
          "That one causes the other.",
          "That they are related, but you must check whether there is a cause.",
          "That one of them is false.",
        ],
        correct: 1,
        feedback:
          "Correlation does not prove causation: look for another explanation before claiming a cause.",
      },
    ],
  },
  pt: {
    badge: "Módulo 4 · Explicação",
    title: "O Crisol",
    subtitle:
      "Como fundir várias fontes em uma síntese própria e avaliá-la com olhar crítico",
    intro:
      "Um crisol funde metais diferentes para obter uma liga nova. Sintetizar faz o mesmo com fontes: une o que vários documentos dizem em uma conclusão própria, e depois a examina com critério. Aqui você vai aprender os termos para fazer isso bem.",
    objectives: [
      "Distinguir fontes primárias e secundárias em uma síntese",
      "Construir uma matriz de síntese cruzada",
      "Explicar o que é uma amostra representativa e um viés de confirmação",
      "Diferenciar correlação de causalidade",
    ],
    sections: [
      {
        title: "1. Síntese cruzada",
        explain: [
          "Sintetizar é unir ideias de várias fontes em uma conclusão. A síntese cruzada compara as fontes entre si: no que concordam, no que divergem e o que nenhuma diz.",
          "Uma tabela de dois eixos (fontes nas linhas, ideias nas colunas) torna o cruzamento visível e evita ficar com uma única voz.",
        ],
        terms: [
          {
            term: "Síntese",
            def: "Conclusão própria que une ideias de várias fontes.",
          },
          {
            term: "Síntese cruzada",
            def: "Comparação de várias fontes para ver concordâncias, diferenças e lacunas.",
          },
          {
            term: "Matriz",
            def: "Tabela que cruza fontes e temas para comparar sem perder detalhes.",
          },
        ],
        how: [
          "Escreva as fontes nas linhas e os temas nas colunas.",
          "Marque em cada célula o que cada fonte diz sobre cada tema.",
          "Redija a conclusão a partir das concordâncias e das diferenças.",
        ],
        example:
          "Três relatórios sobre energia solar: dois concordam no custo inicial e um não o menciona. A síntese diz «duas fontes apontam custo inicial alto; a terceira não o menciona».",
        mistake:
          "Escrever um resumo de cada fonte separadamente e chamar isso de síntese. Sem cruzamento, não há conclusão própria.",
      },
      {
        title: "2. Fontes primárias e secundárias na síntese",
        explain: [
          "Ao sintetizar, prefira a fonte primária: o documento original. Uma secundária pode simplificar ou alterar um número sem que você perceba.",
          "Se você só tem secundárias, diga isso na síntese e procure a primária quando for possível.",
        ],
        terms: [
          {
            term: "Fonte primária",
            def: "Documento original: estudo, norma, registro oficial.",
          },
          {
            term: "Fonte secundária",
            def: "Texto que comenta, resume ou interpreta uma fonte primária.",
          },
        ],
        how: [
          "Identifique qual fonte é primária e qual é secundária.",
          "Use a primária para os dados e a secundária para o contexto.",
          "Deixe clara a procedência de cada dado na síntese.",
        ],
        example:
          "Um blog diz «40 % dos jovens usa IA». A pesquisa original é a primária; sem ela, o 40 % não pode ser usado com segurança.",
        mistake:
          "Citar a secundária como se fosse a fonte de um dado que você nunca conferiu no original.",
      },
      {
        title: "3. Amostra e viés de confirmação",
        explain: [
          "Uma amostra é o grupo de pessoas ou casos estudado. Ela é representativa se reflete bem a população de que fala. Uma amostra pequena ou escolhida por conveniência pode levar a conclusões falsas.",
          "O viés de confirmação é buscar e aceitar só as fontes que confirmam o que você já pensava. Uma síntese honesta inclui também as fontes que contradizem a sua ideia.",
        ],
        terms: [
          {
            term: "Amostra representativa",
            def: "Grupo estudado que reflete bem a população total.",
          },
          {
            term: "Viés de confirmação",
            def: "Tendência a buscar e aceitar apenas o que confirma o que já acreditamos.",
          },
        ],
        how: [
          "Pergunte quantas pessoas ou casos foram estudados e quais.",
          "Procure fontes que contradigam a sua hipótese.",
          "Escreva a síntese incluindo o que não se encaixa.",
        ],
        example:
          "Uma pesquisa com 30 estudantes de uma só escola não permite afirmar algo sobre todos os jovens do país.",
        mistake:
          "Aceitar uma conclusão geral a partir de uma amostra pequena ou muito específica.",
      },
      {
        title: "4. Correlação não é causalidade",
        explain: [
          "Correlação significa que duas coisas mudam juntas. Causalidade significa que uma produz a mudança na outra. Acontecerem juntas não prova que uma cause a outra.",
          "Antes de afirmar uma causa, procure outra explicação: uma terceira variável ou simples coincidência.",
        ],
        terms: [
          {
            term: "Correlação",
            def: "Relação em que duas variáveis tendem a mudar juntas.",
          },
          {
            term: "Causalidade",
            def: "Relação em que uma variável produz a mudança em outra.",
          },
        ],
        how: [
          "Identifique as duas variáveis que aparecem juntas.",
          "Pergunte se uma terceira variável pode explicar as duas.",
          "Afirme uma causa só se a fonte a demonstrar.",
        ],
        example:
          "Países com mais sorveterias têm mais afogamentos: a temperatura explica ambos. A correlação não indica que as sorveterias causem afogamentos.",
        mistake:
          "Afirmar que uma coisa causa outra porque aparecem juntas em um gráfico.",
      },
    ],
    summary: [
      "Sintetizar é unir ideias de várias fontes; a síntese cruzada compara concordâncias, diferenças e lacunas.",
      "Use a fonte primária para os dados e reconheça quando só há secundárias.",
      "Uma amostra deve representar a população; o viés de confirmação exige incluir o que contradiz.",
      "Correlação não é causalidade: procure outras explicações antes de afirmar uma causa.",
      "Uma boa síntese é uma conclusão própria, com procedência clara e limites declarados.",
    ],
    check: [
      {
        q: "O que faz a síntese cruzada?",
        options: [
          "Copia o resumo de cada fonte separadamente.",
          "Compara as fontes para ver concordâncias, diferenças e lacunas.",
          "Escolhe a fonte mais longa e a usa.",
        ],
        correct: 1,
        feedback:
          "A síntese cruzada compara as fontes entre si; sem esse cruzamento não há conclusão própria.",
      },
      {
        q: "Uma pesquisa com 30 estudantes de uma só escola. Qual conclusão é válida?",
        options: [
          "O que pensam todos os jovens do país.",
          "O que pensam esses 30 estudantes, sem generalizar.",
          "Nada: pesquisas nunca servem.",
        ],
        correct: 1,
        feedback:
          "Uma amostra pequena e específica descreve só esse grupo; não permite generalizar.",
      },
      {
        q: "Duas variáveis sobem juntas. O que você pode afirmar?",
        options: [
          "Que uma causa a outra.",
          "Que estão relacionadas, mas é preciso verificar se há causa.",
          "Que uma delas é falsa.",
        ],
        correct: 1,
        feedback:
          "Correlação não demonstra causalidade: procure outra explicação antes de afirmar uma causa.",
      },
    ],
  },
};
