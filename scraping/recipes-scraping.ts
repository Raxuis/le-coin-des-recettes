import { PrismaClient, type Recipes } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://www.marmiton.org/recettes/index/categorie/plat-principal/';

const prisma = new PrismaClient()


async function scrapeRecipeDetails(link: string) {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const ingredients: string[] = [];
    const steps: string[] = [];
    let preparationTime: number = 0;
    let restingTime: number = 0;
    let cookingTime: number = 0;
    let totalTime: number = 0;
    let difficulty: string | null = null;
    let budget: string | null = null;

    // Extraction des ingrédients car div pour chaque élément sur site marmiton
    $('.card-ingredient-title').each((_, element) => {
      const quantity = $(element).find('.card-ingredient-quantity .count').text().trim();
      const unit = $(element).find('.card-ingredient-quantity .unit').text().trim();
      const name = $(element).find('.ingredient-name').text().trim();
      const complement = $(element).find('.ingredient-complement').text().trim();

      let ingredient = quantity && unit ? `${quantity} ${unit} de ${name}`
        : quantity ? `${quantity} ${name}`
          : name;

      if (complement) {
        ingredient += ` ${complement}`;
      }

      ingredients.push(ingredient.trim());
    });

    // Extraction des temps (préparation, repos, cuisson)
    $('.time__details > div').each((_, element) => {
      const label = $(element).find('span').text().trim();
      const timeText = $(element).find('div').text().trim();

      let timeInMinutes = 0;

      if (timeText !== '-') {
        const timeMatch = timeText.match(/(\d+)\s*h\s*(\d+)?|(\d+)\s*min/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]) || 0;
          const minutes = parseInt(timeMatch[2]) || parseInt(timeMatch[3]) || 0;
          timeInMinutes = (hours * 60) + minutes;
        }
      }

      // Attribue le temps en fonction du label
      if (label.includes('Préparation')) {
        preparationTime = timeInMinutes;
      } else if (label.includes('Repos')) {
        restingTime = timeInMinutes;
      } else if (label.includes('Cuisson')) {
        cookingTime = timeInMinutes;
      }
    });

    // Calcul du temps total pour éviter de rechercher dans le DOM
    totalTime = preparationTime + restingTime + cookingTime;

    $('.recipe-primary__item .icon-difficulty + span').each((_, element) => {
      difficulty = $(element).text().trim() || null;
    });

    $('.recipe-primary__item .icon-price + span').each((_, element) => {
      budget = $(element).text().trim() || null;
    });

    $('.recipe-step-list__container > p').each((_, element) => {
      const step = $(element).text().trim();
      if (step) steps.push(step);
    });

    return {
      preparationTime,
      restingTime,
      cookingTime,
      totalTime,
      ingredients,
      steps,
      difficulty,
      budget
    };
  } catch (error) {
    console.error(`Error fetching recipe details from ${link}:`, error);
    return null;
  }
}

async function scrapeRecipes() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const recipes: any[] = [];

    $('.recipe-card').each((index, element) => {
      const title = $(element).find('.recipe-card__title').text().trim();
      const link = $(element).find('a').attr('href');
      const image = $(element).find('img').attr('src');

      if (link) {
        recipes.push({ title, link, image });
      }
    });

    for (const recipe of recipes) {
      const details = await scrapeRecipeDetails(recipe.link);
      if (details) {
        Object.assign(recipe, details);
      }
    }

    console.log(JSON.stringify(recipes, null, 2));
    try {
      const recipesToInsert = recipes.map((recipe) => ({
        title: recipe.title,
        preparationTime: recipe.preparationTime,
        restingTime: recipe.restingTime,
        cookingTime: recipe.cookingTime,
        totalTime: recipe.totalTime,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        difficulty: recipe.difficulty || '',
        budget: recipe.budget || '',
      }));

      await prisma.recipes.createMany({
        data: recipesToInsert,
      });
      console.log("Succeeded to add datas");
    } catch (error) {
      console.error("Error while adding datas", error);
    }
  } catch (error) {
    console.error('Error scraping the recipes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

scrapeRecipes();
