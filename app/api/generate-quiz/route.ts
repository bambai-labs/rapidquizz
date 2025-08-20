import { QuizGeneratorForm, QuizQuestion } from '@/types/quiz'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
})

interface QuizGeneratorFormWithFiles extends QuizGeneratorForm {
  useFiles?: boolean
  vectorStoreId?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData: QuizGeneratorFormWithFiles = await request.json()

    // Construir el prompt base
    const basePrompt = `Generate a quiz in JSON format with the following specifications:

Parameters:
- Number of questions: ${formData.questionCount}
- Subject: ${formData.subject}
- Topics: ${formData.topics.join(', ')}
- Difficulty: ${formData.difficulty}

The JSON must contain an array called "questions" with the following structure for each element:
- "id": string (e.g., "q1", "q2", etc.)
- "question": string (question text)
- "options": string[] (array of answer options)
- "correctAnswer": number (index of the correct answer, starting from 0)
- "explanation": string (optional explanation of why the answer is correct)

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

${
  formData.useFiles && formData.vectorStoreId
    ? 'IMPORTANT: Use the content of the provided documents as the primary reference for generating questions. Questions should be based on specific information from these documents.'
    : 'Generate questions based on general knowledge about the specified topics.'
}

Generate the quiz now:`

    if (formData.useFiles && formData.vectorStoreId) {
      // Usar Responses API con file_search
      const response = await openai.responses.create({
        model: 'gpt-5-mini',
        input: basePrompt,
        tools: [
          {
            type: 'file_search',
            vector_store_ids: [formData.vectorStoreId],
          },
        ],
      })

      const responseContent = response.output_text
      if (!responseContent) {
        throw new Error('No se recibió respuesta del modelo')
      }

      // Extraer JSON de la respuesta
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON de la respuesta del modelo')
      }

      const questions = JSON.parse(jsonMatch[0]).questions as QuizQuestion[]

      return NextResponse.json({
        success: true,
        data: questions,
      })
    } else {
      // Usar Chat Completions API sin archivos
      const response = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant specialized in generating educational quizzes. Generate clear, precise questions appropriate for the specified difficulty level.',
          },
          {
            role: 'user',
            content: basePrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      })

      const responseContent = response.choices[0].message.content
      if (!responseContent) {
        throw new Error('No se recibió respuesta del modelo')
      }

      // Extraer JSON de la respuesta
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON de la respuesta')
      }

      const questions = JSON.parse(jsonMatch[0]).questions as QuizQuestion[]

      return NextResponse.json({
        success: true,
        data: questions,
      })
    }
  } catch (error: any) {
    console.error('Error generando quiz:', error)
    return NextResponse.json(
      {
        success: false,
        errorMessage: error.message || 'Error al generar el quiz',
      },
      { status: 500 },
    )
  }
}
