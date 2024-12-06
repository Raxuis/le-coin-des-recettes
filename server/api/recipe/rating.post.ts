import {PrismaClient} from "@prisma/client";
import {getServerSession} from "#auth";
import {getUserCheckRouterParam} from "~/utils/getUserCheckRouterParam";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event);
        const user = await getUserCheckRouterParam(session);
        const {userEmail, recipeId} = await readBody(event)

        if (!userEmail) {
            throw createError({
                statusCode: 400,
                message: 'User email is required',
            })
        }
        if (!recipeId) {
            throw createError({
                statusCode: 400,
                message: 'Recipe is required'
            })
        }

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'No user'
            })
        }

        const rating = await prisma.ratings.findUnique({
            where: {
                userId_recipeId: {
                    userId: user.id,
                    recipeId: recipeId
                }
            }
        });

        return {
            data: rating ? { value: rating.value } : null,
            statusCode: 201
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Something went wrong"
        };
    }
})