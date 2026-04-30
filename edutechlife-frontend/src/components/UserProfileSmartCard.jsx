import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card-simple';
import { Icon } from '../utils/iconMapping.jsx';

const COURSE_NAME = 'Introducción a la Inteligencia Artificial Generativa';
const TOTAL_LESSONS = 24;
const TOTAL_MODULES = 5;

const UserProfileSmartCard = ({ isOpen, onClose, onOpenChangePassword, onOpenChangeAvatar }) => {
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
    role: 'student',
    total_learning_hours: 0,
    created_at: null,
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
    const labels = { student: 'Estudiante', teacher: 'Profesor', admin: 'Administrador', premium_student: 'Estudiante Premium' };
    return labels[role] || 'Estudiante';
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

  const loadProfileData = async () => {
    if (!clerkUser?.id || !clerkIsLoaded) return;

    setIsLoading(true);

    const clerkName = clerkUser.fullName || clerkUser.firstName || 'Usuario Edutechlife';
    const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
    const clerkRole = clerkUser.publicMetadata?.role || 'student';
    const clerkCreatedAt = clerkUser.createdAt;

    setProfileData((prev) => ({
      ...prev,
      full_name: clerkName,
      email: clerkEmail,
      role: clerkRole,
    }));

    try {
      const [profileRes, progressRes, certRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, phone, role, total_learning_hours, created_at').eq('id', clerkUser.id).maybeSingle(),
        supabase.rpc('get_user_overall_progress', { p_user_id: clerkUser.id }),
        supabase.from('certificates').select('id, overall_score').eq('user_id', clerkUser.id).maybeSingle(),
      ]);

      let learningHours = 0;
      let createdAt = clerkCreatedAt;

      if (profileRes.data) {
        const p = profileRes.data;
        setProfileData((prev) => ({
          ...prev,
          full_name: p.full_name || clerkName,
          email: p.email || clerkEmail,
          phone: p.phone || '',
          role: p.role || clerkRole,
          total_learning_hours: p.total_learning_hours || 0,
          created_at: p.created_at || createdAt,
        }));
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
          // Ignorar error de duplicado
        }
      }

      const completedLessons = progressRes.data?.[0]?.completed_lessons || 0;
      const completedModules = progressRes.data?.[0]?.completed_modules || 0;
      const percentage = progressRes.data?.[0]?.percentage || 0;

      setStats({
        completedLessons: Number(completedLessons),
        completedModules: Number(completedModules),
        progressPercent: Math.round(Number(percentage)),
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

  const saveField = async (field, value) => {
    if (!clerkUser?.id) return;

    setIsSaving(true);

    try {
      const updateData = {};
      if (field === 'full_name') updateData.full_name = value;
      if (field === 'phone') updateData.phone = value;

      const { error } = await supabase.from('profiles').update(updateData).eq('id', clerkUser.id);

      if (error) {
        console.warn('Error saving:', error.message);
      }

      setProfileData((prev) => ({ ...prev, [field]: value }));
    } catch (err) {
      console.warn('Exception saving:', err.message);
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(profileData[field] || '');
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

  const handleSave = (field) => {
    const newValue = tempValue.trim();
    if (newValue !== profileData[field] && newValue.length > 0) {
      saveField(field, newValue);
    } else {
      setEditingField(null);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') handleSave(field);
    if (e.key === 'Escape') { setEditingField(null); setTempValue(''); }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Cerrar sesión?')) {
      try {
        if (window.Clerk?.signOut) await window.Clerk.signOut();
        else if (window.Clerk) await window.Clerk.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
      onClose();
      window.location.href = '/';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!isOpen) return null;

  const displayEmail = profileData.email || clerkUser?.primaryEmailAddress?.emailAddress || '';
  const displayName = profileData.full_name || clerkUser?.fullName || clerkUser?.firstName || 'Usuario';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      <Card className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[90vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label="Cerrar"
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

        {/* Estadísticas - overlapping el header */}
        <div className="px-5 -mt-8 relative z-10">
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-md p-3 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xl font-bold text-[#004B63]">{stats.progressPercent}%</p>
              <p className="text-[10px] text-slate-500 font-medium">Progreso</p>
            </div>
            <div className="text-center border-x border-slate-200/60">
              <p className="text-xl font-bold text-[#00BCD4]">{stats.completedModules}/{TOTAL_MODULES}</p>
              <p className="text-[10px] text-slate-500 font-medium">Módulos</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600">{stats.certificates}</p>
              <p className="text-[10px] text-slate-500 font-medium">Certificados</p>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <CardContent className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          {/* Barra de progreso visual */}
          {stats.progressPercent > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Avance del curso</span>
                <span className="text-[10px] text-slate-500">{stats.completedLessons}/{TOTAL_LESSONS} lecciones</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full transition-all duration-700"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Curso */}
          <div className="mb-5 p-3 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 border border-[#004B63]/10 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-graduation-cap" className="text-[#004B63] text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Curso Inscrito</p>
                <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{COURSE_NAME}</p>
                {stats.enrollmentDate && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Inscrito desde: {formatDate(stats.enrollmentDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="mb-5">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Icon name="fa-user" className="text-[#004B63] text-xs" />
              Información Personal
            </h4>

            <div className="space-y-2.5">
              {/* Email */}
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">Correo electrónico</label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-200/60 rounded-full flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Icon name="fa-envelope" className="text-slate-400 text-xs flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate">{displayEmail || 'Sin correo'}</span>
                  </div>
                  <Icon name="fa-lock" className="text-slate-300 text-xs ml-2 flex-shrink-0" />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">Teléfono</label>
                {editingField === 'phone' ? (
                  <div className="relative">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value.replace(/\D/g, ''))}
                      onBlur={() => handleSave('phone')}
                      onKeyDown={(e) => handleKeyDown(e, 'phone')}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-xs"
                      placeholder="3001234567"
                      maxLength="10"
                      disabled={isSaving}
                    />
                    <Icon name="fa-phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    {isSaving && <Icon name="fa-spinner" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00BCD4] text-xs animate-spin" />}
                  </div>
                ) : (
                  <div
                    className="px-3 py-2.5 bg-white border border-slate-200/60 rounded-full cursor-pointer hover:bg-slate-50 hover:border-[#00BCD4]/30 transition-all flex items-center justify-between"
                    onClick={() => startEditing('phone')}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon name="fa-phone" className="text-slate-400 text-xs flex-shrink-0" />
                      <span className={`text-xs truncate ${profileData.phone ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                        {profileData.phone || 'Toca para agregar'}
                      </span>
                    </div>
                    <Icon name="fa-pencil" className="text-slate-400 text-xs ml-2 flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* Nombre completo */}
              <div>
                <label className="text-[10px] font-medium text-slate-500 block mb-1">Nombre completo</label>
                {editingField === 'full_name' ? (
                  <div className="relative">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={() => handleSave('full_name')}
                      onKeyDown={(e) => handleKeyDown(e, 'full_name')}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4] text-xs"
                      placeholder="Tu nombre completo"
                      disabled={isSaving}
                    />
                    <Icon name="fa-user" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    {isSaving && <Icon name="fa-spinner" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00BCD4] text-xs animate-spin" />}
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

          {/* Acciones */}
          <div>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Icon name="fa-cog" className="text-[#004B63] text-xs" />
              Acciones
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => { onClose(); if (onOpenChangeAvatar) onOpenChangeAvatar(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-camera" className="text-[#004B63] text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Cambiar Foto de Perfil</span>
              </button>

              <button
                onClick={() => { onClose(); if (onOpenChangePassword) onOpenChangePassword(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-key" className="text-[#004B63] text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Cambiar Contraseña</span>
              </button>

              <button
                onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-security-modal')); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-shield-halved" className="text-[#004B63] text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Seguridad</span>
              </button>

              <div className="border-t border-slate-200/60 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-rose-400 rounded-lg shadow-sm hover:shadow hover:border-l-rose-500 hover:bg-rose-50/50 transition-all duration-300 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400/10 to-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-sign-out-alt" className="text-rose-500 text-xs" />
                </div>
                <span className="text-xs font-semibold text-rose-600">Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-2">
                <Icon name="fa-spinner" className="text-2xl text-[#00BCD4] animate-spin" />
                <p className="text-xs text-slate-500">Cargando perfil...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSmartCard;
