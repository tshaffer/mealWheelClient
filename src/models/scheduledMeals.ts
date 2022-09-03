import { cloneDeep } from 'lodash';
import { ScheduledMealEntity, ScheduledMealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_SCHEDULED_MEAL = 'ADD_SCHEDULED_MEAL';
export const ADD_SCHEDULED_MEALS = 'ADD_SCHEDULED_MEALS';
export const UPDATE_SCHEDULED_MEAL = 'UPDATE_SCHEDULED_MEAL';
export const CLEAR_SCHEDULED_MEALS = 'CLEAR_SCHEDULED_MEALS';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddScheduledMealPayload {
  id: string;
  scheduledMeal: ScheduledMealEntity;
}

export const addScheduledMealRedux = (
  id: string,
  scheduledMeal: ScheduledMealEntity
): any => {
  return {
    type: ADD_SCHEDULED_MEAL,
    payload: {
      id,
      scheduledMeal,
    }
  };
};

export interface AddScheduledMealsPayload {
  id: string;
  scheduledMeals: ScheduledMealEntity[];
}

export const addScheduledMealsRedux = (
  scheduledMeals: ScheduledMealEntity[]
): any => {
  return {
    type: ADD_SCHEDULED_MEALS,
    payload: {
      scheduledMeals,
    }
  };
};

export const clearScheduledMeals = (
): any => {
  return {
    type: CLEAR_SCHEDULED_MEALS,
  };
};

export interface UpdateScheduledMealPayload {
  id: string;
  scheduledMeal: ScheduledMealEntity;
}

export const updateScheduledMealRedux = (
  id: string,
  scheduledMeal: ScheduledMealEntity
): any => {
  return {
    type: UPDATE_SCHEDULED_MEAL,
    payload: {
      id,
      scheduledMeal,
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ScheduledMealsState =
{
  scheduledMeals: [],
};

export const scheduledMealsStateReducer = (
  state: ScheduledMealsState = initialState,
  action: MealWheelModelBaseAction<AddScheduledMealPayload & AddScheduledMealsPayload & UpdateScheduledMealPayload>
): ScheduledMealsState => {
  switch (action.type) {
    case ADD_SCHEDULED_MEAL: {
      const newState = cloneDeep(state) as ScheduledMealsState;
      newState.scheduledMeals.push(action.payload.scheduledMeal);
      return newState;
    }
    case ADD_SCHEDULED_MEALS: {
      const newState = cloneDeep(state) as ScheduledMealsState;
      newState.scheduledMeals = newState.scheduledMeals.concat(action.payload.scheduledMeals);
      return newState;
    }
    case UPDATE_SCHEDULED_MEAL: {
      const newState = cloneDeep(state) as ScheduledMealsState;
      const updatedDishes = newState.scheduledMeals.map((scheduledMeal) => (scheduledMeal.id === action.payload.id ? action.payload.scheduledMeal : scheduledMeal));
      newState.scheduledMeals = updatedDishes;
      return newState;
    }
    case CLEAR_SCHEDULED_MEALS: {
      return initialState;
    }
    default:
      return state;
  }
};
