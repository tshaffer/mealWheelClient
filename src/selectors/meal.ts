import { MealWheelState, ScheduledMealEntity, DefinedMealEntity } from '../types';

export const getScheduledMeals = (state: MealWheelState): ScheduledMealEntity[] => {
  return state.scheduledMealsState.scheduledMeals;
};

export const getScheduledMealsToResolve = (state: MealWheelState): ScheduledMealEntity[] => {
  return state.scheduledMealsState.scheduledMealsToResolve;
};

export const getDefinedMeals = (state: MealWheelState): DefinedMealEntity[] => {
  return state.definedMealsState.definedMeals;
};

export const getScheduledMeal = (state: MealWheelState, mealId: string): ScheduledMealEntity | null => {
  const mealEntities: ScheduledMealEntity[] = state.scheduledMealsState.scheduledMeals;
  for (const ScheduledMealEntity of mealEntities) {
    if (ScheduledMealEntity.id === mealId) {
      return ScheduledMealEntity;
    }
  }
  return null;
};

