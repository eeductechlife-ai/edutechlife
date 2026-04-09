import fs from 'fs';
const content = fs.readFileSync('src/components/IALab.jsx', 'utf8');
const lines = content.split('\n');

console.log("Analizando estructura JSX del componente...\n");

// Encontrar el return
let inReturn = false;
let indentLevel = 0;
const structure = [];
let lineNum = 1;

for (const line of lines) {
    if (line.includes('return (')) {
        inReturn = true;
        console.log(`Línea ${lineNum}: INICIO return`);
    }
    
    if (inReturn) {
        // Calcular nivel de indentación
        const trimmed = line.trim();
        if (trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            indentLevel--;
        }
        
        const indent = '  '.repeat(indentLevel);
        
        // Capturar elementos importantes
        if (trimmed.startsWith('<') || trimmed.startsWith('</') || trimmed.startsWith('{/*') || trimmed === '') {
            if (trimmed.includes('<main') || trimmed.includes('</main') || 
                trimmed.includes('ref={containerRef}') || trimmed.includes('</div>')) {
                console.log(`${indent}Línea ${lineNum}: ${trimmed.substring(0, 80)}`);
            }
        }
        
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            indentLevel++;
        }
        
        if (trimmed === ');') {
            console.log(`\nLínea ${lineNum}: FIN return`);
            break;
        }
    }
    
    lineNum++;
}

// Analizar específicamente la estructura alrededor del main
console.log("\n\nAnalizando estructura alrededor del <main>...</main>:");
let foundMain = false;
lineNum = 1;

for (const line of lines) {
    if (line.includes('<main')) {
        foundMain = true;
        console.log(`\nLínea ${lineNum}: <main encontrado`);
        console.log(`  "${line.trim()}"`);
    }
    
    if (foundMain && line.includes('</main>')) {
        console.log(`\nLínea ${lineNum}: </main encontrado`);
        console.log(`  "${line.trim()}"`);
        
        // Mostrar líneas antes y después
        console.log("\nLíneas alrededor del </main>:");
        for (let i = Math.max(1, lineNum - 3); i <= Math.min(lines.length, lineNum + 3); i++) {
            const indicator = i === lineNum ? '>>> ' : '    ';
            console.log(`${indicator}${i}: ${lines[i-1].trim()}`);
        }
        break;
    }
    
    lineNum++;
}

// Verificar si hay elementos directamente después del </main>
console.log("\n\nElementos directamente después del </main>:");
foundMain = false;
lineNum = 1;

for (const line of lines) {
    if (line.includes('</main>')) {
        foundMain = true;
        // Buscar siguiente elemento no vacío
        for (let i = lineNum; i < Math.min(lines.length, lineNum + 5); i++) {
            const nextLine = lines[i].trim();
            if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('/*')) {
                console.log(`Línea ${i+1} (${i-lineNum} después): ${nextLine.substring(0, 100)}`);
            }
        }
        break;
    }
    lineNum++;
}
