# 🗄️ EJECUTAR SQL EN SUPABASE - PASO A PASO

## 📋 RESUMEN

Tienes que ejecutar **28 statements DDL** (CREATE/ALTER) manualmente en Supabase Dashboard. Aquí está el proceso paso a paso:

## 🚀 PASO 1: ACCEDER A SUPABASE DASHBOARD

1. **Abre**: https://app.supabase.com/project/srirrwpgswlnuqfgtule
2. **Inicia sesión** con tus credenciales
3. Ve a **SQL Editor** en el menú lateral

## 🚀 PASO 2: COPIAR Y EJECUTAR SQL COMPLETO

### Opción A: Ejecutar TODO de una vez (Recomendado)

1. **Abre el archivo** `IALAB_PREMIUM_SAAS_SCHEMA.sql`
2. **Selecciona TODO** el contenido (Ctrl+A / Cmd+A)
3. **Copia** (Ctrl+C / Cmd+C)
4. **Pega** en el SQL Editor de Supabase
5. **Haz clic en "Run"** (botón azul)

**Ventaja:** Ejecuta todo en una transacción, más rápido y consistente.

### Opción B: Ejecutar por partes (Si hay errores)

Si la opción A falla, ejecuta estos bloques en orden:

#### Bloque 1: Extensiones y ALTER TABLE
```sql
-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Modificar tabla profiles existente
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_violations INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_security_violation TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_learning_hours NUMERIC(10,2) DEFAULT 0;
```

#### Bloque 2: Crear tablas nuevas
```sql
-- course_progress
CREATE TABLE course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  lesson_id INT NOT NULL CHECK (lesson_id >= 1),
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'infographic', 'activity', 'exam', 'project')),
  content_id TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  score INT CHECK (score BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  attempts INT DEFAULT 0,
  last_attempt_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id, lesson_id, content_type, content_id)
);

-- certificates
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  cert_name TEXT DEFAULT 'Certificado de Especialista en IA - Edutechlife',
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  modules_completed INT DEFAULT 5 CHECK (modules_completed = 5),
  cert_number TEXT GENERATED ALWAYS AS (
    'EDL-' || EXTRACT(YEAR FROM issued_at) || '-' || LPAD(id::TEXT, 8, '0')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- quiz_attempts
CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed BOOLEAN GENERATED ALWAYS AS (score >= 70) STORED,
  answers JSONB NOT NULL,
  violated_security BOOLEAN DEFAULT FALSE,
  security_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- student_sessions
CREATE TABLE student_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  module_id INT CHECK (module_id BETWEEN 1 AND 5),
  lesson_id INT CHECK (lesson_id >= 1),
  session_duration INTERVAL GENERATED ALWAYS AS (last_active - started_at) STORED,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Bloque 3: Habilitar RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;
```

#### Bloque 4: Crear índices
```sql
-- Índices para course_progress
CREATE INDEX idx_course_progress_user_module ON course_progress(user_id, module_id) 
  INCLUDE (lesson_id, is_completed, score);
CREATE INDEX idx_course_progress_completed ON course_progress(user_id, is_completed) 
  WHERE is_completed = true;

-- Índices para quiz_attempts
CREATE INDEX idx_quiz_attempts_user_date ON quiz_attempts(user_id, created_at DESC);
CREATE INDEX idx_quiz_attempts_daily ON quiz_attempts(user_id, module_id, DATE(created_at));
CREATE INDEX idx_quiz_attempts_security ON quiz_attempts(user_id, violated_security) 
  WHERE violated_security = true;

-- Índices para profiles
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_user_id) 
  WHERE clerk_user_id IS NOT NULL;

-- Índices para student_sessions
CREATE INDEX idx_student_sessions_active ON student_sessions(user_id, last_active DESC) 
  WHERE last_active > NOW() - INTERVAL '1 hour';
CREATE INDEX idx_student_sessions_user ON student_sessions(user_id, started_at DESC);

-- Índices para certificates
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_issued ON certificates(issued_at DESC);
```

## 🚀 PASO 3: VERIFICAR EJECUCIÓN EXITOSA

Después de ejecutar el SQL, deberías ver:

### Mensajes esperados:
```
NOTICE:  ✅ Schema IALab Premium SaaS instalado exitosamente
NOTICE:  📊 Tablas creadas: profiles, course_progress, certificates, quiz_attempts, student_sessions
NOTICE:  🔒 RLS configurado: Predictive Security Shield activado
NOTICE:  ⚡ Índices optimizados para 1000 usuarios simultáneos
NOTICE:  🎓 Certificados automáticos al completar 5 módulos
```

### Verificar con query:
```sql
SELECT * FROM verify_ialab_schema();
```

**Resultado esperado:**
```
table_name       | row_count | has_rls | index_count
-----------------+-----------+---------+-------------
profiles         | X         | true    | 1
course_progress  | 0         | true    | 2
certificates     | 0         | true    | 2
quiz_attempts    | 0         | true    | 3
student_sessions | 0         | true    | 2
```

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### Error 1: "relation already exists"
**Solución:** Usar `IF NOT EXISTS` o eliminar la tabla primero:
```sql
DROP TABLE IF EXISTS course_progress CASCADE;
-- Luego ejecutar CREATE TABLE
```

### Error 2: "permission denied"
**Solución:** Asegúrate de estar usando **Service Role Key** en la conexión.

### Error 3: "function gen_random_uuid() does not exist"
**Solución:** Ejecutar primero:
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Error 4: SQL muy largo
**Solución:** Dividir en bloques como se muestra arriba.

## ✅ VERIFICACIÓN RÁPIDA

Después de ejecutar el SQL, prueba estas queries:

### 1. Verificar tablas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'course_progress', 'certificates', 'quiz_attempts', 'student_sessions')
ORDER BY table_name;
```

### 2. Verificar RLS:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 3. Verificar índices:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

## 🎯 PRÓXIMOS PASOS DESPUÉS DE EJECUTAR SQL

1. **✅ Configurar Clerk JWT Template** (ID: `5d74d508-85ee-4a7c-9d50-87005f9b8a90`)
2. **✅ Configurar Supabase JWT Settings** con JWKS URL de Clerk
3. **✅ Ejecutar test de verificación:**
   ```bash
   cd /Users/home/Desktop/edutechlife
   node scripts/quick-test.js
   ```
4. **✅ Iniciar aplicación:**
   ```bash
   cd edutechlife-frontend
   npm run dev
   ```

## 📞 SOPORTE

### Si tienes errores al ejecutar SQL:

1. **Copia el error exacto**
2. **Verifica** que estás en el proyecto correcto: `srirrwpgswlnuqfgtule`
3. **Intenta** ejecutar por bloques (Opción B)
4. **Consulta** la documentación de Supabase: https://supabase.com/docs

### Recursos:
- **SQL completo**: `IALAB_PREMIUM_SAAS_SCHEMA.sql`
- **Guía integración**: `CLERK_SUPABASE_INTEGRATION_GUIDE.md`
- **Instrucciones**: `INSTRUCCIONES_EJECUCION.md`

## ⏱️ TIEMPO ESTIMADO

- **Ejecutar SQL**: 2-5 minutos
- **Verificación**: 1-2 minutos
- **Total**: < 10 minutos

---

**🎉 ¡EJECUTA EL SQL AHORA Y CONTINÚA CON LA CONFIGURACIÓN CLERK!**