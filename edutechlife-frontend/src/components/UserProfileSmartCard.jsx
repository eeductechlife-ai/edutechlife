import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { supabase } from '../lib/supabase';
import { useProgressContext } from '../context/ProgressContext';
import { useTranslation } from '../i18n/I18nProvider';
import { Card, CardContent } from './ui/card-simple';
import { Icon } from '../utils/iconMapping.jsx';

const TOTAL_MODULES = 5;

const UserProfileSmartCard = ({ isOpen, onClose, onOpenChangeAvatar }) => {
  const { t, locale } = useTranslation();
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { courseProgress, completedModules, completedVideos, completedExams, completedInfographics, completedActivities, isLoading: progressLoading } = useProgressContext();

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
    role: 'student',
    total_learning_hours: 0,
    created_at: null,
  });

  const [pendingChanges, setPendingChanges] = useState({
    full_name: '',
    phone: '',
  });

  const [stats, setStats] = useState({
    completedLessons: 0,
    completedModules: 0,
    progressPercent: 0,
    certificates: 0,
    bestScore: 0,
  });

  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [phoneError, setPhoneError] = useState('');

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const hasLoadedRef = useRef(false);

  const getUserInitials = () => {
    const name = profileData.full_name || clerkUser?.firstName || 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const getRoleLabel = (role) => {
    const labels = { student: t('mobile_menu.role_student'), teacher: t('mobile_menu.role_teacher'), admin: t('profile.role_admin'), premium_student: t('profile.role_premium_student') };
    return labels[role] || t('mobile_menu.role_student');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      student: 'bg-white/15 text-white/90',
      teacher: 'bg-amber-400/20 text-amber-200',
      admin: 'bg-rose-400/20 text-rose-200',
      premium_student: 'bg-emerald-400/20 text-emerald-200',
    };
    return colors[role] || colors.student;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.length === 0) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10 && !digits.startsWith('3')) {
      return t('profile.phone_error_format');
    }
    if (digits.length > 0 && digits.length < 10) {
      return t('profile.phone_error_digits', { count: 10 - digits.length });
    }
    return '';
  };

  const hasPendingChanges = () => {
    return pendingChanges.full_name !== profileData.full_name ||
           pendingChanges.phone !== profileData.phone;
  };

  const loadProfileData = async () => {
    if (!clerkUser?.id || !clerkIsLoaded) return;

    setIsLoading(true);

    const clerkName = clerkUser.fullName || clerkUser.firstName || t('profile.user_fallback');
    const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
    const clerkRole = clerkUser.publicMetadata?.role || 'student';
    const clerkCreatedAt = clerkUser.createdAt;

    setProfileData((prev) => ({
      ...prev,
      full_name: clerkName,
      email: clerkEmail,
      role: clerkRole,
    }));
    setPendingChanges({
      full_name: clerkName,
      phone: '',
    });

    try {
      const [profileRes, certRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, phone, role, total_learning_hours, created_at').eq('id', clerkUser.id).maybeSingle(),
        supabase.from('certificates').select('id, overall_score').eq('user_id', clerkUser.id).maybeSingle(),
      ]);

      let learningHours = 0;
      let createdAt = clerkCreatedAt;

      if (profileRes.data) {
        const p = profileRes.data;
        const name = p.full_name || clerkName;
        const phone = p.phone || '';
        setProfileData((prev) => ({
          ...prev,
          full_name: name,
          email: p.email || clerkEmail,
          phone: phone,
          role: p.role || clerkRole,
          total_learning_hours: p.total_learning_hours || 0,
          created_at: p.created_at || createdAt,
        }));
        setPendingChanges({
          full_name: name,
          phone: phone,
        });
        learningHours = p.total_learning_hours || 0;
        if (p.created_at) createdAt = p.created_at;
        setIsSynced(true);
      } else {
        try {
          await supabase.from('profiles').insert({
            id: clerkUser.id,
            email: clerkEmail,
            full_name: clerkName,
            phone: '',
            role: clerkRole,
          });
        } catch {
        }
      }

      // Progreso viene del contexto global (usePersistentProgress)
      const completedLessons = completedVideos.length + completedInfographics.length + completedActivities.length + Object.values(completedExams).filter(Boolean).length;
      const completedModulesCount = completedModules.length;
      const progressPercent = courseProgress;

      setStats({
        completedLessons: Number(completedLessons),
        completedModules: Number(completedModulesCount),
        progressPercent: Math.round(Number(progressPercent)),
        certificates: certRes.data ? 1 : 0,
        bestScore: certRes.data?.overall_score || 0,
        learningHours,
        enrollmentDate: createdAt,
      });

      hasLoadedRef.current = true;
    } catch (err) {
      console.warn('Error loading profile:', err.message);
      setIsSynced(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      hasLoadedRef.current = false;
      return;
    }
    if (!clerkUser?.id || !clerkIsLoaded) return;
    if (hasLoadedRef.current) return;

    loadProfileData();
  }, [isOpen, clerkUser?.id, clerkIsLoaded]);

  // Actualizar stats cuando cambia el progreso global (mientras el modal está abierto)
  useEffect(() => {
    if (!isOpen) return;
    setStats((prev) => ({
      ...prev,
      completedLessons: completedVideos.length + completedInfographics.length + completedActivities.length + Object.values(completedExams).filter(Boolean).length,
      completedModules: completedModules.length,
      progressPercent: Math.round(courseProgress),
    }));
  }, [isOpen, courseProgress, completedModules, completedVideos, completedExams, completedInfographics, completedActivities]);

  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(profileData[field] || '');
    setPhoneError('');
    setTimeout(() => {
      if (field === 'full_name' && nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      } else if (field === 'phone' && phoneInputRef.current) {
        phoneInputRef.current.focus();
        phoneInputRef.current.select();
      }
    }, 50);
  };

  const handleTempChange = (field, value) => {
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '');
      setTempValue(digits);
      setPhoneError(validatePhone(digits));
      setPendingChanges((prev) => ({ ...prev, phone: digits }));
    } else {
      setTempValue(value);
      setPendingChanges((prev) => ({ ...prev, full_name: value }));
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
    setPhoneError('');
  };

  const handleSaveAll = async () => {
    if (!clerkUser?.id || !hasPendingChanges()) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const updates = {};
      if (pendingChanges.full_name !== profileData.full_name) {
        updates.full_name = pendingChanges.full_name;
      }
      if (pendingChanges.phone !== profileData.phone) {
        updates.phone = pendingChanges.phone;
      }

      if (Object.keys(updates).length === 0) {
        setIsSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: clerkUser.id, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      try {
        const nameParts = pendingChanges.full_name.trim().split(' ');
        await clerkUser.update({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
        });
      } catch (err) {
        console.warn('No se pudo actualizar Clerk:', err.message);
      }

      setProfileData((prev) => ({ ...prev, ...updates }));
      setPendingChanges((prev) => ({ ...prev }));

      window.dispatchEvent(new CustomEvent('profile-updated', {
        detail: { full_name: updates.full_name, phone: updates.phone }
      }));

      setSaveMessage({ type: 'success', text: t('profile.save_success') });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err.message);
      setSaveMessage({ type: 'error', text: t('profile.save_error') });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChangePassword = () => {
    try {
      if (openUserProfile) {
        openUserProfile();
        onClose();
        return;
      }
    } catch (err) {
      console.warn('openUserProfile failed:', err);
    }
    window.open('https://accounts.clerk.com', '_blank');
    onClose();
  };

  const handleLogout = async () => {
    if (window.confirm(t('profile.confirm_logout'))) {
      try {
        if (window.Clerk?.signOut) await window.Clerk.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
      onClose();
      window.location.href = '/';
    }
  };

  const formatDate = (date) => {
    if (!date) return t('profile.na');
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!isOpen) return null;

  const displayEmail = profileData.email || clerkUser?.primaryEmailAddress?.emailAddress || '';
  const displayName = profileData.full_name || clerkUser?.fullName || clerkUser?.firstName || t('profile.user_fallback');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      <Card className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[90vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label={t('common.close')}
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        {/* Header con gradiente corporativo */}
        <div className="relative bg-gradient-to-r from-[#004B63] to-[#00BCD4] px-6 pt-8 pb-16">
          <div className="flex flex-col items-center">
            {clerkUser?.imageUrl ? (
              <img
                src={clerkUser.imageUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-lg mb-3">
                <span className="text-white font-bold text-2xl">{getUserInitials()}</span>
              </div>
            )}
            <h2 className="text-white font-bold text-base text-center leading-tight">{displayName}</h2>
            <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getRoleBadgeColor(profileData.role)}`}>
              {getRoleLabel(profileData.role)}
            </span>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <CardContent className="p-5 overflow-y-auto flex-1">

          {/* Curso */}
          <div className="mb-5 p-3 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 border border-[#004B63]/10 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-graduation-cap" className="text-[#004B63] text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t('profile.enrolled_course')}</p>
                <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{t('profile.course_name')}</p>
                {stats.enrollmentDate && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    {t('profile.enrolled_from', { date: formatDate(stats.enrollmentDate) })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="mb-5">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Icon name="fa-user" className="text-[#004B63] text-xs" />
              {t('profile.personal_info')}
            </h4>

            <div className="space-y-2.5">
              {/* Email */}
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">{t('profile.email_label')}</label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-200/60 rounded-full flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Icon name="fa-envelope" className="text-slate-400 text-xs flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate">{displayEmail || t('profile.no_email')}</span>
                  </div>
                  <Icon name="fa-lock" className="text-slate-300 text-xs ml-2 flex-shrink-0" />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">{t('profile.phone_label')}</label>
                {editingField === 'phone' ? (
                  <div>
                    <div className="relative">
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        value={tempValue}
                        onChange={(e) => handleTempChange('phone', e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit(); }}
                        className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-xs"
                        placeholder={t('profile.phone_placeholder')}
                        maxLength="10"
                        disabled={isSaving}
                      />
                      <Icon name="fa-phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <button onClick={handleCancelEdit} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Icon name="fa-times" className="text-xs" />
                      </button>
                    </div>
                    {phoneError && <p className="text-[10px] text-amber-600 mt-1 ml-2">{phoneError}</p>}
                  </div>
                ) : (
                  <div
                    className="px-3 py-2.5 bg-white border border-slate-200/60 rounded-full cursor-pointer hover:bg-slate-50 hover:border-[#00BCD4]/30 transition-all flex items-center justify-between"
                    onClick={() => startEditing('phone')}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon name="fa-phone" className="text-slate-400 text-xs flex-shrink-0" />
                      <span className={`text-xs truncate ${profileData.phone ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                        {profileData.phone || t('profile.tap_to_add')}
                      </span>
                    </div>
                    <Icon name="fa-pencil" className="text-slate-400 text-xs ml-2 flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* Nombre completo */}
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">{t('profile.name_label')}</label>
                {editingField === 'full_name' ? (
                  <div className="relative">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={tempValue}
                      onChange={(e) => handleTempChange('full_name', e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit(); }}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-xs"
                      placeholder={t('profile.name_placeholder')}
                      disabled={isSaving}
                    />
                    <Icon name="fa-user" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <button onClick={handleCancelEdit} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      <Icon name="fa-times" className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="px-3 py-2.5 bg-white border border-slate-200/60 rounded-full cursor-pointer hover:bg-slate-50 hover:border-[#00BCD4]/30 transition-all flex items-center justify-between"
                    onClick={() => startEditing('full_name')}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon name="fa-user" className="text-slate-400 text-xs flex-shrink-0" />
                      <span className="text-xs text-slate-700 truncate">{displayName}</span>
                    </div>
                    <Icon name="fa-pencil" className="text-slate-400 text-xs ml-2 flex-shrink-0" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botón Guardar Cambios */}
          {hasPendingChanges() && (
            <div className="mb-5">
              <button
                onClick={handleSaveAll}
                disabled={isSaving || (phoneError && tempValue.length > 0)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#004B63] to-[#00BCD4] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Icon name="fa-spinner" className="animate-spin" />
                    {t('profile.saving')}
                  </>
                ) : (
                  <>
                    <Icon name="fa-save" />
                    {t('profile.save_button')}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Feedback de guardado */}
          {saveMessage && (
            <div className={`mb-5 p-3 rounded-lg border ${saveMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <p className={`text-xs flex items-center gap-2 ${saveMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                <Icon name={saveMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} className={saveMessage.type === 'success' ? 'text-emerald-500' : 'text-rose-500'} />
                {saveMessage.text}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Icon name="fa-cog" className="text-[#004B63] text-xs" />
              {t('profile.actions_title')}
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => { onClose(); if (onOpenChangeAvatar) onOpenChangeAvatar(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-camera" className="text-[#004B63] text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-800">{t('profile.change_photo')}</span>
              </button>

              <button
                onClick={handleOpenChangePassword}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-key" className="text-[#004B63] text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-800">{t('mobile_menu.change_password')}</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-2">
                <Icon name="fa-spinner" className="text-2xl text-[#00BCD4] animate-spin" />
                <p className="text-xs text-slate-500">{t('profile.loading')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSmartCard;
