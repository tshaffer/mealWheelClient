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
const SET_SCHEDULED_MEALS_TO_RESOLVE = 'SET_SCHEDULED_MEALS_TO_RESOLVE';
const CLEAR_SCHEDULED_MEALS_TO_RESOLVE = 'CLEAR_SCHEDULED_MEALS_TO_RESOLVE';

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

export interface SetScheduledMealsToResolvePayload {
  id: string;
  scheduledMealsToResolve: ScheduledMealEntity[];
}

export const setScheduledMealsToResolveRedux = (
  scheduledMealsToResolve: ScheduledMealEntity[]
): any => {
  return {
    type: SET_SCHEDULED_MEALS_TO_RESOLVE,
    payload: {
      scheduledMealsToResolve,
    }
  };
};

export const clearScheduledMealsToResolve = (
): any => {
  return {
    type: CLEAR_SCHEDULED_MEALS_TO_RESOLVE,
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ScheduledMealsState =
{
  scheduledMeals: [],
  scheduledMealsToResolve: [],
};

export const scheduledMealsStateReducer = (
  state: ScheduledMealsState = initialState,
  action: MealWheelModelBaseAction<AddScheduledMealPayload & AddScheduledMealsPayload & UpdateScheduledMealPayload & SetScheduledMealsToResolvePayload>
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
      console.log('UPDATE_SCHEDULED_MEAL');
      console.log(action.payload.id);
      console.log(action.payload.scheduledMeal.sideId);
      const updatedDishes = newState.scheduledMeals.map((scheduledMeal) => (scheduledMeal.id === action.payload.id ? action.payload.scheduledMeal : scheduledMeal));
      newState.scheduledMeals = updatedDishes;
      return newState;
    }
    case CLEAR_SCHEDULED_MEALS: {
      // TEDTODO - use spread operator to do this properly
      const newState = cloneDeep(state) as ScheduledMealsState;
      newState.scheduledMeals = [];
      return newState;
    }
    case SET_SCHEDULED_MEALS_TO_RESOLVE: {
      const newState = cloneDeep(state) as ScheduledMealsState;
      newState.scheduledMealsToResolve = cloneDeep(action.payload.scheduledMealsToResolve);
      return newState;
    }
    case CLEAR_SCHEDULED_MEALS_TO_RESOLVE: {
      // TEDTODO - use spread operator to do this properly
      const newState = cloneDeep(state) as ScheduledMealsState;
      newState.scheduledMealsToResolve = [];
      return newState;
    }

    default:
      return state;
  }
};
