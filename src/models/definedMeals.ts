import { cloneDeep } from 'lodash';
import { DefinedMealEntity, DefinedMealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_DEFINED_MEAL = 'ADD_DEFINED_MEAL';
export const ADD_DEFINED_MEALS = 'ADD_DEFINED_MEALS';
export const UPDATE_DEFINED_MEAL = 'UPDATE_DEFINED_MEAL';
export const CLEAR_DEFINED_MEALS = 'CLEAR_DEFINED_MEALS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddDefinedMealPayload {
  id: string;
  definedMeal: DefinedMealEntity;
}

export const addDefinedMealRedux = (
  id: string,
  definedMeal: DefinedMealEntity
): any => {
  return {
    type: ADD_DEFINED_MEAL,
    payload: {
      id,
      definedMeal,
    }
  };
};

export interface AddDefinedMealsPayload {
  id: string;
  definedMeals: DefinedMealEntity[];
}

export const addDefinedMealsRedux = (
  definedMeals: DefinedMealEntity[]
): any => {
  return {
    type: ADD_DEFINED_MEALS,
    payload: {
      definedMeals,
    }
  };
};

export const clearDefinedMeals = (
): any => {
  return {
    type: CLEAR_DEFINED_MEALS,
  };
};

export interface UpdateDefinedMealPayload {
  id: string;
  definedMeal: DefinedMealEntity;
}

export const updateDefinedMealRedux = (
  id: string,
  definedMeal: DefinedMealEntity
): any => {
  return {
    type: UPDATE_DEFINED_MEAL,
    payload: {
      id,
      definedMeal,
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DefinedMealsState =
{
  definedMeals: [],
};

export const definedMealsStateReducer = (
  state: DefinedMealsState = initialState,
  action: MealWheelModelBaseAction<AddDefinedMealPayload & AddDefinedMealsPayload & UpdateDefinedMealPayload>
): DefinedMealsState => {
  switch (action.type) {
    case ADD_DEFINED_MEAL: {
      const newState = cloneDeep(state) as DefinedMealsState;
      newState.definedMeals.push(action.payload.definedMeal);
      return newState;
    }
    case ADD_DEFINED_MEALS: {
      const newState = cloneDeep(state) as DefinedMealsState;
      newState.definedMeals = newState.definedMeals.concat(action.payload.definedMeals);
      return newState;
    }
    case UPDATE_DEFINED_MEAL: {
      const newState = cloneDeep(state) as DefinedMealsState;
      const updatedDishes = newState.definedMeals.map((definedMeal) => (definedMeal.id === action.payload.id ? action.payload.definedMeal : definedMeal));
      newState.definedMeals = updatedDishes;
      return newState;
    }
    case CLEAR_DEFINED_MEALS: {
      return initialState;
    }
    default:
      return state;
  }
};
