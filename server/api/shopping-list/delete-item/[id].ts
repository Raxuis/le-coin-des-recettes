import {PrismaClient} from '@prisma/client'
import {getServerSession} from '#auth'
import {getUserCheckRouterParamWithTableId} from "~/utils/getUserCheckRouterParamWithTableId";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event);
        const id = getRouterParam(event, 'id');
        const user = await getUserCheckRouterParamWithTableId(session, id);

        const item = await prisma.items.findFirst({
            where: {
                id,
                ShoppingList: {
                    userId: user.id
                }
            },
            include: {
                ShoppingList: true
            }
        })

        if (!item) {
            throw createError({
                statusCode: 404,
                message: 'Item not found'
            })
        }

        await prisma.items.delete({
            where: {id}
        })

        return {
            statusCode: 200,
            message: 'Item deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting item:', error)
        throw createError({
            statusCode: 500,
            message: 'An error occurred while deleting the item'
        })
    }
})