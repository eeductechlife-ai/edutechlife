import fs from 'fs';
const content = fs.readFileSync('src/components/IALab.jsx', 'utf8');
const lines = content.split('\n');

console.log("Analizando estructura desde línea 640 (main)...\n");

let inMain = false;
let divStack = [];
let lineNum = 1;

for (const line of lines) {
    if (line.includes('<main')) {
        inMain = true;
        console.log(`Línea ${lineNum}: INICIO <main>`);
    }
    
    if (inMain) {
        // Contar divs
        const openDivs = (line.match(/<div[^>]*>/g) || []).length;
        const closeDivs = (line.match(/<\/div>/g) || []).length;
        
        for (let i = 0; i < openDivs; i++) {
            divStack.push({ line: lineNum, text: line.trim().substring(0, 60) });
        }
        
        for (let i = 0; i < closeDivs; i++) {
            if (divStack.length > 0) {
                const opened = divStack.pop();
                // console.log(`  Cierra div abierto en línea ${opened.line}`);
            }
        }
        
        // Mostrar estado cada 50 líneas o en cambios importantes
        if (lineNum % 50 === 0 || line.includes('</main>')) {
            console.log(`Línea ${lineNum}: Divs en stack: ${divStack.length}`);
            if (divStack.length > 0) {
                console.log(`  Último div abierto: línea ${divStack[divStack.length-1].line}`);
            }
        }
        
        if (line.includes('</main>')) {
            console.log(`\nLínea ${lineNum}: FIN </main>`);
            console.log(`Divs sin cerrar dentro del main: ${divStack.length}`);
            divStack.forEach((item, idx) => {
                console.log(`  ${idx+1}. Línea ${item.line}: ${item.text}...`);
            });
            break;
        }
    }
    
    lineNum++;
}

// También verificar el div containerRef
console.log("\n\nBuscando div containerRef...");
divStack = [];
let inContainer = false;
lineNum = 1;

for (const line of lines) {
    if (line.includes('ref={containerRef}')) {
        inContainer = true;
        console.log(`Línea ${lineNum}: INICIO containerRef`);
        divStack.push({ line: lineNum, text: 'containerRef' });
    }
    
    if (inContainer) {
        const openDivs = (line.match(/<div[^>]*>/g) || []).length;
        const closeDivs = (line.match(/<\/div>/g) || []).length;
        
        for (let i = 0; i < openDivs; i++) {
            divStack.push({ line: lineNum, text: line.trim().substring(0, 60) });
        }
        
        for (let i = 0; i < closeDivs; i++) {
            if (divStack.length > 0) {
                divStack.pop();
            }
        }
        
        // Verificar si cerramos containerRef
        if (divStack.length === 0 && lineNum > 329) {
            console.log(`Línea ${lineNum}: containerRef CERRADO`);
            inContainer = false;
        }
    }
    
    lineNum++;
}

if (divStack.length > 0) {
    console.log(`\ncontainerRef NO CERRADO. Divs en stack: ${divStack.length}`);
    console.log("Divs sin cerrar:");
    divStack.forEach((item, idx) => {
        console.log(`  ${idx+1}. Línea ${item.line}: ${item.text}...`);
    });
}
