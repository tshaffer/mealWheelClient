import { cloneDeep } from 'lodash';
import { Meal, MealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_MEAL = 'ADD_MEAL';

// ------------------------------------
// Actions
// ------------------------------------

export type AddMealPayload = Meal;

export const addMeal = (
  meal: Meal,
): any => {
  return {
    type: ADD_MEAL,
    payload: meal,
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
      newState.meals.push(action.payload);
      return newState;
    }
    default:
      return state;
  }
};
