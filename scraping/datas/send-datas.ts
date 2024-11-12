import type { Recipes } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const recipesData: Omit<Recipes, 'id'>[] = [
  {
    "title": "Doigts de sorcière ensanglantés",
    "type": "PLAT",
    "people": 6,
    "slug": "doigts-de-sorciere-ensanglantes",
    "author": "Chef Halloween",
    "ingredients": [
      "1 pâte feuilletée",
      "12 saucisses de Strasbourg",
      "Amandes effilées",
      "Ketchup pour le sang"
    ],
    "steps": [
      "Préchauffe le four à 180°C.",
      "Enroule une bande de pâte feuilletée autour de chaque saucisse, en laissant un bout découvert pour former l'ongle.",
      "Place une amande effilée au bout de chaque saucisse pour imiter un ongle.",
      "Fais cuire au four pendant 15 minutes jusqu'à ce que la pâte soit dorée.",
      "Sers avec du ketchup pour un effet ‘ensanglanté’."
    ],
    "preparationTime": 10,
    "restingTime": 0,
    "cookingTime": 15,
    "totalTime": 25,
    "difficulty": "Facile",
    "budget": "Bon marché",
    "creatorId": null,
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
    "specialEvent": "HALLOWEEN"
  },
  {
    "title": "Pizza momies",
    "type": "PLAT",
    "people": 4,
    "slug": "pizza-momies",
    "author": "Chef Halloween",
    "ingredients": [
      "4 pains pita",
      "Sauce tomate",
      "Tranches de fromage",
      "Olives noires coupées en rondelles"
    ],
    "steps": [
      "Préchauffe le four à 200°C.",
      "Étale de la sauce tomate sur chaque pain pita.",
      "Dispose les tranches de fromage en bandes pour imiter les bandelettes de momie.",
      "Place des rondelles d'olives pour les yeux.",
      "Fais cuire au four pendant 10 minutes."
    ],
    "preparationTime": 5,
    "restingTime": 0,
    "cookingTime": 10,
    "totalTime": 15,
    "difficulty": "Facile",
    "budget": "Bon marché",
    "creatorId": null,
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
    "specialEvent": "HALLOWEEN"
  },
  {
    "title": "Cupcakes citrouille d’Halloween",
    "type": "DESSERT",
    "people": 6,
    "slug": "cupcakes-citrouille-halloween",
    "author": "Chef Halloween",
    "ingredients": [
      "150g de sucre",
      "2 œufs",
      "100g de beurre fondu",
      "120ml de lait",
      "200g de farine",
      "1 cuillère à café de levure",
      "Colorant orange pour glaçage",
      "Pâte d’amande verte pour la décoration"
    ],
    "steps": [
      "Préchauffe le four à 180°C.",
      "Mélange le sucre, les œufs, le beurre fondu, le lait, la farine et la levure jusqu’à obtenir une pâte lisse.",
      "Verse la pâte dans des moules à cupcakes et fais cuire 15-20 minutes.",
      "Laisse refroidir, puis décore avec du glaçage coloré en orange et ajoute une tige en pâte d’amande verte pour imiter une citrouille."
    ],
    "preparationTime": 15,
    "restingTime": 0,
    "cookingTime": 20,
    "totalTime": 35,
    "difficulty": "Facile",
    "budget": "Moyen",
    "creatorId": null,
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
    "specialEvent": "HALLOWEEN"
  },
  {
    "title": "Fantômes en meringue",
    "type": "DESSERT",
    "people": 4,
    "slug": "fantomes-meringue",
    "author": "Chef Halloween",
    "ingredients": [
      "2 blancs d’œufs",
      "100g de sucre",
      "Pépites de chocolat pour les yeux"
    ],
    "steps": [
      "Préchauffe le four à 100°C.",
      "Monte les blancs en neige en ajoutant le sucre progressivement jusqu'à obtenir une meringue ferme.",
      "Utilise une poche à douille pour former des petits fantômes sur une plaque de cuisson.",
      "Ajoute des pépites de chocolat pour faire les yeux.",
      "Fais cuire pendant 1h30 à 100°C jusqu'à ce que les meringues soient sèches."
    ],
    "preparationTime": 15,
    "restingTime": 0,
    "cookingTime": 90,
    "totalTime": 105,
    "difficulty": "Facile",
    "budget": "Bon marché",
    "creatorId": null,
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
    "specialEvent": "HALLOWEEN"
  }
]

async function main() {
  try {
    for (const recipe of recipesData) {
      const alreadyExistingRecipe = await prisma.recipes.findUnique({
        where: {
          slug: recipe.slug ?? "",
        },
      });
      if (alreadyExistingRecipe) {
        console.log(`La recette "${recipe.title}" existe déjà !`);
        continue;
      }
      await prisma.recipes.create({
        data: recipe,
      });
      console.log(`Recette "${recipe.title}" ajoutée avec succès !`);
    }
    console.log("Toutes les recettes ont été ajoutées !");
  } catch (error) {
    console.error("Erreur lors de l'insertion des recettes : ", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
