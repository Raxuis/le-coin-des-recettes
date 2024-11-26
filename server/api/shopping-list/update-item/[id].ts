import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)
        const { isChecked, email } = body

        if (!email) {
            throw createError({
                statusCode: 403,
                message: 'L\'email doit être fourni'
            })
        }

        if (typeof isChecked !== 'boolean') {
            throw createError({
                statusCode: 400,
                message: 'isChecked must be a boolean'
            })
        }

        const item = await prisma.items.findUnique({
            where: { id },
            include: {
                ShoppingList: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!item) {
            throw createError({
                statusCode: 404,
                message: 'Item non trouvé'
            })
        }

        if (item.ShoppingList.user.email !== email) {
            throw createError({
                statusCode: 403,
                message: 'Vous n\'êtes pas autorisé à modifier cet item'
            })
        }

        // If authorization passes, update the item
        const updatedItem = await prisma.items.update({
            where: { id },
            data: { isChecked }
        })

        return {
            statusCode: 200,
            data: updatedItem
        }
    } catch (error) {
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            message: 'Error updating shopping list item'
        })
    }
})