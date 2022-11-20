import { isNil } from 'lodash';
import {
  IngredientEntity,
  MealWheelState
} from '../types';

export const getIngredientIdsByDish = (state: MealWheelState, id: string): string[] => {
  if (isNil(state.ingredientsState.ingredientsByDish[id])) {
    return [];
  }
  return state.ingredientsState.ingredientsByDish[id];
};

export const getIngredientById = (state: MealWheelState, id: string): IngredientEntity | null => {
  return state.ingredientsState.ingredientsById[id];
};

export const getIngredients = (state: MealWheelState): IngredientEntity[] => {
  const ingredients: IngredientEntity[] = [];
  const ingredientsById = state.ingredientsState.ingredientsById;
  for (const ingredientId in ingredientsById) {
    if (Object.prototype.hasOwnProperty.call(ingredientsById, ingredientId)) {
      const ingredient: IngredientEntity = ingredientsById[ingredientId];
      ingredients.push(ingredient);      
    }
  }
  return ingredients;
};

