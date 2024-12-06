import {PrismaClient} from "@prisma/client";
import {getServerSession} from "#auth";
import {getUserCheckRouterParam} from "~/utils/getUserCheckRouterParam";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event);
        const user = await getUserCheckRouterParam(session);
        const {ratingValue, recipeId} = await readBody(event)

        if (!ratingValue) {
            throw createError({
                statusCode: 400,
                message: 'Rating is required'
            })
        }
        if (!recipeId) {
            throw createError({
                statusCode: 400,
                message: 'Recipe is required'
            })
        }
        await prisma.ratings.create({
            data: {
                value: ratingValue,
                userId: user.id,
                recipeId
            },
            include: {
                user: true,
            },
        })

        return {
            statusCode: 201,
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Something went wrong"
        };
    }
})