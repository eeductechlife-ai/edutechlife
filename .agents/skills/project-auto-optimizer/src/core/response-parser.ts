export interface ParsedImprovement {
  originalPath: string;
  improvedCode: string | null;
  hasChanges: boolean;
  suggestedDependencies: string[];
}

export function parseLLMResponse(
  rawResponse: string,
  originalFile: { path: string; content: string },
): ParsedImprovement {
  const result: ParsedImprovement = {
    originalPath: originalFile.path,
    hasChanges: false,
    improvedCode: null,
    suggestedDependencies: [],
  };

  const trimmed = rawResponse.trim();

  if (trimmed === 'NO_CHANGES') {
    return result;
  }

  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const matches = [...trimmed.matchAll(codeBlockRegex)];

  if (matches.length > 0) {
    const code = matches[matches.length - 1][2].trim();

    if (code !== originalFile.content.trim()) {
      result.hasChanges = true;
      result.improvedCode = code;
    }
    return result;
  }

  const lineMatches = [...trimmed.matchAll(/^##\s+(.+)$/gm)];
  if (lineMatches.length > 0) {
    const sections = trimmed.split(/^##\s+.+$/m);
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i].trim();
      if (section === 'NO_CHANGES' || section === '') continue;

      const codeBlockMatch = section.match(/```(\w*)\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        const code = codeBlockMatch[2].trim();
        if (code !== originalFile.content.trim()) {
          result.hasChanges = true;
          result.improvedCode = code;
        }
        break;
      }
    }
    return result;
  }

  if (trimmed.length > 50 && trimmed !== originalFile.content.trim()) {
    result.hasChanges = true;
    result.improvedCode = trimmed;
  }

  return result;
}

export function extractDependenciesFromCode(code: string): string[] {
  const deps = new Set<string>();
  const importRegex = /from\s+['"](@?[\w-]+(?:\/[\w-]+)?)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code)) !== null) {
    const pkg = match[1];
    if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
    deps.add(pkg);
  }

  return [...deps];
}

export function parseBatchResponse(
  rawResponse: string,
  files: { path: string; content: string }[],
): Map<string, ParsedImprovement> {
  const results = new Map<string, ParsedImprovement>();
  const sections = rawResponse.split(/^##\s+/m);

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const firstNewline = trimmed.indexOf('\n');
    const filePath = firstNewline === -1 ? trimmed : trimmed.slice(0, firstNewline).trim();

    const originalFile = files.find((f) => f.path === filePath);
    if (!originalFile) continue;

    const content = firstNewline === -1 ? '' : trimmed.slice(firstNewline + 1).trim();
    const result = parseLLMResponse(content, originalFile);
    results.set(filePath, result);
  }

  for (const file of files) {
    if (!results.has(file.path)) {
      results.set(file.path, {
        originalPath: file.path,
        hasChanges: false,
        improvedCode: null,
        suggestedDependencies: [],
      });
    }
  }
  return results;
}
