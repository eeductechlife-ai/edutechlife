import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, useAuth } from '@clerk/react';
import { createClerkSupabaseClient } from '../lib/supabase';

export const useSupabase = () => {
  const { session, isLoaded } = useSession();
  const { getToken } = useAuth();
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingJWT, setIsUsingJWT] = useState(false);
  const [userId, setUserId] = useState(null);

  const clientCreatedRef = useRef(false);

  const updateSupabaseClient = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let client;
      let usingJWT = false;
      let currentUserId = null;
      
      if (session) {
        const token = await getToken({ template: 'supabase' });
        
        if (token) {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          currentUserId = tokenPayload.sub;
          setUserId(currentUserId);
          
          console.log('🔑 Token JWT obtenido de Clerk:');
          console.log('   - User ID (sub):', currentUserId);
          console.log('   - Algoritmo: HS256 (simétrico, no compatible con Supabase JWKS)');
          console.log('🔄 Usando cliente anon key (JWT HS256 no compatible con Supabase Discovery URL)');
        }
        
        // Siempre usar cliente anon key porque HS256 no es compatible con Supabase JWKS
        // RLS permissivo permite acceso con anon key, y filtramos por user_id en la app
        client = createClerkSupabaseClient();
        usingJWT = false;
      } else {
        client = createClerkSupabaseClient();
        usingJWT = false;
      }
      
      setIsUsingJWT(usingJWT);
      
      if (!clientCreatedRef.current) {
        setSupabaseClient(client);
        clientCreatedRef.current = true;
      }
    } catch (err) {
      console.error('❌ Error creando cliente Supabase:', err);
      setError(err.message);
      const fallbackClient = createClerkSupabaseClient();
      setSupabaseClient(fallbackClient);
      setIsUsingJWT(false);
    } finally {
      setIsLoading(false);
    }
  }, [session, getToken]);

  useEffect(() => {
    if (isLoaded) {
      updateSupabaseClient();
    }
  }, [isLoaded, updateSupabaseClient]);

  useEffect(() => {
    if (!session) {
      clientCreatedRef.current = false;
      setIsUsingJWT(false);
      setUserId(null);
    }
  }, [session]);

  return {
    supabase: supabaseClient,
    isLoading: isLoading || !isLoaded,
    error,
    isUsingJWT,
    userId,
    hasClerkSession: !!session,
    session,
    refreshClient: updateSupabaseClient,
  };
};

export default useSupabase;
