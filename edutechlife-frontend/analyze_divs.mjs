import fs from 'fs';
const content = fs.readFileSync('src/components/IALab.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
let lineNumber = 1;
const issues = [];

console.log("Analizando balance de divs en IALab.jsx...\n");

for (const line of lines) {
    const openDivs = (line.match(/<div/g) || []).length;
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    
    if (openDivs > 0 || closeDivs > 0) {
        balance += openDivs;
        balance -= closeDivs;
        
        if (Math.abs(balance) > 5) {
            issues.push(`Línea ${lineNumber}: Balance=${balance} - "${line.trim()}"`);
        }
    }
    
    lineNumber++;
}

console.log(`Balance final: ${balance} (${balance > 0 ? 'FALTAN' : 'SOBRAN'} ${Math.abs(balance)} </div>)`);
console.log("\nProblemas encontrados:");
issues.forEach(issue => console.log(issue));

// También buscar patrones problemáticos
console.log("\nBuscando patrones problemáticos...");
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Buscar líneas con múltiples cierres de div
    const closeCount = (line.match(/<\/div>/g) || []).length;
    if (closeCount > 2) {
        console.log(`Línea ${i+1}: ${closeCount} </div> seguidos - "${line.trim()}"`);
    }
    
    // Buscar líneas con estructura potencialmente problemática
    if (line.includes('</main>') && (line.includes('</div>') || lines[i+1]?.includes('</div>'))) {
        console.log(`Línea ${i+1}: </main> cerca de </div> - "${line.trim()}"`);
    }
}
