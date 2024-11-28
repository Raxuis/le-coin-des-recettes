export const SPECIAL_EVENTS = [
    'HALLOWEEN',
    'NOEL',
    'ANNIVERSAIRE',
    'SOIREE_ENTRE_AMIS',
    'REPAS_ETUDIANT',
    'REPAS_FAMILLE',
] as const;

export const difficulty = [
    'très facile',
    'facile',
    'moyenne'
] as const; // TODO: Add difficulties if found

export const budget = [
    'bon marché',
    "moyen",
    "assez cher"
] as const; // TODO: Add budget if found

export const category = [
    "PLAT",
    "DESSERT"
] as const;

export const RatingValue = [
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
] as const;

// Inferring types
export type SpecialEventType = (typeof SPECIAL_EVENTS)[number];
export type DifficultyType = (typeof difficulty)[number];
export type BudgetType = (typeof budget)[number];
export type RecipeCategoryType = (typeof category)[number];
export type RatingValueType = (typeof RatingValue)[number];