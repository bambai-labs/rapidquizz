import { createClient } from '@/lib/supabase/server'
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

    // Verificar autenticación
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, errorMessage: 'Usuario no autenticado' },
        { status: 401 },
      )
    }

    // Verificar límites para usuarios gratuitos
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Verificar si la suscripción permite acceso premium
    const now = new Date()
    const isWithinDateLimits =
      subscription &&
      subscription.starts_at &&
      subscription.ends_at &&
      new Date(subscription.starts_at) <= now &&
      new Date(subscription.ends_at) > now

    const hasActiveSubscription =
      subscription && subscription.status !== 'expired' && isWithinDateLimits

    if (!hasActiveSubscription) {
      // Contar quizzes del mes actual
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const endOfMonth = new Date(startOfMonth)
      endOfMonth.setMonth(endOfMonth.getMonth() + 1)

      const { data: monthlyQuizzes, error: countError } = await supabase
        .from('quizzes')
        .select('has_files')
        .eq('created_by', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lt('created_at', endOfMonth.toISOString())

      if (countError) {
        return NextResponse.json(
          { success: false, errorMessage: 'Error al verificar límites' },
          { status: 500 },
        )
      }

      const quizzesWithFiles =
        monthlyQuizzes?.filter((q) => q.has_files === true) || []
      const quizzesWithoutFiles =
        monthlyQuizzes?.filter((q) => q.has_files !== true) || []

      // Verificar límites según si usa archivos o no
      if (formData.useFiles) {
        if (quizzesWithFiles.length >= 5) {
          return NextResponse.json(
            {
              success: false,
              errorMessage:
                'Has alcanzado el límite de 5 quizzes con archivos para usuarios gratuitos este mes. Actualiza a Pro para quizzes ilimitados.',
            },
            { status: 403 },
          )
        }
      } else {
        if (quizzesWithoutFiles.length >= 20) {
          return NextResponse.json(
            {
              success: false,
              errorMessage:
                'Has alcanzado el límite de 20 quizzes sin archivos para usuarios gratuitos este mes. Actualiza a Pro para quizzes ilimitados.',
            },
            { status: 403 },
          )
        }
      }
    }

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
