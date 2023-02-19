import { MealWheelTonightUIState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_DINNER_TIME = 'SET_DINNER_TIME';
const SET_PREP_EFFORT = 'SET_PREP_EFFORT';
const SET_CLEANUP_EFFORT = 'SET_CLEANUP_EFFORT';

// ------------------------------------
// Actions
// ------------------------------------

interface SetDinnerTimePayload {
  dinnerTime: string;
}

export const setDinnerTime = (
  dinnerTime: string): any => {
  return {
    type: SET_DINNER_TIME,
    payload: {
      dinnerTime,
    }
  };
};

export interface SetPrepEffort {
  prepEffort: number;
}

export const setPrepEffort = (
  prepEffort: number): any => {
  return {
    type: SET_PREP_EFFORT,
    payload: {
      prepEffort,
    }
  };
};

export interface SetCleanupEffortPayload {
  cleanupEffort: number;
}

export const setCleanupEffort = (
  cleanupEffort: number): any => {
  return {
    type: SET_CLEANUP_EFFORT,
    payload: {
      cleanupEffort,
    }
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MealWheelTonightUIState =
{
  dinnerTime: (new Date()).toDateString(),
  prepEffort: 5,
  cleanupEffort: 5,
};

export const mealWheelTonightUIStateReducer = (
  state: MealWheelTonightUIState = initialState,
  action: MealWheelModelBaseAction<SetDinnerTimePayload & SetPrepEffort & SetCleanupEffortPayload>
): MealWheelTonightUIState => {
  switch (action.type) {
    case SET_DINNER_TIME:
      return {
        ...state,
        dinnerTime: action.payload.dinnerTime,
      };
    case SET_PREP_EFFORT:
      return {
        ...state,
        prepEffort: action.payload.prepEffort,
      };
    case SET_CLEANUP_EFFORT:
      return {
        ...state,
        cleanupEffort: action.payload.cleanupEffort
      };
    default:
      return state;
  }
};
