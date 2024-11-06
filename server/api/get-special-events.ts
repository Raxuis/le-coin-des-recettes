import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const specialEvents = await prisma.recipes.findMany({
      select: {
        specialEvent: true,
      },
      distinct: ['specialEvent'],
      where: {
        specialEvent: {
          not: null,
        },
      },
    })
    return specialEvents
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des événements spéciaux",
    })
  }
})
