import { OpenAiApi } from '@/api/OpenAiApi'
import { ChatCompletionResponse } from '@/api/responses/ChatCompletionResponse'
import { saveQuiz } from '@/lib/quiz-database'
import { Quiz, QuizGeneratorForm, QuizQuestion } from '@/types/quiz'
import { Result } from '@/types/result.type'

export async function generateQuiz(
  formData: QuizGeneratorForm,
  userId: string,
): Promise<Result<Quiz>> {
  try {
    const { data } = await OpenAiApi.post<ChatCompletionResponse>(
      'v1/chat/completions',
      {
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that generates quiz questions and answers for a given subject and topic.',
          },
          {
            role: 'developer',
            content: `I want you to generate a quiz in JSON format.  
  
  Input parameters:  
  - Number of questions: ${formData.questionCount}  
  - Subject: ${formData.subject}  
  - Topics: ${formData.topics.join(', ')}  
  - Difficulty: ${formData.difficulty}  
  
  Output requirements:  
  1. The JSON must contain an array called "questions".  
  2. Each element of the array should have the following structure:  
     - "id": string (e.g., "q1", "q2", etc.)  
     - "question": string (the question text).  
     - "options": string[] (array of answer options).  
     - "correctAnswer": number (index of the correct answer, starting from 0).  
     - "explanation": string (optional, explanation of why the answer is correct).  
  
  Example structure:  
  
  {
    "questions": [
      {
        "id": "q1",
        "question": "What is the capital of France?",
        "options": ["Madrid", "Paris", "Rome", "Berlin"],
        "correctAnswer": 1,
        "explanation": "Paris is the capital of France."
      }
    ]
  }
  
  Please generate the quiz now based on the provided parameters.
  `,
          },
        ],
      },
    )

    const questions = (
      JSON.parse(data.choices[0].message.content) as {
        questions: QuizQuestion[]
      }
    ).questions

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
