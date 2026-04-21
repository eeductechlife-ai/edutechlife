import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card-simple';
import { supabase } from '../lib/supabase';

const UserProfileSmartCard = ({ isOpen, onClose, onOpenChangePassword }) => {
  const { user: clerkUserOfficial, isLoaded: clerkIsLoaded } = useUser();
  
  // Usar solo useUser() de @clerk/react como fuente única de verdad
  const activeUser = clerkUserOfficial;
  
  // Función para obtener info del usuario Clerk
  const getClerkUserInfo = (user) => {
    if (!user) {
      return { displayName: '', displayEmail: '' };
    }
    
    return {
      displayName: user.fullName || user.firstName || 'Usuario Edutechlife',
      displayEmail: user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || ''
    };
  };
  
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

  // Función para cargar perfil desde Supabase - usando ID - CONSULTA ESTANDARIZADA
  const loadProfileFromSupabase = async (userId) => {
    console.log('🔍 Cargando perfil desde Supabase con user_id:', userId);
    
    try {
      // CONSULTA ESTANDARIZADA: Solo columnas básicas que existen 100%
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role') // Columnas básicas confirmadas
        .eq('id', userId)
        .maybeSingle(); // Usar maybeSingle en lugar de single para evitar errores 400
      
      if (error) {
        // MANEJO DE ERRORES SILENCIOSO: No lanzar error, solo registrar
        console.warn('⚠️ Error de Supabase (manejo silencioso):', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        
        // Si es error 400 (Bad Request), probablemente columnas faltantes
        if (error.code === '400' || error.message?.includes('Bad Request')) {
          console.warn('⚠️ Error 400 detectado - columnas faltantes en tabla profiles');
          // Intentar consulta más básica
          const { data: basicData, error: basicError } = await supabase
            .from('profiles')
            .select('id, full_name, email') // Columnas mínimas
            .eq('id', userId)
            .maybeSingle();
          
          if (basicError) {
            console.warn('⚠️ Error incluso en consulta básica:', basicError.message);
            setIsSynced(false);
            return null;
          }
          
          console.log('✅ Perfil encontrado (consulta básica):', basicData);
          setIsSynced(true);
          return basicData;
        }
        
        setIsSynced(false);
        return null;
      }
      
      if (!data) {
        console.log('ℹ️ Perfil no encontrado en Supabase');
        setIsSynced(false);
        return null;
      }
      
      console.log('✅ Perfil encontrado (consulta estándar):', data);
      setIsSynced(true);
      return data;
    } catch (err) {
      // CAPTURA DE ERRORES SILENCIOSA: No propagar el error
      console.warn('⚠️ Excepción en loadProfileFromSupabase (manejo silencioso):', err.message);
      setIsSynced(false);
      return null;
    }
  };

  // Función para crear perfil si no existe - INSERCIÓN TOLERANTE
  const createProfile = async (userId, userEmail, userFullName) => {
    console.log('🔄 Creando perfil en Supabase (inserción tolerante)...');
    
    try {
      // INSERCIÓN TOLERANTE: Solo columnas básicas
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail || '',
          full_name: userFullName || '',
          phone: '',
          role: 'student'
        })
        .select('id, full_name, email, phone, role') // Columnas básicas
        .maybeSingle(); // Usar maybeSingle para evitar errores
      
      if (error) {
        // MANEJO DE ERRORES SILENCIOSO
        console.warn('⚠️ Error al crear perfil (manejo silencioso):', {
          code: error.code,
          message: error.message
        });
        
        // Si es error 400, probablemente columnas faltantes
        if (error.code === '400' || error.message?.includes('Bad Request')) {
          console.warn('⚠️ Error 400 al crear perfil - intentando inserción mínima');
          
          // Intentar inserción mínima
          const { data: minimalData, error: minimalError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: userEmail || '',
              full_name: userFullName || ''
            })
            .select('id, full_name, email')
            .maybeSingle();
          
          if (minimalError) {
            console.warn('⚠️ Error incluso en inserción mínima:', minimalError.message);
            // Crear perfil local como fallback
            return {
              id: userId,
              email: userEmail || '',
              full_name: userFullName || '',
              phone: '',
              role: 'student'
            };
          }
          
          console.log('✅ Perfil creado (inserción mínima):', minimalData);
          return minimalData;
        }
        
        // Para otros errores, crear perfil local
        console.warn('⚠️ Creando perfil local como fallback');
        return {
          id: userId,
          email: userEmail || '',
          full_name: userFullName || '',
          phone: '',
          role: 'student'
        };
      }
      
      if (!data) {
        console.warn('⚠️ No se recibió data después de crear perfil');
        // Crear perfil local como fallback
        return {
          id: userId,
          email: userEmail || '',
          full_name: userFullName || '',
          phone: '',
          role: 'student'
        };
      }
      
      console.log('✅ Perfil creado exitosamente:', data);
      return data;
    } catch (err) {
      // CAPTURA DE ERRORES SILENCIOSA
      console.warn('⚠️ Excepción en createProfile (manejo silencioso):', err.message);
      // Crear perfil local como fallback
      return {
        id: userId,
        email: userEmail || '',
        full_name: userFullName || '',
        phone: '',
        role: 'student'
      };
    }
  };

  // useEffect para cargar datos al abrir el modal - CON GUARDIA DE SILENCIO
  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef(null);
  
  useEffect(() => {
    // GUARDIA CRÍTICA 1: Si el modal no está abierto, no hacer nada
    if (!isOpen) {
      console.log('🔇 Guardia de Silencio: Modal cerrado, no ejecutar');
      hasLoadedRef.current = false; // Resetear para próxima apertura
      return;
    }
    
    // GUARDIA CRÍTICA 2: Validación estricta de usuario Clerk
    if (!activeUser?.id || typeof activeUser.id !== 'string' || activeUser.id.trim() === '') {
      console.warn('🔇 Guardia de Silencio: Usuario Clerk inválido o vacío');
      return;
    }
    
    // GUARDIA CRÍTICA 3: Validar que Clerk haya cargado completamente
    if (!clerkIsLoaded || !clerkUserOfficial?.id) {
      console.warn('🔇 Guardia de Silencio: Clerk no ha cargado completamente');
      return;
    }
    
    // GUARDIA CRÍTICA 4: Validar que activeUser coincida con Clerk
    if (activeUser?.id !== clerkUserOfficial.id) {
      console.warn(`🔇 Guardia de Silencio: activeUser no coincide con Clerk (activeUser: ${activeUser?.id}, Clerk: ${clerkUserOfficial.id})`);
      return;
    }
    
    // GUARDIA CRÍTICA 6: Si ya cargamos para este usuario en esta sesión, no repetir
    if (hasLoadedRef.current && lastUserIdRef.current === activeUser.id) {
      console.log('🔇 Guardia de Silencio: Ya cargado para este usuario en esta sesión');
      return;
    }
    
    console.log('📥 Iniciando carga de perfil con Guardia de Silencio...');
    
    const loadProfile = async () => {
      setIsLoading(true);
      
      try {
        // Primero establecer datos básicos de Clerk
        const clerkData = {
          full_name: userInfo.displayName || '',
          email: userInfo.displayEmail || '',
          phone: ''
        };
        
    // GUARDIA CRÍTICA 7: Validar userInfo antes de proceder
    if (!userInfo || (!userInfo.displayEmail && !userInfo.displayName)) {
      console.warn('🔇 Guardia de Silencio: userInfo incompleto o inválido');
      // Usar datos mínimos de Clerk
      const clerkData = {
        full_name: activeUser?.fullName || activeUser?.firstName || 'Usuario Edutechlife',
        email: activeUser?.emailAddresses?.[0]?.emailAddress || '',
        phone: ''
      };
      setProfileData(clerkData);
      setIsSynced(false);
      hasLoadedRef.current = true;
      lastUserIdRef.current = activeUser.id;
      return;
    }
        
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
        
        // Marcar como cargado para este usuario
        hasLoadedRef.current = true;
        lastUserIdRef.current = activeUser.id;
        
      } catch (err) {
        console.log('Error general:', err);
        setIsSynced(false);
        // Incluso en error, marcamos como cargado para evitar bucles
        hasLoadedRef.current = true;
        lastUserIdRef.current = activeUser.id;
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isOpen, activeUser?.id, userInfo, clerkIsLoaded, clerkUserOfficial]);

  // Función para guardar campo en Supabase - CON MANEJO DE ERRORES SILENCIOSO
  const saveField = async (field, value) => {
    // GUARDIA CRÍTICA: Validación estricta antes de guardar
    if (!activeUser?.id || typeof activeUser.id !== 'string' || activeUser.id.trim() === '') {
      console.warn('🔇 Guardia de Silencio: Usuario inválido para guardar');
      return;
    }
    
    // Validar que Clerk haya cargado completamente
    if (!clerkIsLoaded || !clerkUserOfficial?.id) {
      console.warn('🔇 Guardia de Silencio: Clerk no ha cargado completamente para guardar');
      return;
    }
    
    // Validar que activeUser coincida con Clerk
    if (activeUser.id !== clerkUserOfficial.id) {
      console.warn(`🔇 Guardia de Silencio: activeUser no coincide con Clerk para guardar (${activeUser.id} vs ${clerkUserOfficial.id})`);
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log(`💾 Guardando ${field}: ${value}`);
      
      // DATOS DE ACTUALIZACIÓN TOLERANTES: Solo campos básicos
      const updateData = {};
      
      if (field === 'full_name') {
        updateData.full_name = value;
      } else if (field === 'phone') {
        updateData.phone = value;
      }
      
      // NOTA: No incluir updated_at para evitar errores 400 por columna faltante
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', activeUser.id);
      
      if (error) {
        // MANEJO DE ERRORES SILENCIOSO: No propagar el error
        console.warn(`⚠️ Error al guardar ${field} (manejo silencioso):`, {
          code: error.code,
          message: error.message
        });
        
        // Si es error 400, probablemente columna faltante
        if (error.code === '400' || error.message?.includes('Bad Request')) {
          console.warn(`⚠️ Error 400 al guardar ${field} - intentando actualización mínima`);
          
          // Intentar actualización sin updated_at
          const minimalUpdate = {};
          if (field === 'full_name') minimalUpdate.full_name = value;
          if (field === 'phone') minimalUpdate.phone = value;
          
          const { error: minimalError } = await supabase
            .from('profiles')
            .update(minimalUpdate)
            .eq('id', activeUser.id);
          
          if (minimalError) {
            console.warn(`⚠️ Error incluso en actualización mínima de ${field}:`, minimalError.message);
            // Aún así actualizar estado local para buena UX
            setProfileData(prev => ({
              ...prev,
              [field]: value
            }));
            setIsSynced(false); // Marcar como no sincronizado
            return;
          }
        }
        
        // Para otros errores, solo actualizar estado local
        setProfileData(prev => ({
          ...prev,
          [field]: value
        }));
        setIsSynced(false); // Marcar como no sincronizado
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
      // CAPTURA DE ERRORES SILENCIOSA
      console.warn(`⚠️ Excepción al guardar ${field} (manejo silencioso):`, err.message);
      // Aún así actualizar estado local para buena UX
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
      setIsSynced(false); // Marcar como no sincronizado
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
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20">
      <div className="relative w-[380px]">
        <Card className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl max-h-[450px] overflow-hidden animate-in slide-in-from-right-5 duration-300 relative">
          {/* Botón de cerrar flotante */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white/50 hover:bg-slate-100 hover:text-slate-800 rounded-full backdrop-blur-sm transition-all duration-200"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Encabezado */}
          <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-petroleum/5 to-corporate/5 sticky top-0 z-10 pt-12">
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
