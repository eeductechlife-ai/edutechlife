export default {
  badge: "Módulo 1 · Explicação",
  title: "O Cinzel",
  subtitle:
    "O que é um prompt, como ele se monta e por que a IA responde melhor a uma instrução clara",
  intro:
    "O prompt é a instrução que você escreve para a IA. Como o cinzel do artesão, ele dá forma ao resultado: quanto mais preciso o golpe, melhor a peça. Aqui você vai aprender as partes de um prompt e como a IA interpreta o que você escreve.",
  objectives: [
    "Definir o que é um prompt e para que serve",
    "Identificar as partes: papel, tarefa, formato, contexto e restrições",
    "Explicar o que é um token e a janela de contexto",
    "Corrigir um prompt vago passo a passo",
  ],
  sections: [
    {
      title: "1. O que é um prompt",
      explain: [
        "Um prompt é tudo o que você escreve para pedir algo à IA: uma pergunta, uma ordem, um texto de exemplo ou uma mistura disso.",
        "A IA não lê a sua intenção: lê as suas palavras. O que você não escreve, ela não sabe. Por isso um bom prompt diz com clareza o que você quer.",
      ],
      terms: [
        {
          term: "Prompt",
          def: "A instrução ou pergunta que você escreve para obter uma resposta da IA.",
        },
        {
          term: "Resposta",
          def: "O que a IA gera a partir do seu prompt; pode variar mesmo se você repetir a pergunta.",
        },
      ],
      how: [
        "Você escreve o seu pedido.",
        "A IA o interpreta com as palavras que você usou.",
        "Ela gera uma resposta. Se não servir, você ajusta o prompt e repete.",
      ],
      example:
        "«Escreva algo sobre a água» dá uma resposta geral. «Explique a crianças de 10 anos por que a água evapora, em cinco frases» dá uma resposta útil.",
      mistake:
        "Achar que a IA conhece o contexto que está na sua cabeça. Se você não escreve, ele não existe para ela.",
    },
    {
      title: "2. As cinco partes de um prompt",
      explain: [
        "Um prompt completo costuma ter cinco partes. Nem todas são obrigatórias, mas quanto mais você incluir, menos a IA precisa supor.",
        "Papel: o que ela deve ser. Tarefa: a ação concreta. Formato: como a resposta deve aparecer. Contexto: para quem e para quê. Restrições: o que ela não deve fazer.",
      ],
      terms: [
        {
          term: "Papel",
          def: "O papel que a IA assume, por exemplo «professor do fundamental» ou «editor».",
        },
        {
          term: "Tarefa",
          def: "A ação concreta: resumir, comparar, redigir, explicar.",
        },
        {
          term: "Formato",
          def: "A forma da resposta: lista, tabela, três parágrafos, extensão máxima.",
        },
        {
          term: "Contexto",
          def: "Informações sobre a situação: público, finalidade, dados que ela pode usar.",
        },
        {
          term: "Restrição",
          def: "Um limite: o que não deve incluir ou fazer.",
        },
      ],
      how: [
        "Comece pela tarefa: o que você quer que ela faça.",
        "Acrescente o contexto: para quem é.",
        "Defina o formato e as restrições.",
        "Se quiser um tom ou um ponto de vista, acrescente o papel.",
      ],
      example:
        "«Aja como editor escolar. Resuma este texto para pais em três parágrafos, sem jargão e sem nomes de estudantes.» Tem papel, tarefa, contexto, formato e restrição.",
      mistake:
        "Escrever só a tarefa, sem contexto nem formato, e depois reclamar que a resposta é genérica.",
    },
    {
      title: "3. Como a IA lê o seu prompt",
      explain: [
        "A IA processa o texto em tokens, fragmentos de palavras. Ela trabalha com uma quantidade limitada de texto de cada vez: a janela de contexto. O que fica fora dela pode se perder.",
        "Além disso, muitas ferramentas têm alguma aleatoriedade: a mesma pergunta pode gerar respostas diferentes. Por isso convém revisar e comparar, em vez de confiar em uma única resposta.",
      ],
      terms: [
        {
          term: "Token",
          def: "Fragmento de texto que a IA processa; uma palavra pode ser um ou vários tokens.",
        },
        {
          term: "Janela de contexto",
          def: "Quantidade de texto que a IA pode considerar ao mesmo tempo.",
        },
        {
          term: "Aleatoriedade",
          def: "Variação natural das respostas mesmo com o mesmo prompt.",
        },
      ],
      how: [
        "Coloque o mais importante no início do prompt.",
        "Em conversas longas, repita as instruções-chave.",
        "Compare duas respostas antes de decidir.",
      ],
      example:
        "Se você cola dez páginas e no fim pede «use só a seção 2», a IA pode não lembrar bem da seção 2. Peça a seção pelo título.",
      mistake:
        "Achar que a resposta é sempre a mesma. Ela muda a cada tentativa e com o tamanho do texto.",
    },
    {
      title: "4. Corrigir um prompt vago",
      explain: [
        "Um prompt vago deixa muita coisa para a suposição. Corrigi-lo é acrescentar o que falta: uma tarefa clara, o público, o formato e um limite.",
        "Esse método serve para qualquer pedido: pergunte o que falta e acrescente.",
      ],
      terms: [
        {
          term: "Prompt vago",
          def: "Instrução sem tarefa clara, sem contexto ou sem formato.",
        },
        {
          term: "Iterar",
          def: "Melhorar o prompt passo a passo conforme a resposta devolve.",
        },
      ],
      how: [
        "Leia a resposta e diga o que falta.",
        "Acrescente a parte que falta ao prompt.",
        "Repita até a resposta servir para o seu fim.",
      ],
      example:
        "«Faça um plano para mim» → «Faça um plano de estudos de quatro semanas para álgebra, duas horas por dia, em tabela semanal».",
      mistake:
        "Dar muitas ordens em uma única mensagem: a IA pode cumprir só parte delas. Peça uma coisa por vez ou numere as tarefas.",
    },
  ],
  summary: [
    "Um prompt é a instrução que você escreve; a IA só sabe o que você escreve.",
    "Um prompt completo tem tarefa, papel, formato, contexto e restrições.",
    "A IA trabalha com tokens e uma janela de contexto limitada; coloque o que importa de forma clara e no início.",
    "A resposta pode variar: compare e revise antes de usar.",
    "Para corrigir um prompt vago, acrescente o que falta e repita.",
  ],
  check: [
    {
      q: "Quais são as cinco partes de um prompt completo?",
      options: [
        "Papel, tarefa, formato, contexto e restrições.",
        "Título, data, autor, preço e e-mail.",
        "Início, meio, fim, assinatura e número de página.",
      ],
      correct: 0,
      feedback:
        "Papel, tarefa, formato, contexto e restrições são as peças que deixam a resposta precisa.",
    },
    {
      q: "O que é a janela de contexto?",
      options: [
        "A tela onde a resposta aparece.",
        "A quantidade de texto que a IA pode considerar ao mesmo tempo.",
        "O tempo que a IA leva para responder.",
      ],
      correct: 1,
      feedback:
        "A janela de contexto é o limite de texto que a IA processa de uma vez; o que fica fora pode se perder.",
    },
    {
      q: "Seu prompt diz apenas «faça um resumo». Como melhorá-lo?",
      options: [
        "Deixar assim, a IA sabe o que fazer.",
        "Acrescentar para quem é, a extensão e o formato que você precisa.",
        "Repetir três vezes seguidas.",
      ],
      correct: 1,
      feedback:
        "Acrescentar público, extensão e formato dá à IA o que falta para acertar.",
    },
  ],
};
