import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card-simple';
import { useClerkAuth, getClerkUserInfo } from '../utils/clerk-utils';
import { supabase } from '../lib/supabase';

const UserProfileSmartCard = ({ isOpen, onClose, onOpenChangePassword }) => {
  const { user: clerkUser, signOut } = useClerkAuth();
  const { user: clerkUserOfficial } = useUser();
  
  // Clerk es el ÚNICO proveedor de identidad
  const activeUser = clerkUser || clerkUserOfficial;
  const userInfo = getClerkUserInfo(activeUser);
  
  // Estados del perfil (datos extendidos desde Supabase)
  const [profileData, setProfileData] = useState({
    full_name: userInfo.displayName || '',
    phone: '',
    email: userInfo.displayEmail || ''
  });
  
  // Estado de sincronización
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de edición
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs para inputs
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Función para cargar perfil desde Supabase - usando ID
  const loadProfileFromSupabase = async (userId) => {
    console.log('🔍 Cargando perfil desde Supabase con user_id:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log('Error de Supabase:', error);
      console.log('Código de error:', error.code);
      console.log('Mensaje:', error.message);
      setIsSynced(false);
      return null;
    }
    
    console.log('✅ Perfil encontrado:', data);
    setIsSynced(true);
    return data;
  };

  // Función para crear perfil si no existe
  const createProfile = async (userId, userEmail, userFullName) => {
    console.log('🔄 Creando perfil en Supabase...');
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail,
        full_name: userFullName || '',
        phone: ''
      })
      .select('full_name, email, phone')
      .single();
    
    if (error) {
      console.log('Error al crear perfil:', error);
      return null;
    }
    
    console.log('✅ Perfil creado:', data);
    return data;
  };

  // useEffect para cargar datos al abrir el modal
  useEffect(() => {
    if (!isOpen || !activeUser?.id) {
      console.log('⚠️ useEffect: No se ejecuta - isOpen:', isOpen, 'activeUser?.id:', activeUser?.id);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      console.log('📥 Iniciando carga de perfil...');
      
      try {
        // Primero establecer datos básicos de Clerk
        const clerkData = {
          full_name: userInfo.displayName || '',
          email: userInfo.displayEmail || '',
          phone: ''
        };
        
        // Buscar datos extendidos del perfil desde Supabase (si existe)
        let extendedProfile = await loadProfileFromSupabase(activeUser.id);
        
        // Si no existe, crear perfil con datos de Clerk
        if (!extendedProfile) {
          console.log('🔄 Perfil no encontrado, creando...');
          extendedProfile = await createProfile(
            activeUser.id,
            userInfo.displayEmail,
            userInfo.displayName
          );
        }
        
        // Combinar datos: Clerk (identidad) + Supabase (datos extendidos)
        if (extendedProfile) {
          console.log('📝 Actualizando estado con datos combinados');
          setProfileData({
            full_name: clerkData.full_name || extendedProfile.full_name || '',
            phone: extendedProfile.phone || '',
            email: clerkData.email || extendedProfile.email || ''
          });
          setIsSynced(true);
        } else {
          // Usar solo datos de Clerk
          console.log('⚠️ No se pudo obtener perfil extendido, usando solo datos de Clerk');
          setProfileData(clerkData);
          setIsSynced(false);
        }
      } catch (err) {
        console.log('Error general:', err);
        setIsSynced(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isOpen, activeUser?.id, userInfo]);

  // Función para guardar campo en Supabase
  const saveField = async (field, value) => {
    if (!activeUser?.id) return;
    
    setIsSaving(true);
    
    try {
      console.log(`💾 Guardando ${field}: ${value}`);
      
      const updateData = {
        updated_at: new Date().toISOString()
      };
      
      if (field === 'full_name') {
        updateData.full_name = value;
      } else if (field === 'phone') {
        updateData.phone = value;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', activeUser.id);
      
      if (error) {
        console.log('Error al guardar:', error);
        return;
      }
      
      console.log(`✅ ${field} guardado exitosamente`);
      
      // Actualizar estado local
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
      
      setIsSynced(true);
      
    } catch (err) {
      console.log('Error al guardar:', err);
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  // Iniciar edición
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

  // Guardar al presionar Enter o perder foco
  const handleSave = (field) => {
    const newValue = tempValue.trim();
    const currentValue = profileData[field];
    
    if (newValue !== currentValue && newValue.length > 0) {
      saveField(field, newValue);
    } else {
      setEditingField(null);
    }
  };

  // Manejar teclado
  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      handleSave(field);
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setTempValue('');
    }
  };

  // Obtener iniciales
  const getUserInitials = () => {
    const name = profileData.full_name;
    if (name && name.trim()) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return clerkUser?.firstName?.[0]?.toUpperCase() || 'U';
  };

  // Cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Cerrar sesión?')) {
      await signOut();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="fixed top-[85px] right-[20px] z-[999] w-[380px]">
        <Card className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl max-h-[450px] overflow-hidden animate-in slide-in-from-right-5 duration-300">
          {/* Encabezado */}
          <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-petroleum/5 to-corporate/5 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800 font-bold flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </CardTitle>
              <div className="flex items-center gap-1">
                {/* Indicador de sincronización */}
                <span className={`text-xs px-2 py-1 rounded-full ${isSynced ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isLoading ? 'Cargando...' : isSynced ? '✓ Sincronizado' : 'No sincronizado'}
                </span>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </CardHeader>
          
          {/* Contenido */}
          <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(450px - 73px)' }}>
            {/* Avatar e info */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                <span className="text-white font-bold text-lg">
                  {getUserInitials()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-3 truncate max-w-full px-2">
                {(profileData.full_name) || 'Usuario'}
              </h3>
              <p className="text-slate-600 text-sm mt-1 truncate max-w-full px-2">
                {(profileData.email) || ''}
              </p>
            </div>

            {/* Información personal */}
            <div className="space-y-3 mt-4">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
                Información Personal
              </h4>
               
              {/* Campo Nombre - id="profile-name" */}
              <div>
                <label htmlFor="profile-name" className="text-xs font-medium text-slate-600 block mb-1">
                  Nombre completo
                </label>
                {editingField === 'full_name' ? (
                  <div className="relative">
                    <input
                      ref={nameInputRef}
                      type="text"
                      id="profile-name"
                      name="full_name"
                      value={tempValue || ''}
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={() => handleSave('full_name')}
                      onKeyDown={(e) => handleKeyDown(e, 'full_name')}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-corporate shadow-sm text-sm"
                      placeholder="Tu nombre completo"
                      disabled={isSaving}
                      autoComplete="name"
                    />
                    {isSaving && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 animate-spin text-corporate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-between"
                    onClick={() => startEditing('full_name')}
                  >
                    <span className={`text-sm ${profileData.full_name ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                      {(profileData.full_name) || 'Haz clic para agregar nombre'}
                    </span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Campo Correo - id="profile-email" */}
              <div>
                <label htmlFor="profile-email" className="text-xs font-medium text-slate-600 block mb-1">
                  Correo electrónico
                </label>
                <div 
                  id="profile-email"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-between"
                >
                  <span className="text-sm text-slate-700 truncate flex-1">
                    {(profileData.email) || 'Sin correo'}
                  </span>
                  <svg className="w-3 h-3 text-slate-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              {/* Campo Teléfono - id="profile-phone" */}
              <div>
                <label htmlFor="profile-phone" className="text-xs font-medium text-slate-600 block mb-1">
                  Teléfono
                </label>
                {editingField === 'phone' ? (
                  <div className="relative">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      id="profile-phone"
                      name="phone"
                      value={tempValue || ''}
                      onChange={(e) => setTempValue(e.target.value.replace(/\D/g, ''))}
                      onBlur={() => handleSave('phone')}
                      onKeyDown={(e) => handleKeyDown(e, 'phone')}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-corporate shadow-sm text-sm"
                      placeholder="3001234567"
                      maxLength="10"
                      disabled={isSaving}
                      autoComplete="tel"
                    />
                    {isSaving && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 animate-spin text-corporate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-between"
                    onClick={() => startEditing('phone')}
                  >
                    <span className={`text-sm ${profileData.phone ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                      {(profileData.phone) || 'Haz clic para agregar teléfono'}
                    </span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

             {/* Sección de acciones */}
             <div className="sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 px-4 pb-4 pt-3 border-t border-slate-200/50 mt-4">
               <div className="space-y-2">
                 <button 
                   className="w-full flex items-center justify-start px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
                   onClick={() => {
                     onClose();
                     // En lugar de abrir modal personalizado, Clerk maneja la gestión de cuenta
                     // Los usuarios pueden cambiar contraseña en su perfil de Clerk
                     alert('Para cambiar tu contraseña, ve a la configuración de tu cuenta en Clerk.');
                   }}
                 >
                   <svg className="w-4 h-4 text-[#1e293b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                   </svg>
                   <span className="text-sm font-medium text-slate-700">Gestionar cuenta (Clerk)</span>
                 </button>
                
                <button 
                  className="w-full flex items-center justify-start px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                  onClick={handleLogout}
                >
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileSmartCard;
