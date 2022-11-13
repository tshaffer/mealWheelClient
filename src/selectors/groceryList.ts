import {
  IngredientEntity,
  MealWheelState
} from '../types';

export const getGroceryListIngredients = (state: MealWheelState): IngredientEntity[] => {
  return state.groceryListState.ingredients;
};