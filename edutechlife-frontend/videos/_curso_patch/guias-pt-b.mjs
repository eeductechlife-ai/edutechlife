// Versões em português (Brasil) das guias dos Módulos 2 (ChatGPT) e 3 (Gemini).
// Nomes de modelos ficam genéricos: versões e limites mudam, então o leitor é direcionado ao seletor da conta.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const PT_M2_CHATGPT = {
  lang: "pt",
  chip: "Módulo 2 · ChatGPT",
  module: 2,
  title: "Guia Completo do ChatGPT",
  subtitle: "Da planta à obra: ferramentas, Projetos, GPTs e agentes para trabalhar com critério",
  edition: "Edição 2026",
  art: "/ialab-resources/modulo2/portada-chatgpt.jpg",
  lead: "O ChatGPT não é um buscador nem uma enciclopédia. É um colaborador que escreve, analisa e executa tarefas quando você dá <strong>contexto</strong>, um <strong>objetivo</strong> e <strong>revisão</strong>. Este guia reúne o que você precisa para usá-lo como um profissional.",
  kpis: [["6", "elementos de um prompt forte"], ["3", "passos para verificar antes de usar"], ["8", "ferramentas do ecossistema"]],
  sections: [
    {
      h: "O mapa do ecossistema",
      html: `<p>Cada ferramenta resolve um tipo diferente de trabalho. Escolher a certa economiza tempo e reduz erros.</p>
${table(["Ferramenta", "Para que serve", "Quando usar"], [
  ["<b>Chat</b>", "Pensar, escrever, resumir e explicar", "Quase sempre é o ponto de partida"],
  ["<b>Busca na web</b>", "Dados recentes com fontes", "Números, preços, notícias, regras atuais"],
  ["<b>Análise de dados</b>", "Processar CSV, Excel e tabelas; criar gráficos", "Quando há números para conferir"],
  ["<b>Geração de imagens</b>", "Ilustrações e peças visuais", "Ideias visuais; o texto dentro das imagens é escrito à parte"],
  ["<b>Canvas</b>", "Editar um documento ou código lado a lado com a conversa", "Textos longos que mudam com o tempo"],
  ["<b>Projetos</b>", "Agrupar instruções e arquivos de um mesmo trabalho", "Quando o mesmo contexto se repete"],
  ["<b>GPTs</b>", "Assistentes com instruções e conhecimento próprios", "Tarefas recorrentes com as mesmas regras"],
  ["<b>Agente</b>", "Executar tarefas de várias etapas com supervisão", "Pesquisar, comparar e montar uma entrega"],
])}`,
    },
    {
      h: "Escolher o modelo certo",
      html: `<p>O ChatGPT oferece vários modelos da família GPT-6. Nomes, limites e disponibilidade <strong>dependem do seu plano</strong> e mudam com frequência. O que permanece é a regra de decisão:</p>
${cards([
  ["Modelo rápido", "Rascunhos, resumos, e-mails, ideias, traduções e tarefas simples."],
  ["Modelo de raciocínio ou mais potente", "Análises complexas, decisões com vários fatores, documentos longos e trabalhos que exigem lógica."],
])}
${box("warn", "Antes de decidir", "<p>Abra o seletor de modelos da sua conta: o que você vê depende do seu plano. Um modelo mais potente nem sempre é melhor: ele é mais lento e usa mais recursos. Use-o quando a tarefa justificar.</p>")}`,
    },
    {
      h: "Prompts que funcionam: os seis elementos",
      html: `<p>Um prompt forte responde a seis perguntas. Nem todas são necessárias em cada caso, mas quanto mais você responde, menos o modelo precisa adivinhar.</p>
${table(["Elemento", "Pergunta que responde", "Exemplo"], [
  ["<b>Papel</b>", "Quem deve responder?", "Você é consultora de atendimento ao cliente de uma escola de idiomas em Manaus."],
  ["<b>Contexto</b>", "O que aconteceu e o que sabemos?", "Um aluno pediu reembolso depois do cancelamento de uma aula."],
  ["<b>Tarefa</b>", "O que deve produzir?", "Escreva um e-mail empático que explique a política de reembolso."],
  ["<b>Formato</b>", "Como deve parecer?", "Três parágrafos, no máximo 150 palavras, sem listas."],
  ["<b>Restrições</b>", "O que deve evitar?", "Não prometa datas nem valores que não estejam na política."],
  ["<b>Exemplos</b>", "Como é um bom resultado?", "Inclua um exemplo de tom cordial e profissional."],
])}
<h3>Uma comparação real</h3>
${box("warn", "Fraco", `<div class="prompt">Escreva um e-mail para clientes.</div>`)}
${box("tip", "Forte", `<div class="prompt">Você é consultora de atendimento ao cliente de uma escola de idiomas em Manaus.
Contexto: um aluno pediu reembolso depois do cancelamento de uma aula.
Tarefa: escreva um e-mail empático que explique a política de reembolso.
Formato: três parágrafos, no máximo 150 palavras, sem listas.
Restrições: não prometa datas nem valores que não estejam na política.</div>`)}
<p class="muted">Itere: peça mudanças pequenas («encurte o segundo parágrafo») em vez de recomeçar, e compare as versões antes de aceitar uma.</p>`,
    },
    {
      h: "Busca na web e análise de dados",
      html: `<h3>Busca na web</h3>
<p>Ative quando precisar de informações recentes. Peça sempre as fontes e abra pelo menos uma antes de usar um número. Se uma resposta não cita fontes, trate-a como uma hipótese.</p>
<h3>Análise de dados</h3>
<p>Envie seu arquivo (CSV ou Excel), faça a pergunta específica e peça o método. Confira o resultado com uma amostra pequena e peça o passo a passo ou o código usado.</p>
${box("tip", "Boa pergunta", "<p>Qual é a variação mensal de matrículas entre janeiro e setembro? Mostre a tabela, o método e um gráfico de barras, e avise se algum mês tiver dados faltando.</p>")}`,
    },
    {
      h: "Projetos: contexto que não precisa ser repetido",
      html: `<p>Um <strong>Projeto</strong> reúne instruções e arquivos de um mesmo trabalho. Todas as conversas dentro do Projeto usam esse contexto sem que você precise colá-lo de novo.</p>
${figure("/ialab-resources/modulo2/portada-chatgpt.jpg", "Um espaço para cada trabalho, com o seu próprio contexto.", "60%")}
${checks([
  "Crie um Projeto por tema, e não um único Projeto gigante para tudo.",
  "Escreva instruções claras: papel, tom, limites e o que sempre deve ser conferido.",
  "Envie só os arquivos necessários e revise o conteúdo de cada um.",
])}`,
    },
    {
      h: "GPTs personalizados: assistentes sob medida",
      html: `${box("warn", "Situação dos GPTs", "<p>A OpenAI anunciou a descontinuação dos GPTs personalizados em datas provisórias: verifique na sua conta se o seu GPT ainda está disponível e considere migrar as instruções para um Projeto.</p>")}
<p>Um GPT combina três partes: <strong>instruções</strong> (papel, tom e limites), <strong>conhecimento</strong> (arquivos de referência) e, se precisar, <strong>ações</strong> (conexões com outros serviços).</p>
${box("warn", "Antes de compartilhar um GPT", "<p>Decida quem pode usá-lo e revise quais arquivos ele contém. Nunca carregue dados pessoais de terceiros, dados de menores ou documentos confidenciais sem autorização.</p>")}
<h3>Como avaliar um GPT antes de compartilhá-lo</h3>
<p>Um GPT pode parecer bom na sua primeira conversa e falhar em um caso real. Teste-o com estes cinco casos antes de compartilhar.</p>
${table(["Teste", "O que o GPT deve fazer"], [
  ["Caso normal", "Responde bem à tarefa para a qual foi criado"],
  ["Caso limite", "Pede a informação que falta antes de responder"],
  ["Fora do escopo", "Diz com clareza que não pode ajudar e sugere a quem recorrer"],
  ["Dado sensível", "Não pede nem repete dados pessoais ou de menores"],
  ["Coerência", "Mantém o tom e as regras durante toda a conversa"],
])}`,
    },
    {
      h: "O agente: tarefas de várias etapas",
      html: `<p>O agente executa uma sequência de passos (buscar, comparar, resumir e montar uma entrega). Você continua no controle: <strong>aprova cada etapa</strong> antes de usar o resultado.</p>
${steps([
  "Defina a entrega: o que deve existir no final e em qual formato.",
  "Estabeleça os limites: fontes permitidas, escopo da busca e dados que não deve usar.",
  "Revise o plano que o agente propõe antes de ele executar.",
  "Verifique cada fonte e cada número do resultado final.",
])}`,
    },
    {
      h: "Aplicativos e conectores",
      html: `<p>O ChatGPT pode se conectar a aplicativos externos (por exemplo, de viagens, música, design ou produtividade). Cada conexão pede permissões que você deve ler antes de aprovar.</p>
${figure("/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg", "Cada conexão amplia o que o assistente pode fazer, e também a responsabilidade sobre ela.", "38%")}
${checks([
  "Conecte apenas os aplicativos que você realmente vai usar.",
  "Leia as permissões que cada um pede antes de aprová-las.",
  "Desconecte o que não usa mais. Nunca dê senhas no chat.",
])}`,
    },
    {
      h: "Verificar antes de usar",
      html: `<p>Os modelos podem errar com segurança. A verificação faz parte do trabalho, não é um passo opcional.</p>
${steps([
  "<b>Fontes:</b> cada dado tem uma fonte que você consegue abrir?",
  "<b>Números e nomes:</b> você conferiu tudo na fonte original?",
  "<b>Sentido:</b> o resultado atende ao objetivo e ao público?",
])}
${box("tip", "Regra de ouro", "<p>Se um número, uma citação ou uma norma for importante para a sua decisão, verifique-o na fonte original antes de usar.</p>")}`,
    },
    {
      h: "Dados pessoais e menores",
      html: `<p>No Brasil, o tratamento de dados pessoais é regido pela <strong>Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)</strong>. Minimize: compartilhe apenas o necessário, anonimize antes de enviar e nunca carregue dados de menores, documentos de identidade ou informações financeiras de terceiros.</p>`,
    },
    {
      h: "Exemplo prático: uma proposta comercial",
      html: `<p>Objetivo: preparar uma proposta de três páginas para a direção de uma escola. Veja o processo completo em quatro passos.</p>
${steps([
  "<b>Primeiro prompt com os seis elementos:</b> papel (consultor educacional), contexto (escola com 900 alunos em Manaus), tarefa (proposta de capacitação docente em IA), formato (três páginas, com objetivo, plano de três meses e preço), restrições (sem promessas de resultados garantidos).",
  "<b>Revise a primeira resposta:</b> ela mostra o que falta. Aqui, o preço não tem premissas e o tom está comercial demais.",
  "<b>Itere uma mudança por vez:</b> «Mantenha a estrutura. Mude o tom para institucional e explique o preço por aluno com suas premissas.»",
  "<b>Verifique antes de enviar:</b> peça fontes para os números de mercado, abra duas delas e ajuste o que não puder confirmar.",
])}
<div class="prompt">Você é um consultor educacional. Contexto: escola com 900 alunos em Manaus que quer capacitar seus professores em IA.
Tarefa: redija uma proposta de três páginas com objetivo, plano de três meses e preço por aluno.
Formato: títulos claros e uma tabela de cronograma.
Restrições: tom institucional; não prometa resultados garantidos; marque com [VERIFICAR] todo número de mercado.</div>`,
    },
    {
      h: "Plano de prática: cinco passos",
      html: `${steps([
  "Crie um Projeto para um trabalho real seu e escreva as instruções.",
  "Escreva um pedido com os seis elementos e compare com uma versão fraca.",
  "Faça uma busca com fontes e verifique duas delas.",
  "Analise uma tabela pequena e peça o método e um gráfico.",
  "Desenhe um GPT com instruções, limites e um teste com três casos reais.",
])}`,
    },
  ],
  closing: `${checks([
    "Escolhi o modelo para a tarefa e conferi o seletor do meu plano.",
    "Meus pedidos têm objetivo, contexto, formato e restrições.",
    "Verifiquei fontes e números antes de usar um resultado.",
    "Não carreguei dados pessoais ou de menores sem autorização.",
  ])}`,
};

export const PT_M3_GEMINI = {
  lang: "pt",
  chip: "Módulo 3 · Gemini",
  module: 3,
  title: "Gemini na prática",
  subtitle: "O ecossistema de IA do Google, o Deep Research e fluxos para pesquisar com fontes verificáveis",
  edition: "Edição 2026",
  art: "/ialab-resources/modulo3/portada-gemini.jpg",
  lead: "O Gemini é a família de modelos do Google para conversar, analisar e pesquisar. Sua maior vantagem é que ele <strong>funciona onde você já trabalha</strong>: Gmail, Docs, Drive e Search. Aqui você aprenderá a usá-lo para pesquisar sem que ele invente dados.",
  kpis: [["5", "produtos do ecossistema"], ["4", "etapas do Deep Research"], ["3", "fontes mínimas antes de concluir"]],
  sections: [
    {
      h: "O que é o Gemini hoje",
      html: `<p>O Gemini é desenvolvido pelo Google DeepMind e está disponível no aplicativo Gemini, na Pesquisa Google e dentro do Google Workspace. O Google atualiza seus modelos com frequência, então a versão que você usa depende da sua conta.</p>
${box("tip", "Confira sua versão", "<p>Abra o seletor de modelos da sua conta e anote qual versão você tem. Se um tutorial mencionar outra, é provável que ela já tenha mudado.</p>")}`,
    },
    {
      h: "O ecossistema que você já usa",
      html: `${table(["Produto", "O que oferece", "Exemplo de uso"], [
  ["<b>Gmail</b>", "Resumo e redação de conversas longas", "Resuma 30 e-mails de um fornecedor e liste os compromissos pendentes."],
  ["<b>Docs</b>", "Redação, reescrita e revisão de tom", "Transforme suas anotações de aula em um texto com introdução e conclusão."],
  ["<b>Drive</b>", "Busca e resumo dos seus próprios arquivos", "Encontre onde você citou um orçamento nos documentos deste ano."],
  ["<b>Sheets</b>", "Análise de tabelas e sugestão de fórmulas", "Calcule a média por turma e marque os valores fora do padrão."],
  ["<b>Search</b>", "Respostas com links para as fontes", "Compare duas normas ou preços e revise os sites que ele cita."],
])}`,
    },
    {
      h: "Deep Research: pesquisa em várias etapas",
      html: `<p>O Deep Research explora dezenas de fontes, as sintetiza e entrega um relatório. É poderoso, mas <strong>você define a pergunta e verifica o resultado</strong>.</p>
${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "O Deep Research explora fontes; você revisa o plano e o relatório.", "55%")}
${steps([
  "<b>Defina a pergunta:</b> tema, público, período e o que deve ficar de fora.",
  "<b>Revise o plano:</b> o pesquisador propõe as linhas de busca; ajuste o que sobra ou falta.",
  "<b>Leia o relatório com suas fontes:</b> abra pelo menos três fontes que sustentem as conclusões principais.",
  "<b>Peça as limitações:</b> o que ele não conseguiu verificar? Não use essa parte sem uma revisão adicional.",
])}
<h3>Exemplo prático: um relatório de mercado</h3>
<p>Exemplo: pesquisar a demanda por cursos de inteligência artificial para adultos no Brasil.</p>
<div class="prompt">Pesquise a demanda por cursos de inteligência artificial para adultos no Brasil nos últimos dois anos.
Público: diretora de uma instituição de educação continuada.
Entregue: 1) resumo executivo de cinco linhas, 2) cinco achados com fonte e data, 3) dados que se contradizem entre fontes, 4) o que você não conseguiu verificar.</div>
${box("warn", "Antes de usar o relatório", "<p>Abra três fontes que sustentem as conclusões principais. Se um número não aparecer na fonte citada, descarte-o.</p>")}`,
    },
    {
      h: "Investigar sem que invente",
      html: `<p>Um bom fluxo de pesquisa separa três coisas: <strong>fatos com fonte</strong>, <strong>interpretações</strong> e <strong>suposições</strong>. Peça essa separação explicitamente.</p>
${box("warn", "Sinais de alerta", "<ul><li>Um número sem fonte, ou com uma fonte que não o contém.</li><li>Um nome ou uma citação que você não encontra ao pesquisar.</li><li>Uma resposta que soa muito segura sobre um tema recente.</li></ul>")}`,
    },
    {
      h: "Multimodal: texto, imagens, áudio e vídeo",
      html: `<p>O Gemini pode analisar documentos, imagens, gráficos, áudios e vídeos. Use-o para extrair informações de um gráfico, transcrever uma gravação ou comparar dois documentos. Confira os limites de tamanho e formato do seu plano.</p>
${figure("/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg", "Modelos multimodais combinam texto, imagens e áudio em um mesmo fluxo.", "38%")}`,
    },
    {
      h: "Um prompt de pesquisa",
      html: `<div class="prompt">Pesquise [tema] para [público].
Busque fontes dos últimos [anos] anos de órgãos oficiais, universidades ou veículos reconhecidos.
Entregue: 1) um resumo de cinco linhas, 2) achados com sua fonte, 3) contradições entre fontes.
Cite cada afirmação com a fonte e separe fatos de interpretações.
Informe o que você não conseguiu verificar.</div>`,
    },
    {
      h: "Privacidade e permissões",
      html: `<p>Antes de conectar Gmail, Drive ou Docs, veja quais permissões ele pede e conceda apenas as necessárias. Não envie dados pessoais de terceiros, prontuários, dados de menores ou informações financeiras sem autorização. No Brasil, vale a <strong>LGPD (Lei 13.709/2018)</strong>.</p>`,
    },
    {
      h: "Erros frequentes",
      html: `${table(["Erro", "O que acontece", "Como evitar"], [
  ["Aceitar o primeiro resultado", "Dados não verificados são usados", "Abra e confira as fontes principais"],
  ["Perguntas muito amplas", "Respostas genéricas", "Restrinja tema, público e período"],
  ["Confiar no resumo e não no original", "Os detalhes se perdem", "Leia a parte do original que sustenta cada conclusão"],
  ["Enviar dados sensíveis", "Risco à privacidade", "Anonimize antes de enviar"],
])}`,
    },
    {
      h: "Exemplo prático: avaliar um relatório",
      html: `<p>Use esta rubrica para decidir se um relatório está pronto para uma decisão. Avalie cada critério como sólido, parcial ou insuficiente.</p>
${table(["Critério", "Sólido", "Parcial", "Insuficiente"], [
  ["Fontes", "Cada achado tem fonte e data verificáveis", "Algumas fontes sem data", "Afirmações sem fonte"],
  ["Precisão", "Os números coincidem com a fonte original", "Números arredondados sem explicação", "Números que não aparecem na fonte"],
  ["Nuances", "Aponta contradições e condições", "Apresenta só uma versão", "Apresenta a conclusão como definitiva"],
  ["Limitações", "Declara o que não conseguiu verificar", "Menciona limites de forma geral", "Não declara limites"],
])}`,
    },
    {
      h: "Exercícios de campo",
      html: `${steps([
  "<b>Mapa local:</b> pesquise três concorrentes da sua cidade com fontes públicas. Entregue uma tabela com preço, proposta e fonte.",
  "<b>Verificação:</b> pegue uma notícia que chegou pelo WhatsApp e verifique-a com a Pesquisa. Anote quais fontes a confirmam ou desmentem.",
  "<b>Relatório com Deep Research:</b> pesquise um tema da sua área, verifique três fontes e reescreva o relatório com as suas palavras.",
])}`,
    },
  ],
  closing: `${checks([
    "Defino a pergunta, o público e o escopo antes de pesquisar.",
    "Verifico pelo menos três fontes antes de usar uma conclusão.",
    "Separo fatos, interpretações e suposições.",
    "Confiro as permissões e não compartilho dados sensíveis de terceiros.",
  ])}`,
};

export const PT_M3_PRATICA = {
  lang: "pt",
  chip: "Módulo 3 · Prática",
  module: 3,
  title: "Gemini na prática: exercícios de campo",
  subtitle: "Modelos, exercícios de campo e tabelas de evidências para pesquisar com fontes",
  edition: "Modelos 2026",
  art: null,
  lead: "Pesquisar bem é conferir. Estes modelos levam o Gemini a casos reais, pedem fontes em cada resposta e deixam um registro do que você verificou.",
  kpis: [["4", "exercícios de campo"], ["5", "colunas na tabela de evidências"], ["3", "fontes antes de concluir"]],
  sections: [
    {
      h: "Antes de começar",
      html: `<p>O Gemini muda com frequência. Antes de cada exercício, confira qual modelo sua conta oferece e quais recursos seu plano inclui. Anote a data da sua pesquisa: uma fonte de dois anos atrás pode já não valer.</p>`,
    },
    {
      h: "Exercício 1: mapa local de concorrentes",
      html: `<p>Identifique três concorrentes na sua cidade ou setor e compare-os com fontes públicas.</p>
<div class="prompt">Pesquise os três principais prestadores de [serviço] em [cidade].
Para cada um, entregue: proposta de valor, preço publicado, canal de contato e a fonte de cada dado.
Se um dado não aparecer em uma fonte pública, escreva «não verificado».</div>`,
    },
    {
      h: "Exercício 2: verificar uma notícia",
      html: `${steps([
  "Copie o título e a frase que mais chamou sua atenção.",
  "Peça ao Gemini fontes que confirmem e fontes que contradigam a notícia.",
  "Abra pelo menos duas fontes primárias (órgãos oficiais, veículos com autoria identificada).",
  "Classifique a notícia: confirmada, parcial, não verificada ou falsa.",
])}`,
    },
    {
      h: "Exercício 3: relatório com Deep Research",
      html: `<div class="prompt">Pesquise [tema] para [público], com fontes dos últimos [anos] anos.
Entregue: 1) um resumo de cinco linhas, 2) achados com a sua fonte, 3) contradições entre fontes, 4) o que você não conseguiu verificar.</div>
${figure("/ialab-resources/modulo3/ilustraciones/robot-deep-research.jpg", "Um bom relatório é um relatório verificado.", "45%")}
${box("warn", "Antes de usar o relatório", "<p>Abra três fontes que sustentem as conclusões principais. Se um número não aparecer na fonte citada, não o use.</p>")}`,
    },
    {
      h: "Exercício 4: resumir sua conversa de e-mail",
      html: `<p>Se você tem uma conversa de e-mail longa, pode pedir um resumo das decisões em aberto. Confira sempre o resumo com a conversa original antes de responder.</p>
<div class="prompt">Resuma esta conversa de e-mail em: 1) contexto em duas linhas, 2) decisões tomadas, 3) pendências com responsável e data, se aparecerem.
Não invente datas nem responsáveis: se não estiverem na conversa, escreva «não consta».</div>`,
    },
    {
      h: "Tabela de evidências",
      html: `<p>Mantenha um registro do que você pesquisou. Cada afirmação importante precisa de uma linha.</p>
${table(["Afirmação", "Fonte", "Data", "Verificada (sim / não)", "Observações"], [
  ["Ex.: o preço subiu 10%", "Link ou documento oficial", "Data de publicação", "Sim", "Conferido no original"],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
])}`,
    },
    {
      h: "Erros frequentes",
      html: `${table(["Erro", "Como evitar"], [
  ["Confiar no resumo sem abrir a fonte", "Abra a parte do original que sustenta cada conclusão"],
  ["Usar fontes sem data", "Anote a data e descarte o que estiver desatualizado"],
  ["Misturar fatos com opiniões", "Na tabela, separe o que foi verificado do que é interpretação"],
  ["Colar dados pessoais de terceiros", "Anonimize antes de compartilhar documentos"],
])}`,
    },
  ],
  closing: `${checks([
    "Antes de pesquisar, conferi o modelo e o plano da minha conta.",
    "Cada afirmação importante tem uma fonte na minha tabela de evidências.",
    "Não uso um número que não encontro na fonte citada.",
  ])}`,
};
