import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(experiences)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar experiências' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const experience = await prisma.experience.create({
      data: {
        title: data.title,
        company: data.company,
        period: data.period,
        description: data.description
      }
    })

    return NextResponse.json(experience)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar experiência' },
      { status: 500 }
    )
  }
} 