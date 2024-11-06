import type { Recipes } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const recipesData: Omit<Recipes, 'id'>[] = [
  {
    "title": "Rôti de boeuf aux légumes",
    author: "Auteur inconnu",
    "type": "PLAT",
    "people": 6,
    "slug": "roti-de-boeuf-aux-legumes",
    "ingredients": [
      "1,5 kg de rôti de boeuf",
      "4 carottes",
      "4 pommes de terre",
      "2 oignons",
      "3 gousses d'ail",
      "1 bouquet garni",
      "Huile d'olive",
      "Sel",
      "Poivre"
    ],
    "steps": [
      "Préchauffer le four à 200°C.",
      "Éplucher et couper les carottes et les pommes de terre en morceaux.",
      "Dans un plat allant au four, disposer les légumes, les oignons émincés et l'ail en chemise.",
      "Arroser d'huile d'olive, saler et poivrer.",
      "Poser le rôti sur les légumes, ajouter le bouquet garni.",
      "Enfourner pendant 50 minutes, en retournant le rôti à mi-cuisson."
    ],
    "preparationTime": 20,
    "restingTime": 0,
    "cookingTime": 50,
    "totalTime": 70,
    "difficulty": "Moyen",
    "budget": "Élevé",
    "specialEvent": "REPAS_FAMILLE",
    "creatorId": null,
    createdAt: new Date("2024-11-05T13:40:00.000Z"),
    updatedAt: new Date("2024-11-05T13:40:00.000Z")
  },
  {
    "title": "Gratin dauphinois",
    author: "Auteur inconnu",
    "type": "PLAT",
    "people": 6,
    "slug": "gratin-dauphinois",
    "ingredients": [
      "1 kg de pommes de terre",
      "50 cl de crème fraîche",
      "2 gousses d'ail",
      "30g de beurre",
      "Sel",
      "Poivre",
      "Noix de muscade"
    ],
    "steps": [
      "Préchauffer le four à 160°C.",
      "Éplucher et couper les pommes de terre en fines rondelles.",
      "Frotter un plat à gratin avec une gousse d'ail, puis beurrer le fond.",
      "Disposer les pommes de terre en couches dans le plat.",
      "Verser la crème, saler, poivrer et ajouter une pincée de noix de muscade.",
      "Cuire au four pendant 1h30."
    ],
    "preparationTime": 15,
    "restingTime": 0,
    "cookingTime": 90,
    "totalTime": 105,
    "difficulty": "Facile",
    "budget": "Bon marché",
    "specialEvent": "REPAS_FAMILLE",
    "creatorId": null,
    createdAt: new Date("2024-11-05T13:40:00.000Z"),
    updatedAt: new Date("2024-11-05T13:40:00.000Z")
  },
  {
    "title": "Poulet rôti au four",
    author: "Auteur inconnu",
    "type": "PLAT",
    "people": 4,
    "slug": "poulet-roti-au-four",
    "ingredients": [
      "1 poulet entier",
      "50g de beurre",
      "4 branches de thym",
      "Sel",
      "Poivre"
    ],
    "steps": [
      "Préchauffer le four à 200°C.",
      "Enduire le poulet de beurre ramolli, saler et poivrer.",
      "Insérer le thym dans la cavité du poulet.",
      "Placer le poulet dans un plat et enfourner pendant 1 heure en l'arrosant régulièrement de son jus.",
      "Laisser reposer 10 minutes avant de découper."
    ],
    "preparationTime": 10,
    "restingTime": 10,
    "cookingTime": 60,
    "totalTime": 80,
    "difficulty": "Facile",
    "budget": "Bon marché",
    "specialEvent": "REPAS_FAMILLE",
    "creatorId": null,
    createdAt: new Date("2024-11-05T13:40:00.000Z"),
    updatedAt: new Date("2024-11-05T13:40:00.000Z")
  },
  {
    "title": "Gâteau au chocolat fondant",
    author: "Auteur inconnu",
    "type": "DESSERT",
    "people": 8,
    "slug": "gateau-au-chocolat-fondant",
    "ingredients": [
      "200g de chocolat noir",
      "150g de beurre",
      "150g de sucre",
      "3 œufs",
      "50g de farine"
    ],
    "steps": [
      "Préchauffer le four à 180°C.",
      "Faire fondre le chocolat avec le beurre au bain-marie.",
      "Battre les œufs avec le sucre jusqu'à blanchiment.",
      "Ajouter le chocolat fondu et la farine au mélange.",
      "Verser la préparation dans un moule et cuire 20 minutes."
    ],
    "preparationTime": 15,
    "restingTime": 0,
    "cookingTime": 20,
    "totalTime": 35,
    "difficulty": "Facile",
    "budget": "Moyen",
    "specialEvent": "REPAS_FAMILLE",
    "creatorId": null,
    createdAt: new Date("2024-11-05T13:40:00.000Z"),
    updatedAt: new Date("2024-11-05T13:40:00.000Z")
  },
  {
    "title": "Quiche lorraine",
    author: "Auteur inconnu",
    "type": "PLAT",
    "people": 6,
    "slug": "quiche-lorraine",
    "ingredients": [
      "1 pâte brisée",
      "200g de lardons",
      "3 œufs",
      "20 cl de crème fraîche",
      "Sel",
      "Poivre",
      "Noix de muscade"
    ],
    "steps": [
      "Préchauffer le four à 180°C.",
      "Faire revenir les lardons dans une poêle.",
      "Dans un bol, battre les œufs avec la crème, le sel, le poivre et la noix de muscade.",
      "Étaler la pâte dans un moule, ajouter les lardons et verser la préparation.",
      "Enfourner pendant 30 minutes."
    ],
    "preparationTime": 10,
    "restingTime": 0,
    "cookingTime": 30,
    "totalTime": 40,
    "difficulty": "Facile",
    "budget": "Bon marché",
    "specialEvent": "REPAS_FAMILLE",
    "creatorId": null,
    createdAt: new Date("2024-11-05T13:40:00.000Z"),
    updatedAt: new Date("2024-11-05T13:40:00.000Z")
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
