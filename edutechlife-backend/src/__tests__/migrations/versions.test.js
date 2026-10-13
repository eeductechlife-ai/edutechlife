const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.resolve(__dirname, '../../../../supabase/migrations');
const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();

// Supabase CLI toma como versión el número antes del primer «_»: dos archivos con el
// mismo número chocan en supabase_migrations.schema_migrations (clave primaria) y
// `supabase db reset` se detiene a mitad de camino. Eso dejó en rojo «Migrations
// (fresh DB)» con la versión 082 repetida.
describe('supabase/migrations: versiones', () => {
  it('hay migraciones', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('todos los archivos empiezan por un número y un guion bajo', () => {
    const bad = files.filter((f) => !/^\d{3,}_[a-z0-9_]+\.sql$/i.test(f));
    expect(bad).toEqual([]);
  });

  it('ninguna versión se repite', () => {
    const seen = new Map();
    const duplicated = [];
    for (const f of files) {
      const version = f.split('_')[0];
      if (seen.has(version)) duplicated.push([seen.get(version), f]);
      else seen.set(version, f);
    }
    expect(duplicated).toEqual([]);
  });

  it('la semilla del catálogo de contenido corre después de crear learning_content (055)', () => {
    const idx = (name) => files.findIndex((f) => f.includes(name));
    expect(idx('content_model')).toBeGreaterThanOrEqual(0);
    expect(idx('content_library_seed')).toBeGreaterThan(idx('content_model'));
  });

  it('el backfill de 090 crea antes las columnas platform y registration_source', () => {
    const sql = fs.readFileSync(
      path.join(MIGRATIONS_DIR, files.find((f) => f.startsWith('090_'))),
      'utf8'
    );
    const addColumn = sql.indexOf('ADD COLUMN IF NOT EXISTS platform');
    const firstUse = sql.indexOf('SET platform');
    expect(addColumn).toBeGreaterThan(-1);
    expect(addColumn).toBeLessThan(firstUse);
    expect(sql).toContain('ADD COLUMN IF NOT EXISTS registration_source');
  });

  it('099 retira (sin borrar) los premios que la plataforma no puede cumplir', () => {
    const file = files.find((f) => f.startsWith('099_'));
    expect(file).toBeTruthy();
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    for (const name of ['Día Libre', 'Certificado VAK', 'Tema Oscuro']) {
      expect(sql).toContain(`'${name}'`);
    }
    expect(sql).toMatch(/SET is_active = false/);
    expect(sql).not.toMatch(/DELETE\s+FROM/i);
  });

  it('100 crea leads idempotente, con RLS, sin permisos para anon y lectura solo admin', () => {
    const file = files.find((f) => f.startsWith('100_'));
    expect(file).toBeTruthy();
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.leads');
    expect(sql).toContain('ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY');
    expect(sql).toMatch(/REVOKE ALL ON public\.leads FROM anon, authenticated/);
    expect(sql).toMatch(/CHECK \(autorizacion_datos = true\)/);
    expect(sql).toMatch(/FOR SELECT\s+TO authenticated\s+USING \(\(auth\.jwt\(\) -> 'app_metadata' ->> 'role'\) = 'admin'\)/);
    expect(sql).not.toMatch(/FOR (INSERT|UPDATE|DELETE|ALL)/);
    expect(sql).not.toMatch(/TO anon/);
  });

  it('102 permite leads sin nombre (boletín) o sin correo (con teléfono), sin perder RLS', () => {
    const file = files.find((f) => f.startsWith('102_'));
    expect(file).toBeTruthy();
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    expect(sql).toMatch(/ALTER COLUMN nombre DROP NOT NULL/);
    expect(sql).toMatch(/ALTER COLUMN email DROP NOT NULL/);
    expect(sql).toContain("CHECK (nombre IS NOT NULL OR fuente = 'boletin')");
    expect(sql).toContain('CHECK (email IS NOT NULL OR telefono IS NOT NULL)');
    expect(sql).toMatch(/IF NOT EXISTS/);
    expect(sql).not.toMatch(/DISABLE ROW LEVEL SECURITY|GRANT/);
  });
});

