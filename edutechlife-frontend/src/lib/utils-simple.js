/**
 * Utilidades simplificadas para shadcn/ui
 * Sin dependencias externas
 */

/**
 * Combina clases de Tailwind CSS
 * Versión ultra-simplificada para evitar problemas de dependencias
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}