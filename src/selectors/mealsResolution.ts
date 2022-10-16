import { MealWheelState, VerboseScheduledMeal } from '../types';

export const getPendingMeal = (state: MealWheelState): VerboseScheduledMeal | null => {
  return state.mealsResolutionState.pendingMeal;
}

export const getMealIndex = (state: MealWheelState): number => {
  return state.mealsResolutionState.mealIndex;
};

export const getMealsToResolve = (state: MealWheelState): VerboseScheduledMeal[] => {
  return state.mealsResolutionState.mealsToResolve;
};


