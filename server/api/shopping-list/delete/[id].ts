import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)
        const {email} = body

        if (!email) {
            throw createError({
                statusCode: 403,
                message: 'L\'email doit être fourni'
            })
        }

        const shoppingList = await prisma.shoppingList.findUnique({
                where: {id},
                include: {
                    user: true,
                }
            }
        )

        if (!shoppingList) {
            throw createError({
                statusCode: 404,
                message: 'Item non trouvé'
            })
        }

        if (shoppingList.user.email !== email) {
            console.log("nope")
            throw createError({
                statusCode: 403,
                message: 'Vous n\'êtes pas autorisé à modifier cet item'
            })
        }

        await prisma.shoppingList.delete({
            where: {id}
        })

        return {
            statusCode: 200
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Error deleting shopping list item'
        })
    }
})
