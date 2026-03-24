import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

const LeadCaptureModal = ({ isOpen, onClose, onSubmit, context }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
      ...formData,
      interes: context?.interest || 'general',
      tema: context?.topic || ''
    });
    
    setFormData({ nombre: '', email: '', telefono: '' });
    setIsSubmitting(false);
  };

  const getContextMessage = () => {
    if (!context) return 'Para ayudarte mejor, ¿podrías compartir tus datos de contacto?';
    
    const messages = {
      diagnostico_vak: 'Para agendar tu diagnóstico VAK y darte información detallada, ¿me compartes tus datos?',
      cursos: 'Para orientarte sobre los cursos disponibles, ¿me compartes tu contacto?',
      metodologia: 'Para explicarte más sobre nuestra metodología, ¿podrías darme tus datos?',
      precios: 'Para darte información sobre precios y planes, ¿me compartes tu contacto?',
      general: 'Para darte una atención más personalizada, ¿podrías compartir tus datos?'
    };
    
    return messages[context.interest] || messages.general;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '400px',
              width: '100%',
              zIndex: 10000,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#94A3B8',
                display: 'flex'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #004B63 0%, #006080 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Send size={24} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#1E293B',
                margin: 0
              }}>
                Datos de Contacto
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                margin: '0.5rem 0 0'
              }}>
                {getContextMessage()}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4DA8C4'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Tu correo electrónico"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4DA8C4'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Tu número de teléfono (opcional)"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4DA8C4'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#64748B',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Ahora no
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: isSubmitting ? '#94A3B8' : 'linear-gradient(135deg, #004B63 0%, #006080 100%)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isSubmitting ? 'Enviando...' : 'Compartir datos'}
                </button>
              </div>
            </form>

            <p style={{
              fontSize: '0.7rem',
              color: '#94A3B8',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              Tus datos serán atendidos por un asesor de Edutechlife
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
