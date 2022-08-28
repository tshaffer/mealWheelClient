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

const getDishesOfType = (state: MealWheelState, dishType: DishType): DishEntity[] => {

  const dishes: DishEntity[] = [];
  for (const dish of state.dishesState.dishes) {
    if (dish.type === dishType) {
      dishes.push(dish);
    }
  }
  return dishes;
};

export const getMains = (state: MealWheelState): DishEntity[] => {
  return getDishesOfType(state, DishType.Main);
};

export const getSides = (state: MealWheelState): DishEntity[] => {
  return getDishesOfType(state, DishType.Side);
};

export const getSalads = (state: MealWheelState): DishEntity[] => {
  return getDishesOfType(state, DishType.Salad);
};

export const getVeggies = (state: MealWheelState): DishEntity[] => {
  return getDishesOfType(state, DishType.Veg);
};
