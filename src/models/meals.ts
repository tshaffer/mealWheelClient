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

export interface AddMealPayload {
  mainDishId: string;
  nonMainDishIds: string[];
}

export const addMeal = (
  mainDishId: string,
  nonMainDishIds: string[],
): any => {
  return {
    type: ADD_MEAL,
    payload: {
      mainDishId,
      nonMainDishIds,
    }
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
      newState.meals.push({
        mainDishId: action.payload.mainDishId,
        nonMainDishIds: action.payload.nonMainDishIds,
      });
      return newState;
    }
    default:
      return state;
  }
};
