import {
  DishRow,
  MealWheelState,
} from '../types';

export const getDishRows = (state: MealWheelState): DishRow[] => {
  return state.dishesUIState.rows;
};

export const getCurrentEditDish =  (state: MealWheelState): DishRow | null => {
  return state.dishesUIState.currentEditDish;
};
