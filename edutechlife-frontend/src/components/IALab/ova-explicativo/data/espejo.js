// OVA «El Espejo de la Verdad» (ILAB-M1-OVA4). Sesgos: origen, tipos, detección y mitigación.
export default {
  es: {
    badge: "Módulo 1 · Explicación",
    title: "El Espejo de la Verdad",
    subtitle:
      "Qué es un sesgo en la IA, de dónde viene, cómo detectarlo y cómo reducirlo",
    intro:
      "La IA aprende de textos escritos por personas, y esos textos tienen prejuicios. Un espejo muestra lo que hay: aquí aprenderás a ver los sesgos que la IA puede reflejar y repetir, y qué hacer para no amplificarlos.",
    objectives: [
      "Definir sesgo algorítmico y explicar su origen",
      "Reconocer cuatro tipos de sesgo con ejemplos",
      "Aplicar una prueba sencilla para detectar un sesgo",
      "Proponer medidas para reducir un sesgo en un resultado",
    ],
    sections: [
      {
        title: "1. De dónde viene un sesgo",
        explain: [
          "Un sesgo es una inclinación que favorece o perjudica de forma sistemática a un grupo de personas. Un sistema de IA puede tenerlo porque aprendió de datos que ya lo tenían.",
          "El sesgo no siempre es intencional. Puede venir de los datos, de cómo se etiquetaron, o de quién diseñó el sistema y qué problema se propuso resolver.",
        ],
        terms: [
          {
            term: "Sesgo algorítmico",
            def: "Resultado sistemáticamente injusto que produce un sistema automático.",
          },
          {
            term: "Datos de entrenamiento",
            def: "Los textos o registros con los que el sistema aprendió a responder.",
          },
        ],
        how: [
          "Los datos reflejan decisiones y prejuicios del pasado.",
          "El sistema aprende esos patrones como si fueran normales.",
          "Repite el patrón en sus respuestas y decisiones.",
        ],
        example:
          "Si en los datos de contratación de una empresa casi nunca aparecen mujeres en cargos de dirección, un sistema entrenado con ellos puede asociar «dirección» con hombres.",
        mistake:
          "Pensar que, como es una máquina, no puede ser injusta. Si aprende de datos injustos, reproduce la injusticia.",
      },
      {
        title: "2. Cuatro tipos de sesgo",
        explain: [
          "Hay varias formas de sesgo. Reconocer el tipo te ayuda a buscarlo en el lugar correcto.",
          "Sesgo de datos: los datos no representan a todos. Sesgo de muestreo: se eligió mal a quién medir. Sesgo de etiquetado: quien clasificó los datos tenía una visión sesgada. Sesgo de confirmación: el sistema tiende a dar lo que se espera.",
        ],
        terms: [
          {
            term: "Sesgo de datos",
            def: "Los datos no representan bien a la población real.",
          },
          {
            term: "Sesgo de muestreo",
            def: "Se eligieron de forma que algunos grupos quedan fuera.",
          },
          {
            term: "Sesgo de etiquetado",
            def: "Las etiquetas que se asignaron a los datos reflejan prejuicios de quien las puso.",
          },
        ],
        how: [
          "Pregunta a quién representan los datos.",
          "Pregunta quién los clasificó y con qué criterio.",
          "Revisa si el resultado favorece a unos grupos más que a otros.",
        ],
        example:
          "Un sistema para detectar «buenos candidatos» entrenado solo con perfiles de una ciudad puede penalizar a candidatos de otras regiones: sesgo de muestreo.",
        mistake:
          "Buscar el sesgo solo en el resultado final. A veces empieza en los datos o en cómo se etiquetaron.",
      },
      {
        title: "3. Cómo detectar un sesgo",
        explain: [
          "Una prueba sencilla consiste en hacer la misma pregunta cambiando solo un dato que no debería importar, como el nombre, la edad o el lugar de origen, y comparar las respuestas.",
          "Si la respuesta cambia de forma injusta, hay un sesgo que conviene reportar y corregir.",
        ],
        terms: [
          {
            term: "Prueba contrafactual",
            def: "Cambiar un solo dato y observar si el resultado cambia injustamente.",
          },
          {
            term: "Grupo afectado",
            def: "Las personas que reciben un trato injusto por el sesgo.",
          },
        ],
        how: [
          "Elige el dato a cambiar (nombre, edad, región).",
          "Haz la misma pregunta dos o tres veces, cambiando solo ese dato.",
          "Compara las respuestas y anota las diferencias injustas.",
        ],
        example:
          "Pides una recomendación de carrera para «Ana» y para «Andrés», con el mismo perfil académico. Si una recomendación es más ambiciosa para uno, hay un sesgo que revisar.",
        mistake:
          "Probar una sola vez. Un sesgo se confirma con varias pruebas y casos distintos.",
      },
      {
        title: "4. Reducir el sesgo",
        explain: [
          "Reducir un sesgo significa cambiar el proceso: incluir datos más representativos, revisar las etiquetas, pedir justificaciones y dejar una persona que decida en los casos que afectan a otros.",
          "Ningún método lo elimina por completo. Lo importante es detectarlo, reportarlo y corregirlo a tiempo.",
        ],
        terms: [
          {
            term: "Mitigación",
            def: "Medidas para reducir un sesgo sin pretender eliminarlo del todo.",
          },
          {
            term: "Revisión humana",
            def: "Una persona que revisa y decide cuando el resultado afecta a personas.",
          },
        ],
        how: [
          "Pide al sistema que explique sus criterios.",
          "Revisa si faltan grupos en los datos y completa la información.",
          "Deja una persona a cargo de las decisiones que afectan a otros.",
        ],
        example:
          "Antes de usar una herramienta de selección, pides los criterios y pruebas con casos de distintos grupos. Solo después decides cómo usarla.",
        mistake:
          "Confiar en que un resultado es justo porque el sistema lo dice. Hay que verificarlo.",
      },
    ],
    summary: [
      "Un sesgo es una inclinación injusta y sistemática; la IA puede aprenderlo de los datos.",
      "Puede venir de los datos, del muestreo, del etiquetado o del propio diseño del sistema.",
      "La prueba contrafactual cambia un solo dato para ver si el resultado cambia injustamente.",
      "Reducir un sesgo exige revisar datos, pedir criterios y dejar una persona a cargo.",
      "Detectar, reportar y corregir a tiempo es más importante que pensar que no existe.",
    ],
    check: [
      {
        q: "¿De dónde puede venir un sesgo en la IA?",
        options: [
          "Solo de errores de programación evidentes.",
          "De los datos, del etiquetado o de cómo se diseñó el sistema.",
          "Del color de la pantalla donde se usa.",
        ],
        correct: 1,
        feedback:
          "El sesgo puede empezar en los datos, en las etiquetas o en el diseño, no solo en el código.",
      },
      {
        q: "¿Qué es una prueba contrafactual?",
        options: [
          "Cambiar un solo dato y observar si el resultado cambia injustamente.",
          "Pedir a la IA que se evalúe a sí misma.",
          "Borrar los datos antes de probar.",
        ],
        correct: 0,
        feedback:
          "Cambiar un solo dato que no debería importar permite ver si hay un trato injusto.",
      },
      {
        q: "Un sistema da respuestas distintas a dos perfiles iguales que solo difieren en el lugar de origen. ¿Qué haces?",
        options: [
          "Lo acepto, porque la IA no tiene prejuicios.",
          "Lo reporto y reviso los datos y criterios que lo producen.",
          "Elijo siempre la respuesta más favorable.",
        ],
        correct: 1,
        feedback:
          "Una diferencia injusta entre perfiles iguales es un sesgo: hay que reportarlo y revisar su origen.",
      },
    ],
  },
  en: {
    badge: "Module 1 · Explanation",
    title: "The Mirror of Truth",
    subtitle:
      "What bias in AI is, where it comes from, how to detect it and how to reduce it",
    intro:
      "AI learns from texts written by people, and those texts carry prejudices. A mirror shows what is there: here you will learn to see the biases the AI can reflect and repeat, and what to do so you do not amplify them.",
    objectives: [
      "Define algorithmic bias and explain where it comes from",
      "Recognize four types of bias with examples",
      "Apply a simple test to detect a bias",
      "Propose measures to reduce a bias in a result",
    ],
    sections: [
      {
        title: "1. Where a bias comes from",
        explain: [
          "A bias is a tendency that systematically favors or harms a group of people. An AI system can have it because it learned from data that already had it.",
          "Bias is not always intentional. It can come from the data, from how it was labeled, or from who designed the system and which problem it was meant to solve.",
        ],
        terms: [
          {
            term: "Algorithmic bias",
            def: "A systematically unfair result produced by an automated system.",
          },
          {
            term: "Training data",
            def: "The texts or records the system learned from.",
          },
        ],
        how: [
          "The data reflects past decisions and prejudices.",
          "The system learns those patterns as if they were normal.",
          "It repeats the pattern in its answers and decisions.",
        ],
        example:
          "If a company's hiring data rarely includes women in leadership roles, a system trained on it may associate «leadership» with men.",
        mistake:
          "Thinking that, because it is a machine, it cannot be unfair. If it learns from unfair data, it reproduces the unfairness.",
      },
      {
        title: "2. Four types of bias",
        explain: [
          "There are several forms of bias. Knowing the type helps you look for it in the right place.",
          "Data bias: the data does not represent everyone. Sampling bias: the people measured were chosen badly. Labeling bias: whoever labeled the data had a skewed view. Confirmation bias: the system tends to give what is expected.",
        ],
        terms: [
          {
            term: "Data bias",
            def: "The data does not represent the real population well.",
          },
          {
            term: "Sampling bias",
            def: "The sample was chosen so that some groups are left out.",
          },
          {
            term: "Labeling bias",
            def: "The labels given to the data reflect the prejudices of whoever assigned them.",
          },
        ],
        how: [
          "Ask whom the data represents.",
          "Ask who labeled it and with what criteria.",
          "Check whether the result favors some groups over others.",
        ],
        example:
          "A system to find «good candidates» trained only on profiles from one city may penalize candidates from other regions: sampling bias.",
        mistake:
          "Looking for bias only in the final result. Sometimes it starts in the data or in how it was labeled.",
      },
      {
        title: "3. How to detect a bias",
        explain: [
          "A simple test is to ask the same question changing only one piece of data that should not matter, such as the name, the age or the place of origin, and compare the answers.",
          "If the answer changes unfairly, there is a bias worth reporting and correcting.",
        ],
        terms: [
          {
            term: "Counterfactual test",
            def: "Changing a single piece of data and seeing whether the result changes unfairly.",
          },
          {
            term: "Affected group",
            def: "The people who receive unfair treatment because of the bias.",
          },
        ],
        how: [
          "Choose the data to change (name, age, region).",
          "Ask the same question two or three times, changing only that data.",
          "Compare the answers and note any unfair differences.",
        ],
        example:
          "You ask for a career recommendation for «Ana» and for «Andrés» with the same academic profile. If one recommendation is more ambitious, there is a bias to review.",
        mistake:
          "Testing only once. A bias is confirmed through several tests and different cases.",
      },
      {
        title: "4. Reducing bias",
        explain: [
          "Reducing a bias means changing the process: including more representative data, reviewing the labels, asking for justifications, and keeping a person in charge of decisions that affect others.",
          "No method removes it completely. What matters is detecting it, reporting it and correcting it in time.",
        ],
        terms: [
          {
            term: "Mitigation",
            def: "Measures that reduce a bias without claiming to eliminate it entirely.",
          },
          {
            term: "Human review",
            def: "A person who reviews and decides when the result affects people.",
          },
        ],
        how: [
          "Ask the system to explain its criteria.",
          "Check whether groups are missing from the data and complete it.",
          "Keep a person in charge of decisions that affect others.",
        ],
        example:
          "Before using a selection tool, you request its criteria and test it with cases from different groups. Only then do you decide how to use it.",
        mistake:
          "Trusting that a result is fair because the system says so. It must be verified.",
      },
    ],
    summary: [
      "A bias is a systematic, unfair tendency; AI can learn it from data.",
      "It can come from the data, the sampling, the labeling or the system's design.",
      "The counterfactual test changes one piece of data to see whether the result changes unfairly.",
      "Reducing bias means reviewing data, asking for criteria and keeping a person in charge.",
      "Detecting, reporting and correcting in time matters more than assuming it does not exist.",
    ],
    check: [
      {
        q: "Where can a bias in AI come from?",
        options: [
          "Only from obvious programming errors.",
          "From the data, the labeling or how the system was designed.",
          "From the color of the screen where it is used.",
        ],
        correct: 1,
        feedback:
          "Bias can start in the data, the labels or the design, not only in the code.",
      },
      {
        q: "What is a counterfactual test?",
        options: [
          "Changing a single piece of data and seeing whether the result changes unfairly.",
          "Asking the AI to evaluate itself.",
          "Deleting the data before testing.",
        ],
        correct: 0,
        feedback:
          "Changing one piece of data that should not matter reveals whether there is unfair treatment.",
      },
      {
        q: "A system gives different answers to two identical profiles that differ only in place of origin. What do you do?",
        options: [
          "I accept it, because AI has no prejudices.",
          "I report it and review the data and criteria that produce it.",
          "I always choose the most favorable answer.",
        ],
        correct: 1,
        feedback:
          "An unfair difference between identical profiles is a bias: report it and review where it comes from.",
      },
    ],
  },
  pt: {
    badge: "Módulo 1 · Explicação",
    title: "O Espelho da Verdade",
    subtitle:
      "O que é um viés na IA, de onde vem, como detectá-lo e como reduzi-lo",
    intro:
      "A IA aprende com textos escritos por pessoas, e esses textos têm preconceitos. Um espelho mostra o que está ali: aqui você vai aprender a enxergar os vieses que a IA pode refletir e repetir, e o que fazer para não amplificá-los.",
    objectives: [
      "Definir viés algorítmico e explicar a sua origem",
      "Reconhecer quatro tipos de viés com exemplos",
      "Aplicar um teste simples para detectar um viés",
      "Propor medidas para reduzir um viés em um resultado",
    ],
    sections: [
      {
        title: "1. De onde vem um viés",
        explain: [
          "Um viés é uma tendência que favorece ou prejudica de forma sistemática um grupo de pessoas. Um sistema de IA pode tê-lo porque aprendeu com dados que já o tinham.",
          "O viés nem sempre é intencional. Pode vir dos dados, de como foram rotulados, ou de quem projetou o sistema e qual problema pretendia resolver.",
        ],
        terms: [
          {
            term: "Viés algorítmico",
            def: "Resultado sistematicamente injusto produzido por um sistema automático.",
          },
          {
            term: "Dados de treinamento",
            def: "Os textos ou registros com que o sistema aprendeu.",
          },
        ],
        how: [
          "Os dados refletem decisões e preconceitos do passado.",
          "O sistema aprende esses padrões como se fossem normais.",
          "Ele repete o padrão nas respostas e decisões.",
        ],
        example:
          "Se os dados de contratação de uma empresa quase nunca têm mulheres em cargos de liderança, um sistema treinado com eles pode associar «liderança» a homens.",
        mistake:
          "Achar que, por ser uma máquina, não pode ser injusta. Se aprende com dados injustos, reproduz a injustiça.",
      },
      {
        title: "2. Quatro tipos de viés",
        explain: [
          "Há várias formas de viés. Saber o tipo ajuda a procurá-lo no lugar certo.",
          "Viés de dados: os dados não representam todos. Viés de amostragem: as pessoas medidas foram mal escolhidas. Viés de rotulagem: quem classificou os dados tinha uma visão enviesada. Viés de confirmação: o sistema tende a dar o que se espera.",
        ],
        terms: [
          {
            term: "Viés de dados",
            def: "Os dados não representam bem a população real.",
          },
          {
            term: "Viés de amostragem",
            def: "A amostra foi escolhida de forma que alguns grupos ficam de fora.",
          },
          {
            term: "Viés de rotulagem",
            def: "Os rótulos dados aos dados refletem preconceitos de quem os atribuiu.",
          },
        ],
        how: [
          "Pergunte a quem os dados representam.",
          "Pergunte quem os rotulou e com que critério.",
          "Verifique se o resultado favorece alguns grupos mais que outros.",
        ],
        example:
          "Um sistema para encontrar «bons candidatos» treinado só com perfis de uma cidade pode penalizar candidatos de outras regiões: viés de amostragem.",
        mistake:
          "Procurar o viés só no resultado final. Às vezes ele começa nos dados ou na forma como foram rotulados.",
      },
      {
        title: "3. Como detectar um viés",
        explain: [
          "Um teste simples é fazer a mesma pergunta mudando só um dado que não deveria importar, como o nome, a idade ou o lugar de origem, e comparar as respostas.",
          "Se a resposta muda de forma injusta, há um viés que vale a pena registrar e corrigir.",
        ],
        terms: [
          {
            term: "Teste contrafactual",
            def: "Mudar um único dado e observar se o resultado muda de forma injusta.",
          },
          {
            term: "Grupo afetado",
            def: "As pessoas que recebem tratamento injusto por causa do viés.",
          },
        ],
        how: [
          "Escolha o dado a mudar (nome, idade, região).",
          "Faça a mesma pergunta duas ou três vezes, mudando só esse dado.",
          "Compare as respostas e anote as diferenças injustas.",
        ],
        example:
          "Você pede uma recomendação de carreira para «Ana» e para «Andrés», com o mesmo perfil acadêmico. Se uma recomendação é mais ambiciosa para um deles, há um viés a revisar.",
        mistake:
          "Testar uma única vez. Um viés se confirma com vários testes e casos diferentes.",
      },
      {
        title: "4. Reduzir o viés",
        explain: [
          "Reduzir um viés é mudar o processo: incluir dados mais representativos, revisar os rótulos, pedir justificativas e deixar uma pessoa responsável pelas decisões que afetam outras.",
          "Nenhum método o elimina por completo. O importante é detectá-lo, registrá-lo e corrigi-lo a tempo.",
        ],
        terms: [
          {
            term: "Mitigação",
            def: "Medidas que reduzem um viés sem pretender eliminá-lo totalmente.",
          },
          {
            term: "Revisão humana",
            def: "Uma pessoa que revisa e decide quando o resultado afeta pessoas.",
          },
        ],
        how: [
          "Peça ao sistema que explique os critérios.",
          "Verifique se faltam grupos nos dados e complete.",
          "Deixe uma pessoa responsável pelas decisões que afetam outros.",
        ],
        example:
          "Antes de usar uma ferramenta de seleção, você pede os critérios e testa com casos de grupos diferentes. Só depois decide como usá-la.",
        mistake:
          "Confiar que um resultado é justo porque o sistema diz que é. É preciso verificar.",
      },
    ],
    summary: [
      "Um viés é uma tendência injusta e sistemática; a IA pode aprendê-la com os dados.",
      "Pode vir dos dados, da amostragem, da rotulagem ou do próprio desenho do sistema.",
      "O teste contrafactual muda um dado para ver se o resultado muda de forma injusta.",
      "Reduzir um viés exige revisar dados, pedir critérios e manter uma pessoa responsável.",
      "Detectar, registrar e corrigir a tempo vale mais do que achar que ele não existe.",
    ],
    check: [
      {
        q: "De onde pode vir um viés na IA?",
        options: [
          "Somente de erros de programação evidentes.",
          "Dos dados, da rotulagem ou do desenho do sistema.",
          "Da cor da tela onde é usada.",
        ],
        correct: 1,
        feedback:
          "O viés pode começar nos dados, nos rótulos ou no desenho, não só no código.",
      },
      {
        q: "O que é um teste contrafactual?",
        options: [
          "Mudar um único dado e observar se o resultado muda de forma injusta.",
          "Pedir que a IA se avalie.",
          "Apagar os dados antes de testar.",
        ],
        correct: 0,
        feedback:
          "Mudar um dado que não deveria importar revela se há tratamento injusto.",
      },
      {
        q: "Um sistema dá respostas diferentes para dois perfis iguais que diferem só no lugar de origem. O que você faz?",
        options: [
          "Aceito, porque a IA não tem preconceitos.",
          "Registro e reviso os dados e critérios que o produzem.",
          "Escolho sempre a resposta mais favorável.",
        ],
        correct: 1,
        feedback:
          "Uma diferença injusta entre perfis iguais é um viés: registre e revise a origem.",
      },
    ],
  },
};
