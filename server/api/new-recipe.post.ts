import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body || Object.keys(body).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le corps de la requête est vide ou invalide.',
        });
    }

    const {
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
    if (existingRecipe) {
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

        // Création de la recette dans la base de données
        const newRecipe = await prisma.recipes.create({
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
            statusMessage: 'Recette créée avec succès.',
            data: newRecipe,
        };
    } catch (error) {
        console.error('Erreur lors de la création de la recette :', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Une erreur est survenue lors de la création de la recette.',
        });
    } finally {
        await prisma.$disconnect();
    }
});
