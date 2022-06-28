import { DishEntity, MealWheelState } from '../types';

export const getDishes = (state: MealWheelState): DishEntity[] => {
  return state.dishesState.dishes;
};

