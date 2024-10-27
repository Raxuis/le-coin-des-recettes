import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { slug } = body;

  const recipes = await prisma.recipes.findUnique({
    where: {
      slug,
    },
  });

  if (!recipes) throw createError({ statusCode: 500, statusMessage: 'An error occurred, try again.' });
  return recipes;
});
