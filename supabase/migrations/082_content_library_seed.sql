-- Migration 082: Content Library Seed — 52 items across 6 subjects
-- Matemáticas(10) + Lenguaje(10) + Ciencias Naturales(10) + Ciencias Sociales(8) + Inglés(8) + Tecnología(6)
-- Covers grades 1-11, three VAK styles, difficulties 1-4.
-- Idempotent: ON CONFLICT (id) DO NOTHING.

INSERT INTO learning_content
  (id, title, type, subject, area, competency_id, skill,
   age_min, age_max, grade_min, grade_max, difficulty, duration_min,
   learning_objective, vak_style)
VALUES

-- ── MATEMÁTICAS (10) ──────────────────────────────────────────────────────────
('co_mat_1-3_numeros_video_01',
 'Los números del 1 al 100 con objetos', 'video',
 'matematicas', 'numeracion', 'co_matematicas_1-3_0', 'numeracion_natural',
 6, 9, 1, 3, 1, 7,
 'Contar, leer y escribir números naturales hasta 100 en contextos cotidianos', 'visual'),

('co_mat_1-3_operaciones_game_01',
 'Suma y resta jugando con frutas', 'game',
 'matematicas', 'aritmetica', 'co_matematicas_1-3_1', 'suma_resta',
 6, 9, 1, 3, 1, 10,
 'Realizar adiciones y sustracciones simples con objetos concretos', 'kinestesico'),

('co_mat_4-5_fracciones_article_01',
 'Fracciones: partir y repartir', 'article',
 'matematicas', 'fracciones', 'co_matematicas_4-5_0', 'fracciones_basicas',
 9, 11, 4, 5, 2, 10,
 'Comprender y operar con fracciones propias e impropias en situaciones reales', 'visual'),

('co_mat_4-5_fracciones_quiz_01',
 'Quiz: suma y resta de fracciones', 'quiz',
 'matematicas', 'fracciones', 'co_matematicas_4-5_0', 'fracciones_basicas',
 9, 11, 4, 5, 2, 8,
 'Evaluar el dominio de operaciones básicas con fracciones', 'kinestesico'),

('co_mat_4-5_estadistica_article_01',
 'Gráficas de barras: lee los datos', 'article',
 'matematicas', 'estadistica', 'co_matematicas_4-5_2', 'graficas_estadisticas',
 9, 11, 4, 5, 2, 9,
 'Leer e interpretar gráficas de barras y pictogramas', 'visual'),

('co_mat_6-7_enteros_video_01',
 'Números enteros: positivos y negativos', 'video',
 'matematicas', 'aritmetica', 'co_matematicas_6-7_0', 'numeros_enteros',
 11, 13, 6, 7, 2, 9,
 'Operar con números enteros en recta numérica y situaciones contextualizadas', 'visual'),

('co_mat_6-7_geometria_challenge_01',
 'Reto geométrico: áreas y volúmenes', 'challenge',
 'matematicas', 'geometria', 'co_matematicas_6-7_2', 'areas_volumenes',
 11, 13, 6, 7, 3, 15,
 'Calcular áreas y volúmenes de figuras tridimensionales mediante fórmulas', 'kinestesico'),

('co_mat_8-9_sistemas_video_01',
 'Sistemas de ecuaciones: método de sustitución', 'video',
 'matematicas', 'algebra', 'co_matematicas_8-9_0', 'sistemas_ecuaciones',
 13, 15, 8, 9, 3, 12,
 'Resolver sistemas de ecuaciones lineales 2×2 por sustitución y eliminación', 'visual'),

('co_mat_8-9_funciones_article_01',
 'Funciones lineales: pendiente e intercepto', 'article',
 'matematicas', 'funciones', 'co_matematicas_8-9_2', 'funciones_lineales',
 13, 15, 8, 9, 3, 11,
 'Interpretar y graficar funciones lineales identificando pendiente e intercepto', 'visual'),

('co_mat_10-11_derivadas_challenge_01',
 'Reto: optimización con derivadas', 'challenge',
 'matematicas', 'calculo', 'co_matematicas_10-11_1', 'derivadas_optimizacion',
 15, 17, 10, 11, 4, 20,
 'Aplicar derivadas para resolver problemas de máximos y mínimos', 'kinestesico'),

-- ── LENGUAJE (10) ─────────────────────────────────────────────────────────────
('co_len_1-3_lectura_video_01',
 'Lectura en voz alta: cuentos cortos', 'video',
 'lenguaje', 'comprension_lectora', 'co_lenguaje_1-3_0', 'lectura_fluida',
 6, 9, 1, 3, 1, 8,
 'Leer con fluidez textos narrativos cortos adecuados a la edad', 'auditivo'),

('co_len_1-3_escritura_exercise_01',
 'Escribe tu primera oración', 'exercise',
 'lenguaje', 'produccion_textual', 'co_lenguaje_1-3_1', 'escritura_oraciones',
 6, 9, 1, 3, 1, 10,
 'Escribir oraciones simples con sujeto y predicado con coherencia', 'kinestesico'),

('co_len_4-5_comprension_article_01',
 'Tipos de texto: narrativo, expositivo e informativo', 'article',
 'lenguaje', 'comprension_lectora', 'co_lenguaje_4-5_0', 'tipos_texto',
 9, 11, 4, 5, 2, 10,
 'Identificar y diferenciar los tipos textuales principales y sus estructuras', 'visual'),

('co_len_4-5_ortografia_exercise_01',
 'Ortografía: uso de la b y la v', 'exercise',
 'lenguaje', 'ortografia', 'co_lenguaje_4-5_1', 'ortografia_bv',
 9, 11, 4, 5, 2, 8,
 'Aplicar correctamente las reglas ortográficas de b/v en textos propios', 'kinestesico'),

('co_len_4-5_literatura_article_01',
 'Elementos del cuento: personajes, trama y desenlace', 'article',
 'lenguaje', 'literatura', 'co_lenguaje_4-5_2', 'elementos_cuento',
 9, 11, 4, 5, 2, 9,
 'Identificar los elementos estructurales básicos del cuento', 'visual'),

('co_len_6-7_argumentacion_video_01',
 'Cómo argumentar: tesis, argumento y conclusión', 'video',
 'lenguaje', 'produccion_textual', 'co_lenguaje_6-7_1', 'argumentacion',
 11, 13, 6, 7, 3, 10,
 'Producir textos argumentativos con estructura lógica y evidencia', 'auditivo'),

('co_len_6-7_narrativa_article_01',
 'García Márquez y el realismo mágico', 'article',
 'lenguaje', 'literatura', 'co_lenguaje_6-7_2', 'narrativa_colombiana',
 11, 13, 6, 7, 2, 12,
 'Analizar los rasgos del realismo mágico en la narrativa hispanoamericana', 'visual'),

('co_len_8-9_argumentacion_challenge_01',
 'Debate: construye y defiende tu argumento', 'challenge',
 'lenguaje', 'produccion_textual', 'co_lenguaje_8-9_0', 'debate_argumentado',
 13, 15, 8, 9, 3, 15,
 'Construir y sustentar argumentos sólidos en un debate estructurado', 'auditivo'),

('co_len_8-9_medios_article_01',
 'Evalúa la veracidad de noticias digitales', 'article',
 'lenguaje', 'media_literacy', 'co_lenguaje_8-9_2', 'evaluacion_fuentes',
 13, 15, 8, 9, 3, 11,
 'Evaluar críticamente la credibilidad y sesgo de textos de medios digitales', 'visual'),

('co_len_10-11_texto_academico_exercise_01',
 'Ensayo académico: estructura y citas APA', 'exercise',
 'lenguaje', 'produccion_textual', 'co_lenguaje_10-11_0', 'ensayo_academico',
 15, 17, 10, 11, 4, 20,
 'Producir ensayos académicos con rigor argumentativo y citación correcta', 'kinestesico'),

-- ── CIENCIAS NATURALES (10) ───────────────────────────────────────────────────
('co_cn_1-3_seres_vivos_video_01',
 'Los seres vivos y sus características', 'video',
 'ciencias_naturales', 'biologia', 'co_ciencias_naturales_1-3_0', 'seres_vivos',
 6, 9, 1, 3, 1, 8,
 'Identificar y clasificar seres vivos del entorno según sus características', 'visual'),

('co_cn_1-3_ciclos_article_01',
 'El ciclo del agua', 'article',
 'ciencias_naturales', 'ecologia', 'co_ciencias_naturales_1-3_1', 'ciclo_agua',
 6, 9, 1, 3, 1, 9,
 'Describir las etapas del ciclo del agua y su importancia para la vida', 'visual'),

('co_cn_4-5_celula_video_01',
 'La célula: la unidad de la vida', 'video',
 'ciencias_naturales', 'biologia', 'co_ciencias_naturales_4-5_0', 'celula',
 9, 11, 4, 5, 2, 10,
 'Identificar las partes principales de la célula y sus funciones básicas', 'visual'),

('co_cn_4-5_cuerpo_humano_article_01',
 'Los sistemas del cuerpo humano', 'article',
 'ciencias_naturales', 'biologia', 'co_ciencias_naturales_4-5_1', 'sistemas_cuerpo',
 9, 11, 4, 5, 2, 11,
 'Describir los sistemas del cuerpo humano y sus funciones coordinadas', 'visual'),

('co_cn_4-5_energia_exercise_01',
 'Tipos de energía: transforma y clasifica', 'exercise',
 'ciencias_naturales', 'fisica', 'co_ciencias_naturales_4-5_2', 'tipos_energia',
 9, 11, 4, 5, 2, 9,
 'Clasificar tipos de energía e identificar sus transformaciones cotidianas', 'kinestesico'),

('co_cn_6-7_genetica_article_01',
 'Herencia genética: genes y cromosomas', 'article',
 'ciencias_naturales', 'genetica', 'co_ciencias_naturales_6-7_1', 'herencia_genetica',
 11, 13, 6, 7, 3, 12,
 'Comprender los principios de la herencia mendeliana y su expresión fenotípica', 'visual'),

('co_cn_6-7_newton_video_01',
 'Las 3 Leyes de Newton con ejemplos reales', 'video',
 'ciencias_naturales', 'fisica', 'co_ciencias_naturales_6-7_2', 'leyes_newton',
 11, 13, 6, 7, 2, 10,
 'Describir y aplicar las tres Leyes de Newton a situaciones cotidianas', 'auditivo'),

('co_cn_8-9_quimica_exercise_01',
 'Balanceo de ecuaciones químicas', 'exercise',
 'ciencias_naturales', 'quimica', 'co_ciencias_naturales_8-9_0', 'estequiometria',
 13, 15, 8, 9, 3, 13,
 'Balancear ecuaciones químicas aplicando la ley de conservación de la masa', 'kinestesico'),

('co_cn_8-9_genetica_article_01',
 'ADN, ARN y síntesis de proteínas', 'article',
 'ciencias_naturales', 'genetica', 'co_ciencias_naturales_8-9_2', 'flujo_informacion_genetica',
 13, 15, 8, 9, 3, 12,
 'Explicar el flujo de información genética desde el ADN hasta la proteína', 'visual'),

('co_cn_10-11_electromagnetismo_video_01',
 'Electromagnetismo: campos y fuerzas', 'video',
 'ciencias_naturales', 'fisica', 'co_ciencias_naturales_10-11_1', 'electromagnetismo',
 15, 17, 10, 11, 4, 14,
 'Analizar fenómenos electromagnéticos y sus aplicaciones tecnológicas', 'visual'),

-- ── CIENCIAS SOCIALES (8) ─────────────────────────────────────────────────────
('co_cs_1-3_familia_video_01',
 'Mi familia y mi comunidad', 'video',
 'ciencias_sociales', 'convivencia', 'co_ciencias_sociales_1-3_0', 'familia_comunidad',
 6, 9, 1, 3, 1, 7,
 'Reconocer el rol propio en la familia, la escuela y la comunidad cercana', 'visual'),

('co_cs_1-3_colombia_article_01',
 'Colombia en el mapa del mundo', 'article',
 'ciencias_sociales', 'geografia', 'co_ciencias_sociales_1-3_1', 'colombia_geografica',
 6, 9, 1, 3, 1, 8,
 'Ubicar Colombia en el mapa de América y el mundo', 'visual'),

('co_cs_4-5_historia_article_01',
 'La Independencia de Colombia', 'article',
 'ciencias_sociales', 'historia', 'co_ciencias_sociales_4-5_0', 'independencia',
 9, 11, 4, 5, 2, 10,
 'Comprender las causas, hechos y consecuencias del proceso de independencia colombiana', 'visual'),

('co_cs_4-5_regiones_video_01',
 'Las 6 regiones naturales de Colombia', 'video',
 'ciencias_sociales', 'geografia', 'co_ciencias_sociales_4-5_1', 'regiones_colombia',
 9, 11, 4, 5, 2, 9,
 'Describir las características físicas y culturales de las regiones de Colombia', 'visual'),

('co_cs_6-7_linea_tiempo_exercise_01',
 'Crea tu línea de tiempo histórica', 'exercise',
 'ciencias_sociales', 'historia', 'co_ciencias_sociales_6-7_0', 'linea_tiempo',
 11, 13, 6, 7, 2, 12,
 'Ubicar eventos históricos en líneas de tiempo con escala cronológica correcta', 'kinestesico'),

('co_cs_6-7_estado_article_01',
 'La organización del Estado colombiano', 'article',
 'ciencias_sociales', 'educacion_civica', 'co_ciencias_sociales_6-7_2', 'estado_colombiano',
 11, 13, 6, 7, 2, 10,
 'Comprender las ramas del poder público y la organización del Estado', 'visual'),

('co_cs_8-9_conflicto_challenge_01',
 'Debate: causas y soluciones del conflicto armado', 'challenge',
 'ciencias_sociales', 'historia', 'co_ciencias_sociales_8-9_2', 'conflicto_armado',
 13, 15, 8, 9, 4, 18,
 'Evaluar el conflicto armado colombiano desde perspectivas múltiples con evidencia', 'auditivo'),

('co_cs_10-11_economia_article_01',
 'Modelos económicos: liberalismo y neoliberalismo', 'article',
 'ciencias_sociales', 'economia', 'co_ciencias_sociales_10-11_0', 'modelos_economicos',
 15, 17, 10, 11, 4, 15,
 'Analizar las características y efectos sociales de los principales modelos económicos', 'visual'),

-- ── INGLÉS (8) ────────────────────────────────────────────────────────────────
('co_ing_1-3_vocabulario_game_01',
 'English Words: colors and numbers', 'game',
 'ingles', 'vocabulario', 'co_ingles_1-3_0', 'vocabulario_basico',
 6, 9, 1, 3, 1, 8,
 'Recognize and use basic English vocabulary for colors, numbers and classroom objects', 'visual'),

('co_ing_1-3_instrucciones_video_01',
 'Classroom instructions: stand up, sit down!', 'video',
 'ingles', 'comunicacion_oral', 'co_ingles_1-3_1', 'instrucciones_aula',
 6, 9, 1, 3, 1, 7,
 'Respond correctly to simple classroom instructions in English', 'auditivo'),

('co_ing_4-5_frases_exercise_01',
 'Simple sentences about my daily routine', 'exercise',
 'ingles', 'produccion_oral', 'co_ingles_4-5_0', 'rutina_diaria',
 9, 11, 4, 5, 2, 10,
 'Communicate in English using simple phrases about daily activities', 'kinestesico'),

('co_ing_4-5_lectura_article_01',
 'Reading time: short stories in English', 'article',
 'ingles', 'comprension_lectora', 'co_ingles_4-5_1', 'lectura_textos_cortos',
 9, 11, 4, 5, 2, 10,
 'Read and understand short texts in English with guided comprehension questions', 'visual'),

('co_ing_6-7_tiempos_verbales_video_01',
 'Past simple vs. present perfect', 'video',
 'ingles', 'gramatica', 'co_ingles_6-7_0', 'tiempos_verbales',
 11, 13, 6, 7, 3, 11,
 'Use past simple and present perfect correctly to describe past events', 'auditivo'),

('co_ing_6-7_parrafos_exercise_01',
 'Write a paragraph about your neighborhood', 'exercise',
 'ingles', 'produccion_escrita', 'co_ingles_6-7_2', 'escritura_parrafos',
 11, 13, 6, 7, 3, 12,
 'Write coherent paragraphs in English on familiar topics with correct structure', 'kinestesico'),

('co_ing_8-9_opinion_challenge_01',
 'Express your opinion: agree or disagree?', 'challenge',
 'ingles', 'comunicacion_oral', 'co_ingles_8-9_0', 'expresar_opinion',
 13, 15, 8, 9, 3, 14,
 'Express and support personal opinions in English with appropriate discourse markers', 'auditivo'),

('co_ing_10-11_academic_article_01',
 'Academic reading: science and technology texts', 'article',
 'ingles', 'comprension_lectora', 'co_ingles_10-11_0', 'lectura_academica',
 15, 17, 10, 11, 4, 15,
 'Understand authentic academic texts in English on science and technology topics', 'visual'),

-- ── TECNOLOGÍA (6) ────────────────────────────────────────────────────────────
('co_tec_1-3_herramientas_video_01',
 'Conoce tu computadora', 'video',
 'tecnologia', 'informatica_basica', 'co_tecnologia_1-3_0', 'partes_computadora',
 6, 9, 1, 3, 1, 7,
 'Identificar las partes principales del computador y su función', 'visual'),

('co_tec_4-5_algoritmos_exercise_01',
 'Mi primer algoritmo: paso a paso', 'exercise',
 'tecnologia', 'pensamiento_computacional', 'co_tecnologia_4-5_1', 'algoritmos_basicos',
 9, 11, 4, 5, 2, 12,
 'Crear y representar algoritmos sencillos usando diagramas de flujo', 'kinestesico'),

('co_tec_6-7_programacion_challenge_01',
 'Programación visual: crea tu primer juego con Scratch', 'challenge',
 'tecnologia', 'programacion', 'co_tecnologia_6-7_0', 'programacion_scratch',
 11, 13, 6, 7, 2, 20,
 'Programar una aplicación simple usando bloques visuales en Scratch', 'kinestesico'),

('co_tec_8-9_web_exercise_01',
 'Construye tu primera página web con HTML y CSS', 'exercise',
 'tecnologia', 'desarrollo_web', 'co_tecnologia_8-9_1', 'html_css_basico',
 13, 15, 8, 9, 3, 25,
 'Crear una página web básica estructurada con HTML5 y estilizada con CSS3', 'kinestesico'),

('co_tec_8-9_impacto_article_01',
 'IA y sociedad: beneficios y riesgos', 'article',
 'tecnologia', 'pensamiento_critico', 'co_tecnologia_8-9_2', 'impacto_ia',
 13, 15, 8, 9, 3, 11,
 'Analizar el impacto social, ético y económico de las tecnologías emergentes', 'visual'),

('co_tec_10-11_proyecto_challenge_01',
 'Proyecto final: solución tecnológica para tu comunidad', 'challenge',
 'tecnologia', 'proyectos', 'co_tecnologia_10-11_0', 'proyecto_software',
 15, 17, 10, 11, 4, 30,
 'Desarrollar un proyecto de software funcional que resuelva un problema comunitario real', 'kinestesico')

ON CONFLICT (id) DO NOTHING;
