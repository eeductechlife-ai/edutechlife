import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Encontrar el sidebar
const sidebarStart = content.indexOf('<aside className="w-[25%] sticky');
if (sidebarStart === -1) {
    console.log('No se encontró el sidebar');
    process.exit(1);
}

// Encontrar el cierre del sidebar
const sidebarEnd = content.indexOf('</aside>', sidebarStart);
if (sidebarEnd === -1) {
    console.log('No se encontró el cierre del sidebar');
    process.exit(1);
}

const sidebarContent = content.substring(sidebarStart, sidebarEnd + 8); // +8 para </aside>

// Analizar la estructura del sidebar
const lines = sidebarContent.split('\n');
let fixedLines = [];
let indentLevel = 0;
let inVideosSection = false;
let videoSectionDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectar inicio de sección de videos
    if (line.includes('VIDEOS DEL MÓDULO') && !inVideosSection) {
        inVideosSection = true;
        videoSectionDepth = indentLevel;
    }
    
    // Contar indentación basada en divs
    if (line.includes('<div')) {
        indentLevel++;
    }
    if (line.includes('</div')) {
        indentLevel--;
    }
    
    // Si estamos en la sección de videos y hemos vuelto al nivel original, salimos
    if (inVideosSection && indentLevel <= videoSectionDepth && line.includes('</div>')) {
        inVideosSection = false;
    }
    
    fixedLines.push(line);
}

// Reemplazar el sidebar con la versión corregida
const fixedSidebar = fixedLines.join('\n');
const newContent = content.substring(0, sidebarStart) + fixedSidebar + content.substring(sidebarEnd + 8);

// Escribir el archivo corregido
fs.writeFileSync(filePath, newContent);
console.log('Sidebar corregido');

// Contar divs para verificar
const divOpen = (newContent.match(/<div[^>]*>/g) || []).length;
const divClose = (newContent.match(/<\/div>/g) || []).length;
console.log(`Divs: ${divOpen} abiertos, ${divClose} cerrados, diferencia: ${divOpen - divClose}`);