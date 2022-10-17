import { cloneDeep } from 'lodash';
import { VerboseScheduledMeal, MealsResolutionState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_PENDING_MEAL = 'SET_PENDING_MEAL';
const SET_MEAL_INDEX = 'SET_MEAL_INDEX';
const SET_MEALS_TO_RESOLVE = 'SET_MEALS_TO_RESOLVE';
const REMOVE_MEAL_TO_RESOLVE = 'REMOVE_MEAL_TO_RESOLVE';
const SET_MEAL_INDEX_AND_PENDING_MEAL = 'SET_MEAL_INDEX_AND_PENDING_MEAL';
const CLEAR_MEALS_TO_RESOLVE = 'CLEAR_MEALS_TO_RESOLVE';

// ------------------------------------
// Actions
// ------------------------------------

export const clearMealsToResolve = (): any => {
  return {
    type: CLEAR_MEALS_TO_RESOLVE,
  };
};


export interface SetMealIndexAndPendingMealPayload {
  mealIndex: number;
  pendingMeal: VerboseScheduledMeal;
}

export const setMealIndexAndPendingMeal = (
  mealIndex: number,
  pendingMeal: VerboseScheduledMeal): any => {
  return {
    type: SET_MEAL_INDEX_AND_PENDING_MEAL,
    payload: {
      mealIndex,
      pendingMeal,
    }
  };
};


export interface SetPendingMealPayload {
  pendingMeal: VerboseScheduledMeal;
}

export const setPendingMeal = (
  pendingMeal: VerboseScheduledMeal): any => {
  return {
    type: SET_PENDING_MEAL,
    payload: {
      pendingMeal,
    }
  };
};

export interface SetMealIndexPayload {
  mealIndex: number;
}

export const setMealIndex = (
  mealIndex: number): any => {
  return {
    type: SET_MEAL_INDEX,
    payload: {
      mealIndex,
    }
  };
};

export interface SetMealsToResolvePayload {
  mealsToResolve: VerboseScheduledMeal[];
}

export const setMealsToResolve = (
  mealsToResolve: VerboseScheduledMeal[]): any => {
  return {
    type: SET_MEALS_TO_RESOLVE,
    payload: {
      mealsToResolve,
    }
  };
};

export interface RemoveMealToResolvePayload {
  mealId: string;
}

export const removeMealToResolve = (
  mealId: string): any => {
  return {
    type: REMOVE_MEAL_TO_RESOLVE,
    payload: {
      mealId,
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MealsResolutionState =
{
  pendingMeal: null,
  mealIndex: 0,
  mealsToResolve: []
};

export const mealsResolutionStateReducer = (
  state: MealsResolutionState = initialState,
  action: MealWheelModelBaseAction<SetMealIndexAndPendingMealPayload & SetPendingMealPayload & SetMealIndexPayload & SetMealsToResolvePayload & RemoveMealToResolvePayload>
): MealsResolutionState => {
  switch (action.type) {
    case CLEAR_MEALS_TO_RESOLVE:
      return {
        ...state,
        mealsToResolve: [],
      };
    case SET_MEAL_INDEX_AND_PENDING_MEAL:
      return {
        ...state,
        pendingMeal: cloneDeep(action.payload.pendingMeal),
        mealIndex: action.payload.mealIndex
      };
    case SET_PENDING_MEAL: {
      return { ...state, pendingMeal: cloneDeep(action.payload.pendingMeal) };
    }
    case SET_MEAL_INDEX: {
      return { ...state, mealIndex: action.payload.mealIndex };
    }
    case SET_MEALS_TO_RESOLVE: {
      return { ...state, mealsToResolve: cloneDeep(action.payload.mealsToResolve) };
    }
    case REMOVE_MEAL_TO_RESOLVE: {
      const newState = cloneDeep(state);
      const idOfMealToRemove = action.payload.mealId;
      // TEDTODO - find library way to find array index given id (?lodash)
      let indexOfMealToRemove = -1;
      for (const mealToRemove of newState.mealsToResolve) {
        indexOfMealToRemove++;
        if (mealToRemove.id === idOfMealToRemove) {
          newState.mealsToResolve.splice(indexOfMealToRemove, 1);
          return newState;
        }
      }
      return state;
    }
    default:
      return state;
  }
};
