import {
  MealWheelState
} from '../types';

export const getStartDate = (state: MealWheelState): Date => {
  console.log('getStartDate');
  console.log(state.generateMealsState.startDateAsStr);
  const startDate: Date = new Date(state.generateMealsState.startDateAsStr);
  console.log(startDate);
  return startDate;
};

export const getNumberOfMealsToGenerate = (state: MealWheelState): number => {
  return state.generateMealsState.numberOfMealsToGenerate;
};
