import {
  MealWheelState
} from '../types';

export const getGroceryListStartDate = (state: MealWheelState): Date => {
  return state.generateGroceryListState.startDate;
};

export const getNumberOfMealsInGroceryList = (state: MealWheelState): number => {
  return state.generateGroceryListState.numberOfMealsInGroceryList;
};

