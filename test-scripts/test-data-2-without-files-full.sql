-- Test Script 2: Quizzes sin archivos lleno (20/20), con archivos vacío (0/5)
-- Este script inserta 20 quizzes sin archivos para alcanzar el límite

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
-- Quizzes 1-10
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia Antigua', 'Historia', ARRAY['roma', 'grecia', 'egipto'], 'medium', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Matemáticas Álgebra', 'Matemáticas', ARRAY['ecuaciones', 'funciones', 'polinomios'], 'hard', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Biología Celular', 'Biología', ARRAY['células', 'mitosis', 'ADN'], 'medium', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Física Mecánica', 'Física', ARRAY['fuerzas', 'movimiento', 'energía'], 'hard', false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Química Orgánica', 'Química', ARRAY['carbono', 'hidrocarburos', 'reacciones'], 'hard', false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Geografía Mundial', 'Geografía', ARRAY['océanos', 'montañas', 'ríos'], 'easy', false, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Literatura Española', 'Literatura', ARRAY['cervantes', 'lorca', 'machado'], 'medium', false, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Historia Contemporánea', 'Historia', ARRAY['siglo XX', 'guerras mundiales', 'revolución'], 'medium', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Economía Básica', 'Economía', ARRAY['oferta', 'demanda', 'mercado'], 'medium', false, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Psicología', 'Psicología', ARRAY['conducta', 'cognición', 'emociones'], 'medium', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- Quizzes 11-20
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Informática', 'Informática', ARRAY['algoritmos', 'bases de datos', 'programación'], 'hard', false, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Arte Renacentista', 'Arte', ARRAY['leonardo', 'miguel ángel', 'rafael'], 'medium', false, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Música Clásica', 'Música', ARRAY['bach', 'mozart', 'beethoven'], 'medium', false, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Filosofía Moderna', 'Filosofía', ARRAY['descartes', 'kant', 'nietzsche'], 'hard', false, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Deportes Olímpicos', 'Deportes', ARRAY['atletismo', 'natación', 'gimnasia'], 'easy', false, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Astronomía', 'Astronomía', ARRAY['planetas', 'estrellas', 'galaxias'], 'medium', false, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Mitología Griega', 'Mitología', ARRAY['zeus', 'poseidón', 'atenea'], 'medium', false, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Cocina Internacional', 'Cocina', ARRAY['italiana', 'francesa', 'asiática'], 'easy', false, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Cine Clásico', 'Cine', ARRAY['hitchcock', 'chaplin', 'welles'], 'medium', false, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
(gen_random_uuid(), 'b336618a-6313-4420-846e-3606d90548a4', 'Quiz de Medicina General', 'Medicina', ARRAY['anatomía', 'fisiología', 'patología'], 'hard', false, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

-- Verificar los datos insertados
SELECT 
  COUNT(*) as total_quizzes,
  COUNT(CASE WHEN has_files = true THEN 1 END) as with_files,
  COUNT(CASE WHEN has_files = false OR has_files IS NULL THEN 1 END) as without_files
FROM quizzes 
WHERE created_by = 'b336618a-6313-4420-846e-3606d90548a4' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- Resultado esperado: 20 quizzes sin archivos, 0 con archivos
-- Límites restantes: sin archivos = 0/20 (LLENO), con archivos = 5/5
