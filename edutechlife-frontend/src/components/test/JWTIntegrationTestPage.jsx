/**
 * Página de prueba para integración JWT Clerk-Supabase
 * Se puede acceder temporalmente para verificar la configuración
 */

import React from 'react';
import JWTTestComponent from './JWTTestComponent';
import { Button } from '../ui/button-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const JWTIntegrationTestPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-[#004B63] hover:text-[#00BCD4] transition-colors mb-4"
          >
            <Icon name="fa-arrow-left" />
            <span>Volver</span>
          </button>
          
          <div className="bg-gradient-to-r from-[#004B63] to-[#00BCD4] p-6 rounded-2xl text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              🔐 Prueba Integración JWT Clerk-Supabase
            </h1>
            <p className="opacity-90">
              Template ID: 5d74d508-85ee-4a7c-9d50-87005f9b8a90 • Algoritmo: HS256 (Shared Secret)
            </p>
          </div>
        </div>

        {/* Información de configuración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h2 className="text-lg font-semibold text-[#004B63] mb-3 flex items-center gap-2">
              <Icon name="fa-cog" className="text-[#00BCD4]" />
              Configuración Clerk
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Publishable Key:</span>
                <span className={`font-medium ${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Configurado' : '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Secret Key:</span>
                <span className={`font-medium ${import.meta.env.VITE_CLERK_SECRET_KEY ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {import.meta.env.VITE_CLERK_SECRET_KEY ? '✅ Configurado' : '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">JWT Template:</span>
                <span className="font-medium text-[#10B981]">✅ 5d74d508-85ee-4a7c-9d50-87005f9b8a90</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h2 className="text-lg font-semibold text-[#004B63] mb-3 flex items-center gap-2">
              <Icon name="fa-database" className="text-[#00BCD4]" />
              Configuración Supabase
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">URL:</span>
                <span className={`font-medium ${import.meta.env.VITE_SUPABASE_URL ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Anon Key:</span>
                <span className={`font-medium ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">JWT Auth:</span>
                <span className="font-medium text-[#10B981]">✅ Configurado (HS256)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagrama de flujo */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-[#004B63] mb-4 flex items-center gap-2">
            <Icon name="fa-project-diagram" className="text-[#00BCD4]" />
            Flujo de Autenticación JWT
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#004B63] text-white flex items-center justify-center mx-auto mb-2">
                <Icon name="fa-user" className="text-xl" />
              </div>
              <p className="font-medium text-[#004B63]">Usuario</p>
              <p className="text-xs text-[#64748B]">Login con Clerk</p>
            </div>
            
            <Icon name="fa-arrow-right" className="text-[#00BCD4] text-xl hidden md:block" />
            <Icon name="fa-arrow-down" className="text-[#00BCD4] text-xl md:hidden" />
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#00BCD4] text-white flex items-center justify-center mx-auto mb-2">
                <Icon name="fa-shield-alt" className="text-xl" />
              </div>
              <p className="font-medium text-[#004B63]">Clerk</p>
              <p className="text-xs text-[#64748B]">Genera JWT Template</p>
            </div>
            
            <Icon name="fa-arrow-right" className="text-[#00BCD4] text-xl hidden md:block" />
            <Icon name="fa-arrow-down" className="text-[#00BCD4] text-xl md:hidden" />
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto mb-2">
                <Icon name="fa-key" className="text-xl" />
              </div>
              <p className="font-medium text-[#004B63]">JWT Token</p>
              <p className="text-xs text-[#64748B]">HS256 Signature</p>
            </div>
            
            <Icon name="fa-arrow-right" className="text-[#00BCD4] text-xl hidden md:block" />
            <Icon name="fa-arrow-down" className="text-[#00BCD4] text-xl md:hidden" />
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center mx-auto mb-2">
                <Icon name="fa-database" className="text-xl" />
              </div>
              <p className="font-medium text-[#004B63]">Supabase</p>
              <p className="text-xs text-[#64748B]">Valida y procesa</p>
            </div>
          </div>
        </div>

        {/* Componente de prueba principal */}
        <JWTTestComponent />

        {/* Instrucciones */}
        <div className="mt-8 bg-[#F0F9FF] p-6 rounded-xl border border-[#00BCD4]/30">
          <h3 className="text-lg font-semibold text-[#004B63] mb-3 flex items-center gap-2">
            <Icon name="fa-graduation-cap" className="text-[#00BCD4]" />
            Instrucciones para Probar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-[#004B63]">Autentícate con Clerk</p>
                  <p className="text-sm text-[#64748B]">Usa el botón "Sign In" en la aplicación principal</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-[#004B63]">Debuggear JWT</p>
                  <p className="text-sm text-[#64748B]">Haz clic en "Debuggear JWT" para verificar el token</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-[#004B63]">Probar Supabase</p>
                  <p className="text-sm text-[#64748B]">Usa el token JWT para hacer queries a Supabase</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium text-[#004B63]">Verificar Sincronización</p>
                  <p className="text-sm text-[#64748B]">Comprueba que los datos se sincronicen entre Clerk y Supabase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notas importantes */}
        <div className="mt-6 p-4 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/30">
          <div className="flex items-start gap-3">
            <Icon name="fa-exclamation-triangle" className="text-[#F59E0B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#92400E]">Notas Importantes</p>
              <ul className="text-sm text-[#92400E]/80 space-y-1 mt-1 list-disc pl-5">
                <li>El JWT Template debe estar configurado en el dashboard de Clerk</li>
                <li>Supabase debe tener configurada la validación JWT con el mismo secret</li>
                <li>Los claims del JWT deben incluir los campos necesarios para Supabase</li>
                <li>Esta página es solo para pruebas y debería removerse en producción</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTIntegrationTestPage;