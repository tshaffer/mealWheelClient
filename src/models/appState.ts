import { AppState, UiState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_APP_INITIALIZED = 'SET_APP_INITIALIZED';
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_USER_NAME = 'SET_USER_NAME';

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

export interface SetUserNamePayload {
  userName: string;
}

export const setUserName = (
  userName: string,
): any => {
  return {
    type: SET_USER_NAME,
    payload: {
      userName,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  appInitialized: false,
  uiState: UiState.SelectUser,
  userName: null,
};

export const appStateReducer = (
  state: AppState = initialState,
  action: MealWheelModelBaseAction<SetUiStatePayload & SetUserNamePayload>
): AppState => {
  switch (action.type) {
    case SET_APP_INITIALIZED: {
      return { ...state, appInitialized: true};
    }
    case SET_UI_STATE: {
      return { ...state, uiState: action.payload.uiState };
    }
    case SET_USER_NAME: {
      return { ...state, userName: action.payload.userName };
    }
    default:
      return state;
  }
};
