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
      <footer className="w-full relative px-6 lg:px-8 py-12" style={{ background: '#0A3044' }}>
        <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          <div className="lg:col-span-1">
             <div className="mb-6">
               <img 
                 src="/images/logo-edutechlife.webp" 
                 alt="Edutechlife Logo" 
                 className="h-12 w-auto transition-all duration-300 hover:scale-105"
                 style={{ maxHeight: '48px', width: 'auto', filter: 'brightness(0) invert(1)' }}
               />
             </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Transformando la educación con inteligencia artificial y metodologías 
              pedagógicas de vanguardia para las nuevas generaciones.
            </p>
            <div className="flex gap-3">
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
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-6">
              Plataforma
            </h4>
            <ul className="space-y-3">
              {[
                'IA Lab con Valerio',
                'Test VAK',
                'Proyectos SenaTIC',
                'Certificaciones',
                'Recursos Educativos',
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-6">
              Empresa
            </h4>
            <ul className="space-y-3">
              {[
                'Sobre Nosotros',
                'Metodología VAK',
                'Alianzas Estratégicas',
                'Blog Educativo',
                'Trabaja con Nosotros',
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-6">
              Newsletter
            </h4>
            <p className="text-white/60 text-sm mb-4">
              Recibe novidades educativas y actualizaciones de la plataforma.
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
      <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2024 Edutechlife. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              {['Política de Privacidad', 'Términos de Uso', 'Contacto'].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#1B9EBA]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </footer>
  );
}
