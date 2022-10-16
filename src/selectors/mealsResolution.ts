import { MealWheelState, VerboseScheduledMeal } from '../types';

export const getPendingMeal = (state: MealWheelState): VerboseScheduledMeal | null => {
  if (state.mealsResolutionState.mealsToResolve.length > 0) {
    return state.mealsResolutionState.mealsToResolve[state.mealsResolutionState.mealIndex];
  }
  return null;
};

export const getMealIndex = (state: MealWheelState): number => {
  return state.mealsResolutionState.mealIndex;
};

export const getMealsToResolve = (state: MealWheelState): VerboseScheduledMeal[] => {
  return state.mealsResolutionState.mealsToResolve;
};


