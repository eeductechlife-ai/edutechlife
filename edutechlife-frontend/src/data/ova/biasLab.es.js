import React from 'react';
import { Scale, Eye, Lock, Shield, Users, Zap } from 'lucide-react';

export const contentData = {
  intro: { title: "Introducción a la Ética en IA", text: "La inteligencia artificial ha llegado para transformar áreas como la medicina, la educación y la justicia. Pero su poder no la hace neutral. Los sistemas de IA toman decisiones que afectan a millones, y pueden ser incorrectas o injustas. Comprender esto es una competencia ciudadana urgente.", extended: "Este módulo ofrece herramientas para usar la IA con responsabilidad, reconocer riesgos y mitigar sesgos algorítmicos." },
  cap1: {
    title: "1. Fundamentos Éticos", text: "La ética de la IA estudia los valores y normas que deben guiar su diseño y uso, buscando siempre el bienestar de todas las personas.",
    principles: [
      { icon: <Scale className="w-5 h-5"/>, name: "Equidad y justicia", desc: "No debe discriminar ni favorecer a grupos específicos." },
      { icon: <Eye className="w-5 h-5"/>, name: "Transparencia", desc: "Los usuarios deben entender cómo y por qué la IA toma decisiones." },
      { icon: <Lock className="w-5 h-5"/>, name: "Privacidad", desc: "Protección de datos personales y uso con consentimiento." },
      { icon: <Shield className="w-5 h-5"/>, name: "Responsabilidad", desc: "Siempre debe haber un humano o institución responsable." },
      { icon: <Users className="w-5 h-5"/>, name: "Beneficio social", desc: "Debe mejorar el bienestar de toda la sociedad." }
    ]
  },
  cap2: {
    title: "2. Uso Adecuado de la IA", text: "El uso adecuado es un uso consciente que no reemplaza el pensamiento crítico ni la autoría intelectual.",
    dos: ["Usar IA para generar borradores y enriquecerlos con criterio propio.", "Citar explícitamente el uso de IA en trabajos académicos.", "Verificar datos en fuentes primarias para evitar alucinaciones.", "Usar la IA como tutor para ampliar el aprendizaje."],
    toolTitle: "Herramienta Destacada: NotebookLM", toolDesc: "NotebookLM es un ejemplo de cómo usar la IA de forma responsable para la investigación, permitiendo centralizar fuentes y verificar información con citas directas."
  },
  cap3: {
    title: "3. Riesgos y Desventajas", text: "Reconocer los riesgos permite usar la tecnología con mayor inteligencia y precaución.",
    risks: [
      { name: "Alucinaciones", desc: "Generación de información falsa con apariencia de verdad (ej. citas legales inexistentes)." },
      { name: "Impacto Laboral", desc: "Automatización de empleos rutinarios y necesidad de reconversión." },
      { name: "Privacidad y Vigilancia", desc: "Riesgos por reconocimiento facial y análisis de datos masivos." },
      { name: "Concentración de Poder", desc: "Decisiones globales tomadas por pocas empresas tecnológicas." }
    ],
    critical: "Dependencia Cognitiva: Delegar el pensamiento a la IA reduce la capacidad de argumentar y memorizar aprendizajes profundos."
  },
  cap4: {
    title: "4. Sesgos en la IA", text: "Los sesgos son errores sistemáticos que reflejan desigualdades históricas presentes en los datos de entrenamiento.",
    biases: [
      { name: "Sesgo de datos históricos", desc: "Refleja discriminaciones pasadas (ej. preferencia de género en empleos)." },
      { name: "Sesgo de representación", desc: "Subrepresentación de minorías (ej. errores en reconocimiento facial de piel oscura)." },
      { name: "Sesgo de automatización", desc: "Confianza excesiva en la IA sobre el criterio experto humano." },
      { name: "Sesgo cultural", desc: "Marcos culturales ajenos que ignoran perspectivas locales." }
    ]
  }
};

export const gameData = [
  { id: 1, case: "Un abogado usa IA para un juicio y presenta leyes que no existen.", concept: "Alucinación del Modelo" },
  { id: 2, case: "Un sistema de becas rechaza a candidatos solo por su código postal.", concept: "Sesgo de Datos Históricos" },
  { id: 3, case: "Un estudiante deja de leer libros porque la IA le hace todos los resúmenes.", concept: "Dependencia Cognitiva" },
  { id: 4, case: "Un banco no puede explicar por qué su algoritmo negó un préstamo.", concept: "Falta de Transparencia" },
  { id: 5, case: "Un usuario asume que la IA tiene la razón aunque contradiga su manual técnico.", concept: "Sesgo de Automatización" }
];
