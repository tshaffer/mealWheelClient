import { cloneDeep } from 'lodash';
import { MealEntity, UnassignedMealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_MEALS = 'ADD_MEALS';

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
    default:
      return state;
  }
};
