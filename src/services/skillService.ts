import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Skill {
  id: string
  name: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export async function getSkills(): Promise<Skill[]> {
  return prisma.skill.findMany({
    orderBy: {
      category: 'asc'
    }
  })
}

export async function createSkill(data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
  return prisma.skill.create({
    data
  })
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
  return prisma.skill.update({
    where: { id },
    data
  })
}

export async function deleteSkill(id: string): Promise<void> {
  await prisma.skill.delete({
    where: { id }
  })
} 