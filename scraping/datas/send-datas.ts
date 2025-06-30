import type { Recipes } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const recipesData: Omit<Recipes, 'id'>[] = [
  {
    title: "Dinde farcie de Noël",
    type: "PLAT",
    people: 8,
    slug: "dinde-farcie-noel",
    ingredients: [
      "1 dinde entière",
      "300g de farce (chair à saucisse, herbes, pain)",
      "2 oignons",
      "4 carottes",
      "50g de beurre",
      "Sel",
      "Poivre"
    ],
    steps: [
      "Préchauffer le four à 180°C.",
      "Préparer la farce et remplir la dinde.",
      "Ficeler la dinde et la badigeonner de beurre.",
      "Faire cuire pendant environ 3 heures, en arrosant régulièrement.",
      "Servir avec une sauce aux oignons et carottes."
    ],
    preparationTime: 30,
    restingTime: 0,
    cookingTime: 180,
    totalTime: 210,
    difficulty: "Moyenne",
    budget: "Élevé",
    creatorId: null,
    specialEvent: "NOEL",
    author: "Chef Noël",
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
  },
  {
    title: "Bûche de Noël au chocolat",
    type: "DESSERT",
    people: 6,
    slug: "buche-noel-chocolat",
    ingredients: [
      "200g de chocolat noir",
      "4 œufs",
      "100g de sucre",
      "100g de beurre",
      "100g de farine"
    ],
    steps: [
      "Préchauffer le four à 180°C.",
      "Faire fondre le chocolat et le beurre ensemble.",
      "Mélanger les œufs et le sucre, puis ajouter le chocolat fondu.",
      "Incorporer la farine et bien mélanger.",
      "Verser la pâte sur une plaque et cuire 10-12 minutes.",
      "Rouler le gâteau et décorer comme une bûche."
    ],
    preparationTime: 20,
    restingTime: 10,
    cookingTime: 12,
    totalTime: 42,
    difficulty: "Moyenne",
    budget: "Moyen",
    creatorId: null,
    specialEvent: "NOEL",
    author: "Chef Noël",
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
  },
  {
    title: "Gâteau d'anniversaire au chocolat",
    type: "DESSERT",
    people: 8,
    slug: "gateau-anniversaire-chocolat",
    ingredients: [
      "200g de chocolat noir",
      "150g de sucre",
      "150g de beurre",
      "100g de farine",
      "3 œufs",
      "1 sachet de levure chimique"
    ],
    steps: [
      "Préchauffer le four à 180°C.",
      "Faire fondre le chocolat et le beurre ensemble.",
      "Battre les œufs avec le sucre jusqu'à obtenir un mélange mousseux.",
      "Incorporer le chocolat fondu, la farine et la levure.",
      "Verser dans un moule et cuire 25-30 minutes."
    ],
    preparationTime: 15,
    restingTime: 0,
    cookingTime: 30,
    totalTime: 45,
    difficulty: "Facile",
    budget: "Moyen",
    creatorId: null,
    specialEvent: "ANNIVERSAIRE",
    author: "Chef Anniversaire",
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
  },
  {
    title: "Cocktail fruité pour anniversaire",
    type: "DESSERT",
    people: 4,
    slug: "cocktail-fruite-anniversaire",
    ingredients: [
      "500ml de jus d'orange",
      "200ml de jus d'ananas",
      "100ml de sirop de grenadine",
      "Glaçons",
      "Fruits frais pour la décoration (fraises, kiwi, etc.)"
    ],
    steps: [
      "Mélanger le jus d'orange et le jus d'ananas.",
      "Ajouter le sirop de grenadine et bien mélanger.",
      "Servir dans des verres remplis de glaçons.",
      "Décorer avec des fruits frais."
    ],
    preparationTime: 10,
    restingTime: 0,
    cookingTime: 0,
    totalTime: 10,
    difficulty: "Facile",
    budget: "Bon marché",
    creatorId: null,
    specialEvent: "ANNIVERSAIRE",
    author: "Chef Anniversaire",
    "createdAt": new Date("2024-11-05T13:40:00.000Z"),
    "updatedAt": new Date("2024-11-05T13:40:00.000Z"),
  }
];

async function main() {
  try {
    for (const recipe of recipesData) {
      const alreadyExistingRecipe = await prisma.recipes.findFirst({
        where: {
          OR: [
            { slug: recipe.slug ?? "" },
            { title: recipe.title ?? "" },
          ],
        },
      });

      if (alreadyExistingRecipe) {
        console.log(`La recette "${recipe.title}" existe déjà avec le slug "${recipe.slug}" !`);
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
