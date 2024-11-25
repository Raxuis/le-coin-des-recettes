import {PrismaClient} from '@prisma/client';
import {getServerSession} from "#auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);

    if (!session || !session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Vous devez etre connecte pour creer une recette.',
        });
    }
    const body = await readBody(event);

    if (!body || Object.keys(body).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le corps de la requête est vide ou invalide.',
        });
    }

    const {
        id,
        author,
        creatorId,
        title,
        type,
        people,
        ingredients,
        steps,
        preparationTime,
        restingTime,
        cookingTime,
        difficulty,
        budget,
        specialEvent,
        slug,
        totalTime,
    } = body;


    const existingRecipe = await prisma.recipes.findUnique({
        where: {
            slug: slug,
        }
    })
    if (existingRecipe && existingRecipe.id !== id ) {
        throw createError({
            statusCode: 400,
            statusMessage: "Une recette existe deja avec ce slug, veuillez changer."
        })
    }

    try {
        if (!title || !type || !people || !ingredients || !steps || !preparationTime || !cookingTime || !difficulty || !budget || !slug) {
            throw createError({
                statusCode: 422,
                statusMessage: 'Un ou plusieurs champs obligatoires sont manquants.',
            });
        }

        const newRecipe = await prisma.recipes.update({
            where: {
                slug: slug,
            },
            data: {
                author,
                creatorId,
                title,
                type,
                people,
                ingredients,
                steps,
                preparationTime,
                restingTime,
                cookingTime,
                difficulty,
                budget,
                specialEvent,
                slug,
                totalTime,
            },
        });

        return {
            statusCode: 201,
            statusMessage: 'Recette modifiée avec succès.',
            data: newRecipe,
        };
    } catch (error) {
        console.error('Erreur lors de l\'edition de la recette :', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Une erreur est survenue lors de l\'edition de la recette.',
        });
    } finally {
        await prisma.$disconnect();
    }
});
