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
  _count?: {
    comments: number;
  }
  ratings?: RatingsProps[];
  averageRating: number;
  people?: number;
}

export interface OwnRecipesDatas extends BaseRecipe {
  ingredients: string;
  steps: string;
  specialEvent?: string;
  _count?: {
    comments: number;
  }
  ratings?: RatingsProps[];
  averageRating: number;
  creatorId: string;
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
  value: number;
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

export interface RecipeComment {
    id: string;
    content: string;
    user: UserProps;
    createdAt: string;
    recipeId: string;
}

export interface CommentResponse {
    data: RecipeComment[];
    status: string;
}

export interface SingleCommentResponse {
    data: RecipeComment;
    status: string;
    statusCode: number;
}

export interface Rating {
  value: number;
  userId: string;
  createdAt: string;
}

export interface RatingResponse {
  data: Rating;
}
