const METRICS_ES = [
  { value: '+340%', label: 'Eficiencia Operativa', color: '#4DA8C4' },
  { value: '-60%', label: 'Reducción de Costos', color: '#66CCCC' },
  { value: '12+', label: 'Sectores', color: '#004B63' },
  { value: '4.2x', label: 'ROI Promedio', color: '#4DA8C4' },
];

const METRICS_EN = [
  { value: '+340%', label: 'Operational Efficiency', color: '#4DA8C4' },
  { value: '-60%', label: 'Cost Reduction', color: '#66CCCC' },
  { value: '12+', label: 'Sectors', color: '#004B63' },
  { value: '4.2x', label: 'Avg ROI', color: '#4DA8C4' },
];

const STANDARDS_ES = [
  { name: 'ISO/IEC 42001', label: 'Gestión de IA' },
  { name: 'NIST AI RMF', label: 'Riesgos de IA' },
  { name: 'ISO/IEC 23053', label: 'Framework ML' },
];

const STANDARDS_EN = [
  { name: 'ISO/IEC 42001', label: 'AI Management' },
  { name: 'NIST AI RMF', label: 'AI Risks' },
  { name: 'ISO/IEC 23053', label: 'ML Framework' },
];

const QUESTIONS_ES = [
  { id: 1, category: 'Procesos', text: '¿Cómo se gestionan actualmente tus procesos operativos?', options: [
    { value: 1, label: 'Totalmente manuales (papel, hojas de cálculo)' },
    { value: 2, label: 'Semi-automatizados con herramientas básicas' },
    { value: 3, label: 'Automatizados con software especializado' },
    { value: 4, label: 'Automatizados con IA y analítica avanzada' },
  ]},
  { id: 2, category: 'Procesos', text: '¿Con qué frecuencia se optimizan los procesos?', options: [
    { value: 1, label: 'Nunca / No hay un proceso definido' },
    { value: 2, label: 'Anualmente' },
    { value: 3, label: 'Trimestralmente' },
    { value: 4, label: 'Continuamente con métricas en tiempo real' },
  ]},
  { id: 3, category: 'Datos', text: '¿Cómo se almacenan y gestionan los datos de tu empresa?', options: [
    { value: 1, label: 'Archivos locales sin estructura' },
    { value: 2, label: 'Sistemas básicos con bases de datos simples' },
    { value: 3, label: 'Data warehouse o data lake' },
    { value: 4, label: 'Plataforma integrada con analítica en tiempo real' },
  ]},
  { id: 4, category: 'Datos', text: '¿Qué nivel de calidad tienen tus datos?', options: [
    { value: 1, label: 'Datos inconsistentes con duplicados frecuentes' },
    { value: 2, label: 'Datos parcialmente limpios' },
    { value: 3, label: 'Datos limpios con procesos de validación' },
    { value: 4, label: 'Datos gobernados con calidad automatizada' },
  ]},
  { id: 5, category: 'Tecnología', text: '¿Qué stack tecnológico utiliza tu empresa?', options: [
    { value: 1, label: 'Herramientas básicas ofimáticas' },
    { value: 2, label: 'Software de gestión (ERP/CRM básico)' },
    { value: 3, label: 'Plataformas cloud con APIs' },
    { value: 4, label: 'Arquitectura cloud-native con IA integrada' },
  ]},
  { id: 6, category: 'Tecnología', text: '¿Tu empresa utiliza APIs o integraciones entre sistemas?', options: [
    { value: 1, label: 'No, los sistemas están aislados' },
    { value: 2, label: 'Integraciones puntuales manuales' },
    { value: 3, label: 'APIs estándar entre sistemas principales' },
    { value: 4, label: 'Arquitectura orientada a servicios (SOA/microservicios)' },
  ]},
  { id: 7, category: 'Equipo', text: '¿Qué nivel de habilidades digitales tiene tu equipo?', options: [
    { value: 1, label: 'Básico: uso de herramientas ofimáticas' },
    { value: 2, label: 'Intermedio: manejo de software especializado' },
    { value: 3, label: 'Avanzado: team con perfil técnico/data literate' },
    { value: 4, label: 'Expertos: equipo dedicado a innovación digital' },
  ]},
  { id: 8, category: 'Equipo', text: '¿Existe una cultura de innovación y adopción tecnológica?', options: [
    { value: 1, label: 'Resistente al cambio tecnológico' },
    { value: 2, label: 'Abierta pero sin procesos definidos' },
    { value: 3, label: 'Programas de capacitación continua' },
    { value: 4, label: 'Cultura data-driven con innovación constante' },
  ]},
  { id: 9, category: 'Presupuesto', text: '¿Qué presupuesto destinas a tecnología e innovación?', options: [
    { value: 1, label: 'Menos del 2% de ingresos' },
    { value: 2, label: 'Entre 2% y 5% de ingresos' },
    { value: 3, label: 'Entre 5% y 10% de ingresos' },
    { value: 4, label: 'Más del 10% de ingresos' },
  ]},
  { id: 10, category: 'Presupuesto', text: '¿Has implementado soluciones de IA en tu empresa?', options: [
    { value: 1, label: 'No, nunca' },
    { value: 2, label: 'Proyectos piloto sin escala' },
    { value: 3, label: 'IA implementada en áreas específicas' },
    { value: 4, label: 'IA integrada en procesos core del negocio' },
  ]},
];

const QUESTIONS_EN = [
  { id: 1, category: 'Process', text: 'How are your operational processes currently managed?', options: [
    { value: 1, label: 'Fully manual (paper, spreadsheets)' },
    { value: 2, label: 'Semi-automated with basic tools' },
    { value: 3, label: 'Automated with specialized software' },
    { value: 4, label: 'Automated with AI and advanced analytics' },
  ]},
  { id: 2, category: 'Process', text: 'How often are your processes optimized?', options: [
    { value: 1, label: 'Never / No defined process' },
    { value: 2, label: 'Annually' },
    { value: 3, label: 'Quarterly' },
    { value: 4, label: 'Continuously with real-time metrics' },
  ]},
  { id: 3, category: 'Data', text: 'How is your company data stored and managed?', options: [
    { value: 1, label: 'Local files without structure' },
    { value: 2, label: 'Basic systems with simple databases' },
    { value: 3, label: 'Data warehouse or data lake' },
    { value: 4, label: 'Integrated platform with real-time analytics' },
  ]},
  { id: 4, category: 'Data', text: 'What is the quality level of your data?', options: [
    { value: 1, label: 'Inconsistent data with frequent duplicates' },
    { value: 2, label: 'Partially clean data' },
    { value: 3, label: 'Clean data with validation processes' },
    { value: 4, label: 'Governed data with automated quality' },
  ]},
  { id: 5, category: 'Technology', text: 'What technology stack does your company use?', options: [
    { value: 1, label: 'Basic office tools' },
    { value: 2, label: 'Management software (basic ERP/CRM)' },
    { value: 3, label: 'Cloud platforms with APIs' },
    { value: 4, label: 'Cloud-native architecture with integrated AI' },
  ]},
  { id: 6, category: 'Technology', text: 'Does your company use APIs or system integrations?', options: [
    { value: 1, label: 'No, systems are isolated' },
    { value: 2, label: 'Manual point-to-point integrations' },
    { value: 3, label: 'Standard APIs between main systems' },
    { value: 4, label: 'Service-oriented architecture (SOA/microservices)' },
  ]},
  { id: 7, category: 'Team', text: 'What level of digital skills does your team have?', options: [
    { value: 1, label: 'Basic: office tool usage' },
    { value: 2, label: 'Intermediate: specialized software' },
    { value: 3, label: 'Advanced: technical/data literate team' },
    { value: 4, label: 'Expert: dedicated digital innovation team' },
  ]},
  { id: 8, category: 'Team', text: 'Is there a culture of innovation and technology adoption?', options: [
    { value: 1, label: 'Resistant to technological change' },
    { value: 2, label: 'Open but without defined processes' },
    { value: 3, label: 'Continuous training programs' },
    { value: 4, label: 'Data-driven culture with constant innovation' },
  ]},
  { id: 9, category: 'Budget', text: 'What budget do you allocate to technology and innovation?', options: [
    { value: 1, label: 'Less than 2% of revenue' },
    { value: 2, label: 'Between 2% and 5% of revenue' },
    { value: 3, label: 'Between 5% and 10% of revenue' },
    { value: 4, label: 'More than 10% of revenue' },
  ]},
  { id: 10, category: 'Budget', text: 'Have you implemented AI solutions in your company?', options: [
    { value: 1, label: 'No, never' },
    { value: 2, label: 'Pilot projects without scaling' },
    { value: 3, label: 'AI implemented in specific areas' },
    { value: 4, label: 'AI integrated into core business processes' },
  ]},
];

const LEVELS_ES = [
  { min: 10, max: 17, name: 'Emergente', color: '#EF4444', description: 'Tu empresa está en las etapas iniciales de transformación digital. Hay un gran potencial de mejora mediante automatización básica.', actions: ['Automatizar procesos manuales repetitivos', 'Implementar un CRM/ERP básico', 'Digitalizar documentos y procesos'], standards: 'ISO/IEC 42001 Sección 6.2 — Planificación del SGA' },
  { min: 18, max: 24, name: 'Básico', color: '#F59E0B', description: 'Tienes bases digitales pero falta integración y automatización de procesos multi-paso.', actions: ['Integrar sistemas mediante APIs', 'Implementar chatbots para atención al cliente', 'Automatizar reportes y documentación'], standards: 'ISO/IEC 23053 — Framework para sistemas IA' },
  { min: 25, max: 31, name: 'Intermedio', color: '#4DA8C4', description: 'Buena base tecnológica. El siguiente nivel es implementar IA predictiva y automatización inteligente.', actions: ['Implementar IA predictiva para toma de decisiones', 'Automatizar flujos multi-paso con IA', 'Dashboard analítico en tiempo real'], standards: 'NIST AI RMF — Mapear, Medir, Gestionar' },
  { min: 32, max: 37, name: 'Avanzado', color: '#66CCCC', description: 'Tu empresa está preparada para automatización cognitiva y agentes de IA autónomos.', actions: ['Desplegar multi-agentes IA autónomos', 'Automatización end-to-end de procesos core', 'Analítica prescriptiva con ML'], standards: 'ISO/IEC 42001 Sección 8 — Evaluación del SGA' },
  { min: 38, max: 40, name: 'Optimizado', color: '#004B63', description: 'Eres líder en transformación digital. El foco ahora es innovación continua y escalar IA a toda la organización.', actions: ['Escalar IA a toda la organización', 'Innovación continua con IA generativa', 'Crear centro de excelencia en IA'], standards: 'ISO/IEC 42001 + EU AI Act Compliance' },
];

const LEVELS_EN = [
  { min: 10, max: 17, name: 'Emerging', color: '#EF4444', description: 'Your company is in the early stages of digital transformation. There is great potential for improvement through basic automation.', actions: ['Automate repetitive manual processes', 'Implement a basic CRM/ERP', 'Digitize documents and processes'], standards: 'ISO/IEC 42001 Section 6.2 — IMS Planning' },
  { min: 18, max: 24, name: 'Basic', color: '#F59E0B', description: 'You have digital foundations but lack integration and multi-step process automation.', actions: ['Integrate systems via APIs', 'Implement chatbots for customer service', 'Automate reports and documentation'], standards: 'ISO/IEC 23053 — Framework for AI Systems' },
  { min: 25, max: 31, name: 'Intermediate', color: '#4DA8C4', description: 'Good technological foundation. The next level is implementing predictive AI and intelligent automation.', actions: ['Implement predictive AI for decision making', 'Automate multi-step flows with AI', 'Real-time analytics dashboard'], standards: 'NIST AI RMF — Map, Measure, Manage' },
  { min: 32, max: 37, name: 'Advanced', color: '#66CCCC', description: 'Your company is ready for cognitive automation and autonomous AI agents.', actions: ['Deploy autonomous multi-agent AI', 'End-to-end core process automation', 'Prescriptive analytics with ML'], standards: 'ISO/IEC 42001 Section 8 — IMS Evaluation' },
  { min: 38, max: 40, name: 'Optimized', color: '#004B63', description: 'You are a digital transformation leader. The focus now is continuous innovation and scaling AI across the organization.', actions: ['Scale AI across the organization', 'Continuous innovation with generative AI', 'Create an AI center of excellence'], standards: 'ISO/IEC 42001 + EU AI Act Compliance' },
];

const PROCESS_TO_SOLUTIONS_ES = {
  'Atención al cliente': [
    { name: 'Chatbot IA 24/7', desc: 'Atención automatizada con respuestas inteligentes y escalamiento a humano.', tools: 'Zendesk + GPT / Intercom + IA', impacto: 'Alto' },
    { name: 'Sistema de Tickets Inteligente', desc: 'Clasificación y routing automático de solicitudes por IA.', tools: 'Jira Service Management + ML', impacto: 'Alto' },
    { name: 'Voicebot', desc: 'Asistente telefónico con reconocimiento de voz y NLP.', tools: 'Twilio + Speech Recognition', impacto: 'Medio' },
  ],
  'Facturación y cobros': [
    { name: 'Facturación Automática', desc: 'Generación y envío automatizado de facturas con vencimiento programado.', tools: 'Stripe + QuickBooks / FreshBooks API', impacto: 'Alto' },
    { name: 'Cobranza Inteligente', desc: 'Sistema predictivo de cobranza con recordatorios automatizados.', tools: 'Chargebee + IA predictiva', impacto: 'Alto' },
    { name: 'Conciliación Automática', desc: 'Matching automático de pagos vs facturas usando ML.', tools: 'Xero + ML reconciliation', impacto: 'Medio' },
  ],
  'Gestión de inventario': [
    { name: 'Inventario Predictivo', desc: 'Predicción de demanda y reorden automático con IA.', tools: 'TradeGecko + ML forecasting', impacto: 'Alto' },
    { name: 'Escaneo Automatizado', desc: 'Reconocimiento de productos por imagen para entrada/salida.', tools: 'Computer Vision + RFID', impacto: 'Medio' },
    { name: 'Alertas de Stock', desc: 'Notificaciones automáticas cuando el stock baja del umbral mínimo.', tools: 'Zapier + ERP + Slack', impacto: 'Medio' },
  ],
  'Procesos contables': [
    { name: 'Contabilidad Automatizada', desc: 'Categorización automática de gastos e ingresos con IA.', tools: 'QuickBooks + ML categorization', impacto: 'Alto' },
    { name: 'Reportes Financieros', desc: 'Generación automática de estados financieros y dashboards.', tools: 'PowerBI + Tableau + APIs', impacto: 'Alto' },
    { name: 'Auditoría con IA', desc: 'Detección de anomalías y patrones sospechosos en transacciones.', tools: 'AuditBoard + ML anomaly detection', impacto: 'Medio' },
  ],
  'Recursos humanos': [
    { name: 'Reclutamiento IA', desc: 'Filtro automático de CVs y match con perfil del puesto.', tools: 'LinkedIn Recruiter + IA screening', impacto: 'Alto' },
    { name: 'Onboarding Automatizado', desc: 'Flujo de incorporación con documentos, training y accesos.', tools: 'BambooHR + Zapier + LMS', impacto: 'Alto' },
    { name: 'Evaluación de Desempeño', desc: 'Análisis automático de métricas y feedback 360° con IA.', tools: 'Lattice + ML analytics', impacto: 'Medio' },
  ],
  'Marketing y ventas': [
    { name: 'CRM Predictivo', desc: 'Scoring de leads y predicción de cierre con IA.', tools: 'Salesforce + Einstein AI', impacto: 'Alto' },
    { name: 'Email Marketing IA', desc: 'Segmentación automática y personalización de campañas.', tools: 'HubSpot + Mailchimp + ML', impacto: 'Alto' },
    { name: 'Analítica de Ventas', desc: 'Dashboard predictivo de ventas y recomendaciones.', tools: 'Tableau + PowerBI + ML', impacto: 'Medio' },
  ],
  'Logística y envíos': [
    { name: 'Rutas Inteligentes', desc: 'Optimización de rutas de entrega con IA en tiempo real.', tools: 'Route4Me + Google Maps API', impacto: 'Alto' },
    { name: 'Tracking Automatizado', desc: 'Notificaciones de seguimiento y estado de envíos.', tools: 'ShipStation + Twilio + IA', impacto: 'Alto' },
    { name: 'Gestión de Flota', desc: 'Monitoreo predictivo de mantenimiento y rendimiento.', tools: 'Samsara + Fleet Complete', impacto: 'Medio' },
  ],
  'Análisis de datos': [
    { name: 'Dashboard Automatizado', desc: 'Reportes en tiempo real con actualización automática.', tools: 'PowerBI + Tableau + Looker', impacto: 'Alto' },
    { name: 'Detección de Tendencias', desc: 'Identificación automática de patrones y anomalías.', tools: 'Python ML + AWS QuickSight', impacto: 'Alto' },
    { name: 'Data Pipeline Automatizado', desc: 'ETL automático con transformación y limpieza de datos.', tools: 'Airflow + dbt + Snowflake', impacto: 'Medio' },
  ],
  'Comunicación interna': [
    { name: 'Slackbot / Teams Bot', desc: 'Bot interno para consultas, reportes y notificaciones.', tools: 'Slack API + GPT + Power Automate', impacto: 'Medio' },
    { name: 'Newsletter Automática', desc: 'Generación y envío de comunicaciones internas con IA.', tools: 'Mailchimp + GPT + Canva API', impacto: 'Bajo' },
    { name: 'Encuestas Inteligentes', desc: 'Creación y análisis automático de encuestas de clima.', tools: 'Typeform + SurveyMonkey + ML', impacto: 'Bajo' },
  ],
  'Documentación y reportes': [
    { name: 'Generación de Reportes IA', desc: 'Redacción automática de reportes ejecutivos con datos en vivo.', tools: 'GPT + Notion + Airtable', impacto: 'Alto' },
    { name: 'OCR Inteligente', desc: 'Digitalización y clasificación automática de documentos.', tools: 'Google Vision + AWS Textract', impacto: 'Alto' },
    { name: 'Gestión Documental', desc: 'Archivo, búsqueda y recuperación inteligente de documentos.', tools: 'DocuSign + Box + IA indexing', impacto: 'Medio' },
  ],
};

const PROCESS_TO_SOLUTIONS_EN = {
  'Customer Service': [
    { name: '24/7 AI Chatbot', desc: 'Automated service with intelligent responses and human escalation.', tools: 'Zendesk + GPT / Intercom + AI', impacto: 'High' },
    { name: 'Smart Ticketing', desc: 'Automatic ticket classification and routing by AI.', tools: 'Jira Service Management + ML', impacto: 'High' },
    { name: 'Voicebot', desc: 'Phone assistant with speech recognition and NLP.', tools: 'Twilio + Speech Recognition', impacto: 'Medium' },
  ],
  'Billing & Collections': [
    { name: 'Auto Invoicing', desc: 'Automated invoice generation and sending with scheduled due dates.', tools: 'Stripe + QuickBooks / FreshBooks API', impacto: 'High' },
    { name: 'Smart Collections', desc: 'Predictive collection system with automated reminders.', tools: 'Chargebee + Predictive AI', impacto: 'High' },
    { name: 'Auto Reconciliation', desc: 'Automatic payment vs invoice matching using ML.', tools: 'Xero + ML reconciliation', impacto: 'Medium' },
  ],
  'Inventory Management': [
    { name: 'Predictive Inventory', desc: 'Demand forecasting and automatic reordering with AI.', tools: 'TradeGecko + ML forecasting', impacto: 'High' },
    { name: 'Automated Scanning', desc: 'Product recognition by image for entry/exit.', tools: 'Computer Vision + RFID', impacto: 'Medium' },
    { name: 'Stock Alerts', desc: 'Automatic notifications when stock falls below threshold.', tools: 'Zapier + ERP + Slack', impacto: 'Medium' },
  ],
  'Accounting': [
    { name: 'Automated Accounting', desc: 'Automatic categorization of expenses and income with AI.', tools: 'QuickBooks + ML categorization', impacto: 'High' },
    { name: 'Financial Reports', desc: 'Automatic generation of financial statements and dashboards.', tools: 'PowerBI + Tableau + APIs', impacto: 'High' },
    { name: 'AI Auditing', desc: 'Detection of anomalies and suspicious patterns in transactions.', tools: 'AuditBoard + ML anomaly detection', impacto: 'Medium' },
  ],
  'Human Resources': [
    { name: 'AI Recruitment', desc: 'Automatic CV filtering and job profile matching.', tools: 'LinkedIn Recruiter + AI screening', impacto: 'High' },
    { name: 'Automated Onboarding', desc: 'Onboarding flow with documents, training, and access provisioning.', tools: 'BambooHR + Zapier + LMS', impacto: 'High' },
    { name: 'Performance Review', desc: 'Automatic metric analysis and 360° feedback with AI.', tools: 'Lattice + ML analytics', impacto: 'Medium' },
  ],
  'Marketing & Sales': [
    { name: 'Predictive CRM', desc: 'Lead scoring and close prediction with AI.', tools: 'Salesforce + Einstein AI', impacto: 'High' },
    { name: 'AI Email Marketing', desc: 'Automatic segmentation and campaign personalization.', tools: 'HubSpot + Mailchimp + ML', impacto: 'High' },
    { name: 'Sales Analytics', desc: 'Predictive sales dashboard with recommendations.', tools: 'Tableau + PowerBI + ML', impacto: 'Medium' },
  ],
  'Logistics & Shipping': [
    { name: 'Smart Routes', desc: 'Delivery route optimization with real-time AI.', tools: 'Route4Me + Google Maps API', impacto: 'High' },
    { name: 'Auto Tracking', desc: 'Shipment tracking notifications and status updates.', tools: 'ShipStation + Twilio + AI', impacto: 'High' },
    { name: 'Fleet Management', desc: 'Predictive maintenance and performance monitoring.', tools: 'Samsara + Fleet Complete', impacto: 'Medium' },
  ],
  'Data Analysis': [
    { name: 'Auto Dashboard', desc: 'Real-time reports with automatic updates.', tools: 'PowerBI + Tableau + Looker', impacto: 'High' },
    { name: 'Trend Detection', desc: 'Automatic pattern and anomaly identification.', tools: 'Python ML + AWS QuickSight', impacto: 'High' },
    { name: 'Auto Data Pipeline', desc: 'Automatic ETL with data transformation and cleaning.', tools: 'Airflow + dbt + Snowflake', impacto: 'Medium' },
  ],
  'Internal Communication': [
    { name: 'Slackbot / Teams Bot', desc: 'Internal bot for queries, reports, and notifications.', tools: 'Slack API + GPT + Power Automate', impacto: 'Medium' },
    { name: 'Auto Newsletter', desc: 'Internal communication generation and sending with AI.', tools: 'Mailchimp + GPT + Canva API', impacto: 'Low' },
    { name: 'Smart Surveys', desc: 'Automatic survey creation and analysis.', tools: 'Typeform + SurveyMonkey + ML', impacto: 'Low' },
  ],
  'Documentation & Reports': [
    { name: 'AI Report Generation', desc: 'Automatic executive report writing with live data.', tools: 'GPT + Notion + Airtable', impacto: 'High' },
    { name: 'Smart OCR', desc: 'Automatic document digitization and classification.', tools: 'Google Vision + AWS Textract', impacto: 'High' },
    { name: 'Document Management', desc: 'Intelligent document archiving, search, and retrieval.', tools: 'DocuSign + Box + AI indexing', impacto: 'Medium' },
  ],
};

const CASES_ES = [
  {
    id: 1, empresa: 'TechCorp Solutions', sector: 'Tecnología / SaaS',
    resultado: '+340% eficiencia',
    metricas: [
      { label: 'Ahorro operativo', value: '$180K/año' },
      { label: 'ROI', value: '4.2x' },
      { label: 'Implementación', value: '3 meses' },
    ],
    problema: 'La empresa gestionaba 15,000+ tickets de soporte al mes manualmente, con tiempos de respuesta de 48+ horas y un equipo de 12 agentes al límite.',
    solucion: 'Implementamos un sistema multi-agente con chatbot IA para nivel 1, routing inteligente con NLP, y automatización de respuestas para problemas recurrentes. Se integró con Zendesk y el CRM existente.',
    resultados: 'Reducción del 78% en tickets de nivel 1, tiempo de respuesta bajó a <5 minutos, el equipo humano se enfoca en casos complejos. Ahorro anual de $180,000.',
    icono: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    color: '#4DA8C4',
  },
  {
    id: 2, empresa: 'Clínica Santa María', sector: 'Salud',
    resultado: '-70% carga admin',
    metricas: [
      { label: 'Ahorro operativo', value: '$240K/año' },
      { label: 'ROI', value: '5.8x' },
      { label: 'Implementación', value: '4 meses' },
    ],
    problema: 'El 40% del tiempo del personal médico se perdía en tareas administrativas: agendamiento, facturación, historias clínicas y autorizaciones.',
    solucion: 'Desplegamos un ecosistema de automatización con NLP para transcripción médica, chatbot para agendamiento, OCR para historias clínicas, y facturación automática con IA.',
    resultados: 'Los médicos recuperaron 15h/semana para atención de pacientes. Reducción del 70% en tareas administrativas. Precisión del 95% en codificación de diagnósticos.',
    icono: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342',
    color: '#66CCCC',
  },
  {
    id: 3, empresa: 'LogiCo Express', sector: 'Logística',
    resultado: '+180% capacidad',
    metricas: [
      { label: 'Ahorro operativo', value: '$320K/año' },
      { label: 'ROI', value: '6.3x' },
      { label: 'Implementación', value: '5 meses' },
    ],
    problema: 'Gestión manual de rutas para 200+ envíos diarios, con demoras del 25% y costos de combustible elevados por rutas ineficientes.',
    solucion: 'IA para optimización de rutas en tiempo real, automatización de tracking y notificaciones, dashboard predictivo de demanda, y sistema de gestión de flota con ML.',
    resultados: 'Reducción del 35% en costos de combustible, 99.8% de entregas a tiempo, capacidad de envíos duplicada sin contratar más personal. Ahorro anual de $320,000.',
    icono: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    color: '#004B63',
  },
  {
    id: 4, empresa: 'FinTech Pay', sector: 'Fintech',
    resultado: '+250% conversión',
    metricas: [
      { label: 'Ahorro operativo', value: '$150K/año' },
      { label: 'ROI', value: '3.9x' },
      { label: 'Implementación', value: '2 meses' },
    ],
    problema: 'Alto volumen de consultas de clientes (8,000/mes) con equipo limitado. Procesos de onboarding manual que tomaban 3 días promedio.',
    solucion: 'Chatbot financiero con IA para atención al cliente, automatización del proceso KYC con OCR y verificación de identidad, y scoring crediticio con ML predictivo.',
    resultados: 'Onboarding reducido de 3 días a 15 minutos. 85% de consultas resueltas por chatbot. Aumento del 250% en tasa de conversión de leads. NPS subió de 62 a 91.',
    icono: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#10B981',
  },
];

const CASES_EN = [
  {
    id: 1, empresa: 'TechCorp Solutions', sector: 'Technology / SaaS',
    resultado: '+340% efficiency',
    metricas: [
      { label: 'Op. Savings', value: '$180K/yr' },
      { label: 'ROI', value: '4.2x' },
      { label: 'Implementation', value: '3 months' },
    ],
    problema: 'The company manually managed 15,000+ support tickets per month, with response times of 48+ hours and a team of 12 agents at capacity.',
    solucion: 'We implemented a multi-agent system with AI chatbot for level 1, intelligent NLP routing, and automated responses for recurring issues. Integrated with Zendesk and existing CRM.',
    resultados: '78% reduction in level 1 tickets, response time dropped to <5 minutes, human team focuses on complex cases. Annual savings of $180,000.',
    icono: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    color: '#4DA8C4',
  },
  {
    id: 2, empresa: 'Santa María Clinic', sector: 'Healthcare',
    resultado: '-70% admin load',
    metricas: [
      { label: 'Op. Savings', value: '$240K/yr' },
      { label: 'ROI', value: '5.8x' },
      { label: 'Implementation', value: '4 months' },
    ],
    problema: '40% of medical staff time was lost on administrative tasks: scheduling, billing, medical records, and authorizations.',
    solucion: 'Deployed an automation ecosystem with NLP for medical transcription, chatbot for scheduling, OCR for medical records, and AI-powered automatic billing.',
    resultados: 'Doctors recovered 15h/week for patient care. 70% reduction in administrative tasks. 95% accuracy in diagnosis coding.',
    icono: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342',
    color: '#66CCCC',
  },
  {
    id: 3, empresa: 'LogiCo Express', sector: 'Logistics',
    resultado: '+180% capacity',
    metricas: [
      { label: 'Op. Savings', value: '$320K/yr' },
      { label: 'ROI', value: '6.3x' },
      { label: 'Implementation', value: '5 months' },
    ],
    problema: 'Manual route management for 200+ daily shipments, with 25% delays and high fuel costs due to inefficient routes.',
    solucion: 'Real-time route optimization AI, automated tracking and notifications, predictive demand dashboard, and ML-powered fleet management system.',
    resultados: '35% reduction in fuel costs, 99.8% on-time deliveries, shipping capacity doubled without hiring. Annual savings of $320,000.',
    icono: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    color: '#004B63',
  },
  {
    id: 4, empresa: 'FinTech Pay', sector: 'Fintech',
    resultado: '+250% conversion',
    metricas: [
      { label: 'Op. Savings', value: '$150K/yr' },
      { label: 'ROI', value: '3.9x' },
      { label: 'Implementation', value: '2 months' },
    ],
    problema: 'High volume of customer inquiries (8,000/month) with limited team. Manual onboarding process that took 3 days on average.',
    solucion: 'AI financial chatbot for customer service, automated KYC process with OCR and identity verification, and predictive ML credit scoring.',
    resultados: 'Onboarding reduced from 3 days to 15 minutes. 85% of inquiries resolved by chatbot. 250% increase in lead conversion rate. NPS rose from 62 to 91.',
    icono: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#10B981',
  },
];

const PROCESOS_OPTIONS_ES = [
  'Atención al cliente', 'Facturación y cobros', 'Gestión de inventario',
  'Procesos contables', 'Recursos humanos', 'Marketing y ventas',
  'Logística y envíos', 'Análisis de datos', 'Comunicación interna',
  'Documentación y reportes'
];

const PROCESOS_OPTIONS_EN = [
  'Customer Service', 'Billing & Collections', 'Inventory Management',
  'Accounting', 'Human Resources', 'Marketing & Sales',
  'Logistics & Shipping', 'Data Analysis', 'Internal Communication',
  'Documentation & Reports'
];

const INDUSTRIAS_ES = [
  { id: 'educacion', label: 'Educación' }, { id: 'retail', label: 'Retail / Comercio' },
  { id: 'logistica', label: 'Logística / Transporte' }, { id: 'salud', label: 'Salud / Clínicas' },
  { id: 'fintech', label: 'Fintech / Bancario' }, { id: 'manufactura', label: 'Manufactura / Industria' },
  { id: 'servicios', label: 'Servicios Profesionales' }, { id: 'turismo', label: 'Hotelería / Turismo' },
];

const INDUSTRIAS_EN = [
  { id: 'educacion', label: 'Education' }, { id: 'retail', label: 'Retail / Commerce' },
  { id: 'logistica', label: 'Logistics / Transport' }, { id: 'salud', label: 'Healthcare / Clinics' },
  { id: 'fintech', label: 'Fintech / Banking' }, { id: 'manufactura', label: 'Manufacturing / Industry' },
  { id: 'servicios', label: 'Professional Services' }, { id: 'turismo', label: 'Hospitality / Tourism' },
];

const ARQUITECTURAS_PREDEFINIDAS = [
  { id: 'basica', nombre: 'Arquitectura Básica', descripcion: 'Automatización de procesos clave con chatbots, reportes automáticos y notificaciones inteligentes.',
    tiempo: '1-3 meses', costo: '$5-10M', complejidad: 'Baja', icono: 'fa-robot', color: '#4DA8C4',
    componentes: [
      { nombre: 'Chatbot IA', desc: 'Atención al cliente automatizada' }, { nombre: 'Dashboard', desc: 'Reportes en tiempo real' },
      { nombre: 'Notificaciones', desc: 'Alertas automáticas por email/SMS' }, { nombre: 'CRM', desc: 'Gestión de clientes automatizada' },
    ]},
  { id: 'intermedia', nombre: 'Arquitectura Intermedia', descripcion: 'Automatización multi-proceso con integración de sistemas vía APIs y analítica predictiva.',
    tiempo: '3-6 meses', costo: '$15-25M', complejidad: 'Media', icono: 'fa-brain', color: '#66CCCC',
    componentes: [
      { nombre: 'Multi-Agente IA', desc: 'Agentes IA especializados por proceso' }, { nombre: 'API Gateway', desc: 'Integración de sistemas vía APIs' },
      { nombre: 'ML Predictivo', desc: 'Modelos predictivos por proceso' }, { nombre: 'Orquestador', desc: 'Orquestación de flujos multi-paso' },
    ]},
  { id: 'avanzada', nombre: 'Arquitectura Avanzada', descripcion: 'Automatización cognitiva con agentes autónomos, analítica prescriptiva y auto-aprendizaje.',
    tiempo: '6-12 meses', costo: '$30-50M', complejidad: 'Alta', icono: 'fa-network-wired', color: '#004B63',
    componentes: [
      { nombre: 'Agentes Autónomos', desc: 'Agentes IA con toma de decisiones autónoma' }, { nombre: 'AutoML', desc: 'Modelos de auto-aprendizaje continuo' },
      { nombre: 'Gemelo Digital', desc: 'Simulación digital de procesos' }, { nombre: 'Gobernanza IA', desc: 'Framework de gobernanza y compliance' },
    ]},
];

const ARQUITECTURAS_PREDEFINIDAS_EN = [
  { id: 'basica', nombre: 'Basic Architecture', descripcion: 'Key process automation with chatbots, automatic reports, and smart notifications.',
    tiempo: '1-3 months', costo: '$5-10M', complejidad: 'Low', icono: 'fa-robot', color: '#4DA8C4',
    componentes: [
      { nombre: 'AI Chatbot', desc: 'Automated customer service' }, { nombre: 'Dashboard', desc: 'Real-time reports' },
      { nombre: 'Notifications', desc: 'Automatic email/SMS alerts' }, { nombre: 'CRM', desc: 'Automated customer management' },
    ]},
  { id: 'intermedia', nombre: 'Intermediate Architecture', descripcion: 'Multi-process automation with system integration via APIs and predictive analytics.',
    tiempo: '3-6 months', costo: '$15-25M', complejidad: 'Medium', icono: 'fa-brain', color: '#66CCCC',
    componentes: [
      { nombre: 'Multi-Agent AI', desc: 'Specialized AI agents per process' }, { nombre: 'API Gateway', desc: 'System integration via APIs' },
      { nombre: 'Predictive ML', desc: 'Predictive models per process' }, { nombre: 'Orchestrator', desc: 'Multi-step flow orchestration' },
    ]},
  { id: 'avanzada', nombre: 'Advanced Architecture', descripcion: 'Cognitive automation with autonomous agents, prescriptive analytics, and self-learning.',
    tiempo: '6-12 months', costo: '$30-50M', complejidad: 'High', icono: 'fa-network-wired', color: '#004B63',
    componentes: [
      { nombre: 'Autonomous Agents', desc: 'AI agents with autonomous decision-making' }, { nombre: 'AutoML', desc: 'Continuous self-learning models' },
      { nombre: 'Digital Twin', desc: 'Digital process simulation' }, { nombre: 'AI Governance', desc: 'Governance and compliance framework' },
    ]},
];

const SECTOR_OPTIONS_ES = [
  { value: '', label: 'Seleccionar...' }, { value: 'retail', label: 'Retail / Comercio' },
  { value: 'logistica', label: 'Logística / Transporte' }, { value: 'salud', label: 'Salud / Clínicas' },
  { value: 'fintech', label: 'Fintech / Bancario' }, { value: 'manufactura', label: 'Manufactura / Industria' },
  { value: 'servicios', label: 'Servicios Profesionales' }, { value: 'turismo', label: 'Hotelería / Turismo' },
  { value: 'educacion', label: 'Educación' },
];

const SECTOR_OPTIONS_EN = [
  { value: '', label: 'Select...' }, { value: 'retail', label: 'Retail / Commerce' },
  { value: 'logistica', label: 'Logistics / Transport' }, { value: 'salud', label: 'Healthcare / Clinics' },
  { value: 'fintech', label: 'Fintech / Banking' }, { value: 'manufactura', label: 'Manufacturing / Industry' },
  { value: 'servicios', label: 'Professional Services' }, { value: 'turismo', label: 'Hospitality / Tourism' },
  { value: 'educacion', label: 'Education' },
];

const PROCESO_ICONS_MAP = {
  'Atención al cliente': 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
  'Facturación y cobros': 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'Gestión de inventario': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  'Procesos contables': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'Recursos humanos': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  'Marketing y ventas': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055zM17 6h3m-3 3h3M2 11h2m8-8v2m0 6h10',
  'Logística y envíos': 'M13 10V3L4 14h7v7l9-11h-7z',
  'Análisis de datos': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'Comunicación interna': 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  'Documentación y reportes': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
};

const getData = (locale) => locale === 'en'
  ? {
      metrics: METRICS_EN, standards: STANDARDS_EN, questions: QUESTIONS_EN, levels: LEVELS_EN,
      processToSolutions: PROCESS_TO_SOLUTIONS_EN, cases: CASES_EN,
      procesosOptions: PROCESOS_OPTIONS_EN, industrias: INDUSTRIAS_EN,
      arquitecturasPredefinidas: ARQUITECTURAS_PREDEFINIDAS_EN,
      sectorOptions: SECTOR_OPTIONS_EN,
    }
  : {
      metrics: METRICS_ES, standards: STANDARDS_ES, questions: QUESTIONS_ES, levels: LEVELS_ES,
      processToSolutions: PROCESS_TO_SOLUTIONS_ES, cases: CASES_ES,
      procesosOptions: PROCESOS_OPTIONS_ES, industrias: INDUSTRIAS_ES,
      arquitecturasPredefinidas: ARQUITECTURAS_PREDEFINIDAS,
      sectorOptions: SECTOR_OPTIONS_ES,
    };

export const getMetrics = (locale) => getData(locale).metrics;
export const getStandards = (locale) => getData(locale).standards;
export const getQuestions = (locale) => getData(locale).questions;
export const getLevels = (locale) => getData(locale).levels;
export const getProcessToSolutions = (locale) => getData(locale).processToSolutions;
export const getCases = (locale) => getData(locale).cases;
export const getProcesosOptions = (locale) => getData(locale).procesosOptions;
export const getIndustrias = (locale) => getData(locale).industrias;
export const getArquitecturasPredefinidas = (locale) => getData(locale).arquitecturasPredefinidas;
export const getSectorOptions = (locale) => getData(locale).sectorOptions;
export const getProcesoIcons = () => PROCESO_ICONS_MAP;
