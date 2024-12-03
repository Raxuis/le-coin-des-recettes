import {PrismaClient} from "@prisma/client";
import {getServerSession} from "#auth";
import {getUserCheckRouterParam} from "~/utils/getUserCheckRouterParam";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event);
        const recipeId = getRouterParam(event, 'id');
        const user = await getUserCheckRouterParam(session);
        const {content} = await readBody(event)

        if (!content) {
            throw createError({
                statusCode: 400,
                message: 'Text is required'
            })
        }
        if (!recipeId) {
            throw createError({
                statusCode: 400,
                message: 'Recipe is required'
            })
        }
        const comment = await prisma.comments.create({
            data: {
                content,
                userId: user.id,
                recipeId
            },
            include: {
                user: true,
            },
        })
        // To remove `userId` from the main comment object
        const { userId, ...commentWithoutUserId } = comment;

        return {
            statusCode: 201,
            data: commentWithoutUserId,
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Something went wrong"
        };
    }
})