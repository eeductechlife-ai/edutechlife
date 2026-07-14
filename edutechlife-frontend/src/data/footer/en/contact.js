export const helpArticles = [
  {
    id: "inicio-rapido",
    titulo: "Quick Start Guide",
    descripcion: "First steps with the platform",
    icono: "fa-rocket",
    tiempo: "5 min",
  },
  {
    id: "manual-ia",
    titulo: "AI Tools Manual",
    descripcion: "IA Lab features and configuration",
    icono: "fa-robot",
    tiempo: "12 min",
  },
  {
    id: "tutorial-smartboard",
    titulo: "SmartBoard Tutorial",
    descripcion: "Setup and use of interactive whiteboard",
    icono: "fa-chalkboard",
    tiempo: "8 min",
  },
  {
    id: "api-docs",
    titulo: "API Documentation",
    descripcion: "Integration with external systems",
    icono: "fa-code",
    tiempo: "15 min",
  },
  {
    id: "faq",
    titulo: "Frequent FAQs",
    descripcion: "Common questions and answers",
    icono: "fa-circle-question",
    tiempo: "3 min",
  },
];

export const helpIntro =
  "Access all the documentation needed to implement and make the most of Edutechlife tools.";
export const helpSubtitle = "Manuals, guides and technical resources";
export const helpNeedHelp = "Need more help?";
export const helpNeedHelpDesc =
  "Contact our support team for personalized technical assistance.";

export const helpArticleContents = {
  "inicio-rapido": {
    titulo: "Quick Start Guide",
    introduccion:
      "Welcome to Edutechlife. This guide will walk you through the first steps to start using the platform effectively. In less than 10 minutes you'll be able to navigate and use the main tools.",
    secciones: [
      {
        titulo: "1. Create Your Account",
        contenido:
          "The first step is to create your Edutechlife account. Visit the registration page and enter your institutional email. You'll receive a verification email in less than 2 minutes.",
        pasos: [
          'Go to edutechlife.com and click "Sign Up"',
          "Enter your institutional email",
          "Create a secure password (minimum 8 characters)",
          "Verify your email address",
          "Complete your profile with academic information",
        ],
      },
      {
        titulo: "2. Exploring the Dashboard",
        contenido:
          "Once logged in, you'll arrive at the main Dashboard. Here you'll find: main navigation on the left, metrics panel in the center, and quick access to tools at the top.",
        imagen:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      },
      {
        titulo: "3. Your First IA Lab Session",
        contenido:
          'IA Lab is your artificial intelligence assistant. To start your first session: select "IA Lab" from the tools menu, choose your preferred AI model, type your first query in the text field.',
        consejos: [
          "Be specific in your questions for better results",
          "Use predefined prompts to get started",
          "Save your conversations for future reference",
        ],
      },
      {
        titulo: "4. Configure Your Environment",
        contenido:
          "Personalize your Edutechlife experience: access Settings from the menu, adjust language and time zone, configure notification preferences, link your institutional calendar.",
      },
      {
        titulo: "5. Next Steps",
        contenido:
          "Once basic setup is complete, we recommend: exploring the VAK diagnostic to personalize your learning, reviewing SmartBoard tutorials if you plan to use interactive whiteboards, checking the automation section to optimize processes.",
      },
    ],
  },
  "manual-ia": {
    titulo: "AI Tools Manual",
    introduccion:
      "IA Lab is the artificial intelligence core of Edutechlife. This guide teaches you how to configure and use all AI capabilities to enhance your educational practice.",
    secciones: [
      {
        titulo: "Introduction to IA Lab",
        contenido:
          "IA Lab integrates advanced AI models to assist in educational content creation, data analysis, and learning personalization. The system supports multiple languages including Spanish, English, and Portuguese.",
        grafica: "dona",
        datos: [
          { nombre: "Content generation", valor: 35 },
          { nombre: "Analysis & assessment", valor: 30 },
          { nombre: "Pedagogical advising", valor: 25 },
          { nombre: "Research", valor: 10 },
        ],
        unidad: "Usage",
      },
      {
        titulo: "Model Configuration",
        contenido:
          "Edutechlife offers multiple AI models optimized for different educational purposes. Selecting the right model can significantly improve your results.",
        modelos: [
          {
            nombre: "Valerio",
            descripcion:
              "Pedagogical assistant specialized in educational methodologies",
            caso: "Lesson plan creation",
          },
          {
            nombre: "Analytic",
            descripcion: "Student data analysis and report generation",
            caso: "Learning pattern identification",
          },
          {
            nombre: "Creator",
            descripcion: "Diverse educational content generation",
            caso: "Teaching materials",
          },
          {
            nombre: "Researcher",
            descripcion: "Academic information search and synthesis",
            caso: "Literature review",
          },
        ],
      },
      {
        titulo: "Custom Prompts",
        contenido:
          "Prompts are instructions that guide AI to generate specific responses. Edutechlife includes a library of prompts optimized for different educational scenarios.",
        lista: [
          "Prompts for assessment generation",
          "Prompts for rubric creation",
          "Prompts for activity design",
          "Prompts for automated feedback",
        ],
      },
      {
        titulo: "Advanced Configuration",
        contenido:
          "For advanced users, IA Lab allows adjusting parameters such as: temperature (creativity vs precision), response length, detail level, output format.",
        grafica: "barras",
        datos: [
          { categoria: "Productivity", antes: 45, despues: 82 },
          { categoria: "Content quality", antes: 60, despues: 91 },
          { categoria: "Prep time", antes: 100, despues: 35 },
        ],
        unidad: "%",
      },
      {
        titulo: "Integration with Valerio",
        contenido:
          "Valerio is Edutechlife's intelligent avatar that combines coaching techniques with AI. Compatible with IA Lab, Valerio provides contextualized responses based on best pedagogical practices.",
      },
    ],
  },
  "tutorial-smartboard": {
    titulo: "SmartBoard Tutorial",
    introduccion:
      "SmartBoard is Edutechlife's intelligent interactive whiteboard solution. This guide will help you set up and use all features to maximize your students' engagement.",
    secciones: [
      {
        titulo: "Technical Specifications",
        contenido:
          "Before starting, know your SmartBoard specifications: 4K multi-touch screen, 65-86 inch size, high-precision infrared technology, HDMI, USB-C and WiFi 6 connectivity.",
        especificacion: [
          { label: "Resolution", valor: "3840 x 2160 (4K)" },
          { label: "Touch", valor: "20 simultaneous points" },
          { label: "Response time", valor: "< 8ms" },
          { label: "Brightness", valor: "400 cd/m²" },
          { label: "Connectivity", valor: "HDMI 2.0, USB-C, WiFi 6" },
        ],
      },
      {
        titulo: "Installation and Setup",
        contenido:
          "The installation process includes: wall mounting or mobile stand, power and data cable connection, initial screen calibration, pairing with Edutechlife software.",
        pasos: [
          "Unpack the SmartBoard and verify all components",
          "Install the stand following manufacturer instructions",
          "Connect the HDMI cable to the corresponding port",
          "Turn on the device and wait for the system to load",
          "Download and install the Edutechlife app from the download center",
        ],
      },
      {
        titulo: "Interactive Tools",
        contenido:
          "SmartBoard includes a complete set of tools: infinite collaborative canvas, handwriting recognition, geometric tools, image editor, session recording.",
        grafica: "linea",
        datos: [
          { anio: "2024", engagement: 65 },
          { anio: "2025", engagement: 78 },
          { anio: "2026", engagement: 92 },
        ],
        unidad: "% Engagement",
      },
      {
        titulo: "Device Integration",
        contenido:
          "Maximize functionality by connecting additional devices: student tablets for content sharing, voting systems for real-time assessments, enhanced audio systems for conferences.",
        opciones: [
          "QR code connection for screen sharing",
          "Bluetooth pairing for remote control",
          "Sync with Google Classroom and Microsoft Teams",
        ],
      },
      {
        titulo: "Common Problem Solving",
        contenido:
          "Frequent issues and their solutions: Screen not responding - check connections and restart; WiFi connection fails - move router closer or use Ethernet cable; Touch not working - recalibrate from settings.",
        faqs: [
          {
            q: "Can I use SmartBoard without internet?",
            a: "Yes, basic functions work offline",
          },
          {
            q: "How many devices can I connect?",
            a: "Up to 50 devices simultaneously",
          },
          {
            q: "Is the software compatible with Mac?",
            a: "Fully compatible with macOS 12+",
          },
        ],
      },
    ],
  },
  "api-docs": {
    titulo: "API Documentation",
    introduccion:
      "The Edutechlife API allows integrating our functionalities with your existing systems. This documentation is designed for developers who need to connect LMS, academic management systems, or custom applications.",
    secciones: [
      {
        titulo: "General Information",
        contenido:
          "The Edutechlife API follows RESTful architecture with JWT authentication. All endpoints require a valid API key that you can obtain from the admin panel.",
        detalle: {
          base: "https://api.edutechlife.com/v1",
          formato: "JSON",
          autenticacion: "Bearer Token (JWT)",
          version: "v1 (current)",
        },
      },
      {
        titulo: "Main Endpoints",
        contenido:
          "Available endpoints cover the platform's main functionalities. Below are the most commonly used ones:",
        endpoints: [
          { metodo: "GET", ruta: "/users", descripcion: "List all users" },
          { metodo: "POST", ruta: "/users", descripcion: "Create a new user" },
          {
            metodo: "GET",
            ruta: "/students/{id}",
            descripcion: "Get student data",
          },
          {
            metodo: "PUT",
            ruta: "/students/{id}",
            descripcion: "Update student information",
          },
          {
            metodo: "GET",
            ruta: "/results/vak",
            descripcion: "Get VAK diagnostic results",
          },
          {
            metodo: "POST",
            ruta: "/ai/chat",
            descripcion: "Send message to AI chat",
          },
        ],
      },
      {
        titulo: "Authentication Example",
        contenido:
          "To authenticate with the API, include the token in the header of each request:",
        codigo: `// JavaScript - Fetch
const response = await fetch('https://api.edutechlife.com/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        lenguaje: "JavaScript",
      },
      {
        titulo: "LMS Integration",
        contenido:
          "Edutechlife integrates natively with major learning management systems:",
        integraciones: [
          { lms: "Moodle", tipo: "Plugin available", estado: "Production" },
          { lms: "Canvas", tipo: "REST API", estado: "Production" },
          { lms: "Blackboard", tipo: "LTI 1.3", estado: "Beta" },
          { lms: "Google Classroom", tipo: "OAuth API", estado: "Production" },
        ],
      },
      {
        titulo: "Rate Limits and Best Practices",
        contenido:
          "To ensure service stability, we apply usage limits: 1000 requests/hour per API key, 100 requests/minute on AI endpoints. We recommend implementing local cache and webhooks for asynchronous notifications.",
        grafica: "barras",
        datos: [
          { categoria: "Free", valor: 100 },
          { categoria: "Professional", valor: 1000 },
          { categoria: "Institutional", valor: 10000 },
          { categoria: "Enterprise", valor: 100000 },
        ],
        unidad: "Requests/hour",
      },
    ],
  },
  faq: {
    titulo: "Frequent FAQs",
    introduccion:
      "Here you'll find answers to the most frequently asked questions about Edutechlife. If you don't find the answer you're looking for, contact our support team.",
    secciones: [
      {
        titulo: "Account and Billing",
        contenido: "",
        faqs: [
          {
            q: "How can I change my subscription plan?",
            a: "From Settings > Subscription you can change your plan at any time. The change takes effect at the next billing cycle.",
          },
          {
            q: "What payment methods do you accept?",
            a: "We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans.",
          },
          {
            q: "Can I get a tax invoice?",
            a: "Yes, all transactions include a tax invoice. Download it from Settings > Billing.",
          },
          {
            q: "What happens if I exceed my user limit?",
            a: "We'll notify you when you reach 80% of your limit. You can upgrade your plan or wait until the next cycle.",
          },
        ],
      },
      {
        titulo: "Technical",
        contenido: "",
        faqs: [
          {
            q: "Which browsers are supported?",
            a: "Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. We recommend Chrome for best performance.",
          },
          {
            q: "Does Edutechlife work offline?",
            a: "Some basic functions work offline. It will sync automatically when you reconnect.",
          },
          {
            q: "Is my data secure?",
            a: "We use AES-256 encryption, GDPR compliance, and SOC 2 Type II. Your data is never shared.",
          },
          {
            q: "Can I export my data?",
            a: "Yes, from Settings > Data you can export in CSV, PDF, or Excel format.",
          },
        ],
      },
      {
        titulo: "Pedagogical",
        contenido: "",
        faqs: [
          {
            q: "Is the VAK diagnostic free?",
            a: "The basic diagnostic is free. The full version with detailed analysis requires a Professional plan.",
          },
          {
            q: "Can I use Edutechlife for online education?",
            a: "Absolutely. All our tools are optimized for in-person, hybrid, and remote environments.",
          },
          {
            q: "How do I measure ROI from using the platform?",
            a: "We include an ROI Calculator that analyzes performance metrics, engagement, and administrative time reduction.",
          },
          {
            q: "Are the certifications officially valid?",
            a: "Our certifications are issued by Edutechlife and recognized by partner educational institutions.",
          },
        ],
      },
      {
        titulo: "Support",
        contenido: "",
        faqs: [
          {
            q: "How do I contact support?",
            a: "Via live chat (available 24/7), email at support@edutechlife.com, or through the form in the Help Center.",
          },
          {
            q: "Do you offer training for institutions?",
            a: "Yes, we offer virtual and in-person training for institutional implementations.",
          },
          {
            q: "What is the response time?",
            a: "Free plan: 48h, Professional: 24h, Enterprise: 4h with dedicated account manager.",
          },
        ],
      },
    ],
  },
};
