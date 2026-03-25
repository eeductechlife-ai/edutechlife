import { useState } from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const socialLinks = [
  { icon: 'fa-brands fa-facebook-f', label: 'Facebook', href: 'https://web.facebook.com/eductechlife/' },
  { icon: 'fa-brands fa-instagram', label: 'Instagram', href: 'https://www.instagram.com/edu_techlife/' },
  { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/edutechlife' },
  { icon: 'fa-brands fa-youtube', label: 'YouTube', href: 'https://www.youtube.com/@edutechlife' },
];

const toolLinks = [
  { label: 'IA Lab con Valerio', view: 'ialab' },
  { label: 'SmartBoard', view: 'neuroentorno' },
  { label: 'Diagnóstico VAK', view: 'vak' },
  { label: 'ROI Calculator', view: 'consultoria' },
  { label: 'Automation Architect', view: 'automation' },
];

const resourceLinks = [
  { label: 'Metodología VAK', href: '#vak' },
  { label: 'Proyectos SenaTIC', view: 'proyectos' },
  { label: 'Certificaciones', href: '#certificaciones' },
  { label: 'Blog Educativo', href: '#blog' },
  { label: 'Documentación', href: '#docs' },
];

const legalLinks = ['Política de Privacidad', 'Términos de Uso', 'Contacto'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isHoveringSocial, setIsHoveringSocial] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    
    setEmailError(false);
    setSubscribed(true);
    setEmail('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(false);
  };

  const navigateTo = (view) => {
    if (view) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: view }));
    }
  };

  return (
    <footer className="relative w-full z-50 mt-auto" style={{ backgroundColor: '#2E8A9E' }}>
      
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          
          {/* Columna 1 - Brand & Social */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src="/images/logo-edutechlife.webp" 
                alt="Edutechlife" 
                className="h-12 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            
            {/* Descripción */}
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#FFFFFF' }}>
              Transformando la educación con inteligencia artificial y metodologías pedagógicas de vanguardia para el futuro digital.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: isHoveringSocial === index ? '#004B63' : 'transparent',
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={() => setIsHoveringSocial(index)}
                  onMouseLeave={() => setIsHoveringSocial(null)}
                >
                  <Icon name={social.icon} className="text-base" style={{ color: '#FFFFFF' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 - Herramientas */}
          <div>
            <h4 
              className="text-sm font-semibold uppercase tracking-wider mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Herramientas
            </h4>
            <ul className="space-y-4">
              {toolLinks.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigateTo(item.view)}
                    className="flex items-center gap-3 group w-full text-left text-sm transition-colors duration-200"
                    style={{ 
                      color: '#FFFFFF',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#66CCCC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#FFFFFF' }}
                    />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Recursos */}
          <div>
            <h4 
              className="text-sm font-semibold uppercase tracking-wider mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Recursos
            </h4>
            <ul className="space-y-4">
              {resourceLinks.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigateTo(item.view)}
                    className="flex items-center gap-3 group w-full text-left text-sm transition-colors duration-200"
                    style={{ 
                      color: '#FFFFFF',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#66CCCC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#FFFFFF' }}
                    />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 - Newsletter */}
          <div>
            <h4 
              className="text-sm font-semibold uppercase tracking-wider mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Newsletter
            </h4>
            <p className="text-sm mb-5" style={{ color: '#FFFFFF' }}>
              Recibe novedades educativas y actualizaciones de la plataforma.
            </p>
            
            {subscribed ? (
              /* Estado de éxito */
              <div 
                className="rounded-xl p-5 text-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <Icon name="fa-check" className="text-xl" style={{ color: '#FFFFFF' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                  ¡Gracias por suscribirte!
                </p>
                <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>
                  Te mantendremos informado
                </p>
              </div>
            ) : (
              /* Formulario de suscripción */
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.borderColor = '#FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  />
                  {emailError && (
                    <p className="text-xs mt-1" style={{ color: '#FF6B9D' }}>
                      Ingresa un email válido
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: '#004B63',
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#003d52';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#004B63';
                  }}
                >
                  <span style={{ color: '#FFFFFF' }}>Suscribirme</span>
                  <Icon name="fa-paper-plane" className="text-xs" style={{ color: '#FFFFFF' }} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divisor Simple */}
        <div 
          className="h-px w-full mb-6"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#FFFFFF' }}
            />
            <p className="text-sm" style={{ color: '#FFFFFF' }}>
              © 2026 Edutechlife Premium. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
              {legalLinks.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm transition-colors duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#66CCCC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  {item}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
