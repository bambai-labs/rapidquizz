-- Test Script 4: Ambos límites llenos - sin archivos (20/20) y con archivos (5/5)
-- Este script inserta 20 quizzes sin archivos y 5 con archivos para alcanzar ambos límites

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

-- 20 Quizzes SIN archivos (has_files = false)
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia Universal', 'Historia', ARRAY['civilizaciones', 'imperios', 'culturas'], 'medium', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Matemáticas Avanzadas', 'Matemáticas', ARRAY['cálculo', 'álgebra', 'estadística'], 'hard', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Biología Molecular', 'Biología', ARRAY['ADN', 'proteínas', 'genética'], 'hard', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Física Cuántica', 'Física', ARRAY['partículas', 'ondas', 'mecánica'], 'hard', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Química Analítica', 'Química', ARRAY['análisis', 'métodos', 'instrumentos'], 'hard', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Geografía Económica', 'Geografía', ARRAY['recursos', 'comercio', 'desarrollo'], 'medium', false, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Literatura Mundial', 'Literatura', ARRAY['clásicos', 'autores', 'géneros'], 'medium', false, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia del Arte', 'Arte', ARRAY['movimientos', 'artistas', 'técnicas'], 'medium', false, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Economía Macro', 'Economía', ARRAY['políticas', 'mercados', 'indicadores'], 'hard', false, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Psicología Cognitiva', 'Psicología', ARRAY['memoria', 'percepción', 'aprendizaje'], 'hard', false, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Informática Avanzada', 'Informática', ARRAY['algoritmos', 'estructuras', 'sistemas'], 'hard', false, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Música Contemporánea', 'Música', ARRAY['compositores', 'estilos', 'instrumentos'], 'medium', false, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Filosofía Contemporánea', 'Filosofía', ARRAY['corrientes', 'pensadores', 'conceptos'], 'hard', false, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Deportes Extremos', 'Deportes', ARRAY['aventura', 'riesgo', 'técnicas'], 'easy', false, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Astronomía Avanzada', 'Astronomía', ARRAY['cosmología', 'astrofísica', 'universo'], 'hard', false, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Mitología Comparada', 'Mitología', ARRAY['dioses', 'leyendas', 'culturas'], 'medium', false, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Gastronomía Molecular', 'Gastronomía', ARRAY['técnicas', 'innovación', 'ciencia'], 'hard', false, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Cine de Autor', 'Cine', ARRAY['directores', 'estilos', 'narrativa'], 'medium', false, NOW() - INTERVAL '23 days', NOW() - INTERVAL '23 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Lingüística Aplicada', 'Lingüística', ARRAY['lenguaje', 'gramática', 'comunicación'], 'hard', false, NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Neurociencia', 'Neurociencia', ARRAY['cerebro', 'neuronas', 'cognición'], 'hard', false, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days');

-- Verificar los datos insertados
SELECT 
  COUNT(*) as total_quizzes,
  COUNT(CASE WHEN has_files = true THEN 1 END) as with_files,
  COUNT(CASE WHEN has_files = false OR has_files IS NULL THEN 1 END) as without_files
FROM quizzes 
WHERE created_by = 'b336618a-6313-4420-846e-3606d90548a4' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- Resultado esperado: 20 quizzes sin archivos, 5 con archivos
-- Límites restantes: sin archivos = 0/20 (LLENO), con archivos = 0/5 (LLENO)
-- Estado: AMBOS LÍMITES ALCANZADOS
