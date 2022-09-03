import { isNil } from 'lodash';
import { getDish } from '.';
import { MealWheelState, ScheduledMealEntity, DetailedMealEntity, DishEntity } from '../types';

export const getMeals = (state: MealWheelState): ScheduledMealEntity[] => {
  return state.mealsState.meals;
};

export const getMeal = (state: MealWheelState, mealId: string): ScheduledMealEntity | null => {
  const mealEntities: ScheduledMealEntity[] = state.mealsState.meals;
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

export const getDetailedMeals = (state: MealWheelState, meals: ScheduledMealEntity[], dishes: DishEntity[]): DetailedMealEntity[] => {

  if (isNil(meals) || meals.length === 0) {
    return [];
  }
  if (isNil(dishes) || dishes.length === 0) {
    return [];
  }

  const detailedMealEntities: DetailedMealEntity[] = [];
  // for (const ScheduledMealEntity of meals) {
  //   const detailedMealEntity: DetailedMealEntity = {
  //     id: ScheduledMealEntity.id,
  //     userId: ScheduledMealEntity.userId,
  //     mainDish: getDish(state, ScheduledMealEntity.mainDishId) as DishEntity,
  //     accompanimentDish: isNil(ScheduledMealEntity.accompanimentDishId) ? null : getDish(state, ScheduledMealEntity.accompanimentDishId) as DishEntity,
  //     dateScheduled: ScheduledMealEntity.dateScheduled,
  //     status: ScheduledMealEntity.status,
  //   };
  //   detailedMealEntities.push(detailedMealEntity);
  // }

  return detailedMealEntities;
};
