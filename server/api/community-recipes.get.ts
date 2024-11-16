import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async () => {

    const communityRecipes = await prisma.recipes.findMany({
        where: {
            creatorId: {
                not: null,
            },
        },
    });

    if (!communityRecipes) throw createError({ statusCode: 500, statusMessage: 'An error occurred, try again.' });
    return communityRecipes;
});
