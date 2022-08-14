import { MealWheelState, Meal } from '../types';

export const getMeals = (state: MealWheelState): Meal[] => {
  return state.mealsState.meals;
};

