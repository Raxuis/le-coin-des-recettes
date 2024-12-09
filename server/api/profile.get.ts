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
            id: true,
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
            favoriteRecipes: {
                take: 5,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });

    if (!user) throw createError({statusCode: 500, statusMessage: 'An error occurred, try again.'});

    return user;
});
