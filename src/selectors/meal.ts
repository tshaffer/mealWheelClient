import { isNil } from 'lodash';
import { MealWheelState, ScheduledMealEntity, DefinedMealEntity, MealEntity } from '../types';

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

export const getScheduledMealByDate = (state: MealWheelState, targetMealDate: Date): ScheduledMealEntity | null => {

  const targetMealYear = targetMealDate.getFullYear();
  const targetMealMonth = targetMealDate.getMonth();
  const targetMealDayInMonth = targetMealDate.getDate();

  const mealEntities: ScheduledMealEntity[] = state.scheduledMealsState.scheduledMeals;
  for (const mealEntity of mealEntities) {
    const existingMealYear = mealEntity.dateScheduled.getFullYear();
    const existingMealMonth = mealEntity.dateScheduled.getMonth();
    const existingMealDayInMonth = mealEntity.dateScheduled.getDate();
    if (targetMealYear === existingMealYear && targetMealMonth === existingMealMonth && targetMealDayInMonth === existingMealDayInMonth) {
      return mealEntity;
    }
  }
  return null;
};

export const getScheduledMealsForDays = (state: MealWheelState, mealDate: Date, numberOfDays: number): ScheduledMealEntity[] => {

  const mealEntities: ScheduledMealEntity[] = [];

  for (let dayIndex = 0; dayIndex < numberOfDays; dayIndex++) {

    const scheduledMeal: ScheduledMealEntity | null = getScheduledMealByDate(state, mealDate);
    if (!isNil(scheduledMeal)) {
      mealEntities.push(scheduledMeal);
    }
    mealDate.setDate(mealDate.getDate() + 1);

  }

  return mealEntities;
};

export const getUnassignedMeals = (state: MealWheelState): MealEntity[] => {
  return state.unassignedMealsState.meals;
};
