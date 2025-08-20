import { QuizGeneratorForm, QuizQuestion } from '@/types/quiz'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData: QuizGeneratorForm = await request.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates quiz questions and answers for a given subject and topic.',
        },
        {
          role: 'user',
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
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No se recibió contenido de OpenAI')
    }

    const questions = (
      JSON.parse(content) as {
        questions: QuizQuestion[]
      }
    ).questions

    return NextResponse.json({
      success: true,
      data: questions,
    })
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
