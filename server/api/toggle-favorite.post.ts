import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { recipeId, userId } = body

    if (!recipeId || !userId) {
        throw createError({
            statusCode: 400,
            message: 'Recipe ID and User ID are required'
        })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { favoriteRecipes: true }
        })

        const isAlreadyFavorited = user?.favoriteRecipes.some(recipe => recipe.id === recipeId)

        if (isAlreadyFavorited) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    favoriteRecipes: {
                        disconnect: { id: recipeId }
                    }
                }
            })
        } else {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    favoriteRecipes: {
                        connect: { id: recipeId }
                    }
                }
            })
        }

        return {
            status: 'success',
            isFavorited: !isAlreadyFavorited
        }
    } catch (error) {
        console.error('Error toggling favorite:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to toggle favorite status'
        })
    }
})