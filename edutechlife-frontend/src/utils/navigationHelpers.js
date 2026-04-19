/**
 * Utilidades de navegación para la migración a React Router
 * 
 * Proporciona funciones helper para mapear valores de 'view' del sistema antiguo
 * a rutas del nuevo sistema React Router.
 */

/**
 * Mapea un valor de 'view' del sistema antiguo a una ruta React Router
 * @param {string} view - Valor de view del sistema antiguo
 * @returns {string} Ruta correspondiente en React Router
 */
export const mapViewToRoute = (view) => {
  const routeMap = {
    // Rutas principales
    'landing': '/',
    'home': '/',
    
    // Herramientas IA Edutechlife
    'ialab': '/ialab',
    'lab-ia': '/ialab',
    'ialab-pro': '/ialab',
    'ialab-dashboard': '/ialab/dashboard',
    'ialab-estadisticas': '/ialab/dashboard',
    
    'vak': '/vak',
    'diagnostico-vak': '/vak',
    'vak-simple': '/vak-simple',
    'vak-premium': '/vak-premium',
    
    'neuroentorno': '/neuroentorno',
    
    'proyectos': '/proyectos',
    'proyectos-nacional': '/proyectos',
    
    'consultoria': '/consultoria',
    'consultoria-b2b': '/consultoria-b2b',
    
    'automation': '/automation',
    'automatizaciones': '/automation',
    'automation-architect': '/automation',
    
    // Plataformas
    'smartboard': '/smartboard',
    'smartboard-estadisticas': '/smartboard/estadisticas',
    'smartboard-progreso': '/smartboard/estadisticas',
    'admin': '/admin',
    
    // Autenticación
    'sign-up': '/sign-up',
    'login': '/',
    'auth-router': '/auth-router',
    
    // Perfil y configuración
    'perfil': '/profile',
    'configuracion': '/settings',
    'certificados': '/certificates',
    
    // Dashboard interno
    'dashboard': '/dashboard',
    'misiones': '/smartboard?tab=misiones',
    'materias': '/smartboard?tab=materias',
    'estadisticas': '/smartboard/estadisticas',
  };
  
  // Si el view tiene un mapeo directo, devolverlo
  if (routeMap[view]) {
    return routeMap[view];
  }
  
  // Si el view ya parece una ruta (empieza con /), devolverlo tal cual
  if (view.startsWith('/')) {
    return view;
  }
  
  // Por defecto, asumir que es un nombre de ruta directo
  console.warn(`⚠️ View no mapeado: "${view}". Usando "/${view}" por defecto.`);
  return `/${view}`;
};

/**
 * Función de navegación compatible que acepta tanto valores de view como rutas
 * @param {Function} navigate - Función navigate de useNavigate()
 * @param {string} destination - Destino (view o ruta)
 */
export const navigateTo = (navigate, destination) => {
  if (!destination) {
    console.error('❌ Destino de navegación no proporcionado');
    return;
  }
  
  const route = mapViewToRoute(destination);
  navigate(route);
};

/**
 * Crea un handler de navegación para pasar a componentes como prop
 * @param {Function} navigate - Función navigate de useNavigate()
 * @returns {Function} Handler que acepta view/ruta
 */
export const createNavigateHandler = (navigate) => {
  return (destination) => navigateTo(navigate, destination);
};

/**
 * Verifica si una ruta existe en el sistema de rutas
 * @param {string} route - Ruta a verificar
 * @returns {boolean} True si la ruta es válida
 */
export const isValidRoute = (route) => {
  // Lista de rutas válidas en la aplicación
  const validRoutes = [
    '/',
    '/ialab',
    '/ialab/dashboard',
    '/vak',
    '/vak-simple',
    '/vak-premium',
    '/neuroentorno',
    '/proyectos',
    '/consultoria',
    '/consultoria-b2b',
    '/automation',
    '/smartboard',
    '/smartboard/estadisticas',
    '/admin',
    '/sign-up',
    '/auth-router',
    '/profile',
    '/settings',
    '/certificates',
    '/dashboard'
  ];
  
  // También aceptamos rutas con query params
  const baseRoute = route.split('?')[0];
  return validRoutes.includes(baseRoute);
};

/**
 * Extrae el nombre de la vista actual de la ruta
 * @param {string} pathname - Pathname actual de la ruta
 * @returns {string} Nombre de la vista
 */
export const getViewFromRoute = (pathname) => {
  const routeToView = {
    '/': 'landing',
    '/ialab': 'ialab',
    '/ialab/dashboard': 'ialab-dashboard',
    '/vak': 'vak',
    '/vak-simple': 'vak-simple',
    '/vak-premium': 'vak-premium',
    '/neuroentorno': 'neuroentorno',
    '/proyectos': 'proyectos',
    '/consultoria': 'consultoria',
    '/consultoria-b2b': 'consultoria-b2b',
    '/automation': 'automation',
    '/smartboard': 'smartboard',
    '/smartboard/estadisticas': 'smartboard-estadisticas',
    '/admin': 'admin',
    '/sign-up': 'sign-up',
    '/auth-router': 'auth-router',
  };
  
  return routeToView[pathname] || pathname.substring(1) || 'landing';
};