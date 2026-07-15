# 🔐 Integración Clerk + Supabase JWT para IALab

## 📋 REQUISITOS PREVIOS

### 1. Acceso a Dashboards
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Supabase Dashboard**: https://app.supabase.com/project/srirrwpgswlnuqfgtule

### 2. Credenciales Actuales (del archivo `.env.local`)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_c3RhYmxlLW1pbmstNzEuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_CLERK_SECRET_KEY=sk_test_NDQcl4lUpTr3iFfY8CLE4TSwW69YtcZWIgJEMRPwMT
VITE_SUPABASE_URL=https://srirrwpgswlnuqfgtule.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXJyd3Bnc3dsbnVxZmd0dWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTE5MjcsImV4cCI6MjA5MDkyNzkyN30.ElxGbhsfncV2m3OVr3P5X3HqAfwGMbAOGBEGzKqRV0A
```

## 🚀 PASO 1: Configurar JWT Template en Clerk

### 1.1 Ir a Clerk Dashboard
1. Accede a https://dashboard.clerk.com
2. Selecciona tu aplicación "Edutechlife"
3. Ve a **JWT Templates** en el menú lateral

### 1.2 Crear Nuevo Template
1. Haz clic en **"New template"**
2. Usa el ID: `5d74d508-85ee-4a7c-9d50-87005f9b8a90`
3. Nombre: `Supabase Integration`
4. Audience: `supabase`

### 1.3 Configurar Claims
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "user_metadata": {
    "full_name": "{{user.full_name}}",
    "avatar_url": "{{user.image_url}}"
  },
  "role": "authenticated"
}
```

### 1.4 Configurar Signing Key
1. Algoritmo: `RS256`
2. Copiar el **JWKS URL** (se verá como: `https://api.clerk.com/v1/jwks`)
3. **GUARDAR** el template

## 🚀 PASO 2: Configurar JWT en Supabase

### 2.1 Ir a Supabase Dashboard
1. Accede a https://app.supabase.com/project/srirrwpgswlnuqfgtule
2. Ve a **Authentication** → **Providers**
3. Busca **JWT Settings**

### 2.2 Configurar JWT Secret
1. Habilita **Custom JWT**
2. JWKS URL: (pegar el URL de Clerk del paso 1.4)
3. Issuer: `clerk.edutechlife.com` (o tu dominio Clerk)
4. **GUARDAR** configuración

### 2.3 Verificar Configuración
1. Ve a **SQL Editor**
2. Ejecuta:
```sql
-- Verificar que auth.users se sincroniza con Clerk
SELECT * FROM auth.users LIMIT 5;
```

## 🚀 PASO 3: Ejecutar el Schema SQL

### 3.1 Ejecutar en Supabase SQL Editor
1. Copiar todo el contenido de `IALAB_PREMIUM_SAAS_SCHEMA.sql`
2. Pegar en **SQL Editor** de Supabase
3. **Ejecutar** (puede tomar 1-2 minutos)

### 3.2 Verificar Instalación
```sql
-- Verificar tablas creadas
SELECT * FROM verify_ialab_schema();

-- Verificar políticas RLS
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🚀 PASO 4: Configurar Código Frontend

### 4.1 Crear Cliente Supabase con Clerk JWT

Crear archivo: `src/lib/supabase-premium-client.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import { useClerk } from '@clerk/react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente base (sin auth)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente premium con Clerk JWT
export const createPremiumClient = (clerkClient) => {
  if (!clerkClient) return supabase;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      
      // Override para usar token de Clerk
      storageKey: 'clerk-supabase-token',
      storage: {
        getItem: async (key) => {
          if (key === 'clerk-supabase-token' && clerkClient.session) {
            const token = await clerkClient.session.getToken({
              template: '5d74d508-85ee-4a7c-9d50-87005f9b8a90' // ID del template
            });
            return token;
          }
          return null;
        },
        setItem: () => {},
        removeItem: () => {}
      }
    }
  });
};

// Hook para usar en componentes
export const usePremiumSupabase = () => {
  const { user, isLoaded } = useClerk();
  
  if (!isLoaded || !user) {
    return { supabase, isPremium: false };
  }
  
  return {
    supabase: createPremiumClient(window.Clerk),
    isPremium: true,
    userId: user.id
  };
};
```

### 4.2 Actualizar AuthContext

Actualizar `src/context/AuthContext.jsx`:

```javascript
import { usePremiumSupabase } from '../lib/supabase-premium-client';

// En tu componente:
const { supabase: premiumSupabase, isPremium, userId } = usePremiumSupabase();

// Usar premiumSupabase para operaciones que requieren auth.uid()
```

### 4.3 Actualizar IALabContext

Actualizar `src/context/IALabContext.jsx`:

```javascript
// Reemplazar llamadas a supabase por premiumSupabase
const saveProgress = async (moduleId, lessonId, score) => {
  const { supabase: premiumSupabase } = usePremiumSupabase();
  
  const { data, error } = await premiumSupabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      lesson_id: lessonId,
      content_type: 'activity',
      is_completed: true,
      score: score,
      completed_at: new Date().toISOString()
    });
    
  // ... resto del código
};
```

## 🚀 PASO 5: Testing de Integración

### 5.1 Script de Testing

Crear archivo: `scripts/test-clerk-supabase-integration.js`

```javascript
import { createPremiumClient } from '../src/lib/supabase-premium-client';

async function testIntegration() {
  console.log('🧪 Testing Clerk-Supabase Integration...');
  
  // 1. Verificar que Clerk está disponible
  if (!window.Clerk) {
    console.error('❌ Clerk no está disponible en window');
    return;
  }
  
  const clerk = window.Clerk;
  
  // 2. Verificar sesión activa
  if (!clerk.session) {
    console.log('⚠️ No hay sesión activa, iniciando sesión de prueba...');
    // Aquí podrías redirigir a login
    return;
  }
  
  // 3. Crear cliente premium
  const premiumSupabase = createPremiumClient(clerk);
  
  // 4. Testear autenticación
  try {
    const token = await clerk.session.getToken({
      template: '5d74d508-85ee-4a7c-9d50-87005f9b8a90'
    });
    
    console.log('✅ Token JWT obtenido:', token ? '✓' : '✗');
    
    // 5. Testear query con RLS
    const { data: profile, error } = await premiumSupabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) {
      console.error('❌ Error en query RLS:', error.message);
    } else {
      console.log('✅ Query RLS exitosa, perfil:', profile.id);
    }
    
    // 6. Testear inserción
    const testProgress = {
      module_id: 1,
      lesson_id: 1,
      content_type: 'test',
      is_completed: true,
      score: 100
    };
    
    const { error: insertError } = await premiumSupabase
      .from('course_progress')
      .insert(testProgress);
    
    if (insertError) {
      console.error('❌ Error en inserción:', insertError.message);
    } else {
      console.log('✅ Inserción RLS exitosa');
    }
    
  } catch (error) {
    console.error('❌ Error en integración:', error);
  }
}

// Ejecutar cuando Clerk esté cargado
if (window.Clerk && window.Clerk.loaded) {
  testIntegration();
} else {
  window.addEventListener('clerk-loaded', testIntegration);
}
```

### 5.2 Testing Manual

1. **Iniciar sesión** con Clerk
2. **Verificar** que `auth.uid()` funciona:
```sql
-- En Supabase SQL Editor (como service role)
SELECT auth.uid(), * FROM course_progress LIMIT 1;
```

3. **Probar** políticas RLS:
```sql
-- Como usuario normal (vía aplicación)
INSERT INTO course_progress (user_id, module_id, lesson_id, content_type) 
VALUES ('user-uuid', 1, 1, 'test');

-- Debería fallar si user_id != auth.uid()
```

## 🚀 PASO 6: Dashboard Admin

### 6.1 Crear Vista Admin

```sql
-- Ya incluida en el schema: admin_active_users
SELECT * FROM admin_active_users;

-- Estadísticas en tiempo real
SELECT 
  COUNT(DISTINCT user_id) as active_users,
  AVG(total_learning_hours) as avg_learning_hours,
  COUNT(DISTINCT user_id) FILTER (WHERE role = 'premium_student') as premium_users
FROM admin_active_users;
```

### 6.2 Componente React para Admin

Crear `src/components/AdminDashboard.jsx`:

```javascript
import { usePremiumSupabase } from '../lib/supabase-premium-client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { supabase: premiumSupabase } = usePremiumSupabase();
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    const { data } = await premiumSupabase
      .from('admin_active_users')
      .select('*')
      .limit(50);
    
    setStats(data);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin IALab</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Usuarios Activos</h3>
            <p className="text-3xl">{stats.length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Horas Totales</h3>
            <p className="text-3xl">
              {stats.reduce((sum, user) => sum + (user.total_learning_hours || 0), 0).toFixed(1)}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Módulo Más Activo</h3>
            <p className="text-3xl">
              {stats.reduce((acc, user) => {
                acc[user.current_module] = (acc[user.current_module] || 0) + 1;
                return acc;
              }, {})}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problema 1: `auth.uid()` es null
**Solución:**
1. Verificar que el JWT Template en Clerk tenga `"sub": "{{user.id}}"`
2. Verificar que el JWKS URL en Supabase sea correcto
3. Verificar que el token se envía en cada request

### Problema 2: RLS bloquea operaciones
**Solución:**
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'course_progress';

-- Testear como service role
SET ROLE service_role;
SELECT * FROM course_progress LIMIT 1;
RESET ROLE;
```

### Problema 3: Sincronización Clerk → profiles
**Solución:** Crear trigger automático:

```sql
-- Trigger para sincronizar usuario Clerk con profiles
CREATE OR REPLACE FUNCTION sync_clerk_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, clerk_user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'clerk_user_id',
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    clerk_user_id = EXCLUDED.clerk_user_id,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_clerk_user();
```

## 📊 MONITOREO

### 1. Logs de Supabase
- **Authentication Logs**: Verificar JWT validations
- **Database Logs**: Monitorear queries RLS

### 2. Métricas de Performance
```sql
-- Query más lenta
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE query LIKE '%course_progress%'
ORDER BY mean_time DESC
LIMIT 10;

-- Uso de índices
SELECT indexrelname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public';
```

## 🎉 ¡INTEGRACIÓN COMPLETA!

### Verificación Final
1. ✅ Schema SQL ejecutado
2. ✅ Clerk JWT Template configurado
3. ✅ Supabase JWT configurado
4. ✅ Código frontend actualizado
5. ✅ Testing exitoso
6. ✅ Dashboard admin funcionando

### Próximos Pasos
1. **Migrar datos existentes** (si aplica)
2. **Configurar webhooks** Clerk → Supabase
3. **Implementar analytics** avanzado
4. **Crear reportes automáticos**

## 📞 SOPORTE

### Contactos
- **Clerk Support**: support@clerk.com
- **Supabase Support**: support@supabase.com
- **Documentación**:
  - Clerk JWT: https://clerk.com/docs/authentication/jwt-templates
  - Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

### Recursos
- [Schema SQL completo](./IALAB_PREMIUM_SAAS_SCHEMA.sql)
- [Script de testing](./scripts/test-clerk-supabase-integration.js)
- [Componente admin](./src/components/AdminDashboard.jsx)