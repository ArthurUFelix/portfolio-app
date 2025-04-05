import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface About {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export async function getAbout(): Promise<About | null> {
  return prisma.about.findFirst()
}

export async function createAbout(data: Omit<About, 'id' | 'createdAt' | 'updatedAt'>): Promise<About> {
  return prisma.about.create({
    data
  })
}

export async function updateAbout(id: string, data: Partial<About>): Promise<About> {
  return prisma.about.update({
    where: { id },
    data
  })
} 