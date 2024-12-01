import type {RatingValueType} from "~/constants";

export const calculateAverageRating = (ratings: RatingValueType[]) => {
    const numericRatings = ratings.map((value) => {
        switch (value) {
            case 'ONE':
                return 1;
            case 'TWO':
                return 2;
            case 'THREE':
                return 3;
            case 'FOUR':
                return 4;
            case 'FIVE':
                return 5;
            default:
                return 0;
        }
    });

    const totalRatings = numericRatings.reduce((acc: number, val: number) => acc + val, 0);
    return numericRatings.length > 0 ? (totalRatings / numericRatings.length).toFixed(1) : null;
};
