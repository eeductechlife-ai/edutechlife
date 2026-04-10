import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Extraer solo la estructura JSX desde el return
const returnIndex = content.indexOf('return (');
if (returnIndex === -1) {
    console.log('No se encontró return');
    process.exit(1);
}

const jsxContent = content.substring(returnIndex);

// Simplificar: reemplazar contenido complejo con marcadores
let simplified = jsxContent
    // Reemplazar strings largos
    .replace(/className="[^"]*"/g, 'className="..."')
    .replace(/d="[^"]*"/g, 'd="..."')
    .replace(/{[^}]*}/g, '{...}')
    .replace(/"[^"]*"/g, '"..."')
    // Mantener estructura básica
    .replace(/<Icon[^>]*\/>/g, '<Icon />')
    .replace(/<ValerioAvatar[^>]*\/>/g, '<ValerioAvatar />');

// Escribir versión simplificada
fs.writeFileSync('/Users/home/Desktop/edutechlife/ialab_simplified.jsx', simplified);
console.log('Versión simplificada guardada en ialab_simplified.jsx');

// Analizar estructura
const lines = simplified.split('\n');
let indent = '';
let structure = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('</')) {
        indent = indent.slice(2);
    }
    
    if (line.trim().match(/^<[a-zA-Z]/) || line.includes('<>') || line.includes('</>')) {
        structure.push(indent + line.trim());
    }
    
    if (line.includes('<') && !line.includes('</') && !line.includes('/>')) {
        indent += '  ';
    }
}

console.log('\n=== ESTRUCTURA SIMPLIFICADA ===');
console.log(structure.slice(0, 100).join('\n'));