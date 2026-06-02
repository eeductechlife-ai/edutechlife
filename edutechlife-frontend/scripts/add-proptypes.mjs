#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IALAB_DIR = path.resolve(__dirname, '../src/components/IALab');
const EXTENSIONS = ['.jsx'];

function extractProps(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('.propTypes =') || content.includes('PropTypes.')) return null;

  let componentName = null;
  let props = [];

  const propRegex = /(?:export\s+)?(?:function|const)\s+(\w+)\s*[=:]\s*(?:\(?\s*\{([^}]*)\}\s*\)?)?\s*(?:=>|{)/g;
  let match;

  while ((match = propRegex.exec(content)) !== null) {
    const name = match[1];
    const propStr = match[2];
    if (propStr && /^[A-Z]/.test(name)) {
      componentName = name;
      props = propStr.split(',')
        .map(p => p.trim().split(':')[0].split('=')[0].trim().split(' ')[0].trim())
        .filter(p => p && p !== '' && p !== '...props' && !p.startsWith('...'));
      break;
    }
  }

  if (!componentName) {
    const defaultRegex = /export\s+default\s+function\s+(\w+)\s*\(\s*\{([^}]*)\}\s*\)/;
    const defaultMatch = defaultRegex.exec(content);
    if (defaultMatch) {
      componentName = defaultMatch[1];
      props = defaultMatch[2].split(',')
        .map(p => p.trim().split(':')[0].split('=')[0].trim().split(' ')[0].trim())
        .filter(p => p && p !== '' && p !== '...props' && !p.startsWith('...'));
    }
  }

  if (!componentName || props.length === 0) return null;
  return { componentName, props };
}

function generatePropTypes(componentName, props) {
  const propLines = props.map(p => `  ${p}: PropTypes.any`).join(',\n');
  return `
${componentName}.propTypes = {
${propLines},
};
`;
}

function processFile(filePath) {
  const result = extractProps(filePath);
  if (!result) return false;

  const { componentName, props } = result;
  const content = fs.readFileSync(filePath, 'utf-8');

  const builtIns = ['children', 'className', 'style', 'key', 'ref'];
  const customProps = props.filter(p => !builtIns.includes(p));
  if (customProps.length === 0) return false;

  const needsImport = !content.includes("import PropTypes from 'prop-types'") &&
                      !content.includes('require("prop-types")');

  let modified = content;
  if (needsImport) {
    const importRegex = /^(import\s+.*?['"]react['"]\s*)/m;
    const reactImport = modified.match(importRegex);
    if (reactImport) {
      modified = modified.replace(reactImport[0], `${reactImport[0]}\nimport PropTypes from 'prop-types';`);
    } else {
      modified = `import PropTypes from 'prop-types';\n${modified}`;
    }
  }

  const propTypesBlock = generatePropTypes(componentName, customProps);
  const exportRegex = /(export\s+default\s+\w+)/;
  const exportMatch = modified.match(exportRegex);
  if (exportMatch) {
    modified = modified.replace(exportMatch[0], `${propTypesBlock}\n${exportMatch[0]}`);
  } else {
    const lines = modified.split('\n');
    lines.splice(lines.length - 1, 0, propTypesBlock);
    modified = lines.join('\n');
  }

  fs.writeFileSync(filePath, modified, 'utf-8');
  return true;
}

function walkDir(dir) {
  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !file.name.startsWith('__') && file.name !== 'node_modules') {
      count += walkDir(fullPath);
    } else if (file.isFile() && EXTENSIONS.includes(path.extname(file.name))) {
      if (processFile(fullPath)) {
        console.log(`\u2713 ${path.relative(IALAB_DIR, fullPath)}`);
        count++;
      }
    }
  }
  return count;
}

const total = walkDir(IALAB_DIR);
console.log(`\n\u2705 PropTypes added to ${total} files`);
