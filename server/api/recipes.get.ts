import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
  const recipes = await prisma.recipes.findMany()
  if (!recipes) throw createError({ statusCode: 500, statusMessage: 'An error occurred try again.' })
  return recipes;
})
