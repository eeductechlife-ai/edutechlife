import{d as g}from"./index-Voi6mD1E.js";const N=`Eres DANI, Mentor Académico de EdutechLife. Tu tarea es analizar documentos académicos subidos por estudiantes de 8-16 años.

## INSTRUCCIONES
1. Lee el contenido del documento extraído
2. Identifica: tema principal, tipo de documento (tarea, resumen, ensayo, ejercicio), nivel de dificultad
3. Evalúa: calidad, claridad, conceptos clave
4. Genera un análisis estructurado con:
   - Título inferido del documento
   - Materia sugerida (matemáticas, lenguaje, ciencias, historia, inglés, arte, tecnología, o general)
   - Resumen del contenido (2-3 oraciones)
   - Fortalezas identificadas (2-3 puntos)
   - Áreas de mejora (2-3 sugerencias constructivas)
   - Puntuación general (1-100)
   - Dificultad estimada (básico, intermedio, avanzado)
   - 2 preguntas para guiar la tutoría

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "title": "Título inferido",
  "subject": "materia sugerida",
  "summary": "Resumen del contenido",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["mejora 1", "mejora 2"],
  "score": 85,
  "difficulty": "intermedio",
  "tutoringQuestions": ["pregunta 1?", "pregunta 2?"]
}`,I=Object.freeze(Object.defineProperty({__proto__:null,PROMPT_ANALIZAR_DOCUMENTO:N},Symbol.toStringTag,{value:"Module"})),_=`You are DANI, Academic Mentor at EdutechLife. Your task is to analyze academic documents uploaded by students aged 8-16.

## INSTRUCTIONS
1. Read the extracted document content
2. Identify: main topic, document type (assignment, summary, essay, exercise), difficulty level
3. Evaluate: quality, clarity, key concepts
4. Generate a structured analysis including:
   - Inferred document title
   - Suggested subject (math, language, science, history, English, art, technology, or general)
   - Content summary (2-3 sentences)
   - Identified strengths (2-3 points)
   - Areas for improvement (2-3 constructive suggestions)
   - Overall score (1-100)
   - Estimated difficulty (basic, intermediate, advanced)
   - 2 questions to guide tutoring

Always respond in valid JSON format with this exact structure:
{
  "title": "Inferred title",
  "subject": "suggested subject",
  "summary": "Content summary",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "score": 85,
  "difficulty": "intermediate",
  "tutoringQuestions": ["question 1?", "question 2?"]
}`,O=Object.freeze(Object.defineProperty({__proto__:null,PROMPT_ANALIZAR_DOCUMENTO:_},Symbol.toStringTag,{value:"Module"})),w=typeof window<"u"&&typeof localStorage<"u"?localStorage.getItem("edutechlife_locale"):null,k=w==="en"||w==="pt"?O:I,J=k.PROMPT_ANALIZAR_DOCUMENTO;function T(t,e){const n=t===401||t===403?"Tu sesión se cerró. Vuelve a iniciar sesión para seguir.":t===429?"Hiciste muchas preguntas seguidas. Espera un minuto y vuelve a intentarlo.":t>=500?"El servidor está ocupado. Intenta de nuevo en un momento.":"Algo salió mal. Intenta de nuevo.",a=new Error(n);return a.status=t,a.detail=e,a}function A(t){try{const e=JSON.parse(atob(t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));return e.exp?e.exp<Math.floor(Date.now()/1e3):!1}catch{return!1}}function E(){return null}function p(){if(typeof window>"u")return null;try{const t=sessionStorage.getItem("auth_token");if(t&&!A(t))return t;for(let e=0;e<localStorage.length;e++){const n=localStorage.key(e);if(n?.startsWith("sb-")&&n.endsWith("-auth-token")){const s=JSON.parse(localStorage.getItem(n)||"{}")?.access_token;if(s&&!A(s))return sessionStorage.setItem("auth_token",s),s}}return t}catch{return null}}function R(t){return(t||"").replace(/```json|```/g,"").trim()}function j(t){const e=t.search(/[[{]/);if(e===-1)return null;let n=0,a=!1,s=!1;for(let o=e;o<t.length;o++){const r=t[o];if(a){s?s=!1:r==="\\"?s=!0:r==='"'&&(a=!1);continue}if(r==='"')a=!0;else if(r==="["||r==="{")n++;else if((r==="]"||r==="}")&&(n--,n===0))return t.slice(e,o+1)}return t.slice(e)}function b(t){if(!t||typeof t!="string")return null;const e=R(t).trim();if(!e)return null;try{return JSON.parse(e)}catch{}const n=j(e);if(n){const o=[n,n.replace(/,\s*([\]}])/g,"$1"),n.replace(/,(\s*[}\]])/g,"$1")];for(const r of o)try{return JSON.parse(r)}catch{}}const a=e.search(/[{[]/);if(a>0){const o=e.substring(a);try{return JSON.parse(o)}catch{}}for(let o=e.length-1;o>=0;o--)if(e[o]==="}"||e[o]==="]"){const r=e.substring(a>=0?a:0,o+1);try{return JSON.parse(r)}catch{}}const s=e.search(/[{[]/);if(s!==-1){const o=e.substring(s),r=[];let i="",l=!1,u=!1;for(const c of o){if(i+=c,u){u=!1;continue}if(c==="\\"&&l){u=!0;continue}if(c==='"'){l=!l;continue}l||(c==="{"?r.push("}"):c==="["?r.push("]"):(c==="}"||c==="]")&&r.length&&r.pop())}for(i=i.replace(/,\s*$/,"");r.length;)i+=r.pop();try{return JSON.parse(i)}catch{}}return null}async function x(t,e=null,n=!1){const a=E()||`${g}/api/chat`;let s;if(Array.isArray(t)){const o=t,r=typeof e=="object"&&e!==null?e:{};s={messages:o,isJson:r.isJson??n,temperature:r.temperature??.7,maxTokens:r.maxTokens??2e3,model:r.model}}else s={messages:[{role:"system",content:e||`Eres NICO, asistente de EdutechLife. Responde de forma clara y concisa.
    - Saluda brevemente si es primera vez
    - Explica servicios educativos de forma simple: VAK (estilos de aprendizaje), STEM, tutorías, bienestar
    - Pregunta nombre si no lo sabes
    - Si hay interés, captura: nombre, teléfono, interés principal
    - Ofrece clase gratuita si hay interés
    - Sé natural en español, respuestas cortas pero completas`},{role:"user",content:t}],isJson:n,temperature:.5,maxTokens:500};try{const o=new AbortController,r=setTimeout(()=>o.abort(new DOMException("Timeout agotado","TimeoutError")),3e4),i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json",...p()?{Authorization:`Bearer ${p()}`}:{}},body:JSON.stringify(s),mode:"cors",credentials:"omit",signal:o.signal});if(clearTimeout(r),!i.ok){const c=await i.json().catch(()=>null),d=c?.error?.message||c?.error||i.statusText;throw new Error(`API responded with status ${i.status}${d?`: ${d}`:""}`)}const l=await i.json();if(l.error)throw new Error(l.error.message||"API returned an error");const u=s.isJson?b(l.result):l.result;if(s.isJson&&u===null){const c=new Error("La respuesta de la IA no fue un JSON válido.");throw c.raw=l.result||"",c}return!Array.isArray(t)&&!s.isJson&&u.length>500?u.substring(0,500)+"... ¿Te gustaría que profundice en algo?":u}catch(o){throw o.name==="AbortError"||o.name==="TimeoutError"?new Error("El servidor no respondió a tiempo. Intenta de nuevo."):o}}async function $(t,e={}){const n=E(),a=n?null:p();if(!n&&!a)throw new Error("Tu sesión se cerró. Vuelve a iniciar sesión para seguir.");const s={messages:t,isJson:e.isJson??!1,temperature:e.temperature??.7,maxTokens:e.maxTokens??2e3},o=async r=>{const i=new AbortController,l=setTimeout(()=>i.abort(new DOMException("Timeout agotado","TimeoutError")),3e4);try{const u=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json",...a?{Authorization:`Bearer ${a}`}:{}},body:JSON.stringify(s),mode:"cors",credentials:"omit",signal:i.signal});if(u.status===404)return{notFound:!0};if(!u.ok){const d=await u.json().catch(()=>null);if(u.status===403&&d?.error?.code==="PARENTAL_CONSENT_REQUIRED"){const m=new Error("Se requiere consentimiento parental para usar esta función.");throw m.code="PARENTAL_CONSENT_REQUIRED",m}if(u.status===503&&d?.error?.code==="CONSENT_CHECK_UNAVAILABLE"){const m=new Error("No se pudo verificar el consentimiento. Intenta de nuevo.");throw m.code="CONSENT_CHECK_UNAVAILABLE",m}const h=d?.error?.message||d?.error||u.statusText;throw T(u.status,h)}const c=await u.json();if(c.error)throw new Error(c.error);if(e.isJson){const d=b(c.result);if(d===null){const h=new Error("La respuesta de la IA no fue un JSON válido.");throw h.raw=c.result||"",h}return{value:d}}return{value:c.result}}finally{clearTimeout(l)}};try{const r=await o(n||`${g}/api/ingenia/ai`);if(!r.notFound)return r.value;const i=await o(`${g}/api/ingenia/chat`);if(i.notFound)throw new Error("El servidor no reconoce los endpoints de IA del IngenIA.");return i.value}catch(r){throw r.name==="AbortError"||r.name==="TimeoutError"?new Error("El servidor no respondió a tiempo. Intenta de nuevo."):r}}async function P(t,e=null,n=!1,a){const s=`${g}/api/chat/stream`;let o;if(Array.isArray(t)){const r=t,i=typeof e=="object"&&e!==null?e:{};return o={messages:r,isJson:i.isJson??n,temperature:i.temperature??.7,maxTokens:i.maxTokens??2e3,model:i.model},y(s,o,typeof e=="function"?e:a,i.isJson??n,i.signal,p()?{Authorization:`Bearer ${p()}`}:{})}else return o={messages:[{role:"system",content:e||null||"Eres un asistente útil."},{role:"user",content:t}],isJson:n,temperature:.75,maxTokens:1200},y(s,o,a,n,void 0,p()?{Authorization:`Bearer ${p()}`}:{})}function S(t,e,n){return new Promise((a,s)=>{const o=t.body.getReader(),r=new TextDecoder;let i="",l="";function u(){o.read().then(({done:c,value:d})=>{if(c){if(n)try{const m=JSON.parse(l.replace(/```json|```/g,"").trim());a(m)}catch{a({error:!0,message:"Failed to parse JSON"})}else a(l);return}i+=r.decode(d,{stream:!0});const h=i.split(`
`);i=h.pop()||"";for(const m of h)if(m.startsWith("data: ")){const v=m.slice(6);try{const f=JSON.parse(v);if(f.chunk)l+=f.chunk,e&&e(f.chunk);else if(f.emotionalState||f.dependencyRisk)e&&e(JSON.stringify({__emotionalState:f.emotionalState,__dependencyRisk:!!f.dependencyRisk}));else if(f.crisisAlert)e&&e(JSON.stringify({__crisisAlert:f.crisisAlert}));else if(f.error){s(new Error(`Stream error 500: ${f.error}`));return}}catch{}}u()}).catch(s)}u()})}async function y(t,e,n,a,s,o={}){return new Promise((r,i)=>{const l=new AbortController,u=setTimeout(()=>{l.abort(new Error("Timeout agotado: el servidor tardo demasiado en responder"))},6e4);s&&s.addEventListener("abort",()=>{try{l.abort(s.reason)}catch{}}),fetch(t,{method:"POST",headers:{"Content-Type":"application/json",...o},body:JSON.stringify(e),signal:l.signal}).then(c=>{if(clearTimeout(u),!c.ok)throw new Error(`HTTP ${c.status}`);return S(c,n,a)}).then(r).catch(c=>{clearTimeout(u),c.name==="AbortError"?i(new Error("El servidor no respondio a tiempo. Intenta de nuevo.")):i(c)})})}async function M(t,e,n){const a=[{role:"system",content:J},{role:"user",content:`Analiza el siguiente documento académico.

Nombre del archivo: ${e}
Materia: ${n}

Contenido extraído:
${t.substring(0,4e3)}`}];return await x(a,{temperature:.3,maxTokens:1e3,isJson:!0})}async function D(t,e={},n){let a=e.token;if(a||(a=p()),!a)throw new Error("Tu sesión se cerró. Vuelve a iniciar sesión para seguir.");const s={Authorization:`Bearer ${a}`},o=`${g}/api/ingenia/dani/chat`,r=new AbortController,i=setTimeout(()=>r.abort(new Error("Timeout agotado: el servidor tardo demasiado en responder")),6e4);e.signal&&(e.signal.aborted?r.abort():e.signal.addEventListener("abort",()=>r.abort(),{once:!0}));let l;try{l=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t),signal:r.signal})}catch(u){throw clearTimeout(i),u.name==="AbortError"&&!e.signal?.aborted?new Error("El servidor no respondio a tiempo. Intenta de nuevo."):u}if(clearTimeout(i),l.status===404){const u=[...Array.isArray(t.history)?t.history:[],{role:"user",content:t.message}];return y(`${g}/api/ingenia/chat/stream`,{messages:u,context:t.documentContext||void 0},n,!1,e.signal,s)}if(!l.ok){const c=(await l.json().catch(()=>null))?.error||l.statusText;throw T(l.status,c)}return S(l,n,!1)}async function L(t){const e=p();if(!e)throw new Error("Tu sesión se cerró. Vuelve a iniciar sesión para seguir.");const n=await fetch(`${g}/api/ingenia/videos?q=${encodeURIComponent(t)}`,{headers:{Authorization:`Bearer ${e}`}});if(n.status===501||n.status===404)return null;if(!n.ok){const s=await n.json().catch(()=>null);throw T(n.status,s?.error)}const a=await n.json();return Array.isArray(a.videos)?a.videos:[]}export{M as a,x as b,D as c,$ as d,P as e,L as f};
