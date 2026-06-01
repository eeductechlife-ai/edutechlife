export const MODULE_5_ES = {
    objective: "Aprende a usar la IA de forma responsable, ética y legal con frameworks que las empresas exigen hoy.",
    learningPoints: [
      { text: "Detectar sesgos algorítmicos", icon: "fa-shield-check" },
      { text: "Conocer la regulación IA vigente", icon: "fa-briefcase" },
      { text: "Proteger datos y privacidad", icon: "fa-lock" },
      { text: "Crear protocolos éticos de IA", icon: "fa-clipboard-check" }
    ],
    overviewData: {
      title: "IA Responsable y Ética",
      description: "En este módulo final, desarrollarás pensamiento crítico sobre los impactos éticos de la IA. Aprenderás a identificar sesgos, cumplir regulaciones y crear frameworks de IA responsable.",
      mission: "Convertirte en un profesional de IA ético y responsable. Este módulo cierra tu certificación global con las competencias que las empresas buscan hoy.",
      topics: [
        { title: "Ética en la Inteligencia Artificial", icon: "fa-balance-scale", resources: 3, duration: "20 min" },
        { title: "Sesgos Algorítmicos y Equidad", icon: "fa-exclamation-triangle", resources: 3, duration: "20 min" },
        { title: "Privacidad, Regulación y IA Responsable", icon: "fa-shield-alt", resources: 2, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Ética en la Inteligencia Artificial",
        description: "Fundamentos éticos para el uso de IA generativa",
        detailedDescription: "Fundamentos éticos para el uso de IA generativa. Comprende los principios de transparencia, equidad, responsabilidad y privacidad que todo profesional debe aplicar al trabajar con IA.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444"
      },
      {
        id: 2,
        title: "Sesgos Algorítmicos y Equidad",
        description: "Identifica y mitiga sesgos en sistemas de IA",
        detailedDescription: "Identifica y mitiga sesgos en sistemas de IA. Aprende a detectar discriminación algorítmica, entender sus causas y aplicar estrategias para crear sistemas más justos e inclusivos.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316"
      },
      {
        id: 3,
        title: "Privacidad, Regulación y IA Responsable",
        description: "Marco legal y mejores prácticas de IA ética",
        detailedDescription: "Marco legal y mejores prácticas de IA ética. Conoce la regulación vigente (AI Act de la UE, leyes locales), protección de datos y cómo diseñar frameworks de gobernanza de IA en tu organización.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal",
        objectiveDesc: "Desarrollar un marco ético sólido para el uso de IA generativa que proteja a usuarios, organizaciones y la sociedad.",
        achievements: [
          { icon: "fa-check", text: "Comprender los principios éticos fundamentales de la IA" },
          { icon: "fa-check", text: "Identificar dilemas éticos en casos reales" },
          { icon: "fa-check", text: "Aplicar un checklist ético antes de usar IA" }
        ],
        warnings: [
          { icon: "fa-times", text: "Usar IA sin considerar el impacto en las personas" },
          { icon: "fa-times", text: "Asumir que la IA es neutral por ser tecnología" },
          { icon: "fa-times", text: "Ignorar las consecuencias no intencionadas" }
        ],
        example: {
          label: "Caso ético real",
          weak: "❌ Sin ética: Generar contenido falso con IA y publicarlo como real",
          strong: "✅ Con ética: Siempre divulgar cuando se usa IA, verificar la información generada, respetar derechos de autor y proteger datos personales"
        }
      },
      2: {
        objective: "⚖️ Sesgos Algorítmicos: El Enemigo Invisible",
        objectiveDesc: "Aprende a detectar, entender y mitigar los sesgos que los sistemas de IA heredan de sus datos de entrenamiento.",
        achievements: [
          { icon: "fa-check", text: "Identificar tipos de sesgos algorítmicos" },
          { icon: "fa-check", text: "Analizar casos reales de discriminación por IA" },
          { icon: "fa-check", text: "Aplicar técnicas de mitigación de sesgos" }
        ],
        warnings: [
          { icon: "fa-times", text: "Confiar en resultados sin verificar equidad" },
          { icon: "fa-times", text: "Usar datos de entrenamiento no representativos" },
          { icon: "fa-times", text: "No auditar los outputs de IA regularmente" }
        ],
        example: {
          label: "Caso real de sesgo",
          weak: "❌ Sesgado: IA de contratación que rechaza candidatos por género basada en datos históricos sesgados",
          strong: "✅ Equitativo: Auditar el dataset de entrenamiento, incluir variables de equidad, testear con grupos diversos y revisar resultados periódicamente"
        }
      },
      3: {
        objective: "🔒 Regulación y Gobernanza: El Marco Legal de la IA",
        objectiveDesc: "Conoce las regulaciones vigentes sobre IA y aprende a diseñar protocolos de gobernanza que protejan a tu organización.",
        achievements: [
          { icon: "fa-check", text: "Conocer el AI Act de la Unión Europea" },
          { icon: "fa-check", text: "Entender las obligaciones de privacidad y transparencia" },
          { icon: "fa-check", text: "Diseñar un protocolo ético de IA para tu organización" }
        ],
        warnings: [
          { icon: "fa-times", text: "Ignorar la regulación vigente de IA" },
          { icon: "fa-times", text: "No proteger datos personales en procesos con IA" },
          { icon: "fa-times", text: "Implementar IA sin políticas de gobernanza" }
        ],
        example: {
          label: "Ejemplo de protocolo",
          weak: "❌ Sin protocolo: Usar IA para todo sin supervisión ni auditoría",
          strong: "✅ Con protocolo: Comité de ética de IA, auditorías trimestrales, checklist de privacidad antes de cada implementación, divulgación transparente al usuario final"
        }
      }
    }
};

export const MODULE_5_EN = {
    objective: "Learn to use AI responsibly, ethically, and legally with frameworks that companies demand today.",
    learningPoints: [
      { text: "Detect algorithmic biases", icon: "fa-shield-check" },
      { text: "Know current AI regulations", icon: "fa-briefcase" },
      { text: "Protect data and privacy", icon: "fa-lock" },
      { text: "Create ethical AI protocols", icon: "fa-clipboard-check" }
    ],
    overviewData: {
      title: "Responsible and Ethical AI",
      description: "In this final module, you will develop critical thinking about the ethical impacts of AI. Learn to identify biases, comply with regulations, and create responsible AI frameworks.",
      mission: "Become an ethical and responsible AI professional. This module completes your global certification with the skills companies are looking for today.",
      topics: [
        { title: "Ethics in Artificial Intelligence", icon: "fa-balance-scale", resources: 3, duration: "20 min" },
        { title: "Algorithmic Biases and Fairness", icon: "fa-exclamation-triangle", resources: 3, duration: "20 min" },
        { title: "Privacy, Regulation, and Responsible AI", icon: "fa-shield-alt", resources: 2, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Ethics in Artificial Intelligence",
        description: "Ethical foundations for using generative AI",
        detailedDescription: "Ethical foundations for using generative AI. Understand the principles of transparency, fairness, accountability, and privacy that every professional must apply when working with AI.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444"
      },
      {
        id: 2,
        title: "Algorithmic Biases and Fairness",
        description: "Identify and mitigate biases in AI systems",
        detailedDescription: "Identify and mitigate biases in AI systems. Learn to detect algorithmic discrimination, understand its causes, and apply strategies to create fairer and more inclusive systems.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316"
      },
      {
        id: 3,
        title: "Privacy, Regulation, and Responsible AI",
        description: "Legal framework and best practices for ethical AI",
        detailedDescription: "Legal framework and best practices for ethical AI. Learn about current regulations (EU AI Act, local laws), data protection, and how to design AI governance frameworks in your organization.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc: "Develop a solid ethical framework for using generative AI that protects users, organizations, and society.",
        achievements: [
          { icon: "fa-check", text: "Understand the fundamental ethical principles of AI" },
          { icon: "fa-check", text: "Identify ethical dilemmas in real-world cases" },
          { icon: "fa-check", text: "Apply an ethical checklist before using AI" }
        ],
        warnings: [
          { icon: "fa-times", text: "Using AI without considering the impact on people" },
          { icon: "fa-times", text: "Assuming AI is neutral because it's technology" },
          { icon: "fa-times", text: "Ignoring unintended consequences" }
        ],
        example: {
          label: "Real ethical case",
          weak: "❌ Unethical: Generating fake content with AI and publishing it as real",
          strong: "✅ Ethical: Always disclosing when AI is used, verifying generated information, respecting copyright, and protecting personal data"
        }
      },
      2: {
        objective: "⚖️ Algorithmic Biases: The Invisible Enemy",
        objectiveDesc: "Learn to detect, understand, and mitigate the biases that AI systems inherit from their training data.",
        achievements: [
          { icon: "fa-check", text: "Identify types of algorithmic biases" },
          { icon: "fa-check", text: "Analyze real cases of AI discrimination" },
          { icon: "fa-check", text: "Apply bias mitigation techniques" }
        ],
        warnings: [
          { icon: "fa-times", text: "Trusting results without verifying fairness" },
          { icon: "fa-times", text: "Using non-representative training data" },
          { icon: "fa-times", text: "Not auditing AI outputs regularly" }
        ],
        example: {
          label: "Real bias case",
          weak: "❌ Biased: AI recruiting tool that rejects candidates based on gender, trained on biased historical data",
          strong: "✅ Fair: Audit the training dataset, include fairness variables, test with diverse groups, and review results periodically"
        }
      },
      3: {
        objective: "🔒 Regulation and Governance: The Legal Framework of AI",
        objectiveDesc: "Learn about current AI regulations and how to design governance protocols that protect your organization.",
        achievements: [
          { icon: "fa-check", text: "Know the European Union AI Act" },
          { icon: "fa-check", text: "Understand privacy and transparency obligations" },
          { icon: "fa-check", text: "Design an ethical AI protocol for your organization" }
        ],
        warnings: [
          { icon: "fa-times", text: "Ignoring current AI regulations" },
          { icon: "fa-times", text: "Not protecting personal data in AI processes" },
          { icon: "fa-times", text: "Implementing AI without governance policies" }
        ],
        example: {
          label: "Protocol example",
          weak: "❌ No protocol: Using AI for everything without supervision or audits",
          strong: "✅ With protocol: AI ethics committee, quarterly audits, privacy checklist before each implementation, transparent disclosure to end users"
        }
      }
    }
};
