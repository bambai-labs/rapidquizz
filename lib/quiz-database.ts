import { createClient } from '@/lib/supabase/client'
import { Quiz, QuizAnswer, QuizResult } from '@/types/quiz'
import { Result } from '@/types/result.type'

/**
 * Guarda un quiz completo en la base de datos
 */
export async function saveQuiz(
  quiz: Quiz,
  userId: string,
): Promise<Result<string>> {
  const supabase = createClient()

  try {
    // Guardar el quiz principal
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: quiz.title,
        subject: quiz.subject,
        topics: quiz.topics,
        difficulty: quiz.difficulty,
        time_limit: quiz.timeLimit,
        created_by: userId,
      })
      .select('id')
      .single()

    if (quizError) {
      console.error('Error al guardar quiz:', quizError)
      return {
        success: false,
        errorMessage: `Error al guardar el quiz: ${quizError.message}`,
      }
    }

    const quizId = quizData.id

    // Guardar las preguntas
    const questionsToInsert = quiz.questions.map((question, index) => ({
      quiz_id: quizId,
      question_text: question.question,
      options: question.options,
      correct_answer: question.correctAnswer,
      explanation: question.explanation,
      question_order: index,
    }))

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)

    if (questionsError) {
      console.error('Error al guardar preguntas:', questionsError)
      // Limpiar el quiz si las preguntas fallan
      await supabase.from('quizzes').delete().eq('id', quizId)
      return {
        success: false,
        errorMessage: `Error al guardar las preguntas: ${questionsError.message}`,
      }
    }

    return {
      success: true,
      data: quizId,
    }
  } catch (error: any) {
    console.error('Error inesperado al guardar quiz:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Carga un quiz completo desde la base de datos
 */
export async function loadQuiz(quizId: string): Promise<Result<Quiz>> {
  const supabase = createClient()

  try {
    // Cargar datos del quiz
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single()

    if (quizError) {
      return {
        success: false,
        errorMessage: `Error al cargar quiz: ${quizError.message}`,
      }
    }

    // Cargar preguntas del quiz
    const { data: questionsData, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('question_order')

    if (questionsError) {
      return {
        success: false,
        errorMessage: `Error al cargar preguntas: ${questionsError.message}`,
      }
    }

    // Convertir datos de base de datos a tipos de la aplicación
    const quiz: Quiz = {
      id: quizData.id,
      title: quizData.title,
      subject: quizData.subject,
      topics: quizData.topics,
      difficulty: quizData.difficulty,
      timeLimit: quizData.time_limit,
      createdAt: new Date(quizData.created_at),
      createdBy: quizData.created_by,
      questions: questionsData.map((q) => ({
        id: q.id,
        question: q.question_text,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      })),
    }

    return {
      success: true,
      data: quiz,
    }
  } catch (error: any) {
    console.error('Error inesperado al cargar quiz:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Carga todos los quizzes del usuario actual
 */
export async function loadUserQuizzes(userId: string): Promise<Result<Quiz[]>> {
  const supabase = createClient()

  try {
    const { data: quizzesData, error: quizzesError } = await supabase
      .from('quizzes')
      .select(
        `
        *,
        quiz_questions (*)
      `,
      )
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (quizzesError) {
      return {
        success: false,
        errorMessage: `Error al cargar quizzes: ${quizzesError.message}`,
      }
    }

    const quizzes: Quiz[] = quizzesData.map((quizData: any) => ({
      id: quizData.id,
      title: quizData.title,
      subject: quizData.subject,
      topics: quizData.topics,
      difficulty: quizData.difficulty,
      timeLimit: quizData.time_limit,
      createdAt: new Date(quizData.created_at),
      createdBy: quizData.created_by,
      questions: quizData.quiz_questions
        .sort((a: any, b: any) => a.question_order - b.question_order)
        .map((q: any) => ({
          id: q.id,
          question: q.question_text,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
        })),
    }))

    return {
      success: true,
      data: quizzes,
    }
  } catch (error: any) {
    console.error('Error inesperado al cargar quizzes del usuario:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Guarda el resultado de un quiz
 */
export async function saveQuizResult(
  quizId: string,
  userId: string,
  answers: QuizAnswer[],
  score: number,
  totalQuestions: number,
  timeSpent: number,
): Promise<Result<string>> {
  const supabase = createClient()

  try {
    // Guardar el resultado del quiz
    const { data: resultData, error: resultError } = await supabase
      .from('quiz_results')
      .insert({
        quiz_id: quizId,
        user_id: userId,
        score,
        total_questions: totalQuestions,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (resultError) {
      console.error('Error al guardar resultado:', resultError)
      return {
        success: false,
        errorMessage: `Error al guardar el resultado: ${resultError.message}`,
      }
    }

    const resultId = resultData.id

    // Obtener los IDs de las preguntas para mapear las respuestas
    const { data: questionsData, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, question_order')
      .eq('quiz_id', quizId)
      .order('question_order')

    if (questionsError) {
      return {
        success: false,
        errorMessage: `Error al obtener preguntas: ${questionsError.message}`,
      }
    }

    // Crear el mapeo de respuestas con los IDs de preguntas
    const answersToInsert = answers
      .map((answer, index) => {
        const questionData = questionsData.find(
          (q) => q.question_order === index,
        )
        return {
          quiz_result_id: resultId,
          question_id: questionData?.id || '',
          selected_answer: answer.selectedAnswer,
          time_spent: answer.timeSpent,
        }
      })
      .filter((answer) => answer.question_id !== '')

    // Guardar las respuestas individuales
    const { error: answersError } = await supabase
      .from('quiz_answers')
      .insert(answersToInsert)

    if (answersError) {
      console.error('Error al guardar respuestas:', answersError)
      // Limpiar el resultado si las respuestas fallan
      await supabase.from('quiz_results').delete().eq('id', resultId)
      return {
        success: false,
        errorMessage: `Error al guardar las respuestas: ${answersError.message}`,
      }
    }

    return {
      success: true,
      data: resultId,
    }
  } catch (error: any) {
    console.error('Error inesperado al guardar resultado:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Carga los resultados de un usuario para un quiz específico
 */
export async function loadQuizResults(
  quizId: string,
  userId: string,
): Promise<Result<QuizResult[]>> {
  const supabase = createClient()

  try {
    const { data: resultsData, error: resultsError } = await supabase
      .from('quiz_results')
      .select(
        `
        *,
        quiz_answers (*)
      `,
      )
      .eq('quiz_id', quizId)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (resultsError) {
      return {
        success: false,
        errorMessage: `Error al cargar resultados: ${resultsError.message}`,
      }
    }

    const results: QuizResult[] = resultsData.map((resultData: any) => ({
      id: resultData.id,
      quizId: resultData.quiz_id,
      userId: resultData.user_id,
      score: resultData.score,
      totalQuestions: resultData.total_questions,
      timeSpent: resultData.time_spent,
      completedAt: new Date(resultData.completed_at),
      answers: resultData.quiz_answers.map((answer: any) => ({
        questionId: answer.question_id,
        selectedAnswer: answer.selected_answer,
        timeSpent: answer.time_spent,
      })),
    }))

    return {
      success: true,
      data: results,
    }
  } catch (error: any) {
    console.error('Error inesperado al cargar resultados:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Elimina un quiz y todos sus datos relacionados
 */
export async function deleteQuiz(
  quizId: string,
  userId: string,
): Promise<Result<void>> {
  const supabase = createClient()

  try {
    // Verificar que el usuario es el propietario del quiz
    const { data: quizData, error: checkError } = await supabase
      .from('quizzes')
      .select('created_by')
      .eq('id', quizId)
      .single()

    if (checkError) {
      return {
        success: false,
        errorMessage: `Error al verificar propietario: ${checkError.message}`,
      }
    }

    if (quizData.created_by !== userId) {
      return {
        success: false,
        errorMessage: 'No tienes permisos para eliminar este quiz',
      }
    }

    // Eliminar el quiz (las dependencias se eliminan automáticamente por CASCADE)
    const { error: deleteError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (deleteError) {
      return {
        success: false,
        errorMessage: `Error al eliminar quiz: ${deleteError.message}`,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error inesperado al eliminar quiz:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}
