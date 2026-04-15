import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card-simple';
import { useAuth } from '../context/AuthContext';
import { useClerkAuth } from '../utils/clerk-utils';

const UserProfileSmartCard = ({ isOpen, onClose, onOpenChangePassword }) => {
  const { user: clerkUser, isSignedIn, isLoaded: clerkLoaded, signOut: clerkSignOut, openUserProfile } = useClerkAuth();
  const { supabase: supabaseClient, profile: authProfile, fetchProfile, updateProfile } = useAuth();
  
  // Estados del perfil
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
    role: 'student'
  });
  
  // Estado para indicar origen de datos
  const [dataSource, setDataSource] = useState('loading'); // 'supabase', 'clerk', 'loading'
  
  // Estados de edición
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  
  // Estados de UI
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Refs para inputs
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Función para crear perfil automáticamente si no existe
  const createProfileIfNotExists = async () => {
    try {
      if (!clerkUser?.id) {
        console.error('❌ No hay usuario Clerk para crear perfil');
        return false;
      }
      
      // Usar el AuthContext para crear el perfil
      const userData = {
        full_name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        phone: '',
        role: 'student'
      };
      
      // Crear perfil directamente en Supabase
      const result = await supabaseClient
        .from('profiles')
        .upsert({
          id: clerkUser.id,
          ...userData
        });
      
      if (result.error) {
        console.warn('❌ Error creando perfil:', result.error.message);
        return false;
      }
      
      console.log('✅ Perfil creado automáticamente para:', clerkUser.id);
      return true;
    } catch (createError) {
      console.warn('❌ Error creando perfil:', createError.message);
      return false;
    }
  };

  // Función para recargar datos manualmente - SELECT DIRECTO
  const reloadProfileData = async () => {
    setMessage({ type: '', text: '' });
    setDataSource('loading');
    
     try {
       if (!clerkUser?.id) {
         console.warn('⚠️ Clerk user no disponible:', {
           clerkUser,
           isSignedIn,
           clerkLoaded,
           windowClerk: window.Clerk
         });
         throw new Error('Usuario Clerk no disponible. Por favor, inicia sesión nuevamente.');
       }
      
      console.log('🔄 Recargando perfil desde Supabase para:', clerkUser.id);
      
      // SELECT DIRECTO a Supabase
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('id, email, full_name, phone, role')
        .eq('id', clerkUser.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Perfil no encontrado - CREARLO AUTOMÁTICAMENTE
          console.log('🔄 Perfil no encontrado en Supabase. Creando automáticamente...');
          
          // Crear perfil automáticamente
          const created = await createProfileIfNotExists();
          
          if (created) {
            // Reintentar la consulta después de crear
            const { data: newData, error: retryError } = await supabaseClient
              .from('profiles')
              .select('id, email, full_name, phone, role')
              .eq('id', clerkUser.id)
              .single();
            
            if (retryError) {
              throw new Error(`Error al cargar perfil recién creado: ${retryError.message}`);
            }
            
            // ✅ PERFIL CREADO Y CARGADO
            console.log('✅ Perfil creado y cargado desde Supabase:', newData);
            
            setProfileData({
              full_name: newData.full_name || clerkUser.fullName || '',
              phone: newData.phone || '',
              email: newData.email || clerkUser.primaryEmailAddress?.emailAddress || '',
              role: newData.role || 'student'
            });
            setDataSource('supabase');
            setMessage({ type: 'success', text: 'Perfil creado automáticamente' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
          // Error creando perfil
          setProfileData({
            full_name: clerkUser.fullName || 'Usuario',
            phone: '',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            role: 'student'
          });
          setDataSource('error');
          setMessage({ type: 'error', text: 'No se pudo crear perfil automáticamente' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
        } else {
          throw new Error(`Error Supabase: ${error.message}`);
        }
      } else if (data) {
        // ✅ DATOS ACTUALIZADOS DESDE SUPABASE
        console.log('✅ Datos recargados desde Supabase:', data);
        
        setProfileData({
          full_name: data.full_name || clerkUser.fullName || '',
          phone: data.phone || '',
          email: data.email || clerkUser.primaryEmailAddress?.emailAddress || '',
          role: data.role || 'student'
        });
        setDataSource('supabase');
        
        // Actualizar AuthContext para consistencia
        if (fetchProfile) {
          await fetchProfile(clerkUser.id);
        }
        
        setMessage({ type: 'success', text: '✓ Datos actualizados desde Supabase' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (err) {
      console.error('❌ Error en recarga manual:', err);
      setProfileData({
        full_name: clerkUser?.fullName || 'Usuario',
        phone: '',
        email: clerkUser?.primaryEmailAddress?.emailAddress || '',
        role: 'student'
      });
      setDataSource('error');
      setMessage({ type: 'error', text: 'Error recargando datos: ' + err.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Validar datos de Clerk antes de usar
  const validateClerkData = () => {
    if (!clerkUser?.id) {
      console.error('❌ Usuario Clerk sin ID');
      return {
        isValid: false,
        data: {
          full_name: 'Usuario',
          phone: '',
          email: 'usuario@edutechlife.com',
          role: 'student'
        }
      };
    }
    
    const email = clerkUser.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.warn('⚠ Usuario Clerk sin email principal');
    }
    
    return {
      isValid: true,
      data: {
        full_name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Usuario',
        phone: '',
        email: email || 'usuario@edutechlife.com',
        role: 'student'
      }
    };
  };

  // Cargar datos de perfil al abrir el modal - SELECT DIRECTO A SUPABASE
  useEffect(() => {
    if (!isOpen || !clerkUser?.id) return;
    
    const loadProfileData = async () => {
      setMessage({ type: '', text: '' });
      setDataSource('loading');
      
      try {
        console.log('🔍 Buscando perfil en Supabase para usuario ID:', clerkUser.id);
        
        // SELECT DIRECTO a la tabla profiles usando el ID del usuario
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('id, email, full_name, phone, role')
          .eq('id', clerkUser.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // 🔄 Perfil no encontrado - crear automáticamente
            console.log('🔄 Perfil no encontrado en Supabase, creando automáticamente...');
            const created = await createProfileIfNotExists();
            
            if (created) {
              // 🔄 Recargar después de crear
              const { data: newData } = await supabaseClient
                .from('profiles')
                .select('id, email, full_name, phone, role')
                .eq('id', clerkUser.id)
                .single();
              
              if (newData) {
                // ✅ Perfil creado y cargado exitosamente
                setProfileData({
                  full_name: newData.full_name || clerkUser.fullName || '',
                  phone: newData.phone || '',
                  email: newData.email || clerkUser.primaryEmailAddress?.emailAddress || '',
                  role: newData.role || 'student'
                });
                setDataSource('supabase');
                console.log('✅ Perfil creado y cargado desde Supabase:', newData);
                setMessage({ type: 'success', text: 'Perfil creado automáticamente' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
              } else {
                // Error crítico - mostrar datos básicos
                setProfileData({
                  full_name: clerkUser.fullName || 'Usuario',
                  phone: '',
                  email: clerkUser.primaryEmailAddress?.emailAddress || '',
                  role: 'student'
                });
                setDataSource('error');
                setMessage({ type: 'error', text: 'Error cargando perfil recién creado' });
              }
            } else {
              // Error creando perfil
              setProfileData({
                full_name: clerkUser.fullName || 'Usuario',
                phone: '',
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                role: 'student'
              });
              setDataSource('error');
              setMessage({ type: 'error', text: 'No se pudo crear perfil automáticamente' });
            }
          } else {
            // ⚠️ Otro error de Supabase
            console.error('❌ Error en SELECT de Supabase:', error);
            setProfileData({
              full_name: clerkUser.fullName || 'Usuario',
              phone: '',
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              role: 'student'
            });
            setDataSource('error');
            setMessage({ 
              type: 'error', 
              text: `Error Supabase: ${error.message}` 
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          }
        } else if (data) {
          // ✅ DATOS ENCONTRADOS EN SUPABASE
          console.log('✅ Perfil encontrado en Supabase:', data);
          
          setProfileData({
            full_name: data.full_name || clerkUser.fullName || '',
            phone: data.phone || '',
            email: data.email || clerkUser.primaryEmailAddress?.emailAddress || '',
            role: data.role || 'student'
          });
          setDataSource('supabase');
          
          // Actualizar también el AuthContext para consistencia
          if (fetchProfile) {
            await fetchProfile(clerkUser.id);
          }
        }
      } catch (err) {
        console.error('❌ Error crítico cargando perfil:', err);
        
        // Datos mínimos del usuario
        setProfileData({
          full_name: clerkUser?.fullName || 'Usuario',
          phone: '',
          email: clerkUser?.primaryEmailAddress?.emailAddress || '',
          role: 'student'
        });
        setDataSource('error');
        setMessage({ 
          type: 'error', 
          text: 'Error crítico cargando perfil.' 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    };
    
    loadProfileData();
  }, [isOpen, clerkUser?.id]);

  // Guardar campo en Supabase - UPDATE DIRECTO
  const updateField = async (field, value) => {
    if (!clerkUser?.id) return;
    
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      console.log(`💾 Guardando campo ${field} en Supabase:`, value);
      
      // UPDATE DIRECTO a Supabase
      const { error } = await supabaseClient
        .from('profiles')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', clerkUser.id);
      
      if (error) {
        throw new Error(`Error Supabase: ${error.message}`);
      }
      
      // ✅ ACTUALIZACIÓN EXITOSA
      console.log(`✅ Campo ${field} guardado en Supabase`);
      
      // Actualizar estado local inmediatamente
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Marcar que tenemos datos en Supabase
      setDataSource('supabase');
      
      // Actualizar AuthContext para consistencia
      if (fetchProfile) {
        await fetchProfile(clerkUser.id);
      }
      
      // Feedback de éxito
      setMessage({ type: 'success', text: '✓ Guardado en Supabase' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      
    } catch (err) {
      console.error('❌ Error guardando en Supabase:', err);
      setMessage({ type: 'error', text: 'Error al guardar: ' + err.message });
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  // Iniciar edición
  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(profileData[field] || '');
    setMessage({ type: '', text: '' });
    
    // Pequeño delay para asegurar que el DOM está listo
    setTimeout(() => {
      if (field === 'name' && nameInputRef.current) {
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
    const fieldName = field === 'name' ? 'full_name' : 'phone';
    const newValue = tempValue.trim();
    const currentValue = profileData[fieldName];
    
    // Solo guardar si hay cambios
    if (newValue !== currentValue && newValue.length > 0) {
      updateField(fieldName, newValue);
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
     try {
       await clerkSignOut();
       onClose();
     } catch (error) {
       console.error('Error al cerrar sesión:', error);
     }
   };

   // Abrir perfil de Clerk
   const handleOpenClerkProfile = async () => {
     try {
       onClose();
       
       // Intentar abrir perfil de Clerk usando el hook del nivel superior
       if (typeof openUserProfile === 'function') {
         await openUserProfile();
       } else if (window.Clerk?.openUserProfile) {
         // Fallback a Clerk global
         window.Clerk.openUserProfile();
       } else {
         // Fallback final
         alert('Para configurar seguridad, visita tu perfil en Clerk Dashboard');
       }
     } catch (error) {
       console.error('Error abriendo perfil Clerk:', error);
       alert('Configuración de seguridad disponible en Clerk Dashboard');
     }
   };

   // Confirmar logout
   const confirmLogout = () => {
     if (window.confirm('¿Estás seguro de que quieres cerrar sesión?\nSerás redirigido a la página de inicio.')) {
       handleLogout();
     }
   };

   if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Smart-Card: Posición fija como se solicitó */}
      <div className="fixed top-[85px] right-[20px] z-[999] w-[380px]">
        <Card className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl max-h-[450px] overflow-hidden animate-in slide-in-from-right-5 duration-300">
          {/* Encabezado fijo */}
          <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-petroleum/5 to-corporate/5 sticky top-0 z-10">
             <div className="flex items-center justify-between">
               <CardTitle className="text-slate-800 font-bold flex items-center gap-2 text-sm">
                 <svg className="w-4 h-4 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 Mi Perfil
               </CardTitle>
               <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      if (!clerkUser?.id) {
                        alert('Por favor, espera a que se cargue la sesión de Clerk');
                        return;
                      }
                      reloadProfileData();
                    }}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                    title="Recargar datos"
                    disabled={!clerkUser?.id}
                  >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                 </button>
                 <button 
                   onClick={onClose}
                   className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             </div>
          </CardHeader>
          
          {/* Contenido con scroll interno */}
          <CardContent className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(450px - 73px)' }}>
            {/* Avatar e info - Carga inmediata sin skeletons */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                <span className="text-white font-bold text-lg">
                  {getUserInitials()}
                </span>
              </div>
               <h3 className="text-lg font-bold text-slate-800 mt-3 truncate max-w-full px-2">{profileData.full_name || 'Usuario'}</h3>
              <p className="text-slate-600 text-sm mt-1 truncate max-w-full px-2">{profileData.email}</p>
               <div className="flex items-center justify-center gap-2 mt-2">
                 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${profileData.role === 'teacher' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                   {profileData.role === 'teacher' ? (
                     <>
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                       </svg>
                       Profesor
                     </>
                   ) : (
                     <>
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                       </svg>
                       Estudiante
                     </>
                   )}
                 </span>
                  {dataSource !== 'loading' && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${dataSource === 'supabase' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : dataSource === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                      {dataSource === 'supabase' ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Supabase
                        </>
                      ) : dataSource === 'error' ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Error
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Cargando...
                        </>
                      )}
                    </span>
                  )}
               </div>
            </div>

            {/* Información personal - Estilo Píldora Corporativo */}
            <div className="space-y-3 mt-4">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-3 h-3 text-[#1e293b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información Personal
              </h4>
                  
                  {/* Campo de Nombre - Estilo Píldora */}
                   <div>
                     <label className="text-xs font-medium text-slate-600 block mb-1">
                       Nombre completo
                     </label>
                     {editingField === 'name' ? (
                       <div className="relative">
                          <input
                            ref={nameInputRef}
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => handleSave('name')}
                            onKeyDown={(e) => handleKeyDown(e, 'name')}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-corporate focus:border-transparent shadow-sm transition-all duration-200 text-sm"
                            placeholder="Tu nombre completo"
                            disabled={isSaving}
                            autoComplete="name"
                          />
                          {isSaving && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <svg className="w-4 h-4 animate-spin text-corporate" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                          )}
                       </div>
                      ) : (
                        <div 
                          className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all duration-200 flex items-center justify-between"
                          onClick={() => startEditing('name')}
                        >
                          <span className={`text-sm font-medium ${profileData.full_name ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                            {profileData.full_name || 'Haz clic para agregar nombre'}
                          </span>
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      )}
                   </div>
                   
                    {/* Campo de Correo - Píldora no editable */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Correo electrónico
                      </label>
                      <div className={`px-4 py-2.5 bg-white border rounded-full flex items-center justify-between ${profileData.email ? 'border-slate-200 text-slate-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {profileData.email || 'No registrado en Supabase'}
                          </span>
                          {!profileData.email && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                              Pendiente
                            </span>
                          )}
                        </div>
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {!profileData.email && (
                        <p className="text-xs text-amber-600 mt-1 ml-1">
                          El email se sincronizará automáticamente
                        </p>
                      )}
                    </div>
                   
                   {/* Campo de Teléfono - Estilo Píldora */}
                   <div>
                     <label className="text-xs font-medium text-slate-600 block mb-1">
                       Teléfono
                     </label>
                     {editingField === 'phone' ? (
                       <div className="relative">
                          <input
                            ref={phoneInputRef}
                            type="tel"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value.replace(/\D/g, ''))}
                            onBlur={() => handleSave('phone')}
                            onKeyDown={(e) => handleKeyDown(e, 'phone')}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-corporate focus:border-transparent shadow-sm transition-all duration-200 text-sm"
                            placeholder="3001234567"
                            maxLength="10"
                            disabled={isSaving}
                            autoComplete="tel"
                          />
                          {isSaving && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <svg className="w-4 h-4 animate-spin text-corporate" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                          )}
                       </div>
                      ) : (
                        <div 
                          className="px-4 py-2.5 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all duration-200 flex items-center justify-between"
                          onClick={() => startEditing('phone')}
                        >
                          <span className={`text-sm font-medium ${profileData.phone ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                            {profileData.phone || 'Haz clic para agregar teléfono'}
                          </span>
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      )}
                   </div>
                 </div>

                   {/* Mensaje de feedback */}
                   {message.text && (
                     <div className={`p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                       {message.text}
                     </div>
                   )}

                   {/* Información del origen de datos */}
                   <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                     <div className="flex items-center justify-between mb-2">
                       <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
                         Origen de datos
                       </h5>
                       <button 
                         onClick={reloadProfileData}
                         className="text-xs text-[#004B63] hover:text-[#00374A] font-medium flex items-center gap-1"
                         disabled={dataSource === 'loading'}
                       >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                         Actualizar
                       </button>
                     </div>
                     
                     <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Fuente principal:</span>
                          <span className={`font-medium ${dataSource === 'supabase' ? 'text-emerald-600' : dataSource === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                            {dataSource === 'supabase' ? 'Supabase (BD)' : dataSource === 'error' ? 'Error' : 'Cargando...'}
                          </span>
                        </div>
                       
                       <div className="flex items-center justify-between text-xs">
                         <span className="text-slate-600">Usuario ID:</span>
                         <span className="font-mono text-xs text-slate-700 truncate max-w-[120px]">
                           {clerkUser?.id ? clerkUser.id.substring(0, 8) + '...' : 'No disponible'}
                         </span>
                       </div>
                       
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Sincronización:</span>
                          <span className={`font-medium ${dataSource === 'supabase' ? 'text-emerald-600' : dataSource === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                            {dataSource === 'supabase' ? '✅ Activa' : dataSource === 'error' ? '❌ Error' : '🔄 Cargando...'}
                          </span>
                        </div>
                     </div>
                   </div>

                   {/* Sección de acciones - Estilo Píldora Corporativo */}
                  <div className="sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 px-4 pb-4 pt-3 border-t border-slate-200/50">
                    <div className="space-y-2">
                      <button 
                        className="w-full flex items-center justify-start px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-left"
                        onClick={() => {
                          onClose();
                          onOpenChangePassword();
                        }}
                      >
                        <svg className="w-4 h-4 text-[#1e293b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">Cambiar contraseña</span>
                      </button>
                      
                      <button 
                        className="w-full flex items-center justify-start px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-left"
                        onClick={handleOpenClerkProfile}
                      >
                        <svg className="w-4 h-4 text-[#1e293b] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">Seguridad (Clerk)</span>
                      </button>
                    </div>

                    {/* Cerrar sesión */}
                    <div className="pt-2 border-t border-slate-200/50 mt-2">
                      <button 
                        className="w-full flex items-center justify-start px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-left"
                        onClick={confirmLogout}
                      >
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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