import {PrismaClient} from '@prisma/client';
import {checkUserSession} from "~/utils/checkUserSession";

const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
    const recipes = await prisma.recipes.findMany({
        where: {
            creatorId: null,
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
            specialEvent: true,
        }
    });
    if (!recipes) throw createError({statusCode: 500, statusMessage: 'An error occurred try again.'})
    return recipes;
})
