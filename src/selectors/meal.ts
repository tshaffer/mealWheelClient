import { isNil } from 'lodash';
import { getDish } from '.';
import { MealWheelState, MealEntity, DetailedMealEntity, DishEntity } from '../types';

export const getMeals = (state: MealWheelState): MealEntity[] => {
  return state.mealsState.meals;
};

export const getMeal = (state: MealWheelState, mealId: string): MealEntity | null => {
  const mealEntities: MealEntity[] = state.mealsState.meals;
  for (const mealEntity of mealEntities) {
    if (mealEntity.id === mealId) {
      return mealEntity;
    }
  }
  return null;
};

// export const getDetailedMeals = (state: MealWheelState): DetailedMealEntity[] => {
//   if (state.mealsState.meals.length > 0) {
//     debugger;
//   }
//   return state.mealsState.meals.map((mealEntity: MealEntity) => {
//     return {
//       id: mealEntity.id,
//       userId: mealEntity.userId,
//       mainDish: getDish(state, mealEntity.mainDishId) as DishEntity,
//       accompanimentDish: isNil(mealEntity.accompanimentDishId) ? null : getDish(state, mealEntity.accompanimentDishId) as DishEntity,
//       dateScheduled: mealEntity.dateScheduled,
//       status: mealEntity.status,
//     };
//   });
// };

export const getDetailedMeals = (state: MealWheelState, meals: MealEntity[], dishes: DishEntity[]): DetailedMealEntity[] => {

  if (isNil(meals) || meals.length === 0) {
    return [];
  }
  if (isNil(dishes) || dishes.length === 0) {
    return [];
  }

  const detailedMealEntities: DetailedMealEntity[] = [];
  for (const mealEntity of meals) {
    const detailedMealEntity: DetailedMealEntity = {
      id: mealEntity.id,
      userId: mealEntity.userId,
      mainDish: getDish(state, mealEntity.mainDishId) as DishEntity,
      accompanimentDish: isNil(mealEntity.accompanimentDishId) ? null : getDish(state, mealEntity.accompanimentDishId) as DishEntity,
      dateScheduled: mealEntity.dateScheduled,
      status: mealEntity.status,
    };
    detailedMealEntities.push(detailedMealEntity);
  }

  return detailedMealEntities;
};
