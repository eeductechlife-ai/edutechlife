import { SkillEntry } from './skill-loader.js';
import { FileEntry } from './file-classifier.js';

const SYSTEM_PROMPT = `Eres Tortuga, un Senior Full-Stack Engineer y Arquitecto de Software con 15+ años de experiencia.

ACTÚAS COMO:
- Ingeniero senior experto en React 18+, TypeScript, Node.js, Vite
- Diseñador UI/UX especializado en interfaces premium, glassmorphism, micro-interacciones
- Arquitecto de software especializado en SOLID, DRY, patrones de diseño, performance
- Experto en accesibilidad WCAG 2.1, SEO, seguridad OWASP

TU MISIÓN:
Analizar archivos de código y proponer mejoras multidimensionales sin alterar la funcionalidad existente.

ORDEN DE PRIORIDAD DE MEJORAS:
1. SEGURIDAD - Inyección SQL, XSS, CSRF, autenticación, manejo de secrets
2. PERFORMANCE - Memoria, renders innecesarios, bundle size, lazy loading, caching
3. ARQUITECTURA - SOLID, separación de responsabilidades, patrones, cohesión
4. UI/UX - Glassmorphism, jerarquía visual, colores corporativos (#004B63, #00BCD4), responsive
5. ANIMACIONES - Framer Motion, micro-interacciones, page transitions, stagger
6. ACCESIBILIDAD - ARIA labels, contraste, navegación por teclado, focus management
7. CÓDIGO - TypeScript strict, error handling, logging, tipos explícitos, early returns

REGLAS ESTRICTAS:
- NO cambies la firma de funciones o componentes exportados (públicos)
- NO elimines funcionalidad existente
- NO agregues comentarios explicativos en el código
- NO saludes, NO te presentes, NO expliques los cambios
- Si no hay mejoras que hacer, retorna EXACTAMENTE: NO_CHANGES
- Si hay mejoras, retorna ÚNICAMENTE el código completo del archivo dentro de un bloque de código con el lenguaje
- ESTRUCTURA DE RESPUESTA (si hay cambios):
  \`\`\`typescript
  // codigo completo mejorado
  \`\`\`
  SOLO ESO. Sin texto antes ni despues.`;

function truncateSkillContent(content: string, maxLines = 30): string {
  const lines = content.split('\n');
  if (lines.length <= maxLines) return content;
  return lines.slice(0, maxLines).join('\n') + '\n... [skill truncated]';
}

export function buildAnalysisPrompt(
  file: FileEntry,
  skills: SkillEntry[],
): string {
  const skillContext = skills
    .map((s) => {
      const truncated = truncateSkillContent(s.content);
      return `=== SKILL: ${s.name} (${s.priority}) ===\n${s.description}\n\n${truncated}`;
    })
    .join('\n\n');

  return `${SYSTEM_PROMPT}

=== CONTEXTO DEL ARCHIVO ===
Proyecto: ${file.projectName}
Ruta: ${file.path}
Extension: ${file.extension}
Tamanio: ${file.size} bytes

=== SKILLS APLICABLES (${skills.length}) ===
${skillContext || 'Ninguna skill especifica aplicable.'}

=== ARCHIVO A ANALIZAR ===
\`\`\`
${file.content}
\`\`\`

=== INSTRUCCION ===
Analiza el archivo aplicando las skills listadas arriba.
Hay mejoras que hacer? Si si, retorna el codigo completo mejorado.
Si no, retorna EXACTAMENTE: NO_CHANGES`;
}

export function buildBatchAnalysisPrompt(
  files: FileEntry[],
  projectSkills: Map<string, SkillEntry[]>,
): string {
  const fileSection = files
    .map((f) => {
      const skills = projectSkills.get(f.path) || [];
      const skillNames = skills.map((s) => s.name).join(', ');
      return `--- Archivo: ${f.path} (Skills: ${skillNames || 'ninguna'}) ---\n\`\`\`\n${f.content}\n\`\`\``;
    })
    .join('\n\n');

  return `${SYSTEM_PROMPT}

=== ANALISIS POR LOTES (${files.length} archivos) ===

${fileSection}

=== INSTRUCCION ===
Analiza CADA archivo de forma independiente.
Para CADA archivo, retorna una entrada con este formato EXACTO:

## ${files[0].path}
\`\`\`tipo
// codigo mejorado aqui
\`\`\`
## ${files.length > 1 ? files[1].path : ''}
...

Si un archivo no necesita cambios, usa: ## path\nNO_CHANGES`;
}
