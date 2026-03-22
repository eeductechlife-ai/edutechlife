import { useState, useEffect } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
      <footer className="w-full px-6 lg:px-8 py-12 mt-auto" style={{ background: '#0A3044' }}>
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="lg:col-span-1">
               <img 
                 src="/images/logo-edutechlife.webp" 
                 alt="Edutechlife Logo" 
                 className="h-10 w-auto mb-4"
                 style={{ maxHeight: '40px', width: 'auto', filter: 'brightness(0) invert(1)' }}
               />
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Transformando la educación con inteligencia artificial y metodologías 
              pedagógicas de vanguardia para las nuevas generaciones.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              {[
                { icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
                { icon: 'fa-brands fa-instagram', label: 'Instagram' },
                { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
                { icon: 'fa-brands fa-youtube', label: 'YouTube' },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1B9EBA] hover:text-white transition-all duration-300"
                >
                  <i className={`fa-solid ${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Herramientas
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'IA Lab con Valerio', view: 'ialab' },
                { label: 'SmartBoard', view: 'neuroentorno' },
                { label: 'Test VAK', view: 'neuroentorno' },
                { label: 'ROI Calculator', view: 'consultoria' },
                { label: 'Automation Architect', view: 'automation' },
              ].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: item.view }))}
                    className="text-white/60 hover:text-[#1B9EBA] transition-colors duration-200 text-sm flex items-center gap-2 group w-full text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#1B9EBA] transition-colors" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Recursos
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Metodología VAK', href: '#vak' },
                { label: 'Proyectos SenaTIC', view: 'proyectos' },
                { label: 'Certificaciones', href: '#certificaciones' },
                { label: 'Blog Educativo', href: '#blog' },
                { label: 'Documentación', href: '#docs' },
              ].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => item.view && window.dispatchEvent(new CustomEvent('navigate', { detail: item.view }))}
                    className="text-white/60 hover:text-[#1B9EBA] transition-colors duration-200 text-sm flex items-center gap-2 group w-full text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#1B9EBA] transition-colors" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <p className="text-white/60 text-sm mb-3">
              Recibe novedades educativas y actualizaciones de la plataforma.
            </p>
            {subscribed ? (
               <div className="bg-white/10 rounded-xl p-4 text-center">
                 <i className="fa-solid fa-check-circle text-[#1B9EBA] text-2xl mb-2"></i>
                 <p className="text-white text-sm">¡Gracias por suscribirte!</p>
               </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="tu@email.com"
                   className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#1B9EBA] transition-colors"
                   required
                 />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1B9EBA] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Suscribirme
                  </button>
               </form>
             )}
           </div>
        </div>
      <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-white/50 text-sm">
              © 2026 Edutechlife. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {['Política de Privacidad', 'Términos de Uso', 'Contacto'].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/50 hover:text-[#1B9EBA] text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#1B9EBA]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </footer>
  );
}
