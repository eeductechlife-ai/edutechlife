export const helpArticles = [
  {
    id: "inicio-rapido",
    titulo: "Guía de inicio rápido",
    descripcion: "Primeros pasos con la plataforma",
    icono: "fa-rocket",
    tiempo: "5 min",
  },
  {
    id: "manual-ia",
    titulo: "Manual de herramientas IA",
    descripcion: "Funciones y configuración de IA Lab",
    icono: "fa-robot",
    tiempo: "12 min",
  },
  {
    id: "tutorial-smartboard",
    titulo: "Tutorial SmartBoard",
    descripcion: "Configuración y uso de pizarra interactiva",
    icono: "fa-chalkboard",
    tiempo: "8 min",
  },
  {
    id: "api-docs",
    titulo: "API Documentation",
    descripcion: "Integración con sistemas externos",
    icono: "fa-code",
    tiempo: "15 min",
  },
  {
    id: "faq",
    titulo: "FAQ frecuentes",
    descripcion: "Preguntas y respuestas comunes",
    icono: "fa-circle-question",
    tiempo: "3 min",
  },
];

export const helpIntro =
  "Accede a toda la documentación necesaria para implementar y aprovechar al máximo las herramientas de Edutechlife.";
export const helpSubtitle = "Manuales, guías y recursos técnicos";
export const helpNeedHelp = "¿Necesitas más ayuda?";
export const helpNeedHelpDesc =
  "Contacta nuestro equipo de soporte para asistencia técnica personalizada.";

export const helpArticleContents = {
  "inicio-rapido": {
    titulo: "Guía de inicio rápido",
    introduccion:
      "Bienvenido a Edutechlife. Esta guía te llevará a través de los primeros pasos para comenzar a utilizar la plataforma de manera efectiva. En menos de 10 minutos podrás navegar y utilizar las herramientas principales.",
    secciones: [
      {
        titulo: "1. Crear tu cuenta",
        contenido:
          "El primer paso es crear tu cuenta en Edutechlife. Visita la página de registro e ingresa tu correo electrónico institucional. Recibirás un correo de verificación en menos de 2 minutos.",
        pasos: [
          'Ingresa a edutechlife.com y haz clic en "Registrarse"',
          "Ingresa tu correo electrónico institucional",
          "Crea una contraseña segura (mínimo 8 caracteres)",
          "Verifica tu correo electrónico",
          "Completa tu perfil con tu información académica",
        ],
      },
      {
        titulo: "2. Explorando el Dashboard",
        contenido:
          "Una vez iniciado sesión, llegarás al Dashboard principal. Aquí encontrarás: navegación principal a la izquierda, panel de métricas en el centro, y accesos rápidos a herramientas en la parte superior.",
        imagen:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      },
      {
        titulo: "3. Tu primera sesión con IA Lab",
        contenido:
          'IA Lab es tu asistente de inteligencia artificial. Para comenzar tu primera sesión: selecciona "IA Lab" en el menú de herramientas, elige el modelo de IA preferido, escribe tu primera consulta en el campo de texto.',
        consejos: [
          "Sé específico en tus preguntas para obtener mejores resultados",
          "Utiliza los prompts predefinidos para comenzar",
          "Guarda tus conversaciones para referencia futura",
        ],
      },
      {
        titulo: "4. Configurar tu entorno",
        contenido:
          "Personaliza tu experiencia en Edutechlife: accede a Configuración desde el menú, ajusta el idioma y zona horaria, configura tus preferencias de notificaciones, vincula tu calendario institucional.",
      },
      {
        titulo: "5. Próximos pasos",
        contenido:
          "Una vez completado el inicio básico, te recomendamos: explorar el diagnóstico VAK para personalizar tu aprendizaje, revisar los tutoriales de SmartBoard si planeas usar pizarras interactivas, consultar la sección de automatización para optimizar procesos.",
      },
    ],
  },
  "manual-ia": {
    titulo: "Manual de herramientas IA",
    introduccion:
      "IA Lab es el núcleo de inteligencia artificial de Edutechlife. Esta guía te enseña a configurar y utilizar todas las capacidades de IA para potenciar tu práctica educativa.",
    secciones: [
      {
        titulo: "Introducción a IA Lab",
        contenido:
          "IA Lab integra modelos de IA avanzados para asistir en la creación de contenido educativo, análisis de datos y personalización del aprendizaje. El sistema soporta múltiples idiomas incluyendo español, inglés y portugués.",
        grafica: "dona",
        datos: [
          { nombre: "Generación de contenido", valor: 35 },
          { nombre: "Análisis y evaluación", valor: 30 },
          { nombre: "Asesoría pedagógica", valor: 25 },
          { nombre: "Investigación", valor: 10 },
        ],
        unidad: "Uso",
      },
      {
        titulo: "Configuración de Modelos",
        contenido:
          "Edutechlife ofrece múltiples modelos de IA optimizados para diferentes propósitos educativos. La selección del modelo correcto puede mejorar significativamente tus resultados.",
        modelos: [
          {
            nombre: "MAX",
            descripcion:
              "Asistente pedagógico especializado en metodologías educativas",
            caso: "Creación de planes de clase",
          },
          {
            nombre: "Analítico",
            descripcion: "Análisis de datos de estudiantes y generar reportes",
            caso: "Identificación de patrones de aprendizaje",
          },
          {
            nombre: "Creador",
            descripcion: "Generación de contenido educativo diverso",
            caso: "Materiales didácticos",
          },
          {
            nombre: "Investigador",
            descripcion: "Búsqueda y síntesis de información académica",
            caso: "Revisión de literatura",
          },
        ],
      },
      {
        titulo: "Prompts Personalizados",
        contenido:
          "Los prompts son instrucciones que guían a la IA para generar respuestas específicas. Edutechlife incluye una biblioteca de prompts optimizados para diferentes escenarios educativos.",
        lista: [
          "Prompts para generación de evaluaciones",
          "Prompts para creación de rúbricas",
          "Prompts para diseño de actividades",
          "Prompts para retroalimentación automática",
        ],
      },
      {
        titulo: "Configuración Avanzada",
        contenido:
          "Para usuarios avanzados, IA Lab permite ajustar parámetros como: temperatura (creatividad vs precisión), longitud de respuesta, nivel de detalle, formato de salida.",
        grafica: "barras",
        datos: [
          { categoria: "Productividad", antes: 45, despues: 82 },
          { categoria: "Calidad contenido", antes: 60, despues: 91 },
          { categoria: "Tiempo preparación", antes: 100, despues: 35 },
        ],
        unidad: "%",
      },
      {
        titulo: "Integración con MAX",
        contenido:
          "MAX es el avatar inteligente de Edutechlife que combina técnicas de coaching con IA. Compatible con IA Lab, MAX proporciona respuestas contextualizadas basadas en las mejores prácticas pedagógicas.",
      },
    ],
  },
  "tutorial-smartboard": {
    titulo: "Tutorial SmartBoard",
    introduccion:
      "SmartBoard es la solución de pizarra interactiva inteligente de Edutechlife. Esta guía te ayudará a configurar y utilizar todas las funciones para maximizar el engagement de tus estudiantes.",
    secciones: [
      {
        titulo: "Especificaciones Técnicas",
        contenido:
          "Antes de comenzar, conoce las especificaciones de tu SmartBoard: pantalla 4K multitáctil, tamaño de 65-86 pulgadas, tecnología infrarroja de alta precisión, conectividad HDMI, USB-C y WiFi 6.",
        especificacion: [
          { label: "Resolución", valor: "3840 x 2160 (4K)" },
          { label: "Táctil", valor: "20 puntos simultáneos" },
          { label: "Tiempo respuesta", valor: "< 8ms" },
          { label: "Brillo", valor: "400 cd/m²" },
          { label: "Conectividad", valor: "HDMI 2.0, USB-C, WiFi 6" },
        ],
      },
      {
        titulo: "Instalación y Configuración",
        contenido:
          "El proceso de instalación incluye: montaje en pared o soporte móvil, conexión de cables de energía y datos, calibración inicial de la pantalla, emparejamiento con el software Edutechlife.",
        pasos: [
          "Desempaca el SmartBoard y verifica todos los componentes",
          "Instala el soporte siguiendo las instrucciones del fabricante",
          "Conecta el cable HDMI al puerto correspondiente",
          "Enciende el dispositivo y espera a que cargue el sistema",
          "Descarga e instala la aplicación Edutechlife desde el centro de descargas",
        ],
      },
      {
        titulo: "Herramientas Interactivas",
        contenido:
          "SmartBoard incluye un conjunto completo de herramientas: pizarra colaborativa infinita, reconocimiento de escritura a mano, herramientas geométricas, editor de imágenes, grabación de sesiones.",
        grafica: "linea",
        datos: [
          { anio: "2024", engagement: 65 },
          { anio: "2025", engagement: 78 },
          { anio: "2026", engagement: 92 },
        ],
        unidad: "% Engagement",
      },
      {
        titulo: "Integración con Dispositivos",
        contenido:
          "Maximiza la funcionalidad conectando dispositivos adicionales: tablets de estudiantes para compartir contenido, voting systems para evaluaciones en tiempo real, sistemas de audio mejorados para conferencias.",
        opciones: [
          "Conexión por código QR para compartir pantalla",
          "Emparejamiento Bluetooth para control remoto",
          "Sincronización con Google Classroom y Microsoft Teams",
        ],
      },
      {
        titulo: "Solución de Problemas Comunes",
        contenido:
          "Problemas frecuentes y sus soluciones: La pantalla no responde - verificar conexiones y reiniciar; La conexión WiFi falla - mover el router más cerca o usar cable Ethernet; El táctil no funciona - recalibrar desde configuración.",
        faqs: [
          {
            q: "¿Puedo usar el SmartBoard sin internet?",
            a: "Sí, las funciones básicas funcionan offline",
          },
          {
            q: "¿Cuántos dispositivos puedo conectar?",
            a: "Hasta 50 dispositivos simultáneamente",
          },
          {
            q: "¿El software es compatible con Mac?",
            a: "Totalmente compatible con macOS 12+",
          },
        ],
      },
    ],
  },
  "api-docs": {
    titulo: "API Documentation",
    introduccion:
      "La API de Edutechlife permite integrar nuestras funcionalidades con tus sistemas existentes. Esta documentación está diseñada para desarrolladores que necesitan conectar LMS, sistemas de gestión académica o aplicaciones personalizadas.",
    secciones: [
      {
        titulo: "Información General",
        contenido:
          "La API de Edutechlife sigue arquitectura RESTful con autenticación JWT. Todos los endpoints requieren una clave API válida que puedes obtener desde el panel de administración.",
        detalle: {
          base: "https://api.edutechlife.com/v1",
          formato: "JSON",
          autenticacion: "Bearer Token (JWT)",
          version: "v1 (actual)",
        },
      },
      {
        titulo: "Endpoints Principales",
        contenido:
          "Los endpoints disponibles cubren las principales funcionalidades de la plataforma. A continuación se detallan los más utilizados:",
        endpoints: [
          {
            metodo: "GET",
            ruta: "/usuarios",
            descripcion: "Lista todos los usuarios",
          },
          {
            metodo: "POST",
            ruta: "/usuarios",
            descripcion: "Crea un nuevo usuario",
          },
          {
            metodo: "GET",
            ruta: "/estudiantes/{id}",
            descripcion: "Obtiene datos de un estudiante",
          },
          {
            metodo: "PUT",
            ruta: "/estudiantes/{id}",
            descripcion: "Actualiza información del estudiante",
          },
          {
            metodo: "GET",
            ruta: "/resultados/vak",
            descripcion: "Obtiene resultados de diagnóstico VAK",
          },
          {
            metodo: "POST",
            ruta: "/ia/chat",
            descripcion: "Envía mensaje al chat de IA",
          },
        ],
      },
      {
        titulo: "Ejemplo de Autenticación",
        contenido:
          "Para autenticarte con la API, incluye el token en el header de cada solicitud:",
        codigo: `// JavaScript - Fetch
const response = await fetch('https://api.edutechlife.com/v1/usuarios', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer TU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        lenguaje: "JavaScript",
      },
      {
        titulo: "Integración con LMS",
        contenido:
          "Edutechlife se integra nativamente con los principales sistemas de gestión del aprendizaje:",
        integraciones: [
          { lms: "Moodle", tipo: "Plugin disponible", estado: "Producción" },
          { lms: "Canvas", tipo: "API REST", estado: "Producción" },
          { lms: "Blackboard", tipo: "LTI 1.3", estado: "Beta" },
          { lms: "Google Classroom", tipo: "API OAuth", estado: "Producción" },
        ],
      },
      {
        titulo: "Rate Limits y Best Practices",
        contenido:
          "Para garantizar la estabilidad del servicio, aplicamos límites de uso: 1000 requests/hora por API key, 100 requests/minuto en endpoints de IA. Recomendamos implementar caché local y webhooks para notificaciones asíncronas.",
        grafica: "barras",
        datos: [
          { categoria: "Gratis", valor: 100 },
          { categoria: "Profesional", valor: 1000 },
          { categoria: "Institucional", valor: 10000 },
          { categoria: "Enterprise", valor: 100000 },
        ],
        unidad: "Requests/hora",
      },
    ],
  },
  faq: {
    titulo: "FAQ Frecuentes",
    introduccion:
      "Aquí encontrarás respuestas a las preguntas más frecuentes sobre Edutechlife. Si no encuentras la respuesta que buscas, contacta nuestro equipo de soporte.",
    secciones: [
      {
        titulo: "Cuenta y Facturación",
        contenido: "",
        faqs: [
          {
            q: "¿Cómo puedo cambiar mi plan de suscripción?",
            a: "Desde Configuración > Suscripción puedes cambiar tu plan en cualquier momento. El cambio será efectivo al siguiente ciclo de facturación.",
          },
          {
            q: "¿Qué métodos de pago aceptan?",
            a: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal, y transferencias bancarias para planes anuales.",
          },
          {
            q: "¿Puedo obtener factura fiscal?",
            a: "Sí, todas las transacciones incluyen factura fiscal. Descárgala desde Configuración > Facturación.",
          },
          {
            q: "¿Qué sucede si supero mi límite de usuarios?",
            a: "Te notificaremos cuando alcances el 80% de tu límite. Puedes actualizar tu plan o esperar al siguiente ciclo.",
          },
        ],
      },
      {
        titulo: "Técnicas",
        contenido: "",
        faqs: [
          {
            q: "¿Qué navegadores son compatibles?",
            a: "Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. Recomendamos Chrome para mejor rendimiento.",
          },
          {
            q: "¿Edutechlife funciona sin internet?",
            a: "Algunas funciones básicas funcionan offline. Sincronizará automáticamente cuando vuelvas a conectar.",
          },
          {
            q: "¿Mis datos están seguros?",
            a: "Utilizamos encriptación AES-256, cumplimiento con GDPR y SOC 2 Type II. Tus datos nunca se comparten.",
          },
          {
            q: "¿Puedo exportar mis datos?",
            a: "Sí, desde Configuración > Datos puedes exportar en formato CSV, PDF o Excel.",
          },
        ],
      },
      {
        titulo: "Pedagógicas",
        contenido: "",
        faqs: [
          {
            q: "¿El diagnóstico VAK es gratuito?",
            a: "El diagnóstico básico es gratuito. La versión completa con análisis detallado requiere plan Profesional.",
          },
          {
            q: "¿Puedo usar Edutechlife para educación online?",
            a: "Totalmente. Todas nuestras herramientas están optimizadas para entornos presenciales, híbridos y remotos.",
          },
          {
            q: "¿Cómo mido el ROI de usar la plataforma?",
            a: "Incluimos un ROI Calculator que analiza métricas de rendimiento, engagement y reducción de tiempo administrativo.",
          },
          {
            q: "¿Las certificaciones tienen validez oficial?",
            a: "Nuestras certificaciones son emitidas por Edutechlife y reconocidas por instituciones educativas aliadas.",
          },
        ],
      },
      {
        titulo: "Soporte",
        contenido: "",
        faqs: [
          {
            q: "¿Cómo contacto al soporte?",
            a: "Desde el chat en vivo (disponible 24/7), email a soporte@edutechlife.com, o a través del formulario en el Centro de Ayuda.",
          },
          {
            q: "¿Tienen capacitación para instituciones?",
            a: "Sí, ofrecemos capacitación virtual y presencial para implementaciones institucionales.",
          },
          {
            q: "¿Cuál es el tiempo de respuesta?",
            a: "Plan Gratuito: 48h, Profesional: 24h, Enterprise: 4h con administrador dedicado.",
          },
        ],
      },
    ],
  },
};
