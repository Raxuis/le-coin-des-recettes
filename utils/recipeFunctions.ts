// Made this function to avoid errors when receiving datas from api for instance
export function isValidRecipe(recipe: any): recipe is RecipesProps {
    return (
        typeof recipe.id === "string" &&
        typeof recipe.title === "string" &&
        (recipe.description === undefined || typeof recipe.description === "string" || recipe.description === null) &&
        typeof recipe.type === "string" &&
        (recipe.people === undefined || typeof recipe.people === "number") &&
        Array.isArray(recipe.ingredients) &&
        recipe.ingredients.every((ingredient: any) => typeof ingredient === "string") &&
        Array.isArray(recipe.steps) &&
        recipe.steps.every((step: any) => typeof step === "string") &&
        typeof recipe.preparationTime === "number" &&
        typeof recipe.restingTime === "number" &&
        typeof recipe.cookingTime === "number" &&
        typeof recipe.totalTime === "number" &&
        typeof recipe.difficulty === "string" &&
        typeof recipe.budget === "string" &&
        (recipe.specialEvent === undefined || typeof recipe.specialEvent === "string" || recipe.specialEvent === null) &&
        typeof recipe.createdAt === "string" &&
        typeof recipe.updatedAt === "string"
    );
}

export function mapToRecipesProps(data: any): RecipesProps[] {
    return data.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || undefined,
        type: recipe.type,
        people: recipe.people ?? undefined,
        slug: recipe.slug ?? undefined,
        author: recipe.author ?? undefined,
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        preparationTime: recipe.preparationTime,
        restingTime: recipe.restingTime,
        cookingTime: recipe.cookingTime,
        totalTime: recipe.totalTime,
        difficulty: recipe.difficulty,
        budget: recipe.budget,
        specialEvent: recipe.specialEvent ?? undefined,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
    }));
}
