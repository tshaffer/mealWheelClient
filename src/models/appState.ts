import { AppState, UiState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_APP_INITIALIZED = 'SET_APP_INITIALIZED';
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_USER_ID = 'SET_USER_ID';

// ------------------------------------
// Actions
// ------------------------------------

export const setAppInitialized = (): any => {
  return {
    type: SET_APP_INITIALIZED,
  };
};

export interface SetUiStatePayload {
  uiState: UiState;
}

export const setUiState = (
  uiState: UiState,
): any => {
  return {
    type: SET_UI_STATE,
    payload: {
      uiState,
    },
  };
};

export interface SetUserPayload {
  id: string;
}

export const setUser = (
  id: string,
): any => {
  return {
    type: SET_USER_ID,
    payload: {
      id,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  appInitialized: false,
  uiState: UiState.SelectUser,
  userId: null,
};

export const appStateReducer = (
  state: AppState = initialState,
  action: MealWheelModelBaseAction<SetUiStatePayload & SetUserPayload>
): AppState => {
  switch (action.type) {
    case SET_APP_INITIALIZED: {
      return { ...state, appInitialized: true };
    }
    case SET_UI_STATE: {
      return { ...state, uiState: action.payload.uiState };
    }
    case SET_USER_ID: {
      return { ...state, userId: action.payload.id };
    }
    default:
      return state;
  }
};
