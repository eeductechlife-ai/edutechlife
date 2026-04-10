import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let inSidebar = false;
let divCount = 0;
let openDivs = 0;
let closeDivs = 0;

console.log('=== CONTEO DE DIVS EN SIDEBAR (líneas 332-638) ===');

for (let i = 331; i < 638; i++) { // Líneas 332-638 (0-indexed)
    const line = lines[i];
    
    if (line.includes('<aside')) {
        inSidebar = true;
    }
    
    if (inSidebar) {
        const openMatches = line.match(/<div[^>]*>/g) || [];
        const closeMatches = line.match(/<\/div>/g) || [];
        
        openDivs += openMatches.length;
        closeDivs += closeMatches.length;
        
        if (openMatches.length > 0 || closeMatches.length > 0) {
            console.log(`Línea ${i + 1}: ${openMatches.length} abiertos, ${closeMatches.length} cerrados - ${line.trim().substring(0, 60)}...`);
        }
    }
    
    if (line.includes('</aside>')) {
        inSidebar = false;
    }
}

console.log(`\n=== RESUMEN ===`);
console.log(`Divs abiertos en sidebar: ${openDivs}`);
console.log(`Divs cerrados en sidebar: ${closeDivs}`);
console.log(`Diferencia: ${openDivs - closeDivs}`);

// Verificar estructura específica del área problemática (líneas 515-525)
console.log('\n=== ÁREA PROBLEMÁTICA (líneas 515-525) ===');
for (let i = 514; i < 525; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}