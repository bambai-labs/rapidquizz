-- Test Script 1: Quizzes sin archivos a la mitad (10/20)
-- Este script inserta 10 quizzes sin archivos para un usuario de prueba

-- Usuario de prueba: b336618a-6313-4420-846e-3606d90548a4

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
-- Quiz 1
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia Mundial', 'Historia', ARRAY['civilizaciones', 'guerras', 'imperios'], 'medium', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
-- Quiz 2
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Matemáticas Básicas', 'Matemáticas', ARRAY['álgebra', 'geometría', 'aritmética'], 'easy', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
-- Quiz 3
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Ciencias Naturales', 'Ciencias', ARRAY['biología', 'química', 'física'], 'medium', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
-- Quiz 4
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Literatura', 'Literatura', ARRAY['novelas', 'poesía', 'teatro'], 'hard', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
-- Quiz 5
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Geografía', 'Geografía', ARRAY['países', 'capitales', 'continentes'], 'easy', false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
-- Quiz 6
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Deportes', 'Deportes', ARRAY['fútbol', 'baloncesto', 'tenis'], 'medium', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
-- Quiz 7
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Tecnología', 'Tecnología', ARRAY['programación', 'inteligencia artificial', 'redes'], 'medium', false, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
-- Quiz 8
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Arte', 'Arte', ARRAY['pintura', 'escultura', 'arquitectura'], 'hard', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
-- Quiz 9
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Música', 'Música', ARRAY['clásica', 'jazz', 'rock'], 'medium', false, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
-- Quiz 10
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Filosofía', 'Filosofía', ARRAY['ética', 'metafísica', 'lógica'], 'hard', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Verificar los datos insertados
SELECT 
  COUNT(*) as total_quizzes,
  COUNT(CASE WHEN has_files = true THEN 1 END) as with_files,
  COUNT(CASE WHEN has_files = false OR has_files IS NULL THEN 1 END) as without_files
FROM quizzes 
WHERE created_by = 'b336618a-6313-4420-846e-3606d90548a4' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- Resultado esperado: 10 quizzes sin archivos, 0 con archivos
-- Límites restantes: sin archivos = 10/20, con archivos = 5/5
