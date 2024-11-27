import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const {email, title, items} = await readBody(event);

    if (!email || !title) {
        return {statusCode: 400, statusMessage: "Email ou titre manquant."};
    }

    try {
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if (!user) {
            return {statusCode: 404, statusMessage: "Utilisateur non trouvé."};
        }

        const itemsArray = typeof items === 'string'
            ? items.split(',').map(item => item.trim())
            : items;

        const shoppingList = await prisma.shoppingList.create({
            data: {
                title,
                userId: user.id,
                items: {
                    create: itemsArray.map((item: string) => ({
                        title: item,
                        isChecked: false,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return {
            statusCode: 201,
            statusMessage: shoppingList
        };
    } catch (error) {
        console.error(error);
        return {statusCode: 500, statusMessage: "Erreur lors de la création."};
    }
});