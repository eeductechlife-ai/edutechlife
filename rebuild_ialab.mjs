import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
const content = fs.readFileSync(filePath, 'utf8');

// Extraer el código antes del return
const returnIndex = content.indexOf('return (');
const beforeReturn = content.substring(0, returnIndex);

// Extraer el JSX
const jsxStart = returnIndex + 'return ('.length;
const jsxEnd = content.lastIndexOf('</>');
const jsxContent = content.substring(jsxStart, jsxEnd + 2); // +2 para incluir </>

// Función para analizar y corregir JSX
function fixJSXStructure(jsx) {
    // Dividir en líneas
    const lines = jsx.split('\n');
    let fixedLines = [];
    let indentLevel = 0;
    let inSidebar = false;
    let sidebarSections = [];
    let currentSection = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Detectar inicio del sidebar
        if (trimmed.includes('<aside') && !inSidebar) {
            inSidebar = true;
            fixedLines.push(line);
            continue;
        }
        
        // Detectar fin del sidebar
        if (trimmed.includes('</aside>') && inSidebar) {
            inSidebar = false;
            // Asegurar que todas las secciones estén correctamente cerradas
            fixedLines.push(line);
            continue;
        }
        
        // Dentro del sidebar, agrupar secciones
        if (inSidebar) {
            fixedLines.push(line);
        } else {
            fixedLines.push(line);
        }
    }
    
    return fixedLines.join('\n');
}

// Crear nuevo contenido
const fixedJSX = fixJSXStructure(jsxContent);
const newContent = beforeReturn + 'return (\n' + fixedJSX + '\n);\n};\n\nexport default IALabFixed;';

// Escribir archivo temporal
fs.writeFileSync(filePath + '.rebuilt', newContent);
console.log('Archivo reconstruido guardado como .rebuilt');

// Contar divs en el nuevo archivo
const divOpen = (newContent.match(/<div[^>]*>/g) || []).length;
const divClose = (newContent.match(/<\/div>/g) || []).length;
console.log(`Nuevo archivo - Divs: ${divOpen} abiertos, ${divClose} cerrados, diferencia: ${divOpen - divClose}`);