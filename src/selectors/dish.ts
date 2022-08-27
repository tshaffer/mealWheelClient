import { DishEntity, DishType, MealWheelState } from '../types';

export const getDishes = (state: MealWheelState): DishEntity[] => {
  return state.dishesState.dishes;
};

export const getDish = (state: MealWheelState, dishId: string) => {
  // FIX TO USE MAP
  const dishes = getDishes(state);
  for (const dish of dishes) {
    if (dish.id === dishId) {
      return dish;
    }
  }
  return null;
};

// export const getMeal = (state: MealWheelState, mealId: string): Meal | null => {
//   const dishes: DishEntity[] = getDishes(state);
//   const d = getMatchingDish(dishes, mealId);
//   return null;
// };

// const getMatchingDish = (dishes: DishEntity[], mealId: string) => {
//   for (const dish of dishes) {
//     if (dish.name === mealId) {
//       return dish;
//     }
//   }
//   return null;
// };

export const getMainDishes = (state: MealWheelState): DishEntity[] => {

  const mainDishes: DishEntity[] = [];
  for (const dish of state.dishesState.dishes) {
    if (dish.type === DishType.Main) {
      mainDishes.push(dish);
    }
  }
  return mainDishes;
};

