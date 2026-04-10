import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Encontrar el div ref={containerRef}
const containerRefIndex = content.indexOf('<div ref={containerRef}');
const fragmentEndIndex = content.lastIndexOf('</>');

if (containerRefIndex === -1 || fragmentEndIndex === -1) {
    console.log('No se encontró la estructura principal');
    process.exit(1);
}

// Extraer la parte antes del containerRef
const beforeContainer = content.substring(0, containerRefIndex);

// Encontrar el cierre del containerRef
let containerEnd = -1;
let depth = 0;
let inContainer = false;

const lines = content.substring(containerRefIndex).split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('<div ref={containerRef}')) {
        inContainer = true;
        depth = 1;
    } else if (inContainer) {
        // Contar divs abiertos
        const openDivs = (line.match(/<div[^>]*>/g) || []).length;
        const closeDivs = (line.match(/<\/div>/g) || []).length;
        
        depth += openDivs - closeDivs;
        
        if (depth === 0) {
            containerEnd = containerRefIndex + lines.slice(0, i + 1).join('\n').length;
            break;
        }
    }
}

if (containerEnd === -1) {
    console.log('No se pudo encontrar el cierre del containerRef');
    process.exit(1);
}

const containerContent = content.substring(containerRefIndex, containerEnd);
const afterContainer = content.substring(containerEnd, fragmentEndIndex).trim();
const afterFragment = content.substring(fragmentEndIndex + 2); // +2 para saltar </>

console.log('=== ESTRUCTURA ACTUAL ===');
console.log('1. Fragmento principal: <> ...');
console.log('2. Header (fuera del containerRef)');
console.log('3. containerRef con aside y main');
console.log('4. Elementos después del containerRef pero antes de </>:');
console.log(afterContainer.substring(0, 200) + '...');
console.log('\n=== PROBLEMA ===');
console.log('Los elementos después del containerRef (button FAB y drawer) están fuera del containerRef pero dentro del fragmento, creando elementos JSX adyacentes.');

// La solución: mover todo dentro del containerRef
const newContent = beforeContainer + containerContent + '\n' + afterContainer + '\n</>' + afterFragment;

// Escribir el archivo corregido
fs.writeFileSync(filePath + '.fixed', newContent);
console.log('\n=== ARCHIVO CORREGIDO GUARDADO COMO .fixed ===');