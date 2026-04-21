/**
 * Modal de Ayuda y Soporte - Centro de ayuda y contacto
 * Diseño premium con estilos corporativos Edutechlife
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Button } from '../ui/button-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const HelpModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const faqCategories = [
    {
      id: 'account',
      title: 'Cuenta y Perfil',
      icon: 'fa-user-circle',
      questions: [
        {
          q: '¿Cómo cambio mi contraseña?',
          a: 'Puedes cambiar tu contraseña desde la sección "Seguridad" en tu perfil. Si usas Clerk, haz clic en "Cambiar Contraseña" para abrir el panel de seguridad de Clerk.',
        },
        {
          q: '¿Cómo actualizo mi información personal?',
          a: 'Haz clic en tu avatar > "Mi Perfil" > ícono de lápiz. Puedes editar tu nombre y teléfono directamente.',
        },
        {
          q: '¿Cómo elimino mi cuenta?',
          a: 'Contacta a soporte@edutechlife.com para solicitar la eliminación de tu cuenta. Procesaremos tu solicitud en 48 horas.',
        },
      ],
    },
    {
      id: 'courses',
      title: 'Cursos y Certificados',
      icon: 'fa-graduation-cap',
      questions: [
        {
          q: '¿Cómo accedo a mis cursos?',
          a: 'Todos tus cursos están disponibles en el Dashboard principal. Haz clic en "Continuar" para retomar donde lo dejaste.',
        },
        {
          q: '¿Cómo descargo mis certificados?',
          a: 'Ve a "Mis Certificados" en el menú de usuario. Los certificados completados tienen botón de descarga en formato PDF.',
        },
        {
          q: '¿Los certificados tienen validez oficial?',
          a: 'Sí, todos nuestros certificados son digitales, verificables y tienen validez en el ámbito educativo y profesional.',
        },
      ],
    },
    {
      id: 'technical',
      title: 'Problemas Técnicos',
      icon: 'fa-cog',
      questions: [
        {
          q: 'La página no carga correctamente',
          a: 'Intenta: 1) Recargar la página (Ctrl+F5), 2) Limpiar caché del navegador, 3) Probar en modo incógnito.',
        },
        {
          q: 'No puedo iniciar sesión',
          a: 'Verifica tu conexión a internet y que estés usando el correo correcto. Si usas Clerk, asegúrate de haber confirmado tu email.',
        },
        {
          q: 'Los videos no se reproducen',
          a: 'Asegúrate de tener la última versión de tu navegador y que JavaScript esté habilitado. Prueba con Chrome o Firefox.',
        },
      ],
    },
    {
      id: 'billing',
      title: 'Facturación y Pagos',
      icon: 'fa-credit-card',
      questions: [
        {
          q: '¿Cómo obtengo mi factura?',
          a: 'Las facturas se envían automáticamente al email registrado después de cada pago. También puedes solicitarlas a facturacion@edutechlife.com.',
        },
        {
          q: '¿Qué métodos de pago aceptan?',
          a: 'Aceptamos tarjetas de crédito/débito (Visa, MasterCard, Amex), PayPal y transferencias bancarias.',
        },
        {
          q: '¿Ofrecen reembolsos?',
          a: 'Sí, ofrecemos reembolsos dentro de los primeros 14 días si no has completado más del 20% del curso.',
        },
      ],
    },
  ];

  const contactCategories = [
    { value: 'general', label: 'Consulta General' },
    { value: 'technical', label: 'Soporte Técnico' },
    { value: 'billing', label: 'Facturación y Pagos' },
    { value: 'courses', label: 'Cursos y Contenido' },
    { value: 'partnership', label: 'Alianzas y Colaboraciones' },
    { value: 'other', label: 'Otro' },
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular envío de formulario
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('📧 Formulario de contacto enviado:', contactForm);
      
      // Resetear formulario
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general',
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (error) {
      console.error('❌ Error al enviar formulario:', error);
      alert('❌ Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const openChat = () => {
    alert('💬 Chat de soporte abierto. Nuestro equipo te atenderá en breve.');
    // Aquí se integraría con un servicio de chat como Intercom, Crisp, etc.
  };

  const scheduleCall = () => {
    const calendarUrl = 'https://calendly.com/edutechlife-soporte/30min';
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-4 border border-cyan-500/20 shadow-2xl relative">
        {/* Botón de cerrar flotante */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white/50 hover:bg-slate-100 hover:text-slate-800 rounded-full backdrop-blur-sm transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>
        
        <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 pt-12">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
              <Icon name="fa-question-circle" className="text-[#00BCD4]" />
              Ayuda y Soporte
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Pestañas */}
          <div className="border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'faq' ? 'bg-[#004B63] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Icon name="fa-question" className="mr-2" />
                Preguntas Frecuentes
              </button>
              
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'contact' ? 'bg-[#004B63] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Icon name="fa-envelope" className="mr-2" />
                Contactar Soporte
              </button>
              
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'resources' ? 'bg-[#004B63] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Icon name="fa-book" className="mr-2" />
                Recursos
              </button>
            </div>
          </div>
          
          {/* Contenido de pestañas */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqCategories.map(category => (
                  <div key={category.id} className="border border-slate-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <Icon name={category.icon} />
                      </div>
                      <h3 className="font-bold text-[#004B63]">{category.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {category.questions.map((item, index) => (
                        <details key={index} className="group">
                          <summary className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                            <span className="font-medium text-slate-700">{item.q}</span>
                            <Icon name="fa-chevron-down" className="text-slate-400 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="p-3 bg-slate-50 rounded-lg mt-1">
                            <p className="text-slate-600">{item.a}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="fa-lightbulb" className="text-amber-500 text-xl mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">¿No encontraste tu respuesta?</h4>
                    <p className="text-amber-700">
                      Nuestro equipo de soporte está disponible para ayudarte. Usa el formulario de contacto o chatea con nosotros en vivo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Canales de contacto rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={openChat}
                  className="p-4 border border-cyan-200 rounded-xl text-center hover:border-cyan-400 hover:bg-cyan-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-200 transition-colors">
                    <Icon name="fa-comments" className="text-cyan-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-[#004B63]">Chat en Vivo</h4>
                  <p className="text-sm text-slate-600 mt-1">Respuesta inmediata</p>
                  <p className="text-xs text-cyan-600 mt-2">Disponible 9am-6pm</p>
                </button>
                
                <button
                  onClick={scheduleCall}
                  className="p-4 border border-emerald-200 rounded-xl text-center hover:border-emerald-400 hover:bg-emerald-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                    <Icon name="fa-phone" className="text-emerald-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-[#004B63]">Llamada Programada</h4>
                  <p className="text-sm text-slate-600 mt-1">30 minutos personalizados</p>
                  <p className="text-xs text-emerald-600 mt-2">Agenda en Calendly</p>
                </button>
                
                <div className="p-4 border border-slate-200 rounded-xl text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Icon name="fa-envelope" className="text-slate-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-[#004B63]">Correo Electrónico</h4>
                  <p className="text-sm text-slate-600 mt-1">soporte@edutechlife.com</p>
                  <p className="text-xs text-slate-600 mt-2">Respuesta en 24h</p>
                </div>
              </div>
              
              {/* Formulario de contacto */}
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-[#004B63] text-lg mb-4">Envíanos un Mensaje</h3>
                
                {submitSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-700 flex items-center gap-2">
                      <Icon name="fa-check-circle" className="text-emerald-500" />
                      ✅ Mensaje enviado exitosamente. Te responderemos en 24 horas.
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={contactForm.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                    >
                      {contactCategories.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      placeholder="Describe tu consulta o problema con detalle..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Icon name="fa-spinner" className="animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Icon name="fa-paper-plane" />
                          Enviar Mensaje
                        </span>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setContactForm({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                        category: 'general',
                      })}
                      className="border-slate-300 text-slate-600 hover:bg-slate-50"
                    >
                      Limpiar Formulario
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Icon name="fa-book-open" className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#004B63]">Guías y Tutoriales</h3>
                      <p className="text-sm text-slate-600">Aprende a usar todas las funciones</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      'Guía de inicio rápido',
                      'Tutorial: Cómo tomar un curso',
                      'Manual del Dashboard',
                      'Configuración avanzada',
                      'Preguntas técnicas comunes',
                    ].map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 group"
                      >
                        <span className="text-slate-700 group-hover:text-[#004B63]">{item}</span>
                        <Icon name="fa-download" className="text-slate-400 group-hover:text-cyan-500" />
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                      <Icon name="fa-video" className="text-rose-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#004B63]">Videos Explicativos</h3>
                      <p className="text-sm text-slate-600">Aprende visualmente</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: 'Tour por la plataforma', duration: '5:23' },
                      { title: 'Cómo completar un curso', duration: '8:45' },
                      { title: 'Gestión de certificados', duration: '6:12' },
                      { title: 'Configuración de perfil', duration: '4:38' },
                    ].map((video, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                        <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                          <Icon name="fa-play" className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">{video.title}</p>
                          <p className="text-xs text-slate-500">{video.duration}</p>
                        </div>
                        <button className="text-cyan-600 hover:text-cyan-700">
                          <Icon name="fa-play-circle" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-[#004B63] mb-3">Comunidad y Foros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="#" className="p-3 border border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-white transition-colors text-center">
                    <Icon name="fa-users" className="text-cyan-600 text-2xl mx-auto mb-2" />
                    <p className="font-medium text-[#004B63]">Foro de Estudiantes</p>
                    <p className="text-sm text-slate-600">Comparte y aprende</p>
                  </a>
                  
                  <a href="#" className="p-3 border border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-white transition-colors text-center">
                    <Icon name="fa-lightbulb" className="text-amber-600 text-2xl mx-auto mb-2" />
                    <p className="font-medium text-[#004B63]">Ideas y Sugerencias</p>
                    <p className="text-sm text-slate-600">Ayúdanos a mejorar</p>
                  </a>
                  
                  <a href="#" className="p-3 border border-slate-300 rounded-lg hover:border-cyan-400 hover:bg-white transition-colors text-center">
                    <Icon name="fa-newspaper" className="text-emerald-600 text-2xl mx-auto mb-2" />
                    <p className="font-medium text-[#004B63]">Blog y Noticias</p>
                    <p className="text-sm text-slate-600">Últimas actualizaciones</p>
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* Información de contacto fija */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-[#004B63]">¿Necesitas ayuda urgente?</p>
                <p className="text-sm text-slate-600">Estamos aquí para ayudarte</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={openChat}
                  variant="outline"
                  className="border-cyan-500 text-cyan-600 hover:bg-cyan-50"
                >
                  <Icon name="fa-comments" className="mr-2" />
                  Chat en Vivo
                </Button>
                
                <a href="mailto:soporte@edutechlife.com">
                  <Button className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white">
                    <Icon name="fa-envelope" className="mr-2" />
                    Enviar Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpModal;