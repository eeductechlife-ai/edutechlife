export const PROCESS_TO_SOLUTIONS_ES = {
  "Atención al cliente": [
    {
      name: "Chatbot IA 24/7",
      desc: "Atención automatizada con respuestas inteligentes y escalamiento a humano.",
      tools: "Zendesk + GPT / Intercom + IA",
      impacto: "Alto",
    },
    {
      name: "Sistema de Tickets Inteligente",
      desc: "Clasificación y routing automático de solicitudes por IA.",
      tools: "Jira Service Management + ML",
      impacto: "Alto",
    },
    {
      name: "Voicebot",
      desc: "Asistente telefónico con reconocimiento de voz y NLP.",
      tools: "Twilio + Speech Recognition",
      impacto: "Medio",
    },
  ],
  "Facturación y cobros": [
    {
      name: "Facturación Automática",
      desc: "Generación y envío automatizado de facturas con vencimiento programado.",
      tools: "Stripe + QuickBooks / FreshBooks API",
      impacto: "Alto",
    },
    {
      name: "Cobranza Inteligente",
      desc: "Sistema predictivo de cobranza con recordatorios automatizados.",
      tools: "Chargebee + IA predictiva",
      impacto: "Alto",
    },
    {
      name: "Conciliación Automática",
      desc: "Matching automático de pagos vs facturas usando ML.",
      tools: "Xero + ML reconciliation",
      impacto: "Medio",
    },
  ],
  "Gestión de inventario": [
    {
      name: "Inventario Predictivo",
      desc: "Predicción de demanda y reorden automático con IA.",
      tools: "TradeGecko + ML forecasting",
      impacto: "Alto",
    },
    {
      name: "Escaneo Automatizado",
      desc: "Reconocimiento de productos por imagen para entrada/salida.",
      tools: "Computer Vision + RFID",
      impacto: "Medio",
    },
    {
      name: "Alertas de Stock",
      desc: "Notificaciones automáticas cuando el stock baja del umbral mínimo.",
      tools: "Zapier + ERP + Slack",
      impacto: "Medio",
    },
  ],
  "Procesos contables": [
    {
      name: "Contabilidad Automatizada",
      desc: "Categorización automática de gastos e ingresos con IA.",
      tools: "QuickBooks + ML categorization",
      impacto: "Alto",
    },
    {
      name: "Reportes Financieros",
      desc: "Generación automática de estados financieros y dashboards.",
      tools: "PowerBI + Tableau + APIs",
      impacto: "Alto",
    },
    {
      name: "Auditoría con IA",
      desc: "Detección de anomalías y patrones sospechosos en transacciones.",
      tools: "AuditBoard + ML anomaly detection",
      impacto: "Medio",
    },
  ],
  "Recursos humanos": [
    {
      name: "Reclutamiento IA",
      desc: "Filtro automático de CVs y match con perfil del puesto.",
      tools: "LinkedIn Recruiter + IA screening",
      impacto: "Alto",
    },
    {
      name: "Onboarding Automatizado",
      desc: "Flujo de incorporación con documentos, training y accesos.",
      tools: "BambooHR + Zapier + LMS",
      impacto: "Alto",
    },
    {
      name: "Evaluación de Desempeño",
      desc: "Análisis automático de métricas y feedback 360° con IA.",
      tools: "Lattice + ML analytics",
      impacto: "Medio",
    },
  ],
  "Marketing y ventas": [
    {
      name: "CRM Predictivo",
      desc: "Scoring de leads y predicción de cierre con IA.",
      tools: "Salesforce + Einstein AI",
      impacto: "Alto",
    },
    {
      name: "Email Marketing IA",
      desc: "Segmentación automática y personalización de campañas.",
      tools: "HubSpot + Mailchimp + ML",
      impacto: "Alto",
    },
    {
      name: "Analítica de Ventas",
      desc: "Dashboard predictivo de ventas y recomendaciones.",
      tools: "Tableau + PowerBI + ML",
      impacto: "Medio",
    },
  ],
  "Logística y envíos": [
    {
      name: "Rutas Inteligentes",
      desc: "Optimización de rutas de entrega con IA en tiempo real.",
      tools: "Route4Me + Google Maps API",
      impacto: "Alto",
    },
    {
      name: "Tracking Automatizado",
      desc: "Notificaciones de seguimiento y estado de envíos.",
      tools: "ShipStation + Twilio + IA",
      impacto: "Alto",
    },
    {
      name: "Gestión de Flota",
      desc: "Monitoreo predictivo de mantenimiento y rendimiento.",
      tools: "Samsara + Fleet Complete",
      impacto: "Medio",
    },
  ],
  "Análisis de datos": [
    {
      name: "Dashboard Automatizado",
      desc: "Reportes en tiempo real con actualización automática.",
      tools: "PowerBI + Tableau + Looker",
      impacto: "Alto",
    },
    {
      name: "Detección de Tendencias",
      desc: "Identificación automática de patrones y anomalías.",
      tools: "Python ML + AWS QuickSight",
      impacto: "Alto",
    },
    {
      name: "Data Pipeline Automatizado",
      desc: "ETL automático con transformación y limpieza de datos.",
      tools: "Airflow + dbt + Snowflake",
      impacto: "Medio",
    },
  ],
  "Comunicación interna": [
    {
      name: "Slackbot / Teams Bot",
      desc: "Bot interno para consultas, reportes y notificaciones.",
      tools: "Slack API + GPT + Power Automate",
      impacto: "Medio",
    },
    {
      name: "Newsletter Automática",
      desc: "Generación y envío de comunicaciones internas con IA.",
      tools: "Mailchimp + GPT + Canva API",
      impacto: "Bajo",
    },
    {
      name: "Encuestas Inteligentes",
      desc: "Creación y análisis automático de encuestas de clima.",
      tools: "Typeform + SurveyMonkey + ML",
      impacto: "Bajo",
    },
  ],
  "Documentación y reportes": [
    {
      name: "Generación de Reportes IA",
      desc: "Redacción automática de reportes ejecutivos con datos en vivo.",
      tools: "GPT + Notion + Airtable",
      impacto: "Alto",
    },
    {
      name: "OCR Inteligente",
      desc: "Digitalización y clasificación automática de documentos.",
      tools: "Google Vision + AWS Textract",
      impacto: "Alto",
    },
    {
      name: "Gestión Documental",
      desc: "Archivo, búsqueda y recuperación inteligente de documentos.",
      tools: "DocuSign + Box + IA indexing",
      impacto: "Medio",
    },
  ],
};

export const PROCESS_TO_SOLUTIONS_PT = {
  "Atendimento ao cliente": [
    {
      name: "Chatbot IA 24/7",
      desc: "Atendimento automatizado com respostas inteligentes e escalonamento para humano.",
      tools: "Zendesk + GPT / Intercom + IA",
      impacto: "Alto",
    },
    {
      name: "Sistema de Tickets Inteligente",
      desc: "Classificação e roteamento automático de solicitações por IA.",
      tools: "Jira Service Management + ML",
      impacto: "Alto",
    },
    {
      name: "Voicebot",
      desc: "Assistente telefônico com reconhecimento de voz e NLP.",
      tools: "Twilio + Speech Recognition",
      impacto: "Médio",
    },
  ],
  "Faturamento e cobranças": [
    {
      name: "Faturamento Automático",
      desc: "Geração e envio automatizado de faturas com vencimento programado.",
      tools: "Stripe + QuickBooks / FreshBooks API",
      impacto: "Alto",
    },
    {
      name: "Cobrança Inteligente",
      desc: "Sistema preditivo de cobrança com lembretes automatizados.",
      tools: "Chargebee + IA preditiva",
      impacto: "Alto",
    },
    {
      name: "Conciliação Automática",
      desc: "Matching automático de pagamentos vs faturas usando ML.",
      tools: "Xero + ML reconciliation",
      impacto: "Médio",
    },
  ],
  "Gestão de estoque": [
    {
      name: "Estoque Preditivo",
      desc: "Previsão de demanda e reposição automática com IA.",
      tools: "TradeGecko + ML forecasting",
      impacto: "Alto",
    },
    {
      name: "Escaneamento Automatizado",
      desc: "Reconhecimento de produtos por imagem para entrada/saída.",
      tools: "Computer Vision + RFID",
      impacto: "Médio",
    },
    {
      name: "Alertas de Estoque",
      desc: "Notificações automáticas quando o estoque fica abaixo do limite mínimo.",
      tools: "Zapier + ERP + Slack",
      impacto: "Médio",
    },
  ],
  "Processos contábeis": [
    {
      name: "Contabilidade Automatizada",
      desc: "Categorização automática de despesas e receitas com IA.",
      tools: "QuickBooks + ML categorization",
      impacto: "Alto",
    },
    {
      name: "Relatórios Financeiros",
      desc: "Geração automática de demonstrações financeiras e dashboards.",
      tools: "PowerBI + Tableau + APIs",
      impacto: "Alto",
    },
    {
      name: "Auditoria com IA",
      desc: "Detecção de anomalias e padrões suspeitos em transações.",
      tools: "AuditBoard + ML anomaly detection",
      impacto: "Médio",
    },
  ],
  "Recursos humanos": [
    {
      name: "Recrutamento IA",
      desc: "Triagem automática de currículos e match com o perfil da vaga.",
      tools: "LinkedIn Recruiter + IA screening",
      impacto: "Alto",
    },
    {
      name: "Onboarding Automatizado",
      desc: "Fluxo de integração com documentos, treinamento e acessos.",
      tools: "BambooHR + Zapier + LMS",
      impacto: "Alto",
    },
    {
      name: "Avaliação de Desempenho",
      desc: "Análise automática de métricas e feedback 360° com IA.",
      tools: "Lattice + ML analytics",
      impacto: "Médio",
    },
  ],
  "Marketing e vendas": [
    {
      name: "CRM Preditivo",
      desc: "Scoring de leads e previsão de fechamento com IA.",
      tools: "Salesforce + Einstein AI",
      impacto: "Alto",
    },
    {
      name: "E-mail Marketing IA",
      desc: "Segmentação automática e personalização de campanhas.",
      tools: "HubSpot + Mailchimp + ML",
      impacto: "Alto",
    },
    {
      name: "Análise de Vendas",
      desc: "Dashboard preditivo de vendas e recomendações.",
      tools: "Tableau + PowerBI + ML",
      impacto: "Médio",
    },
  ],
  "Logística e entregas": [
    {
      name: "Rotas Inteligentes",
      desc: "Otimização de rotas de entrega com IA em tempo real.",
      tools: "Route4Me + Google Maps API",
      impacto: "Alto",
    },
    {
      name: "Tracking Automatizado",
      desc: "Notificações de rastreamento e status de entregas.",
      tools: "ShipStation + Twilio + IA",
      impacto: "Alto",
    },
    {
      name: "Gestão de Frota",
      desc: "Monitoramento preditivo de manutenção e desempenho.",
      tools: "Samsara + Fleet Complete",
      impacto: "Médio",
    },
  ],
  "Análise de dados": [
    {
      name: "Dashboard Automatizado",
      desc: "Relatórios em tempo real com atualização automática.",
      tools: "PowerBI + Tableau + Looker",
      impacto: "Alto",
    },
    {
      name: "Detecção de Tendências",
      desc: "Identificação automática de padrões e anomalias.",
      tools: "Python ML + AWS QuickSight",
      impacto: "Alto",
    },
    {
      name: "Data Pipeline Automatizado",
      desc: "ETL automático com transformação e limpeza de dados.",
      tools: "Airflow + dbt + Snowflake",
      impacto: "Médio",
    },
  ],
  "Comunicação interna": [
    {
      name: "Slackbot / Teams Bot",
      desc: "Bot interno para consultas, relatórios e notificações.",
      tools: "Slack API + GPT + Power Automate",
      impacto: "Médio",
    },
    {
      name: "Newsletter Automática",
      desc: "Geração e envio de comunicações internas com IA.",
      tools: "Mailchimp + GPT + Canva API",
      impacto: "Baixo",
    },
    {
      name: "Pesquisas Inteligentes",
      desc: "Criação e análise automática de pesquisas de clima.",
      tools: "Typeform + SurveyMonkey + ML",
      impacto: "Baixo",
    },
  ],
  "Documentação e relatórios": [
    {
      name: "Geração de Relatórios IA",
      desc: "Redação automática de relatórios executivos com dados ao vivo.",
      tools: "GPT + Notion + Airtable",
      impacto: "Alto",
    },
    {
      name: "OCR Inteligente",
      desc: "Digitalização e classificação automática de documentos.",
      tools: "Google Vision + AWS Textract",
      impacto: "Alto",
    },
    {
      name: "Gestão Documental",
      desc: "Arquivamento, busca e recuperação inteligente de documentos.",
      tools: "DocuSign + Box + IA indexing",
      impacto: "Médio",
    },
  ],
};

export const PROCESS_TO_SOLUTIONS_EN = {
  "Customer Service": [
    {
      name: "24/7 AI Chatbot",
      desc: "Automated service with intelligent responses and human escalation.",
      tools: "Zendesk + GPT / Intercom + AI",
      impacto: "High",
    },
    {
      name: "Smart Ticketing",
      desc: "Automatic ticket classification and routing by AI.",
      tools: "Jira Service Management + ML",
      impacto: "High",
    },
    {
      name: "Voicebot",
      desc: "Phone assistant with speech recognition and NLP.",
      tools: "Twilio + Speech Recognition",
      impacto: "Medium",
    },
  ],
  "Billing & Collections": [
    {
      name: "Auto Invoicing",
      desc: "Automated invoice generation and sending with scheduled due dates.",
      tools: "Stripe + QuickBooks / FreshBooks API",
      impacto: "High",
    },
    {
      name: "Smart Collections",
      desc: "Predictive collection system with automated reminders.",
      tools: "Chargebee + Predictive AI",
      impacto: "High",
    },
    {
      name: "Auto Reconciliation",
      desc: "Automatic payment vs invoice matching using ML.",
      tools: "Xero + ML reconciliation",
      impacto: "Medium",
    },
  ],
  "Inventory Management": [
    {
      name: "Predictive Inventory",
      desc: "Demand forecasting and automatic reordering with AI.",
      tools: "TradeGecko + ML forecasting",
      impacto: "High",
    },
    {
      name: "Automated Scanning",
      desc: "Product recognition by image for entry/exit.",
      tools: "Computer Vision + RFID",
      impacto: "Medium",
    },
    {
      name: "Stock Alerts",
      desc: "Automatic notifications when stock falls below threshold.",
      tools: "Zapier + ERP + Slack",
      impacto: "Medium",
    },
  ],
  Accounting: [
    {
      name: "Automated Accounting",
      desc: "Automatic categorization of expenses and income with AI.",
      tools: "QuickBooks + ML categorization",
      impacto: "High",
    },
    {
      name: "Financial Reports",
      desc: "Automatic generation of financial statements and dashboards.",
      tools: "PowerBI + Tableau + APIs",
      impacto: "High",
    },
    {
      name: "AI Auditing",
      desc: "Detection of anomalies and suspicious patterns in transactions.",
      tools: "AuditBoard + ML anomaly detection",
      impacto: "Medium",
    },
  ],
  "Human Resources": [
    {
      name: "AI Recruitment",
      desc: "Automatic CV filtering and job profile matching.",
      tools: "LinkedIn Recruiter + AI screening",
      impacto: "High",
    },
    {
      name: "Automated Onboarding",
      desc: "Onboarding flow with documents, training, and access provisioning.",
      tools: "BambooHR + Zapier + LMS",
      impacto: "High",
    },
    {
      name: "Performance Review",
      desc: "Automatic metric analysis and 360° feedback with AI.",
      tools: "Lattice + ML analytics",
      impacto: "Medium",
    },
  ],
  "Marketing & Sales": [
    {
      name: "Predictive CRM",
      desc: "Lead scoring and close prediction with AI.",
      tools: "Salesforce + Einstein AI",
      impacto: "High",
    },
    {
      name: "AI Email Marketing",
      desc: "Automatic segmentation and campaign personalization.",
      tools: "HubSpot + Mailchimp + ML",
      impacto: "High",
    },
    {
      name: "Sales Analytics",
      desc: "Predictive sales dashboard with recommendations.",
      tools: "Tableau + PowerBI + ML",
      impacto: "Medium",
    },
  ],
  "Logistics & Shipping": [
    {
      name: "Smart Routes",
      desc: "Delivery route optimization with real-time AI.",
      tools: "Route4Me + Google Maps API",
      impacto: "High",
    },
    {
      name: "Auto Tracking",
      desc: "Shipment tracking notifications and status updates.",
      tools: "ShipStation + Twilio + AI",
      impacto: "High",
    },
    {
      name: "Fleet Management",
      desc: "Predictive maintenance and performance monitoring.",
      tools: "Samsara + Fleet Complete",
      impacto: "Medium",
    },
  ],
  "Data Analysis": [
    {
      name: "Auto Dashboard",
      desc: "Real-time reports with automatic updates.",
      tools: "PowerBI + Tableau + Looker",
      impacto: "High",
    },
    {
      name: "Trend Detection",
      desc: "Automatic pattern and anomaly identification.",
      tools: "Python ML + AWS QuickSight",
      impacto: "High",
    },
    {
      name: "Auto Data Pipeline",
      desc: "Automatic ETL with data transformation and cleaning.",
      tools: "Airflow + dbt + Snowflake",
      impacto: "Medium",
    },
  ],
  "Internal Communication": [
    {
      name: "Slackbot / Teams Bot",
      desc: "Internal bot for queries, reports, and notifications.",
      tools: "Slack API + GPT + Power Automate",
      impacto: "Medium",
    },
    {
      name: "Auto Newsletter",
      desc: "Internal communication generation and sending with AI.",
      tools: "Mailchimp + GPT + Canva API",
      impacto: "Low",
    },
    {
      name: "Smart Surveys",
      desc: "Automatic survey creation and analysis.",
      tools: "Typeform + SurveyMonkey + ML",
      impacto: "Low",
    },
  ],
  "Documentation & Reports": [
    {
      name: "AI Report Generation",
      desc: "Automatic executive report writing with live data.",
      tools: "GPT + Notion + Airtable",
      impacto: "High",
    },
    {
      name: "Smart OCR",
      desc: "Automatic document digitization and classification.",
      tools: "Google Vision + AWS Textract",
      impacto: "High",
    },
    {
      name: "Document Management",
      desc: "Intelligent document archiving, search, and retrieval.",
      tools: "DocuSign + Box + AI indexing",
      impacto: "Medium",
    },
  ],
};
