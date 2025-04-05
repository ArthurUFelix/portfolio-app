import { PrismaClient } from '@prisma/client'
import { Experience } from '@/types/experience'

const prisma = new PrismaClient()

export async function getExperiences(): Promise<Experience[]> {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return experiences
  } catch (error) {
    console.error('Erro ao buscar experiências:', error)
    return []
  }
} 