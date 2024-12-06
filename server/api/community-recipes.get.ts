import {PrismaClient} from '@prisma/client';
import {createError, defineEventHandler} from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const recipes = await prisma.recipes.findMany({
        where: {
            creatorId: {
                not: null,
            },
        },
        select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            difficulty: true,
            budget: true,
            preparationTime: true,
            cookingTime: true,
            restingTime: true,
            totalTime: true,
            ingredients: true,
            steps: true,
            specialEvent: true,
            author: true,
            creatorId: true,
            ratings: {
                select: {
                    value: true,
                }
            },
            _count: {
                select: {
                    comments: true,
                },
            },
        },
    });

    if (!recipes) throw createError({statusCode: 500, statusMessage: 'An error occurred try again.'})

    return recipes.map(recipe => ({
        ...recipe,
        averageRating: recipe.ratings.length ?
            recipe.ratings.reduce((sum, r) => sum + r.value, 0) / recipe.ratings.length :
            0
    }));
});