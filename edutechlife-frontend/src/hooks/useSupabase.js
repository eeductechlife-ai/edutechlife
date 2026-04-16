import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@clerk/react';
import { getSupabase } from '../lib/supabase';
import { debugClerkJWT } from '../lib/clerk-jwt-config';

/**
 * Hook para obtener cliente Supabase con JWT de Clerk
 * 
 * Este hook:
 * 1. Obtiene la sesión de Clerk usando useSession
 * 2. Crea un cliente Supabase con JWT de Clerk si hay sesión
 * 3. Devuelve cliente base si no hay sesión Clerk
 * 4. Maneja refresco automático del token
 * 
 * @returns {Object} { supabase, isLoading, error, debugJWT }
 */
export const useSupabase = () => {
  const { session, isLoaded } = useSession();
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Crear o actualizar cliente Supabase cuando cambia la sesión
  const updateSupabaseClient = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = await getSupabase(session);
      setSupabaseClient(client);

      if (session) {
        console.log('✅ Cliente Supabase configurado con JWT de Clerk');
      } else {
        console.log('🔓 Cliente Supabase base (sin sesión Clerk)');
      }
    } catch (err) {
      console.error('❌ Error creando cliente Supabase:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Efecto para crear cliente inicial
  useEffect(() => {
    if (isLoaded) {
      updateSupabaseClient();
    }
  }, [isLoaded, updateSupabaseClient]);

  // Efecto para refrescar token periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!session) return;

    const refreshInterval = setInterval(async () => {
      try {
        console.log('🔄 Refrescando token JWT de Clerk...');
        await updateSupabaseClient();
      } catch (err) {
        console.warn('⚠️ Error refrescando token:', err);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(refreshInterval);
  }, [session, updateSupabaseClient]);

  // Helper para debuggear JWT
  const debugJWT = useCallback(async () => {
    if (!session) {
      console.log('❌ No hay sesión de Clerk para debuggear');
      return null;
    }
    return await debugClerkJWT(session);
  }, [session]);

  // Helper para verificar permisos RLS
  const checkRLSPermissions = useCallback(async () => {
    if (!supabaseClient || !session) {
      return { hasAccess: false, reason: 'No hay cliente o sesión' };
    }

    try {
      // Intentar acceder a una tabla protegida por RLS
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        return { 
          hasAccess: false, 
          reason: error.message,
          code: error.code 
        };
      }

      return { 
        hasAccess: true, 
        canReadProfiles: true,
        userId: session.userId 
      };
    } catch (err) {
      return { 
        hasAccess: false, 
        reason: err.message 
      };
    }
  }, [supabaseClient, session]);

  // Helper para operaciones específicas del curso
  const courseProgress = {
    // Obtener progreso del usuario actual
    getProgress: async () => {
      if (!supabaseClient || !session) {
        throw new Error('No hay sesión activa');
      }

      const { data, error } = await supabaseClient
        .from('course_progress')
        .select('*')
        .order('module_id', { ascending: true })
        .order('lesson_id', { ascending: true });

      if (error) throw error;
      return data;
    },

    // Marcar lección como completada
    markLessonCompleted: async (moduleId, lessonId, contentType, contentId, score = null) => {
      if (!supabaseClient || !session) {
        throw new Error('No hay sesión activa');
      }

      const { data, error } = await supabaseClient
        .from('course_progress')
        .upsert({
          module_id: moduleId,
          lesson_id: lessonId,
          content_type: contentType,
          content_id: contentId,
          is_completed: true,
          score: score,
          completed_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data;
    },

    // Verificar si usuario tiene certificado
    getCertificate: async () => {
      if (!supabaseClient || !session) {
        throw new Error('No hay sesión activa');
      }

      const { data, error } = await supabaseClient
        .from('certificates')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  };

  return {
    // Cliente Supabase (puede ser con JWT o base)
    supabase: supabaseClient,
    
    // Estado
    isLoading: isLoading || !isLoaded,
    error,
    
    // Información de sesión
    hasClerkSession: !!session,
    session,
    
    // Métodos de utilidad
    debugJWT,
    checkRLSPermissions,
    
    // Operaciones específicas del curso
    courseProgress,
    
    // Refresh manual
    refreshClient: updateSupabaseClient,
  };
};

export default useSupabase;