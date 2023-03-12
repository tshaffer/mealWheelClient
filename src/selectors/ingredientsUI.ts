import {
  IngredientRow,
  MealWheelState,
  Order,
} from '../types';

export const getIngredientRows = (state: MealWheelState): IngredientRow[] => {
  return state.ingredientsUIState.rows;
};

export const getCurrentEditIngredient =  (state: MealWheelState): IngredientRow | null => {
  return state.ingredientsUIState.currentEditIngredient;
};

export const getIngredientSortOrder =  (state: MealWheelState): Order => {
  return state.ingredientsUIState.sortOrder;
};

export const getIngredientSortBy =  (state: MealWheelState): string => {
  return state.ingredientsUIState.sortBy;
};
