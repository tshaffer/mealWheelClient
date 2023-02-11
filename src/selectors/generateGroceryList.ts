import {
  MealWheelState
} from '../types';

export const getGroceryListStartDate = (state: MealWheelState): Date => {
  return new Date(state.generateGroceryListState.startDateAsStr);
};

export const getNumberOfMealsInGroceryList = (state: MealWheelState): number => {
  return state.generateGroceryListState.numberOfMealsInGroceryList;
};

export const getShowStaples = (state: MealWheelState): boolean => {
  return state.generateGroceryListState.showStaples;
};
