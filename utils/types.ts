export interface OwnRecipesDatas {
    id: string,
    title: string,
    slug: string,
    type: string,
    difficulty: string,
    budget: string,
    preparationTime: number,
    cookingTime: number,
    restingTime: number,
}

export interface UpdateOwnRecipesDatas {
    id: string,
    title: string,
    slug: string,
    type: string,
    difficulty: string,
    budget: string,
    preparationTime: number,
    cookingTime: number,
    restingTime: number,
    ingredients: string[],
    steps: string[],
    specialEvent: string | undefined,
}