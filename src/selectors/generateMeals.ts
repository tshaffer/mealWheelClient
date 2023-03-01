import {
  MealWheelState
} from '../types';

export const getStartDate = (state: MealWheelState): Date => {
  const startDate: Date = new Date(state.generateMealsState.startDateAsStr);
  return startDate;
};

export const getNumberOfMealsToGenerate = (state: MealWheelState): number => {
  return state.generateMealsState.numberOfMealsToGenerate;
};
