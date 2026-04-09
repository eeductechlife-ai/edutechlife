import fs from 'fs';
const content = fs.readFileSync('src/components/IALab.jsx', 'utf8');
const lines = content.split('\n');

console.log("Buscando divs que no se cierran...\n");

// Buscar patrones de apertura sin cierre
const stack = [];
let lineNum = 1;

for (const line of lines) {
    // Contar divs abiertos en esta línea
    const openMatches = line.match(/<div[^>]*>/g) || [];
    const closeMatches = line.match(/<\/div>/g) || [];
    
    for (const openTag of openMatches) {
        stack.push({ line: lineNum, tag: openTag });
    }
    
    for (let i = 0; i < closeMatches.length; i++) {
        if (stack.length > 0) {
            stack.pop();
        } else {
            console.log(`Línea ${lineNum}: </div> EXTRA sin apertura`);
        }
    }
    
    lineNum++;
}

console.log(`\nDivs abiertos sin cerrar (${stack.length}):`);
stack.forEach((item, index) => {
    console.log(`  ${index + 1}. Línea ${item.line}: ${item.tag.substring(0, 50)}...`);
});

// Buscar específicamente el div containerRef
console.log("\nBuscando div containerRef...");
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('ref={containerRef}')) {
        console.log(`Línea ${i+1}: ${lines[i].trim()}`);
        // Buscar cierre
        let balance = 0;
        for (let j = i; j < lines.length; j++) {
            const open = (lines[j].match(/<div/g) || []).length;
            const close = (lines[j].match(/<\/div>/g) || []).length;
            balance += open - close;
            
            if (balance === 0 && j > i) {
                console.log(`  Se cierra en línea ${j+1}: ${lines[j].trim()}`);
                break;
            }
        }
    }
}
