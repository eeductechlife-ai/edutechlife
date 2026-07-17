import { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { supabase } from '../../lib/supabase';
import { useProgressContext } from '../../context/ProgressContext';
import { useTranslation } from '../../i18n/I18nProvider';

export function useProfileData({ isOpen, onClose, onOpenChangeAvatar }) {
  const { t, locale } = useTranslation();
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { courseProgress, completedModules, completedVideos, completedExams, completedInfographics, completedActivities } = useProgressContext();

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
    role: 'student',
    total_learning_hours: 0,
    created_at: null,
  });

  const [pendingChanges, setPendingChanges] = useState({ full_name: '', phone: '' });

  const [stats, setStats] = useState({
    completedLessons: 0,
    completedModules: 0,
    progressPercent: 0,
    certificates: 0,
    bestScore: 0,
    learningHours: 0,
    enrollmentDate: null,
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

  const formatDate = (date) => {
    if (!date) return t('profile.na');
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const loadProfileData = async () => {
    if (!clerkUser?.id || !clerkIsLoaded) return;
    setIsLoading(true);

    const clerkName = clerkUser.fullName || clerkUser.firstName || t('profile.user_fallback');
    const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
    const clerkRole = clerkUser.publicMetadata?.role || 'student';
    const clerkCreatedAt = clerkUser.createdAt;

    setProfileData((prev) => ({ ...prev, full_name: clerkName, email: clerkEmail, role: clerkRole }));
    setPendingChanges({ full_name: clerkName, phone: '' });

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
          phone,
          role: p.role || clerkRole,
          total_learning_hours: p.total_learning_hours || 0,
          created_at: p.created_at || createdAt,
        }));
        setPendingChanges({ full_name: name, phone });
        learningHours = p.total_learning_hours || 0;
        if (p.created_at) createdAt = p.created_at;
        setIsSynced(true);
      } else {
        try {
          await supabase.from('profiles').insert({
            id: clerkUser.id, email: clerkEmail, full_name: clerkName, phone: '', role: clerkRole,
          });
        } catch { /* empty */ }
      }

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
      if (pendingChanges.full_name !== profileData.full_name) updates.full_name = pendingChanges.full_name;
      if (pendingChanges.phone !== profileData.phone) updates.phone = pendingChanges.phone;

      if (Object.keys(updates).length === 0) {
        setIsSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: clerkUser.id, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw new Error(error.message);

      try {
        const nameParts = pendingChanges.full_name.trim().split(' ');
        await clerkUser.update({ firstName: nameParts[0], lastName: nameParts.slice(1).join(' ') });
      } catch (err) {
        console.warn('No se pudo actualizar Clerk:', err.message);
      }

      setProfileData((prev) => ({ ...prev, ...updates }));
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

  const displayEmail = profileData.email || clerkUser?.primaryEmailAddress?.emailAddress || '';
  const displayName = profileData.full_name || clerkUser?.fullName || clerkUser?.firstName || t('profile.user_fallback');

  return {
    t,
    locale,
    profileData,
    pendingChanges,
    stats,
    isLoading,
    editingField,
    tempValue,
    isSaving,
    saveMessage,
    phoneError,
    nameInputRef,
    phoneInputRef,
    clerkUser,
    getUserInitials,
    getRoleLabel,
    getRoleBadgeColor,
    hasPendingChanges,
    formatDate,
    displayEmail,
    displayName,
    startEditing,
    handleTempChange,
    handleCancelEdit,
    handleSaveAll,
    handleOpenChangePassword,
    handleLogout,
  };
}
