import { createClient } from '@/lib/supabase/server'
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import jsPDF from 'jspdf'
import { NextRequest, NextResponse } from 'next/server'

interface ExportQuizRequest {
  quizId: string
  format: 'pdf' | 'docx'
  type: 'questions' | 'answers' | 'both'
  userId: string
}

interface QuizData {
  id: string
  title: string
  subject: string
  difficulty: string
  questions: Array<{
    id: string
    question_text: string
    options: string[]
    correct_answer: number
    explanation?: string
    question_order: number
  }>
}

async function getQuizData(
  quizId: string,
  userId: string,
): Promise<QuizData | null> {
  const supabase = await createClient()

  // Verificar que el usuario es el propietario del quiz
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .eq('created_by', userId)
    .single()

  if (quizError || !quiz) {
    return null
  }

  // Obtener las preguntas del quiz
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('question_order', { ascending: true })

  if (questionsError) {
    return null
  }

  return {
    id: quiz.id,
    title: quiz.title,
    subject: quiz.subject,
    difficulty: quiz.difficulty,
    questions: questions || [],
  }
}

function generatePDF(
  quizData: QuizData,
  type: 'questions' | 'answers' | 'both',
): Buffer {
  const doc = new jsPDF()
  let yPosition = 20

  // Función helper para agregar texto con salto de línea automático
  const addText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number = 170,
  ): number => {
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * 7
  }

  // Título del quiz
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  yPosition = addText(quizData.title, 20, yPosition)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  yPosition = addText(
    `Materia: ${quizData.subject} | Dificultad: ${quizData.difficulty}`,
    20,
    yPosition + 10,
  )

  yPosition += 15

  quizData.questions.forEach((question, index) => {
    // Verificar si necesita nueva página
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Número y pregunta
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    yPosition = addText(
      `${index + 1}. ${question.question_text}`,
      20,
      yPosition,
    )
    yPosition += 5

    if (type === 'questions' || type === 'both') {
      // Opciones
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      question.options.forEach((option, optIndex) => {
        const letter = String.fromCharCode(97 + optIndex) // a, b, c, d
        yPosition = addText(`  ${letter}) ${option}`, 25, yPosition)
      })
    }

    if (type === 'answers' || type === 'both') {
      // Respuesta correcta
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      const correctLetter = String.fromCharCode(97 + question.correct_answer)
      yPosition = addText(
        `Respuesta correcta: ${correctLetter}) ${question.options[question.correct_answer]}`,
        20,
        yPosition + 5,
      )

      // Explicación si existe
      if (question.explanation) {
        doc.setFont('helvetica', 'normal')
        yPosition = addText(
          `Explicación: ${question.explanation}`,
          20,
          yPosition + 3,
        )
      }
    }

    yPosition += 15
  })

  return Buffer.from(doc.output('arraybuffer'))
}

function generateDOCX(
  quizData: QuizData,
  type: 'questions' | 'answers' | 'both',
): Promise<Buffer> {
  const children: any[] = []

  // Título del quiz
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: quizData.title,
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.TITLE,
    }),
  )

  // Información del quiz
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Materia: ${quizData.subject} | Dificultad: ${quizData.difficulty}`,
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    }),
  )

  quizData.questions.forEach((question, index) => {
    // Pregunta
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${question.question_text}`,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
    )

    if (type === 'questions' || type === 'both') {
      // Opciones
      question.options.forEach((option, optIndex) => {
        const letter = String.fromCharCode(97 + optIndex)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `  ${letter}) ${option}`,
                size: 22,
              }),
            ],
            spacing: { after: 50 },
          }),
        )
      })
    }

    if (type === 'answers' || type === 'both') {
      // Respuesta correcta
      const correctLetter = String.fromCharCode(97 + question.correct_answer)
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Respuesta correcta: ${correctLetter}) ${question.options[question.correct_answer]}`,
              bold: true,
              size: 22,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
      )

      // Explicación si existe
      if (question.explanation) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Explicación: ${question.explanation}`,
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),
        )
      }
    }
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  return Packer.toBuffer(doc)
}

function getFileName(quizTitle: string, format: string, type: string): string {
  const sanitizedTitle = quizTitle
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
  const typeMap = {
    questions: 'preguntas',
    answers: 'respuestas',
    both: 'completo',
  }
  return `${sanitizedTitle}_${typeMap[type as keyof typeof typeMap]}.${format}`
}

export async function POST(request: NextRequest) {
  try {
    const { quizId, format, type, userId }: ExportQuizRequest =
      await request.json()

    if (!quizId || !format || !type || !userId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 },
      )
    }

    // Validar parámetros
    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Formato no válido' }, { status: 400 })
    }

    if (!['questions', 'answers', 'both'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de exportación no válido' },
        { status: 400 },
      )
    }

    // Obtener datos del quiz
    const quizData = await getQuizData(quizId, userId)
    if (!quizData) {
      return NextResponse.json(
        { error: 'Quiz no encontrado o sin permisos' },
        { status: 404 },
      )
    }

    // Generar archivo según el formato
    let fileBuffer: Buffer
    let contentType: string

    if (format === 'pdf') {
      fileBuffer = generatePDF(quizData, type)
      contentType = 'application/pdf'
    } else {
      fileBuffer = await generateDOCX(quizData, type)
      contentType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    const fileName = getFileName(quizData.title, format, type)

    // Retornar el archivo
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error en exportación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
