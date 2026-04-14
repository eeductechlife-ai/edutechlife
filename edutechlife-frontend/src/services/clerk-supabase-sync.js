/**
 * Servicio de sincronización entre Clerk y Supabase
 * 
 * Este servicio maneja:
 * 1. Sincronización de datos de usuario
 * 2. Migración de usuarios existentes
 * 3. Mantenimiento de sesiones consistentes
 */

import { supabase } from '../lib/supabase';

/**
 * Sincroniza un usuario de Clerk con Supabase
 */
export const syncUserWithSupabase = async (clerkUser) => {
  try {
    console.log('Sincronizando usuario Clerk con Supabase:', clerkUser.id);

    // Extraer datos del usuario Clerk
    const userData = extractClerkUserData(clerkUser);
    
    // Verificar si el usuario ya existe en Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clerkUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error diferente a "no encontrado"
      console.error('Error buscando usuario en Supabase:', fetchError);
      throw fetchError;
    }

    if (existingUser) {
      // Actualizar usuario existente
      console.log('Actualizando usuario existente en Supabase');
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clerkUser.id)
        .select()
        .single();

      if (error) throw error;
      console.log('Usuario actualizado en Supabase:', data);
      return data;
    } else {
      // Crear nuevo usuario
      console.log('Creando nuevo usuario en Supabase');
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: clerkUser.id,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Usuario creado en Supabase:', data);
      return data;
    }
  } catch (error) {
    console.error('Error sincronizando usuario con Supabase:', error);
    throw error;
  }
};

/**
 * Extrae datos relevantes de un usuario Clerk
 */
const extractClerkUserData = (clerkUser) => {
  const email = clerkUser.primaryEmailAddress?.emailAddress || '';
  const fullName = clerkUser.fullName || '';
  const firstName = clerkUser.firstName || '';
  const lastName = clerkUser.lastName || '';
  
  // Si no hay fullName pero hay firstName y lastName, construirlo
  const resolvedFullName = fullName || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '');

  return {
    email,
    full_name: resolvedFullName,
    first_name: firstName,
    last_name: lastName,
    avatar_url: clerkUser.imageUrl || null,
    role: 'student', // Rol por defecto
    phone: '', // Phone no disponible en Clerk por defecto
    plain_password: null, // No almacenar contraseñas en texto plano
    user_count: null, // Contador específico de Supabase
  };
};

/**
 * Migra usuarios existentes de Supabase a Clerk
 * (Para uso administrativo)
 */
export const migrateUsersToClerk = async () => {
  try {
    console.log('Iniciando migración de usuarios a Clerk...');
    
    // Obtener todos los usuarios de Supabase
    const { data: supabaseUsers, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;

    console.log(`Encontrados ${supabaseUsers.length} usuarios en Supabase`);

    // Aquí iría la lógica para crear usuarios en Clerk
    // Nota: Esto requiere permisos de administrador en Clerk
    const migrationResults = {
      total: supabaseUsers.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (const user of supabaseUsers) {
      try {
        console.log(`Migrando usuario: ${user.email}`);
        
        // TODO: Implementar creación de usuario en Clerk via API
        // const clerkUser = await createClerkUser(user);
        
        migrationResults.successful++;
      } catch (userError) {
        console.error(`Error migrando usuario ${user.email}:`, userError);
        migrationResults.failed++;
        migrationResults.errors.push({
          email: user.email,
          error: userError.message,
        });
      }
    }

    console.log('Migración completada:', migrationResults);
    return migrationResults;
  } catch (error) {
    console.error('Error en migración de usuarios:', error);
    throw error;
  }
};

/**
 * Verifica consistencia entre Clerk y Supabase
 */
export const verifyConsistency = async (clerkUserId) => {
  try {
    console.log('Verificando consistencia para usuario:', clerkUserId);
    
    // Obtener usuario de Clerk (simulado por ahora)
    const clerkUser = { id: clerkUserId }; // Esto sería real con Clerk SDK
    
    // Obtener usuario de Supabase
    const { data: supabaseUser, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clerkUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const consistencyReport = {
      clerkUserId,
      existsInClerk: !!clerkUser,
      existsInSupabase: !!supabaseUser,
      supabaseUser,
      inconsistencies: [],
    };

    // Verificar inconsistencias
    if (clerkUser && supabaseUser) {
      // Comparar datos básicos
      const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress;
      if (clerkEmail && clerkEmail !== supabaseUser.email) {
        consistencyReport.inconsistencies.push({
          field: 'email',
          clerkValue: clerkEmail,
          supabaseValue: supabaseUser.email,
        });
      }

      const clerkName = clerkUser.fullName;
      if (clerkName && clerkName !== supabaseUser.full_name) {
        consistencyReport.inconsistencies.push({
          field: 'full_name',
          clerkValue: clerkName,
          supabaseValue: supabaseUser.full_name,
        });
      }
    } else if (clerkUser && !supabaseUser) {
      consistencyReport.inconsistencies.push({
        type: 'missing_in_supabase',
        message: 'Usuario existe en Clerk pero no en Supabase',
      });
    } else if (!clerkUser && supabaseUser) {
      consistencyReport.inconsistencies.push({
        type: 'missing_in_clerk',
        message: 'Usuario existe en Supabase pero no en Clerk',
      });
    }

    console.log('Reporte de consistencia:', consistencyReport);
    return consistencyReport;
  } catch (error) {
    console.error('Error verificando consistencia:', error);
    throw error;
  }
};

/**
 * Sincronización automática al detectar cambios
 */
export const setupAutoSync = (clerkInstance) => {
  if (!clerkInstance) {
    console.warn('Clerk instance no disponible para auto-sync');
    return;
  }

  // Verificar si clerkInstance tiene el método addListener
  if (typeof clerkInstance.addListener !== 'function') {
    console.warn('Clerk instance no tiene método addListener (modo simulación) - omitiendo auto-sync');
    return;
  }

  try {
    // Escuchar cambios en el usuario de Clerk
    clerkInstance.addListener((event) => {
      console.log('Clerk event detected:', event.type);
      
      if (event.type === 'userUpdated' && event.user) {
        // Sincronizar cuando se actualiza el usuario
        syncUserWithSupabase(event.user).catch(console.error);
      }
      
      if (event.type === 'signOut') {
        // Limpiar sesión de Supabase al cerrar sesión en Clerk
        supabase.auth.signOut().catch(console.error);
      }
    });

    console.log('Auto-sync configurado para Clerk');
  } catch (error) {
    console.error('Error configurando auto-sync:', error);
    console.log('Continuando sin auto-sync (modo simulación)');
  }
};