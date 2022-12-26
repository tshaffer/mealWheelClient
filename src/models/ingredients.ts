import { MealWheelModelBaseAction } from './baseAction';

import {
  IngredientEntity,
  IngredientsByDish,
  IngredientsState,
} from '../types';
import { cloneDeep, isArray, isNil } from 'lodash';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const ADD_INGREDIENT_TO_DISH = 'ADD_INGREDIENT_TO_DISH';
export const REPLACE_INGREDIENT_IN_DISH = 'REPLACE_INGREDIENT_IN_DISH';
export const DELETE_INGREDIENT_FROM_DISH = 'DELETE_INGREDIENT_FROM_DISH';
export const SET_INGREDIENTS_BY_DISH = 'SET_INGREDIENTS_BY_DISH';

// ------------------------------------
// Actions
// ------------------------------------
export interface IngredientPayload {
  ingredient: IngredientEntity;
}

export const addIngredientRedux = (
  ingredient: IngredientEntity
): any => {
  return {
    type: ADD_INGREDIENT,
    payload: {
      ingredient,
    }
  };
};

export const updateIngredientRedux = (
  ingredient: IngredientEntity
): any => {
  return {
    type: UPDATE_INGREDIENT,
    payload: {
      ingredient,
    }
  };
};

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

export const addIngredientToDishRedux = (
  dishId: string,
  ingredientEntity: IngredientEntity, // TODO - change to ingredientId
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
  newIngredientId: string;
}

export const replaceIngredientInDishRedux = (
  dishId: string,
  existingIngredientId: string,
  newIngredientId: string,
): any => {
  return {
    type: REPLACE_INGREDIENT_IN_DISH,
    payload: {
      dishId,
      existingIngredientId,
      newIngredientId,
    }
  };
};

export interface DeleteIngredientFromDishPayload {
  dishId: string;
  ingredientId: string;
}

export const deleteIngredientFromDishRedux = (
  dishId: string,
  ingredientId: string,
): any => {
  return {
    type: DELETE_INGREDIENT_FROM_DISH,
    payload: {
      dishId,
      ingredientId,
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
  action: MealWheelModelBaseAction<IngredientPayload & AddIngredientsPayload & AddIngredientToDishPayload & ReplaceIngredientToDishPayload & SetIngredientsByDishPayload & DeleteIngredientFromDishPayload>
): IngredientsState => {
  switch (action.type) {
    case ADD_INGREDIENT:
    case UPDATE_INGREDIENT:
      return {
        ...state,
        ingredientsById: {
          ...state.ingredientsById,
          [action.payload.ingredient.id]: action.payload.ingredient
        }
      };
    case ADD_INGREDIENTS: {
      const newState = cloneDeep(state) as IngredientsState;
      action.payload.ingredients.forEach((ingredient: IngredientEntity) => {
        newState.ingredientsById[ingredient.id] = ingredient;
      });
      return newState;
    }
    case ADD_INGREDIENT_TO_DISH: {
      const newState = cloneDeep(state) as IngredientsState;
      if (!Object.prototype.hasOwnProperty.call(newState.ingredientsByDish, action.payload.dishId)) {
        newState.ingredientsByDish = {};
      }
      if (!isArray(newState.ingredientsByDish[action.payload.dishId])) {
        newState.ingredientsByDish[action.payload.dishId] = [];
      }
      newState.ingredientsByDish[action.payload.dishId].push(action.payload.ingredientEntity.id);
      return newState;
    }
    case REPLACE_INGREDIENT_IN_DISH: {
      const newState = cloneDeep(state) as IngredientsState;
      let ingredientIdsInDish: string[] = newState.ingredientsByDish[action.payload.dishId];
      ingredientIdsInDish = ingredientIdsInDish.filter(e => e !== action.payload.existingIngredientId);
      ingredientIdsInDish.push(action.payload.newIngredientId);
      newState.ingredientsByDish[action.payload.dishId] = ingredientIdsInDish;
      return newState;
    }
    case DELETE_INGREDIENT_FROM_DISH: {
      const newState = cloneDeep(state) as IngredientsState;
      const ingredientIdsInDish: string[] = newState.ingredientsByDish[action.payload.dishId];
      newState.ingredientsByDish[action.payload.dishId] = ingredientIdsInDish.filter(e => e !== action.payload.ingredientId);
      return newState;
    }
    case SET_INGREDIENTS_BY_DISH: {
      return { ...state, ingredientsByDish: action.payload.ingredientsByDish };
    }
    default:
      return state;
  }
};


