-- ============================================
-- IALAB PREMIUM SAAS SCHEMA - SUPABASE + CLERK
-- ============================================
-- Arquitectura optimizada para 1000 usuarios simultáneos
-- Integración Clerk JWT + Supabase RLS
-- ============================================

-- ============================================
-- 1. CONFIGURACIÓN INICIAL
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. ACTUALIZAR TABLA PROFILES EXISTENTE
-- ============================================

-- Añadir campos para integración Clerk y seguridad
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_violations INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_security_violation TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_learning_hours NUMERIC(10,2) DEFAULT 0;

-- Comentarios para documentación
COMMENT ON COLUMN profiles.clerk_user_id IS 'ID único del usuario en Clerk (para sincronización)';
COMMENT ON COLUMN profiles.security_violations IS 'Contador de violaciones de seguridad en quizzes';
COMMENT ON COLUMN profiles.last_security_violation IS 'Fecha de la última violación de seguridad';
COMMENT ON COLUMN profiles.last_login IS 'Último inicio de sesión del usuario';
COMMENT ON COLUMN profiles.total_learning_hours IS 'Total de horas de aprendizaje acumuladas';

-- ============================================
-- 3. TABLA COURSE_PROGRESS (CONSOLIDADA)
-- ============================================

CREATE TABLE course_progress (
  -- Identificación
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Módulo y lección (5 módulos, 24 lecciones totales)
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  lesson_id INT NOT NULL CHECK (lesson_id >= 1),
  
  -- Tipo de contenido (video, infografía, actividad, examen, proyecto)
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'infographic', 'activity', 'exam', 'project')),
  content_id TEXT,
  
  -- Estado de progreso
  is_completed BOOLEAN DEFAULT FALSE,
  score INT CHECK (score BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  
  -- Intentos y tracking
  attempts INT DEFAULT 0,
  last_attempt_date DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, module_id, lesson_id, content_type, content_id)
);

-- Comentarios
COMMENT ON TABLE course_progress IS 'Progreso consolidado del curso IA-Lab (24 lecciones totales)';
COMMENT ON COLUMN course_progress.module_id IS 'ID del módulo (1-5)';
COMMENT ON COLUMN course_progress.lesson_id IS 'ID de la lección (validación en app: módulos 1-4: 1-5, módulo 5: 1-4)';
COMMENT ON COLUMN course_progress.content_type IS 'Tipo de contenido: video, infographic, activity, exam, project';
COMMENT ON COLUMN course_progress.content_id IS 'ID específico del contenido (ej: video_1, infographic_2)';

-- ============================================
-- 4. TABLA CERTIFICATES
-- ============================================

CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Información del certificado
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  cert_name TEXT DEFAULT 'Certificado de Especialista en IA - Edutechlife',
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  modules_completed INT DEFAULT 5 CHECK (modules_completed = 5),
  
  -- Metadata
  cert_number TEXT GENERATED ALWAYS AS (
    'EDL-' || EXTRACT(YEAR FROM issued_at) || '-' || LPAD(id::TEXT, 8, '0')
  ) STORED,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

COMMENT ON TABLE certificates IS 'Certificados otorgados al completar los 5 módulos del curso';
COMMENT ON COLUMN certificates.cert_number IS 'Número único del certificado (formato: EDL-YYYY-XXXXXXXX)';

-- ============================================
-- 5. TABLA QUIZ_ATTEMPTS
-- ============================================

CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Información del quiz
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed BOOLEAN GENERATED ALWAYS AS (score >= 70) STORED,
  
  -- Respuestas y seguridad
  answers JSONB NOT NULL,
  violated_security BOOLEAN DEFAULT FALSE,
  security_details JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quiz_attempts IS 'Intentos de quiz por módulo (máximo 2 por día, 70% para aprobar)';
COMMENT ON COLUMN quiz_attempts.security_details IS 'Detalles de violaciones de seguridad (cambio de ventana, screenshots, etc.)';

-- ============================================
-- 6. TABLA STUDENT_SESSIONS
-- ============================================

CREATE TABLE student_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Tracking de sesión
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  module_id INT CHECK (module_id BETWEEN 1 AND 5),
  lesson_id INT CHECK (lesson_id >= 1),
  
  -- Duración calculada
  session_duration INTERVAL GENERATED ALWAYS AS (last_active - started_at) STORED,
  
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE student_sessions IS 'Sesiones de aprendizaje activas de estudiantes';
COMMENT ON COLUMN student_sessions.session_duration IS 'Duración calculada de la sesión';

-- ============================================
-- 7. POLÍTICAS RLS (PREDICTIVE SECURITY SHIELD)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7.1 PROFILES - Políticas
-- ============================================

-- Usuarios pueden ver solo su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuarios pueden actualizar solo su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role puede ver todos los perfiles (para admin dashboard)
CREATE POLICY "Service role can view all profiles" ON profiles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 7.2 COURSE_PROGRESS - Políticas
-- ============================================

-- Usuarios pueden ver solo su propio progreso
CREATE POLICY "Users can view own progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios pueden insertar solo su propio progreso
CREATE POLICY "Users can insert own progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar solo su propio progreso
CREATE POLICY "Users can update own progress" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role puede ver todo el progreso
CREATE POLICY "Service role can view all progress" ON course_progress
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 7.3 CERTIFICATES - Políticas
-- ============================================

-- Usuarios pueden ver solo sus propios certificados
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Solo el sistema puede insertar certificados (vía trigger)
CREATE POLICY "System can insert certificates" ON certificates
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Service role puede ver todos los certificados
CREATE POLICY "Service role can view all certificates" ON certificates
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 7.4 QUIZ_ATTEMPTS - Políticas de Seguridad Avanzada
-- ============================================

-- Usuarios pueden ver solo sus propios intentos
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Política de INSERT con verificación de seguridad predictiva
CREATE POLICY "Users can insert quiz attempts with security check" ON quiz_attempts
  FOR INSERT WITH CHECK (
    -- Verificar que el usuario sea el correcto
    auth.uid() = user_id AND
    
    -- Verificar que no esté bloqueado por violaciones de seguridad
    NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND security_violations >= 3 
      AND last_security_violation > NOW() - INTERVAL '24 hours'
    ) AND
    
    -- Verificar máximo 2 intentos diarios por módulo
    (
      SELECT COUNT(*) FROM quiz_attempts 
      WHERE user_id = auth.uid() 
      AND module_id = NEW.module_id 
      AND DATE(created_at) = CURRENT_DATE
    ) < 2
  );

-- Bloquear UPDATE en quiz_attempts (solo INSERT)
-- No se crea política de UPDATE

-- Service role puede ver todos los intentos
CREATE POLICY "Service role can view all quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 7.5 STUDENT_SESSIONS - Políticas
-- ============================================

-- Usuarios pueden ver solo sus propias sesiones
CREATE POLICY "Users can view own sessions" ON student_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios pueden insertar solo sus propias sesiones
CREATE POLICY "Users can insert own sessions" ON student_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar solo sus propias sesiones
CREATE POLICY "Users can update own sessions" ON student_sessions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role puede ver todas las sesiones
CREATE POLICY "Service role can view all sessions" ON student_sessions
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 8. ÍNDICES (OPTIMIZADOS PARA 1000 USUARIOS)
-- ============================================

-- Índices covering para queries frecuentes
CREATE INDEX idx_course_progress_user_module ON course_progress(user_id, module_id) 
  INCLUDE (lesson_id, is_completed, score);

CREATE INDEX idx_course_progress_completed ON course_progress(user_id, is_completed) 
  WHERE is_completed = true;

-- Índices para quiz_attempts (performance crítica)
CREATE INDEX idx_quiz_attempts_user_date ON quiz_attempts(user_id, created_at DESC);
CREATE INDEX idx_quiz_attempts_daily ON quiz_attempts(user_id, module_id, DATE(created_at));
CREATE INDEX idx_quiz_attempts_security ON quiz_attempts(user_id, violated_security) 
  WHERE violated_security = true;

-- Índices para búsqueda por Clerk ID
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_user_id) 
  WHERE clerk_user_id IS NOT NULL;

-- Índices para sesiones activas
CREATE INDEX idx_student_sessions_active ON student_sessions(user_id, last_active DESC) 
  WHERE last_active > NOW() - INTERVAL '1 hour';

CREATE INDEX idx_student_sessions_user ON student_sessions(user_id, started_at DESC);

-- Índices para certificados
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_issued ON certificates(issued_at DESC);

-- ============================================
-- 9. FUNCIONES SQL
-- ============================================

-- ============================================
-- 9.1 get_user_overall_progress()
-- ============================================

CREATE OR REPLACE FUNCTION get_user_overall_progress(p_user_id UUID)
RETURNS TABLE(
  completed_lessons BIGINT,
  total_lessons BIGINT,
  percentage NUMERIC(5,2),
  completed_modules INT,
  total_modules INT
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Lecciones completadas
    COUNT(*) FILTER (WHERE is_completed) as completed_lessons,
    
    -- Total de lecciones (distinct por módulo+lección)
    COUNT(DISTINCT (module_id, lesson_id)) as total_lessons,
    
    -- Porcentaje de completitud
    ROUND(
      COUNT(*) FILTER (WHERE is_completed)::NUMERIC / 
      GREATEST(COUNT(DISTINCT (module_id, lesson_id)), 1) * 100, 
      2
    ) as percentage,
    
    -- Módulos completados (todas las lecciones del módulo completadas)
    (
      SELECT COUNT(DISTINCT module_id)
      FROM (
        SELECT module_id, COUNT(DISTINCT lesson_id) as total_lessons_in_module
        FROM course_progress
        WHERE user_id = p_user_id
        GROUP BY module_id
      ) module_stats
      WHERE total_lessons_in_module = (
        CASE 
          WHEN module_id = 5 THEN 4  -- Módulo 5 tiene 4 lecciones
          ELSE 5                      -- Módulos 1-4 tienen 5 lecciones
        END
      )
    ) as completed_modules,
    
    -- Total de módulos
    5 as total_modules
  FROM course_progress
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_overall_progress IS 'Retorna el progreso global del usuario (lecciones y módulos completados)';

-- ============================================
-- 9.2 check_daily_attempts()
-- ============================================

CREATE OR REPLACE FUNCTION check_daily_attempts(p_user_id UUID, p_module_id INT)
RETURNS TABLE(
  attempts_today INT,
  can_attempt BOOLEAN,
  max_attempts INT,
  security_blocked BOOLEAN,
  block_remaining INTERVAL
) 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_security_blocked BOOLEAN;
  v_block_remaining INTERVAL;
BEGIN
  -- Verificar bloqueo por seguridad
  SELECT 
    security_violations >= 3 AND last_security_violation > NOW() - INTERVAL '24 hours',
    CASE 
      WHEN security_violations >= 3 AND last_security_violation > NOW() - INTERVAL '24 hours' 
      THEN (last_security_violation + INTERVAL '24 hours') - NOW()
      ELSE INTERVAL '0'
    END
  INTO v_security_blocked, v_block_remaining
  FROM profiles 
  WHERE id = p_user_id;
  
  RETURN QUERY
  SELECT 
    -- Intentos hoy
    COUNT(*)::INT as attempts_today,
    
    -- ¿Puede intentar? (menos de 2 intentos y no bloqueado)
    COUNT(*) < 2 AND NOT v_security_blocked as can_attempt,
    
    -- Máximo de intentos
    2 as max_attempts,
    
    -- ¿Está bloqueado por seguridad?
    v_security_blocked as security_blocked,
    
    -- Tiempo restante de bloqueo
    v_block_remaining as block_remaining
  FROM quiz_attempts
  WHERE user_id = p_user_id 
    AND module_id = p_module_id 
    AND DATE(created_at) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_daily_attempts IS 'Verifica intentos diarios de quiz y bloqueos de seguridad';

-- ============================================
-- 9.3 update_security_violation()
-- ============================================

CREATE OR REPLACE FUNCTION update_security_violation(p_user_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET 
    security_violations = security_violations + 1,
    last_security_violation = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_security_violation IS 'Incrementa el contador de violaciones de seguridad del usuario';

-- ============================================
-- 10. TRIGGERS
-- ============================================

-- ============================================
-- 10.1 Trigger: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a course_progress
CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10.2 Trigger: Auto-certificado al completar 5 módulos
-- ============================================

CREATE OR REPLACE FUNCTION auto_grant_certificate()
RETURNS TRIGGER AS $$
DECLARE
  v_modules_completed INT;
  v_avg_score NUMERIC;
  v_user_exists BOOLEAN;
BEGIN
  -- Verificar si el usuario existe
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = NEW.user_id) INTO v_user_exists;
  
  IF NOT v_user_exists THEN
    RETURN NEW;
  END IF;
  
  -- Contar módulos completados (todas las lecciones del módulo completadas)
  WITH module_completion AS (
    SELECT 
      module_id,
      COUNT(DISTINCT lesson_id) as completed_lessons,
      CASE 
        WHEN module_id = 5 THEN 4  -- Módulo 5 tiene 4 lecciones
        ELSE 5                      -- Módulos 1-4 tienen 5 lecciones
      END as total_lessons
    FROM course_progress
    WHERE user_id = NEW.user_id AND is_completed = true
    GROUP BY module_id
  )
  SELECT COUNT(*) INTO v_modules_completed
  FROM module_completion
  WHERE completed_lessons = total_lessons;
  
  -- Si completó 5 módulos y no tiene certificado
  IF v_modules_completed = 5 AND NOT EXISTS (
    SELECT 1 FROM certificates WHERE user_id = NEW.user_id
  ) THEN
    -- Calcular score promedio de módulos completados
    WITH module_scores AS (
      SELECT 
        module_id,
        AVG(score) as avg_module_score
      FROM course_progress
      WHERE user_id = NEW.user_id 
        AND is_completed = true 
        AND score IS NOT NULL
      GROUP BY module_id
      HAVING COUNT(DISTINCT lesson_id) = (
        CASE 
          WHEN module_id = 5 THEN 4
          ELSE 5
        END
      )
    )
    SELECT AVG(avg_module_score) INTO v_avg_score
    FROM module_scores;
    
    -- Insertar certificado (usando service role context)
    PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', false);
    
    INSERT INTO certificates (user_id, overall_score)
    VALUES (NEW.user_id, COALESCE(ROUND(v_avg_score), 0));
    
    -- Restaurar contexto normal
    PERFORM set_config('request.jwt.claims', NULL, false);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_certificate
  AFTER INSERT OR UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION auto_grant_certificate();

-- ============================================
-- 10.3 Trigger: Auto-update sesión de aprendizaje
-- ============================================

CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Buscar sesión activa (últimos 30 minutos)
  UPDATE student_sessions
  SET 
    last_active = NOW(),
    module_id = NEW.module_id,
    lesson_id = NEW.lesson_id
  WHERE user_id = NEW.user_id
    AND last_active > NOW() - INTERVAL '30 minutes'
  ORDER BY last_active DESC
  LIMIT 1;
  
  -- Si no hay sesión activa, crear una nueva
  IF NOT FOUND THEN
    INSERT INTO student_sessions (user_id, module_id, lesson_id)
    VALUES (NEW.user_id, NEW.module_id, NEW.lesson_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session
  AFTER INSERT OR UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

-- ============================================
-- 10.4 Trigger: Actualizar horas de aprendizaje
-- ============================================

CREATE OR REPLACE FUNCTION update_learning_hours()
RETURNS TRIGGER AS $$
DECLARE
  v_session_duration INTERVAL;
BEGIN
  -- Calcular duración de sesiones completadas (últimas 24 horas)
  SELECT SUM(session_duration) INTO v_session_duration
  FROM student_sessions
  WHERE user_id = NEW.user_id
    AND started_at > NOW() - INTERVAL '24 hours'
    AND last_active < NOW() - INTERVAL '5 minutes'; -- Sesiones terminadas
  
  -- Actualizar total de horas (convertir interval a horas)
  UPDATE profiles
  SET total_learning_hours = COALESCE(
    EXTRACT(EPOCH FROM v_session_duration) / 3600,
    0
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_learning_hours
  AFTER UPDATE ON student_sessions
  FOR EACH ROW
  WHEN (OLD.last_active IS DISTINCT FROM NEW.last_active)
  EXECUTE FUNCTION update_learning_hours();

-- ============================================
-- 11. VISTAS PARA DASHBOARD ADMIN
-- ============================================

-- Vista: Resumen de usuarios activos
CREATE OR REPLACE VIEW admin_active_users AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.last_login,
  p.total_learning_hours,
  ss.last_active,
  ss.module_id as current_module,
  ss.lesson_id as current_lesson,
  cp.percentage
FROM profiles p
LEFT JOIN student_sessions ss ON p.id = ss.user_id 
  AND ss.last_active > NOW() - INTERVAL '30 minutes'
LEFT JOIN LATERAL get_user_overall_progress(p.id) cp ON true
WHERE p.role IN ('student', 'premium_student', 'admin')
ORDER BY ss.last_active DESC NULLS LAST;

COMMENT ON VIEW admin_active_users IS 'Vista para dashboard admin: usuarios activos con progreso';

-- Vista: Estadísticas de progreso del curso
CREATE OR REPLACE VIEW admin_course_stats AS
SELECT 
  module_id,
  COUNT(DISTINCT user_id) as total_students,
  COUNT(DISTINCT user_id) FILTER (WHERE is_completed) as completed_students,
  ROUND(
    COUNT(DISTINCT user_id) FILTER (WHERE is_completed)::NUMERIC / 
    GREATEST(COUNT(DISTINCT user_id), 1) * 100, 
    2
  ) as completion_rate,
  AVG(score) FILTER (WHERE score IS NOT NULL) as avg_score
FROM course_progress
GROUP BY module_id
ORDER BY module_id;

COMMENT ON VIEW admin_course_stats IS 'Estadísticas de progreso por módulo';

-- ============================================
-- 12. SCRIPT DE VERIFICACIÓN
-- ============================================

-- Función para verificar la instalación
CREATE OR REPLACE FUNCTION verify_ialab_schema()
RETURNS TABLE(
  table_name TEXT,
  row_count BIGINT,
  has_rls BOOLEAN,
  index_count INT
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::TEXT,
    (xpath('/row/count/text()', query_to_xml(
      format('SELECT COUNT(*) as count FROM %I.%I', t.table_schema, t.table_name),
      true, false, ''
    )))[1]::text::BIGINT as row_count,
    t.is_row_level_security_enabled as has_rls,
    COUNT(DISTINCT i.indexname)::INT as index_count
  FROM information_schema.tables t
  LEFT JOIN pg_indexes i ON t.table_name = i.tablename AND t.table_schema = i.schemaname
  WHERE t.table_schema = 'public'
    AND t.table_name IN ('profiles', 'course_progress', 'certificates', 'quiz_attempts', 'student_sessions')
    AND t.table_type = 'BASE TABLE'
  GROUP BY t.table_name, t.table_schema, t.is_row_level_security_enabled
  ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION verify_ialab_schema IS 'Verifica la instalación del schema IALab';

-- ============================================
-- 13. MIGRACIÓN DE DATOS EXISTENTES (OPCIONAL)
-- ============================================

/*
-- NOTA: Solo ejecutar si existen datos en tablas antiguas
-- Descomentar y ajustar según necesidad

-- Migrar de user_progress a course_progress
INSERT INTO course_progress (user_id, module_id, lesson_id, content_type, is_completed, score, completed_at)
SELECT 
  user_id,
  module_id,
  last_lesson_id as lesson_id,
  'activity' as content_type,
  is_completed,
  score,
  CASE WHEN is_completed THEN updated_at ELSE NULL END as completed_at
FROM user_progress
WHERE NOT EXISTS (
  SELECT 1 FROM course_progress cp 
  WHERE cp.user_id = user_progress.user_id 
  AND cp.module_id = user_progress.module_id
);

-- Actualizar clerk_user_id en profiles si existe en otra tabla
UPDATE profiles p
SET clerk_user_id = uc.clerk_id
FROM user_clerk_mapping uc
WHERE p.id = uc.user_id
AND p.clerk_user_id IS NULL;
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Mensaje de éxito
DO $$ 
BEGIN
  RAISE NOTICE '✅ Schema IALab Premium SaaS instalado exitosamente';
  RAISE NOTICE '📊 Tablas creadas: profiles, course_progress, certificates, quiz_attempts, student_sessions';
  RAISE NOTICE '🔒 RLS configurado: Predictive Security Shield activado';
  RAISE NOTICE '⚡ Índices optimizados para 1000 usuarios simultáneos';
  RAISE NOTICE '🎓 Certificados automáticos al completar 5 módulos';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Para verificar: SELECT * FROM verify_ialab_schema();';
  RAISE NOTICE '👥 Para dashboard admin: SELECT * FROM admin_active_users;';
END $$;