import { DishEntity, MealWheelState, Meal, MealsState } from '../types';

export const getDishes = (state: MealWheelState): DishEntity[] => {
  return state.dishesState.dishes;
};

export const getMeals = (state: MealWheelState): Meal[] => {
  return state.mealsState.meals;
};

export const getMeal = (state: MealWheelState, mealId: string): Meal | null => {
  const dishes: DishEntity[] = getDishes(state);
  const d = getMatchingDish(dishes, mealId);
  return null;
};

const getMatchingDish = (dishes: DishEntity[], mealId: string) => {
  for (const dish of dishes) {
    if (dish.name === mealId) {
      return dish;
    }
  }
  return null;
};
