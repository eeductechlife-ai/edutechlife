import trainingData from '../data/nico-training-data.json';

export const NICO_TRAINING_DATA = trainingData;

export function formatKnowledgeForPrompt() {
  const d = trainingData;
  let text = `# INFORMACIÓN DE EDUTECHLIFE\n\n`;

  text += `## Identidad\n`;
  text += `${d.company.description}\n\n`;
  text += `Problema que resuelve: ${d.company.problem}\n\n`;

  text += `## Productos\n`;
  d.products.forEach(p => {
    text += `- ${p.name}: ${p.description}\n`;
  });
  text += '\n';

  text += `## Servicios\n`;
  Object.values(d.services).forEach(s => {
    text += `- ${s.name}: ${s.description}\n`;
  });
  text += '\n';

  text += `## Modalidades\n`;
  Object.entries(d.modalities).forEach(([key, val]) => {
    text += `- ${key}: ${val}\n`;
  });
  text += '\n';

  const plan = d.pricing.plans[0];
  text += `## Precios\n`;
  text += `Primera clase: GRATIS\n`;
  d.pricing.plans.forEach(p => {
    text += `- Plan ${p.name}: ${p.price}\n`;
    p.features.forEach(f => text += `  - ${f}\n`);
  });
  text += '\n';

  text += `## Edades\n`;
  Object.values(d.age_groups).forEach(g => {
    text += `- ${g.label}: ${g.range}\n`;
  });
  text += '\n';

  text += `## Horario\n`;
  text += `${d.schedule.weekdays}: ${d.schedule.morning}, ${d.schedule.afternoon}, ${d.schedule.evening}\n\n`;

  text += `## Contacto\n`;
  text += `WhatsApp: ${d.contact.whatsapp}\n`;
  text += `Email: ${d.contact.email}\n`;
  text += `Web: ${d.contact.website}\n\n`;

  text += `## Equipo\n`;
  Object.values(d.team).forEach(t => text += `- ${t}\n`);
  text += '\n';

  text += `## Métricas\n`;
  Object.entries(d.company.metrics).forEach(([k, v]) => {
    text += `- ${k}: ${v}\n`;
  });

  return text;
}

export function searchTrainingData(query) {
  const lower = query.toLowerCase();
  const results = [];

  trainingData.faq.forEach((item, i) => {
    if (item.q.toLowerCase().includes(lower) || item.a.toLowerCase().includes(lower)) {
      results.push({ type: 'faq', question: item.q, answer: item.a, index: i });
    }
  });

  Object.values(trainingData.services).forEach(s => {
    if (s.name.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower)) {
      results.push({ type: 'service', name: s.name, description: s.description });
    }
  });

  trainingData.products.forEach(p => {
    if (p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)) {
      results.push({ type: 'product', name: p.name, description: p.description });
    }
  });

  trainingData.pricing.plans.forEach(plan => {
    if (plan.name.toLowerCase().includes(lower) || plan.features.some(f => f.toLowerCase().includes(lower))) {
      results.push({ type: 'plan', name: plan.name, price: plan.price, features: plan.features });
    }
  });

  return results;
}

export const NICO_KNOWLEDGE_BASE = formatKnowledgeForPrompt;
export default trainingData;
