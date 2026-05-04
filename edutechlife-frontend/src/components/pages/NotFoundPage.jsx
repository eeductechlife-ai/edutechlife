import { useNavigate } from 'react-router-dom';

/**
 * Página 404 - Not Found
 * Ruta comodín para rutas no encontradas
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#004B63] mb-4">404</h1>
        <p className="text-lg text-[#4DA8C4] mb-6">Página no encontrada</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#004B63] text-white rounded-full hover:bg-[#4DA8C4] transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
