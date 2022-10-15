import { clone, cloneDeep } from 'lodash';
import { VerboseScheduledMeal, ScheduledMealEntity, ScheduledMealsState, PendingMealState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_PENDING_MEAL = 'SET_PENDING_MEAL';
const CLEAR_PENDING_MEAL = 'CLEAR_PENDING_MEAL';

// ------------------------------------
// Actions
// ------------------------------------

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

export const clearPendingMeal = (): any => {
  return {
    type: CLEAR_PENDING_MEAL,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: PendingMealState =
{
  pendingMeal: null,
};

export const pendingMealStateReducer = (
  state: PendingMealState = initialState,
  action: MealWheelModelBaseAction<SetPendingMealPayload>
): PendingMealState => {
  switch (action.type) {
    case SET_PENDING_MEAL: {
      return { ...state, pendingMeal: cloneDeep(action.payload.pendingMeal) };
    }
    case CLEAR_PENDING_MEAL: {
      return { ...state, pendingMeal: null };
    }
    default:
      return state;
  }
};
