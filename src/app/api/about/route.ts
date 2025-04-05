import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAbout, createAbout, updateAbout } from '@/services/aboutService'

export async function GET() {
  try {
    const about = await getAbout()
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar conteúdo Sobre Mim' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const about = await createAbout(data)
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar conteúdo Sobre Mim' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id, ...data } = await request.json()
    const about = await updateAbout(id, data)
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar conteúdo Sobre Mim' }, { status: 500 })
  }
} 