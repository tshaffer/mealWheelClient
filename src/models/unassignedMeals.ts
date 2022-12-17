import { cloneDeep } from 'lodash';
import { MealEntity, UnassignedMealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_MEALS = 'ADD_MEALS';
export const CLEAR_MEALS = 'CLEAR_MEALS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddMealsPayload {
  meals: MealEntity[];
}

export const addMeals = (
  meals: MealEntity[]
): any => {
  return {
    type: ADD_MEALS,
    payload: {
      meals,
    }
  };
};

export const clearMeals = (
): any => {
  return {
    type: CLEAR_MEALS,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: UnassignedMealsState =
{
  meals: [],
};

export const unassignedMealsStateReducer = (
  state: UnassignedMealsState = initialState,
  action: MealWheelModelBaseAction< AddMealsPayload>
): UnassignedMealsState => {
  switch (action.type) {
    case ADD_MEALS: {
      const newState = cloneDeep(state) as UnassignedMealsState;
      newState.meals = newState.meals.concat(action.payload.meals);
      return newState;
    }
    case CLEAR_MEALS:
      return initialState;
    default:
      return state;
  }
};
