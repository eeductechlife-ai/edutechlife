/**
 * Modal de Configuración - Preferencias de usuario
 * Diseño premium con estilos corporativos Edutechlife
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Button } from '../ui/button-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const SettingsModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    promotions: false,
  });
  
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // Simular guardado de configuración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en localStorage
      localStorage.setItem('edutechlife_settings', JSON.stringify({
        notifications,
        language,
        theme,
        autoSave,
        savedAt: new Date().toISOString()
      }));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      console.log('✅ Configuración guardada:', { notifications, language, theme, autoSave });
    } catch (error) {
      console.error('❌ Error al guardar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      push: true,
      courseUpdates: true,
      promotions: false,
    });
    setLanguage('es');
    setTheme('light');
    setAutoSave(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 border border-cyan-500/20 shadow-2xl">
        <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#004B63] font-display font-bold flex items-center gap-2">
              <Icon name="fa-sliders-h" className="text-[#00BCD4]" />
              Configuración
            </CardTitle>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-[#004B63] transition-colors p-1.5 rounded-lg hover:bg-cyan-50"
            >
              <Icon name="fa-times" className="text-lg" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Notificaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#004B63] flex items-center gap-2">
              <Icon name="fa-bell" className="text-cyan-500" />
              Notificaciones
            </h3>
            
            <div className="space-y-3">
              {[
                { id: 'email', label: 'Notificaciones por Email', description: 'Recibe actualizaciones importantes por correo' },
                { id: 'push', label: 'Notificaciones Push', description: 'Alertas en tiempo real en tu dispositivo' },
                { id: 'courseUpdates', label: 'Actualizaciones de Cursos', description: 'Nuevo contenido y anuncios de cursos' },
                { id: 'promotions', label: 'Promociones y Ofertas', description: 'Descuentos y ofertas especiales' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-cyan-300 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${notifications[item.id] ? 'bg-[#00BCD4]' : 'bg-slate-300'}`}></div>
                      <div>
                        <p className="font-medium text-[#004B63]">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.id] ? 'bg-[#00BCD4]' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Idioma */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#004B63] flex items-center gap-2">
              <Icon name="fa-globe" className="text-cyan-500" />
              Idioma
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { code: 'es', name: 'Español', flag: '🇪🇸' },
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'pt', name: 'Português', flag: '🇧🇷' },
                { code: 'fr', name: 'Français', flag: '🇫🇷' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-4 border rounded-lg text-left transition-all ${language === lang.code ? 'border-[#00BCD4] bg-cyan-50' : 'border-slate-200 hover:border-cyan-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="font-medium text-[#004B63]">{lang.name}</p>
                      <p className="text-sm text-slate-500">{lang.code.toUpperCase()}</p>
                    </div>
                    {language === lang.code && (
                      <div className="ml-auto">
                        <Icon name="fa-check" className="text-[#00BCD4]" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#004B63] flex items-center gap-2">
              <Icon name="fa-palette" className="text-cyan-500" />
              Tema
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', name: 'Claro', icon: 'fa-sun', color: 'from-yellow-100 to-yellow-300' },
                { id: 'dark', name: 'Oscuro', icon: 'fa-moon', color: 'from-slate-800 to-slate-900' },
                { id: 'auto', name: 'Automático', icon: 'fa-adjust', color: 'from-cyan-100 to-blue-300' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 border rounded-lg text-center transition-all ${theme === t.id ? 'border-[#00BCD4] ring-2 ring-cyan-100' : 'border-slate-200 hover:border-cyan-200'}`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon name={t.icon} className="text-white text-lg" />
                  </div>
                  <p className="font-medium text-[#004B63]">{t.name}</p>
                  {theme === t.id && (
                    <div className="mt-1">
                      <Icon name="fa-check" className="text-[#00BCD4] mx-auto" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Otras configuraciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#004B63] flex items-center gap-2">
              <Icon name="fa-cog" className="text-cyan-500" />
              Otras Configuraciones
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <Icon name="fa-save" />
                  </div>
                  <div>
                    <p className="font-medium text-[#004B63]">Guardado Automático</p>
                    <p className="text-sm text-slate-500">Guarda tu progreso automáticamente</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSave ? 'bg-[#00BCD4]' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icon name="fa-download" />
                  </div>
                  <div>
                    <p className="font-medium text-[#004B63]">Descarga Automática</p>
                    <p className="text-sm text-slate-500">Descarga recursos automáticamente</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                  Configurar
                </button>
              </div>
            </div>
          </div>
          
          {/* Feedback de guardado */}
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-600 flex items-center gap-2">
                <Icon name="fa-check-circle" className="text-emerald-500" />
                ✅ Configuración guardada exitosamente
              </p>
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 h-12"
            >
              <Icon name="fa-undo" className="mr-2" />
              Restablecer
            </Button>
            
            <Button
              onClick={handleSaveSettings}
              className="flex-1 bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90 text-white h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="fa-spinner" className="animate-spin" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="fa-save" />
                  Guardar Cambios
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModal;