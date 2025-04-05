import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/services/skillService'

export async function GET() {
  try {
    const skills = await getSkills()
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar habilidades' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const skill = await createSkill(data)
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar habilidade' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id, ...data } = await request.json()
    const skill = await updateSkill(id, data)
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar habilidade' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await request.json()
    await deleteSkill(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar habilidade' }, { status: 500 })
  }
} 