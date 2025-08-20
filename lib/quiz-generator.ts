import { saveQuiz } from '@/lib/quiz-database'
import { Quiz, QuizGeneratorForm, QuizQuestion } from '@/types/quiz'
import { Result } from '@/types/result.type'

export async function generateQuiz(
  formData: QuizGeneratorForm,
  userId: string,
): Promise<Result<Quiz>> {
  try {
    // Llamar al nuevo endpoint API interno
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const result = await response.json()

    if (!result.success) {
      return {
        success: false,
        errorMessage: result.errorMessage || 'Error al generar el quiz',
      }
    }

    const questions: QuizQuestion[] = result.data

    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: `${formData.subject} - ${formData.topics.join(', ')} Quiz`,
      subject: formData.subject,
      topics: formData.topics,
      questions,
      createdAt: new Date(),
      createdBy: userId,
      difficulty: formData.difficulty,
      timeLimit: formData.timeLimit,
    }

    // Guardar el quiz en la base de datos
    const saveResult = await saveQuiz(quiz, userId)
    if (!saveResult.success) {
      console.error(
        'Error al guardar quiz en la base de datos:',
        saveResult.errorMessage,
      )
      // Aún devolvemos el quiz generado para que el usuario pueda usarlo
      // aunque no se haya guardado en la base de datos
    } else {
      // Actualizar el ID del quiz con el ID de la base de datos
      quiz.id = saveResult.data!
    }

    return {
      success: true,
      data: quiz,
    }
  } catch (error: any) {
    console.log(error)
    return {
      success: false,
      errorMessage: error.message,
    }
  }
}
