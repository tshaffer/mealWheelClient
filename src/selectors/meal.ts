import { cloneDeep, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MealWheelState, ScheduledMealEntity, DefinedMealEntity, MealEntity, MealOnDate, DishEntity } from '../types';
import { 
  getMainById, 
  // getSaladById, 
  // getSideById, 
  // getVeggieById,
 } from './dish';

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
      // const salad: DishEntity | null = getSaladById(state, scheduledMeal.saladId);
      // const side: DishEntity | null = getSideById(state, scheduledMeal.sideId);
      // const veggie: DishEntity | null = getVeggieById(state, scheduledMeal.veggieId);
      const mealEntity: MealEntity = {
        id: uuidv4(),
        mainDish: mainDish as DishEntity,
        // salad: isNil(salad) ? undefined : salad,
        // veggie: isNil(veggie) ? undefined : veggie,
        // side: isNil(side) ? undefined : side,
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
