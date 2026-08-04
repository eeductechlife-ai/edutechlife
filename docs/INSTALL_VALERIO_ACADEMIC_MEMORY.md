# 🔧 Instalación - Tabla de Memoria Académica de Valerio

**Tiempo:** 2 minutos  
**Requisito:** Acceso a Supabase Dashboard  
**Riesgo:** Ninguno (es solo crear una tabla nueva)

---

## ⚡ Pasos Rápidos

### Paso 1: Abre Supabase Dashboard
1. Ve a → **https://app.supabase.com**
2. Inicia sesión con tu cuenta
3. Selecciona proyecto: **edutechlife**

### Paso 2: Abre SQL Editor
1. En el panel izquierdo, busca **SQL Editor**
2. Click en **New Query** (botón azul arriba a la derecha)

### Paso 3: Copia el SQL
Copia TODO este código:

```sql
-- Valerio Academic Memory Table
-- Stores detailed learning analytics for personalized coaching

CREATE TABLE IF NOT EXISTS valerio_academic_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  module_id INT NOT NULL,
  session_date TIMESTAMPTZ DEFAULT now(),

  -- Academic Content
  topics_covered TEXT[] DEFAULT ARRAY[]::TEXT[],
  questions_asked TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Diagnostic Data
  weak_areas TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Progress Metrics
  progress_percentage FLOAT DEFAULT 0,

  -- Recommendations
  recommended_next_steps TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Emotional/Engagement State
  student_sentiment TEXT DEFAULT 'neutral',

  -- Context References
  lesson_id INT,
  challenge_id INT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Indexes for common queries
  CONSTRAINT valid_sentiment CHECK (student_sentiment IN ('frustrated', 'confused', 'confident', 'engaged', 'neutral'))
);

-- Enable Row Level Security
ALTER TABLE valerio_academic_memory ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_valerio_academic_user_date
  ON valerio_academic_memory(user_id, session_date DESC);

CREATE INDEX IF NOT EXISTS idx_valerio_academic_user_module
  ON valerio_academic_memory(user_id, module_id);

CREATE INDEX IF NOT EXISTS idx_valerio_academic_module_date
  ON valerio_academic_memory(module_id, session_date DESC);

-- RLS Policy: Users can only see their own academic memory
CREATE POLICY "Users see own academic memory"
  ON valerio_academic_memory
  FOR ALL
  USING (
    auth.uid()::text = user_id
    OR auth.role() = 'authenticated' AND user_id = auth.uid()::text
  )
  WITH CHECK (
    auth.uid()::text = user_id
    OR auth.role() = 'authenticated' AND user_id = auth.uid()::text
  );

-- RLS Policy: Service role can insert/update for any user
CREATE POLICY "Service role full access"
  ON valerio_academic_memory
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE valerio_academic_memory IS 'Academic memory system for Valerio coaching bot. Tracks learning patterns, weak areas, sentiment, and progress for personalized recommendations.';
COMMENT ON COLUMN valerio_academic_memory.student_sentiment IS 'Emotional state: frustrated (needs motivation), confused (needs clarity), confident (going well), engaged (very motivated), neutral (normal)';
```

### Paso 4: Pega en SQL Editor
1. Haz click en el área de texto del SQL Editor
2. Limpia lo que haya
3. Pega el código completo

### Paso 5: Ejecuta
1. Click en botón **"Run"** (esquina inferior derecha)
2. Espera 2-3 segundos
3. Deberías ver un mensaje verde: ✅ **Successfully executed**

---

## ✅ Verificación

Después de ejecutar, verifica que todo funcionó:

### En Supabase Dashboard:
1. Ve a **Table Editor** (lado izquierdo)
2. Busca tabla: **valerio_academic_memory**
3. Debería aparecer en la lista

### Query de verificación (opcional):
En SQL Editor, corre esta query:

```sql
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_name = 'valerio_academic_memory';
```

Debería devolver:
```
table_name
valerio_academic_memory
```

---

## 🎯 Qué se creó

| Recurso | Detalles |
|---------|----------|
| **Tabla** | `valerio_academic_memory` |
| **Columnas** | 15 (académicas + timestamps) |
| **Índices** | 3 (para performance) |
| **RLS Policies** | 2 (seguridad) |
| **Constraints** | 1 (validación de sentimientos) |

---

## 🚀 Ahora qué

**La tabla está lista.** El código React ya está integrado:

✅ Cuando students usen Valerio:
- Las sesiones se guardarán automáticamente
- Valerio aprenderá de cada estudiante
- Los prompts se personalizarán

✅ Próxima sesión de un estudiante:
- Valerio sabrá qué temas domina
- Sabrá dónde tiene dificultad
- Adaptará el tono según sentimientos previos

---

## 🐛 Si algo falla

### Error: "Relation "valerio_academic_memory" already exists"
**Significa:** La tabla ya estaba creada  
**Solución:** Eso está bien, solo continuamos

### Error: "permission denied for schema public"
**Significa:** No tienes permisos  
**Solución:** Contacta a admin, necesitas rol `developer` o superior en Supabase

### No ves botón "Run"
**Significa:** Interfaz de Supabase cambió  
**Solución:** Busca botón verde/azul con ▶ o "Execute" en la esquina

---

## 📊 Qué puedes hacer ahora

### Ver datos guardados:
```sql
SELECT * FROM valerio_academic_memory 
WHERE user_id = 'USER_ID_AQUI' 
ORDER BY session_date DESC;
```

### Ver tópicos más comunes:
```sql
SELECT unnest(topics_covered) as topic, COUNT(*) as freq
FROM valerio_academic_memory
GROUP BY topic
ORDER BY freq DESC;
```

### Ver estudiantes por sentimiento:
```sql
SELECT student_sentiment, COUNT(*) as students
FROM valerio_academic_memory
GROUP BY student_sentiment;
```

---

## ✨ Listo

**Tabla instalada ✅**

Ahora Valerio es:
- 📚 Más inteligente (recuerda estudiantes)
- 🎯 Más preciso (personalizado)
- 💪 Más poderoso (académica profunda)

---

**Creado:** 3 de agosto de 2026  
**Estado:** Listo para copiar/pegar
