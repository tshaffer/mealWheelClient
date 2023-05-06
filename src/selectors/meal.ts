import { cloneDeep, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MealWheelState, ScheduledMealEntity, MealEntity, MealOnDate, DishEntity } from '../types';
import {
  getAccompanimentById,
  getMainById,
} from './dish';

export const getScheduledMeals = (state: MealWheelState): ScheduledMealEntity[] => {
  return state.scheduledMealsState.scheduledMeals;
};

export const getScheduledMealsToResolve = (state: MealWheelState): ScheduledMealEntity[] => {
  return state.scheduledMealsState.scheduledMealsToResolve;
};

export const getScheduledMeal = (state: MealWheelState, mealId: string): ScheduledMealEntity | null => {
  const mealEntities: ScheduledMealEntity[] = state.scheduledMealsState.scheduledMeals;
  for (const scheduledMealEntity of mealEntities) {
    if (scheduledMealEntity.id === mealId) {
      return scheduledMealEntity;
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

  let localMealDate = cloneDeep(mealDate);

  const mealEntities: ScheduledMealEntity[] = [];

  for (let dayIndex = 0; dayIndex < numberOfDays; dayIndex++) {

    const scheduledMeal: ScheduledMealEntity | null = getScheduledMealByDate(state, localMealDate);
    if (!isNil(scheduledMeal)) {
      mealEntities.push(scheduledMeal);
    }
    localMealDate = cloneDeep(localMealDate);
    localMealDate.setDate(localMealDate.getDate() + 1);

  }

  return mealEntities;
};

export const getMealsOnDatesForDays = (state: MealWheelState, mealDate: Date, numberOfDays: number): MealOnDate[] => {

  let localMealDate = cloneDeep(mealDate);

  const mealOnDates: MealOnDate[] = [];

  for (let dayIndex = 0; dayIndex < numberOfDays; dayIndex++) {

    const scheduledMeal: ScheduledMealEntity | null = getScheduledMealByDate(state, localMealDate);
    if (!isNil(scheduledMeal)) {

      const mainDish: DishEntity | null = getMainById(state, scheduledMeal.mainDishId);

      const accompanimentDishes: DishEntity[] = [];
      if (!isNil(scheduledMeal.accompanimentIds)) {
        scheduledMeal.accompanimentIds.forEach((accomplishmentDishId: string) => {
          const dish: DishEntity | null = getAccompanimentById(state, accomplishmentDishId);
          if (!isNil(dish)) {
            accompanimentDishes.push(dish);
          }
        });
      }

      const mealEntity: MealEntity = {
        id: uuidv4(),
        mainDish: mainDish as DishEntity,
        accompanimentDishes,
      };
      const mealOnDate: MealOnDate = {
        date: localMealDate,
        meal: mealEntity,
      };
      mealOnDates.push(mealOnDate);
    } else {
      const mealOnDate: MealOnDate = {
        date: localMealDate,
        meal: null,
      };
      mealOnDates.push(mealOnDate);
    }
    localMealDate = cloneDeep(localMealDate);
    localMealDate.setDate(localMealDate.getDate() + 1);
  }

  return mealOnDates;

};

export const getUnassignedMeals = (state: MealWheelState): MealEntity[] => {
  return state.unassignedMealsState.meals;
};
