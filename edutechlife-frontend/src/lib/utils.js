/**
 * Combina clases de Tailwind CSS de manera segura
 * Versión simplificada sin dependencias externas
 */
export function cn(...inputs) {
  // Filtra valores falsy y une las clases
  const classes = inputs.filter(Boolean).join(' ');
  
  // Elimina clases duplicadas (solución básica)
  const uniqueClasses = [...new Set(classes.split(' '))].join(' ');
  
  return uniqueClasses;
}