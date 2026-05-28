export const vakContent = {
  subtitle: 'Visual, Auditory and Kinesthetic Learning',
  description: 'The VAK methodology identifies each student\'s predominant learning style, enabling personalized education that maximizes cognitive potential and knowledge retention.',
  styles: [
    { icon: 'fa-eye', title: 'Visual', description: 'Learns best with images, diagrams and videos. Remembers what they see.' },
    { icon: 'fa-headphones', title: 'Auditory', description: 'Learns best by listening, discussing and explaining concepts out loud.' },
    { icon: 'fa-hand', title: 'Kinesthetic', description: 'Learns best by doing, touching and experimenting with hands-on materials.' }
  ],
  calloutTitle: 'VAK Diagnosis at Edutechlife',
  calloutDesc: 'Take our free diagnostic to discover your learning style and receive personalized study recommendations.'
};

export const certificationsContent = {
  subtitle: 'Official competency recognition',
  description: 'Earn recognized certifications that validate your skills in educational technologies and cutting-edge pedagogical methodologies.',
  list: [
    { titulo: 'AI in Education Certification', descripcion: 'Implementation of artificial intelligence in pedagogical environments', nivel: 'Advanced' },
    { titulo: 'VAK Premium Methodology', descripcion: 'Mastery of multimodal learning techniques', nivel: 'Intermediate' },
    { titulo: 'EdTech Integration Specialist', descripcion: 'Integration of technological tools in the classroom', nivel: 'Beginner' },
    { titulo: 'SmartBoard Master', descripcion: 'Certification in intelligent interactive whiteboards', nivel: 'Intermediate' },
    { titulo: 'Educational Neuro-Environment', descripcion: 'Design of neuroscience-based learning environments', nivel: 'Advanced' }
  ],
  calloutTitle: 'Interested in getting certified?',
  calloutDesc: 'Contact us for more information on upcoming certification programs.'
};

export const blogArticles = [
  { id: 'ia-educacion', titulo: 'The Future of AI in Education', fecha: 'Mar 15, 2026', categoria: 'Artificial Intelligence', autor: 'Dr. Carlos Mendoza', tiempoLectura: '8 min' },
  { id: 'vak-aula', titulo: 'How to Implement VAK in the Classroom', fecha: 'Mar 10, 2026', categoria: 'Methodology', autor: 'Lic. Ana Sofía Torres', tiempoLectura: '6 min' },
  { id: 'smartboard', titulo: 'SmartBoard: Complete 2026 Guide', fecha: 'Mar 5, 2026', categoria: 'Tools', autor: 'Eng. Roberto Chen', tiempoLectura: '7 min' },
  { id: 'neurociencia', titulo: 'Neuroscience and Effective Learning', fecha: 'Feb 28, 2026', categoria: 'Neuro-Environment', autor: 'Dr. Patricia Vázquez', tiempoLectura: '9 min' },
  { id: 'automatizacion', titulo: 'Educational Process Automation', fecha: 'Feb 20, 2026', categoria: 'Automation', autor: 'Mg. Luis Hernández', tiempoLectura: '5 min' }
];

export const blogArticleContents = {
  'ia-educacion': {
    titulo: 'The Future of AI in Education',
    imagen: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    introduccion: 'Artificial intelligence is radically transforming the global education landscape. According to UNESCO\'s 2025 report, 85% of educational institutions will implement some form of AI by 2027, representing a $400 billion market.',
    secciones: [
      {
        titulo: 'Global AI Adoption in Education',
        contenido: 'Data shows exponential growth in AI technology adoption across the education sector. A HolonIQ study reveals EdTech investment reached $18.2 billion in 2024, with projections of $400 billion by 2027.',
        grafica: 'linea',
        datos: [
          { anio: '2023', valor: 95 },
          { anio: '2024', valor: 142 },
          { anio: '2025', valor: 220 },
          { anio: '2026', valor: 310 },
          { anio: '2027', valor: 400 }
        ],
        unidad: 'Billion USD'
      },
      {
        titulo: 'Success Stories in Top Universities',
        contenido: 'Leading universities have implemented AI with extraordinary results. Stanford reported a 35% improvement in student retention through AI tutoring systems. MIT developed algorithms that predict at-risk students with 90% accuracy.',
        grafica: 'barras',
        datos: [
          { categoria: 'Stanford', mejora: 35 },
          { categoria: 'MIT', mejora: 28 },
          { categoria: 'Oxford', mejora: 32 },
          { categoria: 'Harvard', mejora: 40 },
          { categoria: 'Cambridge', mejora: 25 }
        ],
        unidad: '% Retention improvement'
      },
      {
        titulo: 'Impact on Learning',
        contenido: 'Meta-analysis studies show that students using AI tools improve their academic performance by an average of 25%. Personalized learning, impossible to achieve at scale without AI, allows content to be adapted to each student\'s pace.'
      },
      {
        titulo: 'Trends 2026-2030',
        contenido: 'Gartner predicts that by 2030, AI will be responsible for 40% of administrative educational tasks, freeing teachers to focus on mentorship and socio-emotional development of students.'
      }
    ],
    conclusion: 'AI will not replace educators, but those who master AI tools will replace those who do not. Digital transformation in education is inevitable, and institutions leading this adoption will define the future of learning.'
  },
  'vak-aula': {
    titulo: 'How to Implement VAK in the Classroom',
    imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    introduccion: 'The VAK (Visual, Auditory, Kinesthetic) methodology identifies each student\'s predominant learning style. Harvard University research shows that personalizing teaching according to learning style improves information retention by 30%.',
    secciones: [
      {
        titulo: 'The Three Learning Styles',
        contenido: 'According to Neil Fleming\'s model, there are three main perception channels: Visual (learn by seeing), Auditory (learn by listening), and Kinesthetic (learn by doing). Most people have a combination, though one style predominates.',
        grafica: 'dona',
        datos: [
          { nombre: 'Visual', valor: 45 },
          { nombre: 'Auditory', valor: 30 },
          { nombre: 'Kinesthetic', valor: 25 }
        ],
        unidad: '% Population'
      },
      {
        titulo: 'Step 1: Initial Diagnosis',
        contenido: 'Before implementing VAK, it is essential to identify each student\'s predominant style. The diagnosis should include: behavioral observation, preferences questionnaire, and academic performance analysis across different activities.',
        imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop'
      },
      {
        titulo: 'Step 2: Designing Multimodal Activities',
        contenido: 'Each lesson should include activities for all three styles. For content about the French Revolution: Visual (concept maps, timelines), Auditory (debates, podcasts, reading aloud), Kinesthetic (role-playing, simulations).',
        lista: [
          'Provide diagrams and infographics for visual learners',
          'Include podcasts and group discussions for auditory learners',
          'Design experiments and hands-on projects for kinesthetic learners'
        ]
      },
      {
        titulo: 'Step 3: Adaptive Assessment',
        contenido: 'Assessments should allow students to demonstrate knowledge in multiple ways: oral presentation (auditory), written report with graphics (visual), hands-on project (kinesthetic). This allows each student to show their true mastery.',
        grafica: 'barras',
        datos: [
          { categoria: 'Traditional', retention: 40 },
          { categoria: 'VAK', retention: 70 }
        ],
        unidad: '% Retention'
      },
      {
        titulo: 'Expected Results',
        contenido: 'Longitudinal studies in schools that implemented VAK over 3 years show: 30% higher information retention, 25% improvement in standardized assessments, 40% reduction in disruptive behaviors, 35% increase in student motivation.'
      }
    ],
    conclusion: 'Implementing VAK does not require advanced technology, but a methodological shift. Teachers must design diversified experiences that reach all styles, monitor results, and adjust strategies continuously.'
  },
  'smartboard': {
    titulo: 'SmartBoard: Complete 2026 Guide',
    imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    introduccion: 'Intelligent interactive whiteboards have evolved significantly. According to EdTech Magazine\'s 2025 report, institutions that implemented SmartBoards report a 40% increase in student participation and 28% improvement in understanding complex concepts.',
    secciones: [
      {
        titulo: 'Technological Evolution 2024-2026',
        contenido: 'Modern SmartBoards incorporate: 4K screens with precision touch, AI integration for handwriting recognition, mobile device connectivity, real-time collaboration software, and student engagement analytics.',
        grafica: 'linea',
        datos: [
          { anio: '2024', capacidad: 65 },
          { anio: '2025', capacidad: 78 },
          { anio: '2026', capacidad: 92 }
        ],
        unidad: '% Capabilities'
      },
      {
        titulo: 'Successful Implementation Cases',
        contenido: 'The American School of Mexico implemented 50 SmartBoards in 2023. Results after 18 months: 42% increase in participation, 31% improvement in mathematics, 89% of teachers reported positive satisfaction.',
        grafica: 'barras',
        datos: [
          { categoria: 'Participation', antes: 45, despues: 87 },
          { categoria: 'Understanding', antes: 52, despues: 78 },
          { categoria: 'Collaboration', antes: 38, despues: 82 }
        ],
        unidad: '%'
      },
      {
        titulo: 'Essential Features 2026',
        contenido: 'Features every SmartBoard should include: infinite collaborative canvas, institutional LMS integration, real-time assessment tools, student device compatibility, AI-powered attention pattern analysis.',
        lista: [
          'Collaborative whiteboard with cloud storage',
          'Native integration with Google Classroom and Microsoft Teams',
          'Real-time handwriting to text recognition',
          'Session recording for later review',
          'Engagement analysis with heatmaps'
        ]
      },
      {
        titulo: 'Educational ROI',
        contenido: 'Return on investment manifests across multiple areas: reduction of physical teaching materials (-35%), higher student retention (-20% dropout), preparation for professional digital environments, and efficiency in explaining abstract concepts.',
        grafica: 'barras',
        datos: [
          { categoria: 'ROI 1 year', valor: 145 },
          { categoria: 'ROI 3 years', valor: 280 },
          { categoria: 'ROI 5 years', valor: 420 }
        ],
        unidad: '%'
      }
    ],
    conclusion: 'Investing in SmartBoards is a strategic decision that positions institutions at the forefront of digital education. The initial cost is recouped in 18-24 months considering all quantifiable benefits.'
  },
  'neurociencia': {
    titulo: 'Neuroscience and Effective Learning',
    imagen: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop',
    introduccion: 'Educational neuroscience has revolutionized our understanding of learning. Stanford researchers (2025) demonstrate that understanding how the brain works enables designing pedagogical interventions up to 50% more effective.',
    secciones: [
      {
        titulo: 'Fundamental Principles of Neuro-Learning',
        contenido: 'The four key principles every educator should know: Neuroplasticity (the brain can change at any age), Memory consolidation (sleep is essential), Selective attention (limited to 20 min), and Transfer (learning in one context helps in others).',
        grafica: 'dona',
        datos: [
          { nombre: 'Neuroplasticity', valor: 30 },
          { nombre: 'Consolidation', valor: 25 },
          { nombre: 'Attention', valor: 25 },
          { nombre: 'Transfer', valor: 20 }
        ],
        unidad: 'Importance'
      },
      {
        titulo: 'The Neuroscience Learning Cycle',
        contenido: 'Based on research by Howard Gardner and Harvard neuroscientists, the optimal learning cycle includes: Activation of prior knowledge (5 min), Presentation of new content (15-20 min), Active processing (10 min), Consolidation through sleep or rest.',
        imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop'
      },
      {
        titulo: 'Recent Research (2024-2026)',
        contenido: 'Cambridge University studies (2025) show that interleaved learning (mixing topics) improves retention by 43% compared to blocked learning. Another MIT study shows that explaining concepts to others activates the same brain regions as learning them.',
        grafica: 'barras',
        datos: [
          { categoria: 'Blocked', retention: 45 },
          { categoria: 'Interleaved', retention: 72 },
          { categoria: 'Spaced', retention: 68 },
          { categoria: 'Active', retention: 78 }
        ],
        unidad: '% Retention'
      },
      {
        titulo: 'Evidence-Based Pedagogical Applications',
        contenido: 'Strategies with the strongest scientific evidence include: Spaced repetition (reviewing at increasing intervals), Retrieval practice (recalling information without help), Interleaving (mixing problem types), and Generation (creating your own questions).',
        lista: [
          'Apply the 10-5-2 rule: review at 10 min, 5 hours, 2 days',
          'Use self-assessment questions before reviewing',
          'Mix different topics in one session',
          'Ask students to generate exam questions'
        ]
      },
      {
        titulo: 'Optimal Learning Environments',
        contenido: 'Research shows environmental factors impact up to 25% of performance: Natural lighting (+15% performance), Temperature 68-75°F (attention peak), White noise or silence (vs music), Flexible spaces that allow movement.'
      }
    ],
    conclusion: 'Neuroscience is not just theory; it is a practical guide for optimizing every aspect of the educational process. Teachers who apply these evidence-based principles see significant improvements in their students\' learning.'
  },
  'automatizacion': {
    titulo: 'Educational Process Automation',
    imagen: 'https://images.unsplash.com/photo-1451015618060-fa747ccd567c?w=800&h=400&fit=crop',
    introduccion: 'Automation in education is no longer a luxury, it is a necessity. According to McKinsey (2025), institutions that automate administrative processes reduce operational costs by 35% and free up 60% of teachers\' time to focus on teaching.',
    secciones: [
      {
        titulo: 'Current State of Educational Automation',
        contenido: 'The EDUCAUSE 2025 report reveals that 67% of universities have implemented some level of automation, but only 23% have achieved advanced automation. Areas with highest adoption are: enrollments, grading, and communications.',
        grafica: 'barras',
        datos: [
          { categoria: 'Enrollments', avance: 85 },
          { categoria: 'Grading', avance: 78 },
          { categoria: 'Communication', avance: 65 },
          { categoria: 'Assessment', avance: 45 },
          { categoria: 'Personalization', avance: 30 }
        ],
        unidad: '% Implementation'
      },
      {
        titulo: 'Highest Impact Automation Processes',
        contenido: 'We identified the 5 processes with highest ROI: Automated feedback delivery (saves 8 hours/week), Intelligent assessment scheduling (reduces conflicts by 90%), Automated progress tracking (identifies at-risk students), Admissions chatbots (24/7 availability), Institutional report generation.',
        lista: [
          'Personalized AI-powered automatic feedback',
          'Academic scheduling algorithms',
          'Student progress dashboards',
          'Virtual assistants for students',
          'Automatic accreditation reports'
        ]
      },
      {
        titulo: 'Efficiency Metrics by Area',
        contenido: 'Institutions that implemented full automation report: Admissions -50% processing time, Assessment -70% grading time, Communication -40% notification time, Reporting -80% report generation time.',
        grafica: 'linea',
        datos: [
          { anio: '2023', tiempo: 100 },
          { anio: '2024', tiempo: 82 },
          { anio: '2025', tiempo: 58 },
          { anio: '2026', tiempo: 40 }
        ],
        unidad: '% Administrative time'
      },
      {
        titulo: 'Success Stories in Institutions',
        contenido: 'The Technological University of Mexico automated its admissions process in 2024. Result: Response time reduced from 15 days to 48 hours, Candidate satisfaction increased from 72% to 94%, Cost per admission reduced by 40%.',
        grafica: 'barras',
        datos: [
          { categoria: 'Time', antes: 15, despues: 2 },
          { categoria: 'Satisfaction', antes: 72, despues: 94 },
          { categoria: 'Cost', antes: 100, despues: 60 }
        ],
        unidad: 'Days / % / %'
      },
      {
        titulo: 'Educational Automation Trends 2026',
        contenido: 'Emerging trends include: Workflow automation with generative AI, Tutoring-capable chatbots, ML-powered dropout prediction, Massive personalization of learning paths, Blockchain integration for credentials.'
      }
    ],
    conclusion: 'Automation does not mean less personalized education; it means more time for meaningful human interaction. Institutions that adopt these tools today will be better positioned to compete in an increasingly digitalized education market.'
  }
};

export const helpArticles = [
  { id: 'inicio-rapido', titulo: 'Quick Start Guide', descripcion: 'First steps with the platform', icono: 'fa-rocket', tiempo: '5 min' },
  { id: 'manual-ia', titulo: 'AI Tools Manual', descripcion: 'IA Lab features and configuration', icono: 'fa-robot', tiempo: '12 min' },
  { id: 'tutorial-smartboard', titulo: 'SmartBoard Tutorial', descripcion: 'Setup and use of interactive whiteboard', icono: 'fa-chalkboard', tiempo: '8 min' },
  { id: 'api-docs', titulo: 'API Documentation', descripcion: 'Integration with external systems', icono: 'fa-code', tiempo: '15 min' },
  { id: 'faq', titulo: 'Frequent FAQs', descripcion: 'Common questions and answers', icono: 'fa-circle-question', tiempo: '3 min' }
];

export const blogIntro = 'Explore our latest articles on educational trends, technology, and pedagogical innovation.';
export const blogSubtitle = 'Articles, news and resources';

export const helpIntro = 'Access all the documentation needed to implement and make the most of Edutechlife tools.';
export const helpSubtitle = 'Manuals, guides and technical resources';
export const helpNeedHelp = 'Need more help?';
export const helpNeedHelpDesc = 'Contact our support team for personalized technical assistance.';

export const privacyLastUpdate = 'Last updated: March 15, 2026';
export const termsLastUpdate = 'Last updated: March 15, 2026';

export const helpArticleContents = {
  'inicio-rapido': {
    titulo: 'Quick Start Guide',
    introduccion: 'Welcome to Edutechlife. This guide will walk you through the first steps to start using the platform effectively. In less than 10 minutes you\'ll be able to navigate and use the main tools.',
    secciones: [
      {
        titulo: '1. Create Your Account',
        contenido: 'The first step is to create your Edutechlife account. Visit the registration page and enter your institutional email. You\'ll receive a verification email in less than 2 minutes.',
        pasos: [
          'Go to edutechlife.com and click "Sign Up"',
          'Enter your institutional email',
          'Create a secure password (minimum 8 characters)',
          'Verify your email address',
          'Complete your profile with academic information'
        ]
      },
      {
        titulo: '2. Exploring the Dashboard',
        contenido: 'Once logged in, you\'ll arrive at the main Dashboard. Here you\'ll find: main navigation on the left, metrics panel in the center, and quick access to tools at the top.',
        imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
      },
      {
        titulo: '3. Your First IA Lab Session',
        contenido: 'IA Lab is your artificial intelligence assistant. To start your first session: select "IA Lab" from the tools menu, choose your preferred AI model, type your first query in the text field.',
        consejos: [
          'Be specific in your questions for better results',
          'Use predefined prompts to get started',
          'Save your conversations for future reference'
        ]
      },
      {
        titulo: '4. Configure Your Environment',
        contenido: 'Personalize your Edutechlife experience: access Settings from the menu, adjust language and time zone, configure notification preferences, link your institutional calendar.'
      },
      {
        titulo: '5. Next Steps',
        contenido: 'Once basic setup is complete, we recommend: exploring the VAK diagnostic to personalize your learning, reviewing SmartBoard tutorials if you plan to use interactive whiteboards, checking the automation section to optimize processes.'
      }
    ]
  },
  'manual-ia': {
    titulo: 'AI Tools Manual',
    introduccion: 'IA Lab is the artificial intelligence core of Edutechlife. This guide teaches you how to configure and use all AI capabilities to enhance your educational practice.',
    secciones: [
      {
        titulo: 'Introduction to IA Lab',
        contenido: 'IA Lab integrates advanced AI models to assist in educational content creation, data analysis, and learning personalization. The system supports multiple languages including Spanish, English, and Portuguese.',
        grafica: 'dona',
        datos: [
          { nombre: 'Content generation', valor: 35 },
          { nombre: 'Analysis & assessment', valor: 30 },
          { nombre: 'Pedagogical advising', valor: 25 },
          { nombre: 'Research', valor: 10 }
        ],
        unidad: 'Usage'
      },
      {
        titulo: 'Model Configuration',
        contenido: 'Edutechlife offers multiple AI models optimized for different educational purposes. Selecting the right model can significantly improve your results.',
        modelos: [
          { nombre: 'Valerio', descripcion: 'Pedagogical assistant specialized in educational methodologies', caso: 'Lesson plan creation' },
          { nombre: 'Analytic', descripcion: 'Student data analysis and report generation', caso: 'Learning pattern identification' },
          { nombre: 'Creator', descripcion: 'Diverse educational content generation', caso: 'Teaching materials' },
          { nombre: 'Researcher', descripcion: 'Academic information search and synthesis', caso: 'Literature review' }
        ]
      },
      {
        titulo: 'Custom Prompts',
        contenido: 'Prompts are instructions that guide AI to generate specific responses. Edutechlife includes a library of prompts optimized for different educational scenarios.',
        lista: [
          'Prompts for assessment generation',
          'Prompts for rubric creation',
          'Prompts for activity design',
          'Prompts for automated feedback'
        ]
      },
      {
        titulo: 'Advanced Configuration',
        contenido: 'For advanced users, IA Lab allows adjusting parameters such as: temperature (creativity vs precision), response length, detail level, output format.',
        grafica: 'barras',
        datos: [
          { categoria: 'Productivity', antes: 45, despues: 82 },
          { categoria: 'Content quality', antes: 60, despues: 91 },
          { categoria: 'Prep time', antes: 100, despues: 35 }
        ],
        unidad: '%'
      },
      {
        titulo: 'Integration with Valerio',
        contenido: 'Valerio is Edutechlife\'s intelligent avatar that combines coaching techniques with AI. Compatible with IA Lab, Valerio provides contextualized responses based on best pedagogical practices.'
      }
    ]
  },
  'tutorial-smartboard': {
    titulo: 'SmartBoard Tutorial',
    introduccion: 'SmartBoard is Edutechlife\'s intelligent interactive whiteboard solution. This guide will help you set up and use all features to maximize your students\' engagement.',
    secciones: [
      {
        titulo: 'Technical Specifications',
        contenido: 'Before starting, know your SmartBoard specifications: 4K multi-touch screen, 65-86 inch size, high-precision infrared technology, HDMI, USB-C and WiFi 6 connectivity.',
        especificacion: [
          { label: 'Resolution', valor: '3840 x 2160 (4K)' },
          { label: 'Touch', valor: '20 simultaneous points' },
          { label: 'Response time', valor: '< 8ms' },
          { label: 'Brightness', valor: '400 cd/m²' },
          { label: 'Connectivity', valor: 'HDMI 2.0, USB-C, WiFi 6' }
        ]
      },
      {
        titulo: 'Installation and Setup',
        contenido: 'The installation process includes: wall mounting or mobile stand, power and data cable connection, initial screen calibration, pairing with Edutechlife software.',
        pasos: [
          'Unpack the SmartBoard and verify all components',
          'Install the stand following manufacturer instructions',
          'Connect the HDMI cable to the corresponding port',
          'Turn on the device and wait for the system to load',
          'Download and install the Edutechlife app from the download center'
        ]
      },
      {
        titulo: 'Interactive Tools',
        contenido: 'SmartBoard includes a complete set of tools: infinite collaborative canvas, handwriting recognition, geometric tools, image editor, session recording.',
        grafica: 'linea',
        datos: [
          { anio: '2024', engagement: 65 },
          { anio: '2025', engagement: 78 },
          { anio: '2026', engagement: 92 }
        ],
        unidad: '% Engagement'
      },
      {
        titulo: 'Device Integration',
        contenido: 'Maximize functionality by connecting additional devices: student tablets for content sharing, voting systems for real-time assessments, enhanced audio systems for conferences.',
        opciones: [
          'QR code connection for screen sharing',
          'Bluetooth pairing for remote control',
          'Sync with Google Classroom and Microsoft Teams'
        ]
      },
      {
        titulo: 'Common Problem Solving',
        contenido: 'Frequent issues and their solutions: Screen not responding - check connections and restart; WiFi connection fails - move router closer or use Ethernet cable; Touch not working - recalibrate from settings.',
        faqs: [
          { q: 'Can I use SmartBoard without internet?', a: 'Yes, basic functions work offline' },
          { q: 'How many devices can I connect?', a: 'Up to 50 devices simultaneously' },
          { q: 'Is the software compatible with Mac?', a: 'Fully compatible with macOS 12+' }
        ]
      }
    ]
  },
  'api-docs': {
    titulo: 'API Documentation',
    introduccion: 'The Edutechlife API allows integrating our functionalities with your existing systems. This documentation is designed for developers who need to connect LMS, academic management systems, or custom applications.',
    secciones: [
      {
        titulo: 'General Information',
        contenido: 'The Edutechlife API follows RESTful architecture with JWT authentication. All endpoints require a valid API key that you can obtain from the admin panel.',
        detalle: {
          base: 'https://api.edutechlife.com/v1',
          formato: 'JSON',
          autenticacion: 'Bearer Token (JWT)',
          version: 'v1 (current)'
        }
      },
      {
        titulo: 'Main Endpoints',
        contenido: 'Available endpoints cover the platform\'s main functionalities. Below are the most commonly used ones:',
        endpoints: [
          { metodo: 'GET', ruta: '/users', descripcion: 'List all users' },
          { metodo: 'POST', ruta: '/users', descripcion: 'Create a new user' },
          { metodo: 'GET', ruta: '/students/{id}', descripcion: 'Get student data' },
          { metodo: 'PUT', ruta: '/students/{id}', descripcion: 'Update student information' },
          { metodo: 'GET', ruta: '/results/vak', descripcion: 'Get VAK diagnostic results' },
          { metodo: 'POST', ruta: '/ai/chat', descripcion: 'Send message to AI chat' }
        ]
      },
      {
        titulo: 'Authentication Example',
        contenido: 'To authenticate with the API, include the token in the header of each request:',
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
        lenguaje: 'JavaScript'
      },
      {
        titulo: 'LMS Integration',
        contenido: 'Edutechlife integrates natively with major learning management systems:',
        integraciones: [
          { lms: 'Moodle', tipo: 'Plugin available', estado: 'Production' },
          { lms: 'Canvas', tipo: 'REST API', estado: 'Production' },
          { lms: 'Blackboard', tipo: 'LTI 1.3', estado: 'Beta' },
          { lms: 'Google Classroom', tipo: 'OAuth API', estado: 'Production' }
        ]
      },
      {
        titulo: 'Rate Limits and Best Practices',
        contenido: 'To ensure service stability, we apply usage limits: 1000 requests/hour per API key, 100 requests/minute on AI endpoints. We recommend implementing local cache and webhooks for asynchronous notifications.',
        grafica: 'barras',
        datos: [
          { categoria: 'Free', valor: 100 },
          { categoria: 'Professional', valor: 1000 },
          { categoria: 'Institutional', valor: 10000 },
          { categoria: 'Enterprise', valor: 100000 }
        ],
        unidad: 'Requests/hour'
      }
    ]
  },
  'faq': {
    titulo: 'Frequent FAQs',
    introduccion: 'Here you\'ll find answers to the most frequently asked questions about Edutechlife. If you don\'t find the answer you\'re looking for, contact our support team.',
    secciones: [
      {
        titulo: 'Account and Billing',
        contenido: '',
        faqs: [
          { q: 'How can I change my subscription plan?', a: 'From Settings > Subscription you can change your plan at any time. The change takes effect at the next billing cycle.' },
          { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans.' },
          { q: 'Can I get a tax invoice?', a: 'Yes, all transactions include a tax invoice. Download it from Settings > Billing.' },
          { q: 'What happens if I exceed my user limit?', a: 'We\'ll notify you when you reach 80% of your limit. You can upgrade your plan or wait until the next cycle.' }
        ]
      },
      {
        titulo: 'Technical',
        contenido: '',
        faqs: [
          { q: 'Which browsers are supported?', a: 'Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. We recommend Chrome for best performance.' },
          { q: 'Does Edutechlife work offline?', a: 'Some basic functions work offline. It will sync automatically when you reconnect.' },
          { q: 'Is my data secure?', a: 'We use AES-256 encryption, GDPR compliance, and SOC 2 Type II. Your data is never shared.' },
          { q: 'Can I export my data?', a: 'Yes, from Settings > Data you can export in CSV, PDF, or Excel format.' }
        ]
      },
      {
        titulo: 'Pedagogical',
        contenido: '',
        faqs: [
          { q: 'Is the VAK diagnostic free?', a: 'The basic diagnostic is free. The full version with detailed analysis requires a Professional plan.' },
          { q: 'Can I use Edutechlife for online education?', a: 'Absolutely. All our tools are optimized for in-person, hybrid, and remote environments.' },
          { q: 'How do I measure ROI from using the platform?', a: 'We include an ROI Calculator that analyzes performance metrics, engagement, and administrative time reduction.' },
          { q: 'Are the certifications officially valid?', a: 'Our certifications are issued by Edutechlife and recognized by partner educational institutions.' }
        ]
      },
      {
        titulo: 'Support',
        contenido: '',
        faqs: [
          { q: 'How do I contact support?', a: 'Via live chat (available 24/7), email at support@edutechlife.com, or through the form in the Help Center.' },
          { q: 'Do you offer training for institutions?', a: 'Yes, we offer virtual and in-person training for institutional implementations.' },
          { q: 'What is the response time?', a: 'Free plan: 48h, Professional: 24h, Enterprise: 4h with dedicated account manager.' }
        ]
      }
    ]
  }
};

export const privacyContent = {
  lastUpdate: 'Last updated: March 15, 2026',
  sections: [
    {
      title: '1. Introduction',
      content: 'At Edutechlife, accessible from edutechlife.com, one of our main priorities is the privacy of our users. This Privacy Policy document contains types of information that is collected and recorded by Edutechlife and how we use it.'
    },
    {
      title: '2. Information We Collect',
      content: 'We collect information that you provide directly when registering, creating a profile, or using our services. This may include:',
      items: [
        'Personal identification information (name, email, institution)',
        'Platform usage data and performance metrics',
        'User-generated content (educational materials, assessments)',
        'Device and connection information'
      ]
    },
    {
      title: '3. How We Use Your Information',
      content: 'We use the collected information for various purposes:',
      uses: [
        { title: 'Provide Services', desc: 'Maintain and improve our educational platform' },
        { title: 'Personalization', desc: 'Adapt the learning experience to your needs' },
        { title: 'Communication', desc: 'Send updates and technical support' },
        { title: 'Research', desc: 'Analyze usage patterns to improve services' }
      ]
    },
    {
      title: '4. Cookies and Similar Technologies',
      content: 'Edutechlife uses "cookies" and similar tracking technologies to enhance your experience. These small files are stored on your device and help us analyze web traffic, personalize content, and understand user behavior.'
    },
    {
      title: '5. Data Protection',
      content: 'We implement robust security measures to protect your personal information:',
      security: [
        { icon: 'fa-lock', label: 'AES-256 Encryption' },
        { icon: 'fa-shield-halved', label: 'Advanced Firewall' },
        { icon: 'fa-server', label: 'Secure Servers' },
        { icon: 'fa-user-shield', label: '2FA Authentication' }
      ]
    },
    {
      title: '6. Your Rights',
      content: 'You have the right to access, correct, or delete your personal data. You can exercise these rights by contacting us at privacy@edutechlife.com. We will respond to your request within 30 days.'
    }
  ]
};

export const termsContent = {
  lastUpdate: 'Last updated: March 15, 2026',
  sections: [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Edutechlife, you agree to comply with these Terms of Use. If you do not agree with any part of these terms, you should not use our service.'
    },
    {
      title: '2. Use of Service',
      content: 'Edutechlife provides an educational platform for institutions, teachers, and students. You may use our service only for legitimate educational purposes.'
    },
    {
      title: '3. User Accounts',
      content: 'When you create an account on Edutechlife, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.'
    },
    {
      title: '4. User Content',
      content: 'You may upload content to our platform, including educational materials, assessments, and comments. You retain ownership of your content but grant us a license to use it.'
    },
    {
      title: '5. Prohibited Use',
      content: 'You may not use Edutechlife for:',
      prohibitions: [
        'Illegal activities',
        'Attempted unauthorized access',
        'Malware distribution',
        'Harassment or intimidation',
        'Privacy violations',
        'Hate speech or propaganda',
        'Spam or phishing',
        'Price manipulation'
      ]
    },
    {
      title: '6. Intellectual Property',
      content: 'The Edutechlife service and all provided content, including text, graphics, logos, and images, are the property of Edutechlife or its licensors and are protected by intellectual property laws.'
    },
    {
      title: '7. Limitation of Liability',
      content: 'Edutechlife shall not be liable for indirect, incidental, special, or consequential damages arising from the use or inability to use the service.'
    }
  ]
};
