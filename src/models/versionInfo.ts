import { VersionInfo } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CLIENT_VERSION = 'SET_CLIENT_VERSION';
export const SET_SERVER_VERSION = 'SET_SERVER_VERSION';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetClientVersionPayload {
  clientVersion: string;
}

export const setClientVersion = (
  clientVersion: string,
): any => {
  return {
    type: SET_CLIENT_VERSION,
    payload: {
      clientVersion,
    },
  };
};

export interface SetServerVersionPayload {
  serverVersion: string;
}

export const setServerVersion = (
  serverVersion: string,
): any => {
  return {
    type: SET_SERVER_VERSION,
    payload: {
      serverVersion,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: VersionInfo = {
  clientVersion: '',
  serverVersion: '',
};

export const versionInfoReducer = (
  state: VersionInfo = initialState,
  action: MealWheelModelBaseAction<SetClientVersionPayload & SetServerVersionPayload>
): VersionInfo => {
  switch (action.type) {
    case SET_CLIENT_VERSION: {
      return { ...state, clientVersion: action.payload.clientVersion };
    }
    case SET_SERVER_VERSION: {
      return { ...state, serverVersion: action.payload.serverVersion };
    }
    default:
      return state;
  }
};
