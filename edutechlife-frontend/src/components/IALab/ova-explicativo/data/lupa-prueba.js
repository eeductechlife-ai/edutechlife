// OVA «La Lupa a Prueba» (ILAB-M3-OVA4). Multimodal: qué es, por qué verificar con la salida original, fuente primaria y marca de tiempo.
export default {
  es: {
    badge: "Módulo 3 · Explicación",
    title: "La Lupa a Prueba",
    subtitle:
      "Qué significa multimodal, cómo leer una imagen o un audio con criterio y cuándo confiar en lo que la IA vio",
    intro:
      "Gemini puede mirar una imagen, escuchar un audio o leer un PDF en la misma conversación. Eso es ser multimodal. Pero ver mucho no significa ver bien: aquí aprenderás el vocabulario para usar esa lupa con criterio y para comprobar lo que dice.",
    objectives: [
      "Explicar qué significa multimodal con un ejemplo",
      "Usar la marca de tiempo para ubicar un dato en un audio o video",
      "Comprobar un dato contra la fuente original",
      "Reconocer cuándo la lectura de la IA no es confiable",
    ],
    sections: [
      {
        title: "1. Qué significa multimodal",
        explain: [
          "Multimodal significa que el modelo procesa varios tipos de contenido a la vez: texto, imágenes, audio, video o documentos. No cambia de herramienta: lee lo que le muestras en la misma conversación.",
          "Puede ser muy útil, pero también puede equivocarse al leer letras pequeñas, números borrosos o voces en mal audio.",
        ],
        terms: [
          {
            term: "Multimodal",
            def: "Capaz de procesar varios tipos de contenido, como texto, imagen, audio y video, a la vez.",
          },
          {
            term: "Entrada",
            def: "Lo que le muestras al modelo: una foto, un PDF, un audio.",
          },
        ],
        how: [
          "Subes la imagen, el audio o el PDF.",
          "Haces una pregunta concreta sobre ese contenido.",
          "Compruebas la respuesta contra el original.",
        ],
        example:
          "Subes la foto de una factura y preguntas el total. La IA lo lee, pero si la foto está borrosa, el total puede estar mal.",
        mistake:
          "Creer que, porque la IA «vio» la imagen, leyó todo bien. Ver no es leer sin errores.",
      },
      {
        title: "2. Marca de tiempo y lugar del dato",
        explain: [
          "En un audio o un video, una marca de tiempo indica el momento exacto en que se dice o se muestra algo. Pedir la marca permite ir directamente a ese fragmento y verificarlo.",
          "Una respuesta sin marca de tiempo es difícil de comprobar en una grabación larga.",
        ],
        terms: [
          {
            term: "Marca de tiempo",
            def: "Momento exacto de un audio o video, por ejemplo 12:34.",
          },
          {
            term: "Transcripción",
            def: "Texto que se obtiene de un audio; puede tener errores al escuchar.",
          },
        ],
        how: [
          "Pide el momento exacto donde aparece el dato.",
          "Ve a esa marca en la grabación original.",
          "Confirma que se dijo o se mostró lo que la respuesta afirma.",
        ],
        example:
          "«¿Cuándo se acuerda la fecha de entrega?» → «a los 12:40». Vas a ese minuto y confirmas.",
        mistake:
          "Confiar en una transcripción de un audio con ruido sin escuchar los segundos dudosos.",
      },
      {
        title: "3. Comprobar con la fuente original",
        explain: [
          "La salida de la IA es una lectura, no el original. Para un dato importante, vuelve siempre al documento, la imagen o la grabación original.",
          "Fuente primaria: el original del que sale el dato. Si la IA lee una cifra de una captura de pantalla, la fuente primaria es la página o el documento de donde se tomó la captura.",
        ],
        terms: [
          {
            term: "Fuente primaria",
            def: "El original del que sale el dato: documento, grabación o registro oficial.",
          },
          {
            term: "Verificar",
            def: "Comprobar que el original dice lo que la respuesta afirma.",
          },
        ],
        how: [
          "Identifica de dónde salió el dato.",
          "Abre el original y busca el mismo dato.",
          "Si no coincide, corrige o descarta.",
        ],
        example:
          "La IA lee «3.200» de una captura. Abres la página original y el número dice «3.800»: se corrige.",
        mistake:
          "Usar la captura como si fuera la fuente, cuando la fuente es el documento original.",
      },
      {
        title: "4. Cuándo desconfiar",
        explain: [
          "Desconfía cuando la imagen está borrosa, el audio tiene ruido, el texto es muy pequeño, o la respuesta suena muy segura sobre algo poco visible.",
          "Pide siempre que la IA indique qué no puede leer o escuchar. Una buena respuesta dice lo que no está claro.",
        ],
        terms: [
          {
            term: "Lectura dudosa",
            def: "Dato que no se distingue bien en el original: borroso, bajo, cortado.",
          },
          {
            term: "Incertidumbre",
            def: "Lo que la respuesta reconoce que no puede confirmar.",
          },
        ],
        how: [
          "Pregunta qué no se puede leer o escuchar con claridad.",
          "Trata los datos dudosos como hipótesis.",
          "Confírmalos en el original antes de usarlos.",
        ],
        example:
          "«El número parece ser 5, pero la imagen está cortada» es una respuesta confiable: dice lo que no sabe.",
        mistake:
          "Aceptar una cifra exacta de una imagen borrosa porque la IA la dio con seguridad.",
      },
    ],
    summary: [
      "Multimodal significa procesar texto, imagen, audio, video y documentos en una misma conversación.",
      "La marca de tiempo te lleva al momento exacto de un audio o video para verificarlo.",
      "La salida de la IA es una lectura: compárala siempre con la fuente primaria.",
      "Desconfía de imágenes borrosas, audios con ruido y datos exactos de algo poco visible.",
      "Una buena respuesta dice lo que no puede confirmar.",
    ],
    check: [
      {
        q: "¿Qué significa que Gemini sea multimodal?",
        options: [
          "Que solo lee texto, pero muy rápido.",
          "Que procesa texto, imágenes, audio y documentos en la misma conversación.",
          "Que necesita varias cuentas para funcionar.",
        ],
        correct: 1,
        feedback:
          "Multimodal significa procesar varios tipos de contenido a la vez, en la misma conversación.",
      },
      {
        q: "Un dato de un audio: ¿qué pides para comprobarlo?",
        options: [
          "Que lo repita más alto.",
          "La marca de tiempo exacta donde se dice, para ir a ese fragmento.",
          "Que lo escriba en mayúsculas.",
        ],
        correct: 1,
        feedback:
          "La marca de tiempo te lleva al momento exacto de la grabación para verificar el dato.",
      },
      {
        q: "La IA lee una cifra de una foto borrosa y la da con mucha seguridad. ¿Qué haces?",
        options: [
          "La uso, porque la IA la leyó.",
          "La confirmo en el original antes de usarla.",
          "Le pido que la redondee.",
        ],
        correct: 1,
        feedback:
          "Una cifra de una imagen borrosa no es confiable hasta confirmarla en la fuente original.",
      },
    ],
  },
  en: {
    badge: "Module 3 · Explanation",
    title: "Testing the Magnifying Glass",
    subtitle:
      "What multimodal means, how to read an image or audio with judgement, and when to trust what the AI saw",
    intro:
      "Gemini can look at an image, listen to audio or read a PDF in the same conversation. That is what multimodal means. But seeing a lot does not mean seeing well: here you will learn the vocabulary to use that lens with judgement and to check what it says.",
    objectives: [
      "Explain what multimodal means with an example",
      "Use the timestamp to locate a fact in audio or video",
      "Check a fact against the original source",
      "Recognize when the AI's reading is not reliable",
    ],
    sections: [
      {
        title: "1. What multimodal means",
        explain: [
          "Multimodal means the model processes several kinds of content at once: text, images, audio, video or documents. It does not switch tools: it reads what you show it in the same conversation.",
          "It can be very useful, but it can also make mistakes reading small print, blurry numbers or audio with noise.",
        ],
        terms: [
          {
            term: "Multimodal",
            def: "Able to process several kinds of content, such as text, image, audio and video, at once.",
          },
          {
            term: "Input",
            def: "What you show the model: a photo, a PDF, an audio file.",
          },
        ],
        how: [
          "You upload the image, audio or PDF.",
          "You ask a specific question about that content.",
          "You check the answer against the original.",
        ],
        example:
          "You upload a photo of an invoice and ask for the total. The AI reads it, but if the photo is blurry, the total may be wrong.",
        mistake:
          "Believing that, because the AI «saw» the image, it read everything correctly. Seeing is not reading without errors.",
      },
      {
        title: "2. Timestamp and where the fact is",
        explain: [
          "In audio or video, a timestamp shows the exact moment when something is said or shown. Asking for it lets you go straight to that fragment and check it.",
          "An answer with no timestamp is hard to check in a long recording.",
        ],
        terms: [
          {
            term: "Timestamp",
            def: "The exact moment in an audio or video, for example 12:34.",
          },
          {
            term: "Transcript",
            def: "Text obtained from audio; it can contain listening errors.",
          },
        ],
        how: [
          "Ask for the exact moment where the fact appears.",
          "Go to that point in the original recording.",
          "Confirm that what the answer claims was said or shown.",
        ],
        example:
          "«When is the deadline mentioned?» → «at 12:40». You go to that minute and confirm.",
        mistake:
          "Trusting a transcript of noisy audio without listening to the doubtful seconds.",
      },
      {
        title: "3. Checking against the original source",
        explain: [
          "The AI's output is a reading, not the original. For an important fact, always go back to the original document, image or recording.",
          "Primary source: the original where the fact comes from. If the AI reads a figure from a screenshot, the primary source is the page or document the screenshot was taken from.",
        ],
        terms: [
          {
            term: "Primary source",
            def: "The original the fact comes from: document, recording or official record.",
          },
          {
            term: "Verify",
            def: "To check that the original says what the answer claims.",
          },
        ],
        how: [
          "Identify where the fact came from.",
          "Open the original and look for the same fact.",
          "If it does not match, correct or discard it.",
        ],
        example:
          "The AI reads «3,200» from a screenshot. You open the original page and it says «3,800»: you correct it.",
        mistake:
          "Using the screenshot as if it were the source, when the source is the original document.",
      },
      {
        title: "4. When to be suspicious",
        explain: [
          "Be suspicious when the image is blurry, the audio has noise, the text is very small, or the answer sounds very sure about something barely visible.",
          "Always ask the AI what it cannot read or hear clearly. A good answer says what is unclear.",
        ],
        terms: [
          {
            term: "Doubtful reading",
            def: "A fact that is not clear in the original: blurry, faint, cut off.",
          },
          {
            term: "Uncertainty",
            def: "What the answer admits it cannot confirm.",
          },
        ],
        how: [
          "Ask what cannot be read or heard clearly.",
          "Treat doubtful facts as hypotheses.",
          "Confirm them in the original before using them.",
        ],
        example:
          "«The number seems to be 5, but the image is cut off» is a reliable answer: it says what it does not know.",
        mistake:
          "Accepting an exact figure from a blurry image because the AI gave it confidently.",
      },
    ],
    summary: [
      "Multimodal means processing text, image, audio, video and documents in one conversation.",
      "A timestamp takes you to the exact moment of an audio or video so you can verify it.",
      "The AI's output is a reading: always compare it with the primary source.",
      "Be suspicious of blurry images, noisy audio and exact figures from barely visible content.",
      "A good answer says what it cannot confirm.",
    ],
    check: [
      {
        q: "What does it mean that Gemini is multimodal?",
        options: [
          "That it only reads text, but very fast.",
          "That it processes text, images, audio and documents in the same conversation.",
          "That it needs several accounts to work.",
        ],
        correct: 1,
        feedback:
          "Multimodal means processing several kinds of content at once, in the same conversation.",
      },
      {
        q: "A fact comes from audio. What do you ask for to check it?",
        options: [
          "That it repeats it louder.",
          "The exact timestamp where it is said, to go to that fragment.",
          "That it writes it in capital letters.",
        ],
        correct: 1,
        feedback:
          "The timestamp takes you to the exact moment of the recording to verify the fact.",
      },
      {
        q: "The AI reads a figure from a blurry photo and gives it with great confidence. What do you do?",
        options: [
          "I use it, because the AI read it.",
          "I confirm it in the original before using it.",
          "I ask it to round it.",
        ],
        correct: 1,
        feedback:
          "A figure from a blurry image is not reliable until it is confirmed in the original source.",
      },
    ],
  },
  pt: {
    badge: "Módulo 3 · Explicação",
    title: "A Lupa à Prova",
    subtitle:
      "O que significa multimodal, como ler uma imagem ou um áudio com critério e quando confiar no que a IA viu",
    intro:
      "O Gemini pode olhar uma imagem, ouvir um áudio ou ler um PDF na mesma conversa. Isso é ser multimodal. Mas ver muito não significa ver bem: aqui você vai aprender o vocabulário para usar essa lupa com critério e conferir o que ela diz.",
    objectives: [
      "Explicar o que é multimodal com um exemplo",
      "Usar a marca de tempo para localizar um dado em áudio ou vídeo",
      "Conferir um dado com a fonte original",
      "Reconhecer quando a leitura da IA não é confiável",
    ],
    sections: [
      {
        title: "1. O que significa multimodal",
        explain: [
          "Multimodal significa que o modelo processa vários tipos de conteúdo ao mesmo tempo: texto, imagens, áudio, vídeo ou documentos. Ele não troca de ferramenta: lê o que você mostra na mesma conversa.",
          "Pode ser muito útil, mas também pode errar ao ler letras pequenas, números borrados ou áudio com ruído.",
        ],
        terms: [
          {
            term: "Multimodal",
            def: "Capaz de processar vários tipos de conteúdo, como texto, imagem, áudio e vídeo, ao mesmo tempo.",
          },
          {
            term: "Entrada",
            def: "O que você mostra ao modelo: uma foto, um PDF, um arquivo de áudio.",
          },
        ],
        how: [
          "Você envia a imagem, o áudio ou o PDF.",
          "Faz uma pergunta específica sobre esse conteúdo.",
          "Confere a resposta com o original.",
        ],
        example:
          "Você envia a foto de uma nota fiscal e pergunta o total. A IA lê, mas se a foto estiver borrada, o total pode estar errado.",
        mistake:
          "Achar que, porque a IA «viu» a imagem, leu tudo certo. Ver não é ler sem erros.",
      },
      {
        title: "2. Marca de tempo e onde está o dado",
        explain: [
          "Em um áudio ou vídeo, a marca de tempo indica o momento exato em que algo é dito ou mostrado. Pedir a marca permite ir direto a esse trecho e conferi-lo.",
          "Uma resposta sem marca de tempo é difícil de conferir em uma gravação longa.",
        ],
        terms: [
          {
            term: "Marca de tempo",
            def: "Momento exato de um áudio ou vídeo, por exemplo 12:34.",
          },
          {
            term: "Transcrição",
            def: "Texto obtido de um áudio; pode ter erros de escuta.",
          },
        ],
        how: [
          "Peça o momento exato em que o dado aparece.",
          "Vá a esse ponto na gravação original.",
          "Confirme que foi dito ou mostrado o que a resposta afirma.",
        ],
        example:
          "«Quando aparece o prazo de entrega?» → «aos 12:40». Você vai àquele minuto e confirma.",
        mistake:
          "Confiar na transcrição de um áudio com ruído sem ouvir os trechos duvidosos.",
      },
      {
        title: "3. Conferir com a fonte original",
        explain: [
          "A saída da IA é uma leitura, não o original. Para um dado importante, volte sempre ao documento, à imagem ou à gravação originais.",
          "Fonte primária: o original de onde sai o dado. Se a IA lê um número de uma captura de tela, a fonte primária é a página ou o documento de onde a captura foi feita.",
        ],
        terms: [
          {
            term: "Fonte primária",
            def: "O original de onde sai o dado: documento, gravação ou registro oficial.",
          },
          {
            term: "Conferir",
            def: "Verificar se o original diz o que a resposta afirma.",
          },
        ],
        how: [
          "Identifique de onde saiu o dado.",
          "Abra o original e procure o mesmo dado.",
          "Se não coincidir, corrija ou descarte.",
        ],
        example:
          "A IA lê «3.200» de uma captura. Você abre a página original e diz «3.800»: corrige.",
        mistake:
          "Usar a captura como se fosse a fonte, quando a fonte é o documento original.",
      },
      {
        title: "4. Quando desconfiar",
        explain: [
          "Desconfie quando a imagem estiver borrada, o áudio tiver ruído, o texto for muito pequeno, ou a resposta soar muito segura sobre algo pouco visível.",
          "Peça sempre que a IA indique o que não consegue ler ou ouvir com clareza. Uma boa resposta diz o que não está claro.",
        ],
        terms: [
          {
            term: "Leitura duvidosa",
            def: "Dado que não se distingue bem no original: borrado, fraco, cortado.",
          },
          {
            term: "Incerteza",
            def: "O que a resposta admite não conseguir confirmar.",
          },
        ],
        how: [
          "Pergunte o que não pode ser lido ou ouvido com clareza.",
          "Trate os dados duvidosos como hipóteses.",
          "Confirme-os no original antes de usar.",
        ],
        example:
          "«O número parece ser 5, mas a imagem está cortada» é uma resposta confiável: diz o que não sabe.",
        mistake:
          "Aceitar um número exato de uma imagem borrada porque a IA o deu com confiança.",
      },
    ],
    summary: [
      "Multimodal significa processar texto, imagem, áudio, vídeo e documentos em uma mesma conversa.",
      "A marca de tempo leva ao momento exato de um áudio ou vídeo para conferir.",
      "A saída da IA é uma leitura: compare sempre com a fonte primária.",
      "Desconfie de imagens borradas, áudio com ruído e números exatos de algo pouco visível.",
      "Uma boa resposta diz o que não consegue confirmar.",
    ],
    check: [
      {
        q: "O que significa que o Gemini seja multimodal?",
        options: [
          "Que só lê texto, mas muito rápido.",
          "Que processa texto, imagens, áudio e documentos na mesma conversa.",
          "Que precisa de várias contas para funcionar.",
        ],
        correct: 1,
        feedback:
          "Multimodal significa processar vários tipos de conteúdo ao mesmo tempo, na mesma conversa.",
      },
      {
        q: "Um dado vem de um áudio. O que você pede para conferir?",
        options: [
          "Que repita mais alto.",
          "A marca de tempo exata em que é dito, para ir a esse trecho.",
          "Que escreva em letras maiúsculas.",
        ],
        correct: 1,
        feedback:
          "A marca de tempo leva ao momento exato da gravação para conferir o dado.",
      },
      {
        q: "A IA lê um número de uma foto borrada e o dá com muita segurança. O que você faz?",
        options: [
          "Uso, porque a IA leu.",
          "Confirmo no original antes de usar.",
          "Peço que arredonde.",
        ],
        correct: 1,
        feedback:
          "Um número de uma imagem borrada não é confiável até ser confirmado na fonte original.",
      },
    ],
  },
};
