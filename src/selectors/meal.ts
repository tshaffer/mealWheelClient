import { isNil } from 'lodash';
import { getDish } from '.';
import { MealWheelState, ScheduledMealEntity, DefinedMealEntity, DetailedMealEntity, DishEntity } from '../types';

export const getScheduledMeals = (state: MealWheelState): ScheduledMealEntity[] => {
  return state.scheduledMealsState.scheduledMeals;
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

// export const getDetailedMeals = (state: MealWheelState): DetailedMealEntity[] => {
//   if (state.mealsState.meals.length > 0) {
//     debugger;
//   }
//   return state.mealsState.meals.map((ScheduledMealEntity: ScheduledMealEntity) => {
//     return {
//       id: ScheduledMealEntity.id,
//       userId: ScheduledMealEntity.userId,
//       mainDish: getDish(state, ScheduledMealEntity.mainDishId) as DishEntity,
//       accompanimentDish: isNil(ScheduledMealEntity.accompanimentDishId) ? null : getDish(state, ScheduledMealEntity.accompanimentDishId) as DishEntity,
//       dateScheduled: ScheduledMealEntity.dateScheduled,
//       status: ScheduledMealEntity.status,
//     };
//   });
// };

export const getDetailedMeals = (state: MealWheelState, scheduledMeals: ScheduledMealEntity[], dishes: DishEntity[]): DetailedMealEntity[] => {

  if (isNil(scheduledMeals) || scheduledMeals.length === 0) {
    return [];
  }
  if (isNil(dishes) || dishes.length === 0) {
    return [];
  }

  const detailedMealEntities: DetailedMealEntity[] = [];
  for (const scheduledMeal of scheduledMeals) {

    const salad: DishEntity | null = getDish(state, scheduledMeal.saladId);
    const veggie: DishEntity | null = getDish(state, scheduledMeal.veggieId);
    const side: DishEntity | null = getDish(state, scheduledMeal.sideId);

    const detailedMealEntity: DetailedMealEntity = {
      id: scheduledMeal.id,
      userId: scheduledMeal.userId,
      mainDish: getDish(state, scheduledMeal.mainDishId) as DishEntity,
      salad,
      veggie,
      side,
      dateScheduled: scheduledMeal.dateScheduled,
      status: scheduledMeal.status,
    };
    detailedMealEntities.push(detailedMealEntity);
  }

  return detailedMealEntities;
};

