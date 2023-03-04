import {
  DishRow,
  MealWheelState,
} from '../types';

export const getDishRows = (state: MealWheelState): DishRow[] => {
  return state.dishesUIState.rows;
};
