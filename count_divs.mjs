import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Contar divs abiertos y cerrados
const lines = content.split('\n');
let openDivs = 0;
let closeDivs = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Contar divs abiertos
    const openMatches = line.match(/<div[^>]*>/g);
    if (openMatches) {
        openDivs += openMatches.length;
    }
    
    // Contar divs cerrados
    const closeMatches = line.match(/<\/div>/g);
    if (closeMatches) {
        closeDivs += closeMatches.length;
    }
}

console.log(`Divs abiertos: ${openDivs}`);
console.log(`Divs cerrados: ${closeDivs}`);
console.log(`Diferencia: ${openDivs - closeDivs}`);

// También contar otras etiquetas importantes
const tags = ['header', 'aside', 'main', 'button', 'svg', 'path', 'Icon', 'ValerioAvatar'];
for (const tag of tags) {
    const openTag = new RegExp(`<${tag}[^>]*>`, 'g');
    const closeTag = new RegExp(`</${tag}>`, 'g');
    
    const openMatches = content.match(openTag) || [];
    const closeMatches = content.match(closeTag) || [];
    
    if (openMatches.length !== closeMatches.length) {
        console.log(`\n${tag}:`);
        console.log(`  Abiertos: ${openMatches.length}`);
        console.log(`  Cerrados: ${closeMatches.length}`);
        console.log(`  Diferencia: ${openMatches.length - closeMatches.length}`);
    }
}