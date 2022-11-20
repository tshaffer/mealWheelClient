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
  for (const ingredientId in state.ingredientsState.ingredientsById) {
    if (state.ingredientsState.ingredientsById.prototype.hasOwnProperty.call(state.ingredientsState.ingredientsById, ingredientId)) {
      const ingredient: IngredientEntity = state.ingredientsState.ingredientsById[ingredientId];
      ingredients.push(ingredient);
    }
  }
  return ingredients;
};

