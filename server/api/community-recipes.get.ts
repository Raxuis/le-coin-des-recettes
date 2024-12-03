import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {

    const communityRecipes = await prisma.recipes.findMany({
        where: {
            creatorId: {
                not: null,
            },
        },
        select: {
            id: true,
            budget: true,
            difficulty: true,
            cookingTime: true,
            preparationTime: true,
            restingTime: true,
            title: true,
            slug: true,
            type: true,
            creatorId: true,
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });

    if (!communityRecipes) throw createError({statusCode: 500, statusMessage: 'An error occurred, try again.'});
    return communityRecipes;
});
