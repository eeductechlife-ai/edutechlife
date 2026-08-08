export const helpArticles = [
  {
    id: "inicio-rapido",
    titulo: "Guia de início rápido",
    descripcion: "Primeiros passos com a plataforma",
    icono: "fa-rocket",
    tiempo: "5 min",
  },
  {
    id: "manual-ia",
    titulo: "Manual de ferramentas de IA",
    descripcion: "Funções e configuração do IA Lab",
    icono: "fa-robot",
    tiempo: "12 min",
  },
  {
    id: "tutorial-smartboard",
    titulo: "Tutorial SmartBoard",
    descripcion: "Configuração e uso da lousa interativa",
    icono: "fa-chalkboard",
    tiempo: "8 min",
  },
  {
    id: "api-docs",
    titulo: "Documentação da API",
    descripcion: "Integração com sistemas externos",
    icono: "fa-code",
    tiempo: "15 min",
  },
  {
    id: "faq",
    titulo: "FAQs frequentes",
    descripcion: "Perguntas e respostas comuns",
    icono: "fa-circle-question",
    tiempo: "3 min",
  },
];

export const helpIntro =
  "Acesse toda a documentação necessária para implementar e aproveitar ao máximo as ferramentas da Edutechlife.";
export const helpSubtitle = "Manuais, guias e recursos técnicos";
export const helpNeedHelp = "Precisa de mais ajuda?";
export const helpNeedHelpDesc =
  "Entre em contato com nossa equipe de suporte para assistência técnica personalizada.";

export const helpArticleContents = {
  "inicio-rapido": {
    titulo: "Guia de início rápido",
    introduccion:
      "Bem-vindo à Edutechlife. Este guia irá conduzi-lo pelos primeiros passos para começar a utilizar a plataforma de forma eficaz. Em menos de 10 minutos você poderá navegar e utilizar as principais ferramentas.",
    secciones: [
      {
        titulo: "1. Criar sua conta",
        contenido:
          "O primeiro passo é criar sua conta na Edutechlife. Visite a página de registro e informe seu e-mail institucional. Você receberá um e-mail de verificação em menos de 2 minutos.",
        pasos: [
          'Acesse edutechlife.com e clique em "Registrar-se"',
          "Informe seu e-mail institucional",
          "Crie uma senha segura (mínimo de 8 caracteres)",
          "Verifique seu e-mail",
          "Complete seu perfil com suas informações acadêmicas",
        ],
      },
      {
        titulo: "2. Explorando o Dashboard",
        contenido:
          "Após fazer login, você chegará ao dashboard principal. Aqui você encontrará: navegação principal à esquerda, painel de métricas no centro e acessos rápidos às ferramentas na parte superior.",
        imagen:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      },
      {
        titulo: "3. Sua primeira sessão com o IA Lab",
        contenido:
          'O IA Lab é seu assistente de inteligência artificial. Para começar sua primeira sessão: selecione "IA Lab" no menu de ferramentas, escolha o modelo de IA preferido e escreva sua primeira consulta no campo de texto.',
        consejos: [
          "Seja específico em suas perguntas para obter melhores resultados",
          "Use os prompts predefinidos para começar",
          "Salve suas conversas para referência futura",
        ],
      },
      {
        titulo: "4. Configurar seu ambiente",
        contenido:
          "Personalize sua experiência na Edutechlife: acesse Configurações no menu, ajuste o idioma e o fuso horário, configure suas preferências de notificações e vincule seu calendário institucional.",
      },
      {
        titulo: "5. Próximos passos",
        contenido:
          "Após completar o início básico, recomendamos: explorar o diagnóstico VAK para personalizar sua aprendizagem, revisar os tutoriais do SmartBoard se você pretende usar lousas interativas e consultar a seção de automação para otimizar processos.",
      },
    ],
  },
  "manual-ia": {
    titulo: "Manual de ferramentas de IA",
    introduccion:
      "O IA Lab é o núcleo de inteligência artificial da Edutechlife. Este guia ensina a configurar e utilizar todas as capacidades de IA para potencializar sua prática educacional.",
    secciones: [
      {
        titulo: "Introdução ao IA Lab",
        contenido:
          "O IA Lab integra modelos avançados de IA para auxiliar na criação de conteúdo educacional, análise de dados e personalização da aprendizagem. O sistema suporta múltiplos idiomas, incluindo espanhol, inglês e português.",
        grafica: "dona",
        datos: [
          { nombre: "Geração de conteúdo", valor: 35 },
          { nombre: "Análise e avaliação", valor: 30 },
          { nombre: "Assessoria pedagógica", valor: 25 },
          { nombre: "Pesquisa", valor: 10 },
        ],
        unidad: "Uso",
      },
      {
        titulo: "Configuração de Modelos",
        contenido:
          "A Edutechlife oferece múltiplos modelos de IA otimizados para diferentes finalidades educacionais. A seleção do modelo correto pode melhorar significativamente seus resultados.",
        modelos: [
          {
            nombre: "MAX",
            descripcion:
              "Assistente pedagógico especializado em metodologias educacionais",
            caso: "Criação de planos de aula",
          },
          {
            nombre: "Analítico",
            descripcion:
              "Análise de dados de estudantes e geração de relatórios",
            caso: "Identificação de padrões de aprendizagem",
          },
          {
            nombre: "Criador",
            descripcion: "Geração de conteúdo educacional diversificado",
            caso: "Materiais didáticos",
          },
          {
            nombre: "Pesquisador",
            descripcion: "Busca e síntese de informações acadêmicas",
            caso: "Revisão de literatura",
          },
        ],
      },
      {
        titulo: "Prompts Personalizados",
        contenido:
          "Os prompts são instruções que orientam a IA a gerar respostas específicas. A Edutechlife inclui uma biblioteca de prompts otimizados para diferentes cenários educacionais.",
        lista: [
          "Prompts para geração de avaliações",
          "Prompts para criação de rubricas",
          "Prompts para design de atividades",
          "Prompts para feedback automático",
        ],
      },
      {
        titulo: "Configuração Avançada",
        contenido:
          "Para usuários avançados, o IA Lab permite ajustar parâmetros como: temperatura (criatividade vs. precisão), comprimento da resposta, nível de detalhe e formato de saída.",
        grafica: "barras",
        datos: [
          { categoria: "Produtividade", antes: 45, despues: 82 },
          { categoria: "Qualidade do conteúdo", antes: 60, despues: 91 },
          { categoria: "Tempo de preparação", antes: 100, despues: 35 },
        ],
        unidad: "%",
      },
      {
        titulo: "Integração com o MAX",
        contenido:
          "O MAX é o avatar inteligente da Edutechlife que combina técnicas de coaching com IA. Compatível com o IA Lab, o MAX fornece respostas contextualizadas com base nas melhores práticas pedagógicas.",
      },
    ],
  },
  "tutorial-smartboard": {
    titulo: "Tutorial SmartBoard",
    introduccion:
      "O SmartBoard é a solução de lousa interativa inteligente da Edutechlife. Este guia ajudará você a configurar e utilizar todas as funções para maximizar o engajamento de seus estudantes.",
    secciones: [
      {
        titulo: "Especificações Técnicas",
        contenido:
          "Antes de começar, conheça as especificações do seu SmartBoard: tela 4K multitoque, tamanho de 65-86 polegadas, tecnologia infravermelha de alta precisão, conectividade HDMI, USB-C e Wi-Fi 6.",
        especificacion: [
          { label: "Resolução", valor: "3840 x 2160 (4K)" },
          { label: "Toque", valor: "20 pontos simultâneos" },
          { label: "Tempo de resposta", valor: "< 8ms" },
          { label: "Brilho", valor: "400 cd/m²" },
          { label: "Conectividade", valor: "HDMI 2.0, USB-C, Wi-Fi 6" },
        ],
      },
      {
        titulo: "Instalação e Configuração",
        contenido:
          "O processo de instalação inclui: montagem na parede ou suporte móvel, conexão dos cabos de energia e dados, calibração inicial da tela e emparelhamento com o software Edutechlife.",
        pasos: [
          "Desembale o SmartBoard e verifique todos os componentes",
          "Instale o suporte seguindo as instruções do fabricante",
          "Conecte o cabo HDMI à porta correspondente",
          "Ligue o dispositivo e aguarde o carregamento do sistema",
          "Baixe e instale o aplicativo Edutechlife no centro de downloads",
        ],
      },
      {
        titulo: "Ferramentas Interativas",
        contenido:
          "O SmartBoard inclui um conjunto completo de ferramentas: lousa colaborativa infinita, reconhecimento de escrita à mão, ferramentas geométricas, editor de imagens e gravação de sessões.",
        grafica: "linea",
        datos: [
          { anio: "2024", engagement: 65 },
          { anio: "2025", engagement: 78 },
          { anio: "2026", engagement: 92 },
        ],
        unidad: "% Engajamento",
      },
      {
        titulo: "Integração com Dispositivos",
        contenido:
          "Maximize a funcionalidade conectando dispositivos adicionais: tablets dos estudantes para compartilhar conteúdo, sistemas de votação para avaliações em tempo real e sistemas de áudio aprimorados para conferências.",
        opciones: [
          "Conexão por código QR para compartilhar a tela",
          "Emparelhamento Bluetooth para controle remoto",
          "Sincronização com Google Classroom e Microsoft Teams",
        ],
      },
      {
        titulo: "Solução de Problemas Comuns",
        contenido:
          "Problemas frequentes e suas soluções: a tela não responde — verifique as conexões e reinicie; a conexão Wi-Fi falha — aproxime o roteador ou use cabo Ethernet; o toque não funciona — recalibre nas configurações.",
        faqs: [
          {
            q: "Posso usar o SmartBoard sem internet?",
            a: "Sim, as funções básicas funcionam offline",
          },
          {
            q: "Quantos dispositivos posso conectar?",
            a: "Até 50 dispositivos simultaneamente",
          },
          {
            q: "O software é compatível com Mac?",
            a: "Totalmente compatível com macOS 12+",
          },
        ],
      },
    ],
  },
  "api-docs": {
    titulo: "Documentação da API",
    introduccion:
      "A API da Edutechlife permite integrar nossas funcionalidades com seus sistemas existentes. Esta documentação foi projetada para desenvolvedores que precisam conectar LMS, sistemas de gestão acadêmica ou aplicativos personalizados.",
    secciones: [
      {
        titulo: "Informações Gerais",
        contenido:
          "A API da Edutechlife segue arquitetura RESTful com autenticação JWT. Todos os endpoints exigem uma chave de API válida, que você pode obter no painel de administração.",
        detalle: {
          base: "https://api.edutechlife.com/v1",
          formato: "JSON",
          autenticacion: "Bearer Token (JWT)",
          version: "v1 (atual)",
        },
      },
      {
        titulo: "Endpoints Principais",
        contenido:
          "Os endpoints disponíveis cobrem as principais funcionalidades da plataforma. A seguir, os mais utilizados:",
        endpoints: [
          {
            metodo: "GET",
            ruta: "/usuarios",
            descripcion: "Lista todos os usuários",
          },
          {
            metodo: "POST",
            ruta: "/usuarios",
            descripcion: "Cria um novo usuário",
          },
          {
            metodo: "GET",
            ruta: "/estudiantes/{id}",
            descripcion: "Obtém dados de um estudante",
          },
          {
            metodo: "PUT",
            ruta: "/estudiantes/{id}",
            descripcion: "Atualiza informações do estudante",
          },
          {
            metodo: "GET",
            ruta: "/resultados/vak",
            descripcion: "Obtém resultados do diagnóstico VAK",
          },
          {
            metodo: "POST",
            ruta: "/ia/chat",
            descripcion: "Envia mensagem para o chat de IA",
          },
        ],
      },
      {
        titulo: "Exemplo de Autenticação",
        contenido:
          "Para autenticar-se na API, inclua o token no cabeçalho de cada solicitação:",
        codigo: `// JavaScript - Fetch
const response = await fetch('https://api.edutechlife.com/v1/usuarios', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer SEU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        lenguaje: "JavaScript",
      },
      {
        titulo: "Integração com LMS",
        contenido:
          "A Edutechlife se integra nativamente com os principais sistemas de gestão de aprendizagem:",
        integraciones: [
          { lms: "Moodle", tipo: "Plugin disponível", estado: "Produção" },
          { lms: "Canvas", tipo: "API REST", estado: "Produção" },
          { lms: "Blackboard", tipo: "LTI 1.3", estado: "Beta" },
          { lms: "Google Classroom", tipo: "API OAuth", estado: "Produção" },
        ],
      },
      {
        titulo: "Rate Limits e Boas Práticas",
        contenido:
          "Para garantir a estabilidade do serviço, aplicamos limites de uso: 1000 requests/hora por chave de API e 100 requests/minuto nos endpoints de IA. Recomendamos implementar cache local e webhooks para notificações assíncronas.",
        grafica: "barras",
        datos: [
          { categoria: "Gratuito", valor: 100 },
          { categoria: "Profissional", valor: 1000 },
          { categoria: "Institucional", valor: 10000 },
          { categoria: "Enterprise", valor: 100000 },
        ],
        unidad: "Requests/hora",
      },
    ],
  },
  faq: {
    titulo: "FAQs Frequentes",
    introduccion:
      "Aqui você encontrará respostas para as perguntas mais frequentes sobre a Edutechlife. Se não encontrar a resposta que procura, entre em contato com nossa equipe de suporte.",
    secciones: [
      {
        titulo: "Conta e Faturamento",
        contenido: "",
        faqs: [
          {
            q: "Como posso mudar meu plano de assinatura?",
            a: "Em Configurações > Assinatura, você pode mudar seu plano a qualquer momento. A alteração será efetiva no próximo ciclo de faturamento.",
          },
          {
            q: "Quais métodos de pagamento são aceitos?",
            a: "Aceitamos cartões de crédito/débito (Visa, Mastercard, Amex), PayPal e transferências bancárias para planos anuais.",
          },
          {
            q: "Posso obter nota fiscal?",
            a: "Sim, todas as transações incluem nota fiscal. Baixe em Configurações > Faturamento.",
          },
          {
            q: "O que acontece se eu exceder meu limite de usuários?",
            a: "Notificaremos você quando atingir 80% do seu limite. Você pode atualizar seu plano ou aguardar o próximo ciclo.",
          },
        ],
      },
      {
        titulo: "Técnicas",
        contenido: "",
        faqs: [
          {
            q: "Quais navegadores são compatíveis?",
            a: "Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. Recomendamos o Chrome para melhor desempenho.",
          },
          {
            q: "A Edutechlife funciona sem internet?",
            a: "Algumas funções básicas funcionam offline. A sincronização acontece automaticamente quando você reconectar.",
          },
          {
            q: "Meus dados estão seguros?",
            a: "Utilizamos criptografia AES-256, conformidade com GDPR e SOC 2 Type II. Seus dados nunca são compartilhados.",
          },
          {
            q: "Posso exportar meus dados?",
            a: "Sim, em Configurações > Dados você pode exportar nos formatos CSV, PDF ou Excel.",
          },
        ],
      },
      {
        titulo: "Pedagógicas",
        contenido: "",
        faqs: [
          {
            q: "O diagnóstico VAK é gratuito?",
            a: "O diagnóstico básico é gratuito. A versão completa com análise detalhada exige o plano Profissional.",
          },
          {
            q: "Posso usar a Edutechlife para educação online?",
            a: "Totalmente. Todas as nossas ferramentas são otimizadas para ambientes presenciais, híbridos e remotos.",
          },
          {
            q: "Como medir o ROI de usar a plataforma?",
            a: "Incluímos uma Calculadora de ROI que analisa métricas de desempenho, engajamento e redução de tempo administrativo.",
          },
          {
            q: "As certificações têm validade oficial?",
            a: "Nossas certificações são emitidas pela Edutechlife e reconhecidas por instituições educacionais parceiras.",
          },
        ],
      },
      {
        titulo: "Suporte",
        contenido: "",
        faqs: [
          {
            q: "Como entrar em contato com o suporte?",
            a: "Pelo chat ao vivo (disponível 24/7), e-mail para suporte@edutechlife.com ou através do formulário no Centro de Ajuda.",
          },
          {
            q: "Vocês oferecem capacitação para instituições?",
            a: "Sim, oferecemos capacitação virtual e presencial para implementações institucionais.",
          },
          {
            q: "Qual é o tempo de resposta?",
            a: "Plano Gratuito: 48h, Profissional: 24h, Enterprise: 4h com administrador dedicado.",
          },
        ],
      },
    ],
  },
};
