#!/usr/bin/env node
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src');
const IGNORE_DIRS = new Set(['node_modules', '__tests__', '.next', 'dist', 'assets']);

const SPANISH_PATTERNS = [
  /[>]([^<]*\b(Inicio|Misiones|Materias|Progreso|Cerrar|Sesión|Contacto|Herramientas|Método|Aliados|Recursos|Laboratorio|Bienvenido|Explorar|Aprender|Diagnóstico|Contáctanos|Suscribirme|Política|Privacidad|Términos|Uso|Estudiante|Nivel|Racha|Inteligencia|Artificial|Cargando|Certificado|Completado|Pendiente|Nuevo|Plan|Premium|Coach|Guiado|Prompt|Laboratorio|Resultados|Comenzar|Continuar|Siguiente|Anterior|Volver|Salir|Cerrar|Guardar|Eliminar|Editar|Crear|Buscar|Filtrar|Ordenar|Compartir|Descargar|Imprimir|Ayuda|Tutorial|Lección|Módulo|Tema|Unidad|Clase|Curso|Taller|Seminario|Webinar|Chatear|Enviar|Recibir|Cancelar|Aceptar|Rechazar|Saltar|Omitir|Repetir|Intentar|Finalizar|Terminar|Completar)[^<]*)[<]/i,
  /[>]([^<]*\b(é|í|ó|ú|ñ|á|É|Í|Ó|Ú|Ñ|Á)[^<]*)[<]/i,
];

const findings = [];

function isIgnored(name) {
  return IGNORE_DIRS.has(name) || name.startsWith('.');
}

function scanDir(dirPath) {
  let entries;
  try {
    entries = readdirSync(dirPath);
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    let stat;
    try {
      stat = statSync(fullPath);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      if (!isIgnored(entry)) scanDir(fullPath);
    } else if (stat.isFile()) {
      const ext = extname(entry);
      if (['.jsx', '.js', '.tsx', '.ts'].includes(ext) && !entry.endsWith('.test.js') && !entry.endsWith('.spec.js')) {
        scanFile(fullPath);
      }
    }
  }
}

function scanFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relPath = relative(SRC_DIR, filePath);

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ') || trimmed.startsWith('require(')) return;

      for (const pattern of SPANISH_PATTERNS) {
        const match = line.match(pattern);
        if (match) {
          findings.push({
            file: relPath,
            line: i + 1,
            text: match[1]?.trim()?.substring(0, 120) || line.trim().substring(0, 120),
          });
          break;
        }
      }
    });
  } catch {
    // skip unreadable files
  }
}

scanDir(SRC_DIR);

if (findings.length === 0) {
  console.log('✅ No hardcoded Spanish text patterns found (false positives possible)');
} else {
  console.log(`⚠️  Found ${findings.length} potential hardcoded Spanish texts:\n`);
  const grouped = {};
  for (const f of findings) {
    if (!grouped[f.file]) grouped[f.file] = [];
    grouped[f.file].push(f);
  }
  for (const [file, hits] of Object.entries(grouped)) {
    console.log(`\n📄 ${file}:`);
    for (const h of hits) {
      console.log(`   L${h.line}: "${h.text}"`);
    }
  }
}
