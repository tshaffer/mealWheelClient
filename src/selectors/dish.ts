import { isString } from 'lodash';
import { DishEntity, DishEntityRedux, DishType, MealWheelState } from '../types';

const mongoDishFromReduxDish = (dish: DishEntityRedux): DishEntity => {
  return {
    id: dish.id,
    name: dish.name,
    type: dish.type,
    minimumInterval: dish.minimumInterval,
    last: !isString(dish.lastAsStr) ? null : new Date(dish.lastAsStr),
    accompanimentRequired: dish.accompanimentRequired,
  };
};

const getReduxDishes = (state: MealWheelState): DishEntityRedux[] => {
  return state.dishesState.dishes;
};

export const getDishes = (state: MealWheelState): DishEntity[] => {
  const dishes = getReduxDishes(state);
  const allDishes: DishEntity[] = dishes.map((dish: DishEntityRedux) => {
    return mongoDishFromReduxDish(dish);
  });
  return allDishes;
};

export const getDishById = (state: MealWheelState, dishId: string): DishEntity | null => {
  // FIX TO USE MAP
  const dishes = getReduxDishes(state);
  for (const dish of dishes) {
    if (dish.id === dishId) {
      return mongoDishFromReduxDish(dish);
    }
  }
  return null;
};

const getDishesOfType = (state: MealWheelState, dishType: DishType): DishEntity[] => {

  const dishes: DishEntity[] = [];
  for (const dish of getReduxDishes(state)) {
    if (dish.type === dishType) {
      dishes.push(mongoDishFromReduxDish(dish));
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
  return getDishesOfType(state, DishType.Veggie);
};

export const getVeggieById = (state: MealWheelState, id: string): DishEntity | null => {
  const veggies: DishEntity[] = getVeggies(state);
  for (const veggie of veggies) {
    if (veggie.id === id) {
      return veggie;
    }
  }
  return null;
};

export const getSideById = (state: MealWheelState, id: string): DishEntity | null => {
  const sides: DishEntity[] = getSides(state);
  for (const side of sides) {
    if (side.id === id) {
      return side;
    }
  }
  return null;
};

export const getSaladById = (state: MealWheelState, id: string): DishEntity | null => {
  const salads: DishEntity[] = getSalads(state);
  for (const salad of salads) {
    if (salad.id === id) {
      return salad;
    }
  }
  return null;
};

export const getMainById = (state: MealWheelState, id: string): DishEntity | null => {
  const mains: DishEntity[] = getMains(state);
  for (const main of mains) {
    if (main.id === id) {
      return main;
    }
  }
  return null;
};

