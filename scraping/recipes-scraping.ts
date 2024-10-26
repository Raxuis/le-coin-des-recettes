import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://www.marmiton.org/recettes/index/categorie/plat-principal/';

async function scrapeRecipeDetails(link: string) {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const ingredients: string[] = [];
    const steps: string[] = [];
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

    $('.recipe-primary__item span').each((_, element) => {
      const timeText = $(element).text().trim();
      if (timeText) {
        const timeMatch = timeText.match(/(\d+)\s*min/); // Regex pour faire correspondre les caractères avant "min"
        if (timeMatch) {
          totalTime = parseInt(timeMatch[1]);
        }
      }
    });

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

    return { totalTime, ingredients, steps, difficulty, budget };
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
      recipe.details = details;
    }

    console.log(JSON.stringify(recipes, null, 2));
  } catch (error) {
    console.error('Error scraping the recipes:', error);
  }
}

scrapeRecipes();
