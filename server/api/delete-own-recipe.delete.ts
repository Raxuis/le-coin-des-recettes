import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const {id, email} = await readBody(event);


    if (!id || !email) {
        throw createError({
            statusCode: 400,
            statusMessage: "Il manque des données.",
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
            },
        });

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: "Utilisateur non trouvé.",
            });
        }

        const recipe = await prisma.recipes.findUnique({
            where: {
                id,
            }
        })

        if (!recipe) {
            throw createError({
                statusCode: 404,
                statusMessage: "Recette non trouvée.",
            })
        }

        if (recipe.creatorId !== user.id) {
            throw createError({
                statusCode: 403,
                statusMessage: "Vous ne pouvez pas supprimer cette recette."
            })
        }

        await prisma.recipes.delete({
            where: {id},
        });

        return {
            statusCode: 200,
            statusMessage: "Recette supprimée avec succès.",
        };
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Erreur lors de la suppression.",
        });
    } finally {
        await prisma.$disconnect();
    }
});
