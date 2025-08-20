import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, errorMessage: 'No se proporcionaron archivos' },
        { status: 400 },
      )
    }

    // Subir archivos a OpenAI
    const uploadedFileIds: string[] = []

    for (const file of files) {
      try {
        const uploadedFile = await openai.files.create({
          file: file,
          purpose: 'assistants',
        })
        uploadedFileIds.push(uploadedFile.id)
      } catch (error) {
        console.error(`Error subiendo archivo ${file.name}:`, error)
        // Continuamos con los otros archivos aunque uno falle
      }
    }

    if (uploadedFileIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'No se pudieron subir los archivos a OpenAI',
        },
        { status: 500 },
      )
    }

    // Crear vector store con los archivos subidos
    const vectorStore = await openai.vectorStores.create({
      name: `Quiz Documents - ${new Date().toISOString()}`,
    })

    // Agregar archivos al vector store
    for (const fileId of uploadedFileIds) {
      await openai.vectorStores.files.create(vectorStore.id, {
        file_id: fileId,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        vectorStoreId: vectorStore.id,
        uploadedFiles: uploadedFileIds.length,
      },
    })
  } catch (error: any) {
    console.error('Error procesando archivos:', error)
    return NextResponse.json(
      {
        success: false,
        errorMessage: error.message || 'Error al procesar los archivos',
      },
      { status: 500 },
    )
  }
}
