import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente ScrollToTop
 * 
 * Funcionalidad:
 * - Se ejecuta cada vez que cambia la ruta (pathname)
 * - Hace scroll automático al top de la página
 * - Reemplaza el `window.scrollTo(0, 0)` manual que había en handleNavigate
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Scroll suave al top cuando cambia la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // También para compatibilidad con navegadores que no soportan smooth scroll
    window.scrollTo(0, 0);
  }, [pathname]);
  
  // Este componente no renderiza nada
  return null;
};

export default ScrollToTop;