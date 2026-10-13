# Conocimiento base de Edutechlife (para los agentes)

Todo agente de Edutechlife lee este archivo antes de trabajar. Fuentes completas:
`docs/EDUTECHLIFE-ADN.md` y `docs/EDUTECHLIFE-DOCUMENTO-CORPORATIVO.md`.

## Quiénes somos
- "Pedagogía colombiana con inteligencia artificial". Docentes que hacen tecnología, no ingenieros que hacen educación.
- Tagline: *Liderando la Educación del Futuro con Pedagogía e Inteligencia Artificial*.
- Dominio: https://edutechlife.co — CEO: Edison Beltrán (responsable final de todo lo que hagan los agentes).
- Método: Diagnóstico VAK → Ruta personalizada STEAM → Ejecución práctica → Certificación.
- Lo inmutable: español latino nativo, precios en pesos colombianos, nota mínima 80 %, nada de chatbots sin pedagogía, nada de video sin práctica.

## Ecosistema de productos
| Producto | Público | Rutas principales | Personajes IA |
|---|---|---|---|
| **IALab / AI Lab Academic** — curso de IA generativa, 5 módulos, 15+ OVAs (BuildGPT, BiasLab, PodcastStudio…), XP, certificado | Jóvenes, adultos, docentes | `/ialab-academic`, `/ialab`, `/sign-up/ialab` | **Valerio** (coach con voz, 4 niveles) |
| **IngenIA** (antes SmartBoard) — plataforma 8–16 años, misiones, tienda, panel para padres | Niños, padres, colegios | `/conoce-ingenia`, `/ingenia`, `/ingenia/padres`, `/sign-up/ingenia` | **Dani** (tutor infantil) |
| **Diagnóstico VAK** — evaluación de estilo de aprendizaje con informe PDF | 6–17 años, padres, colegios | `/vak`, `/vak-simple`, `/vak-premium` | **Valeria** (psicóloga educativa) |
| **Automatización / IA Empresarial** — agentes, ROI, Automation Architect | Empresas, instituciones | `/automation`, `/consultoria`, `/consultoria-b2b` | — |
| **Neuroentorno, Proyectos nacionales** | General | `/neuroentorno`, `/proyectos` | **Nico**, **Max** (asistentes del sitio) |

Apps Android: `edutechlife-frontend/android-ialab`, `android-ingenia`.

## Arquitectura técnica (resumen)
- Frontend: React 18 + Vite SPA en `edutechlife-frontend/` (Vercel). Pruebas: Vitest (`npm run test:smoke`), Playwright (`e2e/`, `npm run test:e2e:smoke`), Lighthouse (`lighthouserc.js`), axe en CI.
- Backend: Express 5 en `edutechlife-backend/` (Render, `edutechlife-backend.onrender.com`), Supabase (Postgres + Auth), Stripe, Redis.
- Analítica: PostHog y Sentry en el frontend.
- Repo: `github.com/eeductechlife-ai/edutechlife`, rama principal `main`, CI en `.github/workflows/`.

## Mercado objetivo (fase 1)
1. **Manizales** (Caldas) — base, prioridad máxima.
2. **Eje Cafetero** — Pereira (Risaralda), Armenia (Quindío) y municipios de Caldas.
3. **Colombia** — Bogotá, Medellín, Cali y luego el resto del país.

Segmentos: padres de familia (IngenIA + VAK), colegios privados y públicos, secretarías de educación,
docentes (IALab), universidades e instituciones, empresas (Automatización).

## Prioridad de la empresa (definida por el CEO, 2026-10-13)
1. **Atraer clientes que paguen.** Todo trabajo de marketing se juzga por si acerca clientes reales.
2. **Productos a nivel profesional.** Todo trabajo de calidad se juzga por si el producto se siente de primer nivel.
3. **Foco.** Un segmento cabeza de playa a la vez; no dispersarse en todos los públicos al mismo tiempo.

## Estar al día
- Tu conocimiento interno puede estar desactualizado. Para tendencias, competidores, precios, algoritmos de redes,
  novedades de IA y normas, verifica con búsqueda web y cita fuente y fecha (prefiere los últimos 90 días).
- Lee `docs/agentes/RADAR-TENDENCIAS.md` (se actualiza cada domingo) y aplica lo que corresponda a tu rol.

## Organización de agentes
Cuatro equipos, cada uno con su playbook en `docs/agentes/<equipo>/PLAYBOOK.md`: **calidad** (producto, plataforma, contenido),
**marketing** (cliente, mercado, SEO, contenido, B2B, analítica, reputación), **comercial** (leads, éxito del cliente, licitaciones)
y **administracion** (finanzas, cumplimiento legal). Lo que pueden hacer sin aprobación lo define `docs/agentes/AUTONOMIA.md`.
Si tu trabajo descubre algo que le toca a otro equipo, déjalo en tu reporte bajo "Para otros equipos".

## Reglas de verdad
- Cifras y alianzas públicas (ej. "+6.000 certificados", "operador SenaTIC", logos de aliados) **solo** se usan
  si aparecen como VERIFICADAS en `docs/agentes/marketing/HECHOS-VERIFICADOS.md`. Si no, se marcan como pendientes.
- Datos de menores: Ley 1581 de 2012 (Habeas Data). Nunca usar datos reales de estudiantes para pruebas.
