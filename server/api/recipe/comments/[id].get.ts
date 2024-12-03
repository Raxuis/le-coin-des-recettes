import {PrismaClient} from "@prisma/client";
import {getServerSession} from "#auth";
import {getUserCheckRouterParamWithTableId} from "~/utils/getUserCheckRouterParamWithTableId";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event);
        const recipeId = getRouterParam(event, 'id');
        const user = await getUserCheckRouterParamWithTableId(session, recipeId);

        if (!recipeId) {
            throw createError({
                statusCode: 400,
                message: 'Recipe is required'
            })
        }
        const comments = await prisma.comments.findMany({
            where: {
                recipeId
            },
            select: {
                content: true,
                user: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return {
            statusCode: 201,
            data: comments
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Something went wrong"
        };
    }
})