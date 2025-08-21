-- MIGRACIÓN DE SUPABASE PARA QUIZ GENERATOR
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- Crear tabla de quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    topics TEXT[] NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    time_limit INTEGER, -- en minutos
    is_public BOOLEAN DEFAULT FALSE, -- columna para visibilidad pública/privada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de preguntas
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de resultados de quiz
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_spent INTEGER NOT NULL, -- en segundos
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de respuestas individuales
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_result_id UUID REFERENCES quiz_results(id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_answer INTEGER NOT NULL,
    time_spent NUMERIC NOT NULL, -- en segundos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(quiz_id, question_order);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_result_id ON quiz_answers(quiz_result_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en quizzes
CREATE OR REPLACE TRIGGER update_quizzes_updated_at 
    BEFORE UPDATE ON quizzes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Políticas para quizzes
-- Los usuarios solo pueden ver sus propios quizzes
CREATE POLICY "Users can view their own quizzes" ON quizzes
    FOR SELECT USING (auth.uid() = created_by);

-- Los usuarios solo pueden crear quizzes para sí mismos
CREATE POLICY "Users can create their own quizzes" ON quizzes
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Los usuarios solo pueden actualizar sus propios quizzes
CREATE POLICY "Users can update their own quizzes" ON quizzes
    FOR UPDATE USING (auth.uid() = created_by);

-- Los usuarios solo pueden eliminar sus propios quizzes
CREATE POLICY "Users can delete their own quizzes" ON quizzes
    FOR DELETE USING (auth.uid() = created_by);

-- Políticas para quiz_questions
-- Los usuarios solo pueden ver preguntas de sus propios quizzes
CREATE POLICY "Users can view questions from their own quizzes" ON quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

-- Los usuarios solo pueden crear preguntas para sus propios quizzes
CREATE POLICY "Users can create questions for their own quizzes" ON quiz_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

-- Los usuarios solo pueden actualizar preguntas de sus propios quizzes
CREATE POLICY "Users can update questions for their own quizzes" ON quiz_questions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

-- Los usuarios solo pueden eliminar preguntas de sus propios quizzes
CREATE POLICY "Users can delete questions for their own quizzes" ON quiz_questions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

-- Políticas para quiz_results
-- Los usuarios solo pueden ver sus propios resultados
CREATE POLICY "Users can view their own quiz results" ON quiz_results
    FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios solo pueden crear sus propios resultados
CREATE POLICY "Users can create their own quiz results" ON quiz_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propios resultados
CREATE POLICY "Users can update their own quiz results" ON quiz_results
    FOR UPDATE USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propios resultados
CREATE POLICY "Users can delete their own quiz results" ON quiz_results
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para quiz_answers
-- Los usuarios pueden ver respuestas de sus propios resultados
CREATE POLICY "Users can view their own quiz answers" ON quiz_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quiz_results 
            WHERE id = quiz_result_id AND user_id = auth.uid()
        )
    );

-- Los usuarios solo pueden crear respuestas para sus propios resultados
CREATE POLICY "Users can create answers for their own results" ON quiz_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM quiz_results 
            WHERE id = quiz_result_id AND user_id = auth.uid()
        )
    );

-- Los creadores de quizzes pueden ver las respuestas a sus quizzes
CREATE POLICY "Quiz creators can view answers to their quizzes" ON quiz_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quiz_results qr
            JOIN quizzes q ON qr.quiz_id = q.id
            WHERE qr.id = quiz_result_id AND q.created_by = auth.uid()
        )
    );

-- =============================================================================
-- MIGRACIÓN PARA BASES DE DATOS EXISTENTES
-- Ejecutar este bloque solo si ya tienes la tabla quizzes creada sin is_public
-- =============================================================================

-- Añadir columna is_public a tabla existente
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Crear índice para optimizar búsquedas por quizzes públicos
CREATE INDEX IF NOT EXISTS idx_quizzes_is_public ON quizzes(is_public);

-- Actualizar políticas RLS para permitir acceso a quizzes públicos
-- Eliminar política existente si existe
DROP POLICY IF EXISTS "Users can view their own quizzes" ON quizzes;

-- Nueva política: Los usuarios pueden ver sus propios quizzes Y los quizzes públicos
CREATE POLICY "Users can view own and public quizzes" ON quizzes
    FOR SELECT USING (auth.uid() = created_by OR is_public = true);

-- Eliminar política existente para quiz_questions
DROP POLICY IF EXISTS "Users can view questions from their own quizzes" ON quiz_questions;

-- Nueva política: Los usuarios pueden ver preguntas de sus propios quizzes Y de quizzes públicos
CREATE POLICY "Users can view questions from own and public quizzes" ON quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE id = quiz_id AND (created_by = auth.uid() OR is_public = true)
        )
    );

-- Política adicional: Cualquier usuario autenticado puede ver quizzes públicos
CREATE POLICY "Anyone can view public quizzes" ON quizzes
    FOR SELECT USING (is_public = true);

-- Política adicional: Cualquier usuario autenticado puede ver preguntas de quizzes públicos
CREATE POLICY "Anyone can view public quiz questions" ON quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE id = quiz_id AND is_public = true
        )
    );
