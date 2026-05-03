import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { supabase } from '../../lib/supabase';
import { Icon } from '../../utils/iconMapping.jsx';

const NotificationsModal = ({ isOpen, onClose }) => {
  const { user: clerkUser } = useUser();
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    course_updates: true,
    promotions: false,
    forum_replies: true,
    tutoría_reminders: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !clerkUser?.id) return;
    loadPreferences();
  }, [isOpen, clerkUser?.id]);

  const loadPreferences = async () => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('email_notifications, push_notifications, course_updates, promotions, forum_replies, tutoría_reminders')
        .eq('user_id', clerkUser.id)
        .maybeSingle();

      if (data) {
        setPreferences((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // Preferencias por defecto
    }
  };

  const togglePreference = async (key) => {
    const newValue = !preferences[key];
    setPreferences((prev) => ({ ...prev, [key]: newValue }));

    if (!clerkUser?.id) return;

    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', clerkUser.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_preferences')
          .update({ [key]: newValue, updated_at: new Date().toISOString() })
          .eq('user_id', clerkUser.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert({
            user_id: clerkUser.id,
            [key]: newValue,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      console.warn('Error saving preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const notificationItems = [
    { key: 'email_notifications', label: 'Notificaciones por Email', description: 'Recibe actualizaciones por correo', icon: 'fa-envelope' },
    { key: 'push_notifications', label: 'Notificaciones Push', description: 'Alertas en tiempo real', icon: 'fa-bell' },
    { key: 'course_updates', label: 'Actualizaciones de Cursos', description: 'Nuevo contenido y cambios', icon: 'fa-graduation-cap' },
    { key: 'promotions', label: 'Promociones y Ofertas', description: 'Descuentos especiales', icon: 'fa-tag' },
    { key: 'forum_replies', label: 'Respuestas del Foro', description: 'Cuando respondan a tus publicaciones', icon: 'fa-message' },
    { key: 'tutoría_reminders', label: 'Recordatorios de Tutoría', description: 'Antes de cada sesión en vivo', icon: 'fa-calendar' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label="Cerrar"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <div className="border-b border-slate-200/60 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 pt-10 pb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-bell" className="text-[#004B63] text-sm" />
            </div>
            <h3 className="text-slate-800 font-bold text-base">Notificaciones</h3>
          </div>
        </div>

        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-600 text-xs flex items-center gap-2">
                <Icon name="fa-check-circle" className="text-emerald-500" />
                Preferencias guardadas
              </p>
            </div>
          )}

          <div className="space-y-3">
            {notificationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 border border-slate-200/60 rounded-lg hover:border-[#00BCD4]/30 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={item.icon} className="text-[#004B63] text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference(item.key)}
                  disabled={isSaving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3 ${
                    preferences[item.key] ? 'bg-[#00BCD4]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      preferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
