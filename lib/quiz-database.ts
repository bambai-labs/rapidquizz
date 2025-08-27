import { createClient } from '@/lib/supabase/client'
import { Quiz, QuizAnswer, QuizResult } from '@/types/quiz'
import { Result } from '@/types/result.type'

// Tipo específico para las respuestas de la base de datos
interface DatabaseQuizResult {
  id: string
  user_id: string
  score: number
  total_questions: number
  time_spent: number
  completed_at: string
  created_at: string
  // Información del usuario
  user_profile?: {
    email: string
    raw_user_meta_data?: {
      name?: string
      username?: string
    }
  }
}

/**
 * Guarda un quiz completo en la base de datos
 */
export async function saveQuiz(
  quiz: Quiz,
  userId: string,
  hasFiles: boolean = false,
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
        is_public: quiz.isPublic || false,
        has_files: hasFiles,
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
      isPublic: quizData.is_public || false,
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
 * Carga un quiz que puede ser público o del usuario actual
 * Esta función permite cargar quizzes públicos sin restricciones de usuario
 */
export async function loadQuizForSharing(
  quizId: string,
  userId?: string,
): Promise<Result<Quiz>> {
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

    // Verificar si el usuario tiene acceso al quiz
    const isOwner = userId && quizData.created_by === userId
    const isPublic = quizData.is_public

    if (!isPublic && !isOwner) {
      return {
        success: false,
        errorMessage: 'No tienes permisos para acceder a este quiz',
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
      isPublic: quizData.is_public || false,
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
      isPublic: quizData.is_public || false,
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
 * Actualiza un quiz existente en la base de datos
 */
export async function updateQuiz(
  quiz: Quiz,
  userId: string,
): Promise<Result<void>> {
  const supabase = createClient()

  try {
    // Verificar que el usuario es el propietario del quiz
    const { data: quizData, error: checkError } = await supabase
      .from('quizzes')
      .select('created_by')
      .eq('id', quiz.id)
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
        errorMessage: 'No tienes permisos para editar este quiz',
      }
    }

    // Actualizar datos del quiz principal
    const { error: updateQuizError } = await supabase
      .from('quizzes')
      .update({
        title: quiz.title,
        subject: quiz.subject,
        topics: quiz.topics,
        difficulty: quiz.difficulty,
        time_limit: quiz.timeLimit,
        is_public: quiz.isPublic || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quiz.id)

    if (updateQuizError) {
      console.error('Error al actualizar quiz:', updateQuizError)
      return {
        success: false,
        errorMessage: `Error al actualizar el quiz: ${updateQuizError.message}`,
      }
    }

    // Eliminar preguntas existentes
    const { error: deleteQuestionsError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', quiz.id)

    if (deleteQuestionsError) {
      console.error(
        'Error al eliminar preguntas existentes:',
        deleteQuestionsError,
      )
      return {
        success: false,
        errorMessage: `Error al eliminar preguntas existentes: ${deleteQuestionsError.message}`,
      }
    }

    // Insertar nuevas preguntas
    const questionsToInsert = quiz.questions.map((question, index) => ({
      quiz_id: quiz.id,
      question_text: question.question,
      options: question.options,
      correct_answer: question.correctAnswer,
      explanation: question.explanation,
      question_order: index,
    }))

    const { error: insertQuestionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)

    if (insertQuestionsError) {
      console.error('Error al insertar nuevas preguntas:', insertQuestionsError)
      return {
        success: false,
        errorMessage: `Error al actualizar las preguntas: ${insertQuestionsError.message}`,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error inesperado al actualizar quiz:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Actualiza la visibilidad de un quiz (público/privado)
 */
export async function updateQuizVisibility(
  quizId: string,
  isPublic: boolean,
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
        errorMessage: 'No tienes permisos para modificar este quiz',
      }
    }

    // Actualizar la visibilidad del quiz
    const { error: updateError } = await supabase
      .from('quizzes')
      .update({
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quizId)

    if (updateError) {
      console.error('Error al actualizar visibilidad:', updateError)
      return {
        success: false,
        errorMessage: `Error al actualizar la visibilidad: ${updateError.message}`,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error inesperado al actualizar visibilidad:', error)
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

/**
 * Obtiene todos los resultados/intentos de un quiz específico
 */
export async function getQuizResponses(
  quizId: string,
  userId: string,
): Promise<Result<DatabaseQuizResult[]>> {
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
        errorMessage: 'No tienes permisos para ver las respuestas de este quiz',
      }
    }

    // Obtener todos los resultados del quiz
    const { data: results, error: resultsError } = await supabase
      .from('quiz_results')
      .select(
        `
        id,
        user_id,
        score,
        total_questions,
        time_spent,
        completed_at,
        created_at
      `,
      )
      .eq('quiz_id', quizId)
      .order('completed_at', { ascending: false })

    if (resultsError) {
      return {
        success: false,
        errorMessage: `Error al obtener resultados: ${resultsError.message}`,
      }
    }

    // Obtener IDs únicos de usuarios para consultar su información
    const userIds = (results || []).map((r) => r.user_id)
    const uniqueUserIds = Array.from(new Set(userIds))

    // Obtener información de usuarios desde la tabla de perfiles de usuario
    // En lugar de auth.users, usaremos la información disponible del usuario actual
    // o una tabla de perfiles personalizada si existe
    const enrichedResults = (results || []).map((result) => ({
      ...result,
      user_profile: {
        email: '', // Placeholder - será llenado por el frontend
        raw_user_meta_data: {
          name: '', // Placeholder - será llenado por el frontend
          username: '', // Placeholder - será llenado por el frontend
        },
      },
    }))

    return {
      success: true,
      data: enrichedResults,
    }
  } catch (error: any) {
    console.error('Error inesperado al obtener respuestas:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}

/**
 * Obtiene las respuestas detalladas de un intento específico
 */
export async function getQuizAttemptDetails(
  quizResultId: string,
  userId: string,
): Promise<Result<any>> {
  const supabase = createClient()

  try {
    // Primero, obtener la información del resultado
    const { data: resultData, error: resultError } = await supabase
      .from('quiz_results')
      .select(
        `
        id,
        quiz_id,
        user_id,
        score,
        total_questions,
        time_spent,
        completed_at
      `,
      )
      .eq('id', quizResultId)
      .single()

    if (resultError) {
      return {
        success: false,
        errorMessage: `Error al obtener resultado: ${resultError.message}`,
      }
    }

    if (!resultData) {
      return {
        success: false,
        errorMessage: 'No se encontró el resultado del quiz',
      }
    }

    // Luego, verificar que el usuario es el propietario del quiz
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('created_by, title')
      .eq('id', resultData.quiz_id)
      .single()

    if (quizError) {
      return {
        success: false,
        errorMessage: `Error al obtener información del quiz: ${quizError.message}`,
      }
    }

    if (!quizData) {
      return {
        success: false,
        errorMessage: 'No se encontró el quiz asociado',
      }
    }

    if (quizData.created_by !== userId) {
      return {
        success: false,
        errorMessage: 'No tienes permisos para ver este resultado',
      }
    }

    // Obtener las respuestas detalladas con las preguntas
    const { data: answers, error: answersError } = await supabase
      .from('quiz_answers')
      .select(
        `
        id,
        selected_answer,
        time_spent,
        question_id,
        quiz_questions!inner(
          id,
          question_text,
          options,
          correct_answer,
          explanation,
          question_order
        )
      `,
      )
      .eq('quiz_result_id', quizResultId)

    if (answersError) {
      return {
        success: false,
        errorMessage: `Error al obtener respuestas: ${answersError.message}`,
      }
    }

    // Ordenar las respuestas por question_order
    const sortedAnswers = (answers || []).sort((a, b) => {
      const questionA = Array.isArray(a.quiz_questions)
        ? a.quiz_questions[0]
        : a.quiz_questions
      const questionB = Array.isArray(b.quiz_questions)
        ? b.quiz_questions[0]
        : b.quiz_questions
      const orderA = questionA?.question_order || 0
      const orderB = questionB?.question_order || 0
      return orderA - orderB
    })

    return {
      success: true,
      data: {
        result: {
          ...resultData,
          user_profile: {
            email: '', // Placeholder - será llenado por el frontend
            raw_user_meta_data: {
              name: '', // Placeholder - será llenado por el frontend
              username: '', // Placeholder - será llenado por el frontend
            },
          },
          quizzes: quizData,
        },
        answers: sortedAnswers,
      },
    }
  } catch (error: any) {
    console.error('Error inesperado al obtener detalles del intento:', error)
    return {
      success: false,
      errorMessage: `Error inesperado: ${error.message}`,
    }
  }
}
