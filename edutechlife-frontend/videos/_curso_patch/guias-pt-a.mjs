// Versões em português (Brasil) das guias do Módulo 1: prompts, privacidade e ética.

const box = (kind, t, html) => `<div class="box ${kind}"><div class="t">${t}</div>${html}</div>`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const checks = (items) => `<ul class="check">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
const steps = (items) => `<ol class="steps">${items.map((x) => `<li>${x}</li>`).join("")}</ol>`;
const cards = (items) => `<div class="cards">${items.map(([t, d]) => `<div class="card"><b>${t}</b>${d}</div>`).join("")}</div>`;
const figure = (src, cap, w = "100%") => `<figure style="width:${w};margin:12px auto"><img src="${src}"><figcaption>${cap}</figcaption></figure>`;

export const PT_M1_PROMPT = {
  lang: "pt",
  chip: "Módulo 1 · Prompts",
  module: 1,
  title: "A arte do prompt",
  subtitle: "Anatomia de um prompt, a fórmula RTF e como melhorá-lo a cada tentativa",
  edition: "Guia didático 2026",
  art: null,
  lead: "Um prompt é a instrução que você dá à IA. A diferença entre uma resposta fraca e uma útil costuma estar em <strong>quanto contexto</strong> você dá e em <strong>como pede o resultado</strong>. Este guia mostra como escrever prompts que funcionam já na primeira tentativa.",
  kpis: [["RTF", "Papel, Tarefa e Formato"], ["4", "elementos que completam um prompt"], ["3", "tentativas para melhorá-lo"]],
  sections: [
    {
      h: "O que é um prompt",
      html: `<p>Um prompt é qualquer instrução que você escreve para um modelo de IA. Pode ser uma pergunta curta ou um pedido detalhado. O modelo não sabe o que está na sua cabeça: ele tem apenas o que você escreve. Tudo o que você não disser, ele vai adivinhar.</p>
${box("tip", "Ideia central", "<p>Um prompt é um pedido a um colaborador muito rápido que não conhece o seu contexto. Quanto melhor você explicar o trabalho, menos vai precisar corrigir.</p>")}`,
    },
    {
      h: "A fórmula RTF",
      html: `<p>A fórmula RTF organiza qualquer prompt em três partes básicas:</p>
${cards([
  ["R · Papel", "Quem deve responder. Exemplo: «Você é um professor de história do ensino médio»."],
  ["T · Tarefa", "O que deve fazer, com um verbo claro. Exemplo: «Explique a Revolução Industrial»."],
  ["F · Formato", "Como o resultado deve parecer. Exemplo: «Três parágrafos curtos e uma tabela de datas»."],
])}
<p>Acrescentamos dois elementos que aumentam muito a qualidade: o <strong>contexto</strong> (para quem e com qual objetivo) e as <strong>restrições</strong> (o que não deve fazer). Quando puder, inclua um <strong>exemplo</strong> do resultado que espera.</p>`,
    },
    {
      h: "Fraco versus forte",
      html: `<p>Compare dois prompts que pedem a mesma coisa. A diferença está no detalhe:</p>
${box("warn", "Fraco", `<div class="prompt">Explique a Revolução Industrial para mim.</div>`)}
${box("tip", "Forte", `<div class="prompt">Você é um professor de história do ensino médio.
Contexto: meus alunos têm 15 anos e este é o primeiro contato com o tema.
Tarefa: explique as causas da Revolução Industrial na Inglaterra.
Formato: três parágrafos curtos e uma tabela com as 4 causas principais.
Restrições: não use datas de que você não tenha certeza; se tiver dúvida, diga isso.</div>`)}`,
    },
    {
      h: "Melhorar um prompt iterando",
      html: `<p>Quase ninguém acerta de primeira, e tudo bem. O importante é <strong>melhorar com método</strong>.</p>
${figure("/ialab-resources/modulo3/ilustraciones/cerebro-ia.jpg", "Um bom prompt é uma instrução clara para um colaborador muito rápido.", "34%")}
${steps([
  "<b>Primeira tentativa:</b> escreva o prompt com RTF. Analise a resposta sem corrigi-la ainda.",
  "<b>Diagnóstico:</b> o que está faltando? Tom, nível, extensão, exemplos, dados concretos?",
  "<b>Segunda tentativa:</b> acrescente apenas o que faltou. Uma mudança por vez mostra o que funcionou.",
  "<b>Compare e guarde:</b> se o resultado servir, salve o prompt como modelo para a próxima vez.",
])}`,
    },
    {
      h: "Erros comuns",
      html: `${table(["Erro", "Por que falha", "Como corrigir"], [
  ["Pedir sem contexto", "A IA adivinha o público e o nível", "Acrescente para quem é e com qual objetivo"],
  ["Pedir «algo bom»", "«Bom» não tem critério mensurável", "Defina o formato e a extensão"],
  ["Pedir muitas coisas de uma vez", "As respostas se diluem", "Divida o pedido em etapas"],
  ["Aceitar dados sem verificar", "O modelo pode errar com segurança", "Peça fontes e confira os números"],
  ["Colar dados pessoais", "Risco para a privacidade", "Anonimize antes de colar o texto"],
])}`,
    },
    {
      h: "Modelos prontos para usar",
      html: `<h3>Para estudar</h3>
<div class="prompt">Você é um tutor paciente de [matéria].
Explique [tema] para alguém de [nível].
Use uma analogia do dia a dia, um exemplo resolvido e três perguntas para checar minha compreensão.</div>
<h3>Para escrever</h3>
<div class="prompt">Você é um editor de textos claros para [público].
Reescreva o texto que eu colar para que fique breve, sem jargão e com um tom [tom].
Mantenha todos os dados e avise se mudar algum.</div>
<h3>Para revisar</h3>
<div class="prompt">Revise este texto como faria um avaliador exigente.
Dê três pontos fortes, três problemas concretos e uma melhoria para cada problema.</div>`,
    },
    {
      h: "Uma regra para fechar: o que não colar",
      html: `<p>Um prompt é um documento que viaja para um serviço externo. Antes de colar uma informação, pergunte-se se você a compartilharia com um desconhecido.</p>
${checks([
  "Documentos de identidade, senhas ou dados bancários.",
  "Prontuários ou informações de saúde de outras pessoas.",
  "Dados pessoais de estudantes ou de menores de idade.",
  "Informações confidenciais da sua empresa ou dos seus clientes.",
])}
<p class="muted">No Brasil, o tratamento de dados pessoais é regido pela Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018).</p>`,
    },
    {
      h: "Exercício prático",
      html: `${steps([
  "Escolha uma tarefa real da sua semana (um e-mail, um resumo, uma ideia).",
  "Escreva um prompt com RTF e contexto. Anote a resposta.",
  "Diagnostique o que falta e melhore o prompt em duas tentativas.",
  "Guarde a versão final como modelo, com espaços para preencher.",
])}`,
    },
  ],
  closing: `${checks([
    "Escrevo prompts com papel, tarefa e formato, e acrescento contexto.",
    "Melhoro os prompts com uma mudança por vez e comparo os resultados.",
    "Verifico números e fontes antes de usar uma resposta.",
    "Não colo dados pessoais nem confidenciais em uma IA.",
  ])}`,
};

export const PT_M1_PRIVACIDADE = {
  lang: "pt",
  chip: "Módulo 1 · Uso responsável",
  module: 1,
  title: "Privacidade e uso responsável da IA",
  subtitle: "Dados pessoais, menores, vieses e transparência para usar a IA com critério",
  edition: "Manual 2026",
  art: null,
  lead: "A IA é útil quando você sabe o que entrega a ela, como verifica o que recebe e a quem deve dizer que a usou. Este manual reúne os princípios que todo estudante e profissional deveria aplicar.",
  kpis: [["LGPD", "lei brasileira de proteção de dados (2018)"], ["4", "princípios de uso responsável"], ["3", "perguntas antes de compartilhar"]],
  sections: [
    {
      h: "Por que a privacidade importa",
      html: `<p>Cada texto que você cola em uma ferramenta de IA é uma informação que sai do seu computador. Muitas vezes você não sabe como ela é armazenada, quem pode vê-la ou se é usada para melhorar serviços. Tratar a privacidade como um hábito, e não como uma formalidade, é o que a protege.</p>`,
    },
    {
      h: "Um dilema prático",
      html: `<p>Um caso que se repete em salas de aula e escritórios: alguém precisa escrever uma redação e pede à IA que escreva tudo. O que acontece com o aprendizado, a honestidade e a qualidade do que é entregue?</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0">
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 14px">
    <b style="color:#9a3412;font-size:10pt">Opção A · Entregar sem ler</b>
    <p style="margin:6px 0 6px">Pedir à IA que escreva a redação inteira e entregá-la como está.</p>
    <ul style="margin:0 0 0 16px;font-size:9.5pt"><li>Desonestidade acadêmica</li><li>Risco de espalhar informação não verificada</li><li>Perda de aprendizado e de pensamento crítico</li></ul>
  </div>
  <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:12px 14px">
    <b style="color:#065f46;font-size:10pt">Opção B · A IA como andaime</b>
    <p style="margin:6px 0 6px">Usar a IA para estruturar ideias e revisar a gramática, mas escrever o texto você mesmo.</p>
    <ul style="margin:0 0 0 16px;font-size:9.5pt"><li>Mantém a autoria intelectual</li><li>Você entende o que escreve</li><li>Melhora o texto com o seu próprio critério</li></ul>
  </div>
</div>`,
    },
    {
      h: "Dados que você não deve compartilhar",
      html: `${table(["Tipo de dado", "Exemplo", "Por quê"], [
  ["Identificação", "CPF, RG, passaporte, data de nascimento", "Permite a falsificação de identidade"],
  ["Financeiros", "Números de conta, cartões, renda", "Risco de fraude"],
  ["Saúde", "Diagnósticos, prontuários", "Dado sensível com proteção especial"],
  ["Menores", "Nomes, escolas, notas de crianças ou adolescentes", "Proteção jurídica reforçada"],
  ["Credenciais", "Senhas, códigos de verificação", "Acesso direto às suas contas"],
])}`,
    },
    {
      h: "A LGPD (Lei 13.709/2018)",
      html: `<p>No Brasil, a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> regula o tratamento de dados pessoais. Seus princípios são a base do uso responsável:</p>
${cards([
  ["Finalidade", "Os dados são usados para um propósito claro e informado à pessoa."],
  ["Segurança e confidencialidade", "Quem trata os dados deve protegê-los e limitar o acesso."],
  ["Qualidade", "Os dados devem ser exatos, claros e atualizados."],
  ["Transparência e necessidade", "Só se coleta e se usa o que é necessário, com informação clara ao titular."],
])}
<p>Como titular, você pode confirmar, acessar, corrigir, anonimizar, bloquear ou eliminar seus dados, e revogar o consentimento que deu.</p>`,
    },
    {
      h: "Anonimizar antes de enviar",
      html: `${steps([
  "Remova nomes, e-mails, telefones e endereços do texto.",
  "Troque as pessoas por papéis: «o estudante A», «a paciente», «o fornecedor».",
  "Arredonde ou altere números sensíveis sem mudar a conclusão.",
  "Confira cabeçalhos, assinaturas e metadados ocultos nos documentos antes de enviá-los.",
])}`,
    },
    {
      h: "Vieses: como identificá-los",
      html: `<p>Um modelo aprende com dados criados por pessoas e pode repetir desigualdades: estereótipos de gênero, de região, de idade ou de nível socioeconômico. O viés nem sempre é evidente; às vezes aparece no que a resposta deixa de fora.</p>
${checks([
  "Peça a mesma tarefa com perfis diferentes e compare.",
  "Pergunte quais perspectivas estão faltando na resposta.",
  "Verifique com fontes diversas antes de tomar uma decisão sobre pessoas.",
])}`,
    },
    {
      h: "Transparência: declarar o uso de IA",
      html: `<p>Dizer quando você usou IA gera confiança e evita mal-entendidos. Declare o uso quando a IA participou de um texto, uma imagem, uma análise ou uma decisão, e explique qual parte você revisou pessoalmente.</p>
${box("tip", "Frase sugerida", "<p>«Este rascunho foi elaborado com apoio de IA e revisado e ajustado por mim. Os números foram conferidos com as fontes citadas.»</p>")}`,
    },
    {
      h: "Menores de idade",
      html: `<p>Quando a IA é usada com crianças ou adolescentes, um adulto responsável supervisiona o uso, escolhe as ferramentas e evita que dados do menor sejam compartilhados. Os dados de menores têm proteção reforçada.</p>`,
    },
    {
      h: "Checklist antes de compartilhar",
      html: `${checks([
  "Verifiquei cada número, citação e nome na fonte original?",
  "Removi dados pessoais ou confidenciais que não deveriam estar lá?",
  "Uma pessoa responsável revisou a decisão?",
  "Declarei o uso de IA quando foi o caso?",
])}`,
    },
  ],
  closing: `${checks([
    "Coloco só o necessário e anonimizo o que é pessoal.",
    "Verifico o que a IA me entrega antes de usar.",
    "Declaro quando usei IA e protejo os dados de terceiros e de menores.",
  ])}`,
};

export const PT_M1_ETICA = {
  lang: "pt",
  chip: "Módulo 1 · Ética",
  module: 1,
  title: "Ética da IA",
  subtitle: "Princípios para usar a inteligência artificial com honestidade, equidade e responsabilidade",
  edition: "Guia didático 2026",
  art: null,
  lead: "Usar bem a IA não é só obter bons resultados: é saber quando confiar, quando verificar e quando dizer que a usou. Este guia reúne os princípios que sustentam o uso responsável na escola, no trabalho e no dia a dia.",
  kpis: [["5", "princípios de uso responsável"], ["3", "perguntas antes de publicar"], ["1998", "lei de direitos autorais no Brasil (Lei 9.610)"]],
  sections: [
    {
      h: "Por que a ética importa na IA",
      html: `<p>Um sistema de IA pode escrever algo falso com total segurança, repetir preconceitos dos seus dados e produzir conteúdo que ninguém assinou. Quando o usamos sem critério, os erros se multiplicam e as consequências recaem sobre pessoas reais: um estudante acusado injustamente, um cliente mal informado ou uma decisão tomada com dados enviesados.</p>`,
    },
    {
      h: "Os cinco princípios",
      html: `${cards([
  ["Transparência", "Declare quando usou IA e explique qual parte você revisou pessoalmente."],
  ["Veracidade", "Verifique dados, citações e nomes antes de usá-los ou compartilhá-los."],
  ["Equidade", "Confira se a resposta trata todas as pessoas com o mesmo rigor."],
  ["Privacidade", "Não compartilhe dados pessoais, de menores ou confidenciais."],
  ["Responsabilidade humana", "A decisão final e suas consequências continuam sendo de uma pessoa."],
])}`,
    },
    {
      h: "Honestidade acadêmica",
      html: `<p>Usar a IA para entender um tema, organizar ideias ou revisar a gramática pode ser um apoio legítimo, desde que o texto final reflita o seu aprendizado. Entregar um trabalho que você não escreveu ou não entende prejudica sua formação e engana quem avalia.</p>
${table(["Uso aceitável", "Uso desonesto"], [
  ["Pedir explicações e exemplos do tema", "Entregar uma redação escrita inteiramente pela IA"],
  ["Revisar a gramática do próprio texto", "Apresentar como seu um texto que você não entende"],
  ["Gerar perguntas para estudar", "Responder uma prova com respostas geradas na hora"],
  ["Declarar o apoio da IA no seu trabalho", "Esconder o uso da IA quando a regra exige a declaração"],
])}`,
    },
    {
      h: "Vieses e equidade",
      html: `<p>Os modelos aprendem com dados criados por pessoas e podem repetir suas desigualdades: estereótipos de gênero, de região, de idade ou de nível socioeconômico. Às vezes o viés não está no que a resposta diz, mas no que ela deixa de fora.</p>
${steps([
  "Peça a mesma tarefa com perfis diferentes e compare as respostas.",
  "Pergunte quais perspectivas estão faltando e busque ao menos uma fonte que as represente.",
  "Antes de decidir algo que afeta pessoas, consulte quem conhece o contexto.",
])}`,
    },
    {
      h: "Veracidade e desinformação",
      html: `<p>A IA pode inventar citações, números e referências com total confiança. E a desinformação também é produzida com imagens, áudios e vídeos gerados por IA.</p>
${box("warn", "Antes de compartilhar algo", "<ul><li>Consigo abrir a fonte original?</li><li>A data é recente e o autor é confiável?</li><li>Pelo menos outra fonte independente confirma isso?</li></ul>")}`,
    },
    {
      h: "Propriedade intelectual e direitos autorais",
      html: `<p>No Brasil, a <strong>Lei 9.610/1998</strong> protege as obras de seus autores. Usar a IA não dá a você direitos sobre obras de terceiros: cite as fontes, não copie textos protegidos e peça autorização quando o uso exigir. O que você gerar com IA também deve ser declarado quando for publicado ou entregue.</p>`,
    },
    {
      h: "Dados pessoais e menores",
      html: `<p>A <strong>LGPD (Lei 13.709/2018)</strong> regula o tratamento de dados pessoais no Brasil. Não compartilhe dados de terceiros sem autorização e tenha cuidado especial com os dados de menores de idade: eles exigem proteção reforçada e, no caso de crianças e adolescentes, a supervisão de um adulto responsável.</p>`,
    },
    {
      h: "Decisões sobre pessoas",
      html: `<p>A IA pode ajudar a organizar informações sobre pessoas, mas não deve tomar sozinha decisões que afetem alguém: contratar, avaliar, punir ou diagnosticar. Essas decisões exigem julgamento humano, explicação e possibilidade de revisão.</p>`,
    },
    {
      h: "Protocolo de uso responsável",
      html: `${checks([
  "Verifiquei dados, citações e nomes na fonte original.",
  "Declarei o uso de IA quando foi o caso.",
  "Não incluí dados pessoais de terceiros ou de menores sem autorização.",
  "Confiro se o resultado trata todas as pessoas com equidade.",
  "Uma pessoa responsável revisou e aprovou a decisão final.",
])}`,
    },
    {
      h: "Casos para discutir",
      html: `<p>Leia cada caso e responda às perguntas. Não há uma única resposta correta; o importante é justificar a sua decisão.</p>
${box("tip", "Caso 1 · A redação perfeita", "<p>Uma estudante entrega uma redação quase toda gerada pela IA. Ninguém percebe. Houve dano? A quem? Qual teria sido um uso honesto da mesma ferramenta?</p>")}
${box("tip", "Caso 2 · O filtro de currículos", "<p>Uma empresa usa IA para ordenar candidatos e descobre que o sistema penaliza nomes de certas regiões. O que a empresa deve fazer? Quem responde pela decisão?</p>")}
${box("tip", "Caso 3 · A foto que não existiu", "<p>Circula nas redes uma imagem de um evento que nunca aconteceu, criada com IA. O que você verificaria antes de compartilhar? O que diria a quem já a compartilhou?</p>")}`,
    },
  ],
  closing: `${checks([
    "Declaro quando uso IA e o que revisei eu mesmo.",
    "Verifico antes de compartilhar e cito minhas fontes.",
    "Protejo os dados pessoais, especialmente os de menores.",
    "Mantenho uma pessoa responsável em cada decisão que afeta outras pessoas.",
  ])}`,
};
