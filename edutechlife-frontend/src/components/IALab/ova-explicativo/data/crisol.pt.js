export default {
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
};
