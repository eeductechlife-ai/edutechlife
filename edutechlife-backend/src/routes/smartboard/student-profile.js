const { Router } = require('express');
const supabase = require('../../db/supabase');
const { requireAuth } = require('../../middleware/auth');
const { requireVerifiedParentalConsent } = require('../../middleware/parentalConsent');

const router = Router();

const STUDENT_PROFILE_FIELDS = 'id, name, age, vak_style, school, grade, avatar_url, email';

function serializeStudentProfile(data) {
  return {
    studentId: data.id || null,
    name: data.name || null,
    age: data.age || null,
    vakStyle: data.vak_style || null,
    school: data.school || null,
    grade: data.grade || null,
    avatarUrl: data.avatar_url || null,
  };
}

async function createStudentProfile(res, userId, email) {
  const safeName = email ? email.split('@')[0] : 'Estudiante';
  const { data, error } = await supabase
    .from('students')
    .upsert(
      {
        auth_id: userId,
        name: safeName,
        email: email || null,
      },
      { onConflict: 'auth_id' },
    )
    .select(STUDENT_PROFILE_FIELDS)
    .single();

  if (error) {
    console.error('Error creating student profile:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(serializeStudentProfile(data));
}

/**
 * DELETE /api/smartboard/delete-user-data
 * Eliminar todos los datos personales del usuario autenticado (GDPR-K / COPPA / Habeas Data)
 */
router.delete('/delete-user-data', requireAuth, requireVerifiedParentalConsent, async (req, res) => {
  // La identidad SIEMPRE viene del token verificado, nunca del body (evita IDOR).
  const userId = req.userId;

  // Tablas keyed por auth id. Borrar la fila de `students` cascadea las 10 tablas
  // normalizadas (sessions, points_history, vak_results, etc.). Las tablas auxiliares
  // se borran explícitamente porque no cuelgan de students(id).
  const deletions = [
    { table: 'smartboard_kids_data', column: 'user_id' },
    { table: 'parent_consents', column: 'student_id' },
    { table: 'crisis_alerts', column: 'student_id' },
    { table: 'activity_log', column: 'user_id' },
    { table: 'students', column: 'auth_id' }, // cascada a tablas hijas
    { table: 'users', column: 'id' },
    { table: 'parent_student_links', column: 'student_user_id' },
    { table: 'parent_student_links', column: 'parent_user_id' },
  ];

  const results = {};
  let hadFatalError = false;

  for (const { table, column } of deletions) {
    try {
      const { error } = await supabase.from(table).delete().eq(column, userId);

      if (error) {
        // 42P01 = la tabla no existe en este entorno: es tolerable, se omite.
        if (error.code === '42P01') {
          results[table] = 'skipped (table not present)';
          continue;
        }
        results[table] = `error: ${error.message}`;
        hadFatalError = true;
        console.error(`[delete-user-data] Error borrando ${table}:`, error.message);
      } else {
        results[table] = 'deleted';
      }
    } catch (e) {
      results[table] = `error: ${e.message}`;
      hadFatalError = true;
      console.error(`[delete-user-data] Excepción borrando ${table}:`, e.message);
    }
  }

  if (hadFatalError) {
    return res.status(500).json({
      error: 'No se pudieron eliminar todos los datos. Intenta de nuevo o contacta soporte.',
      results,
    });
  }

  console.log(`[delete-user-data] Datos eliminados para usuario ${userId}`);
  return res.status(200).json({
    message: 'Todos tus datos han sido eliminados permanentemente.',
    results,
  });
});

router.get('/student-profile', requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const { data, error } = await supabase
      .from('students')
      .select(STUDENT_PROFILE_FIELDS)
      .eq('auth_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return createStudentProfile(res, userId, req.userEmail);
      }
      throw error;
    }

    if (!data) {
      return createStudentProfile(res, userId, req.userEmail);
    }

    res.json(serializeStudentProfile(data));
  } catch (e) {
    console.error('Error fetching student profile:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/student-profile', requireAuth, async (req, res) => {
  const userId = req.userId;
  const { name, age, vakStyle, school, grade, avatarUrl } = req.body || {};

  // Validación básica
  if (age !== undefined && (typeof age !== 'number' || age < 5 || age > 25)) {
    return res.status(400).json({ error: 'age debe ser un número entre 5 y 25' });
  }

  if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.trim().length > 80)) {
    return res.status(400).json({ error: 'name debe ser un string de 1 a 80 caracteres' });
  }

  if (avatarUrl !== undefined && avatarUrl !== null && typeof avatarUrl !== 'string') {
    return res.status(400).json({ error: 'avatarUrl debe ser un string o null' });
  }

  if (vakStyle !== undefined) {
    const VAK_STYLES = ['visual', 'auditivo', 'kinestesico', 'auditory', 'kinesthetic'];
    if (typeof vakStyle !== 'string' || !VAK_STYLES.includes(vakStyle)) {
      return res.status(400).json({ error: 'vakStyle debe ser visual, auditivo o kinestésico' });
    }
  }

  if (school && typeof school !== 'string') {
    return res.status(400).json({ error: 'school debe ser un string' });
  }

  if (grade && typeof grade !== 'string') {
    return res.status(400).json({ error: 'grade debe ser un string' });
  }

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (age !== undefined) updateData.age = age;
    if (school !== undefined) updateData.school = school;
    if (grade !== undefined) updateData.grade = grade;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    // vak_style column added by migration 040; include only if the value is provided
    if (vakStyle !== undefined) updateData.vak_style = vakStyle;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const doUpdate = async (fields) => {
      let result = await supabase
        .from('students')
        .update(fields)
        .eq('auth_id', userId)
        .select(STUDENT_PROFILE_FIELDS)
        .single();

      // Row not found → upsert (first save for this user)
      if (result.error && result.error.code === 'PGRST116') {
        result = await supabase
          .from('students')
          .upsert(
            {
              auth_id: userId,
              name: fields.name || (req.userEmail ? req.userEmail.split('@')[0] : 'Estudiante'),
              email: req.userEmail || null,
              ...fields,
            },
            { onConflict: 'auth_id' },
          )
          .select(STUDENT_PROFILE_FIELDS)
          .single();
      }
      return result;
    };

    let result = await doUpdate(updateData);

    // If vak_style column doesn't exist yet (migration 040 pending), retry without it
    if (result.error && result.error.message && result.error.message.includes('vak_style')) {
      const { vak_style, ...fieldsWithoutVak } = updateData; // eslint-disable-line no-unused-vars
      if (Object.keys(fieldsWithoutVak).length > 0) {
        result = await doUpdate(fieldsWithoutVak);
      }
    }

    if (result.error) {
      throw result.error;
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      profile: serializeStudentProfile(result.data),
    });
  } catch (e) {
    console.error('Error updating student profile:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/student-profile/avatar', requireAuth, async (req, res) => {
  const userId = req.userId;
  const { dataUrl } = req.body || {};

  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'dataUrl debe ser una imagen base64 (data:image/...)' });
  }

  const headerMatch = dataUrl.match(/^data:(image\/(png|jpeg|webp));base64,/);
  if (!headerMatch) {
    return res.status(400).json({ error: 'Formato de imagen no soportado (usa PNG, JPEG o WebP)' });
  }

  const base64Data = dataUrl.split(',')[1] || '';
  const imageBuffer = Buffer.from(base64Data, 'base64');

  if (imageBuffer.length === 0) {
    return res.status(400).json({ error: 'La imagen está vacía' });
  }

  if (imageBuffer.length > 2 * 1024 * 1024) {
    return res.status(400).json({ error: 'La imagen supera el máximo de 2MB' });
  }

  const extensions = { png: 'png', jpeg: 'jpg', webp: 'webp' };
  const ext = extensions[headerMatch[2]];

  try {
    const fileName = `student-avatars/${userId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, imageBuffer, {
        contentType: headerMatch[1],
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('students')
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq('auth_id', userId);

    if (updateError) {
      throw updateError;
    }

    res.json({ avatarUrl: publicUrlData.publicUrl });
  } catch (e) {
    console.error('Error uploading student avatar:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
