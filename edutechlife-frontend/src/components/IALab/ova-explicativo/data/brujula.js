// OVA «La Brújula de Riesgos» (ILAB-M1-OVA5). Privacidad: datos personales, anonimización y Ley 1581.
export default {
  es: {
    badge: "Módulo 1 · Explicación",
    title: "La Brújula de Riesgos",
    subtitle:
      "Qué datos nunca compartes con una IA, cómo protegerlos y qué hacer si ya lo hiciste",
    intro:
      "Cada vez que pegas un texto en un chat, decides qué sale de tu control. Esta lección te da el vocabulario para reconocer un dato personal, anonimizarlo y actuar bien si te equivocas. La brújula te orienta antes de que compartas.",
    objectives: [
      "Distinguir un dato personal de un dato sensible",
      "Explicar qué es anonimizar y seudonimizar",
      "Aplicar el principio de minimización",
      "Saber qué hacer si ya compartiste un dato",
    ],
    sections: [
      {
        title: "1. Dato personal y dato sensible",
        explain: [
          "Un dato personal es cualquier información que permite identificar a una persona: nombre, cédula, teléfono, correo, dirección o una foto donde se la reconoce.",
          "Un dato sensible es el que, si se filtra, puede causar discriminación o un daño grave: salud, creencias, orientación sexual, datos biométricos o cualquier dato de un menor de edad.",
        ],
        terms: [
          {
            term: "Dato personal",
            def: "Información que identifica o hace identificable a una persona.",
          },
          {
            term: "Dato sensible",
            def: "Dato personal cuyo uso indebido puede causar discriminación o un daño grave.",
          },
          { term: "Titular", def: "La persona a la que pertenece el dato." },
        ],
        how: [
          "Pregúntate: ¿esto identifica a alguien?",
          "Si la respuesta es sí, pregúntate si es sensible.",
          "Si es sensible o de un menor, no lo compartas con una herramienta de IA.",
        ],
        example:
          "«Ana Gómez, 14 años, con asma» contiene un dato personal y uno sensible. Eso no entra en un chat.",
        mistake:
          "Pensar que un dato no es personal porque «solo es un nombre». Un nombre junto a otro dato ya identifica a alguien.",
      },
      {
        title: "2. Anonimizar y seudonimizar",
        explain: [
          "Anonimizar es quitar los datos que identifican a una persona, de modo que no se pueda volver a identificar. Seudonimizar es reemplazarlos por un código que solo tú puedes relacionar con la persona.",
          "La seudonimización reduce el riesgo, pero el código sigue siendo un dato personal si alguien más puede deshacerlo. Por eso conviene separar la lista de códigos del texto que compartes.",
        ],
        terms: [
          {
            term: "Anonimizar",
            def: "Quitar los datos que identifican a alguien, de forma que no se pueda volver a identificar.",
          },
          {
            term: "Seudonimizar",
            def: "Reemplazar un dato identificador por un código que solo tú puedes relacionar con la persona.",
          },
        ],
        how: [
          "Reemplaza nombres por códigos o por descripciones: «Estudiante A».",
          "Quita cédulas, teléfonos, direcciones y correos.",
          "Guarda aparte la tabla que relaciona cada código con la persona.",
        ],
        example:
          "«Estudiante 1 (grado 9) faltó tres veces en octubre» sirve para analizar la asistencia sin revelar quién es.",
        mistake:
          "Cambiar solo el nombre y dejar la dirección, el colegio o una descripción que identifica a la persona.",
      },
      {
        title: "3. Minimización: solo lo necesario",
        explain: [
          "El principio de minimización dice que solo debes compartir los datos necesarios para la tarea. Si el análisis funciona con promedios, no compartas las notas de cada persona.",
          "Compartir más de lo necesario multiplica el riesgo, aunque tu intención sea buena.",
        ],
        terms: [
          {
            term: "Minimización",
            def: "Compartir solo los datos que la tarea necesita, ni uno más.",
          },
          {
            term: "Consentimiento",
            def: "Autorización libre e informada de la persona para usar sus datos con un fin concreto.",
          },
        ],
        how: [
          "Define primero qué quieres saber o producir.",
          "Elimina los campos que no ayudan a esa tarea.",
          "Revisa que lo que queda no permita identificar a nadie.",
        ],
        example:
          "Para escribir un aviso general a un curso, basta con la fecha y el lugar; no hace falta la lista de correos.",
        mistake: "Enviar la base completa «por si acaso sirve».",
      },
      {
        title: "4. Ley 1581 y qué hacer si ya lo compartiste",
        explain: [
          "En Colombia, la Ley 1581 de 2012 protege los datos personales. Exige autorización del titular para tratarlos y da protección reforzada a los datos de niñas, niños y adolescentes.",
          "Si ya compartiste un dato personal, no lo ignores: actúa. Confirma si puedes borrar la conversación, avisa a la persona afectada y a quien administra los datos, y registra lo ocurrido.",
        ],
        terms: [
          {
            term: "Ley 1581 de 2012",
            def: "Ley colombiana de protección de datos personales.",
          },
          {
            term: "Responsable del tratamiento",
            def: "Quien decide para qué y cómo se usan los datos.",
          },
        ],
        how: [
          "Identifica qué dato salió y de quién es.",
          "Borra la conversación o el archivo donde quedó, si la herramienta lo permite.",
          "Avisa a quien administra los datos y, si corresponde, a la persona afectada.",
        ],
        example:
          "Pegaste la lista de estudiantes en un chat. Borras la conversación, avisas a la coordinación y dejas constancia por escrito.",
        mistake:
          "Pensar que una conversación «privada» o de incógnito evita toda consecuencia. La decisión de qué compartir sigue siendo tuya.",
      },
    ],
    summary: [
      "Un dato personal identifica a alguien; uno sensible puede causar daño si se filtra.",
      "Anonimizar quita la identidad; seudonimizar la cambia por un código que debe guardarse aparte.",
      "Comparte solo lo necesario para la tarea: es el principio de minimización.",
      "La Ley 1581 de 2012 exige autorización y protege de forma reforzada a los menores.",
      "Si compartiste un dato personal, actúa de inmediato: borra, avisa y registra.",
    ],
    check: [
      {
        q: "¿Cuál de estos es un dato sensible?",
        options: [
          "El color favorito de un estudiante.",
          "La condición de salud de un estudiante.",
          "El nombre de la ciudad donde vive una persona famosa.",
        ],
        correct: 1,
        feedback:
          "La salud es un dato sensible: su uso indebido puede causar discriminación o daño grave.",
      },
      {
        q: "Quieres analizar la asistencia de un curso sin revelar quién es cada estudiante. ¿Qué haces?",
        options: [
          "Envío la lista completa con nombres y cédulas.",
          "Reemplazo los nombres por códigos y guardo aparte la tabla que los relaciona.",
          "Cambio solo el apellido y dejo el resto.",
        ],
        correct: 1,
        feedback:
          "La seudonimización reemplaza la identidad por un código; la tabla de correspondencia se guarda separada.",
      },
      {
        q: "Ya pegaste en un chat una lista con teléfonos de clientes. ¿Qué debes hacer?",
        options: [
          "Nada: el chat es privado y solo lo veo yo.",
          "Borrar la conversación si se puede, avisar a quien administra los datos y registrar lo ocurrido.",
          "Pedir a la IA que olvide los teléfonos y seguir.",
        ],
        correct: 1,
        feedback:
          "Actuar rápido reduce el daño: borra, avisa y deja constancia.",
      },
    ],
  },
  en: {
    badge: "Module 1 · Explanation",
    title: "The Risk Compass",
    subtitle:
      "Which data you never share with an AI, how to protect it, and what to do if you already did",
    intro:
      "Every time you paste a text into a chat, you decide what leaves your control. This lesson gives you the vocabulary to recognize personal data, anonymize it and act well if you make a mistake. The compass guides you before you share.",
    objectives: [
      "Tell personal data from sensitive data",
      "Explain what anonymizing and pseudonymizing mean",
      "Apply the minimization principle",
      "Know what to do if you already shared a piece of data",
    ],
    sections: [
      {
        title: "1. Personal data and sensitive data",
        explain: [
          "Personal data is any information that identifies a person: name, national ID, phone number, email, address, or a photo where the person can be recognized.",
          "Sensitive data is data that, if leaked, can cause discrimination or serious harm: health, beliefs, sexual orientation, biometric data, or any data about a minor.",
        ],
        terms: [
          {
            term: "Personal data",
            def: "Information that identifies a person or makes them identifiable.",
          },
          {
            term: "Sensitive data",
            def: "Personal data whose misuse can cause discrimination or serious harm.",
          },
          { term: "Data subject", def: "The person the data belongs to." },
        ],
        how: [
          "Ask yourself: does this identify someone?",
          "If yes, ask whether it is sensitive.",
          "If it is sensitive or about a minor, do not share it with an AI tool.",
        ],
        example:
          "«Ana Gómez, 14 years old, with asthma» contains personal data and sensitive data. That does not go into a chat.",
        mistake:
          "Thinking a piece of data is not personal because «it is only a name». A name next to another detail already identifies someone.",
      },
      {
        title: "2. Anonymizing and pseudonymizing",
        explain: [
          "Anonymizing means removing the data that identifies a person, so that it can no longer be identified. Pseudonymizing means replacing it with a code that only you can link to the person.",
          "Pseudonymizing lowers the risk, but the code is still personal data if someone else can undo it. Keep the code table separate from the text you share.",
        ],
        terms: [
          {
            term: "Anonymize",
            def: "To remove the data that identifies someone, so it cannot be identified again.",
          },
          {
            term: "Pseudonymize",
            def: "To replace an identifier with a code that only you can link to the person.",
          },
        ],
        how: [
          "Replace names with codes or descriptions: «Student A».",
          "Remove ID numbers, phone numbers, addresses and emails.",
          "Keep the table that links each code to the person in a separate place.",
        ],
        example:
          "«Student 1 (grade 9) missed class three times in October» lets you analyze attendance without revealing who it is.",
        mistake:
          "Changing only the name and leaving the address, the school or a description that identifies the person.",
      },
      {
        title: "3. Minimization: only what is necessary",
        explain: [
          "The minimization principle says you should share only the data the task needs. If the analysis works with averages, do not share each person's grades.",
          "Sharing more than necessary multiplies the risk, even when your intention is good.",
        ],
        terms: [
          {
            term: "Minimization",
            def: "Sharing only the data the task needs, not one piece more.",
          },
          {
            term: "Consent",
            def: "The person's free and informed permission to use their data for a specific purpose.",
          },
        ],
        how: [
          "First define what you want to know or produce.",
          "Remove the fields that do not help that task.",
          "Check that what remains cannot identify anyone.",
        ],
        example:
          "To write a general notice for a course, the date and place are enough; you do not need the email list.",
        mistake: "Sending the full database «in case it is useful».",
      },
      {
        title: "4. Colombia's Law 1581 and what to do if you already shared",
        explain: [
          "In Colombia, Law 1581 of 2012 protects personal data. It requires the data subject's authorization to process it and gives stronger protection to data about children and adolescents.",
          "If you already shared personal data, do not ignore it: act. Check whether you can delete the conversation, tell the person concerned and whoever manages the data, and keep a record of what happened.",
        ],
        terms: [
          {
            term: "Law 1581 of 2012",
            def: "Colombian law on the protection of personal data.",
          },
          {
            term: "Data controller",
            def: "Whoever decides why and how the data is used.",
          },
        ],
        how: [
          "Identify which data went out and whose it is.",
          "Delete the conversation or the file where it stayed, if the tool allows it.",
          "Tell whoever manages the data and, where appropriate, the person concerned.",
        ],
        example:
          "You pasted a list of students into a chat. You delete the conversation, tell the coordinator and keep a written record.",
        mistake:
          "Thinking a «private» or incognito conversation avoids every consequence. Deciding what to share is still your responsibility.",
      },
    ],
    summary: [
      "Personal data identifies someone; sensitive data can cause harm if leaked.",
      "Anonymizing removes identity; pseudonymizing swaps it for a code that must be kept apart.",
      "Share only what the task needs: that is the minimization principle.",
      "Law 1581 of 2012 requires authorization and gives stronger protection to minors.",
      "If you shared personal data, act at once: delete, tell and record.",
    ],
    check: [
      {
        q: "Which of these is sensitive data?",
        options: [
          "A student's favorite color.",
          "A student's health condition.",
          "The city where a famous person lives.",
        ],
        correct: 1,
        feedback:
          "Health is sensitive data: its misuse can cause discrimination or serious harm.",
      },
      {
        q: "You want to analyze a course's attendance without revealing who each student is. What do you do?",
        options: [
          "I send the full list with names and IDs.",
          "I replace the names with codes and keep the link table separately.",
          "I change only the last name and leave the rest.",
        ],
        correct: 1,
        feedback:
          "Pseudonymizing replaces identity with a code; the link table is kept separately.",
      },
      {
        q: "You already pasted a list of customer phone numbers into a chat. What should you do?",
        options: [
          "Nothing: the chat is private and only I see it.",
          "Delete the conversation if possible, tell whoever manages the data and keep a record.",
          "Ask the AI to forget the phone numbers and carry on.",
        ],
        correct: 1,
        feedback:
          "Acting fast limits the harm: delete, tell and keep a record.",
      },
    ],
  },
  pt: {
    badge: "Módulo 1 · Explicação",
    title: "A Bússola de Riscos",
    subtitle:
      "Quais dados você nunca compartilha com uma IA, como protegê-los e o que fazer se já o fez",
    intro:
      "Toda vez que você cola um texto em um chat, decide o que sai do seu controle. Esta lição dá o vocabulário para reconhecer um dado pessoal, anonimizá-lo e agir bem se errar. A bússola orienta antes de você compartilhar.",
    objectives: [
      "Distinguir dado pessoal de dado sensível",
      "Explicar o que é anonimizar e pseudonimizar",
      "Aplicar o princípio da minimização",
      "Saber o que fazer se já compartilhou um dado",
    ],
    sections: [
      {
        title: "1. Dado pessoal e dado sensível",
        explain: [
          "Dado pessoal é qualquer informação que identifica uma pessoa: nome, documento, telefone, e-mail, endereço ou uma foto em que ela pode ser reconhecida.",
          "Dado sensível é aquele que, se vazar, pode causar discriminação ou dano grave: saúde, crenças, orientação sexual, dados biométricos ou qualquer dado de um menor de idade.",
        ],
        terms: [
          {
            term: "Dado pessoal",
            def: "Informação que identifica uma pessoa ou a torna identificável.",
          },
          {
            term: "Dado sensível",
            def: "Dado pessoal cujo uso indevido pode causar discriminação ou dano grave.",
          },
          { term: "Titular", def: "A pessoa a quem o dado pertence." },
        ],
        how: [
          "Pergunte-se: isto identifica alguém?",
          "Se sim, pergunte-se se é sensível.",
          "Se for sensível ou de um menor, não compartilhe com uma ferramenta de IA.",
        ],
        example:
          "«Ana Gómez, 14 anos, com asma» contém dado pessoal e dado sensível. Isso não entra em um chat.",
        mistake:
          "Achar que um dado não é pessoal porque «é só um nome». Um nome junto de outro detalhe já identifica alguém.",
      },
      {
        title: "2. Anonimizar e pseudonimizar",
        explain: [
          "Anonimizar é retirar os dados que identificam uma pessoa, de modo que ela não possa mais ser identificada. Pseudonimizar é trocá-los por um código que só você consegue relacionar com a pessoa.",
          "A pseudonimização reduz o risco, mas o código continua sendo dado pessoal se outra pessoa puder desfazê-lo. Guarde a tabela de códigos separada do texto que você compartilha.",
        ],
        terms: [
          {
            term: "Anonimizar",
            def: "Retirar os dados que identificam alguém, de forma que não possa ser identificado de novo.",
          },
          {
            term: "Pseudonimizar",
            def: "Trocar um identificador por um código que só você relaciona com a pessoa.",
          },
        ],
        how: [
          "Troque nomes por códigos ou descrições: «Estudante A».",
          "Retire documentos, telefones, endereços e e-mails.",
          "Guarde em separado a tabela que liga cada código à pessoa.",
        ],
        example:
          "«Estudante 1 (9.º ano) faltou três vezes em outubro» permite analisar a frequência sem revelar quem é.",
        mistake:
          "Trocar só o nome e deixar o endereço, a escola ou uma descrição que identifica a pessoa.",
      },
      {
        title: "3. Minimização: só o necessário",
        explain: [
          "O princípio da minimização diz que você deve compartilhar apenas os dados que a tarefa precisa. Se a análise funciona com médias, não compartilhe as notas de cada pessoa.",
          "Compartilhar mais do que o necessário multiplica o risco, mesmo com boa intenção.",
        ],
        terms: [
          {
            term: "Minimização",
            def: "Compartilhar só os dados que a tarefa precisa, nem um a mais.",
          },
          {
            term: "Consentimento",
            def: "Autorização livre e informada da pessoa para usar os dados com uma finalidade específica.",
          },
        ],
        how: [
          "Defina primeiro o que quer saber ou produzir.",
          "Retire os campos que não ajudam nessa tarefa.",
          "Confira se o que sobra não identifica ninguém.",
        ],
        example:
          "Para escrever um aviso geral a uma turma, bastam a data e o local; não é preciso a lista de e-mails.",
        mistake: "Enviar a base inteira «para o caso de servir».",
      },
      {
        title: "4. A Lei 1581 e o que fazer se já compartilhou",
        explain: [
          "Na Colômbia, a Lei 1581 de 2012 protege os dados pessoais. Ela exige autorização do titular para tratá-los e dá proteção reforçada aos dados de crianças e adolescentes.",
          "Se você já compartilhou um dado pessoal, não ignore: aja. Veja se pode apagar a conversa, avise a pessoa afetada e quem administra os dados, e registre o que aconteceu.",
        ],
        terms: [
          {
            term: "Lei 1581 de 2012",
            def: "Lei colombiana de proteção de dados pessoais.",
          },
          {
            term: "Responsável pelo tratamento",
            def: "Quem decide para que e como os dados são usados.",
          },
        ],
        how: [
          "Identifique qual dado saiu e de quem é.",
          "Apague a conversa ou o arquivo onde ficou, se a ferramenta permitir.",
          "Avise quem administra os dados e, se for o caso, a pessoa afetada.",
        ],
        example:
          "Você colou uma lista de estudantes em um chat. Apaga a conversa, avisa a coordenação e registra por escrito.",
        mistake:
          "Achar que uma conversa «privada» ou anônima evita qualquer consequência. A decisão do que compartilhar continua sendo sua.",
      },
    ],
    summary: [
      "Dado pessoal identifica alguém; dado sensível pode causar dano se vazar.",
      "Anonimizar retira a identidade; pseudonimizar troca por um código que deve ser guardado à parte.",
      "Compartilhe só o necessário para a tarefa: é o princípio da minimização.",
      "A Lei 1581 de 2012 exige autorização e protege de forma reforçada os menores.",
      "Se compartilhou um dado pessoal, aja de imediato: apague, avise e registre.",
    ],
    check: [
      {
        q: "Qual destes é um dado sensível?",
        options: [
          "A cor favorita de um estudante.",
          "A condição de saúde de um estudante.",
          "A cidade onde mora uma pessoa famosa.",
        ],
        correct: 1,
        feedback:
          "A saúde é um dado sensível: o uso indevido pode causar discriminação ou dano grave.",
      },
      {
        q: "Você quer analisar a frequência de uma turma sem revelar quem é cada estudante. O que faz?",
        options: [
          "Envio a lista completa, com nomes e documentos.",
          "Troco os nomes por códigos e guardo em separado a tabela que os liga.",
          "Troco só o sobrenome e deixo o resto.",
        ],
        correct: 1,
        feedback:
          "A pseudonimização troca a identidade por um código; a tabela de ligação fica separada.",
      },
      {
        q: "Você já colou em um chat uma lista de telefones de clientes. O que deve fazer?",
        options: [
          "Nada: o chat é privado e só eu vejo.",
          "Apagar a conversa se possível, avisar quem administra os dados e registrar o que ocorreu.",
          "Pedir à IA que esqueça os telefones e seguir em frente.",
        ],
        correct: 1,
        feedback: "Agir rápido limita o dano: apague, avise e registre.",
      },
    ],
  },
};
