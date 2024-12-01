import {type RatingValueType} from "~/constants";

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

//👇Defining an interface corresponding to model Recipes in prisma schema due to an error

export interface BaseRecipe {
    id: string;
    title: string;
    slug: string;
    type: string;
    difficulty: string;
    budget: string;
    preparationTime: number;
    cookingTime: number;
    restingTime: number;
}

export interface RecipesProps extends BaseRecipe {
    ingredients: string[];
    steps: string[];
    totalTime: number;
    createdAt: string;
    updatedAt: string;
    specialEvent?: string;
    author: string;
    creatorId: string;
    comments?: number;
    ratingValues?: RatingValueType[];
}

export interface OwnRecipesDatas extends BaseRecipe {
    ingredients: string;
    steps: string;
    specialEvent?: string;
    comments?: number;
    ratingValues?: RatingValueType[];
}

export interface UserProps {
    id: string;
    email: string;
    name: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;

    recipes?: RecipesProps[];
    favoriteRecipes?: RecipesProps[];
    comments?: CommentsProps[];
    ratings?: RatingsProps[];
    shoppingLists?: ShoppingListProps[];
}

export interface CommentsProps {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    user: UserProps;
    recipe: RecipesProps;
}

export interface RatingsProps {
    id: string;
    value: RatingValueType;
    createdAt: Date;
    updatedAt: Date;

    user: UserProps;
    recipe: RecipesProps;
}

export interface ShoppingListProps {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;

    user: UserProps;
    items: ItemsProps[];
}

export interface ItemsProps {
    id: string;
    title: string;
    number: number;
    isChecked: boolean;

    ShoppingList: ShoppingListProps;
}
