import {PrismaClient} from '@prisma/client'
import {getServerSession} from '#auth'
import {getUserCheckRouterParam} from "~/utils/getUserCheckRouterParam";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const session = await getServerSession(event);
        const id = getRouterParam(event, 'id');
        console.log("test");
        const user = await getUserCheckRouterParam(session, id);


        const body = await readBody(event)

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

        console.log(item)

        const updatedItem = await prisma.items.update({
            where: {id},
            data: {
                ...(typeof body.number === 'number' && {number: Math.max(1, body.number)}),
                ...(typeof body.isChecked === 'boolean' && {isChecked: body.isChecked})
            }
        })
        console.log(updatedItem)

        return {
            statusCode: 200,
            data: updatedItem
        }
    } catch (error) {
        console.error('Error updating item:', error)
        throw createError({
            statusCode: 500,
            message: 'An error occurred while updating the item'
        })
    }
})