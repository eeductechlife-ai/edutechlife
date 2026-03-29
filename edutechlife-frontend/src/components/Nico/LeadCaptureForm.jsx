import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, CheckCircle, X } from 'lucide-react';

const COLORS = {
  NAVY: '#0A1628',
  PETROLEUM: '#004B63',
  CORPORATE: '#4DA8C4',
  MINT: '#66CCCC',
  SOFT_BLUE: '#B2D8E5'
};

const LeadCaptureForm = ({ 
  userName = '',
  userInterest = '',
  onSave, 
  onCancel,
  autoFocus = true
}) => {
  const [formData, setFormData] = useState({
    nombreCompleto: userName || '',
    telefono: '',
    email: '',
    interesPrincipal: userInterest || '',
    edadEstudiante: '',
    preferenciaContacto: 'whatsapp',
    mejorHorario: 'mañana',
    notas: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validación de nombre
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'Por favor ingresa tu nombre completo';
    } else if (formData.nombreCompleto.trim().length < 3) {
      newErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validación de teléfono (más flexible para diferentes formatos)
    const phone = formData.telefono.replace(/\D/g, '');
    if (!phone) {
      newErrors.telefono = 'Por favor ingresa tu número de teléfono';
    } else if (phone.length < 10) {
      newErrors.telefono = 'El teléfono debe tener al menos 10 dígitos';
    }

    // Validación de email (opcional pero si se ingresa debe ser válido)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Limpiar y formatear datos
      const cleanData = {
        ...formData,
        telefono: formData.telefono.replace(/\D/g, ''),
        nombreCompleto: formData.nombreCompleto.trim(),
        email: formData.email.trim() || null,
        timestamp: new Date().toISOString(),
        source: 'nico_chat',
        status: 'nuevo'
      };

      // Llamar a la función de guardado
      await onSave(cleanData);
      
      // Mostrar éxito
      setIsSuccess(true);
      
      // Cerrar automáticamente después de 2 segundos
      setTimeout(() => {
        if (onSave) {
          // El padre manejará el cierre
        }
      }, 2000);

    } catch (error) {
      console.error('Error guardando lead:', error);
      setErrors({ submit: 'Error al guardar. Por favor intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhone = (value) => {
    // Mantener solo dígitos
    const digits = value.replace(/\D/g, '');
    
    // Formatear según longitud
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefono: formatted
    }));
    
    if (errors.telefono) {
      setErrors(prev => ({ ...prev, telefono: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-fadeIn p-6 rounded-xl" style={{ backgroundColor: COLORS.SOFT_BLUE }}>
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 mb-4" style={{ color: COLORS.PETROLEUM }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.NAVY }}>
            ¡Perfecto, {formData.nombreCompleto.split(' ')[0]}!
          </h3>
          <p className="mb-4" style={{ color: COLORS.NAVY }}>
            Hemos registrado tu interés en <strong>{formData.interesPrincipal || 'nuestros servicios'}</strong>.
          </p>
          <div className="bg-white/80 p-4 rounded-lg mb-4">
            <p className="font-medium mb-2" style={{ color: COLORS.PETROLEUM }}>Próximos pasos:</p>
            <ul className="text-sm text-left space-y-1" style={{ color: COLORS.NAVY }}>
              <li>✅ Un asesor se contactará contigo en 24 horas</li>
              <li>✅ Coordinarán tu clase gratuita</li>
              <li>✅ Recibirás información detallada por {formData.preferenciaContacto === 'whatsapp' ? 'WhatsApp' : 'correo'}</li>
            </ul>
          </div>
          <p className="text-sm italic" style={{ color: COLORS.PETROLEUM }}>
            Gracias por confiar en EdutechLife
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slideUp p-4 rounded-xl border-2" style={{ 
      backgroundColor: COLORS.SOFT_BLUE,
      borderColor: COLORS.CORPORATE 
    }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: COLORS.NAVY }}>
          <User className="inline-block w-5 h-5 mr-2" />
          Completa tus datos
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" style={{ color: COLORS.NAVY }} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre Completo */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            Nombre completo *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLORS.PETROLEUM }} />
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              autoFocus={autoFocus}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: 'white',
                borderColor: errors.nombreCompleto ? '#ef4444' : COLORS.CORPORATE,
                color: COLORS.NAVY,
                focusRingColor: COLORS.MINT
              }}
              placeholder="Ej: María González"
            />
          </div>
          {errors.nombreCompleto && (
            <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.nombreCompleto}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            Teléfono (WhatsApp preferible) *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLORS.PETROLEUM }} />
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handlePhoneChange}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: 'white',
                borderColor: errors.telefono ? '#ef4444' : COLORS.CORPORATE,
                color: COLORS.NAVY,
                focusRingColor: COLORS.MINT
              }}
              placeholder="Ej: 300 123 4567"
            />
          </div>
          {errors.telefono && (
            <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.telefono}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            Email (opcional)
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLORS.PETROLEUM }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: 'white',
                borderColor: errors.email ? '#ef4444' : COLORS.CORPORATE,
                color: COLORS.NAVY,
                focusRingColor: COLORS.MINT
              }}
              placeholder="ejemplo@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>
          )}
        </div>

        {/* Interés Principal */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            ¿Qué te interesa principalmente?
          </label>
          <select
            name="interesPrincipal"
            value={formData.interesPrincipal}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'white',
              borderColor: COLORS.CORPORATE,
              color: COLORS.NAVY,
              focusRingColor: COLORS.MINT
            }}
          >
            <option value="">Selecciona una opción</option>
            <option value="programacion">Programación para niños/adolescentes</option>
            <option value="robotica">Robótica educativa</option>
            <option value="vak">Diagnóstico VAK (estilos de aprendizaje)</option>
            <option value="tutoria">Tutoría académica (matemáticas, ciencias)</option>
            <option value="bienestar">Bienestar emocional</option>
            <option value="steam">Programas STEAM completos</option>
            <option value="otro">Otro interés</option>
          </select>
        </div>

        {/* Edad del estudiante (si aplica) */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            Edad del estudiante (si aplica)
          </label>
          <input
            type="text"
            name="edadEstudiante"
            value={formData.edadEstudiante}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'white',
              borderColor: COLORS.CORPORATE,
              color: COLORS.NAVY,
              focusRingColor: COLORS.MINT
            }}
            placeholder="Ej: 10 años o Adulto"
          />
        </div>

        {/* Preferencia de contacto */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            Prefiero que me contacten por:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="preferenciaContacto"
                value="whatsapp"
                checked={formData.preferenciaContacto === 'whatsapp'}
                onChange={handleChange}
                className="mr-2"
              />
              <span style={{ color: COLORS.NAVY }}>WhatsApp</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferenciaContacto"
                value="llamada"
                checked={formData.preferenciaContacto === 'llamada'}
                onChange={handleChange}
                className="mr-2"
              />
              <span style={{ color: COLORS.NAVY }}>Llamada</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferenciaContacto"
                value="email"
                checked={formData.preferenciaContacto === 'email'}
                onChange={handleChange}
                className="mr-2"
              />
              <span style={{ color: COLORS.NAVY }}>Email</span>
            </label>
          </div>
        </div>

        {/* Mejor horario */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Mejor horario para contactarte
          </label>
          <select
            name="mejorHorario"
            value={formData.mejorHorario}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'white',
              borderColor: COLORS.CORPORATE,
              color: COLORS.NAVY,
              focusRingColor: COLORS.MINT
            }}
          >
            <option value="mañana">Mañana (8am - 12pm)</option>
            <option value="tarde">Tarde (12pm - 6pm)</option>
            <option value="noche">Noche (6pm - 9pm)</option>
            <option value="cualquiera">Cualquier horario</option>
          </select>
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.NAVY }}>
            Notas adicionales (opcional)
          </label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'white',
              borderColor: COLORS.CORPORATE,
              color: COLORS.NAVY,
              focusRingColor: COLORS.MINT
            }}
            placeholder="Algo específico que quieras que sepamos..."
          />
        </div>

        {/* Error de envío */}
        {errors.submit && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
            <p className="text-sm" style={{ color: '#ef4444' }}>{errors.submit}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: COLORS.PETROLEUM,
              color: 'white',
              hoverBackgroundColor: COLORS.CORPORATE
            }}
          >
            {isSubmitting ? 'Guardando...' : '✅ Enviar información'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: COLORS.NAVY,
                border: `1px solid ${COLORS.NAVY}`,
                hoverBackgroundColor: `${COLORS.NAVY}10`
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Texto de privacidad */}
        <p className="text-xs text-center pt-2" style={{ color: COLORS.PETROLEUM }}>
          Tus datos están seguros. Solo los usaremos para contactarte sobre EdutechLife.
        </p>
      </form>
    </div>
  );
};

export default LeadCaptureForm;