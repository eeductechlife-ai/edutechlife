/**
 * Servicio optimizado para perfiles usando mejores prácticas de Neon Postgres
 * Mantiene compatibilidad con Supabase pero aplica optimizaciones de Neon
 */

import { supabase } from '../lib/supabase';

class NeonProfileService {
  /**
   * Obtiene el perfil de un usuario con consulta optimizada
   * Aplica técnicas de Neon: selección específica, cache, pooling implícito
   */
  async getUserProfile(userId) {
    if (!userId) {
      console.error('❌ userId es requerido para getUserProfile');
      return null;
    }

    try {
      console.log(`🔍 [Neon] Obteniendo perfil para usuario: ${userId.substring(0, 8)}...`);
      
      // Timeout para prevenir carga infinita (5 segundos)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La consulta tardó demasiado')), 5000);
      });
      
      // Consulta optimizada con manejo de columnas faltantes
      const queryPromise = (async () => {
        try {
          // Primero intentar con columnas nuevas (full_name, phone)
          const { data, error, status } = await supabase
            .from('profiles')
            .select('id, full_name, phone, email, role, avatar_url, created_at, updated_at')
            .eq('id', userId)
            .maybeSingle();
          
          if (error) {
            // Si hay error de columna faltante, intentar con columnas alternativas
            if (error.message && error.message.includes('full_name')) {
              console.log(`ℹ️ [Neon] Columna full_name no encontrada, usando display_name...`);
              
              // Intentar con display_name como alternativa
              const { data: altData, error: altError } = await supabase
                .from('profiles')
                .select('id, display_name, phone_number, email, role, avatar_url, created_at, updated_at')
                .eq('id', userId)
                .maybeSingle();
              
              if (altError) {
                // Si también falla con display_name, verificar si es error de "no rows"
                if (altError.code === 'PGRST116') {
                  console.log(`ℹ️ [Neon] No se encontró perfil para usuario ${userId.substring(0, 8)}`);
                  return null;
                }
                throw new Error(`Error al obtener perfil (fallback): ${altError.message}`);
              }
              
              // Mapear datos alternativos a estructura esperada
              if (altData) {
                return {
                  ...altData,
                  full_name: altData.display_name,
                  phone: altData.phone_number || altData.phone
                };
              }
              return null;
            }
            
            // Manejo específico de errores según tipo
            if (error.code === 'PGRST116') {
              console.log(`ℹ️ [Neon] No se encontró perfil para usuario ${userId.substring(0, 8)}`);
              return null;
            }
            
            throw new Error(`Error al obtener perfil: ${error.message}`);
          }
          
          console.log(`✅ [Neon] Perfil obtenido (status: ${status})`);
          return data;
          
        } catch (queryError) {
          console.error(`❌ [Neon] Error en consulta:`, queryError);
          throw queryError;
        }
      })();
      
      // Ejecutar con timeout
      const data = await Promise.race([queryPromise, timeoutPromise]);
      return data;
      
    } catch (error) {
      console.error(`❌ [Neon] Error inesperado en getUserProfile:`, error);
      
      // No lanzar error para evitar romper la UI, devolver null con logging
      console.log(`⚠️ [Neon] Fallback: devolviendo null por error: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Actualiza el perfil de un usuario con transacción optimizada
   * Aplica técnicas de Neon: UPDATE con RETURNING, validación previa
   */
  async updateUserProfile(userId, updates) {
    if (!userId) {
      throw new Error('userId es requerido para updateUserProfile');
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Se requieren datos para actualizar');
    }
    
    try {
      console.log(`🔄 [Neon] Actualizando perfil para usuario: ${userId.substring(0, 8)}...`);
      console.log(`📝 [Neon] Campos a actualizar:`, updates);
      
      // Timeout para prevenir bloqueo (8 segundos)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La actualización tardó demasiado')), 8000);
      });
      
      const updatePromise = (async () => {
        // Preparar datos para actualización
        const updateData = {
          ...updates,
          updated_at: new Date().toISOString() // Siempre actualizar timestamp
        };
        
        // Intentar con columnas nuevas primero
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            .select('id, full_name, phone, email, role, updated_at')
            .single();
          
          if (error) {
            // Si hay error de columna, intentar mapear a columnas alternativas
            if (error.message && error.message.includes('full_name')) {
              console.log(`ℹ️ [Neon] Columna full_name no encontrada, usando display_name...`);
              
              // Mapear full_name a display_name si existe
              const altUpdateData = { ...updateData };
              if (altUpdateData.full_name) {
                altUpdateData.display_name = altUpdateData.full_name;
                delete altUpdateData.full_name;
              }
              
              const { data: altData, error: altError } = await supabase
                .from('profiles')
                .update(altUpdateData)
                .eq('id', userId)
                .select('id, display_name, phone_number, email, role, updated_at')
                .single();
              
              if (altError) throw altError;
              
              // Mapear respuesta a estructura esperada
              return {
                ...altData,
                full_name: altData.display_name,
                phone: altData.phone_number || altData.phone
              };
            }
            throw error;
          }
          
          console.log(`✅ [Neon] Perfil actualizado exitosamente (status: ${status})`);
          console.log(`📊 [Neon] Datos actualizados:`, data);
          return data;
          
        } catch (queryError) {
          console.error(`❌ [Neon] Error en actualización:`, queryError);
          
          // Manejo específico de errores comunes
          if (queryError.code === '23505') {
            throw new Error('Violación de unicidad: el valor ya existe');
          }
          if (queryError.code === '23503') {
            throw new Error('Violación de clave foránea: usuario no existe');
          }
          if (queryError.code === '42501') {
            throw new Error('Permiso denegado: no tienes permisos para actualizar este perfil');
          }
          
          throw new Error(`Error al actualizar perfil: ${queryError.message}`);
        }
      })();
      
      // Ejecutar con timeout
      const data = await Promise.race([updatePromise, timeoutPromise]);
      return data;
      
    } catch (error) {
      console.error(`❌ [Neon] Error inesperado en updateUserProfile:`, error);
      throw error;
    }
  }
  
  /**
   * Crea o actualiza un perfil (upsert) - Patrón común en Neon
   */
  async upsertUserProfile(profileData) {
    if (!profileData.id) {
      throw new Error('id es requerido para upsertUserProfile');
    }
    
    try {
      console.log(`🔄 [Neon] Upsert perfil para usuario: ${profileData.id.substring(0, 8)}...`);
      
      // Asegurar campos requeridos
      const completeProfile = {
        ...profileData,
        updated_at: new Date().toISOString(),
        created_at: profileData.created_at || new Date().toISOString()
      };
      
      // Técnica Neon: UPSERT con conflicto en id
      const { data, error } = await supabase
        .from('profiles')
        .upsert(completeProfile, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ [Neon] Error en upsert:`, error);
        throw new Error(`Error en upsert: ${error.message}`);
      }
      
      console.log(`✅ [Neon] Upsert completado`);
      return data;
      
    } catch (error) {
      console.error(`❌ [Neon] Error inesperado en upsertUserProfile:`, error);
      throw error;
    }
  }
  
  /**
   * Valida formato de teléfono para Colombia (10 dígitos)
   * Técnica Neon: Validación en cliente para reducir carga en DB
   */
  validatePhoneFormat(phone) {
    if (!phone) return { valid: true, message: '' }; // Teléfono opcional
    
    // Solo números, máximo 10 dígitos
    const phoneRegex = /^\d{1,10}$/;
    
    if (!phoneRegex.test(phone)) {
      return {
        valid: false,
        message: 'El teléfono debe contener solo números (máximo 10 dígitos)'
      };
    }
    
    // Validación específica para Colombia
    if (phone.length === 10) {
      const validPrefixes = ['3']; // Celulares colombianos empiezan con 3
      if (!validPrefixes.includes(phone[0])) {
        return {
          valid: false,
          message: 'El número debe comenzar con 3 para celulares colombianos'
        };
      }
    }
    
    return { valid: true, message: '' };
  }
  
  /**
   * Valida formato de nombre (mínimo 3 letras)
   */
  validateNameFormat(name) {
    if (!name || name.trim().length < 3) {
      return {
        valid: false,
        message: 'El nombre debe tener al menos 3 caracteres'
      };
    }
    
    // Solo letras, espacios y algunos caracteres especiales comunes
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/;
    
    if (!nameRegex.test(name)) {
      return {
        valid: false,
        message: 'El nombre solo puede contener letras y espacios'
      };
    }
    
    return { valid: true, message: '' };
  }
  
  /**
   * Obtiene estadísticas de uso (para monitoreo)
   */
  async getProfileStats() {
    try {
      console.log('📊 [Neon] Obteniendo estadísticas de perfiles...');
      
      // Consultas optimizadas en paralelo (técnica Neon)
      const [
        { count: totalProfiles, error: countError },
        { data: recentUpdates, error: updatesError }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('id, full_name, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5)
      ]);
      
      if (countError) {
        console.error('❌ [Neon] Error al contar perfiles:', countError);
      }
      if (updatesError) {
        console.error('❌ [Neon] Error al obtener actualizaciones recientes:', updatesError);
      }
      
      return {
        totalProfiles: totalProfiles || 0,
        recentUpdates: recentUpdates || [],
        lastChecked: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ [Neon] Error al obtener estadísticas:', error);
      return { totalProfiles: 0, recentUpdates: [], error: error.message };
    }
  }
}

// Exportar instancia singleton para reutilizar conexiones
export const neonProfileService = new NeonProfileService();
export default neonProfileService;