import { saveQuiz } from '@/lib/quiz-database'
import { Quiz, QuizGeneratorForm, QuizQuestion } from '@/types/quiz'
import { Result } from '@/types/result.type'

export async function generateQuiz(
  formData: QuizGeneratorForm,
  userId: string,
  files?: File[],
): Promise<Result<Quiz>> {
  try {
    let vectorStoreId: string | undefined
    let useFiles = false

    // Si hay archivos, subirlos primero a OpenAI
    if (files && files.length > 0) {
      const fileFormData = new FormData()
      files.forEach((file) => fileFormData.append('files', file))

      const uploadResponse = await fetch('/api/upload-files', {
        method: 'POST',
        body: fileFormData,
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResult.success) {
        return {
          success: false,
          errorMessage:
            uploadResult.errorMessage || 'Error al subir los archivos',
        }
      }

      vectorStoreId = uploadResult.data.vectorStoreId
      useFiles = true
    }

    // Llamar al endpoint de generación de quiz
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        useFiles,
        vectorStoreId,
      }),
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
      isPublic: false,
    }

    // Guardar el quiz en la base de datos
    const saveResult = await saveQuiz(quiz, userId, useFiles)
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
