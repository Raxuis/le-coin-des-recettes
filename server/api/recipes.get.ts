import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
  const recipes = await prisma.recipes.findMany({
    where: {
      creatorId: null,
    }
  });
  if (!recipes) throw createError({ statusCode: 500, statusMessage: 'An error occurred try again.' })
  return recipes;
})
