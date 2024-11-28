import {
    type RecipeCategoryType,
    type SpecialEventType,
    type BudgetType,
    type DifficultyType,
    type RatingValueType
} from "~/constants";

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

//👇Defining an interface corresponding to model Recipes in prisma schema due to an error
export interface RecipesProps {
    id: string;
    title: string;
    description?: string;
    type: RecipeCategoryType;
    people?: number;
    slug?: string;
    author?: string;
    ingredients: string[];
    steps: string[];
    preparationTime: number;
    restingTime: number;
    cookingTime: number;
    totalTime: number;
    difficulty: DifficultyType;
    budget: BudgetType;
    specialEvent?: SpecialEventType;

    creator?: UserProps;
    favoritedBy?: UserProps[];
    comments?: CommentsProps[];
    ratings?: RatingsProps[];

    createdAt: Date;
    updatedAt: Date;
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
