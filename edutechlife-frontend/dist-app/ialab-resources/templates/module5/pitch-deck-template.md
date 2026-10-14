# Plantilla de Pitch Deck - IALab Módulo 5

## Estructura de 12 Slides para Presentación de Proyecto IA

### Slide 1: Portada
**Título:** [Nombre del Proyecto]
**Subtítulo:** Solución de IA para [Problema Específico]
**Logo:** [Tu logo o el de EdutechLife]
**Tu nombre:** [Nombre del estudiante]
**Fecha:** [Fecha de presentación]

---

### Slide 2: El Problema
**Título:** El Desafío que Resolvemos
**Contenido:**
- **Problema principal:** [Describir el problema específico]
- **Impacto actual:** [Estadísticas o datos sobre el problema]
- **Costo del problema:** [Impacto económico/social]
- **Quiénes lo sufren:** [Segmento de usuarios afectados]

**Diseño:** Infografía con iconos de problemas y gráficos de impacto

---

### Slide 3: La Solución
**Título:** Nuestra Propuesta de IA
**Contenido:**
- **Solución principal:** [Descripción concisa de la solución]
- **Tecnología clave:** [Algoritmos/Modelos de IA utilizados]
- **Cómo funciona:** [Proceso simplificado en 3 pasos]
- **Innovación:** [Qué hace diferente nuestra solución]

**Diseño:** Diagrama de flujo con colores corporativos (#2D7A94, #4DA8C4)

---

### Slide 4: Mercado Oportunidad
**Título:** El Mercado que Transformaremos
**Contenido:**
- **TAM (Total Addressable Market):** [Tamaño total del mercado]
- **SAM (Serviceable Available Market):** [Mercado accesible]
- **SOM (Serviceable Obtainable Market):** [Mercado alcanzable en 1-3 años]
- **Crecimiento proyectado:** [Tasa de crecimiento anual]

**Diseño:** Gráfico de círculos concéntricos (TAM > SAM > SOM)

---

### Slide 5: Ventaja Competitiva
**Título:** Por Qué Somos Únicos
**Contenido:**
- **Barreras de entrada:** [Ventajas tecnológicas/regulatorias]
- **IP/Patentes:** [Propiedad intelectual desarrollada]
- **Equipo experto:** [Habilidades únicas del equipo]
- **Alianzas estratégicas:** [Socios clave]

**Diseño:** Tabla comparativa vs competidores

---

### Slide 6: Modelo de Negocio
**Título:** Cómo Generamos Ingresos
**Contenido:**
- **Fuentes de ingresos:** [Suscripciones, licencias, consultoría]
- **Precios:** [Estructura de precios]
- **CAC (Costo de Adquisición de Cliente):** [Estimado]
- **LTV (Valor de Vida del Cliente):** [Estimado]
- **Margen bruto:** [Porcentaje estimado]

**Diseño:** Diagrama de flujo de ingresos

---

### Slide 7: Tracción y Validación
**Título:** Lo Que Ya Hemos Logrado
**Contenido:**
- **Prototipo/MVP:** [Estado actual del desarrollo]
- **Usuarios beta:** [Número y feedback]
- **Métricas clave:** [KPIs alcanzados]
- **Testimonios:** [Citas de usuarios/clientes]
- **Premios/reconocimientos:** [Logros relevantes]

**Diseño:** Gráficos de crecimiento y citas destacadas

---

### Slide 8: Equipo
**Título:** El Equipo Detrás del Proyecto
**Contenido:**
- **Fundadores:** [Nombre, rol, experiencia relevante]
- **Equipo técnico:** [Expertos en IA/desarrollo]
- **Asesores:** [Mentores y expertos del sector]
- **Brechas a cubrir:** [Posiciones clave por contratar]

**Diseño:** Fotos del equipo con mini-biografías

---

### Slide 9: Hoja de Ruta
**Título:** Plan de Ejecución
**Contenido:**
- **Fase 1 (0-6 meses):** [Desarrollo MVP, primeros clientes]
- **Fase 2 (6-12 meses):** [Escalabilidad, expansión de mercado]
- **Fase 3 (12-24 meses):** [Internacionalización, nuevas funcionalidades]
- **Hitos clave:** [Eventos importantes por alcanzar]

**Diseño:** Timeline visual con hitos marcados

---

### Slide 10: Inversión
**Título:** Lo Que Buscamos
**Contenido:**
- **Ronda actual:** [Tipo de ronda (seed, Serie A)]
- **Cantidad buscada:** [Monto total a recaudar]
- **Uso de fondos:**
  - 40% Desarrollo tecnológico
  - 30% Marketing y ventas
  - 20% Operaciones y equipo
  - 10% Reserva operativa
- **Valuación:** [Valuación pre-money]

**Diseño:** Gráfico circular de uso de fondos

---

### Slide 11: Visión a Largo Plazo
**Título:** El Futuro que Construimos
**Contenido:**
- **Visión 5 años:** [Objetivo a largo plazo]
- **Expansión de mercado:** [Nuevos segmentos/geografías]
- **Productos futuros:** [Línea de productos planeada]
- **Impacto social:** [Contribución a la sociedad]

**Diseño:** Imagen inspiradora del futuro

---

### Slide 12: Contacto y Cierre
**Título:** ¡Gracias!
**Contenido:**
- **Resumen clave:** [3 puntos principales a recordar]
- **Llamado a la acción:** [Qué quieres que hagan los inversores]
- **Información de contacto:**
  - Email: [tu@email.com]
  - LinkedIn: [enlace]
  - Sitio web: [URL del proyecto]
  - Demo: [Enlace a demo si aplica]
- **Preguntas:** [Invita a preguntas]

**Diseño:** Diseño limpio con información de contacto clara

---

## Plantilla CSS para Presentación (HTML/CSS)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pitch Deck - [Nombre del Proyecto]</title>
    <style>
        :root {
            --petroleum: #2D7A94;
            --corporate-blue: #4DA8C4;
            --mint: #66CCCC;
            --soft-blue: #B2D8E5;
            --white: #FFFFFF;
            --dark-gray: #333333;
            --light-gray: #F5F7FA;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: linear-gradient(135deg, var(--light-gray) 0%, var(--soft-blue) 100%);
            color: var(--dark-gray);
            line-height: 1.6;
        }
        
        .slide {
            min-height: 100vh;
            padding: 60px 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            z-index: -1;
        }
        
        h1, h2, h3 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            margin-bottom: 20px;
        }
        
        h1 {
            font-size: 3.5rem;
            color: var(--petroleum);
            line-height: 1.2;
        }
        
        h2 {
            font-size: 2.5rem;
            color: var(--corporate-blue);
            border-bottom: 3px solid var(--mint);
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        h3 {
            font-size: 1.8rem;
            color: var(--petroleum);
            margin-bottom: 15px;
        }
        
        .content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
        }
        
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }
        
        .card {
            background: var(--white);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(45, 122, 148, 0.1);
            border: 1px solid var(--soft-blue);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(45, 122, 148, 0.15);
        }
        
        .highlight {
            color: var(--corporate-blue);
            font-weight: 600;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: 700;
            color: var(--petroleum);
            display: block;
            margin-bottom: 10px;
        }
        
        .stat-label {
            font-size: 1.1rem;
            color: var(--dark-gray);
        }
        
        .timeline {
            position: relative;
            padding-left: 40px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, var(--mint), var(--corporate-blue));
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 40px;
            padding-left: 20px;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -12px;
            top: 0;
            width: 20px;
            height: 20px;
            background: var(--petroleum);
            border-radius: 50%;
            border: 4px solid var(--white);
        }
        
        .team-member {
            text-align: center;
        }
        
        .team-photo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid var(--soft-blue);
            margin-bottom: 15px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, var(--petroleum), var(--corporate-blue));
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            margin-top: 20px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(45, 122, 148, 0.3);
        }
        
        .logo {
            position: absolute;
            top: 30px;
            right: 30px;
            height: 60px;
        }
        
        .slide-number {
            position: absolute;
            bottom: 20px;
            right: 30px;
            color: var(--corporate-blue);
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .slide {
                padding: 40px 20px;
            }
            
            h1 {
                font-size: 2.5rem;
            }
            
            h2 {
                font-size: 2rem;
            }
            
            .grid-2, .grid-3 {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Slide 1: Portada -->
    <section class="slide" id="slide1">
        <div class="content">
            <h1>[Nombre del Proyecto]</h1>
            <p style="font-size: 1.8rem; color: var(--corporate-blue); margin-bottom: 20px;">
                Solución de IA para [Problema Específico]
            </p>
            <div style="margin-top: 40px;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;"><strong>Presentado por:</strong> [Tu Nombre]</p>
                <p style="font-size: 1.2rem;"><strong>Fecha:</strong> [Fecha de Presentación]</p>
            </div>
        </div>
        <div class="slide-number">Slide 1/12</div>
    </section>
    
    <!-- Slide 2: El Problema -->
    <section class="slide" id="slide2">
        <div class="content">
            <h2>El Desafío que Resolvemos</h2>
            <div class="grid-2">
                <div>
                    <h3>Problema Principal</h3>
                    <p>[Describir el problema específico que tu solución de IA resuelve]</p>
                    
                    <h3 style="margin-top: 30px;">Impacto Actual</h3>
                    <div class="grid-2" style="margin-top: 15px;">
                        <div class="card">
                            <span class="stat-number">XX%</span>
                            <span class="stat-label">de [grupo afectado] experimenta este problema</span>
                        </div>
                        <div class="card">
                            <span class="stat-number">$XXM</span>
                            <span class="stat-label">costo anual del problema</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="card">
                        <h3>Quiénes lo Sufren</h3>
                        <ul style="list-style: none; padding-left: 0;">
                            <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                                <span style="position: absolute; left: 0; color: var(--corporate-blue);">✓</span>
                                [Segmento de usuario 1]
                            </li>
                            <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                                <span style="position: absolute; left: 0; color: var(--corporate-blue);">✓</span>
                                [Segmento de usuario 2]
                            </li>
                            <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                                <span style="position: absolute; left: 0; color: var(--corporate-blue);">✓</span>
                                [Segmento de usuario 3]
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="slide-number">Slide 2/12</div>
    </section>
    
    <!-- Nota: Las slides 3-12 seguirían la misma estructura -->
    
    <script>
        // Navegación básica entre slides
        document.addEventListener('keydown', function(e) {
            const slides = document.querySelectorAll('.slide');
            const currentSlide = Array.from(slides).findIndex(slide => {
                const rect = slide.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight;
            });
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                if (currentSlide < slides.length - 1) {
                    slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                if (currentSlide > 0) {
                    slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    </script>
</body>
</html>
```

---

## Checklist para Presentación Exitosa

### ✅ ANTES DE LA PRESENTACIÓN:
- [ ] Personalizar todas las slides con datos específicos del proyecto
- [ ] Reemplazar placeholders con información real
- [ ] Practicar el pitch mínimo 10 veces
- [ ] Cronometrar presentación (15-20 minutos ideal)
- [ ] Preparar respuestas a preguntas frecuentes
- [ ] Probar tecnología (proyector, clicker, audio)

### ✅ DURANTE LA PRESENTACIÓN:
- [ ] Mantener contacto visual con la audiencia
- [ ] Usar historias y ejemplos concretos
- [ ] Mostrar pasión por el problema y solución
- [ ] Mantener ritmo constante (1-2 minutos por slide)
- [ ] Invitar preguntas al final

### ✅ DESPUÉS DE LA PRESENTACIÓN:
- [ ] Enviar pitch deck a los interesados
- [ ] Seguir con contactos clave en 24-48 horas
- [ ] Documentar feedback recibido
- [ ] Actualizar pitch deck basado en feedback

---

## Recursos Adicionales

### Herramientas Recomendadas:
1. **Para diseño:** Canva, Pitch.com, Beautiful.AI
2. **Para gráficos:** Figma, Adobe Illustrator
3. **Para datos:** Google Data Studio, Tableau Public
4. **Para prototipos:** Figma, Adobe XD

### Plantillas Gratuitas:
- [Pitch Deck Template - Canva](https://www.canva.com/templates/search/pitch-deck/)
- [Startup Pitch Deck - SlidesGo](https://slidesgo.com/theme/startup-pitch-deck)
- [VC Pitch Deck - Slidebean](https://slidebean.com/templates/pitch-deck)

### Ejemplos de Éxito:
- Airbnb (pitch deck original)
- Uber (deck inicial)
- Buffer (deck transparente)
- Mint.com (deck que consiguió $30M)

---

**Nota:** Esta plantilla sigue los principios de diseño de EdutechLife y está optimizada para presentaciones de proyectos de IA. Personaliza cada sección con los detalles específicos de tu proyecto del Módulo 5.