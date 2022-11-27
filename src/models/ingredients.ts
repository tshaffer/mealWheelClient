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
export const ADD_INGREDIENT_TO_DISH = 'ADD_INGREDIENT_TO_DISH';
export const REPLACE_INGREDIENT_IN_DISH = 'REPLACE_INGREDIENT_IN_DISH';
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

export interface AddIngredientToDishPayload {
  dishId: string;
  ingredientEntity: IngredientEntity;
}

export const addIngredientToDish = (
  dishId: string,
  ingredientEntity: IngredientEntity,
): any => {
  return {
    type: ADD_INGREDIENT_TO_DISH,
    payload: {
      dishId,
      ingredientEntity,
    }
  };
};

export interface ReplaceIngredientToDishPayload {
  dishId: string;
  existingIngredientId: string;
  ingredientEntity: IngredientEntity;
}

export const replaceIngredientInDish = (
  dishId: string,
  existingIngredientId: string,
  ingredientEntity: IngredientEntity,
): any => {
  return {
    type: REPLACE_INGREDIENT_IN_DISH,
    payload: {
      dishId,
      existingIngredientId,
      ingredientEntity,
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
  action: MealWheelModelBaseAction<AddIngredientsPayload & AddIngredientToDishPayload & ReplaceIngredientToDishPayload & SetIngredientsByDishPayload>
): IngredientsState => {
  switch (action.type) {
    case ADD_INGREDIENTS: {
      const newState = cloneDeep(state) as IngredientsState;
      action.payload.ingredients.forEach( (ingredient: IngredientEntity) => {
        newState.ingredientsById[ingredient.id] = ingredient;
      });
      return newState;
    }
    case ADD_INGREDIENT_TO_DISH: {
      const newState = cloneDeep(state) as IngredientsState;
      newState.ingredientsByDish[action.payload.dishId].push(action.payload.ingredientEntity.id);
      return newState;
    }
    case REPLACE_INGREDIENT_IN_DISH: {
      const newState = cloneDeep(state) as IngredientsState;
      let ingredientIdsInDish: string[] = newState.ingredientsByDish[action.payload.dishId];
      ingredientIdsInDish = ingredientIdsInDish.filter(e => e !== action.payload.existingIngredientId);
      ingredientIdsInDish.push(action.payload.ingredientEntity.id);
      newState.ingredientsByDish[action.payload.dishId] = ingredientIdsInDish;
      return newState;
    }
    case SET_INGREDIENTS_BY_DISH: {
      return { ...state, ingredientsByDish: action.payload.ingredientsByDish };
    }
    default:
      return state;
  }
};


