import { cloneDeep } from 'lodash';

import { AppState } from '../types';
import { TedModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_PLACEHOLDER = 'SET_PLACEHOLDER';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetPlaceholder {
  placeholder: string;
}

export const setPlaceholder = (
  placeholder: string,
): any => {
  return {
    type: SET_PLACEHOLDER,
    payload: {
      placeholder
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  placeholder: '',
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TedModelBaseAction<SetPlaceholder>
): AppState => {
  switch (action.type) {
    case SET_PLACEHOLDER: {
      return { ...state, placeholder: action.payload.placeholder };
    }
    default:
      return state;
  }
};
