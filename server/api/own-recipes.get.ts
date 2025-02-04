import {PrismaClient} from '@prisma/client';
import {checkUserSession} from "~/utils/checkUserSession";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const sessionExists = await checkUserSession(event);

    if (!sessionExists) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Authentication failed',
        });
    }

    const query = getQuery(event);

    const {email} = query as { email: string };

    if (!email) throw createError({statusCode: 400, statusMessage: 'Email is required.'});

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            recipes: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    type: true,
                    difficulty: true,
                    budget: true,
                    ingredients: true,
                    steps: true,
                    people: true,
                    preparationTime: true,
                    restingTime: true,
                    cookingTime: true,
                    specialEvent: true,
                },
            },
        },
    });

    if (!user) throw createError({statusCode: 500, statusMessage: 'An error occurred, try again.'});

    return user;
});
