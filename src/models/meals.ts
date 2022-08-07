import { cloneDeep } from 'lodash';
import { Meal, MealEntity, MealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_MEAL = 'ADD_MEAL';
export const CLEAR_MEALS = 'CLEAR_MEALS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddMealPayload {
  id: string;
  meal: MealEntity;
}

export const addMealRedux = (
  id: string,
  meal: MealEntity
): any => {
  return {
    type: ADD_MEAL,
    payload: {
      id,
      meal,
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

const initialState: MealsState =
{
  meals: [],
};

export const mealsStateReducer = (
  state: MealsState = initialState,
  action: MealWheelModelBaseAction<AddMealPayload>
): MealsState => {
  switch (action.type) {
    case ADD_MEAL: {
      const newState = cloneDeep(state) as MealsState;
      newState.meals.push(action.payload.meal);
      return newState;
    }
    case CLEAR_MEALS: {
      return initialState;
    }
    default:
      return state;
  }
};
