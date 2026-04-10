import fs from 'fs';

const filePath = '/Users/home/Desktop/edutechlife/edutechlife-frontend/src/components/IALab.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Contar divs para verificar balance
const divOpen = (content.match(/<div[^>]*>/g) || []).length;
const divClose = (content.match(/<\/div>/g) || []).length;
console.log(`Divs: ${divOpen} abiertos, ${divClose} cerrados, diferencia: ${divOpen - divClose}`);

// Lista de correcciones a aplicar
const corrections = [
    // Corregir estructura del sidebar - área problemática
    {
        old: `                                  </div>\n                              </div>\n                          </div>\n\n                          {/* Sección: Recursos Descargables - Integrada al Sidebar */}\n                          <div className="px-2 w-full">`,
        new: `                                  </div>\n                              </div>\n                          </div>\n                      </div>\n\n                      {/* Sección: Recursos Descargables - Integrada al Sidebar */}\n                      <div className="px-2 w-full">`
    },
    // Asegurar cierre correcto del sidebar
    {
        old: `                          </div>\n                      </div>\n                  </div>\n              </aside>`,
        new: `                          </div>\n                      </div>\n                  </div>\n              </div>\n          </aside>`
    },
    // Corregir cierre final
    {
        old: `              </div>\n          </div>\n      </div>\n  </div>\n           </>\n       );\n   };`,
        new: `              </div>\n          </div>\n      </div>\n  </div>\n</div>\n</>\n);\n};`
    }
];

// Aplicar correcciones
let fixedContent = content;
for (const correction of corrections) {
    if (fixedContent.includes(correction.old)) {
        fixedContent = fixedContent.replace(correction.old, correction.new);
        console.log('Corrección aplicada');
    } else {
        console.log('No se encontró el patrón para corregir');
    }
}

// Verificar balance después de correcciones
const divOpenAfter = (fixedContent.match(/<div[^>]*>/g) || []).length;
const divCloseAfter = (fixedContent.match(/<\/div>/g) || []).length;
console.log(`Después: ${divOpenAfter} abiertos, ${divCloseAfter} cerrados, diferencia: ${divOpenAfter - divCloseAfter}`);

// Escribir archivo corregido
fs.writeFileSync(filePath, fixedContent);
console.log('Archivo corregido guardado');