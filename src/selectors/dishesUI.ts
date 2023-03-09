import {
  DishRow,
  MealWheelState,
  Order,
} from '../types';

export const getDishRows = (state: MealWheelState): DishRow[] => {
  return state.dishesUIState.rows;
};

export const getCurrentEditDish =  (state: MealWheelState): DishRow | null => {
  return state.dishesUIState.currentEditDish;
};

export const getSortOrder =  (state: MealWheelState): Order => {
  return state.dishesUIState.sortOrder;
};

export const getSortBy =  (state: MealWheelState): string => {
  return state.dishesUIState.sortBy;
};
