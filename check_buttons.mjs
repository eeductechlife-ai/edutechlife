import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let buttonCount = 0;
let buttonCloseCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Contar botones abiertos (que no sean auto-cerrados)
    if (line.includes('<button') && !line.includes('/>')) {
        buttonCount++;
        console.log(`Botón abierto en línea ${i + 1}: ${line.trim().substring(0, 60)}...`);
    }
    
    // Contar botones cerrados
    if (line.includes('</button>')) {
        buttonCloseCount++;
    }
}

console.log(`\nResumen:`);
console.log(`Botones abiertos: ${buttonCount}`);
console.log(`Botones cerrados: ${buttonCloseCount}`);
console.log(`Diferencia: ${buttonCount - buttonCloseCount}`);

// Verificar específicamente alrededor de la línea 593
console.log(`\nContexto alrededor de línea 593:`);
for (let i = 590; i < 600; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}