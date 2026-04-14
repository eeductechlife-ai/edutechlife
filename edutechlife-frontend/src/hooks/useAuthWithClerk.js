/**
 * Hook unificado para autenticación Clerk + Supabase con JWT
 * Usa el JWT Template configurado: 5d74d508-85ee-4a7c-9d50-87005f9b8a90
 */

import { useState, useEffect, useCallback } from 'react';
import { useClerkAuth } from '../utils/clerk-utils';
import { useAuth as useSupabaseAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  getClerkJWTForSupabase, 
  mapClerkUserToSupabase,
  debugClerkJWT 
} from '../lib/clerk-jwt-config';

/**
 * Hook principal para autenticación unificada
 */
export const useAuthWithClerk = () => {
  // Hooks individuales
  const clerkAuth = useClerkAuth();
  const supabaseAuth = useSupabaseAuth();
  
  // Estado unificado
  const [unifiedUser, setUnifiedUser] = useState(null);
  const [unifiedProfile, setUnifiedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  /**
   * Sincroniza usuario de Clerk con Supabase
   */
  const syncUserWithSupabase = useCallback(async (clerkUser) => {
    if (!clerkUser) {
      setUnifiedUser(null);
      setUnifiedProfile(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Verificar que Clerk esté disponible
      if (!window.Clerk) {
        console.warn('⚠️ Clerk no está disponible en window');
        setUnifiedUser(mapClerkUserToSupabase(clerkUser));
        setIsLoading(false);
        return;
      }
      
      // Timeout para prevenir bloqueo (10 segundos)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La sincronización con Clerk tardó demasiado')), 10000);
      });
      
      const syncPromise = (async () => {
        // 1. Obtener token JWT de Clerk
        let token = null;
        try {
          token = await getClerkJWTForSupabase(window.Clerk);
          setJwtToken(token);
        } catch (tokenError) {
          console.warn('No se pudo obtener token JWT de Clerk:', tokenError);
          // Continuar sin token
        }
        
        // 2. Usar token para autenticarse con Supabase (si existe)
        if (token) {
          try {
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: '',
            });
            
            if (sessionError) {
              console.error('Error setting Supabase session with Clerk JWT:', sessionError);
              // Continuar con datos de Clerk aunque falle Supabase
            }
          } catch (sessionError) {
            console.error('Error en setSession de Supabase:', sessionError);
          }
        }
        
        // 3. Obtener perfil de Supabase usando el user ID de Clerk
        const clerkUserId = clerkUser.id;
        let supabaseProfile = null;
        
        if (clerkUserId) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, full_name, phone, email, role, avatar_url, created_at, updated_at')
              .eq('id', clerkUserId)
              .maybeSingle();
              
            if (profileError) {
              if (profileError.code === 'PGRST116') { // PGRST116 = no rows
                console.log(`ℹ️ No se encontró perfil para usuario ${clerkUserId.substring(0, 8)}`);
              } else {
                console.error('Error fetching Supabase profile:', profileError);
              }
            } else {
              supabaseProfile = profileData;
            }
            
            // 4. Si no existe perfil, crear uno
            if (!supabaseProfile) {
              const newProfile = {
                id: clerkUserId,
                email: clerkUser.primaryEmailAddress?.emailAddress,
                full_name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
                role: clerkUser.publicMetadata?.role || 'student',
                avatar_url: clerkUser.imageUrl,
                phone: clerkUser.privateMetadata?.phone || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              
              try {
                const { data: createdProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert([newProfile])
                  .select('id, full_name, phone, email, role, avatar_url, created_at, updated_at')
                  .single();
                  
                if (createError) {
                  console.error('Error creating Supabase profile:', createError);
                } else {
                  supabaseProfile = createdProfile;
                }
              } catch (insertError) {
                console.error('Error en inserción de perfil:', insertError);
              }
            }
          } catch (profileError) {
            console.error('Error general al obtener perfil:', profileError);
          }
        }
        
        // 5. Combinar datos
        const combinedUser = {
          // Datos de Clerk
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          fullName: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          createdAt: clerkUser.createdAt,
          
          // Datos de Supabase
          supabaseId: clerkUser.id, // Mismo ID
          phone: supabaseProfile?.phone || '',
          role: supabaseProfile?.role || 'student',
          profileData: supabaseProfile,
          
          // Metadata
          isClerkSignedIn: true,
          hasSupabaseProfile: !!supabaseProfile,
          jwtToken: token,
        };
        
        setUnifiedUser(combinedUser);
        setUnifiedProfile(supabaseProfile);
        setError(null);
        
      })();
      
      // Ejecutar con timeout
      await Promise.race([syncPromise, timeoutPromise]);
      
    } catch (err) {
      console.error('Error syncing user with Supabase:', err);
      setError(err.message);
      
      // Fallback robusto: usar solo datos de Clerk
      const fallbackUser = mapClerkUserToSupabase(clerkUser);
      setUnifiedUser(fallbackUser);
      setUnifiedProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Manejar sign out unificado
   */
  const signOut = useCallback(async () => {
    try {
      // Sign out de Clerk
      if (clerkAuth.isSignedIn && clerkAuth.signOut) {
        await clerkAuth.signOut();
      }
      
      // Sign out de Supabase
      if (supabaseAuth.user) {
        await supabaseAuth.signOut();
      }
      
      // Limpiar estado local
      setUnifiedUser(null);
      setUnifiedProfile(null);
      setJwtToken(null);
      setError(null);
      
      return { success: true };
    } catch (err) {
      console.error('Error during unified sign out:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [clerkAuth, supabaseAuth]);

  /**
   * Actualizar perfil en ambos sistemas
   */
  const updateProfile = useCallback(async (updates) => {
    if (!unifiedUser) {
      throw new Error('No user logged in');
    }
    
    try {
      const updatesToApply = {};
      
      // Separar updates por sistema
      const clerkUpdates = {};
      const supabaseUpdates = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (['firstName', 'lastName', 'imageUrl'].includes(key)) {
          clerkUpdates[key] = value;
        } else if (['phone', 'role'].includes(key)) {
          supabaseUpdates[key] = value;
        } else if (key === 'fullName') {
          // Para Clerk, separar nombre completo
          const [firstName, ...lastNameParts] = value.split(' ');
          clerkUpdates.firstName = firstName;
          clerkUpdates.lastName = lastNameParts.join(' ') || '';
          supabaseUpdates.full_name = value;
        } else {
          supabaseUpdates[key] = value;
        }
      });
      
      // Actualizar Clerk si hay cambios
      if (Object.keys(clerkUpdates).length > 0 && window.Clerk?.user) {
        await window.Clerk.user.update(clerkUpdates);
      }
      
      // Actualizar Supabase si hay cambios
      if (Object.keys(supabaseUpdates).length > 0 && unifiedUser.clerkId) {
        const { data, error } = await supabase
          .from('profiles')
          .update(supabaseUpdates)
          .eq('id', unifiedUser.clerkId)
          .select('id, full_name, phone, email, role, avatar_url, created_at, updated_at')
          .single();
          
        if (error) throw error;
        
        setUnifiedProfile(data);
        
        // Actualizar usuario unificado
        setUnifiedUser(prev => ({
          ...prev,
          ...(supabaseUpdates.full_name && { fullName: supabaseUpdates.full_name }),
          ...(supabaseUpdates.phone && { phone: supabaseUpdates.phone }),
          ...(supabaseUpdates.role && { role: supabaseUpdates.role }),
          profileData: data,
        }));
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [unifiedUser]);

  /**
   * Cambiar contraseña (usa Clerk nativo)
   */
  const changePassword = useCallback(() => {
    if (!window.Clerk) {
      throw new Error('Clerk no está disponible');
    }
    
    // Abrir perfil de usuario de Clerk (tiene opción de cambio de contraseña)
    window.Clerk.openUserProfile();
  }, []);

  /**
   * Debuggear integración JWT
   */
  const debugJWT = useCallback(async () => {
    if (!window.Clerk) {
      console.log('Clerk no está disponible en window');
      return;
    }
    
    return await debugClerkJWT(window.Clerk);
  }, []);

  // Efecto para sincronizar cuando cambia el usuario de Clerk
  useEffect(() => {
    let isMounted = true;
    
    const syncIfNeeded = async () => {
      if (clerkAuth.isLoaded) {
        if (clerkAuth.isSignedIn && clerkAuth.user) {
          await syncUserWithSupabase(clerkAuth.user);
        } else {
          // Usuario no autenticado en Clerk
          if (isMounted) {
            setUnifiedUser(null);
            setUnifiedProfile(null);
            setIsLoading(false);
          }
        }
      }
    };
    
    syncIfNeeded();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [clerkAuth.isLoaded, clerkAuth.isSignedIn, clerkAuth.user, syncUserWithSupabase]);

  // Efecto para manejar cambios en Supabase (fallback)
  useEffect(() => {
    if (!clerkAuth.isSignedIn && supabaseAuth.user) {
      // Modo fallback: solo Supabase
      setUnifiedUser({
        supabaseId: supabaseAuth.user.id,
        email: supabaseAuth.user.email,
        fullName: supabaseAuth.profile?.full_name || 'Usuario',
        phone: supabaseAuth.profile?.phone || '',
        role: supabaseAuth.profile?.role || 'student',
        isClerkSignedIn: false,
        hasSupabaseProfile: !!supabaseAuth.profile,
        profileData: supabaseAuth.profile,
      });
      setUnifiedProfile(supabaseAuth.profile);
      setIsLoading(false);
    }
  }, [supabaseAuth.user, supabaseAuth.profile, clerkAuth.isSignedIn]);

  return {
    // Estado
    user: unifiedUser,
    profile: unifiedProfile,
    isLoading: isLoading || clerkAuth.isLoaded === false,
    error,
    jwtToken,
    
    // Métodos
    signOut,
    updateProfile,
    changePassword,
    debugJWT,
    
    // Flags
    isSignedIn: !!unifiedUser,
    isClerkSignedIn: clerkAuth.isSignedIn,
    hasSupabaseProfile: !!unifiedProfile,
    
    // Datos específicos (helpers)
    fullName: unifiedUser?.fullName || 'Usuario',
    email: unifiedUser?.email || '',
    phone: unifiedUser?.phone || '',
    role: unifiedUser?.role || 'student',
    avatarUrl: unifiedUser?.imageUrl || null,
  };
};

export default useAuthWithClerk;