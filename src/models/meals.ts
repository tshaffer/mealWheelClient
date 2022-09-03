import { cloneDeep } from 'lodash';
import { ScheduledMealEntity, MealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_MEAL = 'ADD_MEAL';
export const ADD_MEALS = 'ADD_MEALS';
export const UPDATE_MEAL = 'UPDATE_MEAL';
export const CLEAR_MEALS = 'CLEAR_MEALS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddMealPayload {
  id: string;
  meal: ScheduledMealEntity;
}

export const addMealRedux = (
  id: string,
  meal: ScheduledMealEntity
): any => {
  return {
    type: ADD_MEAL,
    payload: {
      id,
      meal,
    }
  };
};

export interface AddMealsPayload {
  id: string;
  meals: ScheduledMealEntity[];
}

export const addMealsRedux = (
  meals: ScheduledMealEntity[]
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

export interface UpdateMealPayload {
  id: string;
  meal: ScheduledMealEntity;
}

export const updateMealRedux = (
  id: string,
  meal: ScheduledMealEntity
): any => {
  return {
    type: UPDATE_MEAL,
    payload: {
      id,
      meal,
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
  action: MealWheelModelBaseAction<AddMealPayload & AddMealsPayload & UpdateMealPayload>
): MealsState => {
  switch (action.type) {
    case ADD_MEAL: {
      const newState = cloneDeep(state) as MealsState;
      newState.meals.push(action.payload.meal);
      return newState;
    }
    case ADD_MEALS: {
      const newState = cloneDeep(state) as MealsState;
      newState.meals = newState.meals.concat(action.payload.meals);
      return newState;
    }
    case UPDATE_MEAL: {
      const newState = cloneDeep(state) as MealsState;
      const updatedDishes = newState.meals.map((meal) => (meal.id === action.payload.id ? action.payload.meal : meal));
      newState.meals = updatedDishes;
      return newState;
    }
    case CLEAR_MEALS: {
      return initialState;
    }
    default:
      return state;
  }
};
