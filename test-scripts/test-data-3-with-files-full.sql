-- Test Script 3: Quizzes con archivos lleno (5/5), sin archivos casi lleno (18/20)
-- Este script inserta 5 quizzes con archivos y 18 sin archivos

INSERT INTO quizzes (
  id,
  created_by,
  title,
  subject,
  topics,
  difficulty,
  has_files,
  created_at,
  updated_at
) VALUES
-- 5 Quizzes CON archivos (has_files = true)
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz Personalizado - Tesis Doctoral', 'Personalizado', ARRAY['investigación', 'metodología', 'análisis'], 'hard', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz Personalizado - Manual Técnico', 'Personalizado', ARRAY['procedimientos', 'especificaciones', 'normas'], 'hard', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz Personalizado - Artículo Científico', 'Personalizado', ARRAY['hipótesis', 'experimentos', 'resultados'], 'hard', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz Personalizado - Libro Especializado', 'Personalizado', ARRAY['teorías', 'conceptos', 'aplicaciones'], 'hard', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz Personalizado - Documentación', 'Personalizado', ARRAY['guías', 'manuales', 'referencias'], 'medium', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

-- 18 Quizzes SIN archivos (has_files = false)
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia Medieval', 'Historia', ARRAY['feudalismo', 'cruzadas', 'imperio'], 'medium', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Matemáticas Geometría', 'Matemáticas', ARRAY['triángulos', 'círculos', 'polígonos'], 'easy', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Biología Marina', 'Biología', ARRAY['océanos', 'peces', 'corales'], 'medium', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Física Óptica', 'Física', ARRAY['luz', 'lentes', 'refracción'], 'hard', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Química Inorgánica', 'Química', ARRAY['metales', 'sales', 'ácidos'], 'medium', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Geografía Física', 'Geografía', ARRAY['relieve', 'clima', 'hidrografía'], 'medium', false, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Literatura Latinoamericana', 'Literatura', ARRAY['boom', 'realismo mágico', 'borges'], 'hard', false, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia de América', 'Historia', ARRAY['colonización', 'independencia', 'culturas'], 'medium', false, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Economía Internacional', 'Economía', ARRAY['comercio', 'globalización', 'divisas'], 'hard', false, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Sociología', 'Sociología', ARRAY['sociedad', 'grupos', 'cultura'], 'medium', false, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Antropología', 'Antropología', ARRAY['evolución', 'culturas', 'etnografía'], 'medium', false, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Arquitectura', 'Arquitectura', ARRAY['diseño', 'construcción', 'estilos'], 'medium', false, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Medicina Básica', 'Medicina', ARRAY['diagnóstico', 'tratamiento', 'prevención'], 'hard', false, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Derecho Civil', 'Derecho', ARRAY['contratos', 'propiedad', 'obligaciones'], 'hard', false, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Ingeniería', 'Ingeniería', ARRAY['diseño', 'cálculos', 'materiales'], 'hard', false, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Estadística', 'Estadística', ARRAY['probabilidad', 'muestras', 'análisis'], 'medium', false, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Marketing', 'Marketing', ARRAY['publicidad', 'ventas', 'mercadeo'], 'easy', false, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Ecología', 'Ecología', ARRAY['ecosistemas', 'biodiversidad', 'conservación'], 'medium', false, NOW() - INTERVAL '23 days', NOW() - INTERVAL '23 days');

-- Verificar los datos insertados
SELECT 
  COUNT(*) as total_quizzes,
  COUNT(CASE WHEN has_files = true THEN 1 END) as with_files,
  COUNT(CASE WHEN has_files = false OR has_files IS NULL THEN 1 END) as without_files
FROM quizzes 
WHERE created_by = 'b336618a-6313-4420-846e-3606d90548a4' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- Resultado esperado: 18 quizzes sin archivos, 5 con archivos
-- Límites restantes: sin archivos = 2/20, con archivos = 0/5 (LLENO)
