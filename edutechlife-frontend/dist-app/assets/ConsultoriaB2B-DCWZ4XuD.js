const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/html2pdf-DxV2vAFK.js","assets/index-BZLi2btq.js","assets/html2canvas-DNewCeMj.js","assets/index-ClvGaLH5.css"])))=>i.map(i=>d[i]);
import{d as Q,ch as d,c7 as e,bs as U,d3 as Y}from"./index-BZLi2btq.js";import _ from"./purify.es-BqTVWmGj.js";import{f as z}from"./marked.esm-b-aTVWVa.js";import{e as Z}from"./api-BJfXnk1Y.js";import{s as ee}from"./synthesis-EmAfgSUn.js";import{i as ae}from"./speechRecognition-CtpArLzd.js";import{s as te,P as se}from"./legacy-DHUgl8o3.js";const oe=(r,{attempts:t=3,backoff:s="exponential",onRetry:o}={})=>async(...n)=>{let m;for(let l=0;l<t;l++)try{return await r(...n)}catch(c){if(m=c,c.name==="AbortError"||l===t-1)throw c;o&&o(c,l+1);const y=s==="exponential"?1e3*Math.pow(2,l):1e3;await new Promise(f=>setTimeout(f,y))}throw m},O=new Map,re=(r,{key:t}={})=>async(...s)=>{const o=t?t(...s):JSON.stringify(s);if(O.has(o))return O.get(o);const n=r(...s).finally(()=>O.delete(o));return O.set(o,n),n},ie=`${Q}/api/chat`,ne='Eres MAX, el tutor experto de Edutechlife. Evalúa el prompt del alumno. Debes responder estrictamente en formato JSON con estas llaves: "score" (0-100), "feedback" (3 consejos breves), "improvedPrompt" (el prompt optimizado) y "level" (Novato, Pro, Maestro). Responde únicamente con JSON válido, sin texto adicional.',L={1:{title:"Ingeniería de Prompts",criteria:["Claridad en la instrucción","Contexto proporcionado","Especificidad de la tarea","Uso de técnicas avanzadas (CoT, Few-shot)"]},2:{title:"Potencia ChatGPT",criteria:["Optimización de System Prompts","Uso de GPTs personalizados","Function Calling efectivo","Integración con herramientas externas"]},3:{title:"Gemini Deep Research",criteria:["Razonamiento multimodal","Calidad de investigación","Fact-checking y validación","Profundidad del análisis"]},4:{title:"Notebook LM Mastery",criteria:["Curaduría de fuentes","Síntesis de conocimiento","Audio Overviews efectivos","Gestión documental"]},5:{title:"Examen Final Integrador",criteria:["Integración de herramientas","Innovación de la solución","Viabilidad del proyecto","Calidad de presentación"]}},le={NOVICE:"Novato",PRO:"Pro",MASTER:"Maestro"},de=r=>L[r]||L[1],ce=(r,t)=>{const s=de(t);return`
Evalúa el siguiente prompt de un estudiante de Edutechlife.

MÓDULO: ${s.title}
CRITERIOS DE EVALUACIÓN:
${s.criteria.map((o,n)=>`${n+1}. ${o}`).join(`
`)}

PROMPT DEL ALUMNO:
---
${r}
---

IMPORTANTE: Responde ÚNICAMENTE con JSON válido en este formato exacto:
{
  "score": número entre 0 y 100,
  "feedback": ["consejo 1", "consejo 2", "consejo 3"],
  "improvedPrompt": "versión optimizada del prompt",
  "level": "Novato" | "Pro" | "Maestro"
}
`},pe=async(r,t=1)=>{if(!r||r.trim().length===0)return{success:!1,error:"El prompt no puede estar vacío"};const s=ce(r,t);try{const o=await fetch(ie,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"deepseek-flash",messages:[{role:"system",content:ne},{role:"user",content:s}],temperature:.7,max_tokens:2e3,isJson:!0})});if(!o.ok){const c=await o.json();throw new Error(c.error?.message||`API error: ${o.status}`)}const n=await o.json(),m=n.result||n.choices?.[0]?.message?.content;if(!m)throw new Error("Respuesta vacía de la API");const l=JSON.parse(m);return{success:!0,data:{score:Math.min(100,Math.max(0,l.score||0)),feedback:Array.isArray(l.feedback)?l.feedback.slice(0,3):[],improvedPrompt:l.improvedPrompt||r,level:l.level||le.NOVICE,moduleId:t,evaluatedAt:new Date().toISOString()}}}catch(o){return{success:!1,error:o.message||"Error al evaluar el prompt"}}},me=oe(pe,{attempts:2}),ue=re(me,{key:r=>r}),$=({title:r,icon:t="fa-brain-circuit",placeholder:s,systemPrompt:o,isJson:n=!1,onResult:m,moduleId:l=1})=>{const[c,y]=d.useState(""),[f,p]=d.useState(""),[g,u]=d.useState(""),[i,b]=d.useState(!1),[h,x]=d.useState(!1),[j,N]=d.useState(!1),[w,P]=d.useState(!1),[J,D]=d.useState(""),[A,q]=d.useState(!1),[fe,k]=d.useState(0),T=d.useRef(null);d.useRef(null);const M=d.useRef(!1),R=["Analizando contexto...","Procesando solicitud...","Generando respuesta...","Optimizando output..."];d.useEffect(()=>{T.current&&T.current.scrollIntoView({behavior:"smooth"})},[g]);const F=async a=>{const C=typeof a=="string"?a:c;if(!C.trim())return;b(!0),p(""),u(""),k(0);let v=0;D(R[0]);const S=setInterval(()=>{v=(v+1)%R.length,D(R[v])},1800);try{const I=`Edutechlife – ${o}. Responde en español atendiendo a la solicitud: "${C}". Sé preciso e inspirador.`,E=await Z(I,o,n,K=>{M.current=!0,u(X=>{const B=X+K;return k(B.length),B})});clearInterval(S),E.error?(p(`Error: ${E.message}`),u(`Error: ${E.message}`)):(p(E),n?m&&m(JSON.parse(E.replace(/```json|```/g,"").trim())):u(E))}catch{clearInterval(S),p("Error al procesar la solicitud"),u("Error al procesar la solicitud")}finally{b(!1),M.current=!1}},V=async()=>{!f||h||(x(!0),await ee(f,"sistema"),x(!1))},G=()=>{f&&navigator.clipboard.writeText(f).then(()=>{N(!0),setTimeout(()=>N(!1),2e3)})},H=async()=>{if(c.trim()){b(!0),D("Evaluando tu prompt con IA...");try{const a=await ue(c,l);a.success?(p(JSON.stringify(a.data,null,2)),u(JSON.stringify(a.data,null,2)),await te(l,se.COMPLETED,{evaluationScore:a.data.score,evaluationLevel:a.data.level,feedback:a.data.feedback,improvedPrompt:a.data.improvedPrompt,evaluatedAt:new Date().toISOString()}),a.data.feedback&&window.maxSpeak&&setTimeout(()=>{const v=a.data.feedback.join(". ").replace(/\*\*/g,"").replace(/\*/g,"").replace(/`/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[_*~]/g,"").trim();window.maxSpeak(v)},1500),m&&m(a.data)):(p(`Error: ${a.error}`),u(`Error: ${a.error}`))}catch{p("Error al evaluar el prompt"),u("Error al evaluar el prompt")}finally{b(!1)}}},W=async()=>{if(!f)return;P(!0);const a=document.createElement("div");a.style.padding="40px",a.style.fontFamily="'DM Sans', sans-serif",a.style.color="#061322",a.style.background="#ffffff",a.innerHTML=`
            <div style="border-bottom: 2px solid #0090B8; padding-bottom: 20px; margin-bottom: 30px; display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0090B8, #00B8D4); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                    <h1 style="font-family: 'Montserrat', system-ui, sans-serif; font-size: 24px; font-weight: 800; margin: 0; color: #061322; letter-spacing: -0.04em;">EDUTECHLIFE</h1>
                    <p style="font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace; font-size: 10px; color: #0090B8; letter-spacing: 0.15em; margin: 0; text-transform: uppercase;">Inteligencia Analítica</p>
                </div>
            </div>
            <h2 style="font-family: 'Montserrat', system-ui, sans-serif; font-size: 18px; color: #061322; margin-bottom: 20px;">Reporte: ${r}</h2>
            <div style="line-height: 1.6; font-size: 14px;" class="pdf-content">
                ${_.sanitize(z.parse(f))}
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace; font-size: 10px; color: #6b7280; text-align: center;">
                Generado automáticamente por IA Lab Pro de Edutechlife — ${new Date().toLocaleDateString("es-CO")}
            </div>
        `;const C={margin:10,filename:`edutechlife-reporte-${Date.now()}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}},{default:v}=await U(async()=>{const{default:S}=await import("./html2pdf-DxV2vAFK.js").then(I=>I.h);return{default:S}},__vite__mapDeps([0,1,2,3]));v().set(C).from(a).save().then(()=>{P(!1)})};return e.jsxs("div",{className:`ai-panel${i?" neural-glow":""}`,children:[e.jsxs("div",{className:"ai-panel-header",children:[e.jsx("div",{className:"ai-panel-icon",children:e.jsx("i",{className:`fa-solid ${t}`})}),e.jsx("span",{className:"ai-panel-title",children:r}),e.jsxs("div",{className:"ai-panel-badge",children:[e.jsx("span",{className:"ai-panel-badge-dot"}),"GEMINI LIVE"]})]}),e.jsx("textarea",{className:"ai-input-dark",rows:3,placeholder:s,value:c,onChange:a=>y(a.target.value),onKeyDown:a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),F())}}),e.jsxs("div",{style:{display:"flex",gap:"10px",flexWrap:"wrap"},children:[e.jsx("button",{onClick:()=>F(),disabled:i,className:"ai-run-btn",style:{flex:1,marginTop:0,minWidth:"120px"},children:i?e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Procesando"}),e.jsxs("div",{className:"ai-loading-bars",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Ejecutar"}),e.jsx("i",{className:"fa-solid fa-bolt text-xs relative z-10"})]})}),e.jsx("button",{onClick:()=>H(),disabled:i||!c.trim(),className:"ai-run-btn",style:{flex:1,marginTop:0,minWidth:"120px",background:"linear-gradient(135deg, #004B63, #4DA8C4)"},children:i?e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Evaluando"}),e.jsxs("div",{className:"ai-loading-bars",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Evaluar"}),e.jsx("i",{className:"fa-solid fa-robot text-xs relative z-10"})]})}),e.jsx("button",{onClick:()=>ae(y,F,q),disabled:i,"aria-label":"Hablar por micrófono",className:`ai-run-btn ${A?"animate-pulse":""}`,style:{flex:"none",width:"auto",padding:"0 1.5rem",marginTop:0,background:A?"rgba(239, 68, 68, 0.2)":"rgba(255,255,255,0.05)",border:A?"1px solid #EF4444":"1px solid rgba(255,255,255,0.1)"},title:"Hablar por micrófono",children:e.jsx("i",{className:"fa-solid fa-microphone",style:{color:A?"#EF4444":"var(--primary)"}})})]}),i&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"1rem",marginTop:"1rem",background:"rgba(0,194,224,.06)",border:"1px solid rgba(0,194,224,.15)",borderRadius:"1rem"},children:[e.jsxs("div",{className:"ai-loading-bars",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),e.jsx("span",{style:{fontFamily:'"JetBrains Mono", "SF Mono", Monaco, monospace',fontSize:"10px",color:"var(--primary)",letterSpacing:".15em",textTransform:"uppercase"},children:J})]}),g&&!i&&e.jsxs("div",{className:"ai-result",children:[e.jsxs("div",{className:"ai-result-topbar",children:[e.jsx("span",{className:"ai-result-label",children:"Respuesta neural generada"}),e.jsxs("div",{className:"ai-result-actions",children:[e.jsxs("button",{onClick:G,className:`ai-copy-btn${j?" copied":""}`,children:[e.jsx("i",{className:`fa-solid ${j?"fa-check":"fa-copy"} text-xs`}),j?"Copiado":"Copiar"]}),e.jsxs("button",{onClick:V,className:`ai-audio-btn${h?" speaking":""}`,children:[e.jsx("i",{className:`fa-solid ${h?"fa-waveform-lines":"fa-volume-high"} text-xs`}),h?"Hablando":"Audio"]}),e.jsxs("button",{onClick:W,disabled:w,style:{display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,rgba(0,194,224,.1),rgba(0,224,255,.05))",border:"1px solid rgba(0,194,224,.3)",color:"var(--primary)",fontFamily:'"JetBrains Mono", "SF Mono", Monaco, monospace',fontSize:"9px",fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",padding:"6px 14px",borderRadius:"100px",cursor:"pointer",transition:"all .3s"},onMouseEnter:a=>{w||(a.currentTarget.style.background="var(--primary)",a.currentTarget.style.color="var(--navy)")},onMouseLeave:a=>{w||(a.currentTarget.style.background="linear-gradient(135deg,rgba(0,194,224,.1),rgba(0,224,255,.05))",a.currentTarget.style.color="var(--primary)")},children:[e.jsx("i",{className:`fa-solid ${w?"fa-spinner fa-spin":"fa-file-pdf"} text-xs`}),w?"Generando...":"Descargar PDF"]})]})]}),e.jsx("div",{className:"ai-result-body",dangerouslySetInnerHTML:{__html:_.sanitize(z.parse(g))},ref:T})]})]})},je=({onBack:r})=>{const{t}=Y(),[s,o]=d.useState("roi"),[n,m]=d.useState(null),l=`Eres un CONSULTOR FINANCIERO EXPERTO en optimización de procesos empresariales con IA. Tienes 15+ años de experiencia en análisis financiero, ROI, reducción de costos operativos y transformación digital. Tu especialidad es calcular y proyectar el retorno de inversión (ROI) de implementaciones de IA en organizaciones educativas y empresariales.

COMPETENCIAS:
- Cálculo de ROI con metodología comprobada
- Análisis de ahorro de tiempo y costos
- Proyecciones financieras a 3, 6 y 12 meses
- Benchmarking con casos de éxito reales
- Recomendaciones de inversión optimas

FORMATO DE RESPUESTA:
Cuando el usuario proporcione datos de su organización (empleados, procesos, presupuesto), genera un informe que incluya:

1. **RESUMEN EJECUTIVO FINANCIERO**
   - Inversión estimada recomendada
   - ROI proyectado (en %)
   - Tiempo de recuperación (payback period)
   - Ahorro anual estimado en COP

2. **ANÁLISIS CUANTITATIVO**
   - Porcentaje de automatización alcanzable
   - Horas-hombre ahorradas por mes
   - Costo por hora optimizado
   - Eficiencia operativa mejorada (%)

3. **PROYECCIÓN DE AHORRO**
   - Ahorro mensual estimado
   - Ahorro trimestral
   - Ahorro anual
   - Ahorro a 3 años

4. **RECOMENDACIONES DE INVERSIÓN**
   - Plan de fases recomendado
   - Inversión por fase
   - Priorización de procesos a automatizar
   - ROI esperado por fase

5. **CASOS DE REFERENCIA**
   - Menciona 2-3 casos similares con resultados reales

Sé preciso con los números, usa metodología financiera estándar, y proporciona datos que el cliente pueda presentar a su junta directiva.`,c=`Eres un INGENIERO DE SISTEMAS ESPECIALIZADO en diseño de workflows y automatización de procesos con IA. Tienes experiencia en arquitectura de sistemas, integración de APIs, diseño de pipelines de datos, y orquestación de agentes de IA. Tu especialidad es crear flujos de trabajo (workflows) detallados y técnicos para implementar soluciones de automatización.

COMPETENCIAS:
- Diseño de arquitectura de sistemas
- Diagramación de flujos de trabajo
- Especificación técnica de componentes
- Integración de servicios y APIs
- Definición de KPIs técnicos
- Documentación de implementación paso a paso

FORMATO DE RESPUESTA:
Cuando el usuario describa sus procesos o necesidades de automatización, genera un plan técnico que incluya:

1. **ARQUITECTURA DEL SISTEMA**
   - Diagrama de componentes (descríbelo en texto estructurado)
   - Stack tecnológico recomendado
   - Capas de la arquitectura (presentación, lógica, datos)
   - Servicios externos a integrar

2. **FLUJO DE TRABAJO (WORKFLOW)**
   - Secuencia de pasos numerados
     Paso 1: [Nombre] → [Acción] → [Resultado]
   - Puntos de decisión del flujo
   - Manejo de excepciones y errores
   - Triggers y eventos del sistema

3. **ESPECIFICACIONES TÉCNICAS**
   - Endpoints de API necesarios
   - Modelos de datos (esquemas)
   - Autenticación y permisos
   - Requisitos de infraestructura
   - Consideraciones de seguridad

4. **ROADMAP DE IMPLEMENTACIÓN**
   Fase 1 (Semanas 1-4): [Descripción]
   Fase 2 (Semanas 5-8): [Descripción]
   Fase 3 (Semanas 9-12): [Descripción]
   
5. **KPIs TÉCNICOS**
   - Tiempo de respuesta del sistema
   - Disponibilidad (% uptime)
   - Número de transacciones/hora
   - Tasa de error aceptable

6. **REQUERIMIENTOS NO FUNCIONALES**
   - Escalabilidad
   - Performance
   - Backup y recuperación
   - Monitoreo y logging

Sé muy técnico y detallado. Tu respuesta debe poder ser entregada a un equipo de desarrollo para su implementación.`,y=async(p,g,u)=>{const i=document.createElement("div");i.style.padding="40px",i.style.fontFamily="'Montserrat', 'Open Sans', Arial, sans-serif",i.style.color="#1a1a2e",i.style.background="#ffffff",i.style.minHeight="297mm",i.innerHTML=`
            <div style="border-bottom: 4px solid #004B63; padding-bottom: 25px; margin-bottom: 30px; background: linear-gradient(135deg, #004B63 0%, #4DA8C4 100%); padding: 30px; margin: -40px -40px 30px -40px; border-radius: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width: 70px; height: 70px; background: white; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            🎓
                        </div>
                        <div>
                            <h1 style="font-family: 'Montserrat', Arial, sans-serif; font-size: 28px; font-weight: 900; margin: 0; color: white; letter-spacing: -0.02em;">EDUTECHLIFE</h1>
                            <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.8); margin: 5px 0 0 0; letter-spacing: 0.15em; text-transform: uppercase;">Consultoría B2B - Plataforma Premium</p>
                        </div>
                    </div>
                    <div style="text-align: right; color: white;">
                        <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 12px; margin: 0; opacity: 0.9;">Documento Oficial</p>
                        <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; margin: 5px 0 0 0; opacity: 0.7;">${new Date().toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric"})}</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="font-family: 'Montserrat', Arial, sans-serif; font-size: 24px; font-weight: 800; color: #004B63; margin: 0 0 10px 0; padding-bottom: 10px; border-bottom: 2px solid #4DA8C4;">
                    ${g}
                </h2>
                <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 13px; color: #666; margin: 0;">
                    Análisis generado por IA para Consultoría B2B Edutechlife
                </p>
            </div>
            
            <div style="line-height: 1.8; font-size: 13px; color: #333; white-space: pre-wrap; font-family: 'Open Sans', Arial, sans-serif;">
                ${p.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>")}
            </div>
            
            <div style="margin-top: 50px; padding: 25px; background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); border-radius: 15px; border-left: 5px solid #004B63;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; background: #004B63; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">✓</div>
                    <div>
                        <p style="font-family: 'Montserrat', Arial, sans-serif; font-size: 14px; font-weight: 700; color: #004B63; margin: 0;">DOCUMENTO OFICIAL VERIFICADO</p>
                        <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; color: #666; margin: 3px 0 0 0;">Edutechlife v2.286 - Neuro-Educación Premium</p>
                    </div>
                </div>
                <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 11px; color: #888; margin: 0; text-align: center;">
                    Este documento fue generado automáticamente y contiene información confidencial de Consultoría B2B Edutechlife.
                </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center;">
                <p style="font-family: 'Open Sans', Arial, sans-serif; font-size: 10px; color: #999; margin: 0;">
                    consultoria@edutechlife.com | www.edutechlife.com | © 2026 Edutechlife - Todos los derechos reservados
                </p>
            </div>
        `;const h={margin:10,filename:`${`Edutechlife_${u}_${new Date().toISOString().split("T")[0]}`}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}},{default:x}=await U(async()=>{const{default:j}=await import("./html2pdf-DxV2vAFK.js").then(N=>N.h);return{default:j}},__vite__mapDeps([0,1,2,3]));x().set(h).from(i).save()},f=(p,g,u)=>{const i=`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${g}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #004B63, #4DA8C4); color: white; padding: 30px; margin: -50px -50px 30px -50px; }
        .logo { font-size: 28px; font-weight: bold; }
        .subtitle { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; }
        h1 { font-size: 24px; color: #004B63; border-bottom: 2px solid #4DA8C4; padding-bottom: 10px; }
        h2 { font-size: 16px; color: #004B63; }
        .content { white-space: pre-wrap; font-size: 13px; }
        .footer { margin-top: 40px; padding: 20px; background: #f5f5f5; border-left: 4px solid #004B63; }
        .verification { font-weight: bold; color: #004B63; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🎓 EDUTECHLIFE</div>
        <div class="subtitle">Consultoría B2B - Plataforma Premium</div>
    </div>
    
    <h1>${g}</h1>
    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
    
    <div class="content">${p}</div>
    
    <div class="footer">
        <p class="verification">✓ DOCUMENTO OFICIAL VERIFICADO</p>
        <p>Edutechlife v2.286 - Neuro-Educación Premium</p>
        <p>consultoria@edutechlife.com | www.edutechlife.com</p>
    </div>
</body>
</html>`,b=new Blob([i],{type:"application/msword"}),h=URL.createObjectURL(b),x=document.createElement("a");x.href=h,x.download=`Edutechlife_${u}_${new Date().toISOString().split("T")[0]}.doc`,document.body.appendChild(x),x.click(),document.body.removeChild(x),URL.revokeObjectURL(h)};return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FFFFFF] to-[#E2E8F0]",children:[e.jsx("div",{className:"bg-white border-b border-[#E2E8F0] shadow-sm",children:e.jsxs("div",{className:"max-w-7xl mx-auto flex items-center justify-between py-4 px-6",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("button",{onClick:r,className:"flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] hover:bg-[#4DA8C4] hover:text-white border border-[#E2E8F0] rounded-lg transition-all duration-300",children:[e.jsx("i",{className:"fa-solid fa-arrow-left text-[#4DA8C4] hover:text-white"}),e.jsx("span",{className:"text-sm text-[#64748B] hover:text-white",children:t("consultoria.b2b.back")})]}),e.jsx("div",{className:"h-8 w-px bg-[#E2E8F0]"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-lg flex items-center justify-center",children:e.jsx("i",{className:"fa-solid fa-building text-white"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"font-montserrat font-bold text-lg text-[#004B63]",children:t("consultoria.b2b.title")}),e.jsx("p",{className:"text-xs text-[#64748B]",children:t("consultoria.b2b.subtitle")})]})]})]}),e.jsx("div",{className:"flex items-center gap-3",children:e.jsx("span",{className:"px-3 py-1 bg-[#66CCCC]/20 border border-[#66CCCC]/40 rounded-full text-xs text-[#004B63] font-mono font-semibold",children:t("consultoria.b2b.badge")})})]})}),e.jsxs("div",{className:"max-w-7xl mx-auto px-6 py-8",children:[e.jsxs("div",{className:"flex gap-4 mb-8",children:[e.jsxs("button",{onClick:()=>o("roi"),className:`flex-1 relative px-6 py-5 rounded-2xl transition-all duration-300 ${s==="roi"?"bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-xl shadow-[#4DA8C4]/30":"bg-white text-[#004B63] hover:shadow-lg border border-[#E2E8F0] hover:border-[#4DA8C4]"}`,children:[e.jsxs("div",{className:"flex items-center justify-center gap-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-xl flex items-center justify-center ${s==="roi"?"bg-white/20":"bg-[#4DA8C4]/10"}`,children:e.jsx("i",{className:`fa-solid fa-chart-line text-2xl ${s==="roi"?"text-white":"text-[#4DA8C4]"}`})}),e.jsxs("div",{className:"text-left",children:[e.jsx("div",{className:"font-montserrat font-bold text-lg",children:t("consultoria.b2b.roi_tab_title")}),e.jsx("div",{className:`text-sm ${s==="roi"?"text-white/80":"text-[#64748B]"}`,children:t("consultoria.b2b.roi_tab_desc")})]})]}),s==="roi"&&e.jsx("div",{className:"absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#66CCCC] rounded-full"})]}),e.jsxs("button",{onClick:()=>o("automation"),className:`flex-1 relative px-6 py-5 rounded-2xl transition-all duration-300 ${s==="automation"?"bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white shadow-xl shadow-[#4DA8C4]/30":"bg-white text-[#004B63] hover:shadow-lg border border-[#E2E8F0] hover:border-[#4DA8C4]"}`,children:[e.jsxs("div",{className:"flex items-center justify-center gap-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-xl flex items-center justify-center ${s==="automation"?"bg-white/20":"bg-[#66CCCC]/10"}`,children:e.jsx("i",{className:`fa-solid fa-sitemap text-2xl ${s==="automation"?"text-white":"text-[#66CCCC]"}`})}),e.jsxs("div",{className:"text-left",children:[e.jsx("div",{className:"font-montserrat font-bold text-lg",children:t("consultoria.b2b.auto_tab_title")}),e.jsx("div",{className:`text-sm ${s==="automation"?"text-white/80":"text-[#64748B]"}`,children:t("consultoria.b2b.auto_tab_desc")})]})]}),s==="automation"&&e.jsx("div",{className:"absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#66CCCC] rounded-full"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden",children:[e.jsx($,{title:t("consultoria.b2b.ai_roi_title"),icon:"fa-chart-line",placeholder:t("consultoria.b2b.ai_roi_placeholder"),systemPrompt:l,onResult:p=>{m(p)}}),n&&e.jsx("div",{className:"p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]",children:e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("button",{onClick:()=>y(n,"DIAGNÓSTICO ROI NEURAL","ROI"),className:"flex-1 px-6 py-4 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white rounded-xl font-montserrat font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group",children:[e.jsx("i",{className:"fa-solid fa-file-pdf text-lg group-hover:scale-110 transition-transform"}),e.jsx("span",{children:t("consultoria.b2b.download_pdf")})]}),e.jsxs("button",{onClick:()=>f(n,"DIAGNÓSTICO ROI NEURAL","ROI"),className:"flex-1 px-6 py-4 bg-white border-2 border-[#4DA8C4] text-[#004B63] rounded-xl font-montserrat font-bold hover:bg-[#4DA8C4]/10 transition-all duration-300 flex items-center justify-center gap-3",children:[e.jsx("i",{className:"fa-solid fa-file-word text-lg text-[#4DA8C4]"}),e.jsx("span",{children:t("consultoria.b2b.download_word")})]})]})})]}),e.jsx("div",{className:"bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden",children:e.jsx($,{title:t("consultoria.b2b.ai_auto_title"),icon:"fa-diagram-project",placeholder:t("consultoria.b2b.ai_auto_placeholder"),systemPrompt:c})})]}),e.jsxs("div",{className:"mt-12 grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg transition-shadow",children:[e.jsx("div",{className:"w-14 h-14 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-xl flex items-center justify-center mb-4",children:e.jsx("i",{className:"fa-solid fa-shield-halved text-white text-xl"})}),e.jsx("h3",{className:"font-montserrat font-bold text-[#004B63] mb-2",children:t("consultoria.b2b.feature1_title")}),e.jsx("p",{className:"text-sm text-[#64748B]",children:t("consultoria.b2b.feature1_desc")})]}),e.jsxs("div",{className:"p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg transition-shadow",children:[e.jsx("div",{className:"w-14 h-14 bg-gradient-to-br from-[#66CCCC] to-[#B2D8E5] rounded-xl flex items-center justify-center mb-4",children:e.jsx("i",{className:"fa-solid fa-file-contract text-white text-xl"})}),e.jsx("h3",{className:"font-montserrat font-bold text-[#004B63] mb-2",children:t("consultoria.b2b.feature2_title")}),e.jsx("p",{className:"text-sm text-[#64748B]",children:t("consultoria.b2b.feature2_desc")})]}),e.jsxs("div",{className:"p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg transition-shadow",children:[e.jsx("div",{className:"w-14 h-14 bg-gradient-to-br from-[#004B63] to-[#4DA8C4] rounded-xl flex items-center justify-center mb-4",children:e.jsx("i",{className:"fa-solid fa-headset text-white text-xl"})}),e.jsx("h3",{className:"font-montserrat font-bold text-[#004B63] mb-2",children:t("consultoria.b2b.feature3_title")}),e.jsx("p",{className:"text-sm text-[#64748B]",children:t("consultoria.b2b.feature3_desc")})]})]})]})]})};export{je as default};
