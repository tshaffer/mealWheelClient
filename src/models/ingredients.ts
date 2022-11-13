import { MealWheelModelBaseAction } from './baseAction';

import {
  IngredientEntity,
  IngredientsByDish,
  IngredientsState,
} from '../types';
import { cloneDeep } from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const SET_INGREDIENTS_BY_DISH = 'SET_INGREDIENTS_BY_DISH';

// ------------------------------------
// Actions
// ------------------------------------
export interface AddIngredientsPayload {
  ingredients: IngredientEntity[];
}

export const addIngredientsRedux = (
  ingredients: IngredientEntity[]
): any => {
  return {
    type: ADD_INGREDIENTS,
    payload: {
      ingredients,
    }
  };
};

export interface SetIngredientsByDishPayload {
  ingredientsByDish: IngredientsByDish;
}

export const setIngredientsByDishRedux = (
  ingredientsByDish: IngredientsByDish
): any => {
  return {
    type: SET_INGREDIENTS_BY_DISH,
    payload: {
      ingredientsByDish,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: IngredientsState =
{
  ingredientsById: {},
  ingredientsByDish: {},
};

export const ingredientsStateReducer = (
  state: IngredientsState = initialState,
  action: MealWheelModelBaseAction<AddIngredientsPayload & SetIngredientsByDishPayload>
): IngredientsState => {
  switch (action.type) {
    case ADD_INGREDIENTS: {
      const newState = cloneDeep(state) as IngredientsState;
      action.payload.ingredients.forEach( (ingredient: IngredientEntity) => {
        newState.ingredientsById[ingredient.id] = ingredient;
      });
      return newState;
    }
    case SET_INGREDIENTS_BY_DISH: {
      return { ...state, ingredientsByDish: action.payload.ingredientsByDish };
    }
    default:
      return state;
  }
};


