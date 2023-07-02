import { isString } from 'lodash';
import {
  DishEntity,
  DishEntityRedux,
  DishType,
  MealWheelState
} from '../types';

const mongoDishFromReduxDish = (dish: DishEntityRedux): DishEntity => {
  return {
    id: dish.id,
    name: dish.name,
    dishType: dish.dishType,
    minimumInterval: dish.minimumInterval,
    last: !isString(dish.lastAsStr) ? null : new Date(dish.lastAsStr),
    suggestedAccompanimentTypeSpecs: dish.suggestedAccompanimentTypeSpecs,
    prepEffort: dish.prepEffort,
    prepTime: dish.prepTime,
    cleanupEffort: dish.cleanupEffort,

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
    if (dish.dishType === dishType) {
      dishes.push(mongoDishFromReduxDish(dish));
    }
  }
  return dishes;
};

const getDishesNotOfType = (state: MealWheelState, dishType: DishType): DishEntity[] => {

  const dishes: DishEntity[] = [];
  for (const dish of getReduxDishes(state)) {
    if (dish.dishType !== dishType) {
      dishes.push(mongoDishFromReduxDish(dish));
    }
  }
  return dishes;
};

export const getMains = (state: MealWheelState): DishEntity[] => {
  return getDishesOfType(state, 'main');
};

export const getAccompaniments = (state: MealWheelState): DishEntity[] => {
  return getDishesNotOfType(state, 'main');
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

export const getAccompanimentById = (state: MealWheelState, id: string): DishEntity | null => {
  const accompaniments: DishEntity[] = getAccompaniments(state);
  for (const accompaniment of accompaniments) {
    if (accompaniment.id === id) {
      return accompaniment;
    }
  }
  return null;
};

