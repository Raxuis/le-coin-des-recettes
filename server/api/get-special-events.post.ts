import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const specialEvents = await prisma.recipes.findMany({
      where: {
        specialEvent: body.eventType
      },
    })
    if (specialEvents.length === 0) {
      return createError({
        statusCode: 404,
        statusMessage: "Aucun événement spécial trouvé",
      })
    }
    return specialEvents
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des événements spéciaux",
    })
  }
})
