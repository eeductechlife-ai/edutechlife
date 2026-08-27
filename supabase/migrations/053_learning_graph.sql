-- Migration 053: Learning Graph — competencies + student mastery tracking
-- Idempotent: safe to run multiple times

-- ── competencies ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS competencies (
  id           text PRIMARY KEY,          -- e.g. co_matematicas_6-7_0
  country_code text NOT NULL DEFAULT 'CO',
  subject      text NOT NULL,             -- e.g. matematicas
  label        text NOT NULL,             -- e.g. Matemáticas
  grade_range  text NOT NULL,             -- e.g. 6-7
  grade_min    integer NOT NULL,
  grade_max    integer NOT NULL,
  description  text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_competencies_subject_range
  ON competencies (subject, grade_range);

CREATE INDEX IF NOT EXISTS idx_competencies_grade
  ON competencies (grade_min, grade_max);

-- ── student_competency_mastery ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_competency_mastery (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  competency_id   text NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  mastery_level   numeric(4,3) NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 1),
  practice_count  integer NOT NULL DEFAULT 0,
  last_score      numeric(4,3),
  last_practiced_at timestamptz,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, competency_id)
);

CREATE INDEX IF NOT EXISTS idx_mastery_student
  ON student_competency_mastery (student_id);

CREATE INDEX IF NOT EXISTS idx_mastery_competency
  ON student_competency_mastery (competency_id);

-- RLS
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_competency_mastery ENABLE ROW LEVEL SECURITY;

-- competencies: public read (curriculum data)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'competencies' AND policyname = 'competencies_public_read'
  ) THEN
    CREATE POLICY competencies_public_read ON competencies FOR SELECT USING (true);
  END IF;
END $$;

-- student_competency_mastery: student reads/writes own rows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'student_competency_mastery' AND policyname = 'mastery_own_select'
  ) THEN
    CREATE POLICY mastery_own_select ON student_competency_mastery
      FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'student_competency_mastery' AND policyname = 'mastery_own_upsert'
  ) THEN
    CREATE POLICY mastery_own_upsert ON student_competency_mastery
      FOR ALL USING (
        student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- ── Seed: MEN Colombia competencias ──────────────────────────────────────────
-- ON CONFLICT DO NOTHING makes this idempotent
INSERT INTO competencies (id, country_code, subject, label, grade_range, grade_min, grade_max, description)
VALUES
  ('co_matematicas_1-3_0', 'CO', 'matematicas', 'Matemáticas', '1-3', 1, 3, 'Interpreta y usa los números naturales en contextos cotidianos'),
  ('co_matematicas_1-3_1', 'CO', 'matematicas', 'Matemáticas', '1-3', 1, 3, 'Realiza operaciones básicas con naturalidad y precisión'),
  ('co_matematicas_1-3_2', 'CO', 'matematicas', 'Matemáticas', '1-3', 1, 3, 'Describe y clasifica figuras geométricas del entorno'),
  ('co_matematicas_1-3_3', 'CO', 'matematicas', 'Matemáticas', '1-3', 1, 3, 'Usa unidades de medida no estándar y estándar'),
  ('co_matematicas_4-5_0', 'CO', 'matematicas', 'Matemáticas', '4-5', 4, 5, 'Opera con fracciones y decimales en contextos reales'),
  ('co_matematicas_4-5_1', 'CO', 'matematicas', 'Matemáticas', '4-5', 4, 5, 'Calcula perímetros y áreas de figuras básicas'),
  ('co_matematicas_4-5_2', 'CO', 'matematicas', 'Matemáticas', '4-5', 4, 5, 'Lee e interpreta información estadística sencilla'),
  ('co_matematicas_4-5_3', 'CO', 'matematicas', 'Matemáticas', '4-5', 4, 5, 'Reconoce y usa proporcionalidad directa'),
  ('co_matematicas_6-7_0', 'CO', 'matematicas', 'Matemáticas', '6-7', 6, 7, 'Opera con números enteros y racionales correctamente'),
  ('co_matematicas_6-7_1', 'CO', 'matematicas', 'Matemáticas', '6-7', 6, 7, 'Plantea y resuelve ecuaciones lineales sencillas'),
  ('co_matematicas_6-7_2', 'CO', 'matematicas', 'Matemáticas', '6-7', 6, 7, 'Calcula áreas y volúmenes de figuras tridimensionales'),
  ('co_matematicas_6-7_3', 'CO', 'matematicas', 'Matemáticas', '6-7', 6, 7, 'Interpreta datos estadísticos y calcula medidas de tendencia central'),
  ('co_matematicas_8-9_0', 'CO', 'matematicas', 'Matemáticas', '8-9', 8, 9, 'Resuelve sistemas de ecuaciones lineales'),
  ('co_matematicas_8-9_1', 'CO', 'matematicas', 'Matemáticas', '8-9', 8, 9, 'Factoriza expresiones algebraicas'),
  ('co_matematicas_8-9_2', 'CO', 'matematicas', 'Matemáticas', '8-9', 8, 9, 'Interpreta y grafica funciones lineales'),
  ('co_matematicas_8-9_3', 'CO', 'matematicas', 'Matemáticas', '8-9', 8, 9, 'Aplica trigonometría básica a problemas geométricos'),
  ('co_matematicas_10-11_0', 'CO', 'matematicas', 'Matemáticas', '10-11', 10, 11, 'Analiza y grafica funciones trascendentes'),
  ('co_matematicas_10-11_1', 'CO', 'matematicas', 'Matemáticas', '10-11', 10, 11, 'Aplica derivadas a problemas de optimización'),
  ('co_matematicas_10-11_2', 'CO', 'matematicas', 'Matemáticas', '10-11', 10, 11, 'Interpreta distribuciones de probabilidad'),
  ('co_matematicas_10-11_3', 'CO', 'matematicas', 'Matemáticas', '10-11', 10, 11, 'Resuelve problemas de matemática financiera'),
  ('co_lenguaje_1-3_0', 'CO', 'lenguaje', 'Lengua Castellana', '1-3', 1, 3, 'Lee con fluidez y comprende textos apropiados para su edad'),
  ('co_lenguaje_1-3_1', 'CO', 'lenguaje', 'Lengua Castellana', '1-3', 1, 3, 'Escribe oraciones y párrafos con coherencia'),
  ('co_lenguaje_1-3_2', 'CO', 'lenguaje', 'Lengua Castellana', '1-3', 1, 3, 'Participa en conversaciones y exposiciones orales'),
  ('co_lenguaje_4-5_0', 'CO', 'lenguaje', 'Lengua Castellana', '4-5', 4, 5, 'Comprende e interpreta textos de distintos tipos'),
  ('co_lenguaje_4-5_1', 'CO', 'lenguaje', 'Lengua Castellana', '4-5', 4, 5, 'Produce textos con estructura clara y ortografía correcta'),
  ('co_lenguaje_4-5_2', 'CO', 'lenguaje', 'Lengua Castellana', '4-5', 4, 5, 'Identifica elementos literarios básicos'),
  ('co_lenguaje_6-7_0', 'CO', 'lenguaje', 'Lengua Castellana', '6-7', 6, 7, 'Lee críticamente textos de distintos géneros'),
  ('co_lenguaje_6-7_1', 'CO', 'lenguaje', 'Lengua Castellana', '6-7', 6, 7, 'Produce textos argumentativos con coherencia y cohesión'),
  ('co_lenguaje_6-7_2', 'CO', 'lenguaje', 'Lengua Castellana', '6-7', 6, 7, 'Identifica y analiza elementos de la narrativa colombiana e hispanoamericana'),
  ('co_lenguaje_8-9_0', 'CO', 'lenguaje', 'Lengua Castellana', '8-9', 8, 9, 'Construye argumentos sólidos y los sustenta con evidencia'),
  ('co_lenguaje_8-9_1', 'CO', 'lenguaje', 'Lengua Castellana', '8-9', 8, 9, 'Analiza obras literarias en su contexto histórico-cultural'),
  ('co_lenguaje_8-9_2', 'CO', 'lenguaje', 'Lengua Castellana', '8-9', 8, 9, 'Evalúa críticamente textos de medios digitales'),
  ('co_lenguaje_10-11_0', 'CO', 'lenguaje', 'Lengua Castellana', '10-11', 10, 11, 'Produce textos académicos con rigor argumentativo'),
  ('co_lenguaje_10-11_1', 'CO', 'lenguaje', 'Lengua Castellana', '10-11', 10, 11, 'Analiza literatura en perspectiva comparada'),
  ('co_lenguaje_10-11_2', 'CO', 'lenguaje', 'Lengua Castellana', '10-11', 10, 11, 'Lee con criterio textos multimodales y digitales'),
  ('co_ciencias_naturales_1-3_0', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '1-3', 1, 3, 'Observa, describe y clasifica seres vivos del entorno'),
  ('co_ciencias_naturales_1-3_1', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '1-3', 1, 3, 'Comprende ciclos naturales básicos'),
  ('co_ciencias_naturales_1-3_2', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '1-3', 1, 3, 'Identifica propiedades de la materia'),
  ('co_ciencias_naturales_4-5_0', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '4-5', 4, 5, 'Describe la célula como unidad básica de la vida'),
  ('co_ciencias_naturales_4-5_1', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '4-5', 4, 5, 'Explica los sistemas del cuerpo humano y sus funciones'),
  ('co_ciencias_naturales_4-5_2', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '4-5', 4, 5, 'Identifica tipos de energía y sus transformaciones'),
  ('co_ciencias_naturales_6-7_0', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '6-7', 6, 7, 'Explica la estructura y función celular'),
  ('co_ciencias_naturales_6-7_1', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '6-7', 6, 7, 'Comprende los principios básicos de la herencia genética'),
  ('co_ciencias_naturales_6-7_2', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '6-7', 6, 7, 'Describe las Leyes de Newton y sus aplicaciones'),
  ('co_ciencias_naturales_6-7_3', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '6-7', 6, 7, 'Analiza el flujo de energía en ecosistemas'),
  ('co_ciencias_naturales_8-9_0', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '8-9', 8, 9, 'Realiza estequiometría básica y balanceo de ecuaciones'),
  ('co_ciencias_naturales_8-9_1', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '8-9', 8, 9, 'Aplica conceptos de energía a situaciones reales'),
  ('co_ciencias_naturales_8-9_2', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '8-9', 8, 9, 'Comprende el flujo de información genética'),
  ('co_ciencias_naturales_8-9_3', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '8-9', 8, 9, 'Evalúa impactos ambientales desde la perspectiva científica'),
  ('co_ciencias_naturales_10-11_0', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '10-11', 10, 11, 'Resuelve problemas de estequiometría y equilibrio químico'),
  ('co_ciencias_naturales_10-11_1', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '10-11', 10, 11, 'Analiza fenómenos de electromagnetismo'),
  ('co_ciencias_naturales_10-11_2', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '10-11', 10, 11, 'Relaciona evolución, genética y ecología'),
  ('co_ciencias_naturales_10-11_3', 'CO', 'ciencias_naturales', 'Ciencias Naturales', '10-11', 10, 11, 'Aplica pensamiento científico a problemas socioambientales'),
  ('co_ciencias_sociales_1-3_0', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '1-3', 1, 3, 'Reconoce su rol en la familia, escuela y comunidad'),
  ('co_ciencias_sociales_1-3_1', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '1-3', 1, 3, 'Identifica Colombia en el contexto geográfico mundial'),
  ('co_ciencias_sociales_1-3_2', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '1-3', 1, 3, 'Valora la diversidad cultural colombiana'),
  ('co_ciencias_sociales_4-5_0', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '4-5', 4, 5, 'Comprende el proceso histórico de Colombia desde la colonia'),
  ('co_ciencias_sociales_4-5_1', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '4-5', 4, 5, 'Describe las regiones geográficas de Colombia'),
  ('co_ciencias_sociales_4-5_2', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '4-5', 4, 5, 'Identifica los principios de la Constitución de 1991'),
  ('co_ciencias_sociales_6-7_0', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '6-7', 6, 7, 'Ubica eventos históricos en líneas de tiempo'),
  ('co_ciencias_sociales_6-7_1', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '6-7', 6, 7, 'Interpreta mapas y datos geográficos'),
  ('co_ciencias_sociales_6-7_2', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '6-7', 6, 7, 'Comprende la organización del Estado colombiano'),
  ('co_ciencias_sociales_8-9_0', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '8-9', 8, 9, 'Analiza causas y consecuencias de conflictos históricos'),
  ('co_ciencias_sociales_8-9_1', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '8-9', 8, 9, 'Comprende la globalización y sus efectos en Colombia'),
  ('co_ciencias_sociales_8-9_2', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '8-9', 8, 9, 'Evalúa el conflicto armado colombiano desde múltiples perspectivas'),
  ('co_ciencias_sociales_10-11_0', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '10-11', 10, 11, 'Analiza modelos económicos y sus impactos sociales'),
  ('co_ciencias_sociales_10-11_1', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '10-11', 10, 11, 'Evalúa el sistema político colombiano e internacional'),
  ('co_ciencias_sociales_10-11_2', 'CO', 'ciencias_sociales', 'Ciencias Sociales', '10-11', 10, 11, 'Argumenta sobre problemáticas sociales con evidencia'),
  ('co_ingles_1-3_0', 'CO', 'ingles', 'Inglés', '1-3', 1, 3, 'Reconoce y usa vocabulario básico en inglés'),
  ('co_ingles_1-3_1', 'CO', 'ingles', 'Inglés', '1-3', 1, 3, 'Responde a instrucciones simples en inglés'),
  ('co_ingles_1-3_2', 'CO', 'ingles', 'Inglés', '1-3', 1, 3, 'Identifica palabras en contextos visuales'),
  ('co_ingles_4-5_0', 'CO', 'ingles', 'Inglés', '4-5', 4, 5, 'Se comunica en inglés con frases simples sobre temas cotidianos'),
  ('co_ingles_4-5_1', 'CO', 'ingles', 'Inglés', '4-5', 4, 5, 'Lee y comprende textos cortos en inglés'),
  ('co_ingles_4-5_2', 'CO', 'ingles', 'Inglés', '4-5', 4, 5, 'Escribe oraciones simples con estructura correcta'),
  ('co_ingles_6-7_0', 'CO', 'ingles', 'Inglés', '6-7', 6, 7, 'Describe situaciones pasadas y futuras en inglés'),
  ('co_ingles_6-7_1', 'CO', 'ingles', 'Inglés', '6-7', 6, 7, 'Lee textos de mediana complejidad'),
  ('co_ingles_6-7_2', 'CO', 'ingles', 'Inglés', '6-7', 6, 7, 'Escribe párrafos coherentes sobre temas cotidianos'),
  ('co_ingles_8-9_0', 'CO', 'ingles', 'Inglés', '8-9', 8, 9, 'Expresa y defiende opiniones en inglés'),
  ('co_ingles_8-9_1', 'CO', 'ingles', 'Inglés', '8-9', 8, 9, 'Comprende textos auténticos de nivel B1'),
  ('co_ingles_8-9_2', 'CO', 'ingles', 'Inglés', '8-9', 8, 9, 'Escribe textos formales e informales'),
  ('co_ingles_10-11_0', 'CO', 'ingles', 'Inglés', '10-11', 10, 11, 'Comprende textos académicos auténticos'),
  ('co_ingles_10-11_1', 'CO', 'ingles', 'Inglés', '10-11', 10, 11, 'Produce escritura académica en inglés'),
  ('co_ingles_10-11_2', 'CO', 'ingles', 'Inglés', '10-11', 10, 11, 'Se comunica con fluidez sobre temas complejos'),
  ('co_tecnologia_1-3_0', 'CO', 'tecnologia', 'Tecnología e Informática', '1-3', 1, 3, 'Identifica y usa herramientas tecnológicas básicas'),
  ('co_tecnologia_1-3_1', 'CO', 'tecnologia', 'Tecnología e Informática', '1-3', 1, 3, 'Navega con supervisión en internet de forma segura'),
  ('co_tecnologia_1-3_2', 'CO', 'tecnologia', 'Tecnología e Informática', '1-3', 1, 3, 'Crea productos digitales sencillos'),
  ('co_tecnologia_4-5_0', 'CO', 'tecnologia', 'Tecnología e Informática', '4-5', 4, 5, 'Usa herramientas ofimáticas para crear documentos'),
  ('co_tecnologia_4-5_1', 'CO', 'tecnologia', 'Tecnología e Informática', '4-5', 4, 5, 'Comprende algoritmos básicos y los representa'),
  ('co_tecnologia_4-5_2', 'CO', 'tecnologia', 'Tecnología e Informática', '4-5', 4, 5, 'Navega internet de forma crítica y segura'),
  ('co_tecnologia_6-7_0', 'CO', 'tecnologia', 'Tecnología e Informática', '6-7', 6, 7, 'Programa soluciones simples a problemas cotidianos'),
  ('co_tecnologia_6-7_1', 'CO', 'tecnologia', 'Tecnología e Informática', '6-7', 6, 7, 'Gestiona información digital de forma ética'),
  ('co_tecnologia_6-7_2', 'CO', 'tecnologia', 'Tecnología e Informática', '6-7', 6, 7, 'Comprende conceptos básicos de redes y seguridad'),
  ('co_tecnologia_8-9_0', 'CO', 'tecnologia', 'Tecnología e Informática', '8-9', 8, 9, 'Desarrolla programas con estructuras de datos básicas'),
  ('co_tecnologia_8-9_1', 'CO', 'tecnologia', 'Tecnología e Informática', '8-9', 8, 9, 'Crea páginas web simples con HTML/CSS'),
  ('co_tecnologia_8-9_2', 'CO', 'tecnologia', 'Tecnología e Informática', '8-9', 8, 9, 'Analiza el impacto social de las tecnologías'),
  ('co_tecnologia_10-11_0', 'CO', 'tecnologia', 'Tecnología e Informática', '10-11', 10, 11, 'Desarrolla proyectos de software funcionales'),
  ('co_tecnologia_10-11_1', 'CO', 'tecnologia', 'Tecnología e Informática', '10-11', 10, 11, 'Comprende y cuestiona el rol de la IA en la sociedad'),
  ('co_tecnologia_10-11_2', 'CO', 'tecnologia', 'Tecnología e Informática', '10-11', 10, 11, 'Crea emprendimientos tecnológicos con impacto social'),
  ('co_ciencias_sociales_economia_10-11_0', 'CO', 'ciencias_sociales_economia', 'Economía y Negocios (Grados 10-11)', '10-11', 10, 11, 'Analiza el funcionamiento del mercado y la economía'),
  ('co_ciencias_sociales_economia_10-11_1', 'CO', 'ciencias_sociales_economia', 'Economía y Negocios (Grados 10-11)', '10-11', 10, 11, 'Planea proyectos de emprendimiento básicos'),
  ('co_ciencias_sociales_economia_10-11_2', 'CO', 'ciencias_sociales_economia', 'Economía y Negocios (Grados 10-11)', '10-11', 10, 11, 'Toma decisiones financieras informadas')
ON CONFLICT (id) DO NOTHING;
