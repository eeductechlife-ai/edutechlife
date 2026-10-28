export default {
  badge: "Módulo 4 · Explicação",
  title: "O Grimório",
  subtitle:
    "Gemini Notebook: um caderno que responde com as suas fontes e mostra de onde vem cada dado",
  intro:
    "O Gemini Notebook (antes NotebookLM) responde a partir dos documentos que você envia. Aqui você vai aprender os termos necessários para usá-lo bem: fonte, citação, curadoria e alucinação, e por que o caderno não substitui a sua verificação.",
  objectives: [
    "Explicar o que é um caderno baseado em fontes",
    "Definir fonte, citação, curadoria e alucinação",
    "Conferir uma citação abrindo o trecho original",
    "Reconhecer quando uma resposta não se sustenta",
  ],
  sections: [
    {
      title: "1. O que é um caderno baseado em fontes",
      explain: [
        "Um chat geral responde com o que aprendeu no treinamento. Um caderno baseado em fontes responde com os documentos que você envia: anotações, artigos, relatórios.",
        "Por isso ele pode citar de onde vem cada afirmação. A citação não garante que a resposta seja verdadeira; garante que você pode ir conferir.",
      ],
      terms: [
        {
          term: "Caderno",
          def: "Espaço de trabalho com um conjunto de fontes e um chat para perguntar sobre elas.",
        },
        {
          term: "Fonte",
          def: "Documento que você envia ao caderno, com autor e data quando os tem.",
        },
        {
          term: "IA baseada em fontes",
          def: "Sistema que apoia a resposta nos textos que você deu, não só no que lembra.",
        },
      ],
      how: [
        "Você envia as suas fontes ao caderno.",
        "Faz uma pergunta concreta sobre elas.",
        "A resposta mostra números de citação que levam ao trecho do documento.",
      ],
      example:
        "Você envia três artigos sobre energia solar e pergunta «qual custo inicial mencionam?». Cada número vem com uma citação para o artigo.",
      mistake:
        "Achar que, por ter citações, a resposta já está correta. É preciso abrir a citação e ler o trecho original.",
    },
    {
      title: "2. Fontes e curadoria",
      explain: [
        "Curar é escolher com critério o que entra no caderno. Mais fontes não significam melhor resposta: um caderno cheio de documentos desorganizados ou duvidosos responde pior.",
        "Uma fonte confiável tem autor identificável, data e referências que você pode conferir. As fontes primárias são o documento original; as secundárias comentam ou resumem.",
      ],
      terms: [
        {
          term: "Curadoria",
          def: "Escolher, revisar e organizar as fontes antes de sintetizá-las.",
        },
        {
          term: "Fonte primária",
          def: "O documento original: um estudo, uma norma, um dado oficial.",
        },
        {
          term: "Fonte secundária",
          def: "Um texto que comenta ou resume uma fonte primária.",
        },
      ],
      how: [
        "Reúna poucas fontes do mesmo tema.",
        "Confira autor, data e referências de cada uma.",
        "Agrupe as fontes por subtema para perguntar com mais precisão.",
      ],
      example:
        "Para um trabalho de saúde, você prefere o relatório de um ministério, com data e autor, a um blog sem assinatura.",
      mistake:
        "Enviar tudo o que encontra. Um caderno cheio de ruído responde de forma genérica ou mistura contradições.",
    },
    {
      title: "3. Citação e verificação",
      explain: [
        "Uma citação é a referência que liga uma afirmação ao trecho exato da fonte de onde ela vem. Verificar é abrir esse trecho e confirmar que ele diz o que a resposta afirma.",
        "Se a citação não existir, ou o trecho disser outra coisa, a afirmação não está respaldada.",
      ],
      terms: [
        {
          term: "Citação",
          def: "Número ou referência que leva ao trecho da fonte de onde sai uma afirmação.",
        },
        {
          term: "Conferir",
          def: "Verificar que o trecho citado diz o que a resposta afirma.",
        },
      ],
      how: [
        "Toque no número da citação.",
        "Leia o trecho no documento original.",
        "Confirme que coincidem. Se não coincidirem, não use a afirmação.",
      ],
      example:
        "A resposta diz «30 % dos domicílios…». Ao abrir a citação, o documento diz «3 %». Esse dado é corrigido ou descartado.",
      mistake: "Copiar um número só porque tem citação, sem abri-la.",
    },
    {
      title: "4. Alucinação e limites",
      explain: [
        "Uma alucinação é uma resposta que soa segura, mas não está respaldada pela fonte: um número inventado, uma citação que não existe ou uma conclusão que ninguém escreveu.",
        "Reduzir o risco ajuda, mas não o elimina. Por isso o caderno não substitui a sua leitura nem o seu critério.",
      ],
      terms: [
        {
          term: "Alucinação",
          def: "Dado ou afirmação que a IA produz com segurança e que não está nas suas fontes.",
        },
        {
          term: "Síntese",
          def: "Resumo que une ideias de várias fontes em uma conclusão própria.",
        },
      ],
      how: [
        "Se uma afirmação não tem citação, trate-a como hipótese.",
        "Se a citação disser outra coisa, descarte a afirmação.",
        "Escreva a conclusão com as suas palavras e cite as suas fontes.",
      ],
      example:
        "Você pede «um resumo dos três artigos» e aparece um quarto autor que você não enviou. Isso é uma alucinação: descarte e revise o caderno.",
      mistake:
        "Pedir dados que não estão nas suas fontes e usá-los porque «a IA os encontrou».",
    },
  ],
  summary: [
    "Um caderno baseado em fontes responde com os documentos que você envia.",
    "Curar é escolher poucas fontes confiáveis, do mesmo tema, com autor e data.",
    "Uma citação leva ao trecho original: abra-a e confirme que diz o mesmo.",
    "Uma alucinação é uma afirmação segura sem respaldo nas suas fontes.",
    "O caderno ajuda a estudar, mas a conclusão e a verificação são suas.",
  ],
  check: [
    {
      q: "O que torna uma resposta do caderno verificável?",
      options: [
        "Ser longa e bem escrita.",
        "Ter uma citação que você pode abrir e conferir.",
        "A IA dizer que está segura.",
      ],
      correct: 1,
      feedback:
        "A citação leva ao trecho original; abri-la é o que permite conferir o dado.",
    },
    {
      q: "Um número da resposta não aparece em nenhuma das suas fontes. O que você faz?",
      options: [
        "Uso, porque parece confiável.",
        "Descarto ou confirmo em uma fonte original antes de usar.",
        "Peço que arredonde para parecer mais preciso.",
      ],
      correct: 1,
      feedback:
        "Um dado que não está nas suas fontes não é verificável: não use até confirmar.",
    },
    {
      q: "O que é uma fonte primária?",
      options: [
        "Um documento que comenta outro documento.",
        "O documento original, como um estudo ou um dado oficial.",
        "A fonte que aparece primeiro na busca.",
      ],
      correct: 1,
      feedback:
        "A fonte primária é o documento original; as secundárias comentam ou resumem.",
    },
  ],
};
