import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Encontrar el JSX principal
const lines = content.split('\n');
let inJSX = false;
let jsxStart = -1;
let jsxEnd = -1;

// Buscar el return ( del JSX principal
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('return (') && jsxStart === -1) {
        jsxStart = i;
        break;
    }
}

if (jsxStart === -1) {
    console.log('No se encontró el return principal');
    process.exit(1);
}

// Analizar estructura de etiquetas desde jsxStart
let tagStack = [];
let lineNumber = jsxStart + 1;

console.log('=== ANÁLISIS DE ESTRUCTURA JSX ===\n');

// Analizar línea por línea
for (let i = jsxStart; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Buscar etiquetas JSX
    const tagMatches = line.match(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)(?:\s|>)/g);
    
    if (tagMatches) {
        for (const match of tagMatches) {
            const isClosing = match.startsWith('</');
            const tagName = match.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*).*/, '$1');
            
            if (!isClosing) {
                tagStack.push({ tag: tagName, line: lineNum });
            } else {
                const lastTag = tagStack.pop();
                if (!lastTag) {
                    console.log(`⚠️  ERROR: Etiqueta de cierre sin apertura: ${match} en línea ${lineNum}`);
                } else if (lastTag.tag !== tagName) {
                    console.log(`⚠️  ERROR: Desbalance de etiquetas: esperaba </${lastTag.tag}> pero encontré </${tagName}> en línea ${lineNum}`);
                }
            }
        }
    }
    
    // Verificar fragmentos <>
    if (line.includes('<>')) {
        tagStack.push({ tag: 'Fragment', line: lineNum });
    }
    if (line.includes('</>')) {
        const lastTag = tagStack.pop();
        if (!lastTag || lastTag.tag !== 'Fragment') {
            console.log(`⚠️  ERROR: Fragmento de cierre sin apertura en línea ${lineNum}`);
        }
    }
}

console.log('\n=== RESUMEN DE ETIQUETAS ===');
console.log(`Etiquetas sin cerrar: ${tagStack.length}`);
if (tagStack.length > 0) {
    console.log('Etiquetas pendientes:');
    tagStack.forEach(tag => {
        console.log(`  - <${tag.tag}> abierta en línea ${tag.line}`);
    });
}

// Verificar específicamente el problema alrededor de la línea 1243
console.log('\n=== ANÁLISIS ESPECÍFICO LÍNEA 1243 ===');
const problematicLines = lines.slice(1240, 1250).map((line, idx) => `${1241 + idx}: ${line}`);
console.log(problematicLines.join('\n'));

// Verificar si hay elementos adyacentes problemáticos
console.log('\n=== BUSCANDO ELEMENTOS JSX ADYACENTES ===');
for (let i = 1240; i < 1250; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    
    // Verificar si una línea termina con etiqueta de cierre y la siguiente comienza con otra
    if (line.trim().endsWith('>') && nextLine && nextLine.trim().startsWith('<')) {
        const currentTag = line.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/)?.[1];
        const nextTag = nextLine.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s|>)/)?.[1];
        
        if (currentTag && nextTag) {
            console.log(`Posible elemento adyacente en líneas ${i + 1}-${i + 2}:`);
            console.log(`  Línea ${i + 1}: ${line.trim()}`);
            console.log(`  Línea ${i + 2}: ${nextLine.trim()}`);
        }
    }
}