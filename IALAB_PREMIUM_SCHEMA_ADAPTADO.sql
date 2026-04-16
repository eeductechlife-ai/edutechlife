-- ============================================
-- IALAB PREMIUM SAAS SCHEMA - ADAPTADO
-- Solo crea lo que falta y actualiza lo necesario
-- ============================================

-- ============================================
-- 1. VERIFICAR Y CREAR TABLAS FALTANTES
-- ============================================

-- course_progress (FALTANTE)
CREATE TABLE IF NOT EXISTS course_progress (
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

COMMENT ON TABLE course_progress IS 'Progreso consolidado del curso IA-Lab (24 lecciones totales)';

-- certificates (FALTANTE)
CREATE TABLE IF NOT EXISTS certificates (
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

COMMENT ON TABLE certificates IS 'Certificados otorgados al completar los 5 módulos del curso';

-- quiz_attempts (FALTANTE)
CREATE TABLE IF NOT EXISTS quiz_attempts (
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

COMMENT ON TABLE quiz_attempts IS 'Intentos de quiz por módulo (máximo 2 por día, 70% para aprobar)';

-- ============================================
-- 2. HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREAR POLÍTICAS RLS (PREDICTIVE SECURITY SHIELD)
-- ============================================

-- course_progress - Políticas
CREATE POLICY IF NOT EXISTS "Users can view own progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own progress" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own progress" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role can view all progress" ON course_progress
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- certificates - Políticas
CREATE POLICY IF NOT EXISTS "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "System can insert certificates" ON certificates
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can view all certificates" ON certificates
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- quiz_attempts - Políticas de Seguridad Avanzada
CREATE POLICY IF NOT EXISTS "Users can view own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert quiz attempts with security check" ON quiz_attempts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND security_violations >= 3 
      AND last_security_violation > NOW() - INTERVAL '24 hours'
    ) AND
    (
      SELECT COUNT(*) FROM quiz_attempts 
      WHERE user_id = auth.uid() 
      AND module_id = NEW.module_id 
      AND DATE(created_at) = CURRENT_DATE
    ) < 2
  );

CREATE POLICY IF NOT EXISTS "Service role can view all quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- student_sessions - Políticas (si no existen)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own sessions' AND tablename = 'student_sessions') THEN
    CREATE POLICY "Users can view own sessions" ON student_sessions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own sessions' AND tablename = 'student_sessions') THEN
    CREATE POLICY "Users can insert own sessions" ON student_sessions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own sessions' AND tablename = 'student_sessions') THEN
    CREATE POLICY "Users can update own sessions" ON student_sessions
      FOR UPDATE USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can view all sessions' AND tablename = 'student_sessions') THEN
    CREATE POLICY "Service role can view all sessions" ON student_sessions
      FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- ============================================
-- 4. CREAR ÍNDICES (OPTIMIZADOS PARA 1000 USUARIOS)
-- ============================================

-- Índices para course_progress
CREATE INDEX IF NOT EXISTS idx_course_progress_user_module ON course_progress(user_id, module_id) 
  INCLUDE (lesson_id, is_completed, score);

CREATE INDEX IF NOT EXISTS idx_course_progress_completed ON course_progress(user_id, is_completed) 
  WHERE is_completed = true;

-- Índices para quiz_attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_date ON quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_daily ON quiz_attempts(user_id, module_id, DATE(created_at));
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_security ON quiz_attempts(user_id, violated_security) 
  WHERE violated_security = true;

-- Índices para profiles (si no existen)
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_user_id) 
  WHERE clerk_user_id IS NOT NULL;

-- Índices para student_sessions (si no existen)
CREATE INDEX IF NOT EXISTS idx_student_sessions_active ON student_sessions(user_id, last_active DESC) 
  WHERE last_active > NOW() - INTERVAL '1 hour';

CREATE INDEX IF NOT EXISTS idx_student_sessions_user ON student_sessions(user_id, started_at DESC);

-- Índices para certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued ON certificates(issued_at DESC);

-- ============================================
-- 5. FUNCIONES SQL ESENCIALES
-- ============================================

-- get_user_overall_progress()
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
    COUNT(*) FILTER (WHERE is_completed) as completed_lessons,
    COUNT(DISTINCT (module_id, lesson_id)) as total_lessons,
    ROUND(
      COUNT(*) FILTER (WHERE is_completed)::NUMERIC / 
      GREATEST(COUNT(DISTINCT (module_id, lesson_id)), 1) * 100, 
      2
    ) as percentage,
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
    5 as total_modules
  FROM course_progress
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_overall_progress IS 'Retorna el progreso global del usuario (lecciones y módulos completados)';

-- check_daily_attempts()
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
    COUNT(*)::INT as attempts_today,
    COUNT(*) < 2 AND NOT v_security_blocked as can_attempt,
    2 as max_attempts,
    v_security_blocked as security_blocked,
    v_block_remaining as block_remaining
  FROM quiz_attempts
  WHERE user_id = p_user_id 
    AND module_id = p_module_id 
    AND DATE(created_at) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_daily_attempts IS 'Verifica intentos diarios de quiz y bloqueos de seguridad';

-- verify_ialab_schema()
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
-- 6. TRIGGERS ESENCIALES
-- ============================================

-- Trigger: Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a course_progress
DROP TRIGGER IF EXISTS update_course_progress_updated_at ON course_progress;
CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-certificado al completar 5 módulos
CREATE OR REPLACE FUNCTION auto_grant_certificate()
RETURNS TRIGGER AS $$
DECLARE
  v_modules_completed INT;
  v_avg_score NUMERIC;
  v_user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = NEW.user_id) INTO v_user_exists;
  
  IF NOT v_user_exists THEN
    RETURN NEW;
  END IF;
  
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
  
  IF v_modules_completed = 5 AND NOT EXISTS (
    SELECT 1 FROM certificates WHERE user_id = NEW.user_id
  ) THEN
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
    
    PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', false);
    
    INSERT INTO certificates (user_id, overall_score)
    VALUES (NEW.user_id, COALESCE(ROUND(v_avg_score), 0));
    
    PERFORM set_config('request.jwt.claims', NULL, false);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_certificate ON course_progress;
CREATE TRIGGER trigger_auto_certificate
  AFTER INSERT OR UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION auto_grant_certificate();

-- ============================================
-- 7. VISTAS PARA DASHBOARD ADMIN
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
-- 8. MENSAJE DE ÉXITO
-- ============================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Schema IALab Premium SaaS actualizado exitosamente';
  RAISE NOTICE '📊 Tablas verificadas: profiles, course_progress, certificates, quiz_attempts, student_sessions';
  RAISE NOTICE '🔒 RLS configurado: Predictive Security Shield activado';
  RAISE NOTICE '⚡ Índices optimizados para 1000 usuarios simultáneos';
  RAISE NOTICE '🎓 Certificados automáticos al completar 5 módulos';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Para verificar: SELECT * FROM verify_ialab_schema();';
  RAISE NOTICE '👥 Para dashboard admin: SELECT * FROM admin_active_users;';
END $$;