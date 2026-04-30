import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const HelpModal = ({ isOpen, onClose }) => {
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
          a: 'Ve a "Seguridad" en tu perfil. Si usas Clerk, haz clic en "Gestionar cuenta" para abrir el panel de Clerk.',
        },
        {
          q: '¿Cómo actualizo mi información personal?',
          a: 'Haz clic en tu avatar > "Mi Perfil". Puedes editar tu nombre y teléfono directamente.',
        },
        {
          q: '¿Cómo elimino mi cuenta?',
          a: 'Contacta a soporte@edutechlife.com para solicitar la eliminación de tu cuenta.',
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
          a: 'Todos tus cursos están en el Dashboard principal. Haz clic en "Continuar" para retomar.',
        },
        {
          q: '¿Cómo descargo mis certificados?',
          a: 'Ve a "Mis Certificados" en el menú de usuario. Los certificados completados tienen botón de descarga PDF.',
        },
        {
          q: '¿Los certificados tienen validez oficial?',
          a: 'Sí, todos nuestros certificados son digitales, verificables y tienen validez educativa y profesional.',
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
          a: 'Intenta: 1) Recargar (Ctrl+F5), 2) Limpiar caché, 3) Modo incógnito.',
        },
        {
          q: 'No puedo iniciar sesión',
          a: 'Verifica tu conexión y correo correcto. Si usas Clerk, confirma tu email primero.',
        },
        {
          q: 'Los videos no se reproducen',
          a: 'Asegúrate de tener la última versión del navegador y JavaScript habilitado.',
        },
      ],
    },
  ];

  const contactCategories = [
    { value: 'general', label: 'Consulta General' },
    { value: 'technical', label: 'Soporte Técnico' },
    { value: 'billing', label: 'Facturación y Pagos' },
    { value: 'courses', label: 'Cursos y Contenido' },
    { value: 'other', label: 'Otro' },
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('📧 Formulario de contacto enviado:', contactForm);
      setContactForm({ name: '', email: '', subject: '', message: '', category: 'general' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <Card className="w-full max-w-2xl bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>
        
        <CardHeader className="border-b border-slate-200/60 bg-white sticky top-0 z-10 pt-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-question-circle" className="text-[#004B63]" />
            </div>
            <CardTitle className="text-slate-800 font-bold text-sm">
              Ayuda y Soporte
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div className="space-y-4">
            <div className="flex gap-2">
              {[
                { id: 'faq', label: 'Preguntas Frecuentes', icon: 'fa-question' },
                { id: 'contact', label: 'Contactar', icon: 'fa-envelope' },
                { id: 'resources', label: 'Recursos', icon: 'fa-book' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] shadow-sm text-[#004B63]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon name={tab.icon} className="text-xs" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            
            {activeTab === 'faq' && (
              <div className="space-y-3">
                {faqCategories.map(category => (
                  <div key={category.id} className="border border-slate-200/60 rounded-xl bg-white overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                          <Icon name={category.icon} className="text-[#004B63] text-xs" />
                        </div>
                        <h3 className="font-semibold text-[#004B63] text-sm">{category.title}</h3>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      {category.questions.map((item, index) => (
                        <details key={index} className="group">
                          <summary className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg hover:bg-slate-50 list-none">
                            <span className="font-medium text-slate-700 text-sm">{item.q}</span>
                            <Icon name="fa-chevron-down" className="text-slate-400 text-xs group-open:rotate-180 transition-transform duration-300 flex-shrink-0 ml-2" />
                          </summary>
                          <div className="px-2 py-2 bg-slate-50 rounded-lg mt-1 ml-2 mr-2">
                            <p className="text-slate-600 text-sm">{item.a}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => alert('💬 Chat de soporte abierto. Nuestro equipo te atenderá en breve.')}
                    className="p-3 border border-slate-200/60 rounded-xl text-center hover:border-[#00BCD4] hover:bg-slate-50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center mx-auto mb-2">
                      <Icon name="fa-comments" className="text-[#004B63]" />
                    </div>
                    <h4 className="font-semibold text-[#004B63] text-xs">Chat en Vivo</h4>
                    <p className="text-[10px] text-slate-500 mt-1">9am-6pm</p>
                  </button>
                  
                  <button
                    onClick={() => window.open('https://calendly.com/edutechlife-soporte/30min', '_blank')}
                    className="p-3 border border-slate-200/60 rounded-xl text-center hover:border-[#00BCD4] hover:bg-slate-50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center mx-auto mb-2">
                      <Icon name="fa-phone" className="text-[#004B63]" />
                    </div>
                    <h4 className="font-semibold text-[#004B63] text-xs">Llamada</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Calendly</p>
                  </button>
                  
                  <a
                    href="mailto:soporte@edutechlife.com"
                    className="p-3 border border-slate-200/60 rounded-xl text-center hover:border-[#00BCD4] hover:bg-slate-50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center mx-auto mb-2">
                      <Icon name="fa-envelope" className="text-[#004B63]" />
                    </div>
                    <h4 className="font-semibold text-[#004B63] text-xs">Email</h4>
                    <p className="text-[10px] text-slate-500 mt-1">24h respuesta</p>
                  </a>
                </div>
                
                <div className="border border-slate-200/60 rounded-xl p-4 bg-white">
                  <h3 className="font-semibold text-[#004B63] text-sm mb-3">Envíanos un Mensaje</h3>
                  
                  {submitSuccess && (
                    <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-emerald-700 text-xs flex items-center gap-2">
                        <Icon name="fa-check-circle" className="text-emerald-500" />
                        ✅ Mensaje enviado. Te responderemos en 24 horas.
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Nombre *</label>
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-sm"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-sm"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Categoría *</label>
                      <select
                        name="category"
                        value={contactForm.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-sm"
                      >
                        {contactCategories.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Asunto *</label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-sm"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Mensaje *</label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] resize-none text-sm"
                        placeholder="Describe tu consulta con detalle..."
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-800 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Icon name="fa-spinner" className="animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Icon name="fa-paper-plane" />
                            Enviar
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setContactForm({ name: '', email: '', subject: '', message: '', category: 'general' })}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200/60 rounded-lg shadow-sm hover:bg-slate-50 transition-all duration-300 text-xs font-semibold text-slate-600"
                      >
                        <Icon name="fa-eraser" />
                        Limpiar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <div className="border border-slate-200/60 rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                      <Icon name="fa-book-open" className="text-[#004B63] text-xs" />
                    </div>
                    <h3 className="font-semibold text-[#004B63] text-sm">Guías y Tutoriales</h3>
                  </div>
                  
                  <div className="space-y-1.5">
                    {[
                      'Guía de inicio rápido',
                      'Tutorial: Cómo tomar un curso',
                      'Manual del Dashboard',
                      'Configuración avanzada',
                    ].map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm text-slate-700 hover:text-[#004B63]">{item}</span>
                        <Icon name="fa-chevron-right" className="text-slate-400 text-xs" />
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="border border-slate-200/60 rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
                      <Icon name="fa-video" className="text-[#004B63] text-xs" />
                    </div>
                    <h3 className="font-semibold text-[#004B63] text-sm">Videos Explicativos</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { title: 'Tour por la plataforma', duration: '5:23' },
                      { title: 'Cómo completar un curso', duration: '8:45' },
                      { title: 'Gestión de certificados', duration: '6:12' },
                    ].map((video, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name="fa-play" className="text-slate-600 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-700 text-sm truncate">{video.title}</p>
                          <p className="text-[10px] text-slate-500">{video.duration}</p>
                        </div>
                        <button className="text-[#00BCD4] hover:text-[#004B63] transition-colors">
                          <Icon name="fa-play-circle" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border border-slate-200/60 rounded-xl p-4 bg-white">
                  <h3 className="font-semibold text-[#004B63] text-sm mb-3">Comunidad</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: 'fa-users', label: 'Foro', desc: 'Comparte y aprende' },
                      { icon: 'fa-lightbulb', label: 'Ideas', desc: 'Sugerencias' },
                      { icon: 'fa-newspaper', label: 'Blog', desc: 'Noticias' },
                    ].map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="p-3 border border-slate-200/60 rounded-lg hover:border-[#00BCD4] hover:bg-slate-50 transition-all text-center"
                      >
                        <Icon name={item.icon} className="text-[#004B63] mb-1.5" />
                        <p className="font-medium text-[#004B63] text-xs">{item.label}</p>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t border-slate-200/60 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#004B63] text-sm">¿Necesitas ayuda urgente?</p>
                  <p className="text-xs text-slate-500">Estamos aquí para ayudarte</p>
                </div>
                <a href="mailto:soporte@edutechlife.com">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-semibold">
                    <Icon name="fa-envelope" />
                    Enviar Email
                  </button>
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