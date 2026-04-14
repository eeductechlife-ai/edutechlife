import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Componente para manejar el callback de autenticación de Supabase
 * Se usa cuando el usuario confirma su email
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando confirmación de email...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Procesando callback de autenticación...');
        
        // Obtener la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Error obteniendo sesión: ${sessionError.message}`);
        }

        if (session?.user) {
          console.log('Usuario autenticado después de confirmar email:', session.user.email);
          
          // Procesar datos de formulario pendientes
          const pendingRegistration = JSON.parse(localStorage.getItem('pending_registration_data') || 'null');
          
          if (pendingRegistration && pendingRegistration.email === session.user.email) {
            try {
              // Guardar datos del formulario en form_submissions
              const { error: formError } = await supabase
                .from('form_submissions')
                .insert([
                  {
                    user_id: session.user.id,
                    form_type: 'initial',
                    data: pendingRegistration.form_data
                  }
                ]);

              if (formError) {
                console.error('Error guardando datos de formulario:', formError);
              } else {
                console.log('Datos de formulario guardados exitosamente');
                localStorage.removeItem('pending_registration_data');
              }
            } catch (formErr) {
              console.error('Error procesando datos de formulario:', formErr);
            }
          }

          setStatus('✅ ¡Email confirmado exitosamente! Redirigiendo al IALab...');
          
          // Redirigir al IALab después de 2 segundos
          setTimeout(() => {
            navigate('/ialab');
          }, 2000);
        } else {
          setStatus('⚠️ No se pudo autenticar al usuario. Redirigiendo al login...');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (err) {
        console.error('Error en callback de autenticación:', err);
        setError(err.message);
        setStatus('❌ Error procesando confirmación de email');
        
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B63] to-[#4DA8C4] flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#004B63] to-[#66CCCC] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#004B63]">Confirmación de Email</h1>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${error ? 'bg-red-50 text-red-700' : 'bg-cyan-50 text-cyan-700'}`}>
            <p className="font-medium">{status}</p>
            {error && (
              <p className="text-sm mt-2">{error}</p>
            )}
          </div>

          {!error && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#66CCCC] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Si tienes problemas, contacta a soporte: 
              <a href="mailto:soporte@edutechlife.co" className="text-[#004B63] hover:underline ml-1">
                soporte@edutechlife.co
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;