import { DishesMap, MealWheelState } from '../types';

export const getDishes = (state: MealWheelState): DishesMap => {
  return state.dishesState.dishes;
};

