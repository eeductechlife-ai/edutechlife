import trainingData from '../data/nico-training-data.json';

function buildInstantResponses() {
  const map = new Map();

  map.set('hola', 'Hola, soy Nico, asistente de EdutechLife. En que puedo ayudarte?');
  map.set('buenos días', 'Buenos dias, soy Nico de EdutechLife. Como puedo ayudarte?');
  map.set('buenas tardes', 'Buenas tardes, soy Nico de EdutechLife. En que te puedo asistir?');
  map.set('buenas noches', 'Buenas noches, soy Nico de EdutechLife. Que necesitas?');
  map.set('hey', 'Hey, soy Nico de EdutechLife. Listo para ayudarte?');

  trainingData.faq.forEach(item => {
    const key = item.q.toLowerCase().replace(/[¿?]/g, '').trim();
    if (key.length < 50) {
      map.set(key, item.a);
    }
  });

  const d = trainingData;
  map.set('que es edutechlife', d.company.description);
  map.set('quien es edutechlife', `Somos ${d.company.description}`);
  map.set('a que se dedican', `Nos dedicamos a: ${Object.values(d.services).map(s => s.name).join(', ')}.`);
  map.set('servicios', Object.values(d.services).map(s => `${s.name}: ${s.description}`).join('. '));
  map.set('precios', d.pricing.plans.map(p => `Plan ${p.name}: ${p.price}`).join('. '));
  map.set('cuanto cuesta', `Planes: ${d.pricing.plans.map(p => `${p.name} ${p.price}`).join(', ')}. Primera clase gratis.`);
  map.set('que es vak', d.services.diagnostico_vak.description);
  map.set('diagnostico vak', `${d.services.diagnostico_vak.description}. Es gratuito y toma 10-30 minutos.`);
  map.set('metodologia vak', `VAK significa Visual, Auditivo y Kinestesico. ${d.services.diagnostico_vak.description}`);
  map.set('stem', d.services.stem_steam.description);
  map.set('robótica', d.services.stem_steam.description);
  map.set('programacion', d.services.stem_steam.description);
  map.set('primera clase gratis', d.pricing.first_class_free ? 'Si, la primera clase es completamente gratuita y sin compromiso.' : '');
  map.set('clase gratis', d.pricing.first_class_free ? 'Si, la primera clase es completamente gratuita y sin compromiso.' : '');
  map.set('prueba gratuita', d.pricing.first_class_free ? 'Si, la primera clase es completamente gratuita y sin compromiso.' : '');
  map.set('contacto', `WhatsApp: ${d.contact.whatsapp}, Email: ${d.contact.email}, Web: ${d.contact.website}`);
  map.set('whatsapp', `Nuestro WhatsApp es ${d.contact.whatsapp}. Atendemos de lunes a sabado 8am a 8pm.`);
  map.set('edades', Object.values(d.age_groups).map(g => `${g.label}: ${g.range}`).join(', '));
  map.set('ninos', `Para ninos (${d.age_groups.kids.range}) tenemos programas especiales. ${d.services.stem_steam.description}`);
  map.set('adolescentes', `Para adolescentes (${d.age_groups.teens.range}) ofrecemos programas avanzados.`);
  map.set('presencial', d.modalities.presencial);
  map.set('online', d.modalities.online);
  map.set('hibrido', d.modalities.hibrido);
  map.set('ubicación', 'Tenemos modalidad presencial en Bogota y otras ciudades, y online desde cualquier lugar.');
  map.set('inscribirme', 'Para inscribirte necesito tu nombre y edad del estudiante. Me los puedes proporcionar?');
  map.set('como me inscribo', 'Agendamos una clase gratis, conoces nuestra metodologia, elegimos el plan ideal y comienzas.');
  map.set('gracias', 'De nada. Hay algo mas en que pueda ayudarte?');
  map.set('adios', 'Hasta luego. Que tengas un excelente dia.');
  map.set('hasta luego', 'Nos vemos. Cualquier duda, aqui estoy.');
  map.set('cancelar', d.pricing.cancellation);
  map.set('certificados', d.services.certificaciones.description);
  map.set('horarios', `${d.schedule.weekdays}: ${d.schedule.morning}, ${d.schedule.afternoon}, ${d.schedule.evening}`);
  map.set('smartboard', d.products.find(p => p.id === 'smartboard')?.description || '');
  map.set('ai lab academic', d.products.find(p => p.id === 'ai-lab-academic')?.description || '');
  map.set('automation', d.products.find(p => p.id === 'automation')?.description || '');
  map.set('consultoria', d.products.find(p => p.id === 'consultoria-b2b')?.description || '');

  return map;
}

export const INSTANT_RESPONSES = buildInstantResponses();

class LRUCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.set(key, value);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
        this.accessOrder.push(key);
      }
    } else {
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.accessOrder.shift();
        this.cache.delete(oldestKey);
      }
      this.cache.set(key, value);
      this.accessOrder.push(key);
    }
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  get size() {
    return this.cache.size;
  }

  get hitRate() {
    return this.cache.size / this.maxSize;
  }
}

export const memoryCache = new LRUCache(1000);

export function findInstantResponse(userMessage) {
  const lowerMsg = userMessage.toLowerCase().trim();
  const normalizedMsg = lowerMsg.replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim();

  if (INSTANT_RESPONSES.has(normalizedMsg)) {
    return INSTANT_RESPONSES.get(normalizedMsg);
  }

  const words = normalizedMsg.split(' ');

  for (const [key, response] of INSTANT_RESPONSES) {
    if (normalizedMsg.includes(key)) {
      return response;
    }
  }

  const searchResults = searchTrainingData(userMessage);
  if (searchResults.length > 0) {
    const result = searchResults[0];
    if (result.type === 'faq') return result.answer;
    if (result.type === 'service') return `${result.name}: ${result.description}`;
    if (result.type === 'product') return `${result.name}: ${result.description}`;
    if (result.type === 'plan') return `Plan ${result.name}: ${result.price}`;
  }

  return null;
}

export function addToCache(userMessage, response) {
  const lowerMsg = userMessage.toLowerCase().trim();
  memoryCache.set(lowerMsg, response);
}

export function getCacheStats() {
  return {
    instantResponses: INSTANT_RESPONSES.size,
    memoryCacheSize: memoryCache.size,
    memoryCacheHitRate: memoryCache.hitRate,
    totalCacheSize: INSTANT_RESPONSES.size + memoryCache.size
  };
}

export const SUGGESTED_QUESTIONS = [
  'Que es la metodologia VAK?',
  'Tienen clases de robotica?',
  'Cuanto cuesta la primera clase?',
  'Trabajan con adolescentes?',
  'Que programas ofrecen?',
  'Como me inscribo?',
  'Tienen modalidad online?',
  'Que es EdutechLife?'
];

export function initializeCache() {}

function searchTrainingData(query) {
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

export async function getNicoResponse(userMessage, userName = 'amigo', userHistory = []) {
  const startTime = Date.now();
  const lowerMsg = userMessage.toLowerCase().trim();

  const instantResponse = findInstantResponse(lowerMsg);
  if (instantResponse) {
    const personalizedResponse = instantResponse.replace(/amigo/g, userName);
    return {
      response: personalizedResponse,
      fromCache: true,
      cacheLevel: 1,
      responseTime: Date.now() - startTime
    };
  }

  const cachedResponse = memoryCache.get(lowerMsg);
  if (cachedResponse) {
    const personalizedResponse = cachedResponse.replace(/amigo/g, userName);
    return {
      response: personalizedResponse,
      fromCache: true,
      cacheLevel: 2,
      responseTime: Date.now() - startTime
    };
  }

  if (userHistory.length > 0) {
    const similarQuestions = userHistory.filter(prevMsg => {
      const prevLower = prevMsg.toLowerCase();
      const currentWords = new Set(lowerMsg.split(' '));
      const prevWords = new Set(prevLower.split(' '));
      let sharedWords = 0;
      for (const word of currentWords) {
        if (word.length > 3 && prevWords.has(word)) {
          sharedWords++;
        }
      }
      return sharedWords >= 2;
    });

    if (similarQuestions.length > 0) {
      const similarResponse = memoryCache.get(similarQuestions[0].toLowerCase());
      if (similarResponse) {
        const personalizedResponse = similarResponse.replace(/amigo/g, userName);
        memoryCache.set(lowerMsg, personalizedResponse);
        return {
          response: personalizedResponse,
          fromCache: true,
          cacheLevel: 2,
          responseTime: Date.now() - startTime
        };
      }
    }
  }

  return {
    response: null,
    fromCache: false,
    cacheLevel: 0,
    responseTime: Date.now() - startTime
  };
}

export function addResponseToCache(userMessage, response, userName = 'amigo') {
  const lowerMsg = userMessage.toLowerCase().trim();
  const personalizedResponse = response.replace(/amigo/g, userName);
  memoryCache.set(lowerMsg, personalizedResponse);
  return personalizedResponse;
}
