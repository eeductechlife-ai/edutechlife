/**
 * Componente de prueba para verificar integración JWT Clerk-Supabase
 */

import React, { useState } from 'react';
import { useAuthWithClerk } from '../../hooks/useAuthWithClerk';
import { Button } from '../ui/button-simple';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';

const JWTTestComponent = () => {
  const auth = useAuthWithClerk();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDebugJWT = async () => {
    setLoading(true);
    try {
      const info = await auth.debugJWT();
      setDebugInfo(info);
    } catch (error) {
      console.error('Error debuggeando JWT:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestSupabaseQuery = async () => {
    if (!auth.jwtToken) {
      alert('No hay token JWT disponible');
      return;
    }

    setLoading(true);
    try {
      // Aquí iría una query de prueba a Supabase usando el token
      // Por ahora solo mostramos el token
      alert(`Token JWT disponible (${auth.jwtToken.length} caracteres)\n\nPrimeros 50 chars: ${auth.jwtToken.substring(0, 50)}...`);
    } catch (error) {
      console.error('Error probando Supabase:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-[#004B63]">🔐 Prueba Integración JWT Clerk-Supabase</CardTitle>
        <p className="text-sm text-[#64748B]">
          Template ID: 5d74d508-85ee-4a7c-9d50-87005f9b8a90 (HS256)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Estado actual */}
        <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <h3 className="font-medium text-[#004B63] mb-2">Estado Actual</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#64748B]">Autenticado:</span>
              <span className={`ml-2 font-medium ${auth.isSignedIn ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {auth.isSignedIn ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="text-[#64748B]">Con Clerk:</span>
              <span className={`ml-2 font-medium ${auth.isClerkSignedIn ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                {auth.isClerkSignedIn ? '✅ Sí' : '⚠️ No'}
              </span>
            </div>
            <div>
              <span className="text-[#64748B]">Token JWT:</span>
              <span className={`ml-2 font-medium ${auth.jwtToken ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                {auth.jwtToken ? '✅ Disponible' : '❌ No disponible'}
              </span>
            </div>
            <div>
              <span className="text-[#64748B]">Perfil Supabase:</span>
              <span className={`ml-2 font-medium ${auth.hasSupabaseProfile ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                {auth.hasSupabaseProfile ? '✅ Sí' : '⚠️ No'}
              </span>
            </div>
          </div>
        </div>

        {/* Información del usuario */}
        {auth.user && (
          <div className="p-4 bg-[#00BCD4]/5 rounded-lg border border-[#00BCD4]/20">
            <h3 className="font-medium text-[#004B63] mb-2">Usuario Unificado</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-[#64748B]">Nombre:</span>
                <span className="ml-2 font-medium text-[#004B63]">{auth.fullName}</span>
              </div>
              <div>
                <span className="text-[#64748B]">Email:</span>
                <span className="ml-2 font-medium text-[#004B63]">{auth.email}</span>
              </div>
              <div>
                <span className="text-[#64748B]">Teléfono:</span>
                <span className="ml-2 font-medium text-[#004B63]">{auth.phone || 'No especificado'}</span>
              </div>
              <div>
                <span className="text-[#64748B]">Rol:</span>
                <span className="ml-2 font-medium text-[#004B63]">{auth.role}</span>
              </div>
              <div>
                <span className="text-[#64748B]">ID Clerk:</span>
                <span className="ml-2 font-medium text-[#004B63]">{auth.user.clerkId || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        {debugInfo && (
          <div className="p-4 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/30">
            <h3 className="font-medium text-[#92400E] mb-2">🔍 Información Debug JWT</h3>
            <pre className="text-xs bg-white p-3 rounded border border-[#E2E8F0] overflow-auto max-h-60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Botones de prueba */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            onClick={handleDebugJWT}
            disabled={loading || !auth.isClerkSignedIn}
            className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] hover:opacity-90"
          >
            {loading ? 'Procesando...' : 'Debuggear JWT'}
          </Button>
          
          <Button
            onClick={handleTestSupabaseQuery}
            disabled={loading || !auth.jwtToken}
            variant="outline"
            className="border-[#00BCD4] text-[#00BCD4] hover:bg-[#00BCD4]/10"
          >
            Probar Query Supabase
          </Button>
          
          <Button
            onClick={auth.changePassword}
            disabled={!auth.isClerkSignedIn}
            variant="outline"
            className="border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10"
          >
            Cambiar Contraseña (Clerk)
          </Button>
          
          <Button
            onClick={() => auth.signOut()}
            variant="outline"
            className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Mensajes de error */}
        {auth.error && (
          <div className="p-4 bg-[#FEE2E2] rounded-lg border border-[#EF4444]/30">
            <h3 className="font-medium text-[#DC2626] mb-1">❌ Error</h3>
            <p className="text-sm text-[#991B1B]">{auth.error}</p>
          </div>
        )}

        {/* Instrucciones */}
        <div className="text-sm text-[#64748B] bg-[#F8FAFC] p-4 rounded-lg">
          <h4 className="font-medium text-[#004B63] mb-2">📋 Instrucciones de Prueba</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Asegúrate de estar autenticado con Clerk (botón "Sign In" en la app)</li>
            <li>Haz clic en "Debuggear JWT" para verificar la configuración</li>
            <li>Si hay token JWT, prueba una query a Supabase</li>
            <li>Verifica que los datos del usuario se sincronicen correctamente</li>
          </ol>
          <p className="mt-3 text-xs">
            <strong>Template ID:</strong> 5d74d508-85ee-4a7c-9d50-87005f9b8a90<br />
            <strong>Algoritmo:</strong> HS256 (Shared Secret)<br />
            <strong>Integración:</strong> Clerk Frontend → JWT → Supabase Backend
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JWTTestComponent;