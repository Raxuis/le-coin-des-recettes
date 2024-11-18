import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const { email } = query as { email: string };

  if (!email) throw createError({ statusCode: 400, statusMessage: 'Email is required.' });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      name: true,
      image: true,
      recipes: {
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  if (!user) throw createError({ statusCode: 500, statusMessage: 'An error occurred, try again.' });

  return user;
});
