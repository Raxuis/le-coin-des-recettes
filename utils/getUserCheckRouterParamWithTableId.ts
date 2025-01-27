import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export const getUserCheckRouterParamWithTableId = async (session: any, id: string | undefined) => {
    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'You must be logged in to perform this action'
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email!
        }
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found'
        })
    }

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Element Id is required'
        })
    }
    return user;
}