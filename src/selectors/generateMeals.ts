import {
  MealWheelState
} from '../types';

export const getStartDate = (state: MealWheelState): Date => {
  return state.generateMealsState.startDate;
};

export const getNumberOfMealsToGenerate = (state: MealWheelState): number => {
  return state.generateMealsState.numberOfMealsToGenerate;
};

export const getOverwriteExistingMeals = (state: MealWheelState): boolean => {
  return state.generateMealsState.overwriteExistingMeals;
};
